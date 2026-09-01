#!/usr/bin/env node
/**
 * Generate llms.txt from the crawl dataset.
 *
 * The hand-maintained file had drifted badly: it advertised /_archive/uk/ (which
 * robots.txt disallows) and /opportunity/_src/sections (a build source file, not
 * a page), while omitting every real /opportunity/ page. Generating it from the
 * crawl means it can only ever list URLs that are live and indexable.
 *
 *   node seo/crawl.mjs --local && node seo/gen-llms-txt.mjs
 *
 * Per the spec, llms.txt is classified optional/experimental: there is no
 * confirmed evidence major AI engines use it as a retrieval input, and no
 * checkpoint is defined for it. It is kept accurate because that costs nothing.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const SRC = process.argv[2] || 'seo/SEO_CRAWL_BASELINE.csv';

const parseLine = (l) => {
  const o = []; let c = '', q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) { if (ch === '"' && l[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else { if (ch === '"') q = true; else if (ch === ',') { o.push(c); c = ''; } else c += ch; }
  }
  o.push(c); return o;
};

const [h, ...ls] = (await readFile(SRC, 'utf8')).trim().split('\n');
const cols = h.split(',');
const rows = ls.filter(Boolean).map((l) => Object.fromEntries(parseLine(l).map((v, i) => [cols[i], v])));

// Only live, indexable, canonical pages. /contact duplicates / and is excluded.
const pages = rows.filter((r) =>
  r.Status === '200' && r.Indexable === 'YES' &&
  !r.URL.includes('/_archive/') && !r.URL.includes('/_src/') &&
  r.URL !== 'https://dosacc.com/contact');

const p = (r) => r.URL.replace('https://dosacc.com', '') || '/';

// Titles come from raw HTML, so entities survive the crawl. Decode here rather
// than in crawl.mjs, whose parsing must stay stable for baseline comparability.
const decode = (t) => (t || '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&middot;/g, '·');

const SECTIONS = [
  ['Core', (u) => u === '/'],
  ['Regions', (u) => ['/us/', '/au/'].includes(u)],
  ['Services', (u) => u.startsWith('/services/') || u === '/hospitality-accounting/'],
  ['Industry research', (u) => u.startsWith('/opportunity')],
  ['Guides', (u) => u.startsWith('/guides/')],
  ['Company', (u) => ['/leadership', '/events', '/partners/', '/investors/', '/education-support/', '/news/', '/brochure/', '/schedule/'].includes(u)],
  ['Legal', (u) => ['/privacy', '/terms'].includes(u)],
];

const used = new Set();
let out = `# DiligenceOS

> Outsourced bookkeeping, accounting, payroll, tax preparation, and CFO advisory
> for growing businesses and CPA firms across the United States and Australia.
`;

for (const [name, match] of SECTIONS) {
  const sel = pages.filter((r) => match(p(r))).sort((a, b) => p(a).localeCompare(p(b)));
  if (!sel.length) continue;
  out += `\n## ${name}\n\n`;
  for (const r of sel) {
    used.add(r.URL);
    const desc = (r.Meta_Description || '').trim();
    out += `- [${decode(r.Title)}](${r.URL})${desc ? `: ${decode(desc)}` : ''}\n`;
  }
}

const rest = pages.filter((r) => !used.has(r.URL));
if (rest.length) {
  out += `\n## Other\n\n`;
  for (const r of rest.sort((a, b) => p(a).localeCompare(p(b)))) {
    out += `- [${decode(r.Title)}](${r.URL})${r.Meta_Description ? `: ${decode(r.Meta_Description)}` : ''}\n`;
  }
}

await writeFile('llms.txt', out, 'utf8');
console.log(`llms.txt regenerated from ${SRC}: ${pages.length} pages`);
if (rest.length) console.log(`  ${rest.length} page(s) fell through to "Other" — consider a section rule`);
