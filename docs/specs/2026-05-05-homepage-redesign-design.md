---
date: 2026-05-05
type: design
project: syalia-homepage
status: approved-for-planning
---

# Homepage redesign — bolder, dark, kinetic

## Goal

Take `syalia.com` from a generic Tailwind-template look to a confident, dark-first, AI-product-suite showcase that puts the six SYALIA products at the center and feels slick rather than corporate. Scope: front page, all six product sub-pages, and a new dedicated `/team/` page — all sharing one visual system.

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
| Surfaces in scope | Front page, all six product sub-pages (full restyle to a shared template), new dedicated `/team/` page. |
| Trust strip | Real client logos (9 available in `img/clients/`) in an auto-scrolling marquee. Hover the strip → slow to ~25%. Hover an individual logo → it lights up while siblings dim. |
| Team | New `/team/` page with one block per cofounder (3 today). Photo + bio + "Selected work" + "Connect" links. Homepage `#team` becomes a teaser linking out. |

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

### 3. Trust strip (real client logos)

Single auto-scrolling marquee of partner / client logos, edge-masked left and right with a `linear-gradient(to right, transparent, black 8%, black 92%, transparent)` mask.

Logos available today (in `img/clients/`):

| File | Brand |
|---|---|
| `dofleini-logo.svg` | Dofleini |
| `logo-cognivium.png` | Cognivium |
| `logo-deepdata.png` | DeepData |
| `logo-fundacion.png` | Fundación |
| `logo-glacial.png` | Glacial |
| `logo-gplsi.png` | GPLSI |
| `logo-matcom.png` | MatCom |
| `logo-postdataclub.png` | PostData Club |
| `logo-tecnomatica.png` | Tecnomatica |

Render the list **twice in sequence** inside one track so the `translateX(-50%)` keyframe loop is seamless (track is 200% width of the visible content; resetting to 0 looks identical to the midpoint).

Logo treatment:
- Height 36px, `object-contain`, white-tinted via `filter: brightness(0) invert(1)` (so SVG/PNG colors normalize to monochrome on the dark background).
- Default state: `opacity: 0.55`, `filter: brightness(0) invert(1)`.
- Per-logo hover: `opacity: 1`, drop the brightness filter (logo regains its original color), `transform: translateY(-2px) scale(1.02)`. 250ms ease-out.

Marquee animation:
- Track keyframe `marqueeX` runs `translateX(0 → -50%)` over **40s** linear.
- On `mouseenter` of the **strip wrapper** (not individual logos), animation duration is overridden to **160s** via `animationDuration: '160s'` (4× slowdown — no jump because the keyframes preserve current position when duration changes).
- On `mouseleave`, restore to 40s.
- `prefers-reduced-motion: reduce` short-circuits to no animation; logos are simply laid out and the strip is statically displayed (no truncation — the mask still applies).

Section header is light: a single small uppercase line above the strip, e.g., `TRUSTED BY` or `WORKING WITH`. Final wording: `WORKING WITH` (more peer-tone, less brag).

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
  - **CSS:** `view-transition-name: card-<slug>` is set on the **`<h3>` title element inside the card** (not on the whole card), so the morph is a text-to-text headline transition — cleaner than morphing a whole card with mixed contents into a heading.
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
- Right: founding paragraph + amber link `Meet the team →` linking to `/team/`.
- No team photos on the home page; the dedicated `/team/` page is where they live.

### 7. Contact

Single centered call:
- Eyebrow rule on both sides: `LET'S BUILD`.
- Display headline 7xl: "Got an AI problem / worth solving?"
- 2-line tagline.
- Primary CTA: amber pill `hello@syalia.com` (mailto).
- Secondary: ghost pill "Read the blog".

### 8. Footer

Lean: brand mark left, four social/blog links right, hairline top border. No multi-column site map.

## Product sub-page template

All six product sub-pages share a single template. The only per-page differences are:

- Accent color (`--c`): emerald / violet / teal / orange / lime / orange — same colors as the homepage card glyph chip.
- Glyph (Material Icons name).
- Hero copy: title, tagline, 2–4 sentence pitch.
- 3 feature bullets (icon + title + 1-line description).
- 1–2 alternating "spotlight" sections (image/illustration + headline + paragraph).
- CTA copy.

### Sub-page sections

