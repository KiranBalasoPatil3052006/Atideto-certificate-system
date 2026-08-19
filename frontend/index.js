/* Admin Dashboard — talks to the main ATIDETO backend (MongoDB) */

let students = [];
let certificates = [];
let selectedIds = new Set();

const $ = (id) => document.getElementById(id);

function showMsg(text, isError) {
  const el = $('message');
  if (!text) { el.classList.add('hidden'); return; }
  el.textContent = text;
  el.className = 'msg ' + (isError ? 'msg-error' : 'msg-success');
}

function dateOnly(v) {
  if (!v) return '';
  return String(v).slice(0, 10);
}

const STATUS_STYLE = {
  'RECEIVED':           { label: 'Received',            cls: 'status-blue' },
  'UNDER_REVIEW':       { label: 'Under Review',        cls: 'status-amber' },
  'SELECTED':           { label: 'Selected',            cls: 'status-violet' },
  'COMPLETED':          { label: 'Completed',           cls: 'status-green' },
  'CERTIFICATE_GENERATED': { label: 'Certificate Issued', cls: 'status-green' },
  'REJECTED':           { label: 'Rejected',            cls: 'status-red' },
};

function statusMeta(s) {
  return STATUS_STYLE[s] || { label: s || '—', cls: 'status-blue' };
}

/* ============================================================
   Auth
   ============================================================ */
async function initAuth() {
  try {
    await fetchMe();
    showAdmin();
  } catch (e) {
    showLogin();
  }
}

function showAdmin() {
  $('loginView').classList.add('hidden');
  $('adminMain').classList.remove('hidden');
  $('logoutBtn').classList.remove('hidden');
  loadStudents();
}

function showLogin() {
  $('loginView').classList.remove('hidden');
  $('adminMain').classList.add('hidden');
  $('logoutBtn').classList.add('hidden');
}

$('loginBtn').addEventListener('click', async () => {
  const email = $('loginEmail').value.trim();
  const password = $('loginPassword').value;
  if (!email || !password) {
    $('loginError').textContent = 'Enter your email and password.';
    $('loginError').classList.remove('hidden');
    return;
  }
  try {
    await login(email, password);
    $('loginError').classList.add('hidden');
    showAdmin();
  } catch (err) {
    $('loginError').textContent = err.message;
    $('loginError').classList.remove('hidden');
  }
});

$('loginPassword').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('loginBtn').click();
});

$('logoutBtn').addEventListener('click', async () => {
  try { await logout(); } catch (e) { /* ignore */ }
  showLogin();
});

/* ============================================================
   Tab switching
   ============================================================ */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`tab-${btn.dataset.tab}`).classList.add('active');
    if (btn.dataset.tab === 'students') loadStudents();
    else loadCertificates();
  });
});

/* Select all */
$('selectAllStudents').addEventListener('change', (e) => {
  document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = e.target.checked);
  updateSelected();
});

/* ============================================================
   Students (internship applications from main backend)
   ============================================================ */
async function loadStudents() {
  $('studentsLoading').classList.remove('hidden');
  $('studentsError').classList.add('hidden');
  $('studentsEmpty').classList.add('hidden');
  $('studentsTableWrap').classList.add('hidden');

  try {
    const data = await listStudents();
    students = data.applications || [];
    $('studentsLoading').classList.add('hidden');

    if (students.length === 0) {
      $('studentsEmpty').classList.remove('hidden');
      return;
    }

    renderStudents();
    $('studentsTableWrap').classList.remove('hidden');
  } catch (err) {
    $('studentsLoading').classList.add('hidden');
    $('studentsError').textContent = err.message;
    $('studentsError').classList.remove('hidden');
  }
}

function renderStudents() {
  const tbody = $('studentsBody');
  tbody.innerHTML = students.map(s => {
    const meta = statusMeta(s.status);
    const actions = actionHtml(s);
    return `
    <tr>
      <td><input type="checkbox" class="student-checkbox" data-id="${s.applicationId}" onchange="updateSelected()"></td>
      <td class="td-name">${esc(s.fullName)}</td>
      <td>${esc(s.email)}</td>
      <td>${esc(s.programTitle || s.selectedCourse || '—')}</td>
      <td>${esc(s.college)}</td>
      <td>${s.durationDays ? s.durationDays + 'd' : '—'}</td>
      <td><span class="badge ${meta.cls}">${meta.label}</span></td>
      <td class="td-actions">${actions}</td>
    </tr>`;
  }).join('');

  document.querySelectorAll('.student-checkbox').forEach(cb => {
    cb.addEventListener('change', updateSelected);
  });
}

