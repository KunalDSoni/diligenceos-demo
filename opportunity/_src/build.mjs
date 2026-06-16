/* Build the /opportunity briefing: an executive DECK at /opportunity/ plus five
   detailed parts at /opportunity/part-1..5/. Single source of truth.
   Run: `npm run build:opp`  (or: node opportunity/_src/build.mjs)

   Shared CSS/JS live in opportunity/assets/ and are linked (cached once across
   all pages). Icons are inlined as SVG (no FontAwesome). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { labels, PARTSECS, META, DECK } from './content.mjs';
import { replaceIcons } from './icons.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));   // opportunity/_src
const OPPDIR = path.dirname(SRC);                           // opportunity
const OPP = 'https://dosacc.com/opportunity/';
const faqSchema = JSON.parse(fs.readFileSync(path.join(SRC, 'faq-schema.json'), 'utf8'));

/* ---- section bodies ---- */
const sectionsHtml = fs.readFileSync(path.join(SRC, 'sections.html'), 'utf8');
const markers = ['<!-- 01 EXECUTIVE SUMMARY -->','<!-- 02 INFLECTION POINT -->','<!-- 03 CAPACITY CRISIS -->',
 '<!-- 04 SME OPPORTUNITY -->','<!-- 05 REVENUE OPPORTUNITY -->','<!-- 06 ADVISORY -->','<!-- 07 GLOBAL DELIVERY -->',
 '<!-- 08 COMPETITIVE LANDSCAPE -->','<!-- 09 OPPORTUNITY COST -->','<!-- 10 THESIS -->',
 '<!-- 11 MARKET BENCHMARKS / EXCEL GRAPHICAL -->','<!-- 12 FAQ -->','<!-- 13 REFERENCES -->','<!-- FINAL -->'];
const mi = markers.map(m => { const i = sectionsHtml.indexOf(m); if (i < 0) throw new Error('marker missing: ' + m); return i; });
const SEC = {};
for (let n = 1; n <= 13; n++) SEC[n] = sectionsHtml.slice(mi[n - 1], mi[n]);
const FINAL = sectionsHtml.slice(mi[13]);

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
  keywords: 'Australian accounting firms, accountant shortage, capacity, advisory, global delivery',
};

/* ---- head ---- */
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
<meta name="keywords" content="Australian accounting firms, accountant shortage Australia, capacity crisis, advisory services, global delivery, accounting outsourcing alternative, firm growth, CPA firm scaling, SMSF, tax agents, bookkeeping firms">
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

/* ---- page wrapper ---- */
function page({ head, root, asset, main }) {
  const html = `<!DOCTYPE html>
<html lang="en">
${head}
<body>

${PROGRESS}

${header(root)}

<main>
${main}</main>

${footer(root)}

${TOOLBAR}

<script src="${asset}opportunity.js"></script>
</body>
</html>
`;
  return replaceIcons(html);
}

/* ---- part-page nav ---- */
const relPart = k => `../part-${k}/`;     // from any part page
const OVERVIEW = '../';
function partbar(cur) {
  let items = `\n      <a class="home" href="${OVERVIEW}"><b><i class="fas fa-table-cells-large"></i></b> Overview</a>`;
  for (let k = 1; k <= 5; k++)
    items += (k === cur)
      ? `\n      <span class="active"><b>${k}</b> ${labels[k]}</span>`
      : `\n      <a href="${relPart(k)}"><b>${k}</b> ${labels[k]}</a>`;
  return `\n  <nav class="partbar"><div class="partbar-inner">${items}\n    </div></nav>\n`;
}
function partnav(cur) {
  const prev = cur === 1
    ? `<a class="prev" href="${OVERVIEW}"><span class="pn-label"><i class="fas fa-arrow-left"></i> Back to</span><span class="pn-title">Executive overview</span></a>`
    : `<a class="prev" href="${relPart(cur - 1)}"><span class="pn-label"><i class="fas fa-arrow-left"></i> Previous</span><span class="pn-title">Part ${cur - 1} &middot; ${labels[cur - 1]}</span></a>`;
  const next = cur < 5
    ? `<a class="next" href="${relPart(cur + 1)}"><span class="pn-label">Next <i class="fas fa-arrow-right"></i></span><span class="pn-title">Part ${cur + 1} &middot; ${labels[cur + 1]}</span></a>`
    : `<span class="pn-spacer"></span>`;
  return `\n  <nav class="partnav">\n    ${prev}\n    ${next}\n  </nav>\n`;
}

