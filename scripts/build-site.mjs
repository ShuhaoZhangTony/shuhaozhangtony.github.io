import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const homeSections = ['home', 'news', 'publications', 'resources'];

const standalonePages = [
  {
    outputFile: 'intro-to-llm-inference-engines.html',
    sourceMarkdown: 'contents/teaching/intro-to-llm-inference-engines.md',
    pageTitle: '大模型推理基础设施课程材料',
    title: '大模型推理基础设施课程材料',
    summary: '这里汇总 2026 年公开版课程 PDF，按讲义、tutorial 和实验三类整理。',
    meta: '共 34 份：讲义与导论 handout 15 份，tutorial 13 份，实验单与课程项目说明 6 份。',
    errorText: '课程材料加载失败。'
  },
  {
    outputFile: 'graduate-paper-writing-course.html',
    sourceMarkdown: 'contents/teaching/graduate-paper-writing-course.md',
    pageTitle: '研究生论文写作课程材料',
    title: '研究生论文写作课程材料',
    summary: '这里汇总 2026 年公开版课件 PDF。',
    meta: '当前公开 4 份课件，均为草稿版。',
    errorText: '课程材料加载失败。'
  },
  {
    outputFile: 'systems.html',
    sourceMarkdown: 'contents/systems.md',
    pageTitle: '系统建设与代表项目',
    title: '系统建设与代表项目',
    summary: '这里集中展示当前公开可见的系统工作，包括大模型推理服务、记忆智能体中间件，以及早期在多核与异构硬件上的代表性系统积累。',
    meta: '按“当前系统建设”和“代表性系统积累”两部分整理，便于从研究主题直接映射到系统原型、开源入口与论文。',
    errorText: '系统页面加载失败。'
  }
];

marked.use({
  gfm: true,
  breaks: false
});

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function readText(relativePath) {
  return fs.readFile(path.join(rootDir, relativePath), 'utf8');
}

function renderMarkdown(markdown) {
  return marked.parse(markdown);
}

function stripStandaloneIntro(html) {
  const withoutTitle = html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '');
  const firstSectionIndex = withoutTitle.search(/<h2\b/i);
  if (firstSectionIndex === -1) {
    return withoutTitle.trim();
  }
  return withoutTitle.slice(firstSectionIndex).trim();
}

function renderHomePage(config, sections) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>${escapeHtml(config.title ?? '')}</title>
    <link rel="icon" type="image/png" href="static/assets/img/photo.png" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,600;1,600&amp;display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,300;0,500;0,600;0,700;1,300;1,500;1,600;1,700&amp;display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,400;1,400&amp;display=swap" rel="stylesheet" />
    <link type="text/css" href="static/css/styles.css" rel="stylesheet" />
    <link type="text/css" href="static/css/main.css" rel="stylesheet" />
</head>

<body id="page-top">
    <nav class="header navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
        <div class="container px-5">
            <a class="navbar-brand fw-bold" href="#page-top">${config['page-top-title'] ?? ''}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                MENU
                <i class="bi-list"></i>
            </button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="navbar-nav ms-auto me-4 my-3 my-lg-0">
                    <li class="nav-item">
                        <a class="nav-link me-lg-3" href="#page-top">HOME</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link me-lg-3" href="#news">NEWS</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link me-lg-3" href="#publications">PUBLICATIONS</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link me-lg-3" href="#resources">MORE</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <section class="top-section" style="background-image: url('static/assets/img/background.jpeg');">
        <div class="top-section-content">
            <div class="container px-5">
                <div class="row">
                    <div class="col-lg-8">
                        <h2 class="text-white display-3 lh-1 mb-4 font-alt">${config['top-section-bg-text'] ?? ''}</h2>
                    </div>
                    <div class="col-lg-4">
                        <div class="user-photo photo"><img class="shadow" src="static/assets/img/me3.jpg"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="bg-gradient-primary-to-secondary-light mt5 md5" id="home">
        <div class="container px-5">
            <header>
                <h2>${config['home-subtitle'] ?? ''}</h2>
            </header>
            <div class="main-body">${sections.home}</div>
        </div>
    </section>

    <section class="bg-gradient-primary-to-secondary-gray mt5 md5" id="news">
        <div class="container px-5">
            <header>
                <h2><i class="bi bi-file-text-fill"></i>&nbsp;NEWS</h2>
            </header>
            <div class="main-body">${sections.news}</div>
        </div>
    </section>

    <section class="bg-gradient-primary-to-secondary-gray mt5 md5" id="publications">
        <div class="container px-5">
            <header>
                <h2><i class="bi bi-file-text-fill"></i>&nbsp;PUBLICATIONS</h2>
            </header>
            <div class="main-body">${sections.publications}</div>
        </div>
    </section>

    <section class="bg-gradient-primary-to-secondary-light mt5 md5" id="resources">
        <div class="container px-5">
            <header>
                <h2><i class="bi bi-bookmarks-fill"></i>&nbsp;MORE</h2>
            </header>
            <div class="main-body">${sections.resources}</div>
        </div>
    </section>

    <footer class="bg-bottom text-center py-5">
        <div class="container px-5">
            <div class="text-white-50 small">
                <div class="mb-2">${config['copyright-text'] ?? ''}</div>
                <a id="github-link" href="https://github.com/intellistream">Github</a>
                <span class="mx-1">&middot;</span>
            </div>
        </div>
    </footer>

    <script type="text/javascript" src="static/js/bootstrap.bundle.min.js"></script>
    <script>
        MathJax = {
            tex: { inlineMath: [['$', '$']] }
        };
    </script>
    <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            const mainNav = document.body.querySelector('#mainNav');
            if (mainNav) {
                new bootstrap.ScrollSpy(document.body, {
                    target: '#mainNav',
                    offset: 74,
                });
            }

            const navbarToggler = document.body.querySelector('.navbar-toggler');
            const responsiveNavItems = [].slice.call(document.querySelectorAll('#navbarResponsive .nav-link'));

            responsiveNavItems.forEach((responsiveNavItem) => {
                responsiveNavItem.addEventListener('click', () => {
                    if (window.getComputedStyle(navbarToggler).display !== 'none') {
                        navbarToggler.click();
                    }
                });
            });
        });
    </script>