function actionHtml(s) {
  const parts = [];
  if (s.status === 'CERTIFICATE_GENERATED') {
    parts.push('<span class="text-green" style="font-size:12px;font-weight:600;">✓ Generated</span>');
  } else if (s.status === 'COMPLETED') {
    parts.push(`<button class="btn btn-sm btn-primary" onclick="handleGenerate('${s.applicationId}')">Certificate</button>`);
  } else {
    parts.push(`<span class="text-muted" style="font-size:12px;">Awaiting completion</span>`);
  }
  parts.push(`<button class="btn btn-sm btn-outline" onclick="openStudentModal('${s.applicationId}')">View Details</button>`);
  parts.push(`<button class="btn btn-sm btn-outline" onclick="window.open('preview.html?applicationId=${s.applicationId}','_blank')">Preview</button>`);
  return parts.join(' ');
}

function openStudentModal(applicationId) {
  const s = students.find(item => item.applicationId === applicationId);
  if (!s) return;

  const modalBody = $('modalStudentBody');
  modalBody.innerHTML = `
    <div class="student-detail-grid">
      <div class="detail-item">
        <span class="detail-label">Application ID</span>
        <span class="detail-val font-mono">${esc(s.applicationId)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Full Name</span>
        <span class="detail-val font-bold">${esc(s.fullName)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Email Address</span>
        <span class="detail-val">${esc(s.email)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Phone Number</span>
        <span class="detail-val">${esc(s.countryCode)} ${esc(s.phone)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">College / University</span>
        <span class="detail-val">${esc(s.college)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Register Number</span>
        <span class="detail-val font-mono">${esc(s.registerNo)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Degree & Stream</span>
        <span class="detail-val">${esc(s.degree || '—')} (${esc(s.stream || '—')})</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Graduation Year</span>
        <span class="detail-val">${esc(s.graduationYear)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Program / Course</span>
        <span class="detail-val text-primary font-bold">${esc(s.programTitle || s.selectedCourse || '—')}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Schedule Dates</span>
        <span class="detail-val">${esc(dateOnly(s.startDate))} to ${esc(dateOnly(s.endDate))}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Duration</span>
        <span class="detail-val">${s.durationDays || '—'} Days</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Payment Option</span>
        <span class="detail-val">${esc(s.paymentOption)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Project Report Included</span>
        <span class="detail-val">${s.reportIncluded ? 'Yes (+₹200)' : 'No'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Application Status</span>
        <span class="detail-val">${statusMeta(s.status).label}</span>
      </div>
    </div>
  `;

  $('modalGenerateBtn').onclick = () => {
    closeStudentModal();
    handleGenerate(s.applicationId);
  };
  $('modalPreviewBtn').onclick = () => {
    window.open(`preview.html?applicationId=${s.applicationId}`, '_blank');
  };
  $('modalGenerateBtn').style.display = s.status === 'COMPLETED' ? '' : 'none';

  $('studentModal').classList.remove('hidden');
}

function closeStudentModal() {
  $('studentModal').classList.add('hidden');
}

if ($('closeStudentModal')) $('closeStudentModal').onclick = closeStudentModal;
if ($('modalCloseBtn')) $('modalCloseBtn').onclick = closeStudentModal;
if ($('studentModal')) {
  $('studentModal').addEventListener('click', (e) => {
    if (e.target === $('studentModal')) closeStudentModal();
  });
}

function updateSelected() {
  selectedIds = new Set();
  document.querySelectorAll('.student-checkbox:checked').forEach(cb => {
    selectedIds.add(cb.dataset.id);
  });
  const btnCert = $('bulkGenerateBtn');

  if (selectedIds.size > 0) {
    if (btnCert) {
      btnCert.textContent = `Generate Certificates (${selectedIds.size})`;
      btnCert.classList.remove('hidden');
    }
  } else {
    if (btnCert) btnCert.classList.add('hidden');
  }
}

