# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the dark-first SYALIA front-page redesign across the homepage, the six product sub-pages (one shared template), and a new `/team/` page, per the spec at `docs/specs/2026-05-05-homepage-redesign-design.md`.

**Architecture:** Static multi-page site, no build step, Tailwind via CDN. Shared visual system extracted into `assets/shared.css` linked from every page. Three small JS modules — `js/i18n.js`, `js/reveal.js`, `js/marquee.js` — bootstrapped by `js/shell.js`. Cross-document View Transitions (`<meta name="view-transition" content="same-origin">`) for product navigation. Per-page markup duplicates the nav and footer (acceptable cost — ~25 lines × 8 pages — to avoid client-side flicker).

**Tech Stack:** HTML5 + Tailwind CSS (CDN) + vanilla ES2020 JS + Material Icons + Google Fonts (Inter, Space Grotesk).

**Working canon:** `docs/reference/mockup-homepage.html` is the committed mockup that visualizes the design; tasks in this plan reference its line ranges where useful. The mockup is the source of truth for visual treatment; the spec is the source of truth for behavior and scope.

**Branch strategy:** All work on `feature/redesign-2026-05` off `tailwind`. Merge into `tailwind` only at the end (Phase 10), so GitHub Pages never serves a half-finished state.

---

## File structure

### Created

| Path | Responsibility |
|---|---|
| `assets/shared.css` | Visual system: palette CSS variables, typography, base layout, components (card, eyebrow, button, marquee), reveal-on-scroll keyframes, reduced-motion overrides. Loaded by every page. |
| `js/shell.js` | Page bootstrap — imports/initializes i18n, reveal, marquee. Sets initial language from `localStorage` or `navigator.language`. |
| `js/i18n.js` | Staggered language swap module. Exports `setLang(lang)`. |
| `js/reveal.js` | IntersectionObserver scroll-reveal module. Exports `initReveal()`. |
| `js/marquee.js` | Trust-strip marquee behavior (hover-slow, per-logo dim-others). Exports `initMarquee()`. |
| `team/index.html` | New `/team/` page. |

### Modified

| Path | What changes |
|---|---|
| `index.html` | Full rewrite per the homepage section of the mockup, plus real trust-strip logos and EN/ES wiring. |
| `superbot/index.html` | Full rewrite per sub-page template, accent emerald, glyph `chat_bubble_outline`. |
| `voxpopuli/index.html` | Full rewrite per sub-page template, accent violet, glyph `insights`. |
| `clipper/index.html` | Full rewrite per sub-page template, accent teal, glyph `image_search`. |
| `beaver/index.html` | Full rewrite per sub-page template, accent orange, glyph `dns`. |
| `resona/index.html` | Full rewrite per sub-page template, accent lime, glyph `graphic_eq`. |
| `parlantia/index.html` | Full rewrite per sub-page template, accent orange-300, glyph `menu_book`. |

### Deleted

| Path | Reason |
|---|---|
| `js/custom.js` | Audit first; if it carries only the old language toggle logic, delete. If wider, keep until its content has a new home. |

### Untouched

`img/`, `assets/*.svg`, `assets/pdf/`, `CNAME`, `favicon.ico`.

---

## Phase 1: Setup

### Task 1: Create feature branch and audit `js/custom.js`

**Files:**
- Read: `js/custom.js`

- [ ] **Step 1: Branch off tailwind**

```bash
cd /home/apiad/Workspace/repos/syalia-homepage
git checkout tailwind
git pull --ff-only
git checkout -b feature/redesign-2026-05
```

- [ ] **Step 2: Inspect `js/custom.js`**

```bash
wc -l js/custom.js
head -50 js/custom.js
```

Expected: small file with the EN/ES toggle and theme toggle handlers.

- [ ] **Step 3: Decide custom.js fate**

If the only logic is language + theme toggles → mark for deletion in Phase 4 (after `js/i18n.js` lands).
If anything else lives there (e.g., menu handlers) → quote it in this plan's notes section and preserve in Phase 5.

- [ ] **Step 4: Commit branch state**

```bash
git status
```

Expected: clean (no changes yet).

---

## Phase 2: Foundation — shared CSS

### Task 2: Create `assets/shared.css` with palette, typography, and base

**Files:**
- Create: `assets/shared.css`

- [ ] **Step 1: Write the file**

```css
/* SYALIA shared visual system — 2026-05-05 */

/* ---------- Reset extensions / base ---------- */
:root {
  --ink-50:  #f6f7fb;
  --ink-100: #e9ecf5;
  --ink-200: #cfd5e6;
  --ink-300: #a3aece;
  --ink-400: #6e7ba0;
  --ink-500: #475070;
  --ink-600: #2e3450;
  --ink-700: #1c2138;
  --ink-800: #11152a;
  --ink-900: #0a0d1f;
  --ink-950: #05071a;

  --syalia-300: #86b3da;
  --syalia-400: #5b8fc4;
  --syalia-500: #3e72ad;
  --syalia-600: #5281a3;
  --syalia-700: #3d6584;

  --accent-300: #fcd34d;
  --accent-400: #fbbf24;
  --accent-500: #f59e0b;

  /* Per-page override: each product page sets --product-accent */
  --product-accent: var(--syalia-500);
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--ink-950);
  color: var(--ink-100);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.display { font-family: 'Space Grotesk', system-ui, sans-serif; letter-spacing: -0.02em; }

/* ---------- Hero mesh gradient ---------- */
.mesh {
  position: absolute; inset: -10%; pointer-events: none;
  filter: blur(80px); opacity: .85;
}
.blob { position: absolute; border-radius: 9999px; mix-blend-mode: screen; }

@keyframes drift {
  0%,100% { transform: translate(0,0) scale(1); }
  33%     { transform: translate(40px,-30px) scale(1.1); }
  66%     { transform: translate(-30px,20px) scale(0.95); }
}
.blob-a { animation: drift 18s ease-in-out infinite; }
.blob-b { animation: drift 24s ease-in-out infinite reverse; }
.blob-c { animation: drift 22s ease-in-out infinite; }

.grid-bg {
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%);
}

/* ---------- Card ---------- */
.card {
  position: relative;
  border-radius: 1.5rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
  transition: transform .5s cubic-bezier(.2,.8,.2,1), border-color .4s, background .4s;
  cursor: pointer;
}
.card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.18); }
.card .glow {
  position: absolute; inset: -40%;
  background: radial-gradient(circle at 30% 20%, var(--c, var(--syalia-500)) 0%, transparent 60%);
  opacity: 0; transition: opacity .5s ease;
  pointer-events: none;
}
.card:hover .glow { opacity: .35; }
.card .peek {
  opacity: 0; transform: translateY(8px);
  transition: opacity .35s ease, transform .35s cubic-bezier(.2,.8,.2,1);
  transition-delay: .05s;
}
.card:hover .peek { opacity: 1; transform: translateY(0); }
.card .baseline { transition: transform .35s cubic-bezier(.2,.8,.2,1), opacity .25s; }
.card:hover .baseline { transform: translateY(-6px); opacity: .6; }

/* ---------- Reveal-on-scroll ---------- */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1);
}
.reveal.in { opacity: 1; transform: translateY(0); }

/* ---------- i18n staggered swap ---------- */
[data-i18n] {
  transition: opacity .25s cubic-bezier(.2,.8,.2,1),
              transform .25s cubic-bezier(.2,.8,.2,1);
  will-change: opacity, transform;
}
[data-i18n].lang-out { opacity: 0; transform: translateY(-6px); }

/* ---------- Marquee ---------- */
@keyframes marqueeX {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  display: flex; width: max-content; gap: 4rem; align-items: center;
  animation: marqueeX 40s linear infinite;
}
.marquee-mask {
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}

/* ---------- Trust-strip logo ---------- */
.client-logo {
  height: 36px;
  width: auto;
  opacity: .55;
  filter: brightness(0) invert(1);
  transition: opacity .25s ease-out, filter .25s ease-out, transform .25s ease-out;
}
.client-logo:hover {
  opacity: 1;
  filter: none;
  transform: translateY(-2px) scale(1.02);
}
/* When hovering any logo in the strip, dim the others */
.marquee-track:has(.client-logo:hover) .client-logo:not(:hover) {
  opacity: .25;
}

/* ---------- View transitions ---------- */
@supports (view-transition-name: x) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: .55s;
    animation-timing-function: cubic-bezier(.2,.8,.2,1);
  }
}

/* ---------- Noise overlay (decorative) ---------- */
.noise::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
  opacity: .04; mix-blend-mode: overlay;
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
  .reveal { opacity: 1; transform: none; }
  .marquee-track { animation: none !important; }
  .blob { animation: none !important; }
}
```

