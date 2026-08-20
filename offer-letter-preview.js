/* ============================================================
   ATIDETO Technologies — Internship Offer Letter Generator
   Combined with Certificate System Integration
   ============================================================ */

const $ = (id) => document.getElementById(id);

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

function formatDate(isoString){
  if(!isoString) return "";
  const [y,m,d] = isoString.split("-").map(Number);
  if(!y || !m || !d) return isoString;
  return `${String(d).padStart(2,"0")} ${MONTHS[m-1]} ${y}`;
}

/* ============================================================
   1. STUDENT DETAILS — live-bound fields
   ============================================================ */
const directFields = {
  offerNo: ["out-offerNo"],
  domain: ["out-domain"],
  duration: ["out-duration"],
  mode: ["out-mode"],
  collegeName: ["out-collegeName"],
  studentEmail: ["out-studentEmail"],
  studentMobile: ["out-studentMobile"],
  salutation: ["out-salutation"],
  studentName: ["out-studentName", "out-dearName"]
};

const dateFields = {
  offerDate: "out-offerDate",
  startDate: "out-startDate",
  endDate: "out-endDate"
};

function renderStudentFields(){
  Object.entries(directFields).forEach(([inputId, outIds]) => {
    const inputEl = $(inputId);
    if(!inputEl) return;
    outIds.forEach((outId) => {
      const outEl = $(outId);
      if(outEl) outEl.textContent = inputEl.value || "—";
    });
  });

  Object.entries(dateFields).forEach(([inputId, outId]) => {
    const inputEl = $(inputId);
    const outEl = $(outId);
    if(inputEl && outEl){
      outEl.textContent = formatDate(inputEl.value) || "—";
    }
  });
}

function attachStudentFormListeners(){
  const form = $("studentForm");
  if (form) {
    form.addEventListener("input", renderStudentFields);
  }
}

/* ============================================================
   2. TEMPLATE WORDING — contenteditable + localStorage
   ============================================================ */
const TEMPLATE_IDS = [
  "tpl-title","tpl-to","tpl-dear","tpl-intro","tpl-detailsHeading",
  "tpl-closing","tpl-sincerely","tpl-digitalSig","tpl-founder",
  "tpl-companyName","tpl-footerAddress","tpl-footerEmail",
  "tpl-footerPhone","tpl-footerWebsite"
];

const DEFAULT_TEMPLATE = {
  "tpl-title": "INTERNSHIP OFFER LETTER",
  "tpl-to": "To,",
  "tpl-dear": "Dear",
  "tpl-intro": "We are pleased to offer you an internship opportunity with ATIDETO Technologies. This internship is designed to provide practical industry exposure, hands-on learning, and real-world project experience while helping you strengthen your technical and professional skills.",
  "tpl-detailsHeading": "INTERNSHIP DETAILS",
  "tpl-closing": "Upon successful completion of the internship and fulfillment of the program requirements, you will be eligible to receive an Internship Completion Certificate issued by ATIDETO Technologies. We are delighted to welcome you to our team and look forward to supporting your learning and professional growth. We wish you a rewarding and successful internship experience.",
  "tpl-sincerely": "Sincerely,",
  "tpl-digitalSig": "(Digital Signature)",
  "tpl-founder": "Founder",
  "tpl-companyName": "ATIDETO Technologies",
  "tpl-footerAddress": "📍 Ponnamapet, Salem, Tamil Nadu – 636001",
  "tpl-footerEmail": "✉ atideto.in@gmail.com",
  "tpl-footerPhone": "☎ +91 XXXXX XXXXX",
  "tpl-footerWebsite": "🌐 www.atideto.in"
};

const STORAGE_KEY = "atideto_offer_letter_template_v1";

function loadSavedTemplate(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    TEMPLATE_IDS.forEach((id) => {
      const el = $(id);
      if(el && saved[id] !== undefined){
        el.textContent = saved[id];
      }
    });
  }catch(err){
    console.warn("Could not load saved template wording:", err);
  }
}

function saveTemplate(){
  const data = {};
  TEMPLATE_IDS.forEach((id) => {
    const el = $(id);
    if(el) data[id] = el.textContent;
  });
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }catch(err){
    console.warn("Could not save template wording:", err);
  }
}

function resetTemplate(){
  TEMPLATE_IDS.forEach((id) => {
    const el = $(id);
    if(el) el.textContent = DEFAULT_TEMPLATE[id];
  });
  try{ localStorage.removeItem(STORAGE_KEY); }catch(err){/* ignore */}
}

let editModeOn = false;

function setEditMode(on){
  editModeOn = on;
  const letterEl = $("letter");
  if(letterEl) letterEl.classList.toggle("editing-mode", on);

  TEMPLATE_IDS.forEach((id) => {
    const el = $(id);
    if(el) el.setAttribute("contenteditable", on ? "true" : "false");
  });

  if($("toggleEditBtn")) $("toggleEditBtn").classList.toggle("hidden", on);
  if($("editModeControls")) $("editModeControls").classList.toggle("hidden", !on);
}

