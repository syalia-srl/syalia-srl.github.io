---
date: 2026-05-05
type: design
project: syalia-homepage
status: approved-for-planning
extends: 2026-05-05-homepage-redesign-design.md
---

# Team page (lean) + per-cofounder CV pages

## Goal

Replace the current placeholder-heavy `/team/` hub with a lean visual overview, and add a deep CV page per cofounder. Visitors can scan three faces and one paragraph each on the hub; click through for the full bio, career, selected work, awards, and public-engagement record.

## Decisions locked in brainstorming

| | Decision |
|---|---|
| Hub depth | Lean. Each cofounder block on `/team/` becomes: square photo + role + 1-line tagline + 1 bio paragraph + `Read full CV →` link. The current placeholder structure (Selected Work / Connect on the hub) **moves to** the CV pages. |
| CV depth | "Curated highlights." Each CV page is a long-form profile, not an exhaustive academic homepage. For the full bibliography, visitors are sent out to **Google Scholar** and **ORCID**. |
| URL pattern | `/team/yudivian/`, `/team/suilan/`, `/team/alejandro/` — first names, no full slugs. |
| CV page layout | Two-column with sticky sidebar on desktop, stacked on mobile. Sidebar holds photo + identity + key positions table + connect pills. Right column scrolls through bio → career highlights → selected work → awards → public engagement → outro card. |
| Visual system | Reuses `assets/shared.css`. Adds three small CV-specific helpers (`.timeline-row`, `.work-row`, `.cv-prose`) that can live in a per-page `<style>` block or be promoted to `assets/shared.css` if they get reused. |
| Languages | EN/ES via the same `data-i18n` pattern as the rest of the site. Drafts below are EN-first; ES translations are TBD content gaps Alex fills in. |

## Surfaces in scope

1. `/team/index.html` — restructured to the lean hub layout.
2. `/team/yudivian/index.html` — new.
3. `/team/suilan/index.html` — new.
4. `/team/alejandro/index.html` — new.

## Visual system additions

```css
.cv-prose       { font-size: 1.0625rem; line-height: 1.7; color: var(--ink-200); }
.cv-prose p + p { margin-top: 1rem; }

/* Generic year-on-left timeline (used in Career highlights and Awards) */
.timeline-row     { display: grid; grid-template-columns: 7rem 1fr; gap: 1.5rem; padding: 0.875rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); align-items: baseline; }
.timeline-row:last-child { border-bottom: 0; }
.timeline-year    { font-family: 'Space Grotesk', system-ui, sans-serif; font-size: 0.875rem; color: var(--ink-300); letter-spacing: 0.04em; }

/* Selected-work item (title + meta on left, outbound arrow on right) */
.work-row     { display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); align-items: baseline; }
.work-row:last-child { border-bottom: 0; }
.cv-meta      { font-size: 0.875rem; color: var(--ink-400); margin-top: 0.125rem; }
```

These rules are introduced in the per-page `<style>` block in the first CV page implementation. After the second CV page lands, promote them to `assets/shared.css` and remove the duplication.

## Lean `/team/` hub — section by section

Same shell (top bar / footer) as today. Hero copy unchanged from the current `/team/` page.

Replace the three current cofounder `<section>` blocks with a single 3-up grid (stacked on mobile, three columns on `lg:`). Each cell is one cofounder. Cell contents:

- **Photo:** square, `aspect-square`, rounded-2xl, `object-cover`, `ring-1 ring-white/10`. Same source files as today (`/img/team/1.jpg`, `2.jpg`, `3.jpg`).
- **Role label:** mono, uppercase tracked, amber. e.g., `COFOUNDER — CEO`.
- **Name:** display 2xl-3xl bold, includes `, Ph.D.` (degree treated in `text-ink-300`).
- **Tagline:** display sm/md, `text-ink-300`, single line — see drafts below.
- **Bio paragraph:** body, ~60–80 words, `text-ink-200` — see drafts below.
- **CTA:** `Read full CV →` linking to `/team/<slug>/`. Style as a ghost pill or an underlined link in `text-ink-100 hover:text-accent-400`.

