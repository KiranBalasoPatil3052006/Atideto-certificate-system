import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CertificateCanvas } from '../components/certificate/CertificateCanvas';
import { TypographyStudio } from '../components/certificate/TypographyStudio';
import { CompanyTemplateModal } from '../components/certificate/CompanyTemplateModal';
import { CertificateFormData, TypographySettings, CompanyTemplateSettings } from '../types/certificate';
import { ApplicationRecord } from '../types/application';
import { listApplications, listCertificates, generateCertificate } from '../lib/api';
import { exportElementAsPng, exportElementAsPdf } from '../lib/exportEngine';
import { formatISODate } from '../lib/dateUtils';
import { AdminNav } from '../components/layout/AdminNav';
import {
  Sparkles,
  Building2,
  Download,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';

const DEFAULT_FORM: CertificateFormData = {
  studentName: 'Vishnu R',
  course: 'Artificial Intelligence',
  college: 'XYZ College of Engineering',
  registerNo: '710022104018',
  startDate: '2026-06-01',
  endDate: '2026-07-31',
  duration: '2 Months',
  issueDate: formatISODate(new Date()),
  verifyId: 'ATI-CERT-2026-000001',
  qrLink: 'https://atideto-certificate-system.vercel.app/studentverify.html?id=ATI-CERT-2026-000001',
};

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  studentNameFont: 'Cormorant Garamond',
  studentNameSize: 42,
  studentNameColor: '#0b1d3a',
  studentNameItalic: true,
  studentNameWeight: '600',
  titleFont: 'Playfair Display',
  titleColor: '#0a192f',
  domainColor: '#2F2FE4',
  descriptionFont: 'Inter',
  metaFont: 'Inter',
  letterSpacing: 0,
};

const DEFAULT_COMPANY_TEMPLATE: CompanyTemplateSettings = {
  eyebrow: 'This certifies that',
  mainTitle: 'Internship Completion Certificate',
  domainPrefix: 'Internship Domain',
  descriptionParagraph1: '',
  descriptionParagraph2: '',
  founderDesignation: 'Founder, ATIDETO Technologies',
  companyName: 'ATIDETO Technologies',
  udyamId: 'UDYAM-TN-20-0242534',
  email: 'hello@atideto.com',
  phone: '+91 98765 43210',
  website: 'www.atideto.com',
};

