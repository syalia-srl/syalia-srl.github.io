---
date: 2026-05-05
type: design
project: syalia-homepage
status: approved-for-planning
---

# Homepage redesign — bolder, dark, kinetic

## Goal

Take `syalia.com`'s front page from a generic Tailwind-template look to a confident, dark-first, AI-product-suite showcase that puts the six SYALIA products at the center and feels slick rather than corporate. Out of scope for this spec: full restyle of product sub-pages.

## Decisions locked in brainstorming

| | Decision |
|---|---|
| Aesthetic register | "AI product showcase" — dark-first, display sans, single warm accent on a near-black field, restrained motion, big confident type |
| Theme support | **Dark only.** Drop the existing light-mode toggle and all `dark:` variants. Simplifies markup considerably. |
| Languages | Keep EN/ES. Migrate from duplicate `data-lang` spans to single elements with `data-i18n data-en="…" data-es="…"`. Slick staggered fade-up transition on swap. |
| Product navigation | Real multi-page navigation to `/superbot`, `/voxpopuli`, etc. (no SPA), but with the **View Transitions API** for a smooth morph. Each card and each sub-page hero gets a matching `view-transition-name`. |
| Scroll motion | IntersectionObserver-driven fade+slide reveals on first viewport entry. No scroll-pinned sequences (defer that). |
| Hero motion | Three slowly drifting blurred blobs + radial-masked grid. Pure CSS keyframes, GPU-friendly. |
| Build setup | Stay on the **Tailwind CDN** approach used today. No build step. Custom Tailwind config remains inline in `<script>`. |

## Visual system

### Palette

```
ink-950   #05071a   page background
ink-900   #0a0d1f   nav, deep cards
ink-700   #1c2138   borders, dividers (alpha)
ink-300   #a3aece   secondary text
ink-100   #e9ecf5   primary text
ink-500   #475070   numerals, "01/02" markers
syalia-* (kept)     blue gradient on logo + accent text
accent-400 #fbbf24  amber — single warm accent for CTAs, eyebrow rules, hover ticks
product accents     emerald/violet/teal/orange/lime/orange — used ONLY as glyph chip color and hover glow per card; never as text body color
```

The current per-product rainbow is replaced with a unified card treatment. Each product retains a color identity but it lives in the icon chip and the hover glow only — not in spans of body text.

### Typography

- **Display:** Space Grotesk 600/700 — used for h1, h2, h3, big numerals, brand "SYALIA". Letter-spacing -0.02em.
- **Body:** Inter 400/500/600/700 — paragraph copy, nav, captions.
- **Mono:** browser default monospace (no extra font load) — used for the "01/02/03" card numerals and category tags ("conversation", "research", etc.).

Two web fonts max. Both via Google Fonts with `&display=swap`.

### Iconography

Material Icons CDN (already in use). Keep current product glyphs.

## Section-by-section

### 1. Top bar

Sticky, `backdrop-blur-xl`, hairline bottom border at white/5.

- Brand: gradient blue lozenge with display-bold "S" + wordmark "SYALIA".
- Nav links: Products, Services, Team, Blog (external).
- Right cluster: EN/ES pill button (single button, not a checkbox toggle), primary "Talk to us" CTA in amber.
- Mobile: hamburger pattern preserved from existing site, restyled to match.

### 2. Hero

- Eyebrow rule: amber 32px hairline + small uppercase tracked text (`A CUBAN AI LAB — BUILDING THE NEXT DECADE`).
- Headline: three-line display, line 2 in a `from-syalia-300 via-white to-accent-300` gradient text. Lines:
  - "We don't sell"
  - "artificial intelligence." *(gradient)*
  - "We build it." *(softer ink-200)*
- Tagline (max 2 lines, ~30 words).
- Two CTAs: white-fill "See the product suite" (primary) and ghost "Start a conversation".
- Stats strip (4 columns): `6 / Production AI products`, `2018 / Founded in Havana`, `12+ / Researchers & engineers`, `∞ / Curiosity`. **Numbers are placeholders — confirm with Alex before launch.**
- Background: three drifting blurred blobs (mix-blend `screen`) + radial-masked grid + subtle SVG noise overlay at 4% opacity.
- Bottom 32px: gradient fade to `ink-950` so the section doesn't end on a hard edge.

