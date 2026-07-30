# Shuhao Zhang Homepage

This repository contains the public personal homepage for Shuhao Zhang.

Markdown files under `contents/` are the source of truth for public website text. The generated HTML files are committed so GitHub Pages can serve the site without runtime Markdown fetching.

## Current Public Facts

- Shuhao Zhang is a Professor in the School of Computer Science and Technology at Huazhong University of Science and Technology.
- He leads a task under a major national science and technology project of the Ministry of Science and Technology of China.
- He is a recipient of the National Natural Science Foundation of China Excellent Young Scientists Fund (Overseas).
- Current research focuses on state-management-driven optimization for LLM inference systems, including state-aware scheduling, hardware-aware memory management, state reuse, serving stability, vLLM-HUST, SAGE, and Neuromem.

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

The intended homepage domain is `home.shuhao.sage.org.ai`.
