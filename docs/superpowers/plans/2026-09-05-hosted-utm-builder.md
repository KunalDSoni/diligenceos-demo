# Hosted UTM Link Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a UTM link builder at `https://dosacc.com/tools/utm/` that an external marketing consultant can open and use correctly with no account and no briefing.

**Architecture:** One self-contained HTML page in the site's web root, plus a `robots.txt` rule. No build step, no dependencies, no backend. Replaces the local-only `seo/utm-builder.html`. Spec: `docs/superpowers/specs/2026-09-05-hosted-utm-builder-design.md`.

**Tech Stack:** Vanilla HTML/CSS/JS in a single file, matching the site's existing "self-contained page" pattern. Node only for the existing `seo/check.mjs` harness.

## Global Constraints

- **Fully self-contained.** The live CSP is `default-src 'self'` (`.htaccess:23`), so no CDN, no external fonts, no `fetch`. System font stack, all CSS and JS inline. `'unsafe-inline'` is permitted for script and style, so inline blocks are fine.
- **Exactly one `<h1>`** (`seo/check.mjs:103-105`). Sub-headings are `<h2>`.
- **`<meta name="robots" content="noindex, nofollow">` and NO `<link rel="canonical">`** — a canonical alongside noindex is flagged redundant (`seo/check.mjs:113-121`).
- **No `<img>`** — any image would need `alt` (`seo/check.mjs:154`).
- **No `utm_` inside any `<a href>`, canonical, or og:url** — the guard rail at `seo/check.mjs:183-186` fails the commit. Example URLs go in `<code>`, never in an href.
- **Vocabulary is closed.** Mediums exactly `social`, `paid-social`, `email`, `qr`, `referral`. Sources exactly `linkedin`, `facebook`, `instagram`, `google-business`, `brochure`, `deck-investor`, `deck-sales`, `outreach`, `signature`, `newsletter`, plus `partner-<name>` and `event-<name>`.
- **All values lowercase, hyphens never underscores** — including `paid-social`.
- **Parameter order fixed:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`. `utm_term` and `utm_id` are never emitted.
- **Every `localStorage` read and write wrapped in `try/catch`**, and a refused save must say so rather than report success.
- **Style:** IIFE, `var`, `'use strict'`, matching `assets/js/analytics.js`.

## File Structure

| File | Responsibility |
|---|---|
| `tools/utm/index.html` (create) | The entire tool — markup, style, logic, guidance. One file, no imports. |
| `robots.txt` (modify) | One `Disallow: /tools/` line. |
| `seo/utm-builder.html` (delete) | Retired; the hosted page replaces it. |
| `seo/docs/UTM_CONVENTION.md` (modify) | Point at the URL instead of the local file. |

---

### Task 1: The hosted builder page

**Files:**
- Create: `tools/utm/index.html`
- Modify: `robots.txt`

**Interfaces:**
- Produces: URLs of the form `https://dosacc.com/<path>?utm_source=<s>&utm_medium=<m>&utm_campaign=<c>[&utm_content=<x>]`, which Task 2 documents.

- [ ] **Step 1: State the acceptance assertions**

There is no headless runner for this page, so fix the expected strings first and build until they match exactly. Destination `https://dosacc.com/hospitality-accounting/`, campaign `2026-q4-hospitality`:

| Placement | Variant | Expected |
|---|---|---|
| LinkedIn — organic post | — | `https://dosacc.com/hospitality-accounting/?utm_source=linkedin&utm_medium=social&utm_campaign=2026-q4-hospitality` |
| Meta ad — Instagram placement | `ad-a` | `https://dosacc.com/hospitality-accounting/?utm_source=instagram&utm_medium=paid-social&utm_campaign=2026-q4-hospitality&utm_content=ad-a` |
| Brochure QR code | — | `https://dosacc.com/hospitality-accounting/?utm_source=brochure&utm_medium=qr&utm_campaign=2026-q4-hospitality` |
| Partner site, suffix `acme` | — | `https://dosacc.com/hospitality-accounting/?utm_source=partner-acme&utm_medium=referral&utm_campaign=2026-q4-hospitality` |
| Google Ads | — | no URL; refusal message shown |
| Google search (organic) | — | no URL; refusal message shown |

