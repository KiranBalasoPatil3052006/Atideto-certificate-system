/* Certificate Verification Page */

const $ = (id) => document.getElementById(id);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (y && m && d) return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
  return iso;
}

function fmtTimestamp(ts) {
  if (!ts) return '—';
  if (ts.toDate) return ts.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  return new Date(ts).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* Check URL for ?id= parameter on load */
const params = new URLSearchParams(window.location.search);
const urlId = params.get('id');
if (urlId) {
  $('certIdInput').value = urlId;
  setTimeout(() => doVerify(), 100);
}

$('verifyBtn').addEventListener('click', doVerify);
$('certIdInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doVerify();
});

async function doVerify() {
  const id = $('certIdInput').value.trim();
  if (!id) return;

  $('verifyLoading').classList.remove('hidden');
  $('verifyError').classList.add('hidden');
  $('verifyResult').classList.add('hidden');

  try {
    const data = await verifyCertificate(id);
    $('verifyLoading').classList.add('hidden');
    renderResult(data.certificate);
  } catch (err) {
    $('verifyLoading').classList.add('hidden');
    $('verifyError').classList.remove('hidden');
    $('verifyError').innerHTML = `
      <div class="error-icon">&#10060;</div>
      <h2>Certificate Not Found</h2>
      <p>No certificate with ID <strong>${esc(id)}</strong> exists.</p>
      <p class="error-hint">Please check the ID and try again, or contact ATIDETO support.</p>
    `;
  }
}

function renderResult(cert) {
  const isValid = cert.status === 'active';

  /* Status Banner */
  $('statusBanner').innerHTML = `
    <div class="status-badge ${isValid ? 'valid' : 'revoked'}">
      <span class="status-icon">${isValid ? '✓' : '✗'}</span>
      ${isValid ? 'Verified Authentic Certificate' : 'Certificate Revoked'}
      ${isValid ? `<span class="status-count">Verified ${cert.verifiedCount || 0} times</span>` : ''}
    </div>
  `;

  /* Certificate Preview (Exact preview.html format) */
  const startD = cert.startDate || '';
  const endD = cert.endDate || '';
  const issueD = cert.issuedAt ? new Date(cert.issuedAt.toDate ? cert.issuedAt.toDate() : cert.issuedAt).toISOString().split('T')[0] : '';
  const qrUrl = cert.verificationUrl || `${window.location.origin}/verify/${cert.certificateId}`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(qrUrl)}`;

  $('certPreviewWrap').innerHTML = `
    <div class="certificate" id="verifiedCert">
      <img class="cert-bg" src="assets/background1.png" alt="">
      <div class="cert-inner">
        <div class="cert-top">
          <div class="cert-top-left">
            <img src="assets/atideto-logo.png" alt="ATIDETO Technologies" class="cert-atideto-logo">
          </div>
          <div class="cert-top-right">
            <img src="assets/msme-logo.png" alt="MSME Registered" class="cert-msme-logo">
            <span class="udyam-id">${esc(cert.udyamId || 'UDYAM-TN-20-0242534')}</span>
          </div>
        </div>

        <div class="cert-title-block">
          <p class="cert-eyebrow">This certifies that</p>
          <h2 class="cert-title">Internship Completion Certificate</h2>
        </div>

        <div class="cert-name-block">
          <h3 class="cert-name">${esc(cert.studentName)}</h3>
          <div class="cert-underline"></div>
        </div>

        <div class="cert-domain-wrapper">
          <p class="cert-domain">
            Internship Domain&nbsp;: <span>${esc(cert.course)}</span>
          </p>
        </div>

        <div class="cert-description">
          <p>
            This Certificate of Completion is proudly awarded in recognition of the successful completion of the
            internship program at <strong>ATIDETO</strong>. Throughout the internship, the intern demonstrated
            professionalism, dedication, and a strong commitment to learning while contributing to assigned
            responsibilities and project objectives.
          </p>
          <p>
            The internship was successfully completed from
            <span>${fmtDate(startD)}</span> to <span>${fmtDate(endD)}</span> by a student of
            <strong>${esc(cert.college)}</strong>${cert.registerNo ? ` (Register No.: <strong>${esc(cert.registerNo)}</strong>)` : ''}.
            We appreciate the intern's contribution and wish them continued success in their future academic and professional endeavors.
          </p>
        </div>

        <div class="cert-bottom">
          <div class="cert-meta">
            <p><span>Duration</span><b>${esc(cert.duration || '—')}</b></p>
            <p><span>Issue Date</span><b>${fmtDate(issueD)}</b></p>
            <p><span>Verify ID</span><b>${esc(cert.certificateId)}</b></p>
          </div>

          <div class="cert-qr">
            <img src="${qrImgSrc}" alt="Verification QR Code">
            <span>Scan to verify</span>
          </div>

          <div class="cert-signature">
            <div class="sig-line"></div>
            <p>Founder, ATIDETO Technologies</p>
          </div>
        </div>

        <div class="cert-footer">
          <span><i>&#9993;</i> hello@atideto.com</span>
          <span><i>&#9742;</i> +91 98765 43210</span>
          <span><i>&#127760;</i> www.atideto.com</span>
        </div>
      </div>
    </div>

    <div class="cert-actions">
      <button id="downloadVerifyPngBtn" class="btn btn-primary">Download PNG</button>
      <button id="downloadVerifyPdfBtn" class="btn btn-primary">Download PDF</button>
    </div>
  `;

  if ($('downloadVerifyPngBtn')) {
    $('downloadVerifyPngBtn').onclick = () => downloadVerifyCert('png', cert);
  }
  if ($('downloadVerifyPdfBtn')) {
    $('downloadVerifyPdfBtn').onclick = () => downloadVerifyCert('pdf', cert);
  }

  /* Details Card */
  $('detailsCard').innerHTML = `
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label">Certificate ID</span>
        <span class="detail-value mono">${esc(cert.certificateId)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Status</span>
        <span class="detail-value ${isValid ? 'text-green' : 'text-red'}">${isValid ? 'Active' : 'Revoked'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Student Name</span>
        <span class="detail-value">${esc(cert.studentName)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Course / Domain</span>
        <span class="detail-value">${esc(cert.course)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">College</span>
        <span class="detail-value">${esc(cert.college)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Duration</span>
        <span class="detail-value">${esc(cert.duration)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Period</span>
        <span class="detail-value">${fmtDate(cert.startDate)} — ${fmtDate(cert.endDate)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Issued On</span>
        <span class="detail-value">${fmtTimestamp(cert.issuedAt)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Times Verified</span>
        <span class="detail-value">${cert.verifiedCount || 0}</span>
      </div>
    </div>
    <div class="verify-footer">
      This certificate is issued by <strong>ATIDETO Technologies</strong>.
      ${isValid ? 'The authenticity of this document can be verified at any time using the QR code or certificate ID above.' : 'This certificate has been revoked and is no longer valid.'}
    </div>
  `;

  $('verifyResult').classList.remove('hidden');
}

async function downloadVerifyCert(format, cert) {
  const certEl = $('verifiedCert');
  if (!certEl) return;
  const canvas = await html2canvas(certEl, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
  const name = (cert.studentName || 'certificate').trim().replace(/\s+/g, '_');

  if (format === 'png') {
    const link = document.createElement('a');
    link.download = `ATIDETO_Certificate_${name}_${cert.certificateId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else {
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    if (jsPDF) {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save(`ATIDETO_Certificate_${name}_${cert.certificateId}.pdf`);
    }
  }
}

function esc(s) {
  if (!s) return '—';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