function attachTemplateEditListeners(){
  if($("toggleEditBtn")) $("toggleEditBtn").addEventListener("click", () => setEditMode(true));

  if($("doneEditBtn")) $("doneEditBtn").addEventListener("click", () => {
    saveTemplate();
    setEditMode(false);
  });

  if($("resetTemplateBtn")) $("resetTemplateBtn").addEventListener("click", () => {
    const confirmed = confirm("Reset all letter wording back to the original default text? Your student details will not be affected.");
    if(confirmed) resetTemplate();
  });

  let autoSaveTimer = null;
  const letter = $("letter");
  if(letter) {
    letter.addEventListener("input", (e) => {
      if(editModeOn && e.target.classList && (e.target.classList.contains("tpl-editable") || e.target.classList.contains("tpl-editable-inline"))){
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveTemplate, 800);
      }
    });
  }
}

/* ============================================================
   3. EXPORT: PNG / PDF
   ============================================================ */
function withExportSafeState(fn){
  const wasEditing = editModeOn;
  if(wasEditing) setEditMode(false);
  return Promise.resolve(fn()).finally(() => {
    if(wasEditing) setEditMode(true);
  });
}

function downloadPng(){
  const btn = $("downloadPng");
  const originalLabel = btn ? btn.textContent : "Download as PNG";
  if(btn) {
    btn.textContent = "Generating…";
    btn.disabled = true;
  }

  withExportSafeState(() =>
    html2canvas($("letter"), { scale: 3, useCORS: true, backgroundColor: "#ffffff" })
      .then((canvas) => {
        const link = document.createElement("a");
        const name = (($("studentName") ? $("studentName").value : "") || "offer_letter").trim().replace(/\s+/g,"_");
        link.download = `ATIDETO_Offer_Letter_${name}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
  ).catch((err) => {
    console.error("PNG export failed:", err);
    alert("Something went wrong generating the PNG. Please try again.");
  }).finally(() => {
    if(btn) {
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  });
}

function downloadPdf(){
  const btn = $("downloadPdf");
  const originalLabel = btn ? btn.textContent : "Download as PDF";
  if(btn) {
    btn.textContent = "Generating…";
    btn.disabled = true;
  }

  withExportSafeState(() =>
    html2canvas($("letter"), { scale: 3, useCORS: true, backgroundColor: "#ffffff" })
      .then((canvas) => {
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgRatio = canvas.width / canvas.height;
        let renderWidth = pageWidth;
        let renderHeight = renderWidth / imgRatio;
        if(renderHeight > pageHeight){
          renderHeight = pageHeight;
          renderWidth = renderHeight * imgRatio;
        }
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
        const name = (($("studentName") ? $("studentName").value : "") || "offer_letter").trim().replace(/\s+/g,"_");
        pdf.save(`ATIDETO_Offer_Letter_${name}.pdf`);
      })
  ).catch((err) => {
    console.error("PDF export failed:", err);
    alert("Something went wrong generating the PDF. Please try again.");
  }).finally(() => {
    if(btn) {
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  });
}

/* ============================================================
   4. SYSTEM INTEGRATION — Load Students & URL Parameters
   ============================================================ */
let loadedStudents = [];

function populateStudentSelect(students) {
  const sel = $("studentSelect");
  if (!sel) return;
  sel.innerHTML = `<option value="">— Select Registered Student —</option>` +
    students.map(s => `<option value="${s.applicationId}">${s.fullName} (${s.programTitle || s.selectedCourse || s.domain || 'Student'})</option>`).join('');
}

function dateOnly(v) {
  if (!v) return "";
  return String(v).slice(0, 10);
}

function selectStudentById(id) {
  const s = loadedStudents.find(item => String(item.applicationId) === String(id));
  if (s) {
    if ($("studentName")) $("studentName").value = s.fullName || "";
    if ($("collegeName")) $("collegeName").value = s.college || "College Student";
    if ($("studentEmail")) $("studentEmail").value = s.email || "";
    if ($("studentMobile")) $("studentMobile").value = s.phone || "";
    if ($("domain")) $("domain").value = s.programTitle || s.selectedCourse || s.domain || "Artificial Intelligence";
    if ($("duration")) $("duration").value = s.durationDays ? `${s.durationDays} Days` : "2 Months";
    if (s.startDate && $("startDate")) $("startDate").value = dateOnly(s.startDate);
    if (s.endDate && $("endDate")) $("endDate").value = dateOnly(s.endDate);
    if ($("offerNo")) $("offerNo").value = `ATIDETO/2026/INT/${String(s.applicationId || "018").slice(-3).padStart(3, "0")}`;
    if ($("studentSelect")) $("studentSelect").value = id;
    renderStudentFields();
  }
}

async function checkAuth() {
  try {
    if (typeof fetchMe === "function") {
      await fetchMe();
    }
  } catch (e) {
    window.location.href = "index.html";
  }
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth();
  loadSavedTemplate();
  renderStudentFields();
  attachStudentFormListeners();
  attachTemplateEditListeners();

  if($("downloadPng")) $("downloadPng").addEventListener("click", downloadPng);
  if($("downloadPdf")) $("downloadPdf").addEventListener("click", downloadPdf);

  // System integration: fetch student list
  try {
    if (typeof listStudents === "function") {
      const res = await listStudents();
      loadedStudents = res.applications || [];
      populateStudentSelect(loadedStudents);
    }
  } catch (err) {
    console.warn("Could not load student list:", err.message);
  }

  // Check URL params
  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("applicationId") || params.get("studentId") || params.get("id");
  if (studentId) {
    selectStudentById(studentId);
  }

  if ($("studentSelect")) {
    $("studentSelect").addEventListener("change", (e) => {
      const id = e.target.value;
      if (id) selectStudentById(id);
    });
  }
});