- [ ] **Step 2: Verify file exists**

```bash
wc -l assets/shared.css
```

Expected: ~155 lines.

- [ ] **Step 3: Commit**

```bash
git add assets/shared.css
git commit -m "feat(shared): add shared visual system stylesheet"
```

---

## Phase 3: Foundation — JS modules

### Task 3: Create `js/reveal.js`

**Files:**
- Create: `js/reveal.js`

- [ ] **Step 1: Write the file**

```javascript
// IntersectionObserver-driven scroll reveal.
// Each .reveal element fades+slides in once when it enters the viewport.
export function initReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}
```

- [ ] **Step 2: Commit**

```bash
git add js/reveal.js
git commit -m "feat(js): add scroll-reveal observer module"
```

### Task 4: Create `js/marquee.js`

**Files:**
- Create: `js/marquee.js`

- [ ] **Step 1: Write the file**

```javascript
// Trust-strip marquee behavior: hover the strip to slow to ~25%; leave to restore.
// Per-logo "lights up while siblings dim" is handled in CSS via :has().
const SLOW_DURATION = '160s';
const FAST_DURATION = '40s';

export function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tracks.forEach((t) => t.style.animation = 'none');
    return;
  }
  tracks.forEach((track) => {
    const wrapper = track.closest('.marquee-mask') || track.parentElement;
    if (!wrapper) return;
    wrapper.addEventListener('mouseenter', () => {
      track.style.animationDuration = SLOW_DURATION;
    });
    wrapper.addEventListener('mouseleave', () => {
      track.style.animationDuration = FAST_DURATION;
    });
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add js/marquee.js
git commit -m "feat(js): add marquee hover-slow module"
```

### Task 5: Create `js/i18n.js`

**Files:**
- Create: `js/i18n.js`

- [ ] **Step 1: Write the file**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add js/i18n.js
git commit -m "feat(js): add staggered EN/ES swap module"
```

### Task 6: Create `js/shell.js`

**Files:**
- Create: `js/shell.js`

- [ ] **Step 1: Write the file**

```javascript
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
    btn.textContent = next === 'es' ? 'EN  /  ES' : 'EN  /  ES';
    setLang(next);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(detectInitialLang());
  initReveal();
  initMarquee();
  wireLangToggle();
});
```

- [ ] **Step 2: Commit**

```bash
git add js/shell.js
git commit -m "feat(js): add page-bootstrap shell"
```

---

## Phase 4: Homepage rewrite

### Task 7: Replace `index.html` shell + head

**Files:**
- Modify: `index.html` (full rewrite)

- [ ] **Step 1: Write the new `index.html`**

The full structure mirrors `docs/reference/mockup-homepage.html` with these adaptations:

1. Drop the inline `<style>` block — link `assets/shared.css` instead.
2. Drop the inline JS in `<script>` at the bottom — load `js/shell.js` as a module.
3. Drop the theme toggle button entirely — site is dark-only. Remove the `id="theme-toggle"` element from the nav and the related JS.
4. Replace placeholder marquee items (industries) with real client logos — see Task 9.
5. Wire EN/ES — see Task 11.
6. Add the cross-document view-transition opt-in `<meta>` tag in head.

**`<head>` block — full content:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="view-transition" content="same-origin">
    <title>SYALIA — AI, Data Science & Business Analytics</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
              sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
              ink: {
                100: '#e9ecf5', 200: '#cfd5e6', 300: '#a3aece', 400: '#6e7ba0',
                500: '#475070', 600: '#2e3450', 700: '#1c2138', 800: '#11152a',
                900: '#0a0d1f', 950: '#05071a',
              },
              syalia: { 300: '#86b3da', 400: '#5b8fc4', 500: '#3e72ad', 600: '#5281a3', 700: '#3d6584' },
              accent: { 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b' },
            }
          }
        }
      }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="/assets/shared.css">
</head>
```

- [ ] **Step 2: Add `<body>` content from mockup**

Use `docs/reference/mockup-homepage.html` lines 142–545 as the source. Keep the structure identical with these exceptions:

1. Remove the theme-toggle `<button id="theme-toggle">…</button>` and its surrounding span.
2. Remove the `<header>` block's inline mesh `<div class="mesh">` styles in favor of the CSS classes already in `assets/shared.css`. Replace inline `style="background:#5281a3"` etc. with the class equivalents:

```html
<div class="mesh">
    <div class="blob blob-a w-[640px] h-[640px] -top-40 -left-40" style="background:#5281a3"></div>
    <div class="blob blob-b w-[520px] h-[520px] top-20 right-0" style="background:#3e72ad"></div>
    <div class="blob blob-c w-[480px] h-[480px] bottom-0 left-1/3" style="background:#f59e0b; opacity:.55"></div>
</div>
```