Closing CTA + footer stay as in the current `/team/index.html`.

### Hub copy drafts (EN — ES TBD)

#### Yudivián Almeida Cruz, Ph.D. — Cofounder, CEO

> **Tagline:** Computer scientist building Cuba's AI future.
>
> Founded and directs the AI Research Group at MatCom UH since 2008. Two doctorates in computer science (Havana / Alicante). President of the University of Havana's Scientific Council, and member of Cuba's national advisory bodies on AI, big data, and public health. Lead author of *Cecilia*, Cuba's first Spanish language model, and co-author of the COVID-19 modeling work that won the country's national technological innovation award.

#### Suilan Estévez Velarde, Ph.D. — Cofounder, COO

> **Tagline:** Educator and architect of Cuba's AutoML stack.
>
> Dean of MatCom UH since 2025 and Full Professor since March 2025. PhD in Computer Science (Havana / Alicante). Co-creator of AutoGOAL — the AutoML framework powering several SYALIA products — and core contributor to *Cecilia*. In 2024–2025 led Cuba's largest AI-literacy effort: 22 conferences, 7 workshops, and the National AI Tour across 5 provinces.

#### Alejandro Piad Morffis, Ph.D. — Cofounder, CTO

> **Tagline:** Researcher turning ideas into production AI.
>
> Profesor Titular at MatCom UH and former Vice Dean (2022–2025). PhD in Computer Science (Havana / Alicante). Co-creator of AutoGOAL and core contributor to *Cecilia*. Vice President of the Cuban Society of Mathematics and Computing, and Coordinator of the Youth Council at the Cuban Academy of Sciences. Within SYALIA, leads technical direction of the product suite.

## CV page template — section by section

Header (slim, no large hero):

1. **Top bar** — same as the rest of the site, with `Team` link styled active.
2. **Breadcrumb row:** `← Back to team`, linking to `/team/`. Small, ink-300.
3. **Main 4/8 grid:**
   - **Left column (sticky on `lg:` and up):**
     - Square photo (`aspect-square w-full max-w-[320px] rounded-2xl ring-1 ring-white/10`).
     - Role label (mono, uppercase tracked, amber).
     - Name (display 3xl bold, degree in `text-ink-300`).
     - **Key positions** subsection: amber-rule + mono uppercase header. Then a vertical list of 5 entries — each is a one-line role on `text-ink-100` over a `text-ink-400` "institution — since YYYY" meta line.
     - **Connect** subsection: amber-rule + mono uppercase header. Then four pills (`email`, `scholar`, `ORCID`, `LinkedIn`) — small icon + label, rounded-full, white/15 border, hover white/40.
   - **Right column (scrolling):**
     - **About eyebrow** + 1-line tagline (display 2xl/3xl medium, `text-ink-200`).
     - **Bio:** 3 paragraphs (`.cv-prose`).
     - **Career highlights:** 5–6 `.timeline-row` rows. Year on left, role + institution on right.
     - **Selected work:** 6–8 `.work-row` rows. Title + venue/year on left, outbound arrow on right.
     - **Awards:** 4–5 `.timeline-row` rows. Year on left, award + institution on right.
     - **Public engagement:** 1 paragraph (`.cv-prose`).
     - **Outro card:** "Looking for the full bibliography?" — short pitch + `Scholar` and `ORCID` ghost pills. Styled as a small bordered card, ~`p-6 rounded-2xl border border-white/8 bg-white/[0.02]`.
4. **Footer** — same as the rest of the site.

All content is wrapped with `data-i18n` for EN/ES (same machinery as `/team/`). Bio and public-engagement paragraphs use `data-en` / `data-es` (plain text). Section headings ("Career highlights", "Selected work", "Awards", "Public engagement", "Connect", "Key positions") use `data-en` / `data-es` directly. Career and Award rows: each role/title and meta line gets `data-i18n` independently.

## Cofounder content drafts

### 1. Yudivián Almeida Cruz, Ph.D. — `/team/yudivian/`

**Eyebrow tagline (display, italicizable):**
*Computer scientist building Cuba's AI future — from research labs to public-health policy.*

**Bio (3 paragraphs):**

