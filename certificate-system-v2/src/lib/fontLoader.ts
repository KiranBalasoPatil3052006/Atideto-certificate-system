const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string) {
  if (!fontFamily || loadedFonts.has(fontFamily)) return;

  // Check if system / standard font
  const systemFonts = ['Inter', 'sans-serif', 'serif', 'monospace', 'Arial', 'Georgia'];
  if (systemFonts.includes(fontFamily)) return;

  const fontNameForUrl = fontFamily.replace(/ /g, '+');
  const linkId = `gfont-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`;

  if (document.getElementById(linkId)) {
    loadedFonts.add(fontFamily);
    return;
  }

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontNameForUrl}:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
}
