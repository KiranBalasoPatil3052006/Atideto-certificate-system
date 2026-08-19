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

const atidetoLogoBase64 = getBase64Image('atideto-logo.png');
const offerLetterBgBase64 = getBase64Image('background.png');

export function buildOfferLetterHtml(data) {
  const {
    studentName = 'Vishnu R',
    salutation = 'Mr./Ms.',
    email = 'vishnu.r@example.com',
    phone = '+91 98765 43210',
    college = 'XYZ College of Engineering',
    domain = 'Artificial Intelligence',
    duration = '2 Months',
    startDate = '2026-06-01',
    endDate = '2026-07-31',
    mode = 'Online',
    offerLetterNo = 'ATIDETO/2026/INT/018',
    issueDate = '2026-06-22',
  } = data;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const fmt = (iso) => {
    if (!iso) return '';
    const [y,m,d] = iso.split('-').map(Number);
    if (!y||!m||!d) return iso;
    return `${String(d).padStart(2,'0')} ${months[m-1]} ${y}`;
  };

  const formattedStartDate = fmt(startDate) || '01 June 2026';
  const formattedEndDate = fmt(endDate) || '31 July 2026';
  const formattedIssueDate = fmt(issueDate) || fmt(new Date().toISOString().split('T')[0]) || '22 June 2026';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --navy: #0A3D91;
    --body-text: #333333;
    --meta-text: #555555;
    --footer-text: #666666;
    --divider: #D9E5F7;
    --steel: #6b7a8f;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 850px;
    height: 1277px;
    font-family: 'Inter', sans-serif;
    background: #ffffff;
    color: var(--body-text);
    position: relative;
    overflow: hidden;
  }

  .letter {
    position: relative;
    width: 100%;
    height: 100%;
    background: #ffffff ${offerLetterBgBase64 ? `url("${offerLetterBgBase64}") no-repeat center / 100% 100%` : ''};
    overflow: hidden;
  }

  .letter-bg {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: fill;
    z-index: 0;
  }

  .letter-inner {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
    padding: 60px 72px 48px;
    display: flex;
    flex-direction: column;
  }

  .letter-header {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 66px;
    text-align: center;
  }

  .letter-logo {
    height: 62px;
    width: auto;
  }

  .title-divider {
    height: 1px;
    background: var(--divider);
    margin-bottom: 22px;
  }

  /* Main Title: Poppins SemiBold 28pt, #0A3D91, Uppercase, Center, moved higher up */
  .letter-title {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 28px;
    color: var(--navy);
    text-align: center;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    margin: 12px 0 12px;
  }

  /* Offer Letter Number & Date: Inter Medium 10.5pt, #555555 */
  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 22px;
  }

  .meta-row p {
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    font-weight: 500;
    color: var(--meta-text);
  }

  .offer-no { text-align: left; }
  .offer-date { text-align: right; }

  /* Recipient Info: Inter Regular / SemiBold 11pt, #333333 */
  .recipient-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 22px;
  }

  .recipient-block p { margin: 0; }
  .recipient-block p.to {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--body-text);
    margin-bottom: 2px;
  }

  .recipient-name {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--body-text);
  }

  .recipient-name span:last-child,
  .dear-line span {
    color: #1e40af;
    font-weight: 600;
  }

  .recipient-line {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: var(--body-text);
  }

  /* Salutation: Inter Medium 11pt, #333333 */
  .dear-line {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--body-text);
    margin: 0 0 14px;
  }

  /* Body Paragraph: Inter Regular 11pt, Line Height 1.6, Justified */
  .body-paragraph {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: var(--body-text);
    line-height: 1.6;
    text-align: justify;
    margin: 0 0 22px;
  }

  /* Section Heading: Poppins SemiBold 13pt, #1e40af, simple text, NO two border lines, NOT uppercase */
  .section-heading {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: #1e40af;
    text-transform: none;
    text-align: left;
    padding: 0;
    border: none;
    margin: 18px 0 12px;
    letter-spacing: 0.01em;
  }

  /* Internship Details: Light Opacity Executive Table */
  .details-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: rgba(244, 248, 255, 0.45);
    border: 1px solid rgba(217, 229, 247, 0.75);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 22px;
  }

  .details-table tr:not(:last-child) td {
    border-bottom: 1px solid rgba(217, 229, 247, 0.5);
  }

  .details-table td {
    padding: 9.5px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    line-height: 1.4;
    vertical-align: middle;
  }

  .details-table .detail-label {
    font-weight: 500;
    color: #1e40af;
    width: 36%;
    text-transform: none;
    letter-spacing: 0.2px;
    font-size: 10.5px;
  }

  .details-table .detail-sep {
    width: 4%;
    text-align: center;
    color: var(--body-text);
    font-weight: 400;
  }

  .details-table .detail-value {
    font-weight: 400;
    color: var(--body-text);
    width: 60%;
  }

  /* Signature Area: Right-positioned, Sincerely aligned to left starting point of ATIDETO Technologies, Founder centered */
  .signature-block {
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    margin-top: 60px;
    margin-bottom: 10px;
    width: auto;
  }

  .sincerely {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--body-text);
    margin: 0;
    text-align: left;
    width: 100%;
  }

  .signature-space {
    height: 48px;
    width: 100%;
  }

  .digital-sig {
    font-family: 'Inter', sans-serif;
    font-size: 9.5px;
    font-style: italic;
    color: var(--steel);
    margin: 0 0 3px;
    text-align: center;
    width: 100%;
  }

  .founder-title {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: var(--body-text);
    margin: 0 0 1px;
    text-align: center;
    width: 100%;
  }

  .company-name {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: var(--body-text);
    margin: 0;
    text-align: left;
    width: 100%;
    white-space: nowrap;
  }

  /* Footer: Inter Regular 9.5pt, #666666, Center aligned, single line separated by #D9E5F7 */
  .letter-footer {
    margin-top: auto;
    text-align: center;
    padding-top: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    white-space: nowrap;
  }

  .letter-footer span {
    font-family: 'Inter', sans-serif;
    font-size: 9.5px;
    color: var(--footer-text);
    font-weight: 400;
  }

  .footer-sep {
    color: var(--divider);
    font-size: 9.5px;
    font-weight: 400;
  }
