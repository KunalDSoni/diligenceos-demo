#!/usr/bin/env node
/**
 * Non-brand organic click split — the primary SEO KPI (spec section 2, Tier 2).
 *
 * Total organic clicks can rise entirely on brand searches from existing
 * awareness while acquisition from search is flat or falling. Non-brand clicks
 * is the number that cannot be inflated that way, so brand and non-brand are
 * always reported separately and never summed into one "organic traffic" figure.
 *
 * Input: a Search Console Performance > Queries CSV export.
 *   node seo/gsc-brand-split.mjs Queries.csv
 *   node seo/gsc-brand-split.mjs Queries.csv --date 2026-09-30 --append
 *
 * --append writes the Tier 2 rows into seo/METRICS_BASELINE.csv.
 */
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const APPEND = args.includes('--append');
const dateIdx = args.indexOf('--date');
const DATE = dateIdx !== -1 && args[dateIdx + 1] ? args[dateIdx + 1] : new Date().toISOString().slice(0, 10);

if (!file || !existsSync(file)) {
  console.error('usage: node seo/gsc-brand-split.mjs <GSC Queries.csv> [--date YYYY-MM-DD] [--append]');
  process.exit(2);
}

const terms = (await readFile('seo/BRAND_TERMS.txt', 'utf8'))
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.toLowerCase());

const parseLine = (l) => {
  const o = []; let c = '', q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) { if (ch === '"' && l[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else { if (ch === '"') q = true; else if (ch === ',') { o.push(c); c = ''; } else c += ch; }
  }
  o.push(c); return o;
};

// GSC exports carry a UTF-8 BOM and localise the header, so match by position
// after locating the clicks/impressions columns by name.
const raw = (await readFile(file, 'utf8')).replace(/^﻿/, '').trim();
const [header, ...lines] = raw.split('\n');
const cols = parseLine(header).map((c) => c.trim().toLowerCase());
const qi = cols.findIndex((c) => c.includes('quer'));
const ci = cols.findIndex((c) => c.includes('click'));
const ii = cols.findIndex((c) => c.includes('impress'));
if (qi === -1 || ci === -1) {
  console.error(`Could not find query and clicks columns. Header was: ${cols.join(' | ')}`);
  process.exit(2);
}

const num = (v) => Number(String(v).replace(/[,%\s]/g, '')) || 0;
const isBrand = (q) => terms.some((t) => q.includes(t));

let bC = 0, bI = 0, nC = 0, nI = 0;
const nonBrand = [];

for (const l of lines) {
  if (!l.trim()) continue;
  const r = parseLine(l);
  const q = (r[qi] || '').toLowerCase().trim();
  if (!q) continue;
  const clicks = num(r[ci]);
  const imps = ii === -1 ? 0 : num(r[ii]);
  if (isBrand(q)) { bC += clicks; bI += imps; }
  else { nC += clicks; nI += imps; nonBrand.push([q, clicks, imps]); }
}

const totC = bC + nC;
const share = totC ? (nC / totC) : 0;

console.log(`Search Console export: ${file}`);
console.log(`Date:                  ${DATE}`);
console.log(`Brand terms:           ${terms.join(', ')}\n`);
console.log(`  Brand clicks         ${String(bC).padStart(8)}   impressions ${String(bI).padStart(9)}`);
console.log(`  Non-brand clicks     ${String(nC).padStart(8)}   impressions ${String(nI).padStart(9)}   <- PRIMARY KPI`);
console.log(`  Total clicks         ${String(totC).padStart(8)}`);
console.log(`  Non-brand share      ${(share * 100).toFixed(1).padStart(7)}%`);

if (nonBrand.length) {
  console.log('\nTop non-brand queries by clicks:');
  for (const [q, c, i] of nonBrand.sort((a, b) => b[1] - a[1]).slice(0, 15)) {
    console.log(`  ${String(c).padStart(5)} clicks  ${String(i).padStart(7)} imp   ${q}`);
  }
}

if (APPEND) {
  const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const rows = [
    [DATE, '2', 'Non-brand organic clicks', nC, 'clicks', 'GSC Performance', 'PRIMARY SEO KPI'],
    [DATE, '2', 'Brand organic clicks', bC, 'clicks', 'GSC Performance', ''],
    [DATE, '2', 'Non-brand share of organic clicks', share.toFixed(4), 'ratio', 'GSC Performance', ''],
    [DATE, '3', 'Non-brand impressions', nI, 'impressions', 'GSC Performance', ''],
  ];
  await appendFile('seo/METRICS_BASELINE.csv', rows.map((r) => r.map(esc).join(',')).join('\n') + '\n');
  console.log(`\nAppended 4 rows to seo/METRICS_BASELINE.csv for ${DATE}`);
}