### 3. Trust strip

Single auto-scrolling marquee, opacity 70%, edge-masked. Contents: industries SYALIA serves (placeholder list — swap to client logos when available). 40s linear loop.

### 4. Products (the centerpiece)

- Section header: 2-column. Left: amber eyebrow `THE SUITE` + display headline "Six products. / One research engine." (line 2 in `ink-300`). Right: 2-line description, max-width set.
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`. 6 cards.
- Card structure (per product):
  - Subtle linear-gradient background (white/3 → white/1) on a ~rounded-3xl corner radius.
  - 1px border at white/8, hover → white/18.
  - Hover lift: `translateY(-4px)` over 500ms cubic-bezier(.2,.8,.2,1).
  - Hover glow: radial gradient in product accent color, opacity 0 → 0.35 over 500ms, mix-blend handled by overflow-hidden.
  - **Top-left:** color-tinted icon chip (12×12, rounded-xl, accent-color/15 fill + accent-color/30 border).
  - **Top-right:** mono numeral `01–06` in muted `ink-400` — brightens to `ink-200` on hover.
  - **Title:** display 3xl bold.
  - **Baseline tagline** (always visible): one short sentence, `ink-300`. On hover, drifts up 6px and dims to 60% opacity.
  - **Peek paragraph** (hidden by default): two-sentence description, fades in + slides up 8px on hover.
  - **Bottom row:** "Explore →" in product accent color + mono category tag (`conversation`, `research`, `vision`, `data`, `audio`, `media`).
  - **Card is `<a>`** linking to the product sub-page.
  - **CSS:** `view-transition-name: card-<slug>` for the morph into sub-page on click.
- Card content table (final copy):

| Slug | Title | Baseline | Peek (full) | Tag |
|---|---|---|---|---|
| superbot | Superbot | Enterprise AI assistants | Multilingual, context-aware conversation engines. Drop into any product, fine-tuned to your domain, integrable with your stack. | conversation |
| voxpopuli | VoxPopuli | Qualitative → quantitative | AI-assisted survey design and analysis. Turn open-ended responses into clean insights without losing nuance. | research |
| clipper | Clipper | Semantic image search | Find visual assets by what they show, not what they're tagged. Plain-language search across your media library. | vision |
| beaver | Beaver | Local-first AI database | Embedded database for relational, document, vector, graph, and event data. SQLite-fast. AI-native. Single file. | data |
| resona | Resona | Voice synthesis engine | Human-level precision for automated audio production, TTS, and synthetic voices. The engine behind Parlantia. | audio |
| parlantia | Parlantia | Letters turned to voice | An ever-growing catalog of AI-produced audiobooks and podcasts. Hear the world's text, narrated. | media |

All copy needs ES translation pairs.

### 5. Services

Three big numbered horizontal rows, separated by `border-t border-white/10`:

- Eyebrow: amber rule + `SERVICES`.
- Section headline: "Don't see your problem in a product? / We'll build it." (line 2 in `ink-300`).
- Each row: 2-column-of-12 numeral / 5-column title / 5-column description.
- Numerals: 5xl display, `ink-500` (muted intentionally).
- Three services: AI & ML integration, Business intelligence platform, Data engineering & dashboards. Copy from existing site, lightly tightened.

### 6. Team teaser

7/5 split:
- Left: amber eyebrow `THE TEAM` + display headline "Researchers, engineers, / and a deep love of the work."
- Right: founding paragraph + amber link "Meet the team →".
- No team photos on the home page (defer to a sub-page).

### 7. Contact

Single centered call:
- Eyebrow rule on both sides: `LET'S BUILD`.
- Display headline 7xl: "Got an AI problem / worth solving?"
- 2-line tagline.
- Primary CTA: amber pill `hello@syalia.com` (mailto).
- Secondary: ghost pill "Read the blog".

### 8. Footer

Lean: brand mark left, four social/blog links right, hairline top border. No multi-column site map.

## Interactions

### Language switch (the "cool transition")

Click the EN/ES pill in the top bar:

