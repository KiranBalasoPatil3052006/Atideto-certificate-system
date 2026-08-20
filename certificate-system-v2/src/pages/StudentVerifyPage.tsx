import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CertificateCanvas } from '../components/certificate/CertificateCanvas';
import { PublicHeader } from '../components/layout/PublicHeader';
import { CertificateRecord } from '../types/certificate';
import { verifyCertificatePublic } from '../lib/api';
import { exportElementAsPng, exportElementAsPdf } from '../lib/exportEngine';
import { formatDate } from '../lib/dateUtils';
import { ShieldCheck, ShieldX, Download, Search, Loader2, CheckCircle2, Award, Calendar, Building, User, Hash, Linkedin } from 'lucide-react';

function getLinkedInCertificationUrl(cert: CertificateRecord): string {
  const title = encodeURIComponent(`Internship Certificate - ${cert.course}`);
  const organizationName = encodeURIComponent('ATIDETO Technologies');
  const d = new Date(cert.issueDate || Date.now());
  const issueYear = Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  const issueMonth = Number.isNaN(d.getTime()) ? new Date().getMonth() + 1 : d.getMonth() + 1;
  const certUrl = encodeURIComponent(
    cert.verificationUrl || `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(cert.certificateId)}`
  );
  const certId = encodeURIComponent(cert.certificateId);

  return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${title}&organizationName=${organizationName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}&certId=${certId}`;
}

export const StudentVerifyPage: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const targetId = paramId || searchParams.get('id') || searchParams.get('certificateId') || '';

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(targetId);
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadVerification() {
      if (!targetId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const record = await verifyCertificatePublic(targetId);
        if (active) {
          setCert(record);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Certificate not found or invalid ID.');
          setCert(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadVerification();

    return () => {
      active = false;
    };
  }, [targetId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/studentverify/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleExportPng = async () => {
    const el = document.getElementById('verifiedStudentCertCanvas');
    if (!el || !cert) return;
    setIsExporting(true);
    try {
      await exportElementAsPng(
        el,
        `ATIDETO_Verified_Certificate_${(cert.studentName || 'student').replace(/\s+/g, '_')}_${cert.certificateId}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    const el = document.getElementById('verifiedStudentCertCanvas');
    if (!el || !cert) return;
    setIsExporting(true);
    try {
      await exportElementAsPdf(
        el,
        `ATIDETO_Verified_Certificate_${(cert.studentName || 'student').replace(/\s+/g, '_')}_${cert.certificateId}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const isRevoked = cert?.status === 'revoked';
  const isValid = cert && !isRevoked;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <PublicHeader />

      {/* Hero Section */}
      <div className="relative py-12 px-6 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] text-white">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest animate-pulseGlow">
            <ShieldCheck className="w-4 h-4" /> Official Credential Verification
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ATIDETO Student Verification Portal
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Verify authentic completion certificates, student records, and internship credentials issued by ATIDETO Technologies.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. ATI-CERT-2026-000001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-[#2F2FE4] rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              Verify
            </button>
          </form>
        </div>
      </div>

      {/* Body Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-8 my-4">
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#2F2FE4]" />
            <p className="text-sm font-semibold">Verifying certificate credential...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldX className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Certificate Not Found</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
          </div>
        )}

        {!loading && cert && (
          <div className="space-y-8 animate-fadeIn">
            {/* Status Hero Seal */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left ${
                isValid
                  ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-500/40 text-white shadow-emerald-950/20'
                  : 'bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-red-500/40 text-white shadow-red-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isValid
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-red-500/20 border-red-500/40 text-red-400'
                  }`}
                >
                  {isValid ? <ShieldCheck className="w-10 h-10" /> : <ShieldX className="w-10 h-10" />}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                        isValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {isValid ? '✓ OFFICIALLY VERIFIED STUDENT' : '✗ REVOKED CERTIFICATE'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Verified {cert.verifiedCount || 1} times
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {isValid ? 'Authentic Person & Certificate Credential' : 'Invalid or Revoked Credential'}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl">
                    {isValid
                      ? `This document certifies that ${cert.studentName} successfully completed the internship program at ATIDETO Technologies.`
                      : 'This certificate code is revoked and no longer represents an active valid credential.'}
                  </p>
                </div>
              </div>

              {/* Downloads & LinkedIn Share */}
              {isValid && (
                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={getLinkedInCertificationUrl(cert)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 text-decoration-none"
                  >
                    <Linkedin className="w-4 h-4 fill-white" /> Add to LinkedIn
                  </a>
                  <button
                    onClick={handleExportPng}
                    disabled={isExporting}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download PNG
                  </button>
                  <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </button>
                </div>
              )}
            </div>

            {/* Certificate Visual Canvas */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full flex items-center justify-between px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Official Visual Certificate</span>
                <span className="font-mono text-[#2F2FE4]">{cert.certificateId}</span>
              </div>
              <CertificateCanvas
                id="verifiedStudentCertCanvas"
                data={{
                  studentName: cert.studentName,
                  course: cert.course,
                  college: cert.college || '—',
                  registerNo: cert.registerNo || '',
                  startDate: cert.startDate || '',
                  endDate: cert.endDate || '',
                  duration: cert.duration || '—',
                  issueDate: cert.issueDate,
                  verifyId: cert.certificateId,
                  qrLink: cert.verificationUrl || `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(cert.certificateId)}`,
                }}
              />
            </div>

            {/* Student & Internship Breakdown Grid */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Verified Member & Internship Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#2F2FE4]" /> Verified Student Name
                  </span>
                  <p className="font-extrabold text-sm text-slate-900">{cert.studentName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-[#2F2FE4]" /> Certificate ID
                  </span>
                  <p className="font-mono font-bold text-sm text-[#2F2FE4]">{cert.certificateId}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#2F2FE4]" /> Domain / Program
                  </span>
                  <p className="font-bold text-sm text-slate-900">{cert.course}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#2F2FE4]" /> College / Institution
                  </span>
                  <p className="font-bold text-sm text-slate-900">{cert.college || '—'}</p>
                </div>

                {cert.registerNo && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-[#2F2FE4]" /> Register Number
                    </span>
                    <p className="font-mono font-bold text-sm text-slate-900">{cert.registerNo}</p>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Duration & Period
                  </span>
                  <p className="font-bold text-sm text-slate-900">
                    {formatDate(cert.startDate)} — {formatDate(cert.endDate)} ({cert.duration || '—'})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2F2FE4]" /> Issued Date
                  </span>
                  <p className="font-bold text-sm text-slate-900">{formatDate(cert.issueDate)}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verification Status
                  </span>
                  <p className={`font-bold text-sm ${isValid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isValid ? '✓ Officially Verified' : 'Revoked'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
