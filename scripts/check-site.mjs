import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'team.html', 'systems.html', 'publications.html', 'intro-to-llm-inference-engines.html', 'graduate-paper-writing-course.html'];
const errors = [];
const cache = new Map();
async function html(file) {
  if (!cache.has(file)) cache.set(file, await fs.readFile(file, 'utf8'));
  return cache.get(file);
}
let links = 0;
for (const page of pages) {
  const file = path.join(root, page);
  const text = await html(file);
  const ids = [...text.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${page}: duplicate IDs`);
  if (!/<html lang="zh-CN">/.test(text)) errors.push(`${page}: missing document language`);
  for (const [, raw] of text.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|data:)/.test(raw)) continue;
    const [relative, fragment] = raw.split('#');
    let target = path.resolve(path.dirname(file), decodeURIComponent(relative.split('?')[0] || page));
    try {
      if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html');
      await fs.access(target);
      if (fragment && target.endsWith('.html')) {
        const targetIds = [...(await html(target)).matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
        if (!targetIds.includes(decodeURIComponent(fragment))) errors.push(`${page}: missing anchor ${raw}`);
      }
      links++;
    } catch { errors.push(`${page}: missing local resource ${raw}`); }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`Checked ${pages.length} pages and ${links} local links/resources; all passed.`);
