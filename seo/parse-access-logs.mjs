#!/usr/bin/env node
/**
 * Apache access log -> AI crawl dataset (spec section 5.4).
 *
 * This is the ONLY instrument that can see AI crawlers. GPTBot and
 * OAI-SearchBot do not execute JavaScript, so they never appear in Plausible
 * or any other client-side analytics. If this script has no logs to read, AI
 * crawl measurement is not possible by any other route.
 *
 * Usage:
 *   node seo/parse-access-logs.mjs /path/to/access_log [more...]
 *   cat access_log | node seo/parse-access-logs.mjs -
 *
 * Appends one row per (week, user-agent) to seo/AI_CRAWL_LOG.csv.
 * Re-running for a week already present replaces that week's rows, so the
 * script is safe to re-run over overlapping log windows.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const OUT = path.join(ROOT, 'seo/AI_CRAWL_LOG.csv');

// Matched case-insensitively as substrings of the User-Agent string.
// Order matters: the first match wins, so more specific tokens precede the
// generic ones they contain (OAI-SearchBot before GPTBot's sibling names,
// Claude-SearchBot before ClaudeBot, Perplexity-User before PerplexityBot).
const AGENTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
  'Perplexity-User', 'PerplexityBot',
  'Bingbot', 'Googlebot', 'Applebot', 'Amazonbot',
  'Meta-ExternalAgent', 'Bytespider',
];

const COLUMNS = ['Week_Starting', 'User_Agent', 'Hits', 'Unique_URLs', 'Status_2xx', 'Status_3xx', 'Status_4xx', 'Status_5xx'];

// Apache combined log format.
const LINE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(?:\S+) (\S+) [^"]*" (\d{3}) (\S+) "[^"]*" "([^"]*)"/;

const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function parseDate(s) {
  // 31/Aug/2026:12:34:56 +0000
  const m = s.match(/^(\d{2})\/(\w{3})\/(\d{4}):/);
  if (!m) return null;
  const mon = MONTHS[m[2]];
  if (mon === undefined) return null;
  return new Date(Date.UTC(+m[3], mon, +m[1]));
}

// ISO week start (Monday), so weeks align with how GSC reports.
function weekStart(d) {
  const x = new Date(d);
  const dow = (x.getUTCDay() + 6) % 7;
  x.setUTCDate(x.getUTCDate() - dow);
  return x.toISOString().slice(0, 10);
}

function classify(ua) {
  for (const a of AGENTS) if (ua.toLowerCase().includes(a.toLowerCase())) return a;
  return null;
}

async function readInput(files) {
  if (files.length === 1 && files[0] === '-') {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    return Buffer.concat(chunks).toString('utf8');
  }
  const parts = [];
  for (const f of files) parts.push(await readFile(f, 'utf8'));
  return parts.join('\n');
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node seo/parse-access-logs.mjs <access_log...>  (or - for stdin)');
  process.exit(2);
}

const text = await readInput(files);

// key: "week\tagent"
const agg = new Map();
let total = 0, matched = 0, unparsed = 0;

for (const line of text.split('\n')) {
  if (!line.trim()) continue;
  total++;
  const m = line.match(LINE);
  if (!m) { unparsed++; continue; }
  const [, , dateStr, url, statusStr, , ua] = m;
  const agent = classify(ua);
  if (!agent) continue;
  const d = parseDate(dateStr);
  if (!d) { unparsed++; continue; }
  matched++;

  const key = `${weekStart(d)}\t${agent}`;
  if (!agg.has(key)) agg.set(key, { hits: 0, urls: new Set(), s2: 0, s3: 0, s4: 0, s5: 0 });
  const a = agg.get(key);
  a.hits++;
  a.urls.add(url);
  const s = Math.floor(+statusStr / 100);
  if (s === 2) a.s2++; else if (s === 3) a.s3++; else if (s === 4) a.s4++; else if (s === 5) a.s5++;
}

// Merge with existing rows, replacing any week we just recomputed so repeated
// runs over overlapping logs do not double-count.
const fresh = new Map();
for (const [key, a] of agg) {
  const [week, agent] = key.split('\t');
  fresh.set(key, [week, agent, a.hits, a.urls.size, a.s2, a.s3, a.s4, a.s5]);
}
const weeksTouched = new Set([...fresh.keys()].map((k) => k.split('\t')[0]));

const kept = [];
if (existsSync(OUT)) {
  const [, ...lines] = (await readFile(OUT, 'utf8')).trim().split('\n');
  for (const l of lines) {
    if (!l.trim()) continue;
    const cells = l.split(',');
    if (!weeksTouched.has(cells[0])) kept.push(cells);
  }
}

const rows = [...kept, ...fresh.values()]
  .sort((a, b) => String(a[0]).localeCompare(String(b[0])) || String(a[1]).localeCompare(String(b[1])));

await writeFile(OUT, `${[COLUMNS.join(','), ...rows.map((r) => r.join(','))].join('\n')}\n`, 'utf8');

console.log(`lines read: ${total}  AI/search-bot hits: ${matched}  unparsed: ${unparsed}`);
console.log(`weeks updated: ${[...weeksTouched].sort().join(', ') || 'none'}`);
console.log(`-> seo/AI_CRAWL_LOG.csv (${rows.length} rows)`);
if (!matched) console.log('\nNo bot hits found. If the log is non-empty this may mean the host strips User-Agent, or the log is not in Apache combined format.');