- [ ] **Step 2: Create `tools/utm/index.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>UTM Link Builder | DiligenceOS</title>
<style>
  :root { --gold:#8a6a12; --line:#e6ebf1; --ink:#0a2540; --mute:#5b6b7c; --bg:#f6f9fc; --bad:#a3341a; --ok:#1a7a3c; }
  * { box-sizing:border-box; }
  body { margin:0; padding:32px 20px 72px; background:var(--bg); color:var(--ink);
         font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
  .wrap { max-width:780px; margin:0 auto; }
  h1 { font-size:1.55rem; margin:0 0 6px; }
  h2 { font-size:1rem; margin:0 0 14px; }
  .lede { color:var(--mute); margin:0 0 26px; }
  .card { background:#fff; border:1px solid var(--line); border-radius:10px; padding:24px; margin-bottom:22px; }
  label { display:block; font-weight:600; font-size:.8rem; text-transform:uppercase;
          letter-spacing:.05em; color:var(--mute); margin:0 0 6px; }
  .field { margin-bottom:18px; }
  input, select, textarea { width:100%; font:inherit; padding:10px 12px; border:1px solid var(--line);
          border-radius:6px; background:#fff; color:var(--ink); }
  input:focus, select:focus, textarea:focus { outline:2px solid var(--gold); outline-offset:-1px; }
  textarea.out { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.86rem;
          background:var(--bg); resize:vertical; }
  .hint { font-size:.82rem; color:var(--mute); margin:6px 0 0; }
  .row { display:flex; gap:10px; align-items:center; margin-top:14px; flex-wrap:wrap; }
  button { font:inherit; font-weight:600; font-size:.88rem; cursor:pointer; padding:10px 18px;
           border-radius:6px; border:1px solid var(--gold); background:var(--gold); color:#fff; }
  button.ghost { background:#fff; color:var(--ink); border-color:var(--line); }
  button:hover { filter:brightness(.94); }
  .msg { font-size:.86rem; margin-top:12px; min-height:1.2em; }
  .msg.bad { color:var(--bad); }
  .msg.ok { color:var(--ok); }
  .msg.warn { color:var(--gold); }
  .refuse { border-left:3px solid var(--bad); background:#fdf6f4; padding:12px 14px; border-radius:0 6px 6px 0;
            font-size:.88rem; margin-top:14px; }
  table { width:100%; border-collapse:collapse; font-size:.84rem; }
  th, td { text-align:left; padding:8px; border-bottom:1px solid var(--line); vertical-align:top; }
  th { color:var(--mute); font-size:.75rem; text-transform:uppercase; letter-spacing:.05em; }
  td.url { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; word-break:break-all; }
  .empty { color:var(--mute); font-size:.86rem; margin:0; }
  code { background:var(--bg); border:1px solid var(--line); border-radius:4px; padding:1px 5px;
         font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.84rem;
         word-break:break-all; }
  ol { padding-left:1.2rem; }
  ol li { margin-bottom:6px; }
  [hidden] { display:none !important; }
</style>
</head>
<body>
<div class="wrap">

  <h1>UTM Link Builder</h1>
  <p class="lede">Builds tagged links for anything pointing <em>at</em> dosacc.com &mdash; social posts,
     ads, emails, printed QR codes. Tagging is what lets Google Analytics tell one campaign
     from another instead of filing it all under &ldquo;direct&rdquo;.</p>

  <div class="card">
    <div class="field">
      <label for="dest">1. Which page should they land on?</label>
      <input id="dest" list="pages" value="https://dosacc.com/" spellcheck="false">
      <datalist id="pages"></datalist>
      <p class="hint">Type any page on dosacc.com. The suggestions are a convenience, not a limit.</p>
    </div>

    <div class="field">
      <label for="placement">2. Where will this link be published?</label>
      <select id="placement"></select>
      <p class="hint">This sets the source and medium for you, so they cannot be misspelt.</p>
    </div>

    <div class="field" id="suffixField" hidden>
      <label for="suffix">Name of the partner or event</label>
      <input id="suffix" spellcheck="false" placeholder="acme-accounting">
    </div>

    <div class="field" id="mediumField">
      <label for="medium">3. Medium</label>
      <select id="medium"></select>
      <p class="hint">Set from your choice above. Change it only if you know why.</p>
    </div>

    <div class="field" id="campaignField">
      <label for="campaign">4. Which campaign is this part of?</label>
      <select id="campaign"></select>
      <p class="hint">Use the <strong>same campaign for every channel in the same push</strong> &mdash;
         that is what lets you compare them against each other in one report.</p>
    </div>

    <div class="field" id="newCampaignField" hidden>
      <label for="newCampaign">New campaign name</label>
      <input id="newCampaign" spellcheck="false" placeholder="2027-q1-payroll">
      <p class="hint">Lowercase and hyphens are applied automatically. Date it if the push is time-bound.</p>
    </div>

    <div class="field" id="contentField">
      <label for="content">5. Variant <span style="text-transform:none;font-weight:400">&mdash; optional</span></label>
      <input id="content" spellcheck="false" placeholder="ad-a">
      <p class="hint">Only if you are running two versions of the same campaign and need to tell them apart.</p>
    </div>

    <div class="field" id="outField">
      <label for="out">Your tagged link</label>
      <textarea id="out" class="out" rows="3" readonly></textarea>
    </div>

    <div class="row" id="actions">
      <button type="button" id="copy">Copy link</button>
      <button type="button" class="ghost" id="open">Open it</button>
      <button type="button" class="ghost" id="save">Save to my list</button>
    </div>
    <p class="msg" id="msg"></p>
    <div class="refuse" id="refusal" hidden></div>
  </div>

  <div class="card">
    <div class="row" style="margin:0 0 14px; justify-content:space-between">
      <h2 style="margin:0">My recent links</h2>
      <span>
        <button type="button" class="ghost" id="csv">Copy all as CSV</button>
        <button type="button" class="ghost" id="clear">Clear</button>
      </span>
    </div>
    <p class="empty" id="empty">Nothing saved yet. This list is stored in <strong>this browser only</strong>
       &mdash; it is your own scratchpad, not a shared record. The real record is Google Analytics.</p>
    <table id="logTable" hidden>
      <thead><tr><th>Saved</th><th>Campaign</th><th>Source / medium</th><th>Link</th></tr></thead>
      <tbody id="log"></tbody>
    </table>
  </div>

  <div class="card">
    <h2>Where the results show up</h2>
    <ol>
      <li>Paste the tagged link wherever you are publishing &mdash; the post, the ad, the email.</li>
      <li>Someone clicks it and lands on the page as normal. The tags are invisible to them.</li>
      <li>In Google Analytics: <strong>Reports &rarr; Acquisition &rarr; Traffic acquisition</strong>,
          then change the dropdown above the table to <strong>Session campaign</strong>.</li>
      <li>Allow 24&ndash;48 hours. Only the Realtime report is immediate.</li>
    </ol>
    <p class="hint">A finished link looks like this:<br>
       <code>https://dosacc.com/hospitality-accounting/?utm_source=linkedin&amp;utm_medium=social&amp;utm_campaign=2026-q4-hospitality</code></p>
    <p class="hint"><strong>Never put a tag on a link that already sits on dosacc.com.</strong>
       Analytics reads a tagged internal click as a brand-new visit from a brand-new campaign and
       discards whatever really brought that person in.</p>
  </div>

</div>
<script>
(function () {
  'use strict';

  /* Each placement maps to a (source, medium) pair from the published
     convention. Choosing from a list is what keeps the vocabulary closed:
     "LinkedIn" and "linkedin" are two different sources to GA4, and one push
     spelled two ways is two rows that never add up.

     Meta ads deliberately use facebook/instagram as the source. GA4 files a
     click under Paid Social only when it already recognises the source as a
     social network, which a coined value like "meta" is not. */
  var PLACEMENTS = [
    { id:'linkedin-post',   label:'LinkedIn — organic post',          source:'linkedin',        medium:'social' },
    { id:'facebook-post',   label:'Facebook — organic post',          source:'facebook',        medium:'social' },
    { id:'instagram-post',  label:'Instagram — organic post',         source:'instagram',       medium:'social' },
    { id:'meta-ad-fb',      label:'Meta ad — Facebook placement',     source:'facebook',        medium:'paid-social' },
    { id:'meta-ad-ig',      label:'Meta ad — Instagram placement',    source:'instagram',       medium:'paid-social' },
    { id:'outreach',        label:'Sales outreach email',                  source:'outreach',        medium:'email' },
    { id:'signature',       label:'Email signature',                       source:'signature',       medium:'email' },
    { id:'newsletter',      label:'Newsletter',                            source:'newsletter',      medium:'email' },
    { id:'brochure',        label:'Brochure QR code',                      source:'brochure',        medium:'qr' },
    { id:'deck-investor',   label:'Investor deck',                         source:'deck-investor',   medium:'qr' },
    { id:'deck-sales',      label:'Sales deck',                            source:'deck-sales',      medium:'qr' },
    { id:'google-business', label:'Google Business Profile listing',       source:'google-business', medium:'referral' },
    { id:'partner',         label:'Partner website — name it below',  source:'partner-',        medium:'referral', suffix:true },
    { id:'event',           label:'Event or directory — name it below', source:'event-',        medium:'referral', suffix:true },
    { id:'google-ads',      label:'Google Ads — do not tag these',
      refuse:'Google Ads tags every click by itself, with a gclid. A hand-written UTM overrides that and ' +
             'breaks cost and conversion reporting for the whole account. Leave the URL clean and link ' +
             'GA4 to Google Ads instead (GA4 Admin → Product links → Google Ads links), which ' +
             'attributes the clicks and brings the spend across with them.' },
    { id:'google-organic',  label:'Google search results — nothing to tag',
      refuse:'Organic search arrives already attributed in GA4, and you could not tag it anyway — ' +
             'Google shows the link, so nobody gets to add anything to it first. Nothing to do here.' }
  ];

  var MEDIUMS = ['social', 'paid-social', 'email', 'qr', 'referral'];

  /* Active campaigns. A fixed list PREVENTS drift where a remembered list only
     records it: everyone naming one push the same way is the entire point.
     Add a campaign here when a push starts, then re-upload this file. */
  var CAMPAIGNS = [
    '2026-q4-hospitality',
    'investor-round',
    'partner-launch'
  ];
  var OTHER = '__other__';

  // From sitemap.xml on 2026-09-05. Convenience only; the field accepts anything.
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

  function history() {
    try {
      var raw = localStorage.getItem(KEY);
      var v = raw ? JSON.parse(raw) : [];
      return Object.prototype.toString.call(v) === '[object Array]' ? v : [];
    } catch (e) { return []; }
  }
  // Returns false when the browser refuses to store. The caller must say so
  // rather than claim a save that did not happen.
  function saveHistory(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); return true; }
    catch (e) { return false; }
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

  function campaignValue() {
    return $('campaign').value === OTHER ? slug($('newCampaign').value) : $('campaign').value;
  }

  function say(text, kind) {
    var el = $('msg');
    el.textContent = text || '';
    el.className = 'msg' + (kind ? ' ' + kind : '');
  }

  function build() {
    var p = placement();

    $('suffixField').hidden = !p.suffix;
    $('newCampaignField').hidden = $('campaign').value !== OTHER;

    // A refused placement hides the whole builder rather than producing a
    // link nobody should use.
    var refused = !!p.refuse;
    $('refusal').hidden = !refused;
    if (refused) $('refusal').textContent = p.refuse;
    var hide = ['mediumField', 'campaignField', 'contentField', 'outField', 'actions'];
    for (var h = 0; h < hide.length; h++) $(hide[h]).hidden = refused;
    if (refused) { $('out').value = ''; say(''); return ''; }

    var dest = $('dest').value.trim();
    var campaign = campaignValue();
    var content = slug($('content').value);
    var source = p.suffix ? p.source + slug($('suffix').value) : p.source;
    var medium = $('medium').value;

    if (!dest) { $('out').value = ''; say('Choose the page they should land on.', 'bad'); return ''; }
    if (!campaign) { $('out').value = ''; say('Give this a campaign name.', 'bad'); return ''; }
    if (p.suffix && source === p.source) {
      $('out').value = ''; say('Name the partner or event.', 'bad'); return '';
    }

    var qs = 'utm_source=' + encodeURIComponent(source) +
             '&utm_medium=' + encodeURIComponent(medium) +
             '&utm_campaign=' + encodeURIComponent(campaign) +
             (content ? '&utm_content=' + encodeURIComponent(content) : '');

    var url = dest + (dest.indexOf('?') > -1 ? '&' : '?') + qs;
    $('out').value = url;

    if (/utm_/i.test(dest)) {
      say('That destination is already tagged. Start from a clean page address.', 'bad');
    } else if (!/^https?:\/\/dosacc\.com\//i.test(dest)) {
      say('That is not a dosacc.com address — check the destination.', 'warn');
    } else if (dest.indexOf('?') > -1) {
      say('The destination already had a query string; the tags were added after it.', 'warn');
    } else {
      say('');
    }
    return url;
  }

  // execCommand fallback: the async clipboard API is unavailable in some
  // contexts, and a builder whose copy button silently fails is useless.
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

  function renderLog() {
    var list = history();
    var body = $('log');
    body.textContent = '';
    $('logTable').hidden = !list.length;
    $('empty').hidden = !!list.length;

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
    }
  }

  function saveCurrent() {
    var url = build();
    if (!url) return;
    var p = placement();
    var list = history();
    for (var i = 0; i < list.length; i++) {
      if (list[i].url === url) { say('That one is already in your list.', 'warn'); return; }
    }
    list.unshift({
      built: new Date().toISOString().slice(0, 10),
      url: url,
      source: p.suffix ? p.source + slug($('suffix').value) : p.source,
      medium: $('medium').value,
      campaign: campaignValue(),
      content: slug($('content').value)
    });
    if (!saveHistory(list)) {
      say('This browser will not let the page store anything, so the list cannot be kept. ' +
          'The link above is still correct — copy it now.', 'bad');
      return;
    }
    renderLog();
    say('Saved to your list.', 'ok');
  }

  function csv() {
    var list = history();
    if (!list.length) { say('Nothing in your list yet.', 'warn'); return; }
    var q = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var out = ['saved,campaign,source,medium,content,url'];
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      out.push([r.built, r.campaign, r.source, r.medium, r.content, r.url].map(q).join(','));
    }
    copy(out.join('\n'), list.length + ' row(s) copied as CSV.');
  }

  function fill(sel, values, labels) {
    for (var i = 0; i < values.length; i++) {
      var o = document.createElement('option');
      o.value = values[i];
      o.textContent = labels ? labels[i] : values[i];
      sel.appendChild(o);
    }
  }

  function init() {
    // Binding twice would double every click and duplicate the option lists.
    if (window.__dosUtm) return;
    window.__dosUtm = true;

    var ids = [], labels = [];
    for (var i = 0; i < PLACEMENTS.length; i++) { ids.push(PLACEMENTS[i].id); labels.push(PLACEMENTS[i].label); }
    fill($('placement'), ids, labels);
    fill($('medium'), MEDIUMS);
    fill($('campaign'), CAMPAIGNS.concat([OTHER]), CAMPAIGNS.concat(['Something else…']));

    var pages = $('pages');
    for (var g = 0; g < PAGES.length; g++) {
      var po = document.createElement('option');
      po.value = 'https://dosacc.com' + PAGES[g];
      pages.appendChild(po);
    }

    $('placement').addEventListener('change', function () {
      var p = placement();
      if (p.medium) $('medium').value = p.medium;
      build();
    });
    $('medium').value = placement().medium;
    $('campaign').addEventListener('change', build);

    var live = ['dest', 'suffix', 'content', 'newCampaign'];
    for (var l = 0; l < live.length; l++) $(live[l]).addEventListener('input', build);

    $('newCampaign').addEventListener('blur', function () { this.value = slug(this.value); build(); });
    $('content').addEventListener('blur', function () { this.value = slug(this.value); build(); });

    $('copy').addEventListener('click', function () { copy(build(), 'Link copied.'); });
    $('save').addEventListener('click', saveCurrent);
    $('csv').addEventListener('click', csv);
    $('clear').addEventListener('click', function () {
      if (!window.confirm('Clear your saved list? This cannot be undone.')) return;
      saveHistory([]);
      renderLog();
      say('List cleared.', 'ok');
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

- [ ] **Step 3: Add the robots.txt rule**

Insert `Disallow: /tools/` after the existing `Disallow: /_archive/` line, so the file reads:

```
User-agent: *
Allow: /
Disallow: /_archive/
Disallow: /tools/

