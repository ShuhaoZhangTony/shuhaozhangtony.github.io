# A simple GitHub Pages template for an academic personal website

[![Screenshot of the Website](https://raw.githubusercontent.com/senli1073/senli1073.github.io/main/screenshot_full.png)](https://senli1073.github.io/)

This repository is an academic personal website based on Bootstrap. Markdown files remain the source content, but the published HTML is now generated at build time so the deployed site no longer depends on browser-side fetches of section markdown.

Demo: https://senli1073.github.io/

## Introduction

- Public website content lives in this repository.
- Private working materials live in a separate sibling repository.
- VS Code can open both repositories together with the included multi-root workspace.

## Working with a private repository

Keep the public site repository and the private materials repository as two separate sibling folders on disk.

Recommended local layout:

```text
projects/
├── <username>.github.io/
└── private-materials/
```

Why this layout is preferred:

1. The public repository never tracks private source files.
2. VS Code can open both repositories together through a multi-root workspace.
3. Public content can be copied or generated from the private repository in a controlled way.

Important boundary:

1. Raw files from the private repository should stay private.
2. Only content that is intentionally publishable should be copied into this public repository.
3. Do not reintroduce the private repository as a submodule under this repository.

This repository includes a workspace file for local development:

```text
shuhao-local.code-workspace
```

Open that workspace file in VS Code after cloning both repositories side by side. By default it expects these sibling repositories to live one level above the public site repository: `../private-materials`, `../graduate-paper-writing-course`, `../intro-to-llm-inference-engines`, `../parallel-distributed-state-management-survey`, `../cccf-domestic-inference-engine-survey`, and `../huawei-stw-memory-rag-talk`.

The workspace also enables VS Code terminal shell integration so command detection works more reliably.

## Getting started

### 1. Fork this repository

Clone the public repository:

```bash
git clone https://github.com/<username>/<username>.github.io.git
```

Clone your private repository next to it:

```bash
git clone https://github.com/<username>/private-materials.git
```

### 2. Customize the site

1. Edit the content of each section in `contents/*.md`.
2. Edit the title, copyright information, and other site text in `contents/config.yml`.
3. Replace the background image and photo in `static/assets/img`.
4. Run `npm install` once, then run `npm run build` to regenerate the published HTML files.

### 3. Publish

```bash
npm run build
git commit -am 'update site'
git push
```

Then open `https://<username>.github.io`.

## Build model

- `contents/` keeps Markdown source files and downloadable public assets such as PDFs.
- `static/` keeps CSS, JS, and images.
- `scripts/build-site.mjs` renders `index.html`, `intro-to-llm-inference-engines.html`, `graduate-paper-writing-course.html`, and `systems.html` as final HTML.
- The published pages no longer fetch Markdown at runtime.


## License

Copyright 2023, Sen Li and controlled via the MIT license, a permissive open-source license.
