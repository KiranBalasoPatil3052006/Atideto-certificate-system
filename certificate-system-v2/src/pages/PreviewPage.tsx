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
} from 'lucide-react';

const DEFAULT_FORM: CertificateFormData = {
  studentName: 'Arun Kumar',
  course: 'Web Development',
  college: 'Anna University',
  registerNo: '710022104001',
  startDate: '2026-06-01',
  endDate: '2026-07-31',
  duration: '2 Months',
  issueDate: '2026-08-01',
  verifyId: 'ATD-INT-2026-0001',
  qrLink: 'https://atideto.com/verify/ATD-INT-2026-0001',
};

const DEFAULT_TYPOGRAPHY: TypographySettings = {
  studentNameFont: 'Cormorant Garamond',
  studentNameSize: 44,
  studentNameColor: '#12539c',
  studentNameItalic: true,
  studentNameWeight: '600',
  titleFont: 'Playfair Display',
  titleColor: '#0b2545',
  domainColor: '#12539c',
  descriptionFont: 'Inter',
  metaFont: 'JetBrains Mono',
  letterSpacing: 1,
};

const DEFAULT_COMPANY_TEMPLATE: CompanyTemplateSettings = {
  eyebrow: 'THIS CERTIFIES THAT',
  mainTitle: 'Internship Completion Certificate',
  domainPrefix: 'Internship Domain',
  descriptionParagraph1:
    'This Certificate of Completion is proudly awarded in recognition of the successful completion of the internship program at ATIDETO. Throughout the internship, the intern demonstrated professionalism, dedication, and a strong commitment to learning while contributing to assigned responsibilities and project objectives.',
  descriptionParagraph2Prefix: 'The internship was successfully completed from',
  descriptionParagraph2Mid: 'by a student of',
  descriptionParagraph2Suffix:
    '. We appreciate the intern\'s contribution and wish them continued success in their future academic and professional endeavors.',
  durationLabel: 'Duration',
  issueDateLabel: 'Issue Date',
  verifyIdLabel: 'Verify ID',
  qrCaption: 'Scan to verify',
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      <AdminNav />

      {/* Main Studio Workspace: 2-Column Split matching preview.html */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[400px_1fr] h-[calc(100vh-62px)] overflow-hidden">
        {/* Left Panel: Editor & Form Controls */}
        <aside className="bg-white border-r border-[#E5E7EB] p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto h-full">
          <div className="pb-3 border-b border-[#E5E7EB]">
            <h1 className="text-[17px] font-bold text-[#0A2540] tracking-tight m-0">
              Certificate Generator
            </h1>
            <p className="text-[12.5px] text-[#6B7280] m-0 mt-1 leading-snug">
              Fill in the intern's details — the certificate updates live.
            </p>
          </div>

          <form className="flex flex-col gap-3.5" onSubmit={(e) => e.preventDefault()}>
            {/* Load from student record */}
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Load from Student Record
              </span>
              <select
                value={selectedStudentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-medium text-[#111827] bg-[#F7F8FA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-none transition-all"
              >
                <option value="">— Manual Entry —</option>
                {applications.map((app) => (
                  <option key={app.applicationId || app.id} value={app.applicationId}>
                    {app.fullName} ({app.selectedCourse || app.programTitle})
                  </option>
                ))}
              </select>
            </div>

            {/* Student Name */}
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Student Name
              </span>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Full name"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13.5px] font-medium text-[#111827] bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all"
              />
            </div>

            {/* College & Register Number */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  College Name
                </span>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Anna University"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13.5px] font-medium text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Register Number
                </span>
                <input
                  type="text"
                  value={formData.registerNo}
                  onChange={(e) => setFormData({ ...formData, registerNo: e.target.value })}
                  placeholder="e.g. 710022104001"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13.5px] font-mono text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Internship Domain */}
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Internship Domain
              </span>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. Web Development"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13.5px] font-medium text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none transition-all"
              />
            </div>

            {/* Start & End Dates */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Start Date
                </span>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  End Date
                </span>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            {/* Duration & Issue Date */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Duration
                </span>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 2 Months"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Issue Date
                </span>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[13px] text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            {/* Verify ID */}
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Verify ID
              </span>
              <input
                type="text"
                value={formData.verifyId}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    verifyId: val,
                    qrLink: `https://atideto.com/verify/${encodeURIComponent(val)}`,
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-mono text-[#111827] bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            {/* QR Link */}
            <div className="flex flex-col gap-1">
              <span className="text-[11.5px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Verification Link (for QR code)
              </span>
              <input
                type="text"
                value={formData.qrLink}
                onChange={(e) => setFormData({ ...formData, qrLink: e.target.value })}
                placeholder="https://atideto.com/verify/ID"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-[12.5px] font-mono text-[#6B7280] bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-3 border-t border-[#E5E7EB] mt-auto">
            <button
              type="button"
              onClick={handleGenerateBackend}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                'Generate via Backend'
              )}
            </button>

            <button
              type="button"
              onClick={handleExportPng}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] font-medium text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Download as PNG
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] font-medium text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Download as PDF
            </button>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`p-3 rounded-lg border text-xs space-y-1 mt-1 animate-fadeIn ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : feedback.type === 'info'
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {feedback.title}
                </div>
                <p className="text-[11px] leading-relaxed m-0">{feedback.message}</p>
                {feedback.verifyUrl && (
                  <a
                    href={feedback.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] text-decoration-none transition-all mt-1"
                  >
                    Open Student Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            <p className="text-[12px] text-[#9CA3AF] text-center m-0 mt-1 leading-snug">
              Generate official certificates via backend, or download PNG/PDF for quick use.
            </p>
          </div>
        </aside>

        {/* Right Panel: Live Certificate Preview matching preview.html */}
        <main className="bg-[#F9FAFB] p-6 lg:p-8 flex flex-col items-center justify-start overflow-y-auto gap-4">
          {/* Top Toolbar */}
          <div className="w-full max-w-[1050px] flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#111827] tracking-tight">
              Live Certificate Preview
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTemplateOpen(true)}
                className="px-3 py-1.5 rounded-md bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#6B7280] hover:text-[#111827] text-[13px] font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#6B7280]" /> Edit Company & Template
              </button>
              <button
                type="button"
                onClick={() => setIsTypoOpen(true)}
                className="px-3 py-1.5 rounded-md bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#6B7280] hover:text-[#111827] text-[13px] font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Design & Typography
              </button>
            </div>
          </div>

          {/* Certificate Viewport */}
          <CertificateCanvas
            data={formData}
            typography={typography}
            companyTemplate={companyTemplate}
          />
        </main>
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
