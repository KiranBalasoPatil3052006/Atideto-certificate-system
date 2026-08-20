import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Search, Check } from 'lucide-react';
import { TypographySettings, ElementStyle } from '../../types/certificate';
import { loadGoogleFont } from '../../lib/fontLoader';

interface TypographyStudioProps {
  isOpen: boolean;
  onClose: () => void;
  typography: TypographySettings;
  onChange: (settings: TypographySettings) => void;
  onReset: () => void;
}

export type TargetElemKey =
  | 'certName'
  | 'certTitle'
  | 'certEyebrow'
  | 'certDomain'
  | 'certDesc'
  | 'certSignatory'
  | 'certMeta';

const ELEMENT_TARGETS: { key: TargetElemKey; label: string }[] = [
  { key: 'certName', label: 'Student Name' },
  { key: 'certTitle', label: 'Certificate Title' },
  { key: 'certEyebrow', label: 'Eyebrow ("This certifies...")' },
  { key: 'certDomain', label: 'Domain Badge' },
  { key: 'certDesc', label: 'Description Text' },
  { key: 'certSignatory', label: 'Signatory Name' },
  { key: 'certMeta', label: 'IDs & Metadata' },
];

const GOOGLE_FONTS_CATALOG = [
  { name: 'Cormorant Garamond', category: 'Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Cinzel', category: 'Serif' },
  { name: 'Bodoni Moda', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Spectral', category: 'Serif' },
  { name: 'Prata', category: 'Serif' },
  { name: 'Great Vibes', category: 'Calligraphy & Script' },
  { name: 'Dancing Script', category: 'Calligraphy & Script' },
  { name: 'Alex Brush', category: 'Calligraphy & Script' },
  { name: 'Tangerine', category: 'Calligraphy & Script' },
  { name: 'Parisienne', category: 'Calligraphy & Script' },
  { name: 'Sacramento', category: 'Calligraphy & Script' },
  { name: 'Satisfy', category: 'Calligraphy & Script' },
  { name: 'Allura', category: 'Calligraphy & Script' },
  { name: 'Inter', category: 'Sans-Serif' },
  { name: 'Roboto', category: 'Sans-Serif' },
  { name: 'Montserrat', category: 'Sans-Serif' },
  { name: 'Poppins', category: 'Sans-Serif' },
  { name: 'Outfit', category: 'Sans-Serif' },
  { name: 'Raleway', category: 'Sans-Serif' },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif' },
  { name: 'JetBrains Mono', category: 'Monospace' },
];

const PRESET_SWATCHES = [
  { color: '#0b2545', label: 'Navy' },
  { color: '#12539c', label: 'Royal Blue' },
  { color: '#a8791f', label: 'Gold' },
  { color: '#0d5c3a', label: 'Emerald' },
  { color: '#6b1224', label: 'Burgundy' },
  { color: '#1b232e', label: 'Charcoal' },
  { color: '#000000', label: 'Black' },
];

const PRESET_THEMES: { name: string; tag: string; desc: string; apply: (curr: TypographySettings) => TypographySettings }[] = [
  {
    name: 'Classic Gold & Navy',
    tag: 'Royal',
    desc: 'Cormorant Garamond + Playfair Display + Gold accents',
    apply: (curr) => ({
      ...curr,
      studentNameFont: 'Cormorant Garamond',
      studentNameSize: 44,
      studentNameColor: '#12539c',
      studentNameItalic: true,
      studentNameWeight: '600',
      titleFont: 'Playfair Display',
      titleColor: '#0b2545',
      domainColor: '#12539c',
    }),
  },
  {
    name: 'Calligraphic Script',
    tag: 'Script',
    desc: 'Great Vibes Script + Bodoni Serif + Burgundy accents',
    apply: (curr) => ({
      ...curr,
      studentNameFont: 'Great Vibes',
      studentNameSize: 50,
      studentNameColor: '#6b1224',
      studentNameItalic: false,
      studentNameWeight: '400',
      titleFont: 'Bodoni Moda',
      titleColor: '#0b2545',
      domainColor: '#6b1224',
    }),
  },
  {
    name: 'Modern Minimalist',
    tag: 'Clean',
    desc: 'Montserrat + Inter + Emerald Green accents',
    apply: (curr) => ({
      ...curr,
      studentNameFont: 'Montserrat',
      studentNameSize: 34,
      studentNameColor: '#0d5c3a',
      studentNameItalic: false,
      studentNameWeight: '700',
      titleFont: 'Poppins',
      titleColor: '#0b2545',
      domainColor: '#0d5c3a',
    }),
  },
  {
    name: 'Vintage Elegance',
    tag: 'Regal',
    desc: 'Cinzel + Tangerine + Deep Gold',
    apply: (curr) => ({
      ...curr,
      studentNameFont: 'Tangerine',
      studentNameSize: 48,
      studentNameColor: '#a8791f',
      studentNameItalic: true,
      studentNameWeight: '700',
      titleFont: 'Cinzel',
      titleColor: '#0b2545',
      domainColor: '#a8791f',
    }),
  },
  {
    name: 'Tech Monospace',
    tag: 'Cyber',
    desc: 'JetBrains Mono + Outfit + Sapphire Blue',
    apply: (curr) => ({
      ...curr,
      studentNameFont: 'JetBrains Mono',
      studentNameSize: 32,
      studentNameColor: '#1f6fd6',
      studentNameItalic: false,
      studentNameWeight: '700',
      titleFont: 'Outfit',
      titleColor: '#0b2545',
      domainColor: '#1f6fd6',
    }),
  },
];

export const TypographyStudio: React.FC<TypographyStudioProps> = ({
  isOpen,
  onClose,
  typography,
  onChange,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'themes' | 'fonts'>('elements');
  const [activeElem, setActiveElem] = useState<TargetElemKey>('certName');
  const [customFontInput, setCustomFontInput] = useState('');
  const [fontSearchInput, setFontSearchInput] = useState('');

  if (!isOpen) return null;

  // Get current styles for the selected element
  const getElemStyle = (key: TargetElemKey): ElementStyle => {
    if (key === 'certName') {
      return (
        typography.certName || {
          fontFamily: typography.studentNameFont || 'Cormorant Garamond',
          fontSize: typography.studentNameSize || 44,
          fontWeight: typography.studentNameWeight || '600',
          fontStyle: typography.studentNameItalic !== false ? 'italic' : 'normal',
          color: typography.studentNameColor || '#12539c',
          letterSpacing: typography.letterSpacing || 1,
        }
      );
    }
    if (key === 'certTitle') {
      return (
        typography.certTitle || {
          fontFamily: typography.titleFont || 'Playfair Display',
          fontSize: 32,
          fontWeight: '800',
          fontStyle: 'normal',
          color: typography.titleColor || '#0b2545',
          letterSpacing: 0.3,
        }
      );
    }
    if (key === 'certDomain') {
      return (
        typography.certDomain || {
          fontFamily: 'Inter',
          fontSize: 12.5,
          fontWeight: '700',
          fontStyle: 'normal',
          color: typography.domainColor || '#12539c',
          letterSpacing: 0.4,
        }
      );
    }
    if (key === 'certEyebrow') {
      return (
        typography.certEyebrow || {
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '700',
          fontStyle: 'normal',
          color: '#5c7595',
          letterSpacing: 3,
        }
      );
    }
    if (key === 'certDesc') {
      return (
        typography.certDesc || {
          fontFamily: typography.descriptionFont || 'Inter',
          fontSize: 12,
          fontWeight: '400',
          fontStyle: 'normal',
          color: '#333d4a',
          letterSpacing: 0,
        }
      );
    }
    if (key === 'certSignatory') {
      return (
        typography.certSignatory || {
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: '600',
          fontStyle: 'normal',
          color: '#0b2545',
          letterSpacing: 0,
        }
      );
    }
    // certMeta
    return (
      typography.certMeta || {
        fontFamily: typography.metaFont || 'JetBrains Mono',
        fontSize: 10.5,
        fontWeight: '600',
        fontStyle: 'normal',
        color: '#000000',
        letterSpacing: 0.2,
      }
    );
  };

  const currentStyle = getElemStyle(activeElem);

  const updateActiveElemStyle = (patch: Partial<ElementStyle>) => {
    const updated = { ...currentStyle, ...patch };

    const newSettings: TypographySettings = {
      ...typography,
      [activeElem]: updated,
    };

    // Keep legacy top-level props in sync for backwards compatibility
    if (activeElem === 'certName') {
      if (patch.fontFamily) newSettings.studentNameFont = patch.fontFamily;
      if (patch.fontSize) newSettings.studentNameSize = patch.fontSize;
      if (patch.color) newSettings.studentNameColor = patch.color;
      if (patch.fontStyle !== undefined) newSettings.studentNameItalic = patch.fontStyle === 'italic';
      if (patch.fontWeight) newSettings.studentNameWeight = patch.fontWeight;
      if (patch.letterSpacing !== undefined) newSettings.letterSpacing = patch.letterSpacing;
    } else if (activeElem === 'certTitle') {
      if (patch.fontFamily) newSettings.titleFont = patch.fontFamily;
      if (patch.color) newSettings.titleColor = patch.color;
    } else if (activeElem === 'certDomain') {
      if (patch.color) newSettings.domainColor = patch.color;
    }

    onChange(newSettings);
  };

  const handleFontChange = (fontName: string) => {
    if (!fontName) return;
    loadGoogleFont(fontName);
    updateActiveElemStyle({ fontFamily: fontName });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#2F2FE4]/10 text-[#2F2FE4] border border-[#2F2FE4]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Certificate Design & Typography Studio</h3>
              <p className="text-xs text-slate-500">Customize fonts, sizes, colors and preset themes with live preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('elements')}
            className={`py-2 px-4 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'elements'
                ? 'bg-white text-[#2F2FE4] border-slate-200 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Element Styling
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`py-2 px-4 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'themes'
                ? 'bg-white text-[#2F2FE4] border-slate-200 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Preset Themes
          </button>
          <button
            onClick={() => setActiveTab('fonts')}
            className={`py-2 px-4 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'fonts'
                ? 'bg-white text-[#2F2FE4] border-slate-200 shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Fonts Explorer
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: Element Styling */}
          {activeTab === 'elements' && (
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
              {/* Element Picker Sidebar */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Select Element
                </label>
                <div className="flex flex-col gap-1">
                  {ELEMENT_TARGETS.map((elem) => {
                    const isActive = activeElem === elem.key;
                    return (
                      <button
                        key={elem.key}
                        onClick={() => setActiveElem(elem.key)}
                        className={`py-2.5 px-3 rounded-xl text-left font-semibold text-xs transition-all ${
                          isActive
                            ? 'bg-[#2F2FE4] text-white shadow-md shadow-[#2F2FE4]/20'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        {elem.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Element Style Controls */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-5">
                <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">
                  {ELEMENT_TARGETS.find((e) => e.key === activeElem)?.label} Styling
                </h4>

                {/* Font Family Dropdown & Custom Google Font Input */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Font Family</label>
                  <select
                    value={currentStyle.fontFamily}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs focus:border-[#2F2FE4]"
                  >
                    <optgroup label="Serif (Classic & Regal)">
                      <option value="Cormorant Garamond">Cormorant Garamond</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Cinzel">Cinzel</option>
                      <option value="Bodoni Moda">Bodoni Moda</option>
                      <option value="Lora">Lora</option>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Spectral">Spectral</option>
                      <option value="Prata">Prata</option>
                    </optgroup>
                    <optgroup label="Calligraphy & Script">
                      <option value="Great Vibes">Great Vibes</option>
                      <option value="Dancing Script">Dancing Script</option>
                      <option value="Alex Brush">Alex Brush</option>
                      <option value="Tangerine">Tangerine</option>
                      <option value="Parisienne">Parisienne</option>
                      <option value="Sacramento">Sacramento</option>
                      <option value="Satisfy">Satisfy</option>
                      <option value="Allura">Allura</option>
                    </optgroup>
                    <optgroup label="Sans-Serif (Clean & Modern)">
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Outfit">Outfit</option>
                      <option value="Raleway">Raleway</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Lato">Lato</option>
                    </optgroup>
                    <optgroup label="Monospace">
                      <option value="JetBrains Mono">JetBrains Mono</option>
                    </optgroup>
                  </select>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Or type ANY Google Font (e.g. Tangerine)"
                      value={customFontInput}
                      onChange={(e) => setCustomFontInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                    />
                    <button
                      onClick={() => handleFontChange(customFontInput)}
                      disabled={!customFontInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[#2F2FE4] text-white font-bold text-xs disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Color & Style Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Font Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentStyle.color}
                        onChange={(e) => updateActiveElemStyle({ color: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer bg-white"
                      />
                      <input
                        type="text"
                        value={currentStyle.color}
                        onChange={(e) => updateActiveElemStyle({ color: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Font Style</label>
                    <button
                      onClick={() =>
                        updateActiveElemStyle({ fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic' })
                      }
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        currentStyle.fontStyle === 'italic'
                          ? 'bg-[#2F2FE4] text-white border-[#2F2FE4]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      <i>I</i> Italic {currentStyle.fontStyle === 'italic' ? '(Active)' : ''}
                    </button>
                  </div>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Font Size ({currentStyle.fontSize || 16}px)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          updateActiveElemStyle({ fontSize: Math.max(8, (currentStyle.fontSize || 16) - 1) })
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min={8}
                        max={72}
                        value={currentStyle.fontSize || 16}
                        onChange={(e) => updateActiveElemStyle({ fontSize: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <button
                        onClick={() =>
                          updateActiveElemStyle({ fontSize: Math.min(72, (currentStyle.fontSize || 16) + 1) })
                        }
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Font Weight</label>
                    <select
                      value={currentStyle.fontWeight}
                      onChange={(e) => updateActiveElemStyle({ fontWeight: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-xs"
                    >
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">SemiBold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">ExtraBold (800)</option>
                    </select>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <label className="font-bold text-slate-700 block">Color Swatches</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_SWATCHES.map((sw) => (
                      <button
                        key={sw.color}
                        onClick={() => updateActiveElemStyle({ color: sw.color })}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: sw.color }}
                        title={sw.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Preset Themes */}
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESET_THEMES.map((t) => (
                <div
                  key={t.name}
                  onClick={() => onChange(t.apply(typography))}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-[#2F2FE4] hover:bg-[#2F2FE4]/5 transition-all cursor-pointer space-y-2 group bg-white shadow-sm"
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#2F2FE4]/10 text-[#2F2FE4]">
                    {t.tag}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#2F2FE4]">{t.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Fonts Explorer */}
          {activeTab === 'fonts' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Type ANY Google Font (e.g. Poppins, Tangerine, Lora)..."
                    value={fontSearchInput}
                    onChange={(e) => setFontSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50"
                  />
                </div>
                <button
                  onClick={() => handleFontChange(fontSearchInput)}
                  disabled={!fontSearchInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#2F2FE4] text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  Load & Apply
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GOOGLE_FONTS_CATALOG.filter(
                  (f) => !fontSearchInput || f.name.toLowerCase().includes(fontSearchInput.toLowerCase())
                ).map((f) => (
                  <button
                    key={f.name}
                    onClick={() => handleFontChange(f.name)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-[#2F2FE4] hover:bg-[#2F2FE4]/5 text-left transition-all bg-white"
                  >
                    <span className="text-base block truncate leading-tight" style={{ fontFamily: f.name }}>
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">{f.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#2F2FE4] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
