const loadedFonts = new Set<string>();

export function getCleanFontFamily(fontFamily: string | undefined, fallback: 'serif' | 'sans-serif' | 'monospace' = 'sans-serif'): string {
  if (!fontFamily) return fallback;
  // Strip any existing single or double quotes
  const cleaned = fontFamily.replace(/['"]/g, '').trim();
  if (!cleaned) return fallback;
  return `'${cleaned}', ${fallback}`;
}

export function loadGoogleFont(fontFamily: string) {
  if (!fontFamily) return;

  const cleaned = fontFamily.replace(/['"]/g, '').trim();
  if (!cleaned || loadedFonts.has(cleaned)) return;

  // Check if system / standard font
  const systemFonts = ['Inter', 'sans-serif', 'serif', 'monospace', 'Arial', 'Georgia', 'Times New Roman', 'Courier New'];
  if (systemFonts.includes(cleaned)) return;

  const fontNameForUrl = cleaned.replace(/\s+/g, '+');
  const linkId = `gfont-${cleaned.toLowerCase().replace(/\s+/g, '-')}`;

  if (document.getElementById(linkId)) {
    loadedFonts.add(cleaned);
    return;
  }

  // Load without restrictive axis filters so Google Fonts returns whatever weights are valid for the typeface
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(cleaned);
}
