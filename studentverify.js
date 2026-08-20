/* ============================================================
   ATIDETO Student Certificate Verification — Public Script
   Target: studentverify.html (Dedicated public verification page)
   ============================================================ */

const $ = (id) => document.getElementById(id);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmtDate(iso) {
  if (!iso) return '—';
  const str = String(iso).split('T')[0]; // handle ISO timestamps
  const [y, m, d] = str.split('-').map(Number);
  if (y && m && d) return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
  return iso;
}

function fmtTimestamp(ts) {
  if (!ts) return '—';
  if (ts.toDate) return ts.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  return new Date(ts).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function esc(s) {
  if (!s) return '—';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* Parse Certificate ID from query string (?id=...) or path (/studentverify/...) */
function getCertificateIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get('id') || params.get('certificateId');

  if (!id) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const idx = pathParts.findIndex(p => p.includes('studentverify') || p.includes('verify'));
    if (idx !== -1 && pathParts[idx + 1] && !pathParts[idx + 1].includes('.html')) {
      id = decodeURIComponent(pathParts[idx + 1]);
    }
  }
  return id ? id.trim() : '';
}

/* ============================================================
   Initialization
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const certId = getCertificateIdFromUrl();

  if (certId) {
    // QR code scan / direct link with ?id= → auto-verify immediately
    $('verifyLanding').classList.add('hidden');
    $('verifyLoading').classList.remove('hidden');
    if ($('certIdInput')) $('certIdInput').value = certId;
    verifyStudentCertificate(certId);
  } else {
    // No ID in URL → show welcoming search form
    $('verifyLoading').classList.add('hidden');
    $('verifyLanding').classList.remove('hidden');
  }

  // Landing page search form
  if ($('verifyBtn')) {
    $('verifyBtn').addEventListener('click', () => {
      const val = $('certIdInput').value.trim();
      if (val) verifyStudentCertificate(val);
    });
  }

  if ($('certIdInput')) {
    $('certIdInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = $('certIdInput').value.trim();
        if (val) verifyStudentCertificate(val);
      }
    });
  }

  // Error state search form
  if ($('verifyBtnError')) {
    $('verifyBtnError').addEventListener('click', () => {
      const val = $('certIdInputError').value.trim();
      if (val) verifyStudentCertificate(val);
    });
  }

  if ($('certIdInputError')) {
    $('certIdInputError').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = $('certIdInputError').value.trim();
        if (val) verifyStudentCertificate(val);
      }
    });
  }
});

/* ============================================================
   Verification API Call
   ============================================================ */
async function verifyStudentCertificate(id) {
  if (!id) return;

  // Hide all states, show loading
  $('verifyLanding').classList.add('hidden');
  $('verifyLoading').classList.remove('hidden');
  $('verifyError').classList.add('hidden');
  $('verifyResult').classList.add('hidden');

  try {
    const data = await verifyCertificate(id);
    $('verifyLoading').classList.add('hidden');
    renderVerifiedStudentView(data.certificate);
  } catch (err) {
    $('verifyLoading').classList.add('hidden');
    $('verifyError').classList.remove('hidden');
    if ($('certIdInputError')) $('certIdInputError').value = id;
    $('errorTextMsg').textContent = `No verified certificate matching "${id}" could be found in the ATIDETO system.`;
  }
}

/* ============================================================
   Render Verified Student View
   ============================================================ */
function renderVerifiedStudentView(cert) {
  const isValid = cert.status === 'active';
  const targetId = cert.certificateId || '—';

  /* 1. Hero Verification Status Banner */
  $('statusBanner').innerHTML = `
    <div class="hero-seal-icon">
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    </div>
    <div class="hero-content">
      <div class="hero-tag">
        <span>${isValid ? '✓ OFFICIALLY VERIFIED STUDENT' : '✗ REVOKED CERTIFICATE'}</span>
      </div>
      <h1 class="hero-title">${isValid ? 'Verified Authentic Internship Certificate' : 'Certificate Has Been Revoked'}</h1>
      <p class="hero-desc">
        This document officially verifies that <strong>${esc(cert.studentName)}</strong> has successfully completed the
        <strong>${esc(cert.course)}</strong> internship program from <strong>ATIDETO Technologies</strong>.
        ${isValid ? 'This record is active and verified in our database.' : 'This credential is no longer active.'}
      </p>
    </div>
  `;

  /* 2. Visual Certificate Display Card */
  const startD = cert.startDate || '';
  const endD = cert.endDate || '';
  // Backend returns issueDate (Date), not issuedAt
  const issueD = cert.issueDate
    ? new Date(cert.issueDate).toISOString().split('T')[0]
    : (cert.issuedAt ? new Date(cert.issuedAt.toDate ? cert.issuedAt.toDate() : cert.issuedAt).toISOString().split('T')[0] : '');
  const qrUrl = `https://atideto-certificate-system.vercel.app/studentverify?id=${encodeURIComponent(targetId)}`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(qrUrl)}`;

  $('certPreviewWrap').innerHTML = `
    <div class="certificate" id="verifiedStudentCert">
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
            <p><span>Verify ID</span><b>${esc(targetId)}</b></p>
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
  `;

  /* 3. Student Record Breakdown */
  $('detailsCard').innerHTML = `
    <h3 style="font-size:18px;font-weight:700;margin-bottom:20px;color:#0F172A;">Verified Member & Internship Breakdown</h3>
    <div class="details-grid">
      <div class="detail-block">
        <span class="detail-label">Verified Student Name</span>
        <span class="detail-val">${esc(cert.studentName)}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">Certificate ID</span>
        <span class="detail-val detail-val-mono">${esc(targetId)}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">Domain / Program</span>
        <span class="detail-val">${esc(cert.course)}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">College / Institution</span>
        <span class="detail-val">${esc(cert.college || '—')}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">Internship Duration</span>
        <span class="detail-val">${esc(cert.duration || '—')}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">Internship Period</span>
        <span class="detail-val">${fmtDate(startD)} — ${fmtDate(endD)}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">Issued Date</span>
        <span class="detail-val">${fmtDate(issueD)}</span>
      </div>
      <div class="detail-block">
        <span class="detail-label">Verification Status</span>
        <span class="detail-val" style="color:${isValid ? '#059669' : '#DC2626'}">${isValid ? '✓ Officially Verified' : 'Revoked'}</span>
      </div>
    </div>
  `;

  /* Attach Download Listeners */
  if ($('downloadPngBtn')) {
    $('downloadPngBtn').onclick = () => downloadCertificate('png', cert);
  }
  if ($('downloadPdfBtn')) {
    $('downloadPdfBtn').onclick = () => downloadCertificate('pdf', cert);
  }

  $('verifyResult').classList.remove('hidden');
}

/* ============================================================
   Download Certificate as PNG / PDF
   ============================================================ */
async function downloadCertificate(format, cert) {
  const certEl = $('verifiedStudentCert');
  if (!certEl) return;

  const canvas = await html2canvas(certEl, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
  const name = (cert.studentName || 'certificate').trim().replace(/\s+/g, '_');

  if (format === 'png') {
    const link = document.createElement('a');
    link.download = `ATIDETO_Verified_Certificate_${name}_${cert.certificateId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else {
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    if (jsPDF) {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save(`ATIDETO_Verified_Certificate_${name}_${cert.certificateId}.pdf`);
    }
  }
}
