// Staggered EN/ES swap. Reads data-en / data-es (or data-en-html / data-es-html)
// from each [data-i18n] element. Persists choice in localStorage.lang.
const STORAGE_KEY = 'lang';
const STAGGER_PER_NODE_MS = 12;
const MAX_STAGGER_MS = 250;
const FADE_OUT_MS = 200;

let currentLang = null;

function applyLang(targetLang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const html = el.dataset[targetLang + 'Html'];
    const text = el.dataset[targetLang];
    if (typeof html === 'string') el.innerHTML = html;
    else if (typeof text === 'string') el.textContent = text;
  });
  document.documentElement.lang = targetLang;
  currentLang = targetLang;
  try { localStorage.setItem(STORAGE_KEY, targetLang); } catch (_) {}
}

export function setLang(targetLang) {
  if (targetLang === currentLang) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyLang(targetLang);
    return;
  }
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const totalStagger = Math.min(nodes.length * STAGGER_PER_NODE_MS, MAX_STAGGER_MS);
  nodes.forEach((el, i) => {
    const delay = (i / Math.max(nodes.length - 1, 1)) * totalStagger;
    el.style.transitionDelay = `${delay}ms`;
    el.classList.add('lang-out');
  });
  setTimeout(() => {
    applyLang(targetLang);
    nodes.forEach((el) => {
      el.classList.remove('lang-out');
      // transition-delay on swap-back: reversed so the wave returns
      const reversedDelay = (1 - (nodes.indexOf(el) / Math.max(nodes.length - 1, 1))) * totalStagger;
      el.style.transitionDelay = `${reversedDelay}ms`;
    });
    setTimeout(() => nodes.forEach((el) => { el.style.transitionDelay = ''; }), totalStagger + 300);
  }, totalStagger + FADE_OUT_MS);
}

export function detectInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch (_) {}
  return (navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function getCurrentLang() { return currentLang; }