> Yudivián is one of Cuba's foremost AI researchers and educators. He founded and directs the Artificial Intelligence Research Group at the University of Havana's School of Mathematics and Computer Science, where he has been a professor since 2004. His work spans machine learning, knowledge discovery, computational epidemiology, and the modeling of Cuban Spanish.
>
> With doctorates in Mathematical Sciences (Havana) and Informatics (Alicante), and over two decades of research, he has co-authored more than sixty peer-reviewed papers, six books, and several national-award-winning works — including the country's COVID-19 modeling effort. He led the development of *Cecilia*, the first language model trained on Cuban Spanish corpora.
>
> Beyond research, Yudivián serves on Cuba's national advisory bodies on AI, big data, and public health, including the Innovation Committees of the Ministry of Public Health and the University of Havana, and the Advisory Council on Artificial Intelligence at the Ministry of Communication. In 2023 he received the *"For Cuban Education"* distinction from the Cuban Council of State.

**Key positions (sidebar, 5):**

| Role | Institution | Since |
|---|---|---|
| Director, Artificial Intelligence Research Group | MatCom UH | 2008 |
| President, University Scientific Council | University of Havana | 2026 |
| President, National Commission of Data Science Degree | Ministry of Higher Education | 2023 |
| Member, Innovation Committee | Ministry of Public Health | 2019 |
| Member, Advisory Council on Artificial Intelligence | Ministry of Communication | 2024 |

**Career highlights (timeline, 6):**

| Year | Role / Institution |
|---|---|
| 2026 – | President, University Scientific Council, University of Havana |
| 2024 – | Member, Advisory Council on Artificial Intelligence, Ministry of Communication |
| 2023 – | President, National Commission of Data Science Degree, Ministry of Higher Education |
| 2013 – 2017 | Vice Dean of Research and Postgraduate Studies, MatCom UH |
| 2008 – | Director, AI Research Group, MatCom UH |
| 2004 – | Professor, MatCom UH |

**Selected work (8):**

1. *Cecilia: The Cuban Language Model* — Hugging Face technical report, 2025
2. *Continual Pretraining of a Small Language Model on Cuban Spanish Corpora* — Springer · Int. Congress on AI and Pattern Recognition, 2025
3. *Bias mitigation for fair automation of classification tasks* — Expert Systems, 2025
4. *General-purpose hierarchical optimization of ML pipelines with grammatical evolution* — Information Sciences, vol. 543, 2021
5. *Automatic extension of corpora from intelligent ensembling of eHealth knowledge discovery systems outputs* — J. Biomedical Informatics, vol. 116, 2021
6. *La Habana: Atlas de la COVID-19* — Editorial UH, 2020 (book, co-author)
7. *Habilitando la Transformación Digital* — Editorial UH, 2022 (book chapter, co-author)
8. *Introducción a la Teoría de Conjuntos y a la Lógica* — Computer Science textbook (with Luciano García Garrido)

**Awards (5):**

| Year | Award |
|---|---|
| 2023 | "For Cuban Education" Distinction — Cuban Council of State |
| 2022 | Best Professor or Researcher — University of Havana |
| 2022 | National Award for Technological Innovation — CITMA (COVID-19 modeling, co-author) |
| 2021 | National Annual Award — Cuban Academy of Sciences (eHealth Knowledge Discovery) |
| 2020 | Special Award · Most Scientifically Relevant Work — CITMA (COVID-19 modeling) |

**Public engagement (1 paragraph):**

> Co-organizer of the eHealth Knowledge Discovery Challenge (IberLEF / TASS, 2018–2021). Regular panelist on AI ethics, sign-language technology, and public-sector AI in Cuba and Latin America — recent venues include the UNESCO Andean Peace Encounter, Tecnociencia, Cibersociedad, and SaberUH. Member of national tribunals for PhD degrees in Computer Science (since 2017) and Data Science (since 2023). Consultant for the COVID-19 response of the Cuban national health system.

**Connect:**