/* ============================================================
   Format Selection Modal
   ============================================================ */
let pendingGenerationTarget = null;

function openFormatModal(target) {
  pendingGenerationTarget = target;
  const isBulk = target.type === 'bulk';
  const count = isBulk ? target.studentIds.length : 1;

  if ($('formatModalTitle')) {
    $('formatModalTitle').textContent = isBulk
      ? `Generate ${count} Certificates`
      : `Select Certificate Format`;
  }

  if ($('formatModalSub')) {
    $('formatModalSub').textContent = isBulk
      ? `Choose how you want to download certificates for ${count} selected students:`
      : `Choose the file format to download the certificate:`;
  }

  if ($('formatModal')) $('formatModal').classList.remove('hidden');
}

function closeFormatModal() {
  if ($('formatModal')) $('formatModal').classList.add('hidden');
  pendingGenerationTarget = null;
}

document.querySelectorAll('.format-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.format-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

if ($('closeFormatModal')) $('closeFormatModal').onclick = closeFormatModal;
if ($('cancelFormatBtn')) $('cancelFormatBtn').onclick = closeFormatModal;
if ($('formatModal')) {
  $('formatModal').addEventListener('click', (e) => {
    if (e.target === $('formatModal')) closeFormatModal();
  });
}

if ($('confirmFormatBtn')) {
  $('confirmFormatBtn').addEventListener('click', async () => {
    if (!pendingGenerationTarget) return;
    const selectedFormat = document.querySelector('input[name="certFormat"]:checked')?.value || 'png';
    const target = pendingGenerationTarget;
    closeFormatModal();

    if (target.type === 'single') {
      await processSingleGeneration(target.studentId, selectedFormat);
    } else if (target.type === 'bulk') {
      await processBulkGeneration(target.studentIds, selectedFormat);
    }
  });
}

/* ============================================================
   Certificate render helpers (matches preview.html format)
   ============================================================ */
function populateRenderCertificate(student, cert) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const fmt = (iso) => {
    if (!iso) return "";
    const [y,m,d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return `${String(d).padStart(2,"0")} ${months[m-1]} ${y}`;
  };

  if ($('renderStudentName')) $('renderStudentName').textContent = student.fullName || cert.studentName || 'Student Name';
  if ($('renderDomain')) $('renderDomain').textContent = student.programTitle || student.selectedCourse || student.domain || cert.course || 'Web Development';
  if ($('renderCollege')) $('renderCollege').textContent = student.college || cert.college || 'the institution';
  if ($('renderRegisterNo')) $('renderRegisterNo').textContent = student.registerNo || cert.registerNo || '—';
  if ($('renderStartDate')) $('renderStartDate').textContent = fmt(dateOnly(student.startDate || cert.startDate)) || '—';
  if ($('renderEndDate')) $('renderEndDate').textContent = fmt(dateOnly(student.endDate || cert.endDate)) || '—';
  if ($('renderDuration')) $('renderDuration').textContent = (student.durationDays || cert.duration) ? `${student.durationDays || cert.duration} Days` : '—';
  if ($('renderIssueDate')) $('renderIssueDate').textContent = fmt(dateOnly(cert.issueDate || cert.issuedAt || new Date().toISOString()));
  if ($('renderVerifyId')) $('renderVerifyId').textContent = cert.certificateId || '—';

  const qrImg = $('renderQrImage');
  if (qrImg) {
    const qrUrl = cert.verificationUrl || `${window.location.origin}/verify/${cert.certificateId}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(qrUrl)}`;
  }
}

async function captureCertificateDataUrl(student, cert) {
  populateRenderCertificate(student, cert);
  await new Promise(r => setTimeout(r, 120));
  const certEl = $('certificateRender');
  const canvas = await html2canvas(certEl, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff'
  });
  return canvas.toDataURL('image/png');
}

/* ============================================================
   Download helpers
   ============================================================ */