</body>

</html>
`;
}

function renderStandalonePage(page) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.pageTitle)}</title>
    <link rel="icon" type="image/png" href="static/assets/img/photo.png" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
    <link type="text/css" href="static/css/styles.css" rel="stylesheet" />
    <link type="text/css" href="static/css/main.css" rel="stylesheet" />
    <style>
        body {
            margin: 0;
            background: #f7f8fb;
            color: #1f2937;
        }

        .page-wrap {
            max-width: 920px;
            margin: 0 auto;
            padding: 40px 20px 64px;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 18px;
            color: #5269ff;
            text-decoration: none;
            font-weight: 600;
        }

        .page-header,
        .page-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 10px 32px rgba(15, 23, 42, 0.06);
            border: 1px solid rgba(148, 163, 184, 0.16);
        }

        .page-header {
            margin-bottom: 18px;
        }

        .page-header h1 {
            margin: 0 0 10px;
            font-size: clamp(1.9rem, 3vw, 2.5rem);
            line-height: 1.2;
        }

        .page-header p {
            margin: 0;
            color: #475569;
            line-height: 1.8;
        }

        .meta-line {
            margin-top: 16px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 0.95rem;
        }

        .page-card h2,
        .page-card h3 {
            margin-top: 1.25rem;
        }

        .page-card h2 {
            margin-top: 2rem;
            padding-bottom: 0.35rem;
            border-bottom: 1px solid #e2e8f0;
        }

        .page-card ul {
            padding-left: 1.4rem;
        }

        .page-card li {
            margin-bottom: 0.45rem;
        }

        .page-card a {
            word-break: break-word;
        }

        .page-card code {
            background: #eff3ff;
            color: #3142b8;
            padding: 0.08rem 0.35rem;
            border-radius: 6px;
        }

        @media (max-width: 640px) {
            .page-wrap {
                padding: 28px 16px 48px;
            }

            .page-header,
            .page-card {
                padding: 22px;
            }
        }
    </style>
</head>

<body>
    <main class="page-wrap">
        <a class="back-link" href="./">
            <i class="bi bi-arrow-left"></i>
            返回主页
        </a>

        <section class="page-header">
            <h1>${page.title}</h1>
            <p>${page.summary}</p>
            <div class="meta-line">${page.meta}</div>
        </section>

        <article class="page-card">${page.contentHtml}</article>
    </main>

    <script>
        MathJax = {
            tex: { inlineMath: [['$', '$']] }
        };
    </script>
    <script type="text/javascript" id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
</body>
</html>
`;
}

async function build() {
  const config = yaml.load(await readText('contents/config.yml'));

  const sections = Object.fromEntries(
    await Promise.all(
      homeSections.map(async (sectionName) => {
        const markdown = await readText(`contents/${sectionName}.md`);
        return [sectionName, renderMarkdown(markdown)];
      })
    )
  );

  const indexHtml = renderHomePage(config, sections);
  await fs.writeFile(path.join(rootDir, 'index.html'), indexHtml, 'utf8');

  for (const page of standalonePages) {
    const markdown = await readText(page.sourceMarkdown);
    const contentHtml = stripStandaloneIntro(renderMarkdown(markdown));
    const html = renderStandalonePage({
      ...page,
      contentHtml
    });
    await fs.writeFile(path.join(rootDir, page.outputFile), html, 'utf8');
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});