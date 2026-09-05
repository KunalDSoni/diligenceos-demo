#!/usr/bin/env node
/**
 * Pre-deploy SEO check.
 *
 * Runs against the working tree — no network, no deploy needed — and fails the
 * build on defects that would cost search visibility. Designed to be usable as a
 * git pre-commit hook (see seo/docs/PRECOMMIT.md).
 *
 *   node seo/check.mjs            # check everything
 *   node seo/check.mjs a.html b.html   # check only these files
 *
 * Exit 0 = clean or warnings only. Exit 1 = at least one error.
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const ERRORS = [];
const WARNS = [];
const err = (f, m) => ERRORS.push(`${f}: ${m}`);
const warn = (f, m) => WARNS.push(`${f}: ${m}`);

/* ── inputs ────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2).filter((a) => a.endsWith('.html'));
const allFiles = execSync(
  'find . -name "*.html" -not -path "./_archive/*" -not -path "./.git/*" -not -path "*/opportunity/_src/*" -not -path "./seo/*"',
  { encoding: 'utf8' }
).trim().split('\n').map((f) => f.replace(/^\.\//, '')).sort();

const files = argv.length ? argv.map((f) => f.replace(/^\.\//, '')) : allFiles;

const text = (h) => h
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const attrOf = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return m ? m[1].trim() : '';
};

// file path -> the canonical URL path it is served at, mirroring .htaccess
const servedPath = (f) => {
  if (f === 'index.html') return '/';
  if (f.endsWith('/index.html')) return `/${f.slice(0, -'index.html'.length)}`;
  return `/${f.replace(/\.html$/, '')}`;
};

/* ── sitemap ───────────────────────────────────────────────────────────── */

const sitemapUrls = new Set();
if (existsSync('sitemap.xml')) {
  const xml = await readFile('sitemap.xml', 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapUrls.add(m[1].trim().replace('https://dosacc.com', '') || '/');
  }
} else {
  err('sitemap.xml', 'missing');
}

/* ── per-file checks ───────────────────────────────────────────────────── */

const pages = new Map();

