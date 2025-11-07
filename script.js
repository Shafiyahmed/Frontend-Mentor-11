// Basic mortgage calculator logic
(function () {
  const $ = selector => document.querySelector(selector);
  const amountEl = $('#amount');
  const termEl = $('#term');
  const rateEl = $('#rate');
  const calculateBtn = $('#calculate');
  const clearBtn = $('#clearAll');
  const monthlyEl = $('#monthly');
  const totalEl = $('#total');
  const form = $('#calculator');

  function formatCurrency(num) {
    if (isNaN(num) || !isFinite(num)) return '£0.00';
    return '£' + Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // monthly repayment for standard amortizing loan
  function calcRepayment(amount, annualRatePct, years) {
    const principal = Number(amount);
    const r = Number(annualRatePct) / 100 / 12; // monthly rate
    const n = Number(years) * 12;
    if (r === 0) return principal / n;
    const monthly = (principal * r) / (1 - Math.pow(1 + r, -n));
    return monthly;
  }

  // interest-only monthly = principal * monthlyRate
  function calcInterestOnly(amount, annualRatePct) {
    const principal = Number(amount);
    const monthlyRate = Number(annualRatePct) / 100 / 12;
    return principal * monthlyRate;
  }

  function readType() {
    const checked = form.querySelector('input[name="type"]:checked');
    return checked ? checked.value : 'repayment';
  }

  function calculateAndRender() {
    const amount = parseFloat(amountEl.value) || 0;
    const term = parseFloat(termEl.value) || 0;
    const rate = parseFloat(rateEl.value) || 0;
    const type = readType();

    if (amount <= 0 || term <= 0 || rate < 0) {
      monthlyEl.textContent = '—';
      totalEl.textContent = '—';
      return;
    }

    let monthly, total;
    if (type === 'repayment') {
      monthly = calcRepayment(amount, rate, term);
      total = monthly * term * 12;
    } else {
      monthly = calcInterestOnly(amount, rate);
      total = monthly * 12 * term; // interest paid over entire term
    }

    monthlyEl.textContent = formatCurrency(monthly);
    totalEl.textContent = formatCurrency(total);
  }

  // initial render
  calculateAndRender();

  calculateBtn.addEventListener('click', calculateAndRender);

  // allow pressing Enter to calculate from any input
  ['amount', 'term', 'rate'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calculateAndRender();
      }
    });
  });

  clearBtn.addEventListener('click', () => {
    amountEl.value = '';
    termEl.value = '';
    rateEl.value = '';
    const radios = form.querySelectorAll('input[name="type"]');
    if (radios && radios.length) radios[0].checked = true;
    monthlyEl.textContent = '£0.00';
    totalEl.textContent = '£0.00';
  });

  // small UX: update results live for nice feedback
  [amountEl, termEl, rateEl].forEach(el => {
    el.addEventListener('input', () => {
      // don't spam: only update when inputs look valid-ish
      calculateAndRender();
    });
  });

})();