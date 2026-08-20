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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2F2FE4]/10 text-[#2F2FE4]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Certificate Wording & Company Template</h3>
              <p className="text-xs text-slate-500">Edit titles, designation, and official identifiers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={settings.eyebrow}
                onChange={(e) => onChange({ ...settings, eyebrow: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Main Title
              </label>
              <input
                type="text"
                value={settings.mainTitle}
                onChange={(e) => onChange({ ...settings, mainTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                MSME / UDYAM Number
              </label>
              <input
                type="text"
                value={settings.udyamId}
                onChange={(e) => onChange({ ...settings, udyamId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Founder Designation
              </label>
              <input
                type="text"
                value={settings.founderDesignation}
                onChange={(e) => onChange({ ...settings, founderDesignation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => onChange({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => onChange({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Website URL
              </label>
              <input
                type="text"
                value={settings.website}
                onChange={(e) => onChange({ ...settings, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#2F2FE4] focus:ring-1 focus:ring-[#2F2FE4] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-sm shadow-md transition-all"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
