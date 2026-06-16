/* Per-market data for the international /opportunity briefing.
   Every figure is sourced; citation tokens [[n]] map to the region's `sources`
   list and are rendered as superscript links by the build.
   Australia is the flagship with a full five-part deep dive; the other markets
   are data-rich executive snapshots built on the same thesis. */

export const REGIONS = [
  {
    code: 'au', name: 'Australia', flag: '🇦🇺', deepDive: true,
    hubStat: 'Pipeline down ~95%', hubSub: 'Professional Year enrolments, 2018 to 2024',
    eyebrow: 'Market Briefing &middot; Australia',
    h1: 'Australia: The Future of Accounting Firms',
    lede: 'A $33.3B profession serving a record 2.7 million businesses is entering a decade defined not by demand, but by capacity. This is the snapshot. Australia also carries the full five-part deep dive.',
    stats: [
      { v: '$33.3B', l: 'Australian accounting services market[[1]]' },
      { v: '10,000+', l: 'Estimated accountant shortfall[[2]]' },
      { v: '~95%', l: 'Fall in Professional Year enrolments, 2018 to 2024[[3]]' },
      { v: '2.73M', l: 'Actively trading businesses, 97.3% small[[4]]' },
    ],
    cards: [
      { num: 'The Constraint', title: 'A pipeline that no longer refills', bullets: [
        'Accounting Professional Year enrolments fell from 7,122 in 2018 to 340 in 2024[[3]]',
        'An estimated shortfall of more than 10,000 accountants, with 17,700 more needed by 2030[[2]]',
        '68% of accountants cite unsustainable workloads; 21.1% projected attrition to 2030[[2]]',
      ]},
      { num: 'The Demand', title: 'A recurring-revenue base still compounding', bullets: [
        '2.73M actively trading businesses, 97.3% of them small[[4]]',
        '+66,650 net new businesses in a single year, a 2.5% rise[[4]]',
        'Every entity recurs: bookkeeping, payroll, BAS, tax, and advisory',
      ]},
      { num: 'The Response', title: 'Capacity as a strategic asset', bullets: [
        'The global-delivery model the Big Four built, now available to independent firms',
        'A dedicated team inside the firm’s own software, workflow, and controls',
        'Local partners move up into review, relationships, and advisory',
      ]},
    ],
    sources: [
      { t: 'IBISWorld, Accounting Services in Australia, Market Size and Industry Analysis, 2025.', url: 'https://www.ibisworld.com/australia/market-size/accounting-services/561' },
      { t: 'Chartered Accountants ANZ / Jobs and Skills Australia, accountant shortage and workforce projections.', url: 'https://www.charteredaccountantsanz.com/news-and-analysis/news/targeted-measures-needed-to-tackle-persistent-accountant-shortages' },
      { t: 'CPA Australia, analysis of higher-education and Accounting Professional Year data (2018 to 2024).', url: 'https://www.cpaaustralia.com.au/' },
      { t: 'Australian Bureau of Statistics, Counts of Australian Businesses, July 2021 to June 2025.', url: 'https://www.abs.gov.au/statistics/economy/business-indicators/counts-australian-businesses-including-entries-and-exits/latest-release' },
    ],
  },

  {
    code: 'us', name: 'United States', flag: '🇺🇸', deepDive: false,
    hubStat: '653,408 accountants', hubSub: 'Licensed in 2025, down from 1.93M in 2019',
    eyebrow: 'Market Briefing &middot; United States',
    h1: 'United States: The Capacity Opportunity',
    lede: 'The number of licensed US accountants has fallen by two-thirds from its 2019 peak, even as 36 million small businesses keep generating recurring demand. The constraint is capacity, and it is the largest growth lever American firms have.',
    stats: [
      { v: '653,408', l: 'Licensed US accountants in 2025, down from a 1.93M peak in 2019[[1]]' },
      { v: '30%+', l: 'Decline in CPA exam candidates since 2016[[2]]' },
      { v: '~120,000', l: 'Accounting and auditing openings projected each year[[4]]' },
      { v: '36.2M', l: 'US small businesses, 99.9% of all firms[[5]]' },
    ],
    cards: [
      { num: 'The Constraint', title: 'The pipeline has hit a 20-year low', bullets: [
        'Licensed accountants fell from a 2019 peak of ~1.93M to 653,408 by 2025[[1]]',
        'Roughly 300,000 accountants and auditors left the profession in 2020 to 2022[[1]]',
        'Accounting graduates are at a 20-year low; CPA exam candidates are down 30%+ since 2016[[2]][[3]]',
      ]},
      { num: 'The Demand', title: 'Demand that keeps compounding', bullets: [
        '36.2M small businesses, 99.9% of all US firms[[5]]',
        'The Bureau of Labor Statistics projects 120,000+ accounting and auditing openings every year[[4]]',
        'Compliance complexity and advisory appetite keep rising',
      ]},
      { num: 'The Response', title: 'The model the largest firms already use', bullets: [
        'Global delivery: a dedicated, qualified team inside the firm’s own workflow and controls',
        'Client relationships, judgement, and sign-off stay with local CPAs',
        'Scale capacity in weeks rather than a multi-month recruitment campaign',
      ]},
    ],
    sources: [
      { t: 'NASBA licensed-accountant data, reported via The CPA Journal, The Accounting Profession Is in Crisis, 2025.', url: 'https://www.cpajournal.com/2025/08/15/the-accounting-profession-is-in-crisis-3/' },
      { t: 'AICPA and CIMA, 2025 Trends Report on the supply of accounting graduates and CPA candidates.', url: 'https://www.aicpa-cima.com/news/article/accounting-firms-report-strong-hiring-outlook-aicpa-report-finds' },
      { t: 'CFO Dive, US accounting degree graduates drop to roughly a 20-year low, 2025.', url: 'https://www.cfodive.com/news/us-accounting-degree-graduates-drop-talent-shortage/803914/' },
      { t: 'US Bureau of Labor Statistics, Occupational Outlook Handbook, Accountants and Auditors.', url: 'https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm' },
      { t: 'US Small Business Administration, Office of Advocacy, 2025 Small Business Profiles.', url: 'https://advocacy.sba.gov/2025/06/30/new-advocacy-report-shows-the-number-of-small-businesses-in-the-u-s-exceeds-36-million/' },
    ],
  },
];

export const byCode = Object.fromEntries(REGIONS.map(r => [r.code, r]));
