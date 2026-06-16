/* Build the INTERNATIONAL /opportunity briefing. Single source of truth.
   Run: `npm run build:opp`  (node opportunity/_src/build.mjs)

   Structure
     /opportunity/                 global hub + market selector
     /opportunity/<cc>/            per-market executive deck (au, us, uk, ca, nz)
     /opportunity/au/part-1..5/    Australia's full five-part deep dive (flagship)

   Shared CSS/JS live in opportunity/assets/ and are cached across every page.
   Icons are inline SVG (no FontAwesome). Add a market in regions.mjs -> rebuild. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { labels, PARTSECS, META, DECK } from './content.mjs';
import { REGIONS, byCode } from './regions.mjs';
import { replaceIcons } from './icons.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const OPPDIR = path.dirname(SRC);
const OPP = 'https://dosacc.com/opportunity/';
const faqSchema = JSON.parse(fs.readFileSync(path.join(SRC, 'faq-schema.json'), 'utf8'));

/* ---- AU deep-dive section bodies ---- */
const sectionsHtml = fs.readFileSync(path.join(SRC, 'sections.html'), 'utf8');
const markers = ['<!-- 01 EXECUTIVE SUMMARY -->','<!-- 02 INFLECTION POINT -->','<!-- 03 CAPACITY CRISIS -->',
 '<!-- 04 SME OPPORTUNITY -->','<!-- 05 REVENUE OPPORTUNITY -->','<!-- 06 ADVISORY -->','<!-- 07 GLOBAL DELIVERY -->',
 '<!-- 08 COMPETITIVE LANDSCAPE -->','<!-- 09 OPPORTUNITY COST -->','<!-- 10 THESIS -->',
 '<!-- 11 MARKET BENCHMARKS / EXCEL GRAPHICAL -->','<!-- 12 FAQ -->','<!-- 13 REFERENCES -->','<!-- FINAL -->'];
const mi = markers.map(m => { const i = sectionsHtml.indexOf(m); if (i < 0) throw new Error('marker missing: ' + m); return i; });
const SEC = {};
for (let n = 1; n <= 13; n++) SEC[n] = sectionsHtml.slice(mi[n - 1], mi[n]);
const FINAL_RAW = sectionsHtml.slice(mi[13]);

/* ---- static scaffolding ---- */
const FAVICON = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='44' fill='none' stroke='%23111111' stroke-width='7'/><text x='50' y='68' font-size='52' font-family='Arial' font-weight='900' fill='%23111111' text-anchor='middle'>D</text><circle cx='68' cy='28' r='8' fill='%238A6A12'/></svg>">`;
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet">`;
const PROGRESS = `<div class="reading-progress" id="progress" aria-hidden="true"></div>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="goldgrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#c4a648"/><stop offset="1" stop-color="#8a6a12"/>
  </linearGradient>
</defs></svg>`;
const LOGO_SVG = `<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="23" cy="23" r="21" fill="none" stroke="#111111" stroke-width="1.5"/>
      <path d="M16 12 L16 34 L24 34 C32 34 36 28 36 23 C36 18 32 12 24 12 Z" fill="#111111"/>
      <circle cx="37" cy="10" r="2.5" fill="#8a6a12"/>
    </svg>`;
const header = R => `<header class="topbar">
  <a href="${R}" class="logo">
    ${LOGO_SVG}
    <span class="logo-name">DILIGENCE<span class="logo-accent">OS</span></span>
  </a>
  <nav class="top-actions">
    <a class="back-link-top" href="${R}">&larr; <span class="bk-long">Back to dosacc.com</span><span class="bk-short">Back</span></a>
    <a class="btn btn-gold" href="${R}schedule/"><i class="fas fa-calendar-check"></i> Book a Meeting</a>
  </nav>
</header>`;
const footer = R => `<footer class="pagefoot">
  &copy; 2026 DiligenceOS. All rights reserved. &middot; <a href="${R}privacy">Privacy Policy</a> &middot; <a href="${R}terms">Terms of Service</a> &middot; <a href="${R}">dosacc.com</a>
</footer>`;
const TOOLBAR = `<div class="toolbar"><button type="button" onclick="window.print()" aria-label="Print or save this page as a PDF"><i class="fas fa-print"></i> Print / Save as PDF</button></div>`;

