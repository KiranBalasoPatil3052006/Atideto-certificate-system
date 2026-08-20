import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OfferLetterCanvas, OfferLetterData, OfferLetterTemplate, DEFAULT_OFFER_TEMPLATE } from '../components/certificate/OfferLetterCanvas';
import { ApplicationRecord } from '../types/application';
import { listApplications } from '../lib/api';
import { exportElementAsPng, exportOfferLetterAsPdf } from '../lib/exportEngine';
import { formatISODate } from '../lib/dateUtils';
import { AdminNav } from '../components/layout/AdminNav';
import { Download, Edit3, RotateCcw, Check, FileText } from 'lucide-react';

const STORAGE_KEY = 'atideto_offer_letter_template_v2';

const DEFAULT_OFFER_DATA: OfferLetterData = {
  offerNo: 'ATIDETO/2026/INT/018',
  offerDate: formatISODate(new Date()),
  salutation: 'Mr./Ms.',
  studentName: 'Vishnu R',
  collegeName: 'XYZ College of Engineering',
  studentEmail: 'vishnu.r@example.com',
  studentMobile: '+91 98765 43210',
  domain: 'Artificial Intelligence',
  duration: '2 Months',
  startDate: '2026-06-01',
  endDate: '2026-07-31',
  mode: 'Online',
};

export const OfferLetterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialAppId = searchParams.get('applicationId') || searchParams.get('studentId') || '';

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialAppId);
  const [formData, setFormData] = useState<OfferLetterData>(DEFAULT_OFFER_DATA);
  const [template, setTemplate] = useState<OfferLetterTemplate>(DEFAULT_OFFER_TEMPLATE);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Load template wording from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTemplate(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveTemplateState = (newTpl: OfferLetterTemplate) => {
    setTemplate(newTpl);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTpl));
    } catch {
      // ignore
    }
  };

  const resetTemplateState = () => {
    if (window.confirm('Reset offer letter wording to original default text? Student details will not be affected.')) {
      setTemplate(DEFAULT_OFFER_TEMPLATE);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  // Fetch applications
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

  const handleStudentSelect = (appId: string) => {
    setSelectedStudentId(appId);
    if (!appId) return;

    const student = applications.find((a) => a.applicationId === appId || a.id === appId);
    if (!student) return;

    const seqNo = String(student.applicationId || '018').slice(-3).padStart(3, '0');

    setFormData((prev) => ({
      ...prev,
      offerNo: `ATIDETO/2026/INT/${seqNo}`,
      offerDate: formatISODate(new Date()),
      studentName: student.fullName || prev.studentName,
      collegeName: student.college || prev.collegeName,
      studentEmail: student.email || prev.studentEmail,
      studentMobile: student.phone || prev.studentMobile,
      domain: student.programTitle || student.selectedCourse || prev.domain,
      duration: student.durationDays ? `${student.durationDays} Days` : prev.duration,
      startDate: formatISODate(student.startDate) || prev.startDate,
      endDate: formatISODate(student.endDate) || prev.endDate,
      mode: 'Online',
    }));
  };

  useEffect(() => {
    if (initialAppId && applications.length > 0) {
      handleStudentSelect(initialAppId);
    }
  }, [initialAppId, applications]);

  const handleExportPng = async () => {
    const el = document.getElementById('offerLetterCanvas');
    if (!el) return;
    setIsExporting(true);
    try {
      await exportElementAsPng(
        el,
        `ATIDETO_Offer_Letter_${formData.studentName.trim().replace(/\s+/g, '_')}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    const el = document.getElementById('offerLetterCanvas');
    if (!el) return;
    setIsExporting(true);
    try {
      await exportOfferLetterAsPdf(
        el,
        `ATIDETO_Offer_Letter_${formData.studentName.trim().replace(/\s+/g, '_')}`
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
        {/* Left Sidebar: Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Offer Letter Studio</h2>
              <p className="text-xs text-slate-500">Live customization & document editor</p>
            </div>
            <span className="p-1.5 rounded-lg bg-[#2F2FE4]/10 text-[#2F2FE4]">
              <FileText className="w-4 h-4" />
            </span>
          </div>

          {/* Mode Switcher: Student Mode vs Template Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              1. Choose Editing Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setIsEditingTemplate(false)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  !isEditingTemplate ? 'bg-white text-[#2F2FE4] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Data
              </button>
              <button
                onClick={() => setIsEditingTemplate(true)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  isEditingTemplate ? 'bg-[#2F2FE4] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Template Wording
              </button>
            </div>
          </div>

          {!isEditingTemplate ? (
            /* Student Data Inputs */
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Select Registered Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#2F2FE4] text-xs font-semibold bg-slate-50"
                >
                  <option value="">— Select Student Application —</option>
                  {applications.map((app) => (
                    <option key={app.applicationId || app.id} value={app.applicationId}>
                      {app.fullName} ({app.selectedCourse || app.programTitle}) - {app.applicationId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Offer Letter No.</span>
                  <input
                    type="text"
                    value={formData.offerNo}
                    onChange={(e) => setFormData({ ...formData, offerNo: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Offer Date</span>
                  <input
                    type="date"
                    value={formData.offerDate}
                    onChange={(e) => setFormData({ ...formData, offerDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Salutation</span>
                  <select
                    value={formData.salutation}
                    onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                  >
                    <option value="Mr./Ms.">Mr./Ms.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Student Name</span>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">College Name</span>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Email</span>
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Phone</span>
                  <input
                    type="text"
                    value={formData.studentMobile}
                    onChange={(e) => setFormData({ ...formData, studentMobile: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Internship Domain</span>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Duration</span>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Start Date</span>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">End Date</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-[11px] text-slate-900 focus:border-[#2F2FE4] focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Mode</span>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-[11px] font-semibold"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Template Wording Mode Info */
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-3">
              <div className="font-bold flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#2F2FE4]" /> Direct Canvas Editing Active
              </div>
              <p className="text-[11px] leading-relaxed">
                Click any highlighted paragraph or heading on the right offer letter canvas to edit the document text
                directly. Your edits are saved automatically in browser storage.
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                <button
                  onClick={() => setIsEditingTemplate(false)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#2F2FE4] text-white font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Finish Editing
                </button>
                <button
                  onClick={resetTemplateState}
                  className="py-2 px-3 rounded-lg border border-blue-300 bg-white hover:bg-slate-50 text-blue-800 font-semibold text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
          )}

          {/* Export Actions */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={handleExportPng}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>

        {/* Right Main Viewport: Live Offer Letter Canvas */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
            <span>Offer Letter Canvas</span>
            {isEditingTemplate && (
              <span className="text-xs font-bold text-[#2F2FE4] bg-[#2F2FE4]/10 px-2.5 py-0.5 rounded-full border border-[#2F2FE4]/20 animate-pulse">
                ✎ Click text on document to edit wording
              </span>
            )}
          </div>

          <OfferLetterCanvas
            data={formData}
            template={template}
            isEditingTemplate={isEditingTemplate}
            onTemplateChange={saveTemplateState}
          />
        </div>
      </div>
    </div>
  );
};
