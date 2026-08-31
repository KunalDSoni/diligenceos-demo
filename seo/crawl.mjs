#!/usr/bin/env node
/**
 * SEO crawl baseline generator.
 *
 * Produces one row per URL with the fixed column set defined in
 * docs/superpowers/specs/2026-08-31-measurable-seo-geo-design.md section 5.1.
 *
 * This crawler must be re-run UNCHANGED after every release. Changing its
 * parsing rules invalidates comparability with earlier captures; if it must
 * change, re-capture the baseline and note the restart in SEO_CHANGELOG.md.
 *
 * Usage:
 *   node seo/crawl.mjs                      # crawl live https://dosacc.com
 *   node seo/crawl.mjs --local              # crawl the working tree
 *   node seo/crawl.mjs --out path/file.csv  # write somewhere specific
 *
 * Zero dependencies, matching the repo's no-build-tools architecture.
 */

import { readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://dosacc.com';
const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const args = process.argv.slice(2);
const LOCAL = args.includes('--local');
const OUT = (() => {
  const i = args.indexOf('--out');
  return i !== -1 && args[i + 1] ? args[i + 1] : 'seo/SEO_CRAWL_BASELINE.csv';
})();
const DELAY_MS = 250;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── HTML field extraction ─────────────────────────────────────────────── */

// Strip script/style/noscript BEFORE tag removal so inline CSS and JS never
// count as prose. A naive `s/<[^>]*>//g` inflates word counts several-fold on
// this site, where every page carries its stylesheet inline.
function textOf(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return m ? m[1].trim() : '';
};

function metaContent(html, nameAttr, nameVal) {
  const re = new RegExp(`<meta[^>]*${nameAttr}\\s*=\\s*["']${nameVal}["'][^>]*>`, 'i');
  const m = html.match(re);
  return m ? attr(m[0], 'content') : '';
}

function schemaTypes(html) {
  const blocks = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const types = new Set();
  for (const b of blocks) {
    const body = b.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    // Regex rather than JSON.parse: malformed or templated JSON-LD should still
    // report the types it declares rather than silently yielding nothing.
    for (const m of body.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) types.add(m[1]);
  }
  return [...types].sort();
}

/* ── URL normalisation ─────────────────────────────────────────────────── */

function normalise(href, base) {
  let u;
  try { u = new URL(href, base); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  u.hash = '';
  return u;
}

const isInternal = (u) => u.host === new URL(ORIGIN).host;

/* ── Fetchers ──────────────────────────────────────────────────────────── */

async function fetchLive(url) {
  const t0 = performance.now();
  let res;
  try {
    res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'DiligenceOS-SEO-Baseline/1.0' } });
  } catch (err) {
    return { status: 0, ms: Math.round(performance.now() - t0), html: '', redirect: '', error: String(err.message || err) };
  }
  const ms = Math.round(performance.now() - t0);
  const redirect = res.headers.get('location') || '';
  const html = res.status >= 200 && res.status < 300 ? await res.text() : '';
  return { status: res.status, ms, html, redirect, error: '' };
}

// Mirror the .htaccess clean-URL rules so local crawls resolve the same URLs
// the live server serves: /events -> events.html, /foo/ -> foo/index.html.
async function fetchLocal(url) {
  const rel = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, '');
  const candidates = rel === ''
    ? ['index.html']
    : [rel, `${rel}.html`, path.join(rel, 'index.html'), `${rel.replace(/\/$/, '')}.html`];
  for (const c of candidates) {
    const p = path.join(ROOT, c);
    if (!existsSync(p)) continue;
    const s = await stat(p);
    if (!s.isFile()) continue;
    const t0 = performance.now();
    const html = await readFile(p, 'utf8');
    return { status: 200, ms: Math.round(performance.now() - t0), html, redirect: '', error: '' };
  }
  return { status: 404, ms: 0, html: '', redirect: '', error: 'not found on disk' };
}

/* ── Seeds ─────────────────────────────────────────────────────────────── */

async function seedUrls() {
  const seeds = new Set([`${ORIGIN}/`]);
  try {
    const xml = LOCAL
      ? await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8')
      : await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) seeds.add(m[1].trim());
  } catch (err) {
    console.warn(`! could not read sitemap: ${err.message}`);
  }
  return [...seeds];
}