const ARTICLE_BASE = {
  '@context': 'https://schema.org', '@type': 'Article',
  author: { '@type': 'Organization', name: 'DiligenceOS' },
  publisher: { '@type': 'Organization', name: 'DiligenceOS', url: 'https://dosacc.com/' },
  datePublished: '2026-06-16', dateModified: '2026-06-16',
  image: 'https://dosacc.com/og-image.png',
  keywords: 'accounting firms, accountant shortage, capacity crisis, advisory, global delivery',
};

/* ---- helpers ---- */
const finalCta = site => FINAL_RAW.replace(/href="\.\.\//g, 'href="' + site);
const cites = (text, sources) => text.replace(/\[\[(\d+)\]\]/g, (m, n) => {
  const s = sources[+n - 1];
  if (!s) throw new Error('cite [[' + n + ']] has no source');
  return `<sup class="cite"><a href="${s.url}" target="_blank" rel="noopener">${n}</a></sup>`;
});
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

function buildHead({ title, ogTitle, desc, ogDesc, url, asset, faq, section }) {
  const article = Object.assign({}, ARTICLE_BASE, { headline: ogTitle, description: desc, mainEntityOfPage: url, articleSection: section || 'Industry Analysis' });
  const ld = JSON.stringify(faq ? [article, faqSchema] : [article], null, 1);
  return `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | DiligenceOS</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="noindex, nofollow">
<meta name="keywords" content="accounting firms, accountant shortage, capacity crisis, advisory services, global delivery, accounting outsourcing alternative, firm growth, CPA firm scaling, offshore accounting">
<meta property="og:type" content="article">
<meta property="og:site_name" content="DiligenceOS">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDesc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="https://dosacc.com/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle}">
<meta name="twitter:description" content="${ogDesc}">
${FAVICON}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${FONT}
<link rel="stylesheet" href="${asset}opportunity.css">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">
${ld}
</script>
</head>`;
}

/* depth-aware page writer */
function writePage(outRel, head, mainHtml) {
  const depth = outRel.split('/').length - 1;
  const site = '../'.repeat(depth + 1);
  const html = `<!DOCTYPE html>
<html lang="en">
${head}
<body>

${PROGRESS}

${header(site)}

<main>
${mainHtml}</main>

${footer(site)}

${TOOLBAR}

<script src="${'../'.repeat(depth)}assets/opportunity.js"></script>
</body>
</html>
`;
  const dir = path.join(OPPDIR, path.dirname(outRel));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(OPPDIR, outRel), replaceIcons(html), 'utf8');
  console.log('wrote opportunity/' + outRel);
}

/* market switch nav (current = 'hub' or region code; base = path to /opportunity/) */
function regionSwitch(current, base) {
  const home = current === 'hub'
    ? `<span class="active"><span class="flag">🌐</span> Global</span>`
    : `<a class="home" href="${base || './'}"><span class="flag">🌐</span> Global</a>`;
  let items = '';
  for (const r of REGIONS)
    items += r.code === current
      ? `\n      <span class="active"><span class="flag">${r.flag}</span> ${r.name}</span>`
      : `\n      <a href="${base}${r.code}/"><span class="flag">${r.flag}</span> ${r.name}</a>`;
  return `\n  <nav class="region-switch">\n      ${home}${items}\n    </nav>\n`;
}