Sitemap: https://dosacc.com/sitemap.xml
```

- [ ] **Step 4: Verify the site's own checks still pass**

Run: `npm run seo:check`
Expected: `30 file(s) checked — 0 error(s), 0 warning(s)`. The count rises from 29 because `tools/utm/index.html` is a real page now. Any error means the page violates a site rule — fix the page, not the check.

- [ ] **Step 5: Verify the four building assertions**

Open the file in the browser pane at its `file://` path and set the fields per the Step 1 table. Assert `#out` equals each expected string character for character.

- [ ] **Step 6: Verify both refusals**

Select `Google Ads — do not tag these`, then `Google search results — nothing to tag`.
Expected for each: `#refusal` visible with its explanation, and `#outField`, `#actions`, `#mediumField`, `#campaignField`, `#contentField` all hidden. No URL is produced.

- [ ] **Step 7: Verify the new-campaign path and the warnings**

- Choose `Something else…`, type `Q4 Hospitality Push!`, tab out. Expected: field becomes `q4-hospitality-push` and the URL carries `utm_campaign=q4-hospitality-push`.
- Set the destination to a URL already containing `utm_source=x`. Expected: red message "That destination is already tagged."
- Set the destination to `https://example.com/`. Expected: amber message "That is not a dosacc.com address".