export const PreviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialAppId = searchParams.get('applicationId') || searchParams.get('studentId') || '';

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialAppId);
  const [formData, setFormData] = useState<CertificateFormData>(DEFAULT_FORM);
  const [typography, setTypography] = useState<TypographySettings>(DEFAULT_TYPOGRAPHY);
  const [companyTemplate, setCompanyTemplate] = useState<CompanyTemplateSettings>(DEFAULT_COMPANY_TEMPLATE);

  const [isTypoOpen, setIsTypoOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
    verifyUrl?: string;
  } | null>(null);

  // Load registered applications
  useEffect(() => {
    async function loadData() {
      try {
        const res = await listApplications({ limit: 100 });
        setApplications(res.applications || []);
      } catch (err) {
        console.warn('Could not load applications:', err);
      }
    }
    loadData();
  }, []);

  // When student selection changes
  const handleStudentSelect = async (appId: string) => {
    setSelectedStudentId(appId);
    if (!appId) return;

    const student = applications.find((a) => a.applicationId === appId || a.id === appId);
    if (!student) return;

    let certId = student.certificateId || '';
    if (!certId) {
      try {
        const certRes = await listCertificates({ limit: 200 });
        const match = certRes.certificates.find((c) => c.applicationId === appId);
        if (match) certId = match.certificateId;
      } catch {
        // ignore
      }
    }

    const finalId = certId || `ATI-CERT-${new Date().getFullYear()}-000001`;
    const verifyLink = `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(finalId)}`;

    setFormData((prev) => ({
      ...prev,
      studentName: student.fullName || prev.studentName,
      course: student.programTitle || student.selectedCourse || prev.course,
      college: student.college || prev.college,
      registerNo: student.registerNo || prev.registerNo,
      startDate: formatISODate(student.startDate) || prev.startDate,
      endDate: formatISODate(student.endDate) || prev.endDate,
      duration: student.durationDays ? `${student.durationDays} Days` : prev.duration,
      issueDate: formatISODate(new Date()),
      verifyId: finalId,
      qrLink: verifyLink,
    }));
  };

  useEffect(() => {
    if (initialAppId && applications.length > 0) {
      handleStudentSelect(initialAppId);
    }
  }, [initialAppId, applications]);

  // Generate Certificate via Backend
  const handleGenerateBackend = async () => {
    if (!selectedStudentId) {
      setFeedback({
        type: 'info',
        title: 'Select a Student',
        message: 'Please choose a registered student from the dropdown first.',
      });
      return;
    }

    setIsGenerating(true);
    setFeedback(null);

    try {
      const cert = await generateCertificate(selectedStudentId);
      const certId = cert.certificateId;
      const verifyUrl = cert.verificationUrl || `/studentverify/${encodeURIComponent(certId)}`;
      const fullQrLink = `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(certId)}`;

      setFormData((prev) => ({
        ...prev,
        verifyId: certId,
        qrLink: fullQrLink,
      }));

      setFeedback({
        type: 'success',
        title: `✓ Certificate Generated: ${certId}`,
        message: 'Student officially verified in ATIDETO system. Opening verification portal...',
        verifyUrl,
      });

      window.open(verifyUrl, '_blank');
    } catch (err: any) {
      const match = err.message?.match(/\((ATI-CERT-[^)]+)\)/);
      if (match) {
        const existingId = match[1];
        const verifyUrl = `/studentverify/${encodeURIComponent(existingId)}`;
        const fullQrLink = `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(existingId)}`;

        setFormData((prev) => ({
          ...prev,
          verifyId: existingId,
          qrLink: fullQrLink,
        }));

        setFeedback({
          type: 'info',
          title: `ℹ Certificate Already Exists: ${existingId}`,
          message: 'Opening verified student record portal...',
          verifyUrl,
        });

        window.open(verifyUrl, '_blank');
      } else {
        setFeedback({
          type: 'error',
          title: 'Generation Failed',
          message: err.message || 'Unable to generate certificate',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPng = async () => {
    const el = document.getElementById('certificateCanvas');
    if (!el) return;
    setIsExporting(true);
    try {
      await exportElementAsPng(
        el,
        `ATIDETO_Certificate_${formData.studentName.trim().replace(/\s+/g, '_')}_${formData.verifyId}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    const el = document.getElementById('certificateCanvas');
    if (!el) return;
    setIsExporting(true);
    try {
      await exportElementAsPdf(
        el,
        `ATIDETO_Certificate_${formData.studentName.trim().replace(/\s+/g, '_')}_${formData.verifyId}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminNav />

      {/* Main Studio Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left Sidebar: Controls & Student Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Certificate Studio</h2>
              <p className="text-xs text-slate-500">Live customization & backend generator</p>
            </div>
            <span className="p-1.5 rounded-lg bg-[#2F2FE4]/10 text-[#2F2FE4]">
              <Zap className="w-4 h-4" />
            </span>
          </div>

          {/* Student Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              1. Load Registered Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-xs font-semibold bg-slate-50"
            >
              <option value="">— Select Student Application —</option>
              {applications.map((app) => (
                <option key={app.applicationId || app.id} value={app.applicationId}>
                  {app.fullName} ({app.selectedCourse || app.programTitle}) - {app.applicationId}
                </option>
              ))}
            </select>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              2. Student Certificate Details
            </label>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Student Name</span>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Internship Domain</span>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">College Name</span>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Register No.</span>
                <input
                  type="text"
                  value={formData.registerNo}
                  onChange={(e) => setFormData({ ...formData, registerNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Start Date</span>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">End Date</span>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Duration</span>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Issue Date</span>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Verify ID</span>
              <input
                type="text"
                value={formData.verifyId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    verifyId: e.target.value,
                    qrLink: `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(
                      e.target.value
                    )}`,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-[#2F2FE4] focus:border-[#2F2FE4] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Modals */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsTypoOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2F2FE4]" /> Typography
            </button>
            <button
              onClick={() => setIsTemplateOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-600" /> Template Info
            </button>
          </div>

          {/* Generate via Backend Button */}
          <button
            onClick={handleGenerateBackend}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-extrabold text-xs tracking-wide uppercase shadow-lg shadow-[#2F2FE4]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating Certificate...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" /> Generate via Backend API
              </>
            )}
          </button>

          {/* Feedback Card */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : feedback.type === 'info'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {feedback.title}
              </div>
              <p className="text-[11px] leading-relaxed">{feedback.message}</p>
              {feedback.verifyUrl && (
                <a
                  href={feedback.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] text-decoration-none transition-all mt-1"
                >
                  View Verified Student Portal <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Export Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleExportPng}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export PNG
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Right Main Viewport: Live Rendered Certificate */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
            <span>Live 1:1 Render Canvas</span>
            <span className="text-slate-400 font-mono text-[11px]">1344 x 896 Ratio</span>
          </div>

          <CertificateCanvas
            data={formData}
            typography={typography}
            companyTemplate={companyTemplate}
          />
        </div>
      </div>

      {/* Typography Studio Modal */}
      <TypographyStudio
        isOpen={isTypoOpen}
        onClose={() => setIsTypoOpen(false)}
        typography={typography}
        onChange={setTypography}
        onReset={() => setTypography(DEFAULT_TYPOGRAPHY)}
      />

      {/* Company Template Modal */}
      <CompanyTemplateModal
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        settings={companyTemplate}
        onChange={setCompanyTemplate}
      />
    </div>
  );
};