/* =================================================================== HUB */
function regionGridCard(r) {
  const tag = r.deepDive ? `<span class="tag-flag">Full deep dive</span>` : '';
  return `        <a class="regioncard" href="${r.code}/">
          <span class="flag">${r.flag}</span>
          ${tag}<span class="rc-name">${r.name}</span>
          <span class="rc-stat">${r.hubStat}</span>
          <span class="rc-sub">${r.hubSub}</span>
          <span class="rc-go">View market <i class="fas fa-arrow-right" style="font-size:.76rem"></i></span>
        </a>`;
}
function buildHub() {
  const head = buildHead({
    title: 'Opportunity: The Future of the Accounting Firm',
    ogTitle: 'Opportunity: The Future of the Accounting Firm',
    desc: 'A global strategic briefing on the accounting profession. Across Australia, the United States, the United Kingdom, Canada and New Zealand the same shift is underway: rising demand, a shrinking pipeline of accountants, and capacity as the defining growth lever. Choose a market.',
    ogDesc: 'Across the developed world the constraint on accounting firms has moved from demand to capacity. One thesis, five markets, real data.',
    url: OPP, asset: 'assets/', faq: false, section: 'Global Industry Analysis',
  });
  const cards = REGIONS.map(regionGridCard).join('\n');
  const main = `
  <!-- HERO -->
  <section class="hero">
    <span class="eyebrow">Global Industry Briefing &middot; Five Markets</span>
    <h1>The Future of the Accounting Firm</h1>
    <p class="lede">Across the developed world, the same shift is underway. Client demand and compliance keep rising while the supply of qualified accountants contracts. The binding constraint has moved from demand to capacity, and resolving it is the defining growth opportunity of the decade. Choose a market to see the case in local numbers.</p>
    <div class="hero-ctas">
      <a class="btn btn-line" href="#markets">Choose your market <i class="fas fa-arrow-down" style="font-size:.8rem"></i></a>
    </div>
    <p class="byline">A DiligenceOS strategic analysis &middot; <span>June 2026</span> &middot; Five markets, one thesis</p>
  </section>
${regionSwitch('hub', '')}
  <!-- MARKET SELECTOR -->
  <section class="section alt" id="markets">
    <div class="inner">
      <p class="kicker">Select a Market</p>
      <h2>One thesis, five markets</h2>
      <p class="section-sub">Every market below tells the same story in different numbers: a shrinking pipeline of accountants, a growing base of businesses that need them, and capacity as the lever. Australia carries the full five-part deep dive.</p>
      <div class="regiongrid">
${cards}
      </div>
    </div>
  </section>

  <!-- WHY EVERYWHERE -->
  <section class="section" id="why">
    <div class="inner">
      <p class="kicker">Why Everywhere, Why Now</p>
      <h2>The same three forces, worldwide</h2>
      <p class="section-sub">The capacity crisis is not a local anomaly. It is the product of three structural forces converging across every developed accounting market at once.</p>
      <div class="grid" style="margin-top:30px;">
        <div class="card"><div class="ico"><i class="fas fa-arrow-trend-up"></i></div><h3>Demand keeps compounding</h3><p>More than 46 million businesses across these five markets generate recurring demand for bookkeeping, payroll, tax, compliance, and advisory, and the base keeps growing.</p></div>
        <div class="card"><div class="ico"><i class="fas fa-gauge-high"></i></div><h3>Supply is contracting</h3><p>From a 95% collapse in Australia’s training pipeline to a two-thirds fall in licensed US accountants since 2019, the qualified workforce is shrinking in every market at once.</p></div>
        <div class="card"><div class="ico"><i class="fas fa-earth-oceania"></i></div><h3>Value is moving to advisory</h3><p>As automation absorbs compliance, the differentiated value of a firm migrates to interpretation and advice, work that requires senior capacity the shortage consumes.</p></div>
      </div>
      <div class="numbers" style="margin-top:46px;">
        <div><b>46M+</b><span>Businesses across the five markets, all needing accounting services</span></div>
        <div><b>5 of 5</b><span>Markets in structural accountant shortage</span></div>
        <div><b>US$54.8B</b><span>Global finance &amp; accounting delivery market, growing toward US$85.9B by 2031<sup class="cite"><a href="https://market.us/report/finance-and-accounting-outsourcing-market/" target="_blank" rel="noopener">1</a></sup></span></div>
        <div><b>1 thesis</b><span>Capacity, not demand, is the binding constraint</span></div>
      </div>
      <div class="callout">
        <span class="lbl">The central finding</span>
        <p>The accounting profession is not facing a demand shortage. It is facing a capacity shortage, in every major market at once. The firms that build scalable capacity first will inherit the clients, advisory work, and talent that constrained competitors are forced to surrender.</p>
      </div>
      <div class="refs-mini" style="margin-top:18px;">
        <ol>
          <li>Market.us and Mordor Intelligence, Finance and Accounting Outsourcing Market Size &amp; Forecast, 2025. <a href="https://market.us/report/finance-and-accounting-outsourcing-market/" target="_blank" rel="noopener">market.us</a>. Per-market figures and sources appear on each market page.</li>
        </ol>
      </div>
    </div>
  </section>
${finalCta('../')}`;
  writePage('index.html', head, main);
}

