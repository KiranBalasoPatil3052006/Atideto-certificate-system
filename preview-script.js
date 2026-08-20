/* ============================================================
   ATIDETO Technologies — Internship Certificate Generator
   Live preview + QR generation + PNG/PDF export
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

function dateOnly(v){
  if(!v) return "";
  return String(v).slice(0, 10);
}

const directFields = {
  studentName: "out-studentName",
  domain: "out-domain",
  collegeName: "out-collegeName",
  registerNo: "out-registerNo",
  duration: "out-duration",
  verifyId: "out-verifyId",
  founderName: "out-founderName",
  mail: "out-mail",
  contact: "out-contact",
  website: "out-website",
  udyamId: "out-udyamId",
  certEyebrowInput: "out-eyebrow",
  certTitleInput: "out-title",
  certDescParagraphInput: "out-descParagraph"
};

/* Date fields that need reformatting */
const dateFields = {
  startDate: "out-startDate",
  endDate: "out-endDate",
  issueDate: "out-issueDate"
};

let qrDebounce = null;

function updateQr(){
  const link = $("qrLink").value.trim();
  const qrImg = $("qrImage");
  if(!link){
    qrImg.src = "assets/qr-placeholder.png";
    return;
  }
  // Uses a free public QR generation API. Falls back to the bundled
  // placeholder image automatically if the request fails (e.g. offline).
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(link)}`;
  const test = new Image();
  test.onload = () => { qrImg.src = apiUrl; };
  test.onerror = () => { qrImg.src = "assets/qr-placeholder.png"; };
  test.src = apiUrl;
}

function renderAll(){
  Object.entries(directFields).forEach(([inputId, outId]) => {
    const inputEl = $(inputId);
    const outEl = $(outId);
    if(inputEl && outEl){
      outEl.textContent = inputEl.value || "—";
    }
  });

  Object.entries(dateFields).forEach(([inputId, outId]) => {
    const inputEl = $(inputId);
    const outEl = $(outId);
    if(inputEl && outEl){
      outEl.textContent = formatDate(inputEl.value) || "—";
    }
  });
}

function attachLiveListeners(){
  const form = $("certForm");
  form.addEventListener("input", (e) => {
    renderAll();
    if(e.target.id === "verifyId" && !$("qrLink").dataset.userEdited){
      const val = e.target.value.trim();
      $("qrLink").value = val ? `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(val)}` : "";
      updateQr();
    }
  });

  $("qrLink").addEventListener("input", () => {
    $("qrLink").dataset.userEdited = "true";
    clearTimeout(qrDebounce);
    qrDebounce = setTimeout(updateQr, 500);
  });


}

/* ============================================================
   Export: PNG
   ============================================================ */
function downloadPng(){
  const cert = $("certificate");
  const btn = $("downloadPng");
  const originalLabel = btn.textContent;
  btn.textContent = "Generating…";
  btn.disabled = true;

  html2canvas(cert, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff"
  }).then((canvas) => {
    const link = document.createElement("a");
    const name = ($("studentName").value || "certificate").trim().replace(/\s+/g,"_");
    link.download = `ATIDETO_Certificate_${name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    btn.textContent = originalLabel;
    btn.disabled = false;
  }).catch((err) => {
    console.error("PNG export failed:", err);
    alert("Something went wrong generating the PNG. Please try again.");
    btn.textContent = originalLabel;
    btn.disabled = false;
  });
}

/* ============================================================
   Export: PDF
   ============================================================ */
function downloadPdf(){
  const cert = $("certificate");
  const btn = $("downloadPdf");
  const originalLabel = btn.textContent;
  btn.textContent = "Generating…";
  btn.disabled = true;

  html2canvas(cert, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff"
  }).then((canvas) => {
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL("image/png");

    // A4 landscape in mm
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
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
    const name = ($("studentName").value || "certificate").trim().replace(/\s+/g,"_");
    pdf.save(`ATIDETO_Certificate_${name}.pdf`);

    btn.textContent = originalLabel;
    btn.disabled = false;
  }).catch((err) => {
    console.error("PDF export failed:", err);
    alert("Something went wrong generating the PDF. Please try again.");
    btn.textContent = originalLabel;
    btn.disabled = false;
  });
}

/* ============================================================
   Design & Typography Studio JS
   ============================================================ */

const loadedGoogleFonts = new Set(["Playfair Display", "Cormorant Garamond", "Inter", "JetBrains Mono"]);

