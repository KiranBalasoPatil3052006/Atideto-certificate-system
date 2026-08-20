import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Type, Palette } from 'lucide-react';
import { TypographySettings } from '../../types/certificate';
import { loadGoogleFont } from '../../lib/fontLoader';

interface TypographyStudioProps {
  isOpen: boolean;
  onClose: () => void;
  typography: TypographySettings;
  onChange: (settings: TypographySettings) => void;
  onReset: () => void;
}

const FONT_OPTIONS = [
  { name: 'Cormorant Garamond', category: 'Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Cinzel', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Great Vibes', category: 'Script & Calligraphy' },
  { name: 'Tangerine', category: 'Script & Calligraphy' },
  { name: 'Alex Brush', category: 'Script & Calligraphy' },
  { name: 'Sacramento', category: 'Script & Calligraphy' },
  { name: 'Caveat', category: 'Script & Calligraphy' },
  { name: 'Inter', category: 'Sans-Serif' },
  { name: 'Montserrat', category: 'Sans-Serif' },
  { name: 'JetBrains Mono', category: 'Monospace' },
];

const PRESET_SWATCHES = [
  '#0b1d3a', '#0a192f', '#2F2FE4', '#1E40AF', '#059669',
  '#B45309', '#DC2626', '#4C1D95', '#0F172A', '#64748B'
];

const PRESET_THEMES = [
  {
    name: 'Classic Gold',
    settings: {
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
    },
  },
  {
    name: 'Calligraphy Script',
    settings: {
      studentNameFont: 'Great Vibes',
      studentNameSize: 50,
      studentNameColor: '#1E40AF',
      studentNameItalic: false,
      studentNameWeight: '400',
      titleFont: 'Playfair Display',
      titleColor: '#0F172A',
      domainColor: '#2F2FE4',
      descriptionFont: 'Inter',
      metaFont: 'Inter',
      letterSpacing: 1,
    },
  },
  {
    name: 'Modern Minimalist',
    settings: {
      studentNameFont: 'Inter',
      studentNameSize: 34,
      studentNameColor: '#0F172A',
      studentNameItalic: false,
      studentNameWeight: '700',
      titleFont: 'Montserrat',
      titleColor: '#1E293B',
      domainColor: '#2563EB',
      descriptionFont: 'Inter',
      metaFont: 'Inter',
      letterSpacing: 0.5,
    },
  },
  {
    name: 'Vintage Elegance',
    settings: {
      studentNameFont: 'Alex Brush',
      studentNameSize: 46,
      studentNameColor: '#78350F',
      studentNameItalic: false,
      studentNameWeight: '400',
      titleFont: 'Cinzel',
      titleColor: '#451A03',
      domainColor: '#B45309',
      descriptionFont: 'Lora',
      metaFont: 'Lora',
      letterSpacing: 0,
    },
  },
  {
    name: 'Tech Monospace',
    settings: {
      studentNameFont: 'JetBrains Mono',
      studentNameSize: 32,
      studentNameColor: '#0F172A',
      studentNameItalic: false,
      studentNameWeight: '700',
      titleFont: 'Montserrat',
      titleColor: '#0284C7',
      domainColor: '#0284C7',
      descriptionFont: 'Inter',
      metaFont: 'JetBrains Mono',
      letterSpacing: 0,
    },
  },
];

export const TypographyStudio: React.FC<TypographyStudioProps> = ({
  isOpen,
  onClose,
  typography,
  onChange,
  onReset,
}) => {
  const [activeElement, setActiveElement] = useState<'studentName' | 'title' | 'domain'>('studentName');

  if (!isOpen) return null;

  const handleFontSelect = (font: string) => {
    loadGoogleFont(font);
    if (activeElement === 'studentName') {
      onChange({ ...typography, studentNameFont: font });
    } else if (activeElement === 'title') {
      onChange({ ...typography, titleFont: font });
    }
  };

  const handleColorSelect = (color: string) => {
    if (activeElement === 'studentName') {
      onChange({ ...typography, studentNameColor: color });
    } else if (activeElement === 'title') {
      onChange({ ...typography, titleColor: color });
    } else if (activeElement === 'domain') {
      onChange({ ...typography, domainColor: color });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#2F2FE4]/10 text-[#2F2FE4]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Typography Studio</h3>
              <p className="text-xs text-slate-500">Customize fonts, colors, styling and preset themes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Preset Themes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              1-Click Style Themes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    loadGoogleFont(theme.settings.studentNameFont);
                    loadGoogleFont(theme.settings.titleFont);
                    onChange(theme.settings);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#2F2FE4] hover:bg-[#2F2FE4]/5 text-left transition-all group"
                >
                  <p className="font-semibold text-xs text-slate-800 group-hover:text-[#2F2FE4]">{theme.name}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{theme.settings.studentNameFont}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Element Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Choose Element to Edit
            </label>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setActiveElement('studentName')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeElement === 'studentName'
                    ? 'bg-white text-[#2F2FE4] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Name
              </button>
              <button
                onClick={() => setActiveElement('title')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeElement === 'title'
                    ? 'bg-white text-[#2F2FE4] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Main Title
              </button>
              <button
                onClick={() => setActiveElement('domain')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeElement === 'domain'
                    ? 'bg-white text-[#2F2FE4] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Domain Accent
              </button>
            </div>
          </div>

          {/* Font Picker (For Student Name & Title) */}
          {activeElement !== 'domain' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#2F2FE4]" />
                  Font Family
                </label>
                <span className="text-xs font-semibold text-[#2F2FE4]">
                  {activeElement === 'studentName' ? typography.studentNameFont : typography.titleFont}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FONT_OPTIONS.map((f) => {
                  const isSelected =
                    (activeElement === 'studentName' && typography.studentNameFont === f.name) ||
                    (activeElement === 'title' && typography.titleFont === f.name);
                  return (
                    <button
                      key={f.name}
                      onClick={() => handleFontSelect(f.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#2F2FE4] bg-[#2F2FE4]/10 text-[#2F2FE4] font-bold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="text-sm block truncate" style={{ fontFamily: f.name }}>
                        {f.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{f.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Font Controls (Size, Style, Weight for Student Name) */}
          {activeElement === 'studentName' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              {/* Size */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Font Size ({typography.studentNameSize}px)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChange({ ...typography, studentNameSize: Math.max(24, typography.studentNameSize - 2) })}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={24}
                    max={64}
                    value={typography.studentNameSize}
                    onChange={(e) => onChange({ ...typography, studentNameSize: Number(e.target.value) })}
                    className="flex-1"
                  />
                  <button
                    onClick={() => onChange({ ...typography, studentNameSize: Math.min(64, typography.studentNameSize + 2) })}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Italic */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Font Style</label>
                <button
                  onClick={() => onChange({ ...typography, studentNameItalic: !typography.studentNameItalic })}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                    typography.studentNameItalic
                      ? 'bg-[#2F2FE4] text-white border-[#2F2FE4]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {typography.studentNameItalic ? 'Italic Active' : 'Normal Text'}
                </button>
              </div>

              {/* Letter Spacing */}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Tracking ({typography.letterSpacing}px)</label>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={0.5}
                  value={typography.letterSpacing}
                  onChange={(e) => onChange({ ...typography, letterSpacing: Number(e.target.value) })}
                  className="w-full mt-2"
                />
              </div>
            </div>
          )}

          {/* Color Swatches */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#2F2FE4]" />
                Color Palette
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {PRESET_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  onClick={() => handleColorSelect(swatch)}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 active:scale-95 focus:ring-2 focus:ring-[#2F2FE4]"
                  style={{ backgroundColor: swatch }}
                />
              ))}
              <div className="flex items-center gap-1.5 ml-2 border border-slate-300 rounded-lg px-2 py-1 bg-white">
                <span className="text-xs text-slate-500 font-mono">Custom:</span>
                <input
                  type="color"
                  value={
                    activeElement === 'studentName'
                      ? typography.studentNameColor
                      : activeElement === 'title'
                      ? typography.titleColor
                      : typography.domainColor
                  }
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-sm shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
