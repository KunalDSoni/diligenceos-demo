# UTM Campaign Tagging — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give dosacc.com a fixed UTM vocabulary, a builder that makes drifting from it impossible, and a pre-commit rule against tagging internal links.

**Architecture:** Three additions to the non-deployed `seo/` tooling directory, none of which touch a page the public can reach. A guard rail pass inside the existing `seo/check.mjs`; a self-contained `seo/utm-builder.html` opened from disk over `file://`; a `seo/docs/UTM_CONVENTION.md` rulebook. Spec: `docs/superpowers/specs/2026-09-05-utm-tagging-design.md`.

**Tech Stack:** Node 18+ ESM (no dependencies — `seo/` scripts import only `node:` builtins), and one vanilla-JS HTML file with no build step, no framework and no CDN.

## Global Constraints

- **Nothing in this plan is deployable.** `seo/` and `docs/` are both in the `EXCLUDE` list at `seo/deploy-manifest.mjs:33`. No file created here may be uploaded to the host.
- **No new dependencies.** `package.json` has none and must keep none.
- **`seo/utm-builder.html` must work offline over `file://`** — no CDN, no Google Fonts, no `fetch`. System font stack only. This is the one hard difference from every other HTML file in the repo.
- **Vocabulary is closed.** Mediums are exactly `social`, `paid-social`, `email`, `qr`, `referral`. Sources are exactly `linkedin`, `facebook`, `instagram`, `google-business`, `brochure`, `deck-investor`, `deck-sales`, `outreach`, `signature`, `newsletter`, plus the patterns `partner-<name>` and `event-<name>`.
- **All values lowercase, hyphens never underscores.** Including `paid-social`.
- **Parameter order is fixed:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`. `utm_term` and `utm_id` are never emitted.
- **Style:** match the surrounding files — ES modules, 2-space indent, `const`/arrow helpers in `seo/*.mjs`; IIFE, `var`, and `'use strict'` in browser JS, mirroring `assets/js/analytics.js`.
- **Every `localStorage` read and write is wrapped in `try/catch`** and the page must render correctly with no stored value, mirroring `assets/js/analytics.js:20-25`.

## File Structure

| File | Responsibility |
|---|---|
| `seo/check.mjs` (modify) | Add one guard-rail pass; exclude `seo/` from the file sweep. Nothing else changes. |
| `seo/utm-builder.html` (create) | The whole builder — markup, style, logic, history. One file, one job, no imports. |
| `seo/docs/UTM_CONVENTION.md` (create) | The rulebook a human reads. No code. |

There is no test framework in this repo and none is being added. The check harness *is* the test runner: `node seo/check.mjs <file>` accepts explicit file arguments and exits 1 on any error, which is exactly what a fixture-driven test needs. Fixtures live in a `mktemp -d` directory so they can never be committed.

---

### Task 1: Guard rail against UTMs on internal links

**Files:**
- Modify: `seo/check.mjs:32` (file sweep) and `seo/check.mjs:144-155` (insert a new pass after the existing internal-link loop)
- Test: throwaway fixtures under `$FIX` from `mktemp -d`

**Interfaces:**
- Consumes: the existing `err(f, msg)` helper (`seo/check.mjs:25`), `attrOf(tag, name)` (`seo/check.mjs:43`), and the per-file `html` string and `p` object inside the `for (const f of files)` loop.
- Produces: error strings matching `UTM tag on an internal link: <href>`, `UTM tag in canonical: <href>`, `UTM tag in og:url: <url>`. Task 2 relies on `seo/` being excluded from the sweep.

- [ ] **Step 1: Write the failing tests as fixtures**

```bash
FIX=$(mktemp -d) && echo "$FIX"

# Root-relative internal link with a UTM — must be caught.
cat > "$FIX/bad-root-relative.html" <<'HTML'
<!doctype html><html><head><title>Bad root relative</title>
<link rel="canonical" href="https://dosacc.com/bad"></head>
<body><h1>Bad</h1><a href="/us?utm_source=linkedin&utm_medium=social">US</a></body></html>
HTML

# Absolute internal link with a UTM — the case the existing loop skips at line 146.
cat > "$FIX/bad-absolute.html" <<'HTML'
<!doctype html><html><head><title>Bad absolute</title>
<link rel="canonical" href="https://dosacc.com/bad"></head>
<body><h1>Bad</h1><a href="https://dosacc.com/us?utm_source=linkedin&utm_medium=social">US</a></body></html>
HTML

# UTM in the canonical and in og:url — both are real defects.
cat > "$FIX/bad-canonical.html" <<'HTML'
<!doctype html><html><head><title>Bad canonical</title>
<link rel="canonical" href="https://dosacc.com/us?utm_source=x">
<meta property="og:url" content="https://dosacc.com/us?utm_campaign=y"></head>
<body><h1>Bad</h1></body></html>
HTML

# An OUTBOUND link carrying a UTM is legitimate — tagging a link on someone
# else's site is the entire point. This must NOT be flagged.
cat > "$FIX/good-outbound.html" <<'HTML'
<!doctype html><html><head><title>Good outbound</title>
<link rel="canonical" href="https://dosacc.com/good"></head>
<body><h1>Good</h1><a href="https://partner.example.com/x?utm_source=dosacc">Partner</a></body></html>
HTML
```

- [ ] **Step 2: Run them to verify they fail**

```bash
for f in bad-root-relative bad-absolute bad-canonical; do
  echo "== $f"; node seo/check.mjs "$FIX/$f.html" | grep -c "UTM tag"
done
```

Expected: `0` for all three — the rule does not exist yet, so nothing is caught. These fixtures do produce other errors (broken link, missing description); that is why the assertion greps for `UTM tag` rather than checking the exit code. Exit code alone would pass for the wrong reason.

- [ ] **Step 3: Exclude `seo/` from the file sweep**

Task 2 adds the first HTML file under `seo/`, which would otherwise enter this sweep and be audited as if it were a public page. `seo/` never deploys, so auditing it for search defects is meaningless. Replace line 32:

```js
  'find . -name "*.html" -not -path "./_archive/*" -not -path "./.git/*" -not -path "*/opportunity/_src/*" -not -path "./seo/*"',
```

- [ ] **Step 4: Write the guard-rail pass**

Insert immediately after the existing internal-link loop and before `pages.set(f, p);` (currently `seo/check.mjs:155-157`):

```js
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
```

`p.canonical` is already parsed at `seo/check.mjs:97-98` and defaults to `''`, so the test is safe without a guard. `og:url` is not parsed anywhere in this file today, so the pass parses it locally rather than adding a `p.ogUrl` that nothing else would read.

- [ ] **Step 5: Run the tests to verify they pass**

```bash
for f in bad-root-relative bad-absolute bad-canonical; do
  echo "== $f"; node seo/check.mjs "$FIX/$f.html" | grep "UTM tag"
done
```

Expected:
- `bad-root-relative` → `ERROR  …: UTM tag on an internal link: /us?utm_source=linkedin&utm_medium=social`
- `bad-absolute` → `ERROR  …: UTM tag on an internal link: https://dosacc.com/us?utm_source=linkedin&utm_medium=social`
- `bad-canonical` → two lines, one `UTM tag in canonical:`, one `UTM tag in og:url:`

- [ ] **Step 6: Verify no false positive on outbound links**

```bash
node seo/check.mjs "$FIX/good-outbound.html" | grep -c "UTM tag"
```

Expected: `0`. A UTM on an outbound link is correct usage and must never be flagged.

- [ ] **Step 7: Verify the real site still passes**

```bash
npm run seo:check
```

Expected: the same error and warning counts as before this task. No page in the repo contains `utm_` today, so the guard rail must add exactly zero findings. If the count moved, the rule is over-matching — fix it before committing.

- [ ] **Step 8: Clean up fixtures and commit**

```bash
rm -rf "$FIX"
git add seo/check.mjs
git commit -m "$(cat <<'MSG'
Fail the build on a UTM tag pointing at our own site

A campaign tag on an internal link is the one tagging mistake that destroys
data silently: GA4 treats the tagged click as a brand-new session from a
brand-new campaign, discarding the source that actually brought the visitor
in. Nothing looks broken until the acquisition report is already wrong.

The existing internal-link loop cannot host this check - it skips every
absolute href, so a link written as https://dosacc.com/us?utm_source=x would
pass straight through - so this is its own pass, covering anchors, the
canonical and og:url. Outbound links keep their tags, that being the point
of tagging.

Also excludes seo/ from the sweep: it never deploys, so auditing it for
search defects means nothing, and the builder page lands there next.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

### Task 2: The link builder

**Files:**
- Create: `seo/utm-builder.html`
- Test: the browser pane, opened on the `file://` path

**Interfaces:**
- Consumes: `seo/` excluded from the check sweep (Task 1, Step 3).
- Produces: URLs of the exact form `https://dosacc.com/<path>?utm_source=<s>&utm_medium=<m>&utm_campaign=<c>[&utm_content=<x>]`, which Task 3 documents.

**One refinement on the spec.** Spec §7.1 describes a *source* dropdown with medium auto-derived. Implement it as a **placement** dropdown instead: one list of real-world choices ("Meta ad — Instagram placement") each mapping to a `(source, medium)` pair. Same guarantee — neither field can be typed, so neither can drift — but the owner picks something they recognise rather than assembling two abstractions. It also solves a problem the spec's shape cannot: Meta ads must use source `facebook` or `instagram` (both on Google's recognised social-source list, which a coined value like `meta` is not) while carrying medium `paid-social`, so one source maps to two mediums and one medium to two sources. The medium select remains visible and overridable.

- [ ] **Step 1: State the acceptance assertions**

There is no headless test runner for a `file://` page, so the test cycle is: fix the expected strings first, then build until the page emits them exactly. Given destination `https://dosacc.com/hospitality-accounting/` and campaign typed as `Q4 Hospitality Push!`:

| Placement | Content | Expected URL |
|---|---|---|
| LinkedIn — organic post | *(empty)* | `https://dosacc.com/hospitality-accounting/?utm_source=linkedin&utm_medium=social&utm_campaign=q4-hospitality-push` |
| Meta ad — Instagram placement | `ad-a` | `https://dosacc.com/hospitality-accounting/?utm_source=instagram&utm_medium=paid-social&utm_campaign=q4-hospitality-push&utm_content=ad-a` |
| Brochure QR code | *(empty)* | `https://dosacc.com/hospitality-accounting/?utm_source=brochure&utm_medium=qr&utm_campaign=q4-hospitality-push` |
| Partner site, suffix `acme` | *(empty)* | `https://dosacc.com/hospitality-accounting/?utm_source=partner-acme&utm_medium=referral&utm_campaign=q4-hospitality-push` |

- [ ] **Step 2: Create `seo/utm-builder.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>UTM Link Builder — DiligenceOS</title>
<style>
  :root { --gold:#8a6a12; --line:#e6ebf1; --ink:#0a2540; --mute:#5b6b7c; --bg:#f6f9fc; }
  * { box-sizing:border-box; }
  body { margin:0; padding:32px 20px 64px; background:var(--bg); color:var(--ink);
         font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
  .wrap { max-width:760px; margin:0 auto; }
  h1 { font-size:1.5rem; margin:0 0 4px; }
  .sub { color:var(--mute); margin:0 0 28px; }
  .card { background:#fff; border:1px solid var(--line); border-radius:10px; padding:22px; margin-bottom:22px; }
  label { display:block; font-weight:600; font-size:.82rem; text-transform:uppercase;
          letter-spacing:.04em; color:var(--mute); margin:0 0 6px; }
  .field { margin-bottom:16px; }
  input, select { width:100%; font:inherit; padding:9px 11px; border:1px solid var(--line);
                  border-radius:6px; background:#fff; color:var(--ink); }
  input:focus, select:focus { outline:2px solid var(--gold); outline-offset:-1px; }
  .hint { font-size:.8rem; color:var(--mute); margin:5px 0 0; }
  .out { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.86rem;
         word-break:break-all; background:var(--bg); }
  .row { display:flex; gap:10px; align-items:center; margin-top:12px; flex-wrap:wrap; }
  button { font:inherit; font-weight:600; font-size:.88rem; cursor:pointer; padding:9px 18px;
           border-radius:6px; border:1px solid var(--gold); background:var(--gold); color:#fff; }
  button.ghost { background:#fff; color:var(--ink); border-color:var(--line); }
  button:hover { filter:brightness(.94); }
  .msg { font-size:.85rem; margin-top:10px; min-height:1.2em; }
  .msg.bad { color:#a3341a; }
  .msg.ok { color:#1a7a3c; }
  .msg.warn { color:#8a6a12; }
  table { width:100%; border-collapse:collapse; font-size:.84rem; }
  th, td { text-align:left; padding:7px 8px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { color:var(--mute); font-size:.76rem; text-transform:uppercase; letter-spacing:.04em; }
  td.url { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; word-break:break-all; }
  .empty { color:var(--mute); font-size:.86rem; margin:0; }
  [hidden] { display:none !important; }
</style>
</head>
<body>
<div class="wrap">

  <h1>UTM Link Builder</h1>
  <p class="sub">Builds tagged links for anything pointing <em>at</em> dosacc.com.
     Never tag a link that already sits on the site — see UTM_CONVENTION.md.</p>

  <div class="card">
    <div class="field">
      <label for="dest">Destination page</label>
      <input id="dest" list="pages" value="https://dosacc.com/" spellcheck="false">
      <datalist id="pages"></datalist>
      <p class="hint">Type any page. The list is a convenience, not a limit.</p>
    </div>

    <div class="field">
      <label for="placement">Where is the link going?</label>
      <select id="placement"></select>
    </div>

    <div class="field" id="suffixField" hidden>
      <label for="suffix">Name of the partner / event</label>
      <input id="suffix" spellcheck="false" placeholder="acme-accounting">
    </div>

    <div class="field">
      <label for="medium">Medium <span style="text-transform:none;font-weight:400">(set for you — change only with a reason)</span></label>
      <select id="medium"></select>
    </div>

    <div class="field">
      <label for="campaign">Campaign</label>
      <input id="campaign" list="campaigns" spellcheck="false" placeholder="2026-q4-hospitality">
      <datalist id="campaigns"></datalist>
      <p class="hint">Reuse the same name across every channel in the same push — that is what
         lets you compare them.</p>
    </div>

    <div class="field">
      <label for="content">Variant <span style="text-transform:none;font-weight:400">(optional)</span></label>
      <input id="content" spellcheck="false" placeholder="ad-a">
    </div>

    <div class="field">
      <label for="out">Your link</label>
      <input id="out" class="out" readonly>
    </div>

    <div class="row">
      <button type="button" id="copy">Copy link</button>
      <button type="button" class="ghost" id="open">Open it</button>
      <button type="button" class="ghost" id="save">Save to log</button>
    </div>
    <p class="msg" id="msg"></p>
  </div>

  <div class="card">
    <div class="row" style="margin:0 0 12px; justify-content:space-between">
      <strong>Link log</strong>
      <span>
        <button type="button" class="ghost" id="csv">Copy all as CSV</button>
        <button type="button" class="ghost" id="clear">Clear</button>
      </span>
    </div>
    <p class="empty" id="empty">Nothing saved yet. Saved links stay in this browser only.</p>
    <table id="logTable" hidden>
      <thead><tr><th>Built</th><th>Campaign</th><th>Source / medium</th><th>Link</th></tr></thead>
      <tbody id="log"></tbody>
    </table>
  </div>

</div>
<script>
(function () {
  'use strict';

  /* Placement -> the (source, medium) pair it means. Both values come from the
     closed vocabulary in UTM_CONVENTION.md; picking from a list is what keeps
     them closed. Meta ads deliberately use facebook/instagram as the source:
     GA4 only files a click under Paid Social when the source is one it already
     recognises as a social network, which a coined value like "meta" is not. */
  var PLACEMENTS = [
    { id:'linkedin-post',   label:'LinkedIn — organic post',           source:'linkedin',        medium:'social' },
    { id:'facebook-post',   label:'Facebook — organic post',           source:'facebook',        medium:'social' },
    { id:'instagram-post',  label:'Instagram — organic post',          source:'instagram',       medium:'social' },
    { id:'meta-ad-fb',      label:'Meta ad — Facebook placement',      source:'facebook',        medium:'paid-social' },
    { id:'meta-ad-ig',      label:'Meta ad — Instagram placement',     source:'instagram',       medium:'paid-social' },
    { id:'outreach',        label:'Sales outreach email',              source:'outreach',        medium:'email' },
    { id:'signature',       label:'Email signature',                   source:'signature',       medium:'email' },
    { id:'newsletter',      label:'Newsletter',                        source:'newsletter',      medium:'email' },
    { id:'brochure',        label:'Brochure QR code',                  source:'brochure',        medium:'qr' },
    { id:'deck-investor',   label:'Investor deck',                     source:'deck-investor',   medium:'qr' },
    { id:'deck-sales',      label:'Sales deck',                        source:'deck-sales',      medium:'qr' },
    { id:'google-business', label:'Google Business Profile listing',   source:'google-business', medium:'referral' },
    { id:'partner',         label:'Partner site — name it below',      source:'partner-',        medium:'referral', suffix:true },
    { id:'event',           label:'Event or listing — name it below',  source:'event-',          medium:'referral', suffix:true }
  ];

  var MEDIUMS = ['social', 'paid-social', 'email', 'qr', 'referral'];

  // From sitemap.xml on 2026-09-05. Convenience only - the field accepts anything.
  var PAGES = [
    '/', '/us/', '/au/', '/services/bookkeeping/', '/services/payroll/',
    '/services/advisory/', '/services/forecasting/', '/hospitality-accounting/',
    '/schedule/', '/guides/monthly-close-checklist', '/partners/', '/investors/',
    '/news/', '/education-support/', '/brochure/', '/leadership', '/events',
    '/privacy', '/terms', '/opportunity/', '/opportunity/us/', '/opportunity/au/',
    '/opportunity/au/business-landscape/', '/opportunity/au/part-1/',
    '/opportunity/au/part-2/', '/opportunity/au/part-3/', '/opportunity/au/part-4/',
    '/opportunity/au/part-5/'
  ];

  var KEY = 'dos-utm-history';
  var MAX = 100;
  var $ = function (id) { return document.getElementById(id); };

  /* ── storage (never allowed to break the page) ── */
  function history() {
    try {
      var raw = localStorage.getItem(KEY);
      var v = raw ? JSON.parse(raw) : [];
      return Object.prototype.toString.call(v) === '[object Array]' ? v : [];
    } catch (e) { return []; }
  }
  function saveHistory(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch (e) {}
  }

  function slug(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function placement() {
    var id = $('placement').value;
    for (var i = 0; i < PLACEMENTS.length; i++) {
      if (PLACEMENTS[i].id === id) return PLACEMENTS[i];
    }
    return PLACEMENTS[0];
  }

  function say(text, kind) {
    var el = $('msg');
    el.textContent = text || '';
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  /* ── the build ── */
  function build() {
    var p = placement();
    var dest = $('dest').value.trim();
    var campaign = slug($('campaign').value);
    var content = slug($('content').value);
    var source = p.suffix ? p.source + slug($('suffix').value) : p.source;
    var medium = $('medium').value;

    $('suffixField').hidden = !p.suffix;

    if (!dest) { $('out').value = ''; say('Give it a destination page.', 'bad'); return ''; }
    if (!campaign) { $('out').value = ''; say('Give it a campaign name.', 'bad'); return ''; }
    if (p.suffix && source === p.source) {
      $('out').value = ''; say('Name the partner or event.', 'bad'); return '';
    }

    var qs = 'utm_source=' + encodeURIComponent(source) +
             '&utm_medium=' + encodeURIComponent(medium) +
             '&utm_campaign=' + encodeURIComponent(campaign) +
             (content ? '&utm_content=' + encodeURIComponent(content) : '');

    var url = dest + (dest.indexOf('?') > -1 ? '&' : '?') + qs;
    $('out').value = url;

    if (/utm_/i.test(dest)) say('That destination already has UTM tags on it. Start from a clean page URL.', 'bad');
    else if (dest.indexOf('?') > -1) say('The destination already has a query string; the tags were appended to it.', 'warn');
    else if (!/^https:\/\/dosacc\.com\//.test(dest)) say('That is not a dosacc.com link — check the destination.', 'warn');
    else say('');

    return url;
  }

  /* ── clipboard (execCommand fallback: the async API is unavailable on file://
       in some browsers, and this page is opened from disk by design) ── */
  function copy(text, okMsg) {
    if (!text) return;
    var done = function () { say(okMsg, 'ok'); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { say('Could not copy automatically — select the link and copy it.', 'bad'); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
  }

  /* ── log ── */
  function renderLog() {
    var list = history();
    var body = $('log');
    body.textContent = '';

    $('logTable').hidden = !list.length;
    $('empty').hidden = !!list.length;

    var seen = {};
    var names = [];
    for (var i = 0; i < list.length; i++) {
      var row = list[i];
      var tr = document.createElement('tr');
      var cells = [row.built, row.campaign, row.source + ' / ' + row.medium];
      for (var c = 0; c < cells.length; c++) {
        var td = document.createElement('td');
        td.textContent = cells[c];
        tr.appendChild(td);
      }
      var last = document.createElement('td');
      last.className = 'url';
      last.textContent = row.url;
      tr.appendChild(last);
      body.appendChild(tr);

      if (row.campaign && !seen[row.campaign]) { seen[row.campaign] = 1; names.push(row.campaign); }
    }

    // Re-offering past campaign names is what stops one push acquiring three
    // spellings over three months.
    var dl = $('campaigns');
    dl.textContent = '';
    for (var n = 0; n < names.length; n++) {
      var o = document.createElement('option');
      o.value = names[n];
      dl.appendChild(o);
    }
  }

  function saveCurrent() {
    var url = build();
    if (!url) return;
    var p = placement();
    var list = history();
    for (var i = 0; i < list.length; i++) {
      if (list[i].url === url) { say('Already in the log.', 'warn'); return; }
    }
    list.unshift({
      built: new Date().toISOString().slice(0, 10),
      url: url,
      source: p.suffix ? p.source + slug($('suffix').value) : p.source,
      medium: $('medium').value,
      campaign: slug($('campaign').value),
      content: slug($('content').value)
    });
    saveHistory(list);
    renderLog();
    say('Saved to the log.', 'ok');
  }

  function csv() {
    var list = history();
    if (!list.length) { say('Nothing in the log yet.', 'warn'); return; }
    var q = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var out = ['built,campaign,source,medium,content,url'];
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      out.push([r.built, r.campaign, r.source, r.medium, r.content, r.url].map(q).join(','));
    }
    copy(out.join('\n'), list.length + ' row(s) copied as CSV.');
  }

  /* ── wiring ── */
  function init() {
    var sel = $('placement');
    for (var i = 0; i < PLACEMENTS.length; i++) {
      var o = document.createElement('option');
      o.value = PLACEMENTS[i].id;
      o.textContent = PLACEMENTS[i].label;
      sel.appendChild(o);
    }

    var med = $('medium');
    for (var m = 0; m < MEDIUMS.length; m++) {
      var mo = document.createElement('option');
      mo.value = MEDIUMS[m];
      mo.textContent = MEDIUMS[m];
      med.appendChild(mo);
    }

    var pages = $('pages');
    for (var g = 0; g < PAGES.length; g++) {
      var po = document.createElement('option');
      po.value = 'https://dosacc.com' + PAGES[g];
      pages.appendChild(po);
    }

    // Choosing a placement resets the medium to the one that placement means.
    sel.addEventListener('change', function () {
      med.value = placement().medium;
      build();
    });
    med.value = placement().medium;

    var live = ['dest', 'suffix', 'campaign', 'content'];
    for (var l = 0; l < live.length; l++) {
      $(live[l]).addEventListener('input', build);
    }

    // Slugify the campaign in place, so what is typed is what gets sent.
    $('campaign').addEventListener('blur', function () { this.value = slug(this.value); build(); });
    $('content').addEventListener('blur', function () { this.value = slug(this.value); build(); });

    $('copy').addEventListener('click', function () { copy(build(), 'Link copied.'); });
    $('save').addEventListener('click', saveCurrent);
    $('csv').addEventListener('click', csv);
    $('clear').addEventListener('click', function () {
      if (!window.confirm('Clear the whole log? This cannot be undone.')) return;
      saveHistory([]);
      renderLog();
      say('Log cleared.', 'ok');
    });
    $('open').addEventListener('click', function () {
      var url = build();
      if (url) window.open(url, '_blank', 'noopener');
    });

    renderLog();
    build();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
</script>
</body>
</html>
```

- [ ] **Step 3: Verify the four assertion rows**

Open the file in the browser pane at its `file://` path. For each row in Step 1, set the destination to `https://dosacc.com/hospitality-accounting/`, type `Q4 Hospitality Push!` into Campaign, tab out, select the placement, and read `#out`.

Expected: the four URLs from the Step 1 table, character for character. In particular `Q4 Hospitality Push!` must appear in the URL as `q4-hospitality-push` — trailing punctuation stripped, not encoded as `%21`.

- [ ] **Step 4: Verify the log and campaign memory survive a reload**

Save two links under different campaigns, reload the page, and confirm both rows are still listed and both campaign names appear in the Campaign field's autocomplete. Then check the console.

Run: `read_console_messages` with `onlyErrors: true`
Expected: no errors.

- [ ] **Step 5: Verify it is genuinely offline**

Run: `read_network_requests`
Expected: no requests to any external host. The page must load no font, script or stylesheet from the network.

- [ ] **Step 6: Verify the check harness is unaffected**

```bash
npm run seo:check
```

Expected: identical counts to Task 1, Step 7 — the new file lives under `seo/` and must not enter the sweep.

- [ ] **Step 7: Commit**

```bash
git add seo/utm-builder.html
git commit -m "$(cat <<'MSG'
Add an offline UTM link builder

Consistency is the whole value of campaign tagging: "LinkedIn" and "linkedin"
are two sources to GA4, and one push spelled two ways is two rows that never
add up. Dropdowns cannot be typo'd, so the vocabulary cannot drift.

Placements rather than raw sources: the list offers "Meta ad - Instagram
placement" instead of asking for a source and a medium separately. That is
also the only shape that works, since Meta ads need source facebook or
instagram - the values GA4 recognises as social networks - paired with medium
paid-social, so one source maps to two mediums and one medium to two sources.

The link log exists for its side effect. Re-offering campaign names already
used is what stops 2026-q4-hospitality becoming q4-hospitality-2026 three
months later.

No CDN, no fonts, no fetch: the page is opened from disk, so it carries a
clipboard fallback for browsers that withhold the async API on file://.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

### Task 3: The convention document

**Files:**
- Create: `seo/docs/UTM_CONVENTION.md`
- Modify: `seo/docs/OWNER_ACTIONS.md` (append one section)

**Interfaces:**
- Consumes: the placement list and URL shape from Task 2; the error strings from Task 1.
- Produces: nothing code-facing.

Write for the site owner, who is not an analyst. Every rule states the failure it prevents — a rule whose reason is unstated is a rule that gets broken the first time it is inconvenient.

- [ ] **Step 1: Write `seo/docs/UTM_CONVENTION.md`**

Required sections, in order:

1. **What this is** — three sentences. UTMs are tags added to links pointing *at* dosacc.com, authored wherever the link is published. GA4 reads them automatically; nothing on the site needs changing. Without them, email and print traffic is indistinguishable from someone typing the address in.
2. **Build links with the tool, not by hand** — open `seo/utm-builder.html` by double-clicking it. Note that it is not on the website and never will be.
3. **The vocabulary** — reproduce the two tables from spec §4.1 and §4.2 verbatim, plus the campaign and content rules from §4.3-4.4, and note that `utm_term` and `utm_id` are unused and why.
4. **The five rules** — from spec §5, each with its consequence spelled out:
   - lowercase and hyphens → or GA4 splits one campaign across rows that never reconcile
   - one campaign name per push across all channels → this is what makes channels comparable, and is the rule the tool's campaign memory exists to protect
   - never tag an internal link → GA4 restarts the session on a new campaign and erases the real source; `npm run seo:check` now fails the commit if you try, with `UTM tag on an internal link:`
   - tag the canonical destination, no `/index.html` and no `www` → avoids a redirect hop
   - source and medium always both present → a campaign with no medium lands in `(not set)`
5. **Worked examples** — one finished URL per channel: LinkedIn post, Meta ad, sales email, email signature, brochure QR, partner referral.
6. **How to read the results** — GA4 → Reports → Acquisition → Traffic acquisition, then switch the dimension dropdown to *Session campaign*. To compare pushes on outcomes rather than visits, add `book_meeting_click` as a secondary dimension or read it in the Events report.
7. **What this will not tell you** — spec §9, all three, in plain language:
   - the campaign does not reach the meeting invite, because the booking page embeds a Google Calendar appointment schedule that accepts no parameters; GA4 still credits the campaign for the click
   - QR and print traffic sits under *Unassigned* in GA4's Channels report and must be read in Traffic acquisition instead; the alternative was labelling print as `referral`, which files it neatly by asserting something untrue
   - visitors who decline the cookie banner are never counted, so these are comparative figures, not head counts — compare campaigns against each other, never quote them as totals

- [ ] **Step 2: Add the GA4 step to `seo/docs/OWNER_ACTIONS.md`**

Append a section titled `## UTM campaign tagging` stating that no GA4 configuration is required for capture, and listing the one-time owner action: confirm `book_meeting_click`, `form_submit` and `email_click` are marked as key events in GA4 (Admin → Events), without which campaigns can only be compared on visits rather than outcomes. Cross-reference `seo/docs/UTM_CONVENTION.md`.

- [ ] **Step 3: Verify the examples are real**

Every URL in the worked-examples section must be reproducible in the builder. Open `seo/utm-builder.html`, rebuild each one, and confirm it matches the document character for character. A document that disagrees with the tool is worse than no document.

- [ ] **Step 4: Verify the whole thing still passes**

```bash
npm run seo:check && node seo/deploy-manifest.mjs HEAD~3
```

Expected: the check count is unchanged, and the manifest lists **no** deployable files — all three tasks touched only `seo/`, which the manifest excludes. If any file appears under a deploy heading, it is in the wrong place.

- [ ] **Step 5: Commit**

```bash
git add seo/docs/UTM_CONVENTION.md seo/docs/OWNER_ACTIONS.md
git commit -m "$(cat <<'MSG'
Document the UTM convention, limits included

Written for the site owner rather than an analyst: every rule states the
failure it prevents, because a rule with an unstated reason gets broken the
first time it is inconvenient.

Records what tagging will not answer as plainly as what it will. Campaigns
stop at the booking iframe, print traffic sits in GA4's Unassigned bucket,
and declined-consent visits are never counted - so these are figures to
compare against each other, never to quote as totals.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| §2 verified preconditions | Evidence only; nothing to build |
| §3 channel scope | Task 2 `PLACEMENTS`, Task 3 §3 |
| §4.1-4.5 vocabulary | Task 2 `PLACEMENTS` / `MEDIUMS`, Task 3 §3 |
| §5 rules 1, 2, 4, 5 | Task 2 (slugify, campaign memory, page datalist, both params always emitted), Task 3 §4 |
| §5 rule 3 (no internal tags) | Task 1 |
| §6 convention doc | Task 3 |
| §7.1 fields | Task 2, Step 2 — with the placement refinement stated and justified |
| §7.2 output | Task 2 (`#out`, Copy, JS-assigned Open, fixed order, `encodeURIComponent`, empty-campaign block, query-string warning) |
| §7.3 history | Task 2 (`dos-utm-history`, cap 100, CSV, campaign datalist, try/catch) |
| §8 guard rail + `seo/` exclusion | Task 1, Steps 3-4 |
| §9.1-9.3 known limits | Task 3, Step 1 §7 |
| §10 testing | Task 1 Steps 1-2/5-7; Task 2 Steps 1/3-6; Task 3 Steps 3-4 |
| §11 success criteria | 1 → Task 2 dropdowns; 2 → Task 2 campaign memory; 3 → Task 1; 4 → Task 3 §6 |

No gaps.

**Placeholder scan:** none. Every code step carries the code; every test step carries the command and its expected output.

**Type consistency:** `slug()`, `build()`, `history()`, `saveHistory()`, `placement()`, `copy(text, okMsg)`, `say(text, kind)`, `renderLog()`, `saveCurrent()`, `csv()`, `init()` are each defined once and called under the same name. Element ids in the script (`dest`, `placement`, `suffix`, `suffixField`, `medium`, `campaign`, `content`, `out`, `msg`, `copy`, `open`, `save`, `csv`, `clear`, `log`, `logTable`, `empty`, `pages`, `campaigns`) all exist in the markup above it. History records are written and read with the same six keys throughout: `built`, `url`, `source`, `medium`, `campaign`, `content`.

**One deliberate spec deviation:** placements instead of a bare source dropdown (Task 2 preamble). It satisfies the spec's stated purpose and is required for Meta's source/medium pairing to be expressible at all.