for (const f of files) {
  if (!existsSync(f)) { err(f, 'file not found'); continue; }
  const html = await readFile(f, 'utf8');
  const p = { f, url: servedPath(f) };

  for (const tag of ['</head>', '</body>']) {
    if (!html.includes(tag)) err(f, `malformed HTML: no ${tag}`);
  }

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  p.title = title ? text(title) : '';
  if (!p.title) err(f, 'missing <title>');

  const descTag = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*>/i);
  p.desc = descTag ? attrOf(descTag[0], 'content') : '';
  // Length and presence only matter where the page can appear in results, so
  // these are deferred until the robots directive is known (see below).

  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)];
  if (h1s.length === 0) err(f, 'no <h1>');
  else if (h1s.length > 1) err(f, `${h1s.length} <h1> elements (expected exactly 1)`);

  const robotsTag = html.match(/<meta[^>]*name\s*=\s*["']robots["'][^>]*>/i);
  p.robots = robotsTag ? attrOf(robotsTag[0], 'content') : '';
  p.noindex = /noindex/i.test(p.robots);

  const canTag = html.match(/<link[^>]*rel\s*=\s*["']canonical["'][^>]*>/i);
  p.canonical = canTag ? attrOf(canTag[0], 'href') : '';
  if (!p.canonical && !p.noindex) err(f, 'missing canonical');
  if (p.canonical && p.noindex) {
    const self = p.canonical.replace('https://dosacc.com', '') || '/';
    if (self.replace(/\/$/, '') !== p.url.replace(/\/$/, '')) {
      err(f, `noindex page canonicalises to a DIFFERENT url (${self}) — noindex can propagate to the canonical target`);
    } else {
      warn(f, 'has both a self-referencing canonical and noindex (harmless, but redundant)');
    }
  }

  // SERP-display checks apply only to pages that can appear in results.
  if (!p.noindex) {
    if (!p.desc) err(f, 'missing meta description');
    else if (p.desc.length > 160) warn(f, `meta description ${p.desc.length} chars (>160)`);
    if (p.title && p.title.length > 60) warn(f, `title ${p.title.length} chars (>60, truncates in SERP)`);
  }

  // JSON-LD must parse. Broken markup is worse than absent markup.
  for (const raw of html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []) {
    const body = raw.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
    try { JSON.parse(body); } catch (e) { err(f, `unparseable JSON-LD — ${e.message}`); }
  }

  // Render-blocking third-party stylesheets on the critical path.
  // Read the real rel attribute: a substring match also hits the async pattern's
  // onload="this.onload=null;this.rel='stylesheet'".
  let searchFrom = 0;
  for (const link of html.match(/<link\b[^>]*>/gi) || []) {
    const at = html.indexOf(link, searchFrom);
    searchFrom = at + 1;
    if (attrOf(link, 'rel').toLowerCase() !== 'stylesheet') continue;
    const href = attrOf(link, 'href');
    if (!/^https?:\/\//.test(href) || /fonts\.googleapis/.test(href)) continue;
    const before = html.slice(0, at);
    const inNoscript = (before.match(/<noscript\b/gi) || []).length >
                       (before.match(/<\/noscript>/gi) || []).length;
    if (!inNoscript) warn(f, `render-blocking third-party stylesheet: ${href.slice(0, 60)}`);
  }

  // Images must carry alt.
  const noAlt = (html.match(/<img\b[^>]*>/gi) || []).filter((t) => !/\balt\s*=/i.test(t));
  if (noAlt.length) err(f, `${noAlt.length} <img> without alt`);

  // Internal links must resolve to something on disk.
  p.links = new Set();
  for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const abs = href.startsWith('/')
      ? href.replace(/^\//, '')
      : path.posix.normalize(path.posix.join(path.posix.dirname(f), href));
    const clean = abs.split(/[?#]/)[0].replace(/\/$/, '');
    p.links.add('/' + clean);
    const cands = [clean, `${clean}.html`, path.posix.join(clean, 'index.html'), clean || 'index.html'];
    if (clean === '' || clean === 'contact') continue; // homepage and the /contact rewrite
    if (!cands.some((c) => existsSync(c))) err(f, `broken internal link: ${href}`);
  }

  // A UTM tag on an internal link is not a broken link but a broken report:
  // GA4 reads it as a fresh campaign and overwrites the source that actually
  // brought the visitor in, so the damage is invisible until the numbers are
  // already wrong. Tags belong only on inbound links authored off-site.
  // See seo/docs/UTM_CONVENTION.md.
  const OWN_HOST = /^(https?:)?\/\/(www\.)?dosacc\.com([/?#]|$)/i;
  const internal = (href) => {
    if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) return false;
    if (/^(https?:)?\/\//i.test(href)) return OWN_HOST.test(href);
    return true; // relative or root-relative
  };

  for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    if (/utm_/i.test(m[1]) && internal(m[1])) {
      err(f, `UTM tag on an internal link: ${m[1]}`);
    }
  }
  if (/utm_/i.test(p.canonical)) err(f, `UTM tag in canonical: ${p.canonical}`);

  const ogUrlTag = html.match(/<meta[^>]*property\s*=\s*["']og:url["'][^>]*>/i);
  const ogUrl = ogUrlTag ? attrOf(ogUrlTag[0], 'content') : '';
  if (/utm_/i.test(ogUrl)) err(f, `UTM tag in og:url: ${ogUrl}`);

  pages.set(f, p);
}

/* ── cross-file checks (whole-site runs only) ─────────────────────────── */

if (!argv.length) {
  const inlinks = new Map();
  for (const [, p] of pages) for (const l of p.links) inlinks.set(l, (inlinks.get(l) || 0) + 1);

  for (const [f, p] of pages) {
    if (p.noindex) continue;
    const inSitemap = sitemapUrls.has(p.url) || sitemapUrls.has(p.url.replace(/\/$/, ''));
    if (!inSitemap && !['/404', '/contact'].includes(p.url)) {
      warn(f, `indexable but not in sitemap.xml (${p.url})`);
    }
    const links = inlinks.get(p.url.replace(/\/$/, '')) || inlinks.get(p.url) || 0;
    if (links === 0 && p.url !== '/') warn(f, `orphan: no internal links point to ${p.url}`);
  }

  // Every sitemap URL must correspond to a real, indexable page.
  const served = new Set([...pages.values()].filter((p) => !p.noindex).map((p) => p.url));
  for (const u of sitemapUrls) {
    if (!served.has(u) && !served.has(`${u}/`)) err('sitemap.xml', `lists ${u} but no indexable page serves it`);
  }
}

/* ── report ────────────────────────────────────────────────────────────── */

for (const w of WARNS) console.log(`WARN   ${w}`);
for (const e of ERRORS) console.log(`ERROR  ${e}`);

console.log(`\n${files.length} file(s) checked — ${ERRORS.length} error(s), ${WARNS.length} warning(s)`);
process.exit(ERRORS.length ? 1 : 0);
