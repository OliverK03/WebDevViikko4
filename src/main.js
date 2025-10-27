import './style.css'
const app = document.querySelector('#app') || document.body;

function setupProfile() {
  const section = document.querySelector('section.profile');
  if (!section) return;
  const nameInput = section.querySelector('input[name="name"]');
  const emailInput = section.querySelector('input[name="email"]');
  const ageInput = section.querySelector('input[name="age"]');
  const btn = section.querySelector('button');
  const outName = section.querySelector('.profile-name');
  const outEmail = section.querySelector('.profile-email');
  const outAge = section.querySelector('.profile-age');

  function update() {
    if (outName) outName.textContent = (nameInput.value || '—').trim();
    if (outEmail) outEmail.textContent = (emailInput.value || '—').trim();
    if (outAge) outAge.textContent = (ageInput.value || '—').trim();
  }

  if (btn) btn.addEventListener('click', update);
  [nameInput, emailInput, ageInput].forEach(i => {
    if (!i) return;
    i.addEventListener('input', update);
  });
}

// --- Counter logic ---
function setupCounterSection() {
  const section = document.querySelector('section.counter');
  if (!section) return;
  const buttons = section.querySelectorAll('button');
  const decBtn = buttons[0];
  const incBtn = buttons[1];
  const valueEl = section.querySelector('[data-counter], #counterValue, #counter, .counter-value');
  const errorEl = section.querySelector('.counter-error');
  let value = 0;

  function render() {
    if (valueEl) valueEl.textContent = String(value);
    if (errorEl) errorEl.style.display = value < 0 ? '' : 'none';
  }

  if (incBtn) incBtn.addEventListener('click', () => { value = value + 1; render(); });
  if (decBtn) decBtn.addEventListener('click', () => {
    if (value - 1 < 0) {
      if (errorEl) { errorEl.textContent = 'Arvo ei voi olla negatiivinen.'; errorEl.style.display = ''; }
      return;
    }
    value = value - 1;
    render();
  });

  render();
}

// --- RGB panel logic ---
function setupRgbPanel() {
  const section = document.querySelector('section.rgb-panel');
  if (!section) return;
  const r = section.querySelector('input[name="r"]');
  const g = section.querySelector('input[name="g"]');
  const b = section.querySelector('input[name="b"]');
  const btn = section.querySelector('button');
  const box = section.querySelector('.color-box');
  const err = section.querySelector('.rgb-error');

  function validateAndApply() {
    const rv = r ? Number(r.value) : NaN;
    const gv = g ? Number(g.value) : NaN;
    const bv = b ? Number(b.value) : NaN;
    const ok = [rv, gv, bv].every(n => Number.isFinite(n) && n >= 0 && n <= 255);
    if (!ok) {
      if (err) err.textContent = 'Arvojen tulee olla välillä 0–255.';
      return;
    }
    if (err) err.textContent = '';
    if (box) box.style.backgroundColor = `rgb(${rv}, ${gv}, ${bv})`;
  }

  if (btn) btn.addEventListener('click', validateAndApply);
  [r, g, b].forEach(i => { if (i) i.addEventListener('input', validateAndApply); });
}

// --- Todos logic ---
function setupTodos() {
  const section = document.querySelector('section.todos');
  if (!section) return;
  const input = section.querySelector('input[type="text"]');
  const addBtn = section.querySelector('button');
  const list = section.querySelector('[data-list]') || section.querySelector('ul');

  if (!input || !addBtn || !list) return;

  addBtn.addEventListener('click', () => {
    const txt = (input.value || '').trim();
    if (!txt) return;
    const li = document.createElement('li');
    li.textContent = txt;
    list.appendChild(li);
    input.value = '';
  });
}

// --- Calculator logic ---
function setupCalculator() {
  const section = document.querySelector('section.calculator');
  if (!section) return;
  const a = section.querySelector('input[name="num1"]');
  const b = section.querySelector('input[name="num2"]');
  const op = section.querySelector('select[name="op"]') || section.querySelector('select.operator');
  const btn = section.querySelector('button');
  const result = section.querySelector('#result');
  const err = section.querySelector('.calc-error');

  function compute() {
    if (!a || !b || !op || !result) return;
    const av = Number(a.value);
    const bv = Number(b.value);
    const operator = op.value || op.selectedOptions?.[0]?.label;
    if (!Number.isFinite(av) || !Number.isFinite(bv)) return;
    if (operator === '/') {
      if (bv === 0) {
        if (err) err.textContent = 'Nollalla ei voi jakaa.';
        return;
      }
    }
    let res;
    switch (operator) {
      case '+': res = av + bv; break;
      case '-': res = av - bv; break;
      case '*': res = av * bv; break;
      case '/': res = av / bv; break;
      default: res = NaN;
    }
    if (err) err.textContent = '';
    if (result) result.textContent = String(res);
  }

  if (btn) btn.addEventListener('click', compute);
  if (op) op.addEventListener('change', compute);
}

// Initialize all sections
document.addEventListener('DOMContentLoaded', () => {
  setupProfile();
  setupCounterSection();
  setupRgbPanel();
  setupTodos();
  setupCalculator();
});
