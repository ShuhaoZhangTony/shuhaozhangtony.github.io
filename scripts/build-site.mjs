import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const homeSections = ['home', 'research', 'highlights', 'applications', 'team', 'news', 'resources'];

const standalonePages = [
  {
    outputFile: 'team.html',
    sourceMarkdown: 'contents/team-details.md',
    pageTitle: '团队培养与合作 · 张书豪',
    title: '团队培养与合作',
    summary: '围绕并行执行与状态管理，连接系统研究、工程实现与应用验证。',
    meta: '科研与工程训练 · 招生 · 研究与产业合作'
  },
  {
    outputFile: 'publications.html',
    sourceMarkdown: 'contents/publications.md',
    pageTitle: '论文档案 · 张书豪',
    title: '论文与研究积累',
    summary: '并行与分布式系统中的执行、状态管理与在线适应：论文题录及作者版本下载。',
    meta: '保留原始题名、作者与发表信息；研究论文、综述和系统演示分别标注。'
  },
  {
    outputFile: 'intro-to-llm-inference-engines.html',
    sourceMarkdown: 'contents/teaching/intro-to-llm-inference-engines.md',
    pageTitle: '大模型推理系统与实践课程材料',
    title: '大模型推理系统与实践课程材料',
    summary: '课程材料统一维护在独立课程仓库中，个人主页只保留课程主页入口。',
    meta: '2027 年首次开课：课程介绍、8 讲 PPTX 与 14 讲 Beamer 三套材料。',
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
    summary: '三条科学路线，以及连接机制契约、状态原生执行与国产算力推理服务的系统架构。',
    meta: '代表机制、统一系统、论文与公开代码；已形成成果与在研系统分别说明。',
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

function renderHomePage(config, sections, locale) {
  const english = locale === 'en';
  const chinese = {
    skip: '跳到正文',
    navigation: '主导航',
    brand: '张书豪 <span>Shuhao Zhang</span>',
    nav: ['研究', '系统', '成果', '应用', '团队与合作', '教学'],
    headline: config['top-section-bg-text'],
    subtitle: '任务执行 · 信息维护 · 在线服务调控',
    researchAction: '了解研究方向 ↓',
    teamAction: '招生与合作 ↗',
    portraitAlt: '张书豪教授',
    affiliation: '华中科技大学 · 计算机科学与技术学院',
    sections: ['研究方向', '代表成果', '应用与验证', '团队与合作', '近期动态', '教学与资料'],
    newsSummary: '查看动态与录用消息',
    footer: '张书豪 · 华中科技大学',
    publicationArchive: '完整论文档案',
    backToTop: '返回顶部 ↑'
  };
  const copy = english ? config : chinese;
  const sectionKeys = ['research', 'highlights', 'applications', 'team', 'news', 'resources'];
  const eyebrows = ['01 / RESEARCH', '02 / SYSTEMS & RESULTS', '03 / APPLICATIONS',
    '04 / PEOPLE & COLLABORATION', '05 / NEWS', '06 / RESOURCES'];
  const navTargets = ['#research', 'systems.html', '#publications', '#applications', '#team', '#resources'];
  const alternate = english
    ? { href: 'index.html', lang: 'zh-CN', label: '中', title: '切换到中文' }
    : { href: 'en.html', lang: 'en', label: 'EN', title: 'Switch to English' };
  const chineseTitle = '张书豪 · 动态环境下的数据密集型系统';
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(config.description)}">
  <meta name="author" content="Shuhao Zhang">
  <meta property="og:title" content="${english ? escapeHtml(config.title) : chineseTitle}">
  <meta property="og:description" content="${escapeHtml(config.description)}">
  <meta property="og:type" content="website">
  <title>${escapeHtml(config.title)}</title>
  <link rel="alternate" hreflang="zh-CN" href="index.html">
  <link rel="alternate" hreflang="en" href="en.html">
  <link rel="icon" href="static/assets/img/photo.png">
  <link rel="stylesheet" href="static/css/home.css">
  <script src="static/js/home-language.js" defer></script>
</head>
<body id="page-top">
  <a class="skip-link" href="#home">${copy.skip}</a>
  <header class="site-header">
    <nav class="shell nav-row" aria-label="${copy.navigation}">
      <a class="brand" href="#page-top">${copy.brand}</a>
      <div class="nav-links">
        ${navTargets.map((target, index) => `<a href="${target}">${copy.nav[index]}</a>`).join('\n        ')}
      </div>
      <a class="language-switch" href="${alternate.href}" lang="${alternate.lang}" hreflang="${alternate.lang}" aria-label="${alternate.title}"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z"></path></svg><span aria-hidden="true">${alternate.label}</span></a>
    </nav>
  </header>
  <main>
    <section class="hero">
      <div class="shell hero-grid">
        <div>
          <p class="eyebrow">HUST · SYSTEMS RESEARCH</p>
          <h1>${copy.headline}</h1>
          <p class="hero-subtitle">${copy.subtitle}</p>
          ${english ? '' : '<p class="hero-en" lang="en">Data-intensive systems for changing tasks, evolving information, and resource-constrained services.</p>'}
          <div class="hero-actions"><a class="button" href="#research">${copy.researchAction}</a><a class="button button-outline" href="#team">${copy.teamAction}</a></div>
        </div>
        <figure class="portrait"><img src="static/assets/img/me3.jpg" alt="${copy.portraitAlt}" width="280" height="340"><figcaption>${english ? 'Shuhao Zhang' : '张书豪 / Shuhao Zhang'}<br>${copy.affiliation}</figcaption></figure>
      </div>
    </section>
    <section class="shell bio" id="home" aria-labelledby="bio-heading"><h2 id="bio-heading">${english ? 'Shuhao Zhang' : '张书豪'} <span>Professor, HUST</span></h2>${sections.home}</section>
    ${sectionKeys.map((key, index) => `
    <section class="content-section" id="${key === 'highlights' ? 'publications' : key}" aria-labelledby="${key}-heading">
      <div class="shell"><header class="section-heading"><p class="eyebrow">${eyebrows[index]}</p><h2 id="${key}-heading">${copy.sections[index]}</h2></header>
      <div class="section-body">${key === 'news' ? `<details><summary>${copy.newsSummary}</summary>${sections[key]}</details>` : sections[key]}</div></div>
    </section>`).join('')}
  </main>
  <footer class="site-footer"><div class="shell"><p>${copy.footer}</p><a href="mailto:shuhao_zhang@hust.edu.cn">Email</a> · <a href="https://github.com/intellistream">GitHub</a> · <a href="publications.html">${copy.publicationArchive}</a> · <a href="#page-top">${copy.backToTop}</a></div></footer>
</body>
</html>`;
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
  const homepages = [
    { locale: 'zh-CN', directory: 'contents', outputFile: 'index.html' },
    { locale: 'en', directory: 'contents/en', outputFile: 'en.html' }
  ];
  for (const { locale, directory, outputFile } of homepages) {
    const config = yaml.load(await readText(`${directory}/config.yml`));
    const sections = Object.fromEntries(await Promise.all(homeSections.map(async (section) => {
      const markdown = await readText(`${directory}/${section}.md`);
      return [section, renderMarkdown(markdown)];
    })));
    const html = renderHomePage(config, sections, locale);
    await fs.writeFile(path.join(rootDir, outputFile), html.replace(/^[ \t]+$/gm, ''), 'utf8');
  }

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
