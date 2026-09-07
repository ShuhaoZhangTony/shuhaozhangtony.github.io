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
    summary: '围绕同一个推理内核连接系统研究、工程实现与应用验证。',
    meta: '科研与工程训练 · 招生 · 研究与产业合作'
  },
  {
    outputFile: 'publications.html',
    sourceMarkdown: 'contents/publications.md',
    pageTitle: '论文档案 · 张书豪',
    title: '论文与研究积累',
    summary: '从推理引擎到持续数据与智能体系统：代表成果、完整论文条目与作者版本下载。',
    meta: '保留论文原始题名、作者与发表信息；按系统职责浏览。'
  },
  {
    outputFile: 'intro-to-llm-inference-engines.html',
    sourceMarkdown: 'contents/teaching/intro-to-llm-inference-engines.md',
    pageTitle: '大模型推理系统与实践课程材料',
    title: '大模型推理系统与实践课程材料',
    summary: '这里发布 2027 年首次开课的统一课程 PPT，课程以完整推理链路和 vLLM-HUST 真实开源开发为主线。',
    meta: '正式课程共 8 讲，每讲 2 小时、48 页（共 384 页）；另提供中英文单文件两小时快速介绍版。',
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
    summary: '以面向国产算力的推理引擎为内核，向外扩展编排、持续数据、状态维护与评测能力。',
    meta: '推理内核 → 扩展组件 → 智能体应用；附代表论文与公开代码。',
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
  const sectionLabels = {
    research: ['01 / RESEARCH', '研究架构'],
    highlights: ['02 / SYSTEMS & RESULTS', '代表成果'],
    applications: ['03 / APPLICATIONS', '应用与验证'],
    team: ['04 / PEOPLE & COLLABORATION', '团队与合作'],
    news: ['05 / NEWS', '近期动态'],
    resources: ['06 / RESOURCES', '教学与资料']
  };
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(config.description)}">
  <meta name="author" content="Shuhao Zhang">
  <meta property="og:title" content="张书豪 · 持续数据与推理系统">
  <meta property="og:description" content="${escapeHtml(config.description)}">
  <meta property="og:type" content="website">
  <title>${escapeHtml(config.title)}</title>
  <link rel="icon" href="static/assets/img/photo.png">
  <link rel="stylesheet" href="static/css/home.css">
</head>
<body id="page-top">
  <a class="skip-link" href="#home">跳到正文</a>
  <header class="site-header">
    <nav class="shell nav-row" aria-label="主导航">
      <a class="brand" href="#page-top">张书豪 <span>Shuhao Zhang</span></a>
      <div class="nav-links">
        <a href="#research">研究</a><a href="systems.html">系统</a>
        <a href="#publications">成果</a><a href="#applications">应用</a>
        <a href="#team">团队与合作</a><a href="#resources">教学</a>
      </div>
    </nav>
  </header>
  <main>
    <section class="hero">
      <div class="shell hero-grid">
        <div>
          <p class="eyebrow">HUST · SYSTEMS RESEARCH</p>
          <h1>${config['top-section-bg-text']}</h1>
          <p class="hero-subtitle">面向智能体应用，构建持续数据与推理系统</p>
          <p class="hero-en">Inference at the core. Continuous data and state for agents.</p>
          <div class="hero-actions"><a class="button" href="#research">探索研究架构 ↓</a><a class="button button-outline" href="#team">招生与合作 ↗</a></div>
        </div>
        <figure class="portrait"><img src="static/assets/img/me3.jpg" alt="张书豪教授" width="280" height="340"><figcaption>张书豪 / Shuhao Zhang<br>华中科技大学 · 计算机科学与技术学院</figcaption></figure>
      </div>
    </section>
    <section class="shell bio" id="home" aria-labelledby="bio-heading"><h2 id="bio-heading">张书豪 <span>Professor, HUST</span></h2>${sections.home}</section>
    ${Object.entries(sectionLabels).map(([key, [eyebrow, label]]) => `
    <section class="content-section" id="${key === 'highlights' ? 'publications' : key}" aria-labelledby="${key}-heading">
      <div class="shell"><header class="section-heading"><p class="eyebrow">${eyebrow}</p><h2 id="${key}-heading">${label}</h2></header>
      <div class="section-body">${key === 'news' ? `<details><summary>查看动态与录用消息</summary>${sections[key]}</details>` : sections[key]}</div></div>
    </section>`).join('')}
  </main>
  <footer class="site-footer"><div class="shell"><p>张书豪 · 华中科技大学</p><a href="mailto:shuhao_zhang@hust.edu.cn">Email</a> · <a href="https://github.com/intellistream">GitHub</a> · <a href="publications.html">完整论文档案</a> · <a href="#page-top">返回顶部 ↑</a></div></footer>
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
  await fs.writeFile(path.join(rootDir, 'index.html'), indexHtml.replace(/^[ \t]+$/gm, ''), 'utf8');

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
