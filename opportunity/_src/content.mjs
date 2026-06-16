/* Content + structure for the /opportunity briefing.
   Edit here, then `npm run build:opp` to regenerate all six pages. */

export const labels = {
  1: 'The Inflection Point',
  2: 'The Capacity Crisis',
  3: 'Revenue &amp; Advisory',
  4: 'Global Delivery',
  5: 'Thesis &amp; Benchmarks',
};

/* Which numbered sections (from _src/sections.html) belong to each part. */
export const PARTSECS = { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8, 9], 5: [10, 11, 12, 13] };

/* Per-part header + meta. */
export const META = {
  1: { h1: 'The Inflection Point', ogTitle: 'Opportunity, Part 1: The Inflection Point',
    desc: 'Part 1 of a five-part briefing on Australian accounting firms: the executive summary and the inflection point now reshaping the profession.',
    ogDesc: 'The issue facing Australian firms is not demand. It is capacity. Part 1 of five.',
    lede: 'For most of the profession’s history, growth was governed by how much work a firm could win. That equation has inverted. This part sets out the central finding and the forces driving it.', mins: 4 },
  2: { h1: 'The Capacity Crisis and the Demand Engine', ogTitle: 'Opportunity, Part 2: The Capacity Crisis',
    desc: 'Part 2 of a five-part briefing: the Australian accountant capacity crisis and the expanding SME demand base driving it.',
    ogDesc: 'The gap between the work that exists and the people to do it. Part 2 of five.',
    lede: 'The single most important number in Australian accounting is the gap between the work that exists and the people available to do it. This part examines the shrinking supply of accountants and the expanding base of small-business demand pressing against it.', mins: 5 },
  3: { h1: 'The Revenue and Advisory Opportunity', ogTitle: 'Opportunity, Part 3: Revenue and Advisory',
    desc: 'Part 3 of a five-part briefing: the revenue economics of capacity and why advisory is the future of the accounting firm.',
    ogDesc: 'Capacity is the largest lever on firm revenue, margin, and value. Part 3 of five.',
    lede: 'Capacity is the largest single lever on firm revenue, margin, and enterprise value. This part models the economics of adding capacity, then shows why advisory is where the profession’s future value will concentrate.', mins: 5 },
  4: { h1: 'The Global Delivery Model', ogTitle: 'Opportunity, Part 4: Global Delivery',
    desc: 'Part 4 of a five-part briefing: the global delivery model, the competitive provider landscape, and the cost of inaction.',
    ogDesc: 'The model that lets a firm escape the capacity constraint, now available to everyone. Part 4 of five.',
    lede: 'The model that lets a firm escape the capacity constraint is how the world’s largest firms have operated for two decades, now available to everyone. This part covers the delivery model, the providers already serving Australian firms, and the compounding cost of standing still.', mins: 5 },
  5: { h1: 'The Strategic Thesis, Benchmarks and FAQ', ogTitle: 'Opportunity, Part 5: The Strategic Thesis',
    desc: 'Part 5 of a five-part briefing: the strategic thesis, a graphical benchmark of the delivery market, an in-depth FAQ, and sources.',
    ogDesc: 'Where durable advantage is heading, with benchmarks, an in-depth FAQ, and sources. Part 5 of five.',
    lede: 'Where durable advantage in this profession is heading, set against a graphical benchmark of the delivery market, the questions firms ask before they act, and the sources behind the analysis.', mins: 6 },
};

/* The executive deck (front door at /opportunity/). One card per topic. */
export const DECK = [
  { part: 1, alt: false, sub: 'The central finding, and the forces converging to create it.', cards: [
    { num: '01 · Executive Summary', title: 'The constraint has moved from demand to capacity', href: 'part-1/#summary', bullets: [
      'For the first time, the binding limit is delivery, not winning work',
      '2.7M+ businesses and rising; the qualified workforce is shrinking',
      'First movers compound their advantage every quarter'] },
    { num: '02 · The Industry', title: 'An industry at an inflection point', href: 'part-1/#inflection', bullets: [
      '$33.3B market, 9,968 firms, 108,177 people employed',
      'Flat revenue on a growing demand base signals a capacity ceiling',
      'Value is migrating from processing to advice'] },
  ]},
  { part: 2, alt: true, sub: 'The shortage of accountants, and the demand pressing against it.', cards: [
    { num: '03 · The Defining Challenge', title: 'The capacity crisis', href: 'part-2/#capacity', bullets: [
      '10,000+ accountant shortfall; 17,700 more needed by 2030',
      'Professional Year pipeline down ~95% (7,122 to 340)',
      '68% cite unsustainable workloads; 21.1% attrition to 2030'] },
    { num: '04 · The Demand Engine', title: 'The Australian SME opportunity', href: 'part-2/#sme', bullets: [
      '2.73M trading businesses, 97.3% of them small',
      '+66,650 net new businesses in a single year (+2.5%)',
      'Recurring demand: bookkeeping, payroll, BAS, tax, advisory',
      'Western Australia and Queensland are leading the growth'] },
  ]},
  { part: 3, alt: false, sub: 'The economics of capacity, and where future value concentrates.', cards: [
    { num: '05 · The Economics', title: 'The revenue opportunity', href: 'part-3/#revenue', bullets: [
      'Capacity is the single largest lever on revenue and margin',
      'Firm A model: +50% capacity nearly doubles net profit',
      'Margin expands as the firm grows, rather than holding flat'] },
    { num: '06 · The Strategic Shift', title: 'Why advisory is the future', href: 'part-3/#advisory', bullets: [
      '89% of firms report growth in advisory services',
      'Cloud standardised: 97% of SMEs on cloud platforms by 2026',
      'Advisory means higher fees, higher margins, stickier clients',
      'Capacity is the precondition for advisory'] },
  ]},
  { part: 4, alt: true, sub: 'How firms escape the constraint, who already offers it, and the price of waiting.', cards: [
    { num: '07 · The Operating Model', title: 'The global delivery transformation', href: 'part-4/#delivery', bullets: [
      'The Big Four model, now available to independent firms',
      '$54.8B global delivery market, growing ~7.8% a year',
      'A dedicated team inside the firm’s own workflow and controls'] },
    { num: '08 · Market Adoption', title: 'The competitive landscape', href: 'part-4/#landscape', bullets: [
      'Dozens of established providers now serve Australian firms',
      'Thousands of professionals already dedicated to AU work',
      'Adoption has moved from early to standard practice'] },
    { num: '09 · The Cost of Inaction', title: 'The opportunity cost of doing nothing', href: 'part-4/#cost', bullets: [
      'Two declined clients a month ≈ $144k a year forfeited',
      'Cumulative opportunity cost ~$920k+ over three years',
      'Standing still finances the competitor’s growth'] },
  ]},
  { part: 5, alt: false, sub: 'The point of view, the provider benchmarks, and the questions firms ask.', cards: [
    { num: '10 · The Strategic Thesis', title: 'Where durable advantage is heading', href: 'part-5/#thesis', bullets: [
      'Combine local judgement with scalable global talent',
      'Build capacity faster than competitors can',
      'Shift decisively toward advisory, on a scalable model'] },
    { num: '11 · Market Benchmarks', title: 'The delivery market, in numbers', href: 'part-5/#market', bullets: [
      'Provider teams range from 10 to 400+ professionals',
      'Indicative rates cluster at ~AUD 22 to 32 per hour',
      'A full comparative benchmark table, provider by provider'] },
  ], mini: [
    { label: 'Frequently asked questions', href: 'part-5/#faq' },
    { label: 'Sources &amp; references', href: 'part-5/#references' },
  ]},
];
