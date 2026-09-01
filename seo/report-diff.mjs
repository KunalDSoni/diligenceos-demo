#!/usr/bin/env node
/**
 * Crawl regression report.
 *
 * Diffs two crawl datasets and classifies every change as a REGRESSION, an
 * IMPROVEMENT, or a neutral CHANGE. A raw `diff` on these CSVs is unreadable —
 * one added JSON-LD block rewrites the whole line.
 *
 *   node seo/report-diff.mjs                          # baseline vs current
 *   node seo/report-diff.mjs before.csv after.csv
 *
 * Exit 1 if any REGRESSION is found, so it can gate a release.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const [a = 'seo/baseline/SEO_CRAWL_BASELINE.csv', b = 'seo/SEO_CRAWL_BASELINE.csv'] = process.argv.slice(2);
for (const f of [a, b]) if (!existsSync(f)) { console.error(`missing: ${f}`); process.exit(2); }

const parseLine = (l) => {
  const o = []; let c = '', q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) { if (ch === '"' && l[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else { if (ch === '"') q = true; else if (ch === ',') { o.push(c); c = ''; } else c += ch; }
  }
  o.push(c); return o;
};

const load = async (f) => {
  const [h, ...ls] = (await readFile(f, 'utf8')).trim().split('\n');
  const cols = h.split(',');
  const m = new Map();
  for (const l of ls) {
    if (!l.trim()) continue;
    const r = Object.fromEntries(parseLine(l).map((v, i) => [cols[i], v]));
    m.set(r.URL, r);
  }
  return m;
};

const before = await load(a);
const after = await load(b);

const schemaSet = (r) => new Set((r.Schema_Types || '').split('|').filter(Boolean));
const REG = [], IMP = [], CHG = [];

for (const [url, y] of after) {
  const x = before.get(url);
  const u = url.replace('https://dosacc.com', '') || '/';
  if (!x) { IMP.push(`${u}  NEW URL (status ${y.Status})`); continue; }

  if (x.Status !== y.Status) {
    (y.Status === '200' ? IMP : REG).push(`${u}  status ${x.Status} -> ${y.Status}`);
  }
  if (x.Indexable !== y.Indexable) {
    (y.Indexable === 'YES' ? IMP : REG).push(`${u}  indexable ${x.Indexable} -> ${y.Indexable}`);
  }
  if (x.Canonical !== y.Canonical) {
    REG.push(`${u}  canonical changed: ${x.Canonical || '(none)'} -> ${y.Canonical || '(none)'}`);
  }
  if (+x.H1_Count !== +y.H1_Count && +y.H1_Count !== 1) {
    REG.push(`${u}  h1 count ${x.H1_Count} -> ${y.H1_Count} (expected 1)`);
  }
  if (+y.Images_Missing_Alt > +x.Images_Missing_Alt) {
    REG.push(`${u}  images missing alt ${x.Images_Missing_Alt} -> ${y.Images_Missing_Alt}`);
  }

  const sx = schemaSet(x), sy = schemaSet(y);
  const lost = [...sx].filter((t) => !sy.has(t));
  const gained = [...sy].filter((t) => !sx.has(t));
  if (lost.length) REG.push(`${u}  schema LOST: ${lost.join(', ')}`);
  if (gained.length) IMP.push(`${u}  schema gained: ${gained.join(', ')}`);

  const bi = +x.Internal_Inlinks, ai = +y.Internal_Inlinks;
  if (ai === 0 && bi > 0) REG.push(`${u}  became ORPHAN (inlinks ${bi} -> 0)`);
  else if (ai !== bi) (ai > bi ? IMP : CHG).push(`${u}  inlinks ${bi} -> ${ai}`);

  if (x.Title !== y.Title) CHG.push(`${u}  title (${x.Title_Length} -> ${y.Title_Length} chars)`);
  if (x.Meta_Description !== y.Meta_Description) CHG.push(`${u}  description (${x.Meta_Description_Length} -> ${y.Meta_Description_Length} chars)`);
  if (Math.abs(+x.Word_Count - +y.Word_Count) > 25) CHG.push(`${u}  words ${x.Word_Count} -> ${y.Word_Count}`);
}

for (const [url] of before) {
  if (!after.has(url)) REG.push(`${url.replace('https://dosacc.com', '') || '/'}  URL DISAPPEARED from crawl`);
}

const show = (label, list) => {
  if (!list.length) return;
  console.log(`\n${label} (${list.length})`);
  for (const l of [...list].sort()) console.log(`  ${l}`);
};

console.log(`before: ${a}\nafter:  ${b}`);
show('REGRESSIONS', REG);
show('IMPROVEMENTS', IMP);
show('CHANGES', CHG);
if (!REG.length && !IMP.length && !CHG.length) console.log('\nNo differences.');
console.log(`\n${REG.length} regression(s), ${IMP.length} improvement(s), ${CHG.length} neutral change(s)`);
process.exit(REG.length ? 1 : 0);
