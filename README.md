# Shuhao Zhang Homepage

This repository contains the public personal homepage for Shuhao Zhang.

Markdown files under `contents/` are the source of truth for public website text. The generated HTML files are committed so GitHub Pages can serve the site without runtime Markdown fetching.

## Current Public Facts

- Shuhao Zhang is a Professor in the School of Computer Science and Technology at Huazhong University of Science and Technology.
- He leads a task under a major national science and technology project of the Ministry of Science and Technology of China.
- He is a recipient of the National Natural Science Foundation of China Excellent Young Scientists Fund (Overseas).
- He was awarded support through the NSFC Research Fund for International Excellent Young Scientists (RFIS-II) in 2026.
- Current research aims to build high-performance inference engines for domestic accelerators as the core of continuous data and inference systems for agent applications. SAGE, Neuromem, FlowRAG, StreamFP, GRACE, and CANDOR-Bench are presented by their extension roles, not as parallel research agendas.

Keep these facts synchronized across:

- `contents/home.md`
- `contents/current_bio.md`
- `contents/cv_en.tex`
- `contents/cv_en.pdf`
- `contents/awards.md`

## Build

Install dependencies once:

```bash
npm install
```

Regenerate public HTML:

```bash
npm run build
```

Regenerate the CV PDF:

```bash
cd contents
tectonic cv_en.tex
```

## Public/Private Boundary

Only intentionally publishable materials should be placed in this repository. Private drafts, unpublished source material, credentials, and internal working notes should remain outside this public site repository.

## Generated Pages

The build script renders:

- `index.html`
- `intro-to-llm-inference-engines.html`
- `graduate-paper-writing-course.html`
- `systems.html`
- `publications.html`
- `team.html`

The live GitHub Pages domain is `me.sage.org.ai` (see `CNAME`).

## Page structure and preview

Homepage sources: `home.md` (bio), `research.md` (architecture), `highlights.md` (representative results), `applications.md`, `team.md`, `news.md`, and `resources.md`, all under `contents/`. The full bibliography remains in `contents/publications.md` and builds to `publications.html`. Existing `#publications`, `#news`, and `#resources` homepage anchors remain available.

Run `npm run build` and `npm run check`. Preview from the repository root with `python -m http.server 8765 --bind 127.0.0.1`, then visit http://127.0.0.1:8765/. The homepage is self-contained and requires no CDN scripts or fonts.

The research narrative was checked against the current external introduction deck and the repository's paper texts. Public source links establish project scope; no unverified performance multipliers or deployment scale are asserted. GRACE belongs to dynamic data maintenance, and external agent memory is distinguished from runtime KV state. Keep CV source and PDF synchronized when changing the biography.

Homepage brevity: keep one architecture explanation and one Sage Mate / Faculty Twin product entry. Detailed training content is maintained in `contents/team-details.md` and built to `team.html`.
