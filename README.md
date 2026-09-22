# Shuhao Zhang Homepage

This repository contains the public personal homepage for Shuhao Zhang.

Markdown files under `contents/` are the source of truth for public website text. The generated HTML files are committed so GitHub Pages can serve the site without runtime Markdown fetching.

## Current Public Facts

- Shuhao Zhang is a Professor in the School of Computer Science and Technology at Huazhong University of Science and Technology.
- He leads a task under a major national science and technology project of the Ministry of Science and Technology of China.
- He is a recipient of the National Natural Science Foundation of China Excellent Young Scientists Fund (Overseas).
- He was awarded support through the NSFC Research Fund for International Excellent Young Scientists (RFIS-II) in 2026.
- Research focuses on data-intensive systems in dynamic environments through three scientific storylines: dependency-driven task execution, maintenance and reuse of evolving information, and online service control under resource constraints.
- ECPA and StateAxis are cross-storyline research systems: ECPA unifies mechanisms and extension contracts; StateAxis unifies runtime state. They are not a fourth scientific storyline or generic support tools.
- Benchmarks, profiling, fault injection, guardrails, and platform backends are shared evidence infrastructure. Application programs validate generality but do not become research storylines unless they introduce a distinct systems mechanism.
- Current systems development focuses on inference engines for domestic accelerators. Preserve each paper's research contribution when describing its role in an integrated system.

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

The research narrative uses the same three-part structure as the group introduction and longer-term planning: published results demonstrate the storylines, while active systems extend and connect them. vLLM-HUST remains the current engineering focus, not a claim that all previous papers implement engine components. Public source links establish project scope; no unverified performance multipliers or deployment scale are asserted. GRACE concerns dynamic data maintenance, and external agent memory is distinguished from runtime KV state. ECPA and StateAxis must be described as active research systems rather than published results. Keep CV source and PDF synchronized when changing the biography.

Homepage brevity: keep one architecture explanation and one Sage Mate / Faculty Twin product entry. Detailed training content is maintained in `contents/team-details.md` and built to `team.html`.
