import React from 'react';
import { X, Building2, Save } from 'lucide-react';
import { CompanyTemplateSettings } from '../../types/certificate';

interface CompanyTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CompanyTemplateSettings;
  onChange: (settings: CompanyTemplateSettings) => void;
}

export const CompanyTemplateModal: React.FC<CompanyTemplateModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#2F2FE4]/10 text-[#2F2FE4] border border-[#2F2FE4]/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Certificate Static Wording & Template Studio</h3>
              <p className="text-xs text-slate-500">Edit every static sentence, paragraph, label and identifier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Header & Title Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2F2FE4]">1. Certificate Title & Eyebrow</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Eyebrow Text</label>
                <input
                  type="text"
                  value={settings.eyebrow}
                  onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:border-[#2F2FE4]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Main Certificate Title</label>
                <input
                  type="text"
                  value={settings.mainTitle}
                  onChange={(e) => onChange({ ...settings, mainTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold focus:border-[#2F2FE4]"
                />
              </div>
            </div>
          </div>

          {/* Description Paragraph Wording */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2F2FE4]">2. Description Paragraph Wording</h4>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Paragraph 1 Text</label>
              <textarea
                rows={3}
                value={settings.descriptionParagraph1}
                onChange={(e) => onChange({ ...settings, descriptionParagraph1: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white font-normal text-xs leading-relaxed focus:border-[#2F2FE4]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Paragraph 2 Lead-in</label>
                <input
                  type="text"
                  value={settings.descriptionParagraph2Prefix}
                  onChange={(e) => onChange({ ...settings, descriptionParagraph2Prefix: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-[#2F2FE4]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Paragraph 2 Mid Text</label>
                <input
                  type="text"
                  value={settings.descriptionParagraph2Mid}
                  onChange={(e) => onChange({ ...settings, descriptionParagraph2Mid: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-[#2F2FE4]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Domain Prefix Label</label>
                <input
                  type="text"
                  value={settings.domainPrefix}
                  onChange={(e) => onChange({ ...settings, domainPrefix: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-[#2F2FE4]"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Paragraph 2 Closing Suffix</label>
              <textarea
                rows={2}
                value={settings.descriptionParagraph2Suffix}
                onChange={(e) => onChange({ ...settings, descriptionParagraph2Suffix: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white font-normal text-xs focus:border-[#2F2FE4]"
              />
            </div>
          </div>

          {/* Labels & Footer Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2F2FE4]">3. Identifiers, Labels & Footer</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Duration Label</label>
                <input
                  type="text"
                  value={settings.durationLabel}
                  onChange={(e) => onChange({ ...settings, durationLabel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Date Label</label>
                <input
                  type="text"
                  value={settings.issueDateLabel}
                  onChange={(e) => onChange({ ...settings, issueDateLabel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Verify ID Label</label>
                <input
                  type="text"
                  value={settings.verifyIdLabel}
                  onChange={(e) => onChange({ ...settings, verifyIdLabel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">QR Subcaption</label>
                <input
                  type="text"
                  value={settings.qrCaption}
                  onChange={(e) => onChange({ ...settings, qrCaption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">MSME / UDYAM Number</label>
                <input
                  type="text"
                  value={settings.udyamId}
                  onChange={(e) => onChange({ ...settings, udyamId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Founder Designation</label>
                <input
                  type="text"
                  value={settings.founderDesignation}
                  onChange={(e) => onChange({ ...settings, founderDesignation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => onChange({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => onChange({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                <input
                  type="text"
                  value={settings.website}
                  onChange={(e) => onChange({ ...settings, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Wording Template
          </button>
        </div>
      </div>
    </div>
  );
};