- Email: `yudy@matcom.uh.cu`
- Google Scholar: <https://scholar.google.com.cu/citations?user=e__oubEAAAAJ&hl=en>
- ORCID: <https://orcid.org/0000-0002-2345-1387>
- LinkedIn: <https://www.linkedin.com/in/yudivián-almeida-cruz-a534a8a4/>

### 2. Suilan Estévez Velarde, Ph.D. — `/team/suilan/`

**Eyebrow tagline:**
*Educator and architect of Cuba's AutoML stack — leading MatCom UH and bringing AI literacy to thousands.*

**Bio (3 paragraphs):**

> Suilan is Dean of the School of Mathematics and Computer Science at the University of Havana — Cuba's leading institution for computer science research and education — and Full Professor since March 2025. Her research has spanned automated machine learning, knowledge discovery from text, and language modeling, including foundational work on AutoGOAL (the AutoML framework powering several SYALIA products) and core contributions to *Cecilia*, the Cuban Spanish language model.
>
> With a PhD jointly awarded by the University of Havana and the University of Alicante, and over a decade of teaching at MatCom, she has co-authored more than thirty peer-reviewed papers across journals and major NLP venues including EMNLP, ACL, COLING, and Information Sciences. She co-led the eHealth Knowledge Discovery Challenge series at IberLEF (2018–2021) and contributed core architecture to the COVID-19 modeling work that won the country's national award for technological innovation.
>
> In 2024–2025 Suilan led one of Cuba's most ambitious AI-literacy efforts: 22 conferences (1,230+ participants), 7 hands-on workshops (265+ participants), and 19 TV and press interviews — culminating in the August 2025 National AI Tour across 5 provinces (30 events, 500+ participants). She holds the Cuban Society of Law and Informatics' honorary membership and serves on the Youth Council of the Cuban Academy of Sciences.

**Key positions (5):**

| Role | Institution | Since |
|---|---|---|
| Dean | School of Mathematics and Computer Science, University of Havana | May 2025 |
| Full Professor | University of Havana | March 2025 |
| Member, Youth Council | Academy of Sciences of Cuba | January 2025 |
| Member, National Board | Union of Informatics of Cuba | 2016 |
| Honorary Member | Cuban Society of Law and Informatics | July 2025 |

**Career highlights (6):**

| Year | Role / Institution |
|---|---|
| 2025 – | Dean, MatCom UH |
| 2025 – | Full Professor, University of Havana |
| 2022 – 2023 | Head, National Science Program for Telecommunications and Informatization of Society |
| 2022 – 2025 | Head of Department, MatCom UH |
| 2022 – 2025 | Associate Professor, University of Havana |
| 2015 – 2022 | Instructor, University of Havana |

**Selected work (8):**

1. *XAutoLM: Efficient Fine-Tuning of Language Models via Meta-Learning and AutoML* — EMNLP 2025
2. *Continual Pretraining of a Small Language Model on Cuban Spanish Corpora* — Springer · ICAIPR, 2025
3. *KD SENSO-MERGER: An architecture for semantic integration of heterogeneous data* — Engineering Applications of Artificial Intelligence, vol. 132, 2024
4. *General-purpose hierarchical optimization of ML pipelines with grammatical evolution* — Information Sciences, vol. 543, 2021
5. *AutoGOAL: Automatic Discovery of Heterogeneous Machine Learning Pipelines with Probabilistic Grammars* — COLING 2020
6. *AutoML strategy based on grammatical evolution* — ACL 2019
7. *Habilitando la Transformación Digital* — Editorial UH, 2022 (book, co-compiler)
8. *Aplicaciones de la inteligencia artificial ante la COVID-19 en Cuba* — Editorial UH, 2020 (book chapter, co-author)

**Awards (4):**

| Year | Award |
|---|---|
| 2022 | National Annual Award — Cuban Academy of Sciences |
| 2022 | National Award for Technological Innovation — CITMA |
| 2021 | Provincial Award for Technological Innovation — CITMA |
| 2020 | Special Award · Most Scientifically Relevant Work — CITMA |

**Public engagement (1 paragraph):**