1. **Top bar** — identical component to homepage. Active link highlight on `Products`.
2. **Hero**
   - Eyebrow: `<sup-script>← back to all products</sup-script>` link in muted ink-300, then accent rule + `PRODUCT — <slug>`.
   - Title: display 6xl–8xl, single line preferred. Color: white. **`view-transition-name: card-<slug>`** on the `<h1>` element so the morph from the homepage card lands here.
   - Tagline: ink-300, ~30 words.
   - Two CTAs (primary in accent color; secondary ghost).
   - Decorative right-side element: oversized glyph (Material icon at 18rem), accent-color/8 fill, masked by gradient. Intentionally still — no animation; the page motion comes from the view transition itself.
3. **Feature row** — three columns, each: icon chip (same chip-style as homepage card) + display 2xl headline + ink-300 1-line description.
4. **Spotlight A** — alternating two-column. Image left, copy right. Image is either a real product screenshot/animation when available, or an SVG composition built from the existing `assets/*.svg` library. Copy: small accent eyebrow, display 4xl headline, ink-300 paragraph, optional bullet list.
5. **Spotlight B** — second alternating row, image right / copy left.
6. **CTA block** — identical structure to homepage `Contact` section but adapted: headline addresses the product directly ("Bring `<Product>` to your team."), primary CTA uses product accent color.
7. **Footer** — identical to homepage.

### Per-product copy (English; ES TBD)

Hero / feature / spotlight copy will be drafted from current sub-page content (already exists for each product) and tightened to the new register. Existing copy is the source of truth for technical claims; tone gets adjusted, not facts. **Drafts will be inlined in the implementation plan, one per sub-page, for Alex's review before the rewrite lands.**

### Out-of-the-box assets per product

| Slug | Accent | Glyph | Existing asset hints |
|---|---|---|---|
| superbot | `#10b981` (emerald) | `chat_bubble_outline` | `superbot.png` exists in `img/` |
| voxpopuli | `#8b5cf6` (violet) | `insights` | `voxpopuli.png` exists in `img/` |
| clipper | `#14b8a6` (teal) | `image_search` | none — generate from `assets/cards.svg` |
| beaver | `#f97316` (orange) | `dns` | none — generate from `assets/data.svg` |
| resona | `#84cc16` (lime) | `graphic_eq` | none — abstract waveform composition |
| parlantia | `#fb923c` (orange-300) | `menu_book` | use `assets/pdf/` covers if appropriate |

### View-transition pairing rules

For each `<slug>`, the homepage card's **title `<h3>`** and the sub-page hero's **title `<h1>`** must declare matching `view-transition-name: card-<slug>`. Names must be unique on each page. The browser morphs the small `<h3>` into the huge `<h1>` — text-to-text, clean. The rest of the card (icon chip, peek text) fades out with the page; the rest of the sub-page hero fades in.

If both pages declare the same name, the transition works on hard navigation (not just within an SPA shell). No JS required beyond the browser's built-in cross-document view transition support — which Chromium implements on multi-page navigations as of 2024 and is gated by a single `<meta name="view-transition" content="same-origin">` opt-in tag.

## Team page (`/team/`)

A new page. The homepage `#team` section becomes a teaser linking here.

### Layout

1. **Top bar** — identical component, `Team` link active.
2. **Hero**
   - Eyebrow: `THE TEAM` with amber accent rule.
   - Display headline: "Three people. / One curious obsession." (line 2 in `ink-300`). ES variant TBD.
   - Tagline: 2-line founding-story line. Sources existing copy from current home page.
3. **Three cofounder blocks** — vertically stacked, full-width per block, `border-t border-white/8` between blocks, generous py-24.
4. **Closing CTA** — single line "Want to work with us?" + amber pill `hello@syalia.com`.
5. **Footer** — identical to homepage.

### Cofounder block structure

Each block is a 12-column grid:

- **Cols 1–4 (left):**
  - Photo: square frame, `aspect-square`, rounded-2xl, `object-cover`, fixed width ~280px on desktop, full width on mobile. Subtle `ring-1 ring-white/10`. **No** heavy color ring.
  - Below photo: small line `COFOUNDER — <ROLE>` in mono, accent amber.