1. Add class `lang-out` to every `[data-i18n]` element in document order, with `transition-delay` set to `i * 12ms` (i = node index).
2. After the longest delay + 200ms (a single `setTimeout`), iterate again and replace `el.textContent` with `el.dataset[targetLang]`, then swap class `lang-out` → `lang-in`.
3. Persist choice in `localStorage.lang`.

CSS:

```css
[data-i18n] {
  transition: opacity .25s cubic-bezier(.2,.8,.2,1),
              transform .25s cubic-bezier(.2,.8,.2,1);
  will-change: opacity, transform;
}
[data-i18n].lang-out { opacity: 0; transform: translateY(-6px); }
```

Result: cascading "wave" of text refreshes top-to-bottom across the page. Total feel ~400ms regardless of element count (the stagger compresses for large counts via a max delay cap of 250ms).

Edge cases:
- Elements with embedded HTML (e.g., a `<span>` mid-headline for the gradient line) need either pre-rendered HTML in `data-en-html`/`data-es-html` or a small post-swap re-wrap. We'll prefer HTML-aware swaps for the few elements that need it (headline, contact CTA), plain `textContent` everywhere else.
- Initial language: `localStorage.lang` if set, else `navigator.language.startsWith('es') ? 'es' : 'en'`.

### Product card → sub-page (view transition)

1. Each card declares `style="view-transition-name: card-<slug>"`.
2. Each sub-page's hero region declares the **same** name on its primary heading or wrapping element.
3. Anchor click triggers normal navigation; the browser auto-applies the transition.
4. Default transition: built-in cross-fade. Optional refinement (post-MVP): custom CSS using `::view-transition-old/new(card-<slug>)` for a tighter morph.
5. Fallback: browsers without VT support get a normal page load, no error.

### Reveal-on-scroll

`.reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s, transform .8s cubic-bezier(.2,.8,.2,1); }` plus `.reveal.in { opacity: 1; transform: translateY(0); }`. IntersectionObserver fires once per element at threshold 0.12, then unobserves.

`prefers-reduced-motion: reduce` short-circuits all animations: instant reveal, no blob drift, no marquee, no language fade. Implemented via media-query overrides at the bottom of the stylesheet.

## File-level changes

- `index.html` — full rewrite. ~430 lines. Self-contained markup + inline Tailwind config + inline custom CSS + inline language/theme JS.
- Each of `superbot/index.html`, `voxpopuli/index.html`, `clipper/index.html`, `beaver/index.html`, `resona/index.html`, `parlantia/index.html` — minimal touchups: add `view-transition-name: card-<slug>` to the hero element. **No visual restyle in this spec.**
- `js/custom.js` — review for staleness; if used only for the old language toggle, replace with the new staggered swap module. If wider, keep as-is and add the new code separately.
- `img/` and `assets/` unchanged.

## Acceptance criteria

1. Front-page renders with the new dark visual system on Chrome (latest), Firefox (latest), Safari 18+.
2. Hovering a product card reveals the peek paragraph and applies the accent glow.
3. Clicking a product card navigates to its sub-page; on Chromium browsers, a smooth view transition occurs.
4. EN/ES toggle swaps every translatable element with the staggered fade-up transition; choice persists across reloads via `localStorage`.
5. All sections animate in once on first scroll into view.
6. With `prefers-reduced-motion: reduce`, no animations run.
7. No console errors. No broken links. No broken images.
8. Lighthouse score ≥ 90 for Performance and Accessibility on the homepage.

## Out of scope (explicit)

- Sub-page restyle (only the view-transition annotation lands).
- Real client logos on the trust strip (placeholder labels until logos are provided).
- Mobile hamburger menu redesign — preserve existing pattern, restyle only.
- A `prefers-color-scheme: light` mode — site is dark-only.
- Build pipeline / Tailwind compilation — stay on CDN.
- Replacing the placeholder stats (6 / 2018 / 12+ / ∞) with real numbers — Alex confirms separately.

## Open items requiring Alex's call before implementation

1. Confirm or replace the four hero stats.
2. Confirm hero copy: "We don't sell artificial intelligence. We build it." — keep as-is, soften, or rewrite?
3. Provide ES translations for the new product peek copy and the new section/eyebrow strings (or accept light-touch translations and review).
4. Provide industries (or logos) for the trust strip.
