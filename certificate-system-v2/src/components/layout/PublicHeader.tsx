import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-6 py-3.5 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="https://atideto.in" target="_blank" rel="noreferrer" className="flex items-center gap-2.5">
            <img src="/assets/atideto-logo.png" alt="ATIDETO Technologies" className="h-8 object-contain" />
            <span className="font-extrabold text-slate-900 text-sm hidden sm:inline">ATIDETO Technologies</span>
          </a>
          <span className="h-4 w-[1px] bg-slate-300 hidden sm:inline" />
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Verification Portal
          </span>
        </div>

        <a
          href="https://atideto.in"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>Visit ATIDETO.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};