</style>
</head>
<body>
  <div class="letter">
    ${offerLetterBgBase64 ? `<img class="letter-bg" src="${offerLetterBgBase64}" alt="">` : ''}
    <div class="letter-inner">

      <div class="letter-header">
        ${atidetoLogoBase64 ? `<img src="${atidetoLogoBase64}" alt="ATIDETO Technologies" class="letter-logo">` : ''}
      </div>

      <h1 class="letter-title">INTERNSHIP OFFER LETTER</h1>
      <div class="title-divider"></div>

      <div class="meta-row">
        <p class="offer-no">Offer Letter No. : <span>${offerLetterNo}</span></p>
        <p class="offer-date">Date : <span>${formattedIssueDate}</span></p>
      </div>

      <div class="recipient-block">
        <p class="to">To,</p>
        <p class="recipient-name"><span>${salutation}</span> <span>${studentName}</span></p>
        <p class="recipient-line">${college}</p>
        <p class="recipient-line">${email}</p>
        <p class="recipient-line">${phone}</p>
      </div>

      <p class="dear-line">
        Dear <span>${studentName}</span>,
      </p>

      <p class="body-paragraph">We are pleased to offer you an internship opportunity with ATIDETO Technologies. This internship is designed to provide practical industry exposure, hands-on learning, and real-world project experience while helping you strengthen your technical and professional skills.</p>

      <h2 class="section-heading">Internship Details</h2>

      <table class="details-table">
        <tbody>
          <tr>
            <td class="detail-label">Internship Domain</td>
            <td class="detail-sep">:</td>
            <td class="detail-value">${domain}</td>
          </tr>
          <tr>
            <td class="detail-label">Duration</td>
            <td class="detail-sep">:</td>
            <td class="detail-value">${duration}</td>
          </tr>
          <tr>
            <td class="detail-label">Start Date</td>
            <td class="detail-sep">:</td>
            <td class="detail-value">${formattedStartDate}</td>
          </tr>
          <tr>
            <td class="detail-label">End Date</td>
            <td class="detail-sep">:</td>
            <td class="detail-value">${formattedEndDate}</td>
          </tr>
          <tr>
            <td class="detail-label">Mode</td>
            <td class="detail-sep">:</td>
            <td class="detail-value">${mode}</td>
          </tr>
        </tbody>
      </table>

      <p class="body-paragraph">Upon successful completion of the internship and fulfillment of the program requirements, you will be eligible to receive an Internship Completion Certificate issued by ATIDETO Technologies. We are delighted to welcome you to our team and look forward to supporting your learning and professional growth. We wish you a rewarding and successful internship experience.</p>

      <div class="signature-block">
        <p class="sincerely">Sincerely,</p>
        <div class="signature-space"></div>
        <p class="digital-sig">(Digital Signature)</p>
        <p class="founder-title">Founder</p>
        <p class="company-name">ATIDETO Technologies</p>
      </div>

      <div class="letter-footer">
        <span>📍 Ponnamapet, Salem, Tamil Nadu – 636001</span>
        <span class="footer-sep">•</span>
        <span>✉ atideto.in@gmail.com</span>
        <span class="footer-sep">•</span>
        <span>☎ +91 XXXXX XXXXX</span>
        <span class="footer-sep">•</span>
        <span>🌐 www.atideto.in</span>
      </div>

    </div>
  </div>
</body>
</html>`;
}
