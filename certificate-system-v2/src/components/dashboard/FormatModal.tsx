import React from 'react';
import { X, FileImage, FileText, Archive, Layers } from 'lucide-react';

export type ExportFormat = 'png' | 'pdf' | 'zip' | 'combinedPdf';

interface FormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  onSelectFormat: (format: ExportFormat) => void;
}

export const FormatModal: React.FC<FormatModalProps> = ({ isOpen, onClose, count, onSelectFormat }) => {
  if (!isOpen) return null;

  const isBulk = count > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Select Export Format</h3>
            <p className="text-xs text-slate-500">Generating for {count} student{isBulk ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          <button
            onClick={() => {
              onClose();
              onSelectFormat('png');
            }}
            className="w-full p-4 rounded-2xl border border-slate-200 hover:border-[#2F2FE4] hover:bg-[#2F2FE4]/5 text-left transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2F2FE4] flex items-center justify-center shrink-0 border border-blue-100">
              <FileImage className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 group-hover:text-[#2F2FE4]">High-DPI PNG Image</p>
              <p className="text-xs text-slate-500">Crisp 300+ DPI image format for web & email</p>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectFormat('pdf');
            }}
            className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-left transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600">Landscape A4 PDF</p>
              <p className="text-xs text-slate-500">Official printable document PDF format</p>
            </div>
          </button>

          {isBulk && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onSelectFormat('zip');
                }}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-amber-600 hover:bg-amber-50 text-left transition-all flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600">Bulk ZIP Archive (.zip)</p>
                  <p className="text-xs text-slate-500">All certificates bundled in a single ZIP file</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectFormat('combinedPdf');
                }}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:bg-purple-50 text-left transition-all flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900 group-hover:text-purple-600">Combined Multi-Page PDF</p>
                  <p className="text-xs text-slate-500">Single PDF document containing all pages</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
