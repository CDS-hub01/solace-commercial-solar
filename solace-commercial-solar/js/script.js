/* =========================================
   SOLACE COMMERCIAL SOLAR
   Main JavaScript
========================================= */

/* =========================================
   1. NAVIGATION ELEMENTS
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

const savingsForm = document.getElementById("savings-form");
const buildingAddress = document.getElementById("building-address");
const monthlyBill = document.getElementById("monthly-bill");
const facilityType = document.getElementById("facility-type");
const formFeedback = document.getElementById("form-feedback");

const estimateResult = document.getElementById("estimate-result");

const addressResult = document.getElementById("address-result");
const facilityResult = document.getElementById("facility-result");
const billResult = document.getElementById("bill-result");

const annualSavingsResult = document.getElementById("annual-savings-result");
const monthlySavingsResult = document.getElementById("monthly-savings-result");
const annualBillResult = document.getElementById("annual-bill-result");
const remainingBillResult = document.getElementById("remaining-bill-result");

const downloadPdfButton = document.getElementById("download-pdf");
const printEstimateButton = document.getElementById("print-estimate");

/* =========================================
   2. PROJECT SETTINGS
========================================= */

const SAVINGS_RATE = 0.2;
const CURRENCY = "USD";

let currentEstimate = null;
let isMenuOpen = false;

/* =========================================
   3. CURRENCY FORMATTER
========================================= */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (amount) => {
  return currencyFormatter.format(amount);
};

/* =========================================
   4. MOBILE NAVIGATION
========================================= */

const setMenuState = (isOpen) => {
  if (!menuToggle || !mainNav) return;

  isMenuOpen = isOpen;

  menuToggle.classList.toggle("is-open", isMenuOpen);
  mainNav.classList.toggle("is-open", isMenuOpen);
};

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!isMenuOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = mainNav.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 950) {
      setMenuState(false);
    }
  });
}

/* =========================================
   5. FORM FEEDBACK
========================================= */

const showFeedback = (message) => {
  if (!formFeedback) return;

  formFeedback.textContent = message;
};

const clearFeedback = () => {
  if (!formFeedback) return;

  formFeedback.textContent = "";
};

/* =========================================
   6. FORM VALIDATION
========================================= */

const validateEstimateForm = () => {
  const address = buildingAddress.value.trim();

  const billInput = monthlyBill.value.trim();

  const bill = Number(billInput);

  const facility = facilityType.value;

  if (!address) {
    showFeedback("Please enter your building address.");

    buildingAddress.focus();

    return null;
  }

  if (address.length > 150) {
    showFeedback("Building address must not exceed 150 characters.");

    buildingAddress.focus();

    return null;
  }

  if (
    billInput === "" ||
    !Number.isFinite(bill) ||
    bill <= 0 ||
    bill > 1000000000
  ) {
    showFeedback("Please enter a valid monthly energy bill.");

    monthlyBill.focus();

    return null;
  }

  if (!facility) {
    showFeedback("Please select your facility type.");

    facilityType.focus();

    return null;
  }

  return {
    address,
    bill,
    facility,
  };
};

/* =========================================
   7. SOLAR SAVINGS CALCULATIONS
========================================= */

const calculateSavings = (bill) => {
  const monthlySavings = bill * SAVINGS_RATE;

  const annualSavings = monthlySavings * 12;

  const annualBill = bill * 12;

  const remainingMonthlyBill = bill - monthlySavings;

  return {
    monthlySavings,
    annualSavings,
    annualBill,
    remainingMonthlyBill,
  };
};

/* =========================================
   8. UPDATE ESTIMATE REPORT
========================================= */

const updateEstimateReport = (customer, calculations) => {
  addressResult.textContent = customer.address;

  facilityResult.textContent = customer.facility;

  billResult.textContent = formatCurrency(customer.bill);

  monthlySavingsResult.textContent = formatCurrency(
    calculations.monthlySavings,
  );

  annualSavingsResult.textContent = formatCurrency(calculations.annualSavings);

  annualBillResult.textContent = formatCurrency(calculations.annualBill);

  remainingBillResult.textContent = formatCurrency(
    calculations.remainingMonthlyBill,
  );
};

/* =========================================
   9. GENERATE ESTIMATE
========================================= */

const generateEstimate = (customer) => {
  const calculations = calculateSavings(customer.bill);

  currentEstimate = {
    ...customer,
    ...calculations,
    savingsRate: SAVINGS_RATE,
    generatedAt: new Date(),
  };

  updateEstimateReport(customer, calculations);

  estimateResult.hidden = false;

  clearFeedback();

  estimateResult.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
};

/* =========================================
   10. HANDLE FORM SUBMISSION
========================================= */

if (savingsForm) {
  savingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearFeedback();

    const customer = validateEstimateForm();

    if (!customer) return;

    generateEstimate(customer);
  });
}

/* =========================================
   11. PDF DOCUMENT GENERATOR
========================================= */

