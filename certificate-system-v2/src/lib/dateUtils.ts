const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(val: string | null | undefined): string {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return val;
  }
}

export function formatCertificateDate(val: string | null | undefined): string {
  if (!val) return '—';
  // Handle ISO format YYYY-MM-DD directly without timezone offset bugs
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
    const [y, m, d] = val.split('T')[0].split('-').map(Number);
    if (y && m && d && m >= 1 && m <= 12) {
      return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
    }
  }
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return val;
  }
}

export function formatISODate(val: string | Date | null | undefined): string {
  if (!val) return '';
  try {
    const d = typeof val === 'string' ? new Date(val) : val;
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}