/* =================================================================== REGION DECK */
function regionInfoCard(c, r) {
  const lis = c.bullets.map(b => `<li>${cites(b, r.sources)}</li>`).join('\n          ');
  return `        <div class="deckcard">
          <span class="dc-num">${c.num}</span>
          <h3>${c.title}</h3>
          <ul>
          ${lis}
          </ul>
        </div>`;
}
function buildRegionDeck(r) {
  const url = OPP + r.code + '/';
  const head = buildHead({
    title: `Opportunity, ${r.name}: The Capacity Opportunity`,
    ogTitle: `Opportunity, ${r.name}`,
    desc: r.lede.replace(/&middot;/g, '-').replace(/<[^>]+>/g, ''),
    ogDesc: r.lede.replace(/<[^>]+>/g, ''),
    url, asset: '../assets/', faq: false, section: r.name,
  });
  const statband = r.stats.map(s => `<div><b>${s.v}</b><span>${cites(s.l, r.sources)}</span></div>`).join('\n        ');
  const cards = r.cards.map(c => regionInfoCard(c, r)).join('\n');
  const refs = r.sources.map(s => `<li>${s.t} <a href="${s.url}" target="_blank" rel="noopener">${host(s.url)}</a></li>`).join('\n          ');
  const main = `
  <!-- REGION HERO -->
  <section class="hero regionhero">
    <span class="flag-xl">${r.flag}</span>
    <span class="eyebrow">${r.eyebrow}</span>
    <h1>${r.h1}</h1>
    <p class="lede">${r.lede}</p>
  </section>
${regionSwitch(r.code, '../')}
  <!-- AT A GLANCE -->
  <section class="section alt">
    <div class="inner">
      <p class="kicker">The Numbers</p>
      <h2>${r.name} at a glance</h2>
      <div class="numbers" style="margin-top:32px;">
        ${statband}
      </div>
    </div>
  </section>

  <!-- THE THESIS, LOCALISED -->
  <section class="section">
    <div class="inner">
      <p class="kicker">The Thesis</p>
      <h2>Demand is not the constraint. Capacity is.</h2>
      <p class="section-sub">The same three forces are reshaping every developed accounting market. Here is how they read in ${r.name}.</p>
      <div class="deck">
${cards}
      </div>
      <div class="deck-foot">
        <a class="btn btn-line" href="../au/">Explore the full five-part deep dive <i class="fas fa-arrow-right" style="font-size:.8rem"></i></a>
      </div>
      <p class="chart-note" style="text-align:center;max-width:720px;margin:14px auto 0;">The deep-dive analysis uses Australia as the worked example. The dynamics, and the response, apply across markets.</p>
    </div>
  </section>

  <!-- SOURCES -->
  <section class="section alt">
    <div class="inner refs-mini">
      <p class="kicker">Sources</p>
      <h2 style="margin-bottom:24px;">References</h2>
      <ol>
          ${refs}
      </ol>
      <p class="disclaimer" style="max-width:900px;margin:18px auto 0;font-size:.8rem;color:#8a8a8a;">Statistics are drawn from the cited third-party sources and were current at the time of writing (June 2026); figures are subject to revision by their publishers. This material is provided for general strategic discussion and is not accounting, taxation, legal, or investment advice.</p>
    </div>
  </section>
${finalCta('../../')}`;
  writePage(`${r.code}/index.html`, head, main);
}

/* =================================================================== AU DECK + DEEP DIVE */
function deckCard(c) {
  const lis = c.bullets.map(b => `<li>${b}</li>`).join('\n          ');
  return `        <div class="deckcard">
          <span class="dc-num">${c.num}</span>
          <h3>${c.title}</h3>
          <ul>
          ${lis}
          </ul>
          <a class="dc-more" href="${c.href}">Go deeper <i class="fas fa-arrow-right" style="font-size:.78rem"></i></a>
        </div>`;
}
function deckSection(g) {
  const cards = g.cards.map(deckCard).join('\n');
  const mini = g.mini ? `\n      <div class="deck-mini">\n        ${g.mini.map(x => `<a href="${x.href}">${x.label}</a>`).join('\n        ')}\n      </div>` : '';
  return `
  <section class="section${g.alt ? ' alt' : ''}" id="p${g.part}">
    <div class="inner">
      <p class="kicker">Part ${g.part}</p>
      <h2>${labels[g.part].replace('&amp;', '&')}</h2>
      <p class="section-sub">${g.sub}</p>
      <div class="deck">
${cards}
      </div>
      <div class="deck-foot">
        <a class="btn btn-line" href="part-${g.part}/">Open Part ${g.part} in full <i class="fas fa-arrow-right" style="font-size:.8rem"></i></a>
      </div>${mini}
    </div>
  </section>
`;
}
function deckStepper() {
  let items = '';
  for (let k = 1; k <= 5; k++) items += `\n      <a href="#p${k}"><b>${k}</b> ${labels[k]}</a>`;
  return `\n  <nav class="partbar"><div class="partbar-inner">${items}\n    </div></nav>\n`;
}
function buildAuDeck() {
  const head = buildHead({
    title: 'Opportunity, Australia: The Future of Accounting Firms',
    ogTitle: 'Opportunity, Australia: The Future of Accounting Firms',
    desc: 'An executive overview, in bullets, of the growth opportunity facing Australian accounting firms, with a full five-part deep dive. The issue is not demand. It is capacity.',
    ogDesc: 'The issue facing Australian firms is not demand. It is capacity. An executive overview with a five-part deep dive.',
    url: OPP + 'au/', asset: '../assets/', faq: false, section: 'Australia',
  });
  const main = `
  <!-- HERO -->
  <section class="hero">
    <span class="flag-xl" style="font-size:2.6rem;display:block;margin-bottom:10px;">🇦🇺</span>
    <span class="eyebrow">Industry Briefing &middot; Australia &middot; Executive Overview</span>
    <h1>Opportunity: The Future of Australian Accounting Firms</h1>
    <p class="lede">Australian accounting firms face one of the largest growth opportunities the profession has seen in decades. The issue is not demand. It is capacity. This is the case at a glance, in bullet points. Want more on any topic? Go deeper into the full briefing.</p>
    <div class="hero-ctas">
      <a class="btn btn-line" href="part-1/">Read the full briefing <i class="fas fa-arrow-right" style="font-size:.8rem"></i></a>
    </div>
    <p class="byline">A DiligenceOS strategic analysis &middot; <span>June 2026</span> &middot; Overview, plus a five-part deep dive</p>
  </section>
${regionSwitch('au', '../')}${deckStepper()}${DECK.map(deckSection).join('')}
${finalCta('../../')}`;
  writePage('au/index.html', head, main);
}

