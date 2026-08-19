import crypto from 'crypto';
import { getCourseCode } from './template.js';

export function generateCertificateId(courseTitle) {
  const code = getCourseCode(courseTitle);
  const year = new Date().getFullYear();
  // Cryptographically random suffix (hex) — avoids Math.random() predictability
  // and reduces collision risk far below a 4-digit decimal sequence.
  const seq = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `AT-IC-${code}-${year}-${seq}`;
}