- [ ] **Step 8: Verify it is self-contained and clean**

Run: `read_console_messages` with `onlyErrors: true` → expected: no errors.
Run: `read_network_requests` → expected: no external requests. A single request to any CDN or font host is a failure: the live CSP is `default-src 'self'` and the page would break silently on the server.

- [ ] **Step 9: Commit**

```bash
git add tools/utm/index.html robots.txt
git commit -m "Publish the UTM builder where the marketing team can reach it"
```

---

### Task 2: Retire the local builder and repoint the documentation

**Files:**
- Delete: `seo/utm-builder.html`
- Modify: `seo/docs/UTM_CONVENTION.md`

**Interfaces:**
- Consumes: the URL `https://dosacc.com/tools/utm/` from Task 1.

- [ ] **Step 1: Delete the retired file**

```bash
git rm seo/utm-builder.html
```

Two builders drifting apart is the failure mode this convention exists to prevent, and the hosted page is strictly better: same vocabulary, two extra guards, and reachable by everyone including its owner.

- [ ] **Step 2: Repoint the convention document**

In `seo/docs/UTM_CONVENTION.md`, replace the section that tells the reader to open `seo/utm-builder.html` by double-clicking with:

```markdown
## Build links with the tool, not by hand

**https://dosacc.com/tools/utm/**

Open it in any browser, on any device. No login. Send that URL to anyone who
needs to tag a link — consultants and agencies included.

Pick the destination page, pick where the link is going, pick the campaign,
copy the result. Building links by hand is how the vocabulary below rots.

The page is `noindex` and excluded in `robots.txt`, so it will not appear in
search or compete with a real page.

**Adding a campaign:** the campaign dropdown is a fixed list in
`tools/utm/index.html` (the `CAMPAIGNS` array). Add a name there and re-upload
the file. Anyone can still type a new campaign in the tool when they need to,
so nobody is ever blocked waiting for that.
```

