#!/usr/bin/env node
/**
 * Program status — one screen answering "where are we, what is due, what is blocked".
 *
 *   npm run seo:status
 *
 * Reads only committed artifacts, so it never invents state.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const read = async (f) => (existsSync(f) ? await readFile(f, 'utf8') : '');
const parseLine = (l) => {
  const o = []; let c = '', q = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (q) { if (ch === '"' && l[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
    else { if (ch === '"') q = true; else if (ch === ',') { o.push(c); c = ''; } else c += ch; }
  }
  o.push(c); return o;
};
const rows = (t) => {
  if (!t.trim()) return [];
  const [h, ...ls] = t.trim().split('\n');
  const cols = h.split(',');
  return ls.filter(Boolean).map((l) => Object.fromEntries(parseLine(l).map((v, i) => [cols[i], v])));
};

const bar = (s) => `\n${s}\n${'-'.repeat(s.length)}`;

/* ── metrics ───────────────────────────────────────────────────────────── */
const metrics = rows(await read('seo/METRICS_BASELINE.csv'));
const dates = [...new Set(metrics.map((m) => m.Date))].sort();
const first = dates[0], last = dates[dates.length - 1];

console.log(bar('METRICS'));
if (!metrics.length) console.log('  no metrics recorded');
else {
  const byName = new Map();
  for (const m of metrics) {
    if (!byName.has(m.Metric)) byName.set(m.Metric, {});
    byName.get(m.Metric)[m.Date] = m.Value;
  }
  console.log(`  baseline ${first}${last !== first ? `  ->  latest ${last}` : ''}\n`);
  for (const [name, v] of byName) {
    const a = v[first], b = v[last] ?? a;
    const blocked = String(a) === 'BLOCKED' && String(b) === 'BLOCKED';
    const moved = a !== b;
    const mark = blocked ? 'BLOCKED' : moved ? `${a} -> ${b}` : String(b);
    console.log(`  ${name.padEnd(36)} ${mark}`);
  }
}

/* ── experiments ───────────────────────────────────────────────────────── */
const log = await read('seo/SEO_CHANGELOG.md');
const exps = [...log.matchAll(/^## (\S+) — (EXP-\d+|[A-Za-z0-9 ]+?) — (\w+)/gm)]
  .map((m) => ({ date: m[1], id: m[2].trim(), type: m[3] }));

// A checkpoint decision is outstanding while the placeholder is still present.
const blocks = log.split(/^## /m).slice(1);
let pending = 0, decided = 0;
const pendingList = [];
for (const b of blocks) {
  const head = b.split('\n')[0];
  const id = (head.match(/(EXP-\d+)/) || [])[1];
  if (!id) continue;
  const cp = (b.match(/Checkpoint:\s*(.+)/) || [])[1] || '';
  if (/<filled at checkpoint>/.test(b)) { pending++; pendingList.push([id, cp.trim()]); }
  else decided++;
}

console.log(bar('EXPERIMENTS'));
console.log(`  ${exps.length} logged entr(ies), ${decided} decided, ${pending} awaiting a checkpoint decision\n`);
for (const [id, cp] of pendingList) console.log(`  ${id.padEnd(10)} due: ${cp}`);

/* ── instruments ───────────────────────────────────────────────────────── */
const crawlRows = rows(await read('seo/SEO_CRAWL_BASELINE.csv'));
const ai = rows(await read('seo/AI_CRAWL_LOG.csv'));
const panel = rows(await read('seo/PROMPT_RESULTS.csv'));
const insp = rows(await read('seo/URL_INSPECTION.csv'));
const comp = rows(await read('seo/COMPETITOR_BENCHMARK.csv'));
const qmap = rows(await read('seo/SEO_QUERY_MAP.csv'));

const state = (n, ok, note) => `  ${n.padEnd(28)} ${ok ? 'READY  ' : 'NO DATA'}  ${note}`;
console.log(bar('INSTRUMENTS'));
// The crawl dataset reflects the LIVE site. Local page count is read from disk,
// so a gap between them means work is committed but not yet deployed.
const localPages = (await import('node:child_process')).execSync(
  'find . -name "*.html" -not -path "./_archive/*" -not -path "./.git/*" -not -path "*/opportunity/_src/*" | wc -l',
  { encoding: 'utf8' }).trim();
const undeployed = Number(localPages) - crawlRows.length;
console.log(state('Crawl dataset (live site)', crawlRows.length > 0,
  `${crawlRows.length} urls live` + (undeployed > 0 ? `  <- ${undeployed} page(s) built but NOT DEPLOYED` : '')));
console.log(state('Query map', qmap.length > 0, `${qmap.filter((r) => r.Status === 'OWNED').length} owned intents`));
console.log(state('AI crawl log', ai.length > 0, ai.length ? `${ai.length} rows` : 'needs Apache access logs (owner dep 2)'));
console.log(state('GEO prompt panel', panel.length > 0, panel.length ? `${panel.length} observations` : 'all 3 engines need sign-in (owner dep 8)'));
console.log(state('URL Inspection', insp.length > 0, insp.length ? `${insp.length} rows` : 'needs Search Console (owner dep 1)'));
console.log(state('Competitor benchmark', comp.length > 0, comp.length ? `${comp.length} rows` : 'set derived at end of P0'));

/* ── blocked ───────────────────────────────────────────────────────────── */
const owner = await read('seo/docs/OWNER_ACTIONS.md');
const allDeps = [...owner.matchAll(/^## (\d+)\.\s+(.+)$/gm)]
  .map((m) => ({ n: m[1], text: m[2], done: /RESOLVED|~~/.test(m[2]) }));
const open = allDeps.filter((d) => !d.done);

console.log(bar('BLOCKED ON OWNER'));
for (const d of allDeps) console.log(`  ${d.done ? 'x' : ' '} ${d.n}. ${d.text}`);
console.log(`\n  ${open.length} of ${allDeps.length} still open. See seo/docs/OWNER_ACTIONS.md`);

// Dep 1 gates the most instruments, and it is the one with a workaround: a
// URL-prefix property verified by HTML file needs only the FTP access the
// owner already has. Saying "nothing is buildable" hid that for weeks.
if (open.some((d) => d.n === '1')) {
  console.log('\n  Dep 1 does NOT require DNS. A URL-prefix property verified by');
  console.log('  HTML file upload works over FTP today, and starts the data clock');
  console.log('  immediately — GSC backfills nothing. See OWNER_ACTIONS.md sec. 1.');
}

/* ── deploy ────────────────────────────────────────────────────────────── */
console.log(bar('DEPLOY'));
console.log('  Pushing to main does NOT deploy — the Apache host updates separately.');
console.log('  Deploy in the waves set out in seo/docs/DEPLOYMENT.md so the');
console.log('  2-concurrent-experiment cap holds and results stay attributable.');
console.log('  After deploying:  npm run seo:diff\n');