/* ---- build a part page ---- */
function buildPart(n) {
  const m = META[n];
  const head = buildHead({ title: m.ogTitle, ogTitle: m.ogTitle, desc: m.desc, ogDesc: m.ogDesc,
    url: `${OPP}part-${n}/`, asset: '../assets/', faq: n === 5, section: labels[n].replace('&amp;', '&') });
  const hero = `
  <!-- PART HEADER -->
  <section class="hero">
    <span class="eyebrow">Part ${n} of 5 &middot; Australia</span>
    <h1>${m.h1}</h1>
    <p class="lede">${m.lede}</p>
    <p class="byline">A DiligenceOS strategic analysis &middot; <span>June 2026</span> &middot; Part ${n} of 5 &middot; Read: ${m.mins} min</p>
  </section>
`;
  let body = hero + partbar(n);
  for (const s of PARTSECS[n]) {
    let blk = SEC[s];
    if (s === 8) blk = blk.replace('href="#market"', `href="${relPart(5)}#market"`);
    body += blk;
  }
  body += partnav(n);
  if (n === 5) body += '\n' + FINAL.replace(/href="\.\.\//g, 'href="../../');
  return page({ head, root: '../../', asset: '../assets/', main: body });
}

/* ---- build the deck ---- */
function deckStepper() {
  let items = '';
  for (let k = 1; k <= 5; k++) items += `\n      <a href="#p${k}"><b>${k}</b> ${labels[k]}</a>`;
  return `\n  <nav class="partbar"><div class="partbar-inner">${items}\n    </div></nav>\n`;
}
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
function buildDeck() {
  const head = buildHead({
    title: 'Opportunity: The Future of Australian Accounting Firms',
    ogTitle: 'Opportunity: The Future of Australian Accounting Firms',
    desc: 'An executive overview, in bullets, of the once-in-a-generation growth opportunity facing Australian accounting firms. Scan the key findings on every topic, then go deeper into the full five-part briefing.',
    ogDesc: 'The issue facing Australian firms is not demand. It is capacity. An executive overview, with the option to go deeper on any topic.',
    url: OPP, asset: 'assets/', faq: false,
  });
  const hero = `
  <!-- HERO -->
  <section class="hero">
    <span class="eyebrow">Industry Briefing &middot; Australia &middot; Executive Overview</span>
    <h1>Opportunity: The Future of Australian Accounting Firms</h1>
    <p class="lede">Australian accounting firms face one of the largest growth opportunities the profession has seen in decades. The issue is not demand. It is capacity. This is the case at a glance, in bullet points. Want more on any topic? Go deeper into the full briefing.</p>
    <div class="hero-ctas">
      <a class="btn btn-line" href="part-1/">Read the full briefing <i class="fas fa-arrow-right" style="font-size:.8rem"></i></a>
    </div>
    <p class="byline">A DiligenceOS strategic analysis &middot; <span>June 2026</span> &middot; Overview, plus a five-part deep dive</p>
  </section>
`;
  let body = hero + deckStepper();
  for (const g of DECK) body += deckSection(g);
  body += '\n' + FINAL;     // deck is at depth 0; original ../ paths are correct
  return page({ head, root: '../', asset: 'assets/', main: body });
}

/* ---- write all six ---- */
fs.writeFileSync(path.join(OPPDIR, 'index.html'), buildDeck(), 'utf8');
console.log('wrote opportunity/index.html (deck)');
for (let n = 1; n <= 5; n++) {
  const dir = path.join(OPPDIR, `part-${n}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildPart(n), 'utf8');
  console.log(`wrote opportunity/part-${n}/index.html`);
}
console.log('done');