- [ ] **Step 3: Add the Google Ads rule to the convention**

Append to the rules section of `seo/docs/UTM_CONVENTION.md`:

```markdown
**6. Never hand-tag Google Ads.**
Google Ads tags every click itself with a `gclid`. A manual UTM overrides it and
breaks cost and conversion reporting for the whole account. Link GA4 to Google Ads
instead: GA4 Admin → Product links → Google Ads links. The builder refuses to
produce a Google Ads link for this reason, and says so.
```

- [ ] **Step 4: Verify nothing references the deleted file**

Run: `grep -rn "utm-builder.html" --include="*.md" --include="*.mjs" --include="*.html" . | grep -v "^./docs/superpowers/"`
Expected: no output. Design and plan documents under `docs/superpowers/` are historical records and correctly still name it.

- [ ] **Step 5: Verify the checks still pass**

Run: `npm run seo:check`
Expected: `30 file(s) checked — 0 error(s), 0 warning(s)`, unchanged from Task 1 — deleting a file under `seo/` cannot affect a sweep that excludes `seo/`.

- [ ] **Step 6: Confirm exactly what must be uploaded**

Run: `npm run seo:manifest`
Expected: `tools/utm/index.html` (added) and `robots.txt` (modified) listed as deployable; every `seo/` and `docs/` change listed under DO NOT UPLOAD.