> In 2024–2025 Suilan led one of Cuba's most ambitious AI literacy efforts: 22 lectures (1,230+ participants), 7 practical workshops (265+ participants), and 19 TV and press interviews. The August 2025 National Tour on Artificial Intelligence carried that work across 5 provinces in 30 events reaching 500+ participants. She speaks regularly at SaberUH, Cibersociedad, ICAI, and international NLP venues including ACL, EMNLP, and COLING.

**Connect:**

- Email: `sestevez@matcom.uh.cu`
- Google Scholar: <https://scholar.google.com/citations?user=kjTGK3gAAAAJ&hl=en>
- ORCID: <https://orcid.org/0000-0001-6707-1442>
- LinkedIn: <https://cu.linkedin.com/in/suilanestevez>

### 3. Alejandro Piad Morffis, Ph.D. — `/team/alejandro/`

**Eyebrow tagline:**
*Researcher turning ideas into production AI — co-creator of AutoGOAL and Cecilia, technical lead of the SYALIA suite.*

**Bio (3 paragraphs):**

> Alejandro is Profesor Titular (Full Professor) at the University of Havana's School of Mathematics and Computer Science, where he leads research at the intersection of natural language processing, knowledge discovery, and applied machine learning. He holds a PhD jointly awarded by the University of Havana and the University of Alicante, and has co-authored more than thirty peer-reviewed papers in venues including EMNLP, ACL, RANLP, and the Journal of Biomedical Informatics.
>
> Within SYALIA, Alejandro leads the technical direction of the product suite — the same research that earned national awards for COVID-19 modeling and eHealth knowledge discovery now powers production tools for clients across Cuba, Latin America, and Europe. He is co-creator of AutoGOAL (Cuba's flagship AutoML framework) and a core contributor to *Cecilia*, the Cuban Spanish language model.
>
> He served as Vice Dean of MatCom (2022–2025) and currently coordinates the Youth Council of the Cuban Academy of Sciences. He is Vice President of the Cuban Society of Mathematics and Computing, and was made Honorary Member of the Cuban Society of Law and Informatics in 2025. His teaching includes more than ten supervised undergraduate theses on knowledge graphs, multimedia generation with LLMs, and conversational agents.

**Key positions (5):**

| Role | Institution | Since |
|---|---|---|
| Profesor Titular | MatCom, University of Havana | September 2024 |
| Coordinator, Youth Council | Academy of Sciences of Cuba | January 2025 |
| Vice President | Cuban Society of Mathematics and Computing | September 2022 |
| Honorary Member | Cuban Society of Law and Informatics | July 2025 |
| Member | Union of Informatics of Cuba | 2016 |

**Career highlights (6):**

| Year | Role / Institution |
|---|---|
| 2024 – | Profesor Titular, MatCom UH |
| 2025 – | Coordinator, Youth Council, Academy of Sciences of Cuba |
| 2022 – | Vice President, Cuban Society of Mathematics and Computing |
| 2022 – 2025 | Vice Dean (Vicedecano), MatCom UH |
| 2015 – 2022 | Profesor (Instructor), MatCom UH |
| 2013 – 2015 | Adiestrado, MatCom UH |

**Selected work (8):**

1. *Applying Human-in-the-Loop to construct a dataset for determining content reliability to combat fake news* — Engineering Applications of AI, vol. 126, 2023
2. *Exploiting discourse structure of traditional digital media to enhance automatic fake news detection* — Expert Systems with Applications, vol. 169, 2021
3. *Automatic extension of corpora from intelligent ensembling of eHealth knowledge discovery systems outputs* — J. Biomedical Informatics, vol. 116, 2021
4. *A computational ecosystem to support eHealth Knowledge Discovery technologies in Spanish* — J. Biomedical Informatics, vol. 109, 2020
5. *Knowledge Discovery in COVID-19 Research Literature* — RANLP 2021
6. *A General-Purpose Annotation Model for Knowledge Discovery: Case Study in Spanish Clinical Text* — 2nd Clinical NLP Workshop, 2019
7. *Habilitando la Transformación Digital* — Editorial UH, 2022 (book chapter, "Retos sociales de la transformación digital")
8. *Aplicaciones de la inteligencia artificial ante la COVID-19 en Cuba* — Editorial UH, 2020 (book chapter)

**Awards (4):**

| Year | Award |
|---|---|
| 2022 | National Award for Technological Innovation — CITMA (COVID-19 modeling) |
| 2021 | National Annual Award — Cuban Academy of Sciences (eHealth Knowledge Discovery) |
| 2021 | Provincial Award for Technological Innovation — CITMA (COVID-19 modeling) |
| 2020 | Special Award · Most Scientifically Relevant Work — CITMA |

**Public engagement (1 paragraph):**

> Alejandro co-organized the eHealth Knowledge Discovery Challenge at IberLEF / TASS (2018–2021), a flagship Spanish-language NLP shared task. He has supervised more than ten undergraduate theses on knowledge graphs, structured-multimedia generation with LLMs, and AI-driven storytelling for video games. As Vice Dean of MatCom (2022–2025), he led curriculum reform around AI and data science, and now coordinates the Youth Council of the Cuban Academy of Sciences.

**Connect:**

- Email: `apiad@matcom.uh.cu` · `alepiad@gmail.com`
- Google Scholar: <https://scholar.google.com/citations?user=4P9BS6QAAAAJ&hl=en>
- ORCID: <https://orcid.org/0000-0001-9522-3239>
- LinkedIn: <https://www.linkedin.com/in/apiad/>

## File-level changes

| Path | Operation |
|---|---|
| `team/index.html` | Rewrite — replace heavy 3 cofounder blocks with the lean 3-up grid |
| `team/yudivian/index.html` | Create |
| `team/suilan/index.html` | Create |
| `team/alejandro/index.html` | Create |
| `assets/shared.css` | Append the three new helpers (`.cv-prose`, `.timeline-row`, `.work-row`) after the second CV page is wired |

`/team/index.html` keeps its existing nav, hero ("Three people. One curious obsession."), closing CTA, and footer. Only the three cofounder `<section>` blocks change.

## Acceptance criteria

1. `/team/` renders the lean 3-up grid; clicking any "Read full CV →" lands on the matching `/team/<slug>/`.
2. Each CV page renders correctly on Chrome / Firefox / Safari 18+, with the sticky sidebar pinned on `lg:` and stacked above the content on mobile.
3. EN/ES toggle on each CV page swaps every content piece (bio, headings, career rows, selected-work rows, awards rows, public-engagement paragraph) — Spanish content TBD; English drafts ship as ES placeholders until Alex provides translations.
4. All four pages link out to Scholar and ORCID for the corresponding cofounder; pills in the sidebar and the outro card both work.
5. With `prefers-reduced-motion: reduce`, no animations run.
6. Lighthouse on each CV page ≥ 90 Performance and Accessibility.

## Out of scope

- Exhaustive publication lists per cofounder (deferred to Scholar / ORCID).
- ResearchGate / GitHub / personal-site pills (only email / Scholar / ORCID / LinkedIn ship in v1; add others case-by-case if Alex provides them).
- Per-cofounder photography refresh — current `1.jpg`/`2.jpg`/`3.jpg` ship as-is. Flag for follow-up if Alex wants uniform portraits.
- Per-cofounder unique visual treatment (different accent color or layout) — the template is uniform; differentiation comes from content.
- Live publication-fetch from Scholar/ORCID — selected works are hand-curated, hand-updated.

## Open items requiring Alex's input

1. **ES translations** for taglines, bios, career-row labels (institution names), award labels, and public-engagement paragraphs — three cofounders × ~250 words each.
2. **Additional content per cofounder** if Alex wants — specifically: a pull-quote sentence per CV page that could anchor a more dramatic top-of-page treatment in v2.
3. **Photo refresh** — confirm whether `1.jpg / 2.jpg / 3.jpg` are the canonical portraits, or if uniform new headshots should be commissioned.
4. **Yudivián's email** — CV lists `yudy@matcom.uh.cu` and `yudivian@gmail.com`; confirm which should be the public one (current draft uses `yudy@matcom.uh.cu`).
5. **Bio fact check on Alejandro** — the draft says "Within SYALIA, leads technical direction of the product suite." Confirm or rewrite — Alex is the only one who knows the actual SYALIA org chart.