function triggerFileDownload(urlOrBlob, filename) {
  const link = document.createElement('a');
  link.href = typeof urlOrBlob === 'string' ? urlOrBlob : URL.createObjectURL(urlOrBlob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (typeof urlOrBlob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
  }
}

async function getUrlAsBlob(url) {
  const res = await fetch(url);
  return await res.blob();
}

async function downloadSingleImage(cert) {
  const filename = `ATIDETO_Certificate_${(cert.studentName || 'certificate').replace(/\s+/g, '_')}_${cert.certificateId}.png`;
  if (cert.imgUrl) {
    if (cert.imgUrl.startsWith('data:')) {
      triggerFileDownload(cert.imgUrl, filename);
    } else {
      const blob = await getUrlAsBlob(cert.imgUrl);
      triggerFileDownload(blob, filename);
    }
  } else {
    throw new Error('Image file not returned from server');
  }
}

async function downloadSinglePdf(cert) {
  const filename = `ATIDETO_Certificate_${(cert.studentName || 'certificate').replace(/\s+/g, '_')}_${cert.certificateId}.pdf`;
  if (cert.pdfUrl) {
    if (cert.pdfUrl.startsWith('data:')) {
      triggerFileDownload(cert.pdfUrl, filename);
    } else {
      const blob = await getUrlAsBlob(cert.pdfUrl);
      triggerFileDownload(blob, filename);
    }
  } else {
    throw new Error('PDF file not returned from server');
  }
}

async function downloadBulkZip(certs) {
  if (typeof JSZip === 'undefined') {
    throw new Error('JSZip library is not loaded');
  }
  const zip = new JSZip();
  const folder = zip.folder('ATIDETO_Certificates');

  for (let i = 0; i < certs.length; i++) {
    const c = certs[i];
    const filename = `${(c.studentName || 'student').replace(/\s+/g, '_')}_${c.certificateId}.png`;
    if (c.imgUrl) {
      if (c.imgUrl.startsWith('data:image/png;base64,')) {
        const base64Data = c.imgUrl.replace(/^data:image\/png;base64,/, '');
        folder.file(filename, base64Data, { base64: true });
      } else {
        const blob = await getUrlAsBlob(c.imgUrl);
        folder.file(filename, blob);
      }
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().slice(0, 10);
  triggerFileDownload(zipBlob, `ATIDETO_Certificates_${timestamp}.zip`);
}

async function downloadBulkCombinedPdf(certs) {
  const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDF) {
    throw new Error('jsPDF library is not loaded');
  }

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < certs.length; i++) {
    const c = certs[i];
    if (i > 0) {
      pdf.addPage('a4', 'landscape');
    }
    if (c.imgUrl) {
      const dataUrl = await getUrlAsDataUrl(c.imgUrl);
      pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
    }
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  pdf.save(`ATIDETO_Certificates_Combined_${timestamp}.pdf`);
}

async function getUrlAsDataUrl(url) {
  if (url.startsWith('data:')) return url;
  const blob = await getUrlAsBlob(url);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ============================================================
   Single / Bulk generation (main backend API)
   ============================================================ */
async function handleGenerate(applicationId) {
  showMsg('');
  openFormatModal({ type: 'single', studentId: applicationId });
}

async function processSingleGeneration(applicationId, format) {
  showMsg('Generating certificate, please wait...');
  try {
    const result = await generateCertificate(applicationId);
    const cert = result.data && result.data.certificate;
    if (!cert) throw new Error('No certificate returned from server');

    const student = students.find(s => s.applicationId === applicationId)
      || { fullName: cert.studentName, college: cert.college, programTitle: cert.course };

    const dataUrl = await captureCertificateDataUrl(student, cert);
    cert.imgUrl = dataUrl;

    if (format === 'png') {
      await downloadSingleImage(cert);
    } else {
      const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
      if (jsPDF) {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
        const name = (cert.studentName || 'certificate').trim().replace(/\s+/g, '_');
        pdf.save(`ATIDETO_Certificate_${name}_${cert.certificateId}.pdf`);
      } else {
        await downloadSinglePdf(cert);
      }
    }

    showMsg(`Certificate generated and downloaded (${format.toUpperCase()}): ${cert.certificateId}`);
    loadStudents();
  } catch (err) {
    showMsg(`Generation failed: ${err.message}`, true);
  }
}

if ($('bulkGenerateBtn')) {
  $('bulkGenerateBtn').addEventListener('click', async () => {
    showMsg('');
    if (selectedIds.size === 0) return;
    openFormatModal({ type: 'bulk', studentIds: [...selectedIds] });
  });
}

async function processBulkGeneration(applicationIds, format) {
  showMsg(`Generating certificates for ${applicationIds.length} students, please wait...`);
  try {
    const generatedCerts = [];
    const failed = [];

    for (const id of applicationIds) {
      try {
        const res = await generateCertificate(id);
        if (res.success && res.data && res.data.certificate) {
          const cert = res.data.certificate;
          const student = students.find(s => s.applicationId === id)
            || { fullName: cert.studentName, college: cert.college, programTitle: cert.course };
          const dataUrl = await captureCertificateDataUrl(student, cert);
          cert.imgUrl = dataUrl;
          generatedCerts.push(cert);
        } else {
          failed.push(id);
        }
      } catch (err) {
        failed.push(id);
      }
    }

    if (generatedCerts.length === 0) {
      throw new Error('Failed to generate certificates for selected students.');
    }

    if (format === 'png') {
      await downloadBulkZip(generatedCerts);
      showMsg(`Successfully generated and downloaded ${generatedCerts.length} certificate images as a ZIP file!${failed.length ? ` (Failed: ${failed.length})` : ''}`);
    } else {
      await downloadBulkCombinedPdf(generatedCerts);
      showMsg(`Successfully generated and downloaded ${generatedCerts.length} certificates in a single combined PDF document!${failed.length ? ` (Failed: ${failed.length})` : ''}`);
    }

    selectedIds = new Set();
    if ($('bulkGenerateBtn')) $('bulkGenerateBtn').classList.add('hidden');
    loadStudents();
  } catch (err) {
    showMsg(`Bulk generation failed: ${err.message}`, true);
  }
}

$('refreshStudentsBtn').addEventListener('click', loadStudents);

/* ============================================================
   Certificates tab
   ============================================================ */
async function loadCertificates() {
  $('certsLoading').classList.remove('hidden');
  $('certsError').classList.add('hidden');
  $('certsEmpty').classList.add('hidden');
  $('certsTableWrap').classList.add('hidden');

  try {
    const data = await listCertificates();
    certificates = data.certificates || [];
    $('certsLoading').classList.add('hidden');

    if (certificates.length === 0) {
      $('certsEmpty').classList.remove('hidden');
      return;
    }

    renderCertificates();
    $('certsTableWrap').classList.remove('hidden');
  } catch (err) {
    $('certsLoading').classList.add('hidden');
    $('certsError').textContent = err.message;
    $('certsError').classList.remove('hidden');
  }
}

function renderCertificates() {
  const tbody = $('certsBody');
  tbody.innerHTML = certificates.map(c => `
    <tr>
      <td class="td-id">${esc(c.certificateId)}</td>
      <td class="td-name">${esc(c.studentName)}</td>
      <td>${esc(c.course)}</td>
      <td>${esc(c.college)}</td>
      <td>${c.issueDate ? fmtDate(c.issueDate) : '—'}</td>
      <td><span class="badge ${c.status === 'active' ? 'status-green' : 'status-red'}">${c.status === 'active' ? 'Active' : 'Revoked'}</span></td>
      <td class="td-actions">
        ${c.status === 'active'
          ? `<button class="btn btn-sm btn-danger" onclick="handleRevoke('${c.certificateId}')">Revoke</button>
             <button class="btn btn-sm btn-outline" onclick="window.open('verify.html?id=${c.certificateId}','_blank')">View</button>`
          : '<span class="text-muted">Revoked</span>'
        }
      </td>
    </tr>
  `).join('');
}

async function handleRevoke(certId) {
  if (!confirm(`Revoke certificate ${certId}?`)) return;
  showMsg('');
  try {
    await revokeCertificate(certId);
    showMsg('Certificate revoked');
    loadCertificates();
  } catch (err) {
    showMsg(err.message, true);
  }
}

$('refreshCertificatesBtn').addEventListener('click', loadCertificates);

function esc(s) {
  if (!s) return '—';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function fmtDate(t) {
  if (!t) return '—';
  if (t.toDate) t = t.toDate();
  if (typeof t === 'string') t = new Date(t);
  return t.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* Init */
initAuth();