- [ ] **Step 7: Commit**

```bash
git add -A seo/docs/UTM_CONVENTION.md
git commit -m "Retire the local builder; point the convention at the hosted one"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
|---|---|
| §2 location, deployability | Task 1 Step 2 (path), Task 2 Step 6 (manifest) |
| §2 kept out of search (noindex, robots.txt, no sitemap) | Task 1 Steps 2 and 3; no sitemap edit is made, which satisfies the third |
| §3 all seven site constraints | Task 1 Step 2 (page structure), Step 4 (check), Step 8 (self-contained) |
| §4 vocabulary and placements | Task 1 Step 2 `PLACEMENTS` / `MEDIUMS` |
| §5 curated campaigns + escape hatch | Task 1 Step 2 `CAMPAIGNS` / `OTHER`; Task 1 Step 7; Task 2 Step 2 documents adding one |
| §6 Google Ads and organic guards, already-tagged warning | Task 1 Steps 2, 6, 7 |
| §7 fields, output, guidance, recent links | Task 1 Step 2 |
| §8 retire the old file, repoint docs | Task 2 Steps 1, 2, 4 |
| §9 deployment | Task 2 Step 6 |
| §10 testing, all eleven rows | Task 1 Steps 4-8, Task 2 Steps 4-6. The two rows needing the live host (CSP-safe after upload, robots.txt served) can only be checked post-upload and are called out to the owner at handoff, not silently dropped. |
| §11 success criteria | 1 → Task 1 Step 2 guidance; 2 → dropdowns; 3 → Task 1 Step 6; 4 → Task 1 Step 3; 5 → the page has no third-party dependency at all |

No gaps.

**Placeholder scan:** none. Every code step carries its code; every test step carries the action and the expected result.

**Type consistency:** `history()`, `saveHistory(list)`, `slug(s)`, `placement()`, `campaignValue()`, `say(text, kind)`, `build()`, `copy(text, okMsg)`, `renderLog()`, `saveCurrent()`, `csv()`, `fill(sel, values, labels)`, `init()` are each defined once and called under the same name. Every element id used in the script — `dest`, `pages`, `placement`, `suffix`, `suffixField`, `medium`, `mediumField`, `campaign`, `campaignField`, `newCampaign`, `newCampaignField`, `content`, `contentField`, `out`, `outField`, `actions`, `msg`, `refusal`, `copy`, `open`, `save`, `csv`, `clear`, `log`, `logTable`, `empty` — exists in the markup above it. History records are written and read with the same six keys: `built`, `url`, `source`, `medium`, `campaign`, `content`.

**One risk flagged:** the refusal branch hides `mediumField` and `campaignField`. `build()` reads `$('medium').value` and `$('campaign').value` before that branch only via `placement()`, which does not touch them, so no read happens on a hidden field. Verified by Task 1 Step 6 asserting no URL is produced.
