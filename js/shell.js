// Page bootstrap. Imported by every page as a module:
//   <script type="module" src="/js/shell.js"></script>
import { initReveal } from '/js/reveal.js';
import { initMarquee } from '/js/marquee.js';
import { setLang, detectInitialLang, getCurrentLang } from '/js/i18n.js';

function wireLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = getCurrentLang() === 'es' ? 'en' : 'es';
    setLang(next);
  });
}

// Mobile hamburger menu (ported from legacy js/custom.js, jQuery removed).
// The new pages may add a burger button + slide-out drawer; this hooks them
// up if present, otherwise no-ops cleanly.
function wireMobileMenu() {
  const burgers = document.querySelectorAll('.navbar-burger');
  const menus   = document.querySelectorAll('.navbar-menu');
  const closes  = document.querySelectorAll('.navbar-close');
  const backdrops = document.querySelectorAll('.navbar-backdrop');
  if (!burgers.length || !menus.length) return;

  const toggleAll = () => menus.forEach((m) => m.classList.toggle('hidden'));
  burgers.forEach((b) => b.addEventListener('click', toggleAll));
  closes.forEach((c) => c.addEventListener('click', toggleAll));
  backdrops.forEach((bd) => bd.addEventListener('click', toggleAll));

  // Close drawer on internal nav-link click
  menus.forEach((m) => {
    m.querySelectorAll('a[href^="#"], a[href^="/"]').forEach((a) => {
      a.addEventListener('click', () => {
        if (!m.classList.contains('hidden')) toggleAll();
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(detectInitialLang());
  initReveal();
  initMarquee();
  wireLangToggle();
  wireMobileMenu();
});
