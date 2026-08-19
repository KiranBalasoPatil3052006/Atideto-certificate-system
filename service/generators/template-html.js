import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../../frontend/assets');

function getBase64Image(filename) {
  try {
    const filePath = path.join(assetsDir, filename);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return `data:image/png;base64,${buffer.toString('base64')}`;
    }
  } catch (e) {
    console.warn(`Could not load ${filename}:`, e.message);
  }
  return '';
}

const bgBase64 = getBase64Image('background1.png');
const atidetoLogoBase64 = getBase64Image('atideto-logo.png');
const msmeLogoBase64 = getBase64Image('msme-logo.png');

export function buildCertificateHtml(data) {
  const {
    studentName = 'Student Name',
    course = 'Web Development',
    college = 'the institution',
    registerNo = '—',
    startDate = '',
    endDate = '',
    duration = '—',
    issueDate = '',
    certificateId = '—',
    udyamId = 'UDYAM-TN-20-0242534',
    email = 'hello@atideto.com',
    phone = '+91 98765 43210',
    website = 'www.atideto.com',
    signatory = 'Founder, ATIDETO Technologies',
    qrDataUrl = '',
    description1 = '',
    description2 = '',
  } = data;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const fmt = (iso) => {
    if (!iso) return '';
    const [y,m,d] = iso.split('-').map(Number);
    if (!y||!m||!d) return iso;
    return `${String(d).padStart(2,'0')} ${months[m-1]} ${y}`;
  };

  const d1 = description1 || `This Certificate of Completion is proudly awarded in recognition of the successful completion of the internship program at <strong>ATIDETO</strong>. Throughout the internship, the intern demonstrated professionalism, dedication, and a strong commitment to learning while contributing to assigned responsibilities and project objectives.`;
  const d2 = description2 || `The internship was successfully completed from <span>${fmt(startDate)}</span> to <span>${fmt(endDate)}</span> by a student of <strong>${college}</strong> (Register No.: <strong>${registerNo}</strong>). We appreciate the intern's contribution and wish them continued success in their future academic and professional endeavors.`;

  const formattedIssueDate = fmt(issueDate) || fmt(new Date().toISOString().split('T')[0]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Playfair+Display:wght@800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600&display=swap');

  :root {
    --navy: #0b2545;
    --blue: #12539c;
    --steel: #5c7595;
    --line: #dfe4ea;
    --gold: #a8791f;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1344px;
    height: 896px;
    font-family: 'Inter', sans-serif;
    background: #fff;
    position: relative;
    overflow: hidden;
  }

  .certificate {
    position: relative;
    width: 1344px;
    height: 896px;
    background: #fff;
    overflow: hidden;
  }

  .cert-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .cert-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
    padding: 3.6% 4.6% 2.6%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .cert-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cert-atideto-logo {
    height: 52px;
    width: auto;
  }

  .cert-top-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .cert-msme-logo {
    height: 58px;
    width: auto;
  }

  .udyam-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: #000000;
    letter-spacing: 0.3px;
    font-weight: 600;
    text-align: center;
  }

  .cert-title-block {
    text-align: center;
    margin-top: 22px;
  }

  .cert-eyebrow {
    margin: 0 0 2px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--steel);
    font-weight: 500;
  }

  .cert-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: 34px;
    color: var(--navy);
    letter-spacing: 0.3px;
  }

  .cert-name-block {
    text-align: center;
    margin-top: 14px;
  }

  .cert-name {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-style: italic;
    font-size: 44px;
    color: var(--blue);
    letter-spacing: 1px;
    line-height: 1.1;
  }

  .cert-underline {
    width: 220px;
    height: 1.5px;
    background: linear-gradient(90deg, rgba(168, 121, 31, 0) 0%, rgba(168, 121, 31, 0.5) 20%, rgba(168, 121, 31, 0.7) 50%, rgba(168, 121, 31, 0.5) 80%, rgba(168, 121, 31, 0) 100%);
    margin: 6px auto 0;
    opacity: 0.65;
  }

  .cert-domain-wrapper {
    text-align: center;
    margin: 24px 0 0;
  }

  .cert-domain {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0;
    padding: 7px 26px;
    background: linear-gradient(135deg, rgba(11, 37, 69, 0.04) 0%, rgba(31, 111, 214, 0.08) 50%, rgba(168, 121, 31, 0.07) 100%);
    border: 1px solid rgba(18, 83, 156, 0.18);
    border-left: 2.5px solid rgba(168, 121, 31, 0.5);
    border-right: 2.5px solid rgba(168, 121, 31, 0.5);
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 13.5px;
    color: var(--navy);
    letter-spacing: 0.4px;
  }

  .cert-domain span {
    font-weight: 700;
    color: var(--blue);
  }

  .cert-description {
    text-align: center;
    margin: 16px auto 0;
    max-width: 92%;
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.68;
    color: #333d4a;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cert-description p { margin: 0; }
  .cert-description strong { color: var(--navy); font-weight: 600; }
  .cert-description span { font-weight: 600; color: var(--blue); }

  .cert-bottom {
    margin-top: auto;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    padding-top: 16px;
  }

  .cert-meta {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .cert-meta p {
    margin: 0;
    font-size: 10.5px;
    color: var(--steel);
    display: grid;
    grid-template-columns: 68px 1fr;
    gap: 6px;
    align-items: baseline;
  }

  .cert-meta p span { font-weight: 600; color: var(--navy); }
  .cert-meta p b { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #000000; }

  .cert-qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    justify-self: center;
  }

  .cert-qr img {
    width: 78px;
    height: 78px;
    object-fit: contain;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 3px;
    background: #fff;
  }

  .cert-qr span {
    font-size: 9px;
    color: var(--steel);
    font-weight: 500;
  }

  .cert-signature {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-self: end;
    gap: 6px;
  }

  .sig-line {
    width: 140px;
    height: 1.5px;
    background: var(--navy);
    margin-top: 50px;
  }

  .cert-signature p {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    color: var(--navy);
  }

  .cert-footer {
    margin-top: 14px;
    border-top: 1px solid var(--line);
    padding-top: 8px;
    display: flex;
    justify-content: center;
    gap: 36px;
  }

  .cert-footer span {
    font-size: 10px;
    color: var(--steel);
    font-weight: 500;
  }
</style>
</head>
<body>
<div class="certificate">
  ${bgBase64 ? `<img class="cert-bg" src="${bgBase64}" alt="">` : ''}
  <div class="cert-inner">
    <div class="cert-top">
      <div class="cert-top-left">
        ${atidetoLogoBase64 ? `<img src="${atidetoLogoBase64}" alt="ATIDETO Technologies" class="cert-atideto-logo">` : '<h1 style="font-size:22px;color:#0b2545;">ATIDETO</h1>'}
      </div>
      <div class="cert-top-right">
        ${msmeLogoBase64 ? `<img src="${msmeLogoBase64}" alt="MSME Registered" class="cert-msme-logo">` : ''}
        <span class="udyam-id">${udyamId}</span>
      </div>
    </div>

    <div class="cert-title-block">
      <p class="cert-eyebrow">This certifies that</p>
      <h2 class="cert-title">Internship Completion Certificate</h2>
    </div>

    <div class="cert-name-block">
      <h3 class="cert-name">${studentName}</h3>
      <div class="cert-underline"></div>
    </div>

    <div class="cert-domain-wrapper">
      <p class="cert-domain">
        Internship Domain&nbsp;: <span>${course}</span>
      </p>
    </div>

    <div class="cert-description">
      <p>${d1}</p>
      <p>${d2}</p>
    </div>

    <div class="cert-bottom">
      <div class="cert-meta">
        <p><span>Duration</span><b>${duration}</b></p>
        <p><span>Issue Date</span><b>${formattedIssueDate}</b></p>
        <p><span>Verify ID</span><b>${certificateId}</b></p>
      </div>

      <div class="cert-qr">
        ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR">` : '<div style="width:78px;height:78px;border:1px solid #dfe4ea;border-radius:4px;"></div>'}
        <span>Scan to verify</span>
      </div>

      <div class="cert-signature">
        <div class="sig-line"></div>
        <p>${signatory}</p>
      </div>
    </div>

    <div class="cert-footer">
      <span>&#9993; ${email}</span>
      <span>&#9742; ${phone}</span>
      <span>&#127760; ${website}</span>
    </div>
  </div>
</div>
</body>
</html>`;
}