function partbar(cur) {
  let items = `\n      <a class="home" href="../"><b><i class="fas fa-table-cells-large"></i></b> Overview</a>`;
  for (let k = 1; k <= 5; k++)
    items += (k === cur)
      ? `\n      <span class="active"><b>${k}</b> ${labels[k]}</span>`
      : `\n      <a href="../part-${k}/"><b>${k}</b> ${labels[k]}</a>`;
  return `\n  <nav class="partbar"><div class="partbar-inner">${items}\n    </div></nav>\n`;
}
function partnav(cur) {
  const prev = cur === 1
    ? `<a class="prev" href="../"><span class="pn-label"><i class="fas fa-arrow-left"></i> Back to</span><span class="pn-title">Australia overview</span></a>`
    : `<a class="prev" href="../part-${cur - 1}/"><span class="pn-label"><i class="fas fa-arrow-left"></i> Previous</span><span class="pn-title">Part ${cur - 1} &middot; ${labels[cur - 1]}</span></a>`;
  const next = cur < 5
    ? `<a class="next" href="../part-${cur + 1}/"><span class="pn-label">Next <i class="fas fa-arrow-right"></i></span><span class="pn-title">Part ${cur + 1} &middot; ${labels[cur + 1]}</span></a>`
    : `<span class="pn-spacer"></span>`;
  return `\n  <nav class="partnav">\n    ${prev}\n    ${next}\n  </nav>\n`;
}
function buildAuPart(n) {
  const m = META[n];
  const head = buildHead({ title: m.ogTitle, ogTitle: m.ogTitle, desc: m.desc, ogDesc: m.ogDesc,
    url: `${OPP}au/part-${n}/`, asset: '../../assets/', faq: n === 5, section: labels[n].replace('&amp;', '&') });
  const hero = `
  <!-- PART HEADER -->
  <section class="hero">
    <span class="eyebrow">Australia &middot; Part ${n} of 5</span>
    <h1>${m.h1}</h1>
    <p class="lede">${m.lede}</p>
    <p class="byline">A DiligenceOS strategic analysis &middot; <span>June 2026</span> &middot; Part ${n} of 5 &middot; Read: ${m.mins} min</p>
  </section>
`;
  let body = hero + partbar(n);
  for (const s of PARTSECS[n]) {
    let blk = SEC[s];
    if (s === 8) blk = blk.replace('href="#market"', 'href="../part-5/#market"');
    body += blk;
  }
  body += partnav(n);
  if (n === 5) body += '\n' + finalCta('../../../');
  writePage(`au/part-${n}/index.html`, head, body);
}

/* =================================================================== RUN */
buildHub();
for (const r of REGIONS) buildRegionDeck(r);
buildAuDeck();
for (let n = 1; n <= 5; n++) buildAuPart(n);
console.log('done');