- **Cols 5–12 (right):**
  - Display 4xl name with degree (e.g., "Yudivián Almeida Cruz, Ph.D.")
  - Display 2xl tagline (1 sentence — to be provided by Alex). ink-300.
  - Bio paragraphs (2–3 paragraphs, ink-200). ~150–200 words.
  - **Selected work** — heading `SELECTED WORK` in mono uppercase + amber rule, then a vertical list of items. Each item: title (ink-100) on first line, supporting line (publication / venue / year, ink-400) on second line, optional external link arrow on the right. Designed for ~5–10 items per cofounder.
  - **Connect** — heading `CONNECT` in mono uppercase + amber rule, then inline pills/icons for: email, LinkedIn, Google Scholar, GitHub, X/Twitter, personal site (whichever apply per cofounder).

### Three cofounders (data already in repo)

| Photo | Name | Role |
|---|---|---|
| `img/team/1.jpg` | Yudivián Almeida Cruz, Ph.D. | Cofounder — CEO |
| `img/team/2.jpg` | Suilan Estévez Velarde, Ph.D. | Cofounder — COO |
| `img/team/3.jpg` | Alejandro Piad Morffis, Ph.D. | Cofounder — CTO |

Bio paragraphs, taglines, "Selected work" lists, and "Connect" links **will be supplied by Alex separately** and inserted into the rendered template. The implementation will include a clearly-marked `<!-- BIO: ... -->` comment block per cofounder showing where each piece goes.

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

- `index.html` — full rewrite. ~450 lines. Self-contained markup + inline Tailwind config + inline custom CSS + inline language/transition JS.
- Each of `superbot/index.html`, `voxpopuli/index.html`, `clipper/index.html`, `beaver/index.html`, `resona/index.html`, `parlantia/index.html` — full rewrite per the **product sub-page template** above.
- New: `team/index.html` — built per the **team page** spec.
- `js/custom.js` — replaced by inline JS in each page (view transitions and language swap are page-local). The file is deleted unless it carries logic worth keeping (audit in implementation plan).
- `assets/shared.css` (new, optional) — if duplication of inline `<style>` blocks across 8 pages becomes painful, factor the shared system rules into one stylesheet. Decide during implementation; not required up front.
- `img/` and `assets/` unchanged on disk; new compositions for sub-page hero illustrations may be added under `assets/products/` if needed.

## Acceptance criteria

1. Front page, all six product sub-pages, and the team page render with the new dark visual system on Chrome (latest), Firefox (latest), Safari 18+.
2. Hovering a product card on the homepage reveals the peek paragraph and applies the accent glow.
3. Clicking a product card navigates to its sub-page; on Chromium browsers, a smooth view transition morphs the card into the sub-page hero.
4. The trust strip auto-scrolls; hovering the strip slows to ~25% speed, leaving restores; per-logo hover de-saturates the rest and lights up the hovered logo.
5. EN/ES toggle swaps every translatable element on every page with the staggered fade-up transition; choice persists across reloads via `localStorage`.
6. All sections animate in once on first scroll into view.
7. The team page renders three cofounder blocks at full layout fidelity using the supplied photos; bio / selected-work / connect content is loaded from the markup Alex provides.
8. With `prefers-reduced-motion: reduce`, no animations run anywhere.
9. No console errors. No broken links. No broken images.
10. Lighthouse score ≥ 90 for Performance and Accessibility on the homepage and the team page.

## Out of scope (explicit)

- Mobile hamburger menu redesign — preserve existing pattern, restyle only.
- A `prefers-color-scheme: light` mode — site is dark-only.
- Build pipeline / Tailwind compilation — stay on CDN.
- Blog (`blog.syalia.com`) — separate property, no changes.
- Server-side rendering / Jekyll resurrection — site stays static HTML.
- Backend / forms — `Talk to us` CTAs remain `mailto:hello@syalia.com` until further notice.

## Open items requiring Alex's input before / during implementation

1. **Hero stats** — confirm or replace the four numbers (6 / 2018 / 12+ / ∞).
2. **Hero headline** — keep "We don't sell artificial intelligence. We build it.", soften, or rewrite?
3. **ES translations** — provide for new copy, or accept light-touch translations for review.
4. **Sub-page copy drafts** — Alex reviews drafts (one per product) inline in the implementation plan before they ship.
5. **Cofounder content** — for each of the three cofounders: 1-line tagline, 2–3 bio paragraphs, "Selected work" list (~5–10 items each), "Connect" links. Can be supplied incrementally; placeholders ship until provided.
6. **Trust-strip section header** — confirm `WORKING WITH` or propose alternative.