/* ── Crawl ─────────────────────────────────────────────────────────────── */

async function crawl() {
  const queue = await seedUrls();
  const seen = new Set(queue);
  const rows = new Map();
  const inlinks = new Map(); // target URL -> Set(source URL)

  while (queue.length) {
    const url = queue.shift();
    const got = LOCAL ? await fetchLocal(url) : await fetchLive(url);
    if (!LOCAL) await sleep(DELAY_MS);

    const { status, ms, html, redirect, error } = got;
    if (error) console.warn(`! ${url} ${error}`);

    const row = {
      URL: url,
      Status: status,
      Indexable: '',
      Robots: '',
      Canonical: '',
      Google_Selected_Canonical: '', // filled from URL Inspection, see spec 5.6
      Title: '', Title_Length: 0,
      Meta_Description: '', Meta_Description_Length: 0,
      H1: '', H1_Count: 0,
      Word_Count: 0,
      Internal_Inlinks: 0, Internal_Outlinks: 0, Outbound_Links: 0,
      Images: 0, Images_Missing_Alt: 0,
      Schema_Types: '',
      Response_Time_ms: ms,
      Redirect_Target: redirect,
    };

    if (html) {
      const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      row.Title = titleM ? textOf(titleM[1]) : '';
      row.Title_Length = row.Title.length;

      row.Meta_Description = metaContent(html, 'name', 'description');
      row.Meta_Description_Length = row.Meta_Description.length;

      row.Robots = metaContent(html, 'name', 'robots');

      const canM = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*>/i);
      row.Canonical = canM ? attr(canM[0], 'href') : '';

      const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
      row.H1_Count = h1s.length;
      row.H1 = h1s.length ? textOf(h1s[0][1]) : '';

      row.Word_Count = textOf(html).split(/\s+/).filter(Boolean).length;

      const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
      row.Images = imgs.length;
      row.Images_Missing_Alt = imgs.filter((t) => !/\balt\s*=/i.test(t)).length;

      row.Schema_Types = schemaTypes(html).join('|');

      row.Indexable = /noindex/i.test(row.Robots) ? 'NO' : 'YES';

      for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
        const u = normalise(m[1], url);
        if (!u) continue;
        if (isInternal(u)) {
          row.Internal_Outlinks++;
          const t = u.toString();
          if (!inlinks.has(t)) inlinks.set(t, new Set());
          inlinks.get(t).add(url);
          if (!seen.has(t)) { seen.add(t); queue.push(t); }
        } else {
          row.Outbound_Links++;
        }
      }
    } else {
      row.Indexable = 'NO';
    }

    rows.set(url, row);
    console.log(`  ${String(status).padEnd(3)} ${url}`);
  }

  // Second pass: inlink counts are only knowable once the full graph is walked.
  for (const [url, row] of rows) {
    const set = inlinks.get(url);
    row.Internal_Inlinks = set ? [...set].filter((s) => s !== url).length : 0;
  }
  return [...rows.values()];
}

/* ── Output ────────────────────────────────────────────────────────────── */

const COLUMNS = [
  'URL', 'Status', 'Indexable', 'Robots', 'Canonical', 'Google_Selected_Canonical',
  'Title', 'Title_Length', 'Meta_Description', 'Meta_Description_Length',
  'H1', 'H1_Count', 'Word_Count', 'Internal_Inlinks', 'Internal_Outlinks',
  'Outbound_Links', 'Images', 'Images_Missing_Alt', 'Schema_Types',
  'Response_Time_ms', 'Redirect_Target',
];

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = await crawl();
rows.sort((a, b) => a.URL.localeCompare(b.URL));

const csv = [COLUMNS.join(','), ...rows.map((r) => COLUMNS.map((c) => csvCell(r[c])).join(','))].join('\n');
await writeFile(path.join(ROOT, OUT), `${csv}\n`, 'utf8');

const indexable = rows.filter((r) => r.Indexable === 'YES').length;
console.log(`\n${rows.length} URLs crawled (${LOCAL ? 'local' : 'live'}), ${indexable} indexable -> ${OUT}`);
