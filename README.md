# A simple GitHub Pages template for an academic personal website

[![Screenshot of the Website](https://raw.githubusercontent.com/senli1073/senli1073.github.io/main/screenshot_full.png)](https://senli1073.github.io/)

This template is an academic personal website based on Bootstrap. It uses Markdown files as source content, and the page renders them in the browser at load time, so there is no build step required for basic publishing.

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

Open that workspace file in VS Code after cloning both repositories side by side. By default it expects the private repository to live at `../private-materials`.

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

### 3. Publish

```bash
git commit -am 'init'
git push
```

Then open `https://<username>.github.io`.

## License

Copyright 2023, Sen Li and controlled via the MIT license, a permissive open-source license.