function loadGoogleFont(fontName) {
  if (!fontName || loadedGoogleFonts.has(fontName)) return;
  const cleanName = fontName.trim();
  const fontSlug = cleanName.replace(/\s+/g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontSlug}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap`;
  document.head.appendChild(link);
  loadedGoogleFonts.add(cleanName);
}

const elemTargets = {
  certName: { selector: ".cert-name", label: "Student Name Styling" },
  certTitle: { selector: ".cert-title", label: "Certificate Title Styling" },
  certEyebrow: { selector: ".cert-eyebrow", label: "Eyebrow Text Styling" },
  certDomain: { selector: ".cert-domain span", label: "Domain Badge Text Styling" },
  certDesc: { selector: ".cert-description", label: "Description Paragraphs Styling" },
  certSignatory: { selector: "#out-founderName", label: "Signatory Name Styling" },
  certMeta: { selector: ".cert-meta p b", label: "IDs & Metadata Styling" }
};

let activeElemKey = "certName";

function getActiveTarget() {
  const info = elemTargets[activeElemKey];
  return info ? document.querySelector(info.selector) : null;
}

function updateControlsFromElement() {
  const el = getActiveTarget();
  if (!el) return;
  const computed = window.getComputedStyle(el);

  if($("currentElemTitle")) $("currentElemTitle").textContent = elemTargets[activeElemKey].label;

  // Font family
  let fontFamily = computed.fontFamily.replace(/["']/g, "").split(",")[0].trim();
  if($("fontFamilySelect")) $("fontFamilySelect").value = fontFamily;

  // Color
  let colorHex = rgbToHex(computed.color) || "#12539c";
  if($("elemColorPicker")) $("elemColorPicker").value = colorHex;
  if($("elemColorHex")) $("elemColorHex").value = colorHex;

  // Font Size
  let fontSize = Math.round(parseFloat(computed.fontSize)) || 16;
  if($("fontSizeRange")) $("fontSizeRange").value = fontSize;
  if($("fontSizeVal")) $("fontSizeVal").textContent = fontSize + "px";

  // Font Weight
  if($("fontWeightSelect")) $("fontWeightSelect").value = computed.fontWeight || "600";

  // Font Style (Italic)
  if($("italicToggleBtn")) {
    if (computed.fontStyle === "italic") {
      $("italicToggleBtn").classList.add("active");
    } else {
      $("italicToggleBtn").classList.remove("active");
    }
  }

  // Letter Spacing
  let spacing = parseFloat(computed.letterSpacing) || 0;
  if($("letterSpacingRange")) $("letterSpacingRange").value = spacing;
  if($("letterSpacingVal")) $("letterSpacingVal").textContent = spacing + "px";
}

function applyStyleToActiveElem(prop, value) {
  const info = elemTargets[activeElemKey];
  if (!info) return;
  const els = document.querySelectorAll(info.selector);
  els.forEach(el => {
    el.style[prop] = value;
  });
}

function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  if (rgb.startsWith("#")) return rgb;
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "#000000";
  return "#" + [m[1], m[2], m[3]].map(x => parseInt(x).toString(16).padStart(2, "0")).join("");
}

function initStudioEvents() {
  const modal = $("customizeModal");
  if(!modal) return;

  const openModal = () => {
    modal.classList.remove("hidden");
    updateControlsFromElement();
  };
  const closeModal = () => {
    modal.classList.add("hidden");
  };

  if ($("openCustomizeModal")) $("openCustomizeModal").addEventListener("click", openModal);
  if ($("openCustomizeModalRight")) $("openCustomizeModalRight").addEventListener("click", openModal);
  if ($("closeCustomizeModal")) $("closeCustomizeModal").addEventListener("click", closeModal);
  if ($("closeModalDone")) $("closeModalDone").addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Tab switcher
  document.querySelectorAll(".studio-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".studio-tabs .tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      if ($(tabId)) $(tabId).classList.remove("hidden");
    });
  });

  // Element picker
  document.querySelectorAll(".element-options .elem-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".element-options .elem-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeElemKey = btn.getAttribute("data-elem");
      updateControlsFromElement();
    });
  });

  // Controls change events
  if($("fontFamilySelect")) {
    $("fontFamilySelect").addEventListener("change", (e) => {
      const font = e.target.value;
      loadGoogleFont(font);
      applyStyleToActiveElem("fontFamily", `'${font}', sans-serif`);
    });
  }

  if($("customFontInput")) {
    $("customFontInput").addEventListener("change", (e) => {
      const font = e.target.value.trim();
      if (font) {
        loadGoogleFont(font);
        applyStyleToActiveElem("fontFamily", `'${font}', sans-serif`);
      }
    });
  }

  if($("elemColorPicker")) {
    $("elemColorPicker").addEventListener("input", (e) => {
      const color = e.target.value;
      if($("elemColorHex")) $("elemColorHex").value = color;
      applyStyleToActiveElem("color", color);
    });
  }

  if($("elemColorHex")) {
    $("elemColorHex").addEventListener("input", (e) => {
      const color = e.target.value;
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        if($("elemColorPicker")) $("elemColorPicker").value = color;
        applyStyleToActiveElem("color", color);
      }
    });
  }

  if($("fontWeightSelect")) {
    $("fontWeightSelect").addEventListener("change", (e) => {
      applyStyleToActiveElem("fontWeight", e.target.value);
    });
  }

  if($("fontSizeRange")) {
    $("fontSizeRange").addEventListener("input", (e) => {
      const val = e.target.value;
      if($("fontSizeVal")) $("fontSizeVal").textContent = val + "px";
      applyStyleToActiveElem("fontSize", val + "px");
    });
  }

  if($("fontSizeDecBtn")) {
    $("fontSizeDecBtn").addEventListener("click", () => {
      const range = $("fontSizeRange");
      if(range) {
        let val = Math.max(parseInt(range.min, 10), parseInt(range.value, 10) - 1);
        range.value = val;
        if($("fontSizeVal")) $("fontSizeVal").textContent = val + "px";
        applyStyleToActiveElem("fontSize", val + "px");
      }
    });
  }

  if($("fontSizeIncBtn")) {
    $("fontSizeIncBtn").addEventListener("click", () => {
      const range = $("fontSizeRange");
      if(range) {
        let val = Math.min(parseInt(range.max, 10), parseInt(range.value, 10) + 1);
        range.value = val;
        if($("fontSizeVal")) $("fontSizeVal").textContent = val + "px";
        applyStyleToActiveElem("fontSize", val + "px");
      }
    });
  }

  if($("italicToggleBtn")) {
    $("italicToggleBtn").addEventListener("click", () => {
      const btn = $("italicToggleBtn");
      btn.classList.toggle("active");
      const isItalic = btn.classList.contains("active");
      applyStyleToActiveElem("fontStyle", isItalic ? "italic" : "normal");
    });
  }

  if($("letterSpacingRange")) {
    $("letterSpacingRange").addEventListener("input", (e) => {
      const val = e.target.value;
      if($("letterSpacingVal")) $("letterSpacingVal").textContent = val + "px";
      applyStyleToActiveElem("letterSpacing", val + "px");
    });
  }

  // Swatches
  document.querySelectorAll(".swatch").forEach(btn => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color");
      if($("elemColorPicker")) $("elemColorPicker").value = color;
      if($("elemColorHex")) $("elemColorHex").value = color;
      applyStyleToActiveElem("color", color);
    });
  });

  // Themes
  const themes = {
    classic: {
      certName: { font: "Cormorant Garamond", color: "#12539c", style: "italic", weight: "600" },
      certTitle: { font: "Playfair Display", color: "#0b2545", style: "normal", weight: "800" },
      certDomain: { font: "Inter", color: "#12539c", style: "normal", weight: "700" }
    },
    calligraphy: {
      certName: { font: "Great Vibes", color: "#6b1224", style: "italic", weight: "400" },
      certTitle: { font: "Bodoni Moda", color: "#0b2545", style: "normal", weight: "800" },
      certDomain: { font: "Inter", color: "#6b1224", style: "normal", weight: "700" }
    },
    modern: {
      certName: { font: "Montserrat", color: "#0d5c3a", style: "normal", weight: "700" },
      certTitle: { font: "Poppins", color: "#0b2545", style: "normal", weight: "800" },
      certDomain: { font: "Outfit", color: "#0d5c3a", style: "normal", weight: "700" }
    },
    vintage: {
      certName: { font: "Tangerine", color: "#a8791f", style: "italic", weight: "700" },
      certTitle: { font: "Cinzel", color: "#0b2545", style: "normal", weight: "700" },
      certDomain: { font: "Spectral", color: "#a8791f", style: "normal", weight: "700" }
    },
    tech: {
      certName: { font: "JetBrains Mono", color: "#1f6fd6", style: "normal", weight: "700" },
      certTitle: { font: "Outfit", color: "#0b2545", style: "normal", weight: "800" },
      certDomain: { font: "JetBrains Mono", color: "#1f6fd6", style: "normal", weight: "700" }
    }
  };

  document.querySelectorAll(".theme-card").forEach(card => {
    card.addEventListener("click", () => {
      const themeKey = card.getAttribute("data-theme");
      const themeConfig = themes[themeKey];
      if (!themeConfig) return;
      Object.entries(themeConfig).forEach(([elemKey, cfg]) => {
        const info = elemTargets[elemKey];
        if (!info) return;
        loadGoogleFont(cfg.font);
        const els = document.querySelectorAll(info.selector);
        els.forEach(el => {
          el.style.fontFamily = `'${cfg.font}', sans-serif`;
          el.style.color = cfg.color;
          el.style.fontStyle = cfg.style;
          el.style.fontWeight = cfg.weight;
        });
      });
      updateControlsFromElement();
    });
  });

  // Fonts Explorer Chips & Search
  document.querySelectorAll(".font-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const font = chip.getAttribute("data-font");
      loadGoogleFont(font);
      if($("fontFamilySelect")) $("fontFamilySelect").value = font;
      applyStyleToActiveElem("fontFamily", `'${font}', sans-serif`);
    });
  });

  if ($("applySearchFont")) {
    $("applySearchFont").addEventListener("click", () => {
      const font = $("fontSearchInput").value.trim();
      if (font) {
        loadGoogleFont(font);
        applyStyleToActiveElem("fontFamily", `'${font}', sans-serif`);
      }
    });
  }

  // Reset defaults
  if ($("resetDefaultsBtn")) {
    $("resetDefaultsBtn").addEventListener("click", () => {
      Object.values(elemTargets).forEach(info => {
        const els = document.querySelectorAll(info.selector);
        els.forEach(el => {
          el.style.fontFamily = "";
          el.style.color = "";
          el.style.fontStyle = "";
          el.style.fontWeight = "";
          el.style.fontSize = "";
          el.style.letterSpacing = "";
        });
      });
      updateControlsFromElement();
    });
  }
}

function initCompanyModalEvents(){
  const openBtn = $("openCompanyModal");
  const openRightBtn = $("openCompanyModalRight");
  const closeBtn = $("closeCompanyModal");
  const closeDoneBtn = $("closeCompanyModalDone");
  const modal = $("companyModal");

  if (!modal) return;

  function showModal(e) {
    if (e) e.preventDefault();
    modal.classList.remove("hidden");
  }

  function hideModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("hidden");
  }

  if (openBtn) openBtn.addEventListener("click", showModal);
  if (openRightBtn) openRightBtn.addEventListener("click", showModal);
  if (closeBtn) closeBtn.addEventListener("click", hideModal);
  if (closeDoneBtn) closeDoneBtn.addEventListener("click", hideModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) hideModal(e);
  });

  modal.addEventListener("input", () => {
    renderAll();
  });
}

/* ============================================================
   Backend Integration
   ============================================================ */

/* Load student list from API */
async function loadStudentDropdown() {
  try {
    const data = await listStudents();
    const students = data.applications || [];
    const select = $("studentSelect");
    select.innerHTML = '<option value="">— Manual Entry —</option>';

    students.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.applicationId;
      opt.textContent = `${s.fullName || 'Unknown'} — ${s.programTitle || s.selectedCourse || s.domain || 'Course'}`;
      select.appendChild(opt);
    });

    /* Check URL for studentId */
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get("applicationId") || params.get("studentId");
    if (studentId) {
      select.value = studentId;
      loadStudentData(studentId);
    }
  } catch (err) {
    console.warn("Could not load students:", err.message);
  }
}

/* Fill form from student data */
async function loadStudentData(studentId) {
  if (!studentId) return;
  try {
    const data = await listStudents();
    const student = (data.applications || []).find(s => s.applicationId === studentId);
    if (!student) return;

    $("studentName").value = student.fullName || "";
    $("collegeName").value = student.college || "";
    $("registerNo").value = student.registerNo || "";
    $("domain").value = student.programTitle || student.selectedCourse || student.domain || "";
    $("startDate").value = dateOnly(student.startDate) || "";
    $("endDate").value = dateOnly(student.endDate) || "";
    $("duration").value = student.durationDays ? student.durationDays + " Days" : "";
    $("issueDate").value = new Date().toISOString().split("T")[0];

    let certId = student.certificateId || "";
    if (!certId && (student.status === 'CERTIFICATE_GENERATED' || student.status === 'COMPLETED')) {
      try {
        const certRes = await listCertificates();
        const existing = (certRes.certificates || []).find(c => c.applicationId === studentId);
        if (existing) {
          certId = existing.certificateId;
        }
      } catch (e) {
        // ignore
      }
    }

    $("verifyId").value = certId || `ATI-CERT-${new Date().getFullYear()}-000001`;
    $("qrLink").value = certId
      ? `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(certId)}`
      : `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent($("verifyId").value)}`;

    renderAll();
    updateQr();

    $("studentSelect").value = studentId;
  } catch (err) {
    console.warn("Could not load student:", err.message);
  }
}

/* Handle student selection */
$("studentSelect").addEventListener("change", (e) => {
  if (e.target.value) {
    loadStudentData(e.target.value);
  }
});

/* Generate via Backend */
$("generateBackendBtn").addEventListener("click", async () => {
  const btn = $("generateBackendBtn");
  const resultEl = $("generateResult");
  const originalText = btn.textContent;

  /* Get the studentId from dropdown if a student is loaded */
  const select = $("studentSelect");
  const studentId = select.value;

  if (!studentId) {
    resultEl.style.display = "block";
    resultEl.style.background = "rgba(255,193,7,0.12)";
    resultEl.style.color = "#D97706";
    resultEl.textContent = "Select a student from the dropdown first.";
    return;
  }

  btn.textContent = "Generating...";
  btn.disabled = true;
  resultEl.style.display = "none";

  try {
    const result = await generateCertificate(studentId);
    const cert = (result.data && result.data.certificate) || result.certificate;

    if (!cert || !cert.certificateId) {
      throw new Error("No certificate record returned from server");
    }

    const verifyUrl = cert.verificationUrl || `studentverify.html?id=${encodeURIComponent(cert.certificateId)}`;

    resultEl.style.display = "block";
    resultEl.style.background = "rgba(5,150,105,0.12)";
    resultEl.style.color = "#059669";
    resultEl.style.border = "1px solid rgba(5,150,105,0.3)";
    resultEl.style.padding = "12px 14px";
    resultEl.style.borderRadius = "10px";
    resultEl.innerHTML = `
      <div style="font-weight:700;margin-bottom:6px;">✓ Certificate Generated: ${cert.certificateId}</div>
      <div style="font-size:13px;color:#334155;margin-bottom:8px;">Student verified in ATIDETO system. Opening verification portal...</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a href="${verifyUrl}" target="_blank" class="btn btn-sm btn-primary" style="text-decoration:none;color:#fff;background:#059669;padding:6px 14px;border-radius:8px;font-weight:700;display:inline-flex;align-items:center;gap:6px;">
          View Verified Student Portal →
        </a>
      </div>
    `;

    /* Update form with autogenerated data */
    $("verifyId").value = cert.certificateId || "";
    $("qrLink").value = `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(cert.certificateId)}`;
    renderAll();
    updateQr();

    /* Automatically open student verification portal in a new tab */
    window.open(verifyUrl, '_blank');
  } catch (err) {
    const match = err.message.match(/\((ATI-CERT-[^)]+)\)/);
    if (match) {
      const existingId = match[1];
      const verifyUrl = `studentverify.html?id=${encodeURIComponent(existingId)}`;
      $("verifyId").value = existingId;
      $("qrLink").value = `https://atideto-certificate-system.vercel.app/studentverify.html?id=${encodeURIComponent(existingId)}`;
      renderAll();
      updateQr();

      resultEl.style.display = "block";
      resultEl.style.background = "rgba(37,99,235,0.12)";
      resultEl.style.color = "#2563EB";
      resultEl.style.border = "1px solid rgba(37,99,235,0.3)";
      resultEl.style.padding = "12px 14px";
      resultEl.style.borderRadius = "10px";
      resultEl.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px;">ℹ Certificate Already Exists: ${existingId}</div>
        <div style="font-size:13px;color:#334155;margin-bottom:8px;">Opening verified student record...</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a href="${verifyUrl}" target="_blank" class="btn btn-sm btn-primary" style="text-decoration:none;color:#fff;background:#2563EB;padding:6px 14px;border-radius:8px;font-weight:700;display:inline-flex;align-items:center;gap:6px;">
            View Verified Student Portal →
          </a>
        </div>
      `;
      window.open(verifyUrl, '_blank');
      return;
    }

    resultEl.style.display = "block";
    resultEl.style.background = "rgba(220,38,38,0.1)";
    resultEl.style.color = "#DC2626";
    resultEl.style.border = "1px solid rgba(220,38,38,0.2)";
    resultEl.style.padding = "10px 14px";
    resultEl.style.borderRadius = "8px";
    resultEl.textContent = "Error: " + err.message;
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
});

async function checkAuth() {
  try {
    await fetchMe();
  } catch (e) {
    window.location.href = "index.html";
  }
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth();
  renderAll();
  updateQr();
  attachLiveListeners();
  initStudioEvents();
  initCompanyModalEvents();
  loadStudentDropdown();

  $("downloadPng").addEventListener("click", downloadPng);
  $("downloadPdf").addEventListener("click", downloadPdf);
});
