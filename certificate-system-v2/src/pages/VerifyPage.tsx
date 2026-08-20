import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { ShieldCheck, Search, Award } from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const [certId, setCertId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/studentverify/${encodeURIComponent(certId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#2F2FE4]/10 text-[#2F2FE4] flex items-center justify-center mx-auto border border-[#2F2FE4]/20 shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Authentic Credential Lookup
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Verify ATIDETO Certificate</h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              Enter the unique Certificate ID printed on your document or encoded in your QR code.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4 pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. ATI-CERT-2026-000001"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!certId.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-extrabold text-sm shadow-lg shadow-[#2F2FE4]/25 transition-all disabled:opacity-40 cursor-pointer"
            >
              Verify Certificate
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