const downloadEstimatePDF = () => {
  if (!currentEstimate) {
    showFeedback("Please generate an estimate before downloading.");

    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    showFeedback(
      "PDF service could not load. Check your internet connection and reload the page.",
    );

    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const margin = 20;

  const contentWidth = pageWidth - margin * 2;

  let y = 22;

  const addText = (text, x, position, maxWidth = contentWidth) => {
    const lines = doc.splitTextToSize(String(text), maxWidth);

    doc.text(lines, x, position);

    return lines.length * 5;
  };

  // Header

  doc.setFillColor(18, 61, 48);

  doc.rect(0, 0, pageWidth, 42, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(20);

  doc.text("SOLACE", margin, 19);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);

  doc.text("COMMERCIAL SOLAR", margin, 26);

  doc.setFontSize(9);

  doc.text("PRELIMINARY ESTIMATE", pageWidth - margin, 26, {
    align: "right",
  });

  // Document heading

  y = 57;

  doc.setTextColor(18, 61, 48);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(10);

  doc.text("YOUR ENERGY OPPORTUNITY", margin, y);

  y += 10;

  doc.setFont("helvetica", "normal");

  doc.setFontSize(23);

  doc.text("Solar Savings Estimate", margin, y);

  y += 10;

  doc.setTextColor(104, 115, 109);

  doc.setFontSize(9);

  y += addText(
    "A preliminary look at the potential financial impact of commercial solar for your facility.",
    margin,
    y,
  );

  y += 10;

  // Facility details

  doc.setTextColor(18, 61, 48);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(12);

  doc.text("FACILITY DETAILS", margin, y);

  y += 9;

  const details = [
    ["BUILDING ADDRESS", currentEstimate.address],
    ["FACILITY TYPE", currentEstimate.facility],
    ["MONTHLY ENERGY BILL", formatCurrency(currentEstimate.bill)],
    ["ASSUMED SAVINGS RATE", "20%"],
  ];

  details.forEach(([label, value]) => {
    doc.setDrawColor(220, 226, 220);

    doc.line(margin, y, pageWidth - margin, y);

    y += 7;

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.setTextColor(104, 115, 109);

    doc.text(label, margin, y);

    y += 5;

    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);

    doc.setTextColor(29, 41, 36);

    y += addText(value, margin, y);

    y += 5;
  });

  // Financial summary

  y += 5;

  doc.setFillColor(18, 61, 48);

  doc.rect(margin, y, contentWidth, 36, "F");

  y += 10;

  doc.setTextColor(212, 224, 216);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(8);

  doc.text("ESTIMATED ANNUAL SAVINGS", margin + 7, y);

  y += 12;

  doc.setTextColor(232, 173, 61);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(23);

  doc.text(formatCurrency(currentEstimate.annualSavings), margin + 7, y);

  y += 24;

  // Additional financial figures

  const metrics = [
    ["MONTHLY SAVINGS", currentEstimate.monthlySavings],
    ["ANNUAL ENERGY BILL", currentEstimate.annualBill],
    ["REMAINING MONTHLY BILL", currentEstimate.remainingMonthlyBill],
  ];

  metrics.forEach(([label, value]) => {
    doc.setTextColor(104, 115, 109);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.text(label, margin, y);

    doc.setTextColor(18, 61, 48);

    doc.setFont("helvetica", "normal");

    doc.setFontSize(11);

    doc.text(formatCurrency(value), pageWidth - margin, y, {
      align: "right",
    });

    y += 12;
  });

  // Next steps

  y += 5;

  doc.setTextColor(18, 61, 48);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(12);

  doc.text("WHAT'S NEXT?", margin, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.setTextColor(104, 115, 109);

  doc.setFontSize(9);

  y += addText(
    "A detailed site assessment can help determine your facility's solar capacity, installation requirements and actual savings potential.",
    margin,
    y,
  );

  y += 8;

  // Disclaimer

  doc.setDrawColor(220, 226, 220);

  doc.line(margin, y, pageWidth - margin, y);

  y += 8;

  doc.setTextColor(29, 41, 36);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(9);

  doc.text("IMPORTANT ESTIMATE NOTICE", margin, y);

  y += 7;

  doc.setFont("helvetica", "normal");

  doc.setTextColor(104, 115, 109);

  doc.setFontSize(8);

  const disclaimer =
    "This is an illustrative calculation based on an assumed 20% savings rate. Actual savings depend on electricity tariffs, system capacity, roof condition, equipment costs, energy consumption and engineering assessment. This estimate is not a formal engineering, installation or financial proposal.";

  const disclaimerHeight = addText(disclaimer, margin, y);

  y += disclaimerHeight + 10;

  // Footer

  doc.setTextColor(18, 61, 48);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(8);

  doc.text("SOLACE COMMERCIAL SOLAR", margin, y);

  doc.setTextColor(104, 115, 109);

  doc.setFont("helvetica", "normal");

  doc.text(
    `Generated: ${currentEstimate.generatedAt.toLocaleDateString("en-US")}`,
    pageWidth - margin,
    y,
    { align: "right" },
  );

  // Safe filename

  const filename =
    currentEstimate.address
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "commercial-facility";

  doc.save(`solace-solar-estimate-${filename}.pdf`);
};

/* =========================================
   12. DOWNLOAD PDF BUTTON
========================================= */

if (downloadPdfButton) {
  downloadPdfButton.addEventListener("click", () => {
    downloadEstimatePDF();
  });
}

/* =========================================
   13. PRINT ESTIMATE BUTTON
========================================= */

if (printEstimateButton) {
  printEstimateButton.addEventListener("click", () => {
    if (!currentEstimate) {
      showFeedback("Please generate an estimate before printing.");

      return;
    }

    window.print();
  });
}

/* =========================================
   14. END
========================================= */

console.log("Solace Commercial Solar initialized.");