(`blob-a/b/c` map to the three drift animations in shared.css; the `style="background:..."` keeps each blob's color since CSS variables would be overkill for three values.)

3. Replace the trust-strip placeholder marquee items in lines 309–327 of the mockup with the real-logo block — leave a placeholder `<!-- TRUST STRIP — replaced in Task 8 -->` for now.
4. Strip `data-lang="en"` / `data-lang="es"` paired spans — leave English text only for now. Migration to `data-i18n` happens in Task 9.
5. **Critical fix vs the mockup:** the mockup put `view-transition-name: card-<slug>` on the card's `<a>` element. The spec moves it to the inner `<h3>`. When porting each card from the mockup, **split** the card's `style` attribute:
   - Keep `style="--c:#10b981"` on the `<a class="card">` (this drives the hover glow color).
   - Move `view-transition-name: card-superbot` to the `<h3 class="display ...">` element as `style="view-transition-name: card-superbot"`.
   - Apply the same split to all six cards (each with its own slug + accent).

- [ ] **Step 3: Add the script tag at end of body**

```html
<script type="module" src="/js/shell.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify the page loads**

```bash
cd /home/apiad/Workspace/repos/syalia-homepage
python3 -m http.server 8765 --bind 127.0.0.1 &
SERVER_PID=$!
sleep 1
curl -sI http://127.0.0.1:8765/ | head -3
```

Expected: `HTTP/1.0 200 OK`.

- [ ] **Step 5: Visually verify via saidkick**

```bash
cd /home/apiad/Workspace/repos/saidkick
TAB=$(uv run saidkick open --browser br-XXXX http://127.0.0.1:8765/ --wait none)
sleep 2
uv run saidkick screenshot --tab "$TAB" --output /tmp/index-task7.png
```

(Replace `br-XXXX` with the active browser ID from `uv run saidkick tabs`.) Compare visually to the mockup hero. Hero, products section, services, team teaser, contact, footer should all render correctly with no console errors.

- [ ] **Step 6: Commit**

```bash
cd /home/apiad/Workspace/repos/syalia-homepage
git add index.html
git commit -m "feat(home): rewrite homepage to dark visual system"
```

- [ ] **Step 7: Stop the server**

```bash
kill $SERVER_PID
```

---

## Phase 5: Trust strip — real logos

### Task 8: Replace trust-strip markup with real logos

**Files:**
- Modify: `index.html` (the trust-strip section)

- [ ] **Step 1: Replace the trust-strip section markup**

Replace the placeholder block from Task 7 with:

```html
<!-- TRUST STRIP -->
<section class="relative py-12 border-y border-white/5">
    <p class="text-center text-xs uppercase tracking-[0.3em] text-ink-400 mb-8" data-i18n data-en="Working with" data-es="Colaboramos con">Working with</p>
    <div class="marquee-mask overflow-hidden">
        <div class="marquee-track opacity-90">
            <!-- First copy -->
            <img class="client-logo" src="/img/clients/dofleini-logo.svg" alt="Dofleini">
            <img class="client-logo" src="/img/clients/logo-cognivium.png" alt="Cognivium">
            <img class="client-logo" src="/img/clients/logo-deepdata.png" alt="DeepData">
            <img class="client-logo" src="/img/clients/logo-fundacion.png" alt="Fundación">
            <img class="client-logo" src="/img/clients/logo-glacial.png" alt="Glacial">
            <img class="client-logo" src="/img/clients/logo-gplsi.png" alt="GPLSI">
            <img class="client-logo" src="/img/clients/logo-matcom.png" alt="MatCom">
            <img class="client-logo" src="/img/clients/logo-postdataclub.png" alt="PostData Club">
            <img class="client-logo" src="/img/clients/logo-tecnomatica.png" alt="Tecnomatica">
            <!-- Second copy (identical) for seamless loop -->
            <img class="client-logo" src="/img/clients/dofleini-logo.svg" alt="Dofleini" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-cognivium.png" alt="Cognivium" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-deepdata.png" alt="DeepData" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-fundacion.png" alt="Fundación" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-glacial.png" alt="Glacial" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-gplsi.png" alt="GPLSI" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-matcom.png" alt="MatCom" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-postdataclub.png" alt="PostData Club" aria-hidden="true">
            <img class="client-logo" src="/img/clients/logo-tecnomatica.png" alt="Tecnomatica" aria-hidden="true">
        </div>
    </div>
</section>
```

- [ ] **Step 2: Verify behavior**

Restart server, open in saidkick, screenshot. Verify:
- All 9 logos appear, all monochrome white at ~55% opacity.
- Strip animates left-to-right.
- Hovering a single logo: it lights up to full color while siblings dim to 25%.
- Hovering ANY area inside the strip wrapper slows the animation (run a 2-second hover, take a screenshot, then a 4-second-later screenshot — verify the strip moved less than half the distance it would at full speed).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(home): wire trust strip with real client logos"
```

---

## Phase 6: Language toggle

### Task 9: Migrate homepage copy to `data-i18n` attrs

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Identify every translatable element on the page**

Run:
```bash
grep -nE 'data-lang|<h[123]|<p[ >]|<span[ >]|<a[ >].*[A-Z]' index.html | head -80
```

(For elements without HTML children, use `data-en`/`data-es`. For elements with inline children — like the headline gradient span — use `data-en-html`/`data-es-html`.)

- [ ] **Step 2: Add data-i18n attrs**

For each translatable element, add `data-i18n` plus the appropriate data attrs. Examples (drawn from the mockup):

| Element | Markup |
|---|---|
| Eyebrow above hero | `<div class="..." data-i18n data-en="A Cuban AI lab — building the next decade" data-es="Un laboratorio cubano de IA — construyendo la próxima década">A Cuban AI lab — building the next decade</div>` |
| Hero h1 (composite) | `<h1 class="display ..." data-i18n data-en-html="<span class='block ...'>We don't sell</span><span class='block ...'><span class='bg-gradient-to-r ...'>artificial intelligence.</span></span><span class='block ... mt-2'>We build it.</span>" data-es-html="<span class='block ...'>No vendemos</span><span class='block ...'><span class='bg-gradient-to-r ...'>inteligencia artificial.</span></span><span class='block ... mt-2'>La construimos.</span>">…current English markup unchanged…</h1>` |
| Hero tagline `<p>` | `<p ... data-i18n data-en="A research-driven studio shipping production AI products across voice, vision, language, and data — for the companies that need to move first." data-es="Un estudio de investigación que produce productos de IA en voz, visión, lenguaje y datos — para las empresas que necesitan moverse primero.">…</p>` |
| Primary CTA | `<a ... data-i18n data-en="See the product suite" data-es="Ver la suite">See the product suite</a>` |
| ...and so on for every visible string... | |

Comprehensive ES translation pairs are listed in **Appendix A** at the end of this plan.

- [ ] **Step 3: Verify the toggle works**

Restart server, open page in saidkick, click the EN/ES button:

```bash
TAB=$(uv run saidkick tabs | grep '127.0.0.1:8765' | awk '{print $1}')
uv run saidkick click --tab "$TAB" --by-text "EN  /  ES"
sleep 1
uv run saidkick screenshot --tab "$TAB" --output /tmp/i18n-after.png
```

Expected: every translatable element fades out top-to-bottom, swaps content, fades back in. No layout jump, no console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(home): migrate copy to data-i18n + wire EN/ES swap"
```

### Task 10: Delete `js/custom.js` if obsolete

**Files:**
- Delete: `js/custom.js` (conditional)

- [ ] **Step 1: Verify nothing in `index.html` references custom.js**

```bash
grep -n "custom.js" index.html
```

Expected: no matches.

- [ ] **Step 2: Verify nothing else in the repo references it**

```bash
grep -rn "custom.js" --include="*.html" .
```

Expected: only sub-page references (which will be rewritten in Phase 7).

- [ ] **Step 3: Defer deletion**

Keep `js/custom.js` until Phase 7 finishes (sub-pages may still reference it). Then delete in a final cleanup task (Task 21).

---

## Phase 7: Product sub-page template

### Task 11: Build Superbot sub-page (template proof-of-concept)

**Files:**
- Modify: `superbot/index.html` (full rewrite)

- [ ] **Step 1: Read the existing sub-page for content reference**

```bash
cat /home/apiad/Workspace/repos/syalia-homepage/superbot/index.html | head -200
```

Note: the goal is preserving the **technical claims** while rewriting voice/structure to match the new register.

- [ ] **Step 2: Write the new `superbot/index.html`**

Use this skeleton, filling sections from the existing copy, lightly tightened. The product accent is `--c: #10b981`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="view-transition" content="same-origin">
    <title>Superbot — SYALIA</title>
    <!-- (same Tailwind config + fonts + shared.css link as homepage Task 7 head) -->
    <link rel="stylesheet" href="/assets/shared.css">
    <style> :root { --product-accent: #10b981; } </style>
</head>
<body class="antialiased min-h-screen">

  <!-- Top bar — identical structure to homepage, with Products link active styling -->
  <nav class="sticky top-0 z-50 backdrop-blur-xl bg-ink-950/60 border-b border-white/5">
    <!-- duplicate the homepage <nav> contents here, swap "Products" link styling to active -->
  </nav>

  <!-- HERO -->
  <header class="relative overflow-hidden noise pt-24 pb-32">
    <div class="mesh">
      <div class="blob blob-a w-[640px] h-[640px] -top-40 -left-40" style="background:#10b981; opacity:.5"></div>
      <div class="blob blob-b w-[420px] h-[420px] top-20 right-0" style="background:#5281a3"></div>
    </div>
    <div class="absolute inset-0 grid-bg"></div>
    <div class="relative max-w-7xl mx-auto px-6 lg:px-10">
      <a href="/#products" class="text-sm text-ink-300 hover:text-white inline-flex items-center gap-2 mb-12 reveal">
        <span class="material-icons text-base">arrow_back</span>
        <span data-i18n data-en="All products" data-es="Todos los productos">All products</span>
      </a>
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 reveal">
          <div class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-6" style="color:#10b981">
            <span class="w-8 h-px" style="background:#10b981"></span>
            <span data-i18n data-en="Product — superbot" data-es="Producto — superbot">Product — superbot</span>
          </div>
          <h1 class="display text-6xl sm:text-8xl font-bold leading-[0.95]" style="view-transition-name: card-superbot;">Superbot</h1>
          <p class="mt-8 text-xl text-ink-300 max-w-xl leading-relaxed" data-i18n data-en="Multilingual, context-aware conversation engines. Drop into any product, fine-tuned to your domain, integrable with your stack." data-es="Motores de conversación multilingües y conscientes del contexto. Se integran en cualquier producto, ajustados a tu dominio, conectables a tu stack.">Multilingual, context-aware conversation engines. Drop into any product, fine-tuned to your domain, integrable with your stack.</p>
          <div class="mt-10 flex flex-wrap gap-4">
            <a href="#contact" class="inline-flex items-center gap-2 font-semibold px-6 py-3.5 rounded-full text-ink-950 transition" style="background:#10b981" data-i18n data-en="Talk to us about Superbot" data-es="Hablemos de Superbot">Talk to us about Superbot</a>
            <a href="#how" class="inline-flex items-center gap-2 text-ink-100 font-semibold px-6 py-3.5 rounded-full border border-white/15 hover:border-white/40 transition" data-i18n data-en="How it works" data-es="Cómo funciona">How it works</a>
          </div>
        </div>
        <div class="lg:col-span-5 reveal flex justify-center lg:justify-end">
          <span class="material-icons" style="font-size:18rem; color:#10b981; opacity:.18">chat_bubble_outline</span>
        </div>
      </div>
    </div>
  </header>

  <!-- 3-UP FEATURES -->
  <section class="relative py-24 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div class="reveal">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style="background:rgba(16,185,129,.15); border:1px solid rgba(16,185,129,.3); color:#10b981">
          <span class="material-icons">translate</span>
        </div>
        <h3 class="display text-2xl font-bold mb-3" data-i18n data-en="Multilingual by default" data-es="Multilingüe por diseño">Multilingual by default</h3>
        <p class="text-ink-300 leading-relaxed" data-i18n data-en="Spanish, English, and beyond — your bot speaks the language your users speak, with context retention across the conversation." data-es="Español, inglés y más — tu bot habla el idioma de tus usuarios, manteniendo el contexto a lo largo de la conversación.">Spanish, English, and beyond — your bot speaks the language your users speak, with context retention across the conversation.</p>
      </div>
      <div class="reveal">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style="background:rgba(16,185,129,.15); border:1px solid rgba(16,185,129,.3); color:#10b981">
          <span class="material-icons">tune</span>
        </div>
        <h3 class="display text-2xl font-bold mb-3" data-i18n data-en="Tuned to your domain" data-es="Ajustado a tu dominio">Tuned to your domain</h3>
        <p class="text-ink-300 leading-relaxed" data-i18n data-en="We fine-tune the underlying models on your knowledge base, your tone of voice, and your business rules — not generic chat output." data-es="Ajustamos los modelos sobre tu base de conocimiento, tu tono y tus reglas de negocio — no salidas genéricas.">We fine-tune the underlying models on your knowledge base, your tone of voice, and your business rules — not generic chat output.</p>
      </div>
      <div class="reveal">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style="background:rgba(16,185,129,.15); border:1px solid rgba(16,185,129,.3); color:#10b981">
          <span class="material-icons">api</span>
        </div>
        <h3 class="display text-2xl font-bold mb-3" data-i18n data-en="Integrable, not isolated" data-es="Integrable, no aislado">Integrable, not isolated</h3>
        <p class="text-ink-300 leading-relaxed" data-i18n data-en="REST and webhook APIs, SDKs in Python and JavaScript, and direct integrations with the channels your users already use." data-es="APIs REST y webhooks, SDKs en Python y JavaScript, e integraciones con los canales que tus usuarios ya usan.">REST and webhook APIs, SDKs in Python and JavaScript, and direct integrations with the channels your users already use.</p>
      </div>
    </div>
  </section>

  <!-- SPOTLIGHT A — image left, copy right -->
  <section class="relative py-24 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 reveal">
        <div class="aspect-square rounded-3xl flex items-center justify-center" style="background:linear-gradient(135deg, rgba(16,185,129,.1), rgba(16,185,129,.02)); border:1px solid rgba(16,185,129,.2)">
          <span class="material-icons" style="font-size:14rem; color:#10b981; opacity:.5">forum</span>
        </div>
      </div>
      <div class="lg:col-span-7 reveal">
        <div class="text-xs uppercase tracking-[0.25em] mb-4" style="color:#10b981" data-i18n data-en="Spotlight" data-es="En foco">Spotlight</div>
        <h2 class="display text-4xl sm:text-5xl font-bold leading-[1.05] mb-6" data-i18n data-en="Conversations that hold their thread." data-es="Conversaciones que mantienen el hilo.">Conversations that hold their thread.</h2>
        <p class="text-lg text-ink-300 leading-relaxed" data-i18n data-en="Long-context retention means your users don't have to repeat themselves. Superbot tracks state across turns — handoffs to human agents, multi-step workflows, and follow-up questions all just work." data-es="La retención de contexto largo significa que tus usuarios no tienen que repetirse. Superbot mantiene el estado entre turnos — transferencias a humanos, flujos de varios pasos y preguntas de seguimiento simplemente funcionan.">Long-context retention means your users don't have to repeat themselves. Superbot tracks state across turns — handoffs to human agents, multi-step workflows, and follow-up questions all just work.</p>
      </div>
    </div>
  </section>

  <!-- SPOTLIGHT B — copy left, image right -->
  <section class="relative py-24 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 reveal">
        <div class="text-xs uppercase tracking-[0.25em] mb-4" style="color:#10b981" data-i18n data-en="Built for production" data-es="Listo para producción">Built for production</div>
        <h2 class="display text-4xl sm:text-5xl font-bold leading-[1.05] mb-6" data-i18n data-en="Drop in. Scale up." data-es="Conecta. Escala.">Drop in. Scale up.</h2>
        <p class="text-lg text-ink-300 leading-relaxed" data-i18n data-en="Superbot ships behind a hardened API gateway with rate limiting, observability, and graceful fallbacks. Roll out to thousands of users on day one — no extra plumbing required." data-es="Superbot se despliega detrás de un gateway endurecido con límites de tasa, observabilidad y caídas controladas. Lanza a miles de usuarios desde el día uno — sin cables extra.">Superbot ships behind a hardened API gateway with rate limiting, observability, and graceful fallbacks. Roll out to thousands of users on day one — no extra plumbing required.</p>
      </div>
      <div class="lg:col-span-5 reveal">
        <div class="aspect-square rounded-3xl flex items-center justify-center" style="background:linear-gradient(135deg, rgba(16,185,129,.1), rgba(16,185,129,.02)); border:1px solid rgba(16,185,129,.2)">
          <span class="material-icons" style="font-size:14rem; color:#10b981; opacity:.5">dns</span>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section id="contact" class="relative py-32 border-t border-white/5">
    <div class="max-w-5xl mx-auto px-6 lg:px-10 text-center reveal">
      <h2 class="display text-4xl sm:text-7xl font-bold leading-[0.95]" data-i18n data-en="Bring Superbot to your team." data-es="Lleva Superbot a tu equipo.">Bring Superbot to your team.</h2>
      <p class="mt-8 text-lg text-ink-300 max-w-2xl mx-auto" data-i18n data-en="Tell us what you want your bot to do. We'll show you a working prototype within two weeks." data-es="Cuéntanos qué quieres que haga tu bot. Te mostramos un prototipo funcional en dos semanas.">Tell us what you want your bot to do. We'll show you a working prototype within two weeks.</p>
      <div class="mt-12 flex flex-wrap items-center justify-center gap-4">
        <a href="mailto:hello@syalia.com" class="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full text-ink-950 transition" style="background:#10b981">
          hello@syalia.com
          <span class="material-icons text-base">arrow_outward</span>
        </a>
      </div>
    </div>
  </section>

  <!-- FOOTER — duplicate of homepage footer -->
  <footer class="border-t border-white/5 py-12">
    <!-- duplicate <footer> contents from homepage here -->
  </footer>

  <script type="module" src="/js/shell.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify the page loads + view transition works**

```bash
# Restart server if not running, then:
TAB=$(uv run saidkick tabs | grep '127.0.0.1:8765/$' | awk '{print $1}')
uv run saidkick click --tab "$TAB" --by-text "Superbot"
sleep 2
uv run saidkick screenshot --tab "$TAB" --output /tmp/superbot-after-transition.png
```

Expected: smooth view-transition morph (the `Superbot` h3 title from the home card → the huge `Superbot` h1 on the sub-page); page renders fully; no console errors. Test in Chrome — Firefox / Safari fall back to a normal load.

- [ ] **Step 4: Commit**

```bash
git add superbot/index.html
git commit -m "feat(superbot): rewrite sub-page to dark template + view transition"
```

### Task 12-16: Replicate template for the remaining 5 products

Each task is structurally identical to Task 11, with these substitutions per product:

| Task | Product | Accent | Glyph | h1 view-transition-name |
|---|---|---|---|---|
| 12 | voxpopuli | `#8b5cf6` | `insights` | `card-voxpopuli` |
| 13 | clipper | `#14b8a6` | `image_search` | `card-clipper` |
| 14 | beaver | `#f97316` | `dns` | `card-beaver` |
| 15 | resona | `#84cc16` | `graphic_eq` | `card-resona` |
| 16 | parlantia | `#fb923c` | `menu_book` | `card-parlantia` |

**For each task:**
- [ ] **Step 1: Open the existing sub-page** (`<product>/index.html`) and pull the technical claims/use cases.
- [ ] **Step 2: Write a fresh `<product>/index.html`** following the Superbot skeleton in Task 11. Substitute accent color, glyph, h1 text, and product-specific copy. Draft per-product copy is provided in **Appendix B** at the end of this plan.
- [ ] **Step 3: Verify the page loads** in saidkick.
- [ ] **Step 4: Verify view transition** by clicking the matching card on the homepage.
- [ ] **Step 5: Commit** with message `feat(<product>): rewrite sub-page to dark template + view transition`.

---

## Phase 8: Team page

### Task 17: Build `/team/index.html`

**Files:**
- Create: `team/index.html`

- [ ] **Step 1: Write the file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="view-transition" content="same-origin">
    <title>Team — SYALIA</title>
    <!-- (same Tailwind config + fonts + shared.css link as homepage) -->
    <link rel="stylesheet" href="/assets/shared.css">
</head>
<body class="antialiased min-h-screen">

  <!-- Top bar — same as homepage, "Team" link active -->
  <nav class="sticky top-0 z-50 backdrop-blur-xl bg-ink-950/60 border-b border-white/5">
    <!-- duplicate homepage nav, mark Team link active -->
  </nav>

  <!-- HERO -->
  <header class="relative overflow-hidden noise pt-24 pb-32">
    <div class="mesh">
      <div class="blob blob-a w-[640px] h-[640px] -top-40 -left-40" style="background:#5281a3"></div>
      <div class="blob blob-b w-[420px] h-[420px] top-20 right-0" style="background:#fbbf24; opacity:.4"></div>
    </div>
    <div class="absolute inset-0 grid-bg"></div>
    <div class="relative max-w-5xl mx-auto px-6 lg:px-10">
      <div class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent-400 mb-6 reveal">
        <span class="w-8 h-px bg-accent-400"></span>
        <span data-i18n data-en="The team" data-es="El equipo">The team</span>
      </div>
      <h1 class="display text-5xl sm:text-7xl font-bold leading-[0.95] reveal" data-i18n data-en-html="Three people. <span class='text-ink-300'>One curious obsession.</span>" data-es-html="Tres personas. <span class='text-ink-300'>Una obsesión curiosa.</span>">Three people. <span class="text-ink-300">One curious obsession.</span></h1>
      <p class="mt-10 text-lg text-ink-300 max-w-2xl leading-relaxed reveal" data-i18n data-en="Founded in Havana in 2018 by computer-science professors and ML researchers, SYALIA has grown into a multidisciplinary studio shipping AI products to clients in Cuba, Latin America, and Europe." data-es="Fundada en La Habana en 2018 por profesores de ciencias de la computación e investigadores de ML, SYALIA ha crecido hasta convertirse en un estudio multidisciplinario que entrega productos de IA a clientes en Cuba, Latinoamérica y Europa.">Founded in Havana in 2018 by computer-science professors and ML researchers, SYALIA has grown into a multidisciplinary studio shipping AI products to clients in Cuba, Latin America, and Europe.</p>
    </div>
  </header>

  <!-- COFOUNDER 1: Yudivián Almeida Cruz -->
  <section class="relative py-24 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div class="lg:col-span-4 reveal">
        <div class="aspect-square w-full max-w-[280px] rounded-2xl overflow-hidden ring-1 ring-white/10">
          <img src="/img/team/1.jpg" alt="Yudivián Almeida Cruz" class="w-full h-full object-cover">
        </div>
        <p class="mt-4 text-xs font-mono uppercase tracking-[0.25em] text-accent-400">Cofounder — CEO</p>
      </div>
      <div class="lg:col-span-8 reveal">
        <h2 class="display text-3xl sm:text-5xl font-bold">Yudivián Almeida Cruz, Ph.D.</h2>
        <p class="display text-xl sm:text-2xl text-ink-300 mt-4">
          <!-- TAGLINE: 1 sentence (Alex to provide) -->
          <span data-i18n data-en="[Tagline placeholder — to be supplied]" data-es="[Frase pendiente]">[Tagline placeholder — to be supplied]</span>
        </p>
        <div class="mt-8 space-y-4 text-ink-200 leading-relaxed">
          <!-- BIO: 2-3 paragraphs (Alex to provide). Use one <p data-i18n ...> per paragraph. -->
          <p data-i18n data-en="[Bio paragraph 1 placeholder]" data-es="[Bio párrafo 1 pendiente]">[Bio paragraph 1 placeholder]</p>
        </div>
        <div class="mt-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-8 h-px bg-accent-400"></span>
            <span class="text-xs font-mono uppercase tracking-[0.25em] text-accent-400" data-i18n data-en="Selected work" data-es="Trabajo seleccionado">Selected work</span>
          </div>
          <ul class="space-y-3">
            <!-- WORK: ~5–10 items (Alex to provide). Each:
              <li class="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3">
                <span><span class="text-ink-100 font-medium">[Title]</span><br><span class="text-sm text-ink-400">[venue, year]</span></span>
                <a href="[url]" class="text-ink-400 hover:text-white"><span class="material-icons text-base">arrow_outward</span></a>
              </li>
            -->
          </ul>
        </div>
        <div class="mt-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-8 h-px bg-accent-400"></span>
            <span class="text-xs font-mono uppercase tracking-[0.25em] text-accent-400" data-i18n data-en="Connect" data-es="Contacto">Connect</span>
          </div>
          <div class="flex flex-wrap gap-3">
            <!-- CONNECT: pills (Alex to provide). Each:
              <a href="[url]" class="inline-flex items-center gap-2 text-sm text-ink-200 px-4 py-2 rounded-full border border-white/15 hover:border-white/40 transition">
                <span class="material-icons text-base">[icon]</span>[label]
              </a>
            -->
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- COFOUNDER 2: Suilan Estévez Velarde — duplicate the cofounder-1 block, swap photo (img/team/2.jpg), name, role (COO), placeholders -->
  <!-- COFOUNDER 3: Alejandro Piad Morffis — duplicate the cofounder-1 block, swap photo (img/team/3.jpg), name, role (CTO), placeholders -->

  <!-- CLOSING CTA -->
  <section class="relative py-24 border-t border-white/5">
    <div class="max-w-3xl mx-auto px-6 lg:px-10 text-center reveal">
      <h2 class="display text-3xl sm:text-5xl font-bold" data-i18n data-en="Want to work with us?" data-es="¿Quieres trabajar con nosotros?">Want to work with us?</h2>
      <a href="mailto:hello@syalia.com" class="mt-8 inline-flex items-center gap-2 bg-accent-400 hover:bg-accent-300 text-ink-950 font-semibold px-8 py-4 rounded-full transition">
        hello@syalia.com
        <span class="material-icons text-base">arrow_outward</span>
      </a>
    </div>
  </section>

  <!-- FOOTER — duplicate of homepage footer -->
  <footer class="border-t border-white/5 py-12">
    <!-- duplicate homepage <footer> contents -->
  </footer>

  <script type="module" src="/js/shell.js"></script>
</body>
</html>
```

- [ ] **Step 2: Duplicate cofounder block for #2 and #3**

Copy the cofounder-1 `<section>` two more times. For #2, swap to `img/team/2.jpg`, name `Suilan Estévez Velarde, Ph.D.`, role `Cofounder — COO`. For #3, swap to `img/team/3.jpg`, name `Alejandro Piad Morffis, Ph.D.`, role `Cofounder — CTO`. All bio/work/connect content stays placeholder until Alex supplies it.

- [ ] **Step 3: Verify the page loads**

Visit `http://127.0.0.1:8765/team/` in saidkick, screenshot. Verify hero, three cofounder blocks (each with photo + name + role + placeholder slots), closing CTA, footer.

- [ ] **Step 4: Commit**

```bash
git add team/index.html
git commit -m "feat(team): add /team/ page with three cofounder blocks"
```

### Task 18: Wire homepage team teaser link to `/team/`

**Files:**
- Modify: `index.html` (the team-teaser section)

- [ ] **Step 1: Update the link**

In the team-teaser section of `index.html`, change the `Meet the team →` link from `href="#"` to `href="/team/"`. Same in the nav `Team` link — change from `href="#team"` to `href="/team/"`.

- [ ] **Step 2: Verify navigation**

```bash
TAB=$(uv run saidkick tabs | grep '127.0.0.1:8765' | awk '{print $1}')
uv run saidkick click --tab "$TAB" --by-text "Meet the team"
sleep 2
uv run saidkick text --tab "$TAB" --css "h1" | head -3
```

Expected: text contains "Three people. One curious obsession."

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(home): link team teaser + nav to /team/"
```

---

## Phase 9: QA + acceptance

### Task 19: Acceptance-criteria walkthrough

**Files:** none (verification only)

- [ ] **Step 1: Cross-browser smoke**

Open the homepage in Chrome (latest), Firefox (latest), and Safari 18+ if available. For each:
- Visual rendering matches the mockup.
- Hover a product card → peek text appears, glow fires.
- Click a product → in Chromium, view transition morphs cleanly; in Firefox/Safari, normal page load (no error, just no morph).
- Click EN/ES toggle → staggered swap fires.
- Reload → language preference persists.
- No console errors.

- [ ] **Step 2: Reduced-motion check**

In Chrome DevTools, enable `prefers-reduced-motion: reduce` (Rendering panel → Emulate CSS media feature). Reload. Verify:
- Hero blobs are static.
- Marquee is static (logos still visible).
- Reveal elements appear immediately (no slide-in).
- Language toggle still works (instant swap, no fade).

- [ ] **Step 3: Lighthouse run**

In Chrome DevTools → Lighthouse panel, run on `index.html` and `/team/`. Target ≥ 90 for Performance and Accessibility. Record the results in `docs/plans/2026-05-05-homepage-redesign.lighthouse.txt`.

If under 90:
- Performance: identify largest blockers (likely the Tailwind CDN script). Acceptable trade-off given no-build constraint; document and accept.
- Accessibility: fix any flagged issues (typically missing labels, color contrast on muted ink-300 text).

- [ ] **Step 4: Commit any fixes**

```bash
git add docs/plans/2026-05-05-homepage-redesign.lighthouse.txt
# plus any code fixes from accessibility findings
git commit -m "chore: lighthouse run + accessibility fixes"
```

### Task 20: Verify all view-transition pairings

**Files:** none (verification only)

- [ ] **Step 1: For each of the 6 products, click from home and screenshot**

```bash
for slug in superbot voxpopuli clipper beaver resona parlantia; do
  TAB=$(uv run saidkick open --browser br-XXXX http://127.0.0.1:8765/ --wait none)
  sleep 2
  uv run saidkick click --tab "$TAB" --by-text "$slug" --exact false
  sleep 2
  uv run saidkick screenshot --tab "$TAB" --output "/tmp/transition-$slug.png"
done
```

Expected: each transition lands on the correct sub-page; the headline morphs smoothly in Chrome.

- [ ] **Step 2: Check `view-transition-name` uniqueness**

```bash
for slug in superbot voxpopuli clipper beaver resona parlantia; do
  echo "=== $slug ==="
  grep -c "view-transition-name: card-$slug" "$slug/index.html" index.html
done
```

Expected: each slug has exactly 1 occurrence on the sub-page and exactly 1 on the homepage.

### Task 21: Final cleanup

**Files:**
- Delete: `js/custom.js` (if obsolete from Task 10 audit)

- [ ] **Step 1: Final reference check**

```bash
grep -rn "custom.js" --include="*.html" .
```

Expected: no matches. If matches → fix them before deleting.

- [ ] **Step 2: Delete**

```bash
git rm js/custom.js
git commit -m "chore: remove obsolete js/custom.js"
```

---

## Phase 10: Merge

### Task 22: Merge `feature/redesign-2026-05` into `tailwind`

**Files:** none (git operations)

- [ ] **Step 1: Final review of branch diff**

```bash
git fetch origin
git diff origin/tailwind...HEAD --stat
```

Review the file list. Should be:
- 3 modified: `index.html` + 6 sub-page index.htmls
- 1 created: `team/index.html`
- 5 created: `assets/shared.css`, `js/shell.js`, `js/i18n.js`, `js/reveal.js`, `js/marquee.js`
- 1 deleted: `js/custom.js`
- 1 created: `docs/specs/2026-05-05-homepage-redesign-design.md` (already on tailwind)
- 1 created: `docs/plans/2026-05-05-homepage-redesign.md` (already on feature)
- 1 created: `docs/reference/mockup-homepage.html`

- [ ] **Step 2: Push the feature branch**

```bash
git push -u origin feature/redesign-2026-05
```

- [ ] **Step 3: Open a PR**

```bash
gh pr create --title "Homepage redesign: dark visual system, sub-pages, /team/" --body "$(cat <<'EOF'
## Summary
- Implements the design spec at docs/specs/2026-05-05-homepage-redesign-design.md.
- Front page rewritten to dark-first AI-product-suite showcase.
- All 6 product sub-pages restyled to a shared template with view transitions from home.
- New /team/ page with 3 cofounder blocks (bio/work/connect placeholders).
- Trust strip uses real client logos with hover-slow + per-logo dim-others.
- EN/ES staggered fade-up swap; persists in localStorage.
- Reduced-motion fully respected.

## Test plan
- [ ] Home renders in Chrome / Firefox / Safari 18+
- [ ] Each of 6 product cards morphs on click in Chrome (view-transition)
- [ ] Each sub-page renders fully
- [ ] /team/ renders with three cofounder blocks
- [ ] EN/ES toggle works on every page
- [ ] prefers-reduced-motion: reduce kills all motion
- [ ] Lighthouse ≥ 90 Performance + Accessibility on home and /team/
- [ ] No console errors anywhere

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: After Alex approves, merge**

```bash
gh pr merge --merge   # or --squash if the commit history is messy
git checkout tailwind
git pull
git branch -d feature/redesign-2026-05
```

GitHub Pages will auto-deploy from `tailwind` within a couple of minutes.

---

## Appendix A: ES translations for homepage

(English source on left; Spanish on right. Use these in Task 9.)

| EN | ES |
|---|---|
| Products | Productos |
| Services | Servicios |
| Team | Equipo |
| Blog | Blog |
| Talk to us | Hablemos |
| A Cuban AI lab — building the next decade | Un laboratorio cubano de IA — construyendo la próxima década |
| We don't sell artificial intelligence. We build it. | No vendemos inteligencia artificial. La construimos. |
| A research-driven studio shipping production AI products across voice, vision, language, and data — for the companies that need to move first. | Un estudio impulsado por la investigación que produce productos de IA en voz, visión, lenguaje y datos — para las empresas que necesitan moverse primero. |
| See the product suite | Ver la suite |
| Start a conversation | Iniciar conversación |
| Production AI products | Productos de IA en producción |
| Founded in Havana | Fundada en La Habana |
| Researchers & engineers | Investigadores e ingenieros |
| Curiosity | Curiosidad |
| Working with | Colaboramos con |
| The Suite | La Suite |
| Six products. One research engine. | Seis productos. Un solo motor de investigación. |
| Each product is a self-contained tool, but they share the same models, infrastructure, and obsession with shipping. | Cada producto es una herramienta independiente, pero comparten modelos, infraestructura, y la misma obsesión por entregar. |
| Enterprise AI assistants | Asistentes de IA empresariales |
| Multilingual, context-aware conversation engines. Drop into any product, fine-tuned to your domain, integrable with your stack. | Motores de conversación multilingües y conscientes del contexto. Se integran en cualquier producto, ajustados a tu dominio, conectables a tu stack. |
| Qualitative → quantitative | Cualitativo → cuantitativo |
| AI-assisted survey design and analysis. Turn open-ended responses into clean insights without losing nuance. | Diseño y análisis de encuestas asistido por IA. Convierte respuestas abiertas en insights claros sin perder matices. |
| Semantic image search | Búsqueda semántica de imágenes |
| Find visual assets by what they show, not what they're tagged. Plain-language search across your media library. | Encuentra imágenes por lo que muestran, no por sus etiquetas. Búsqueda en lenguaje natural sobre tu biblioteca multimedia. |
| Local-first AI database | Base de datos local-first |
| Embedded database for relational, document, vector, graph, and event data. SQLite-fast. AI-native. Single file. | Base embebida para datos relacionales, documentales, vectoriales, de grafo y de eventos. Tan rápida como SQLite. AI-nativa. Un solo archivo. |
| Voice synthesis engine | Motor de síntesis de voz |
| Human-level precision for automated audio production, TTS, and synthetic voices. The engine behind Parlantia. | Precisión a nivel humano para producción automatizada de audio, TTS y voces sintéticas. El motor detrás de Parlantia. |
| Letters turned to voice | Las letras hechas voz |
| An ever-growing catalog of AI-produced audiobooks and podcasts. Hear the world's text, narrated. | Un catálogo en expansión de audiolibros y podcasts producidos con IA. Escucha el texto del mundo, narrado. |
| Explore | Explorar |
| Don't see your problem in a product? We'll build it. | ¿No ves tu problema en un producto? Lo construimos. |
| AI & ML integration | Integración de IA y ML |
| Custom solutions on state-of-the-art foundations. Fine-tune pretrained models or build from scratch on your data — vision, language, audio, multimodal. | Soluciones a medida sobre tecnología de punta. Ajustamos modelos preentrenados o construimos desde cero sobre tus datos — visión, lenguaje, audio, multimodal. |
| Business intelligence platform | Plataforma de business intelligence |
| Connect your data sources and unlock recommendations, churn prediction, market insight, and forecasting through a unified interface. | Conecta tus fuentes de datos y desbloquea recomendaciones, predicción de bajas, market insight, y pronósticos en una sola interfaz. |
| Data engineering & dashboards | Ingeniería de datos y dashboards |
| Organization-wide data lakes, custom dashboards, analytic tools that make your business legible — and decisions easier. | Data lakes a nivel organización, dashboards personalizados, herramientas analíticas que hacen tu negocio legible — y las decisiones más fáciles. |
| The Team | El Equipo |
| Researchers, engineers, and a deep love of the work. | Investigadores, ingenieros, y un profundo amor por el trabajo. |
| Founded in Havana in 2018 by a team of computer-science professors and ML researchers, SYALIA has grown into a multidisciplinary studio shipping AI products to clients in Cuba, Latin America, and Europe. | Fundada en La Habana en 2018 por un equipo de profesores de ciencias de la computación e investigadores de ML, SYALIA es hoy un estudio multidisciplinario que entrega productos de IA a clientes en Cuba, Latinoamérica y Europa. |
| Meet the team | Conoce al equipo |
| Let's build | Construyamos |
| Got an AI problem worth solving? | ¿Tienes un problema de IA que valga la pena resolver? |
| Tell us what you're trying to do. We'll tell you whether we can help, what it would take, and what it would cost — usually within a week. | Cuéntanos qué quieres lograr. Te diremos si podemos ayudar, qué tomaría, y cuánto costaría — usualmente en menos de una semana. |
| Read the blog | Lee el blog |

---

## Appendix B: Per-product copy drafts (EN; ES side-by-side)

For each product sub-page (Tasks 12–16), draft copy is below. Tone matches the homepage: confident, sparse, technical-but-warm.

### voxpopuli

| Slot | EN | ES |
|---|---|---|
| h1 | VoxPopuli | VoxPopuli |
| Eyebrow | Product — voxpopuli | Producto — voxpopuli |
| Hero tagline | Turn open-ended responses into clean insights without losing nuance. AI-assisted survey design plus analysis, in one tool. | Convierte respuestas abiertas en insights claros sin perder matices. Diseño de encuestas asistido por IA y análisis, en una sola herramienta. |
| Feature 1 (icon `edit_note`) | Smarter surveys | Encuestas más inteligentes |
|  | Question recommendations grounded in your research goals — fewer leading questions, fewer dead ends. | Recomendaciones de preguntas alineadas con tus objetivos — menos preguntas guiadas, menos callejones sin salida. |
| Feature 2 (icon `auto_awesome`) | Themes you can defend | Temas que puedes defender |
|  | Open-ended responses get clustered into themes with traceable evidence — every theme links back to the responses behind it. | Las respuestas abiertas se agrupan en temas con evidencia rastreable — cada tema enlaza con las respuestas que lo sustentan. |
| Feature 3 (icon `bar_chart`) | Quant where you need it | Cuantitativo donde lo necesitas |
|  | Frequency, sentiment, segment-level breakdowns — all without losing the qualitative thread. | Frecuencia, sentimiento, desglose por segmento — sin perder el hilo cualitativo. |
| Spotlight A title | From "what did they say" to "what does it mean." | De "qué dijeron" a "qué significa". |
| Spotlight A body | Most survey tools dump open-ended responses on you and call it analysis. VoxPopuli reads them, clusters them, and presents themes you can act on — with the original quotes always one click away. | La mayoría de las herramientas de encuesta vuelcan las respuestas abiertas y le llaman análisis. VoxPopuli las lee, las agrupa, y presenta temas accionables — con las citas originales siempre a un clic. |
| Spotlight B title | Ship insights, not spreadsheets. | Entrega insights, no hojas de cálculo. |
| Spotlight B body | Reports export as polished documents, not 200-row CSVs. Your stakeholders see the conclusion first, the evidence underneath, and the data on demand. | Los reportes se exportan como documentos pulidos, no como CSVs de 200 filas. Tus stakeholders ven la conclusión primero, la evidencia debajo, y los datos a demanda. |
| CTA | Bring VoxPopuli to your research. | Lleva VoxPopuli a tu investigación. |

### clipper

| Slot | EN | ES |
|---|---|---|
| h1 | Clipper | Clipper |
| Eyebrow | Product — clipper | Producto — clipper |
| Hero tagline | Find visual assets by what they show, not what they're tagged. Plain-language search across your media library. | Encuentra imágenes por lo que muestran, no por sus etiquetas. Búsqueda en lenguaje natural sobre tu biblioteca multimedia. |
| Feature 1 (icon `search`) | Search like you talk | Busca como hablas |
|  | "A red bicycle in a courtyard" — Clipper finds it, even if no one tagged it. | "Una bicicleta roja en un patio" — Clipper la encuentra, aunque nadie la haya etiquetado. |
| Feature 2 (icon `filter_alt`) | Filter by anything | Filtra por lo que sea |
|  | Combine semantic search with traditional metadata: date, author, format, dimensions, custom fields. | Combina búsqueda semántica con metadatos tradicionales: fecha, autor, formato, dimensiones, campos personalizados. |
| Feature 3 (icon `cloud_done`) | Drops into your stack | Encaja en tu stack |
|  | Index your existing media library, S3 bucket, or DAM. No re-ingestion, no migration. | Indexa tu biblioteca actual, bucket S3 o DAM. Sin re-ingestión, sin migración. |
| Spotlight A title | Tags lie. Pixels don't. | Las etiquetas mienten. Los píxeles no. |
| Spotlight A body | Tag-based search assumes someone described every asset correctly when it was uploaded. They didn't. Clipper looks at what's actually in the image and answers based on that. | La búsqueda por etiquetas asume que alguien describió cada activo correctamente al subirlo. No fue así. Clipper mira lo que realmente hay en la imagen y responde sobre esa base. |
| Spotlight B title | One bar. One sentence. The asset. | Una barra. Una frase. El activo. |
| Spotlight B body | Type in plain language. Get back ranked results. Pick the one. Move on with your day. | Escribe en lenguaje natural. Recibe resultados rankeados. Elige uno. Sigue con tu día. |
| CTA | Bring Clipper to your library. | Lleva Clipper a tu biblioteca. |

### beaver

| Slot | EN | ES |
|---|---|---|
| h1 | Beaver | Beaver |
| Eyebrow | Product — beaver | Producto — beaver |
| Hero tagline | An embedded database for relational, document, vector, graph, and event data. SQLite-fast. AI-native. Single file. | Una base de datos embebida para datos relacionales, documentales, vectoriales, de grafo y de eventos. Tan rápida como SQLite. AI-nativa. Un solo archivo. |
| Feature 1 (icon `inventory_2`) | All the data shapes | Todas las formas de datos |
|  | One database for tables, JSON documents, vector embeddings, edges, and append-only events. No five-database stack. | Una sola base para tablas, documentos JSON, embeddings vectoriales, aristas, y eventos append-only. Sin un stack de cinco bases. |
| Feature 2 (icon `bolt`) | SQLite under the hood | SQLite por dentro |
|  | Beaver builds on SQLite's storage engine, so you inherit decades of reliability and operational maturity. | Beaver se apoya en el motor de SQLite — heredas décadas de fiabilidad y madurez operativa. |
| Feature 3 (icon `download`) | One file. No server. | Un archivo. Sin servidor. |
|  | The whole database is one portable file. Local-first, embeddable in any process, transactionally safe. | Toda la base es un archivo portátil. Local-first, embebible en cualquier proceso, transaccionalmente seguro. |
| Spotlight A title | The "five databases" problem, fixed. | El problema de las "cinco bases", resuelto. |
| Spotlight A body | Most modern apps end up with Postgres + Redis + Elastic + Pinecone + Kafka. Beaver collapses the AI-native subset of that stack into a single embedded engine. | La mayoría de las apps modernas terminan con Postgres + Redis + Elastic + Pinecone + Kafka. Beaver colapsa la parte AI-nativa de ese stack en un motor embebido. |
| Spotlight B title | Built for the agent era. | Construida para la era de los agentes. |
| Spotlight B body | When your application is an agent, the database needs to handle messy types — long-context memories, tool-call traces, vector recall — without operational overhead. Beaver does. | Cuando tu aplicación es un agente, la base necesita manejar tipos desordenados — memorias de contexto largo, trazas de llamadas a herramientas, recall vectorial — sin sobrecarga operativa. Beaver lo hace. |
| CTA | Try Beaver. | Prueba Beaver. |

### resona

| Slot | EN | ES |
|---|---|---|
| h1 | Resona | Resona |
| Eyebrow | Product — resona | Producto — resona |
| Hero tagline | Human-level precision for automated audio production, TTS, and synthetic voices. The engine that powers Parlantia. | Precisión a nivel humano para producción automatizada de audio, TTS y voces sintéticas. El motor que impulsa Parlantia. |
| Feature 1 (icon `record_voice_over`) | Voices that breathe | Voces que respiran |
|  | Pacing, intonation, breath — Resona gets the small things right, so listeners forget they're hearing a synthesizer. | Ritmo, entonación, respiración — Resona acierta en lo pequeño, así los oyentes olvidan que escuchan un sintetizador. |
| Feature 2 (icon `tune`) | Direct it like a voice actor | Dirígela como a un actor |
|  | Style controls: warmth, urgency, formality, regional accent. Set the tone per chapter, per paragraph, per phrase. | Controles de estilo: calidez, urgencia, formalidad, acento regional. Ajusta el tono por capítulo, párrafo, frase. |
| Feature 3 (icon `multitrack_audio`) | Production-grade output | Salida de calidad de producción |
|  | 48 kHz stereo, mastered for any platform — audiobook stores, podcasts, IVR, in-product narration. | 48 kHz estéreo, masterizado para cualquier plataforma — tiendas de audiolibros, podcasts, IVR, narración en producto. |
| Spotlight A title | The unglamorous half is the breath. | La mitad ingrata es la respiración. |
| Spotlight A body | TTS that sounds robotic always gives itself away in the small moments — the missing inhale before a long sentence, the flat ending of a question. Resona models those moments explicitly. | El TTS robótico siempre se delata en los pequeños momentos — la inhalación que falta antes de una frase larga, el cierre plano de una pregunta. Resona modela esos momentos explícitamente. |
| Spotlight B title | One engine. Many voices. | Un motor. Muchas voces. |
| Spotlight B body | Use a curated voice from our library, or create one from a clean recording — for branded narration, multilingual products, accessibility. | Usa una voz curada de nuestra biblioteca o crea una a partir de una grabación limpia — para narración con marca, productos multilingües, accesibilidad. |
| CTA | Hear what Resona sounds like. | Escucha cómo suena Resona. |

### parlantia

| Slot | EN | ES |
|---|---|---|
| h1 | Parlantia | Parlantia |
| Eyebrow | Product — parlantia | Producto — parlantia |
| Hero tagline | An ever-growing catalog of AI-produced audiobooks and podcasts. Hear the world's text, narrated. | Un catálogo en expansión de audiolibros y podcasts producidos con IA. Escucha el texto del mundo, narrado. |
| Feature 1 (icon `library_books`) | A living library | Una biblioteca viva |
|  | New audiobooks every week, across genres and languages — public-domain classics and original works alike. | Nuevos audiolibros cada semana, en distintos géneros e idiomas — clásicos de dominio público y obras originales. |
| Feature 2 (icon `podcasts`) | Podcasts you don't have to host | Podcasts sin que los tengas que alojar |
|  | Long-form content, narrated and produced end-to-end. Drop your text in, get a finished episode. | Contenido de formato largo, narrado y producido de extremo a extremo. Entrega tu texto, recibe un episodio terminado. |
| Feature 3 (icon `language`) | Multilingual catalog | Catálogo multilingüe |
|  | Spanish-first, but expanding — every title can be re-rendered in another language without re-recording. | Español primero, pero en expansión — cada título puede re-renderizarse en otro idioma sin volver a grabar. |
| Spotlight A title | Not every text needs a human in the booth. | No todo texto necesita un humano en cabina. |
| Spotlight A body | A breaking news brief, a research paper, a product manual — these don't need a Hollywood narrator, they need a clear voice that's available right now. Parlantia is that voice. | Una nota de última hora, un artículo de investigación, un manual — no necesitan un narrador de Hollywood, necesitan una voz clara disponible ahora. Parlantia es esa voz. |
| Spotlight B title | Powered by Resona. | Impulsada por Resona. |
| Spotlight B body | Every Parlantia title is rendered through Resona — the same voice engine SYALIA builds for enterprise — so the catalog gets sharper every week as the engine improves. | Cada título de Parlantia se renderiza con Resona — el mismo motor de voz que SYALIA construye para empresas — así el catálogo mejora cada semana al mejorar el motor. |
| CTA | Listen on Parlantia. | Escucha en Parlantia. |
