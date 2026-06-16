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

  {
    code: 'uk', name: 'United Kingdom', flag: '🇬🇧', deepDive: false,
    hubStat: 'Audit firms down 25%', hubSub: '5,007 to 3,760 firms, 2020 to 2024',
    eyebrow: 'Market Briefing &middot; United Kingdom',
    h1: 'United Kingdom: The Capacity Opportunity',
    lede: 'The number of UK audit firms has fallen by a quarter in five years, and two-thirds of mid-tier firms name recruitment as their biggest challenge. Against 5.5 million businesses, capacity is the binding constraint on growth.',
    stats: [
      { v: '3,760', l: 'UK statutory audit firms in 2024, down from 5,007 in 2020[[1]]' },
      { v: '67%', l: 'Mid-tier firms citing recruitment as a top issue[[2]]' },
      { v: '~45%', l: 'Firms severely or significantly hit by the skills shortage[[3]]' },
      { v: '5.5M', l: 'UK businesses, 5.45M of them small[[4]]' },
    ],
    cards: [
      { num: 'The Constraint', title: 'A shrinking supply of firms and talent', bullets: [
        'Statutory audit firms fell 24.9% in five years, from 5,007 to 3,760[[1]]',
        '67% of mid-tier firms say recruiting qualified staff is a top issue; 60% cite retention[[2]]',
        'ICAEW, ACCA and CIMA enrolled 9,000 fewer students across 2017 to 2022[[2]]',
      ]},
      { num: 'The Demand', title: 'A deep and recurring client base', bullets: [
        '5.5M UK businesses, 5.45M of them small[[4]]',
        'VAT, payroll, accounts and advisory recur for the life of every business',
        'Demand for advisory keeps rising as firm capacity tightens',
      ]},
      { num: 'The Response', title: 'Capacity without the bidding war', bullets: [
        'A dedicated global-delivery team inside the firm’s systems and review process',
        'Relationships, judgement, and sign-off stay local',
        'Scale capacity without bidding against every firm for the same scarce hire',
      ]},
    ],
    sources: [
      { t: 'Financial Reporting Council, Key Facts and Trends in the Accountancy Profession, 2025.', url: 'https://www.frc.org.uk/library/supervision/professional-bodies-supervision/key-facts-and-trends-in-the-accountancy-profession/key-facts-and-trends-in-the-accountancy-profession-2025/' },
      { t: 'ICAEW, Evolution of mid-tier accountancy firms (recruitment and retention survey).', url: 'https://www.icaew.com/policy-and-research/evolution-of-mid-tier-accountancy-firms' },
      { t: 'Advancetrack, Accounting Talent Index, on the impact of the skills shortage.', url: 'https://www.advancetrack.com/talent/' },
      { t: 'UK Government, Business Population Estimates for the UK and regions, 2024.', url: 'https://www.gov.uk/government/statistics/business-population-estimates-2024/business-population-estimates-for-the-uk-and-regions-2024-statistical-release' },
    ],
  },

  {
    code: 'ca', name: 'Canada', flag: '🇨🇦', deepDive: false,
    hubStat: '90% cannot fill roles', hubSub: 'Finance and accounting hiring managers',
    eyebrow: 'Market Briefing &middot; Canada',
    h1: 'Canada: The Capacity Opportunity',
    lede: 'Nine in ten Canadian finance and accounting hiring managers cannot fill the roles they need, while more CPAs retire than enter the profession. With 1.29 million small businesses, the demand is there. The capacity is not.',
    stats: [
      { v: '90%', l: 'Finance and accounting hiring managers struggling to fill roles[[2]]' },
      { v: '59%', l: 'Finance leaders reporting project delays from skills shortages[[2]]' },
      { v: '1.29M', l: 'Canadian small businesses, 99.8% of all firms[[3]]' },
      { v: '+20%', l: 'Growth in small businesses since 2011[[1]]' },
    ],
    cards: [
      { num: 'The Constraint', title: 'More CPAs leaving than arriving', bullets: [
        '90% of finance and accounting hiring managers struggle to fill roles[[2]]',
        'More CPAs are retiring than entering, even as tax filers keep rising[[1]]',
        '59% of finance leaders report project delays from skills shortages[[2]]',
      ]},
      { num: 'The Demand', title: 'A growing small-business engine', bullets: [
        '1.29M small businesses, 99.8% of all Canadian firms[[3]]',
        'Roughly 20% more small businesses than in 2011, outpacing the profession’s capacity[[1]]',
        'Bookkeeping, payroll, tax and advisory recur for every entity',
      ]},
      { num: 'The Response', title: 'Scalable capacity, local accountability', bullets: [
        'A dedicated global-delivery team inside the firm’s own controls and software',
        'Local CPAs focus on advisory, review, and relationships',
        'Capacity that flexes with tax season instead of a permanent local hire',
      ]},
    ],
    sources: [
      { t: 'CPA Canada, on the CPA pipeline and the accountant shortage.', url: 'https://www.cpacanada.ca/news/Analysis/pipeline' },
      { t: 'Robert Half Canada, 2026 finance and accounting hiring trends.', url: 'https://www.roberthalf.com/ca/en/insights/research/data-reveals-which-finance-and-accounting-roles-are-in-highest-demand' },
      { t: 'Innovation, Science and Economic Development Canada, Key Small Business Statistics, 2025.', url: 'https://ised-isde.canada.ca/site/sme-research-statistics/en/key-small-business-statistics/key-small-business-statistics-2025' },
    ],
  },

  {
    code: 'nz', name: 'New Zealand', flag: '🇳🇿', deepDive: false,
    hubStat: '15,000 shortfall', hubSub: 'Accountants forecast short within five years',
    eyebrow: 'Market Briefing &middot; New Zealand',
    h1: 'New Zealand: The Capacity Opportunity',
    lede: 'Infometrics forecasts a shortfall of 15,000 accountants within five years, with degree enrolments down 40% since 2018 and a steady brain drain across the Tasman. A NZ$5.1B profession is meeting rising demand with a thinning workforce.',
    stats: [
      { v: '15,000', l: 'Accountant shortfall forecast over five years[[1]]' },
      { v: '~40%', l: 'Fall in accounting degree enrolments since 2018[[2]]' },
      { v: 'NZ$5.1B', l: 'Accounting services market, growing ~2.2% a year[[3]]' },
      { v: '612,420', l: 'NZ enterprises, 73% with no employees[[4]]' },
    ],
    cards: [
      { num: 'The Constraint', title: 'A pipeline thinning, and talent leaving', bullets: [
        'Infometrics forecasts a shortage of 15,000 accountants within five years[[1]]',
        'Accounting degree enrolments are down roughly 40% since 2018[[2]]',
        'A sustained brain drain to Australia on a persistent salary gap[[2]]',
      ]},
      { num: 'The Demand', title: 'A broad base of sole operators', bullets: [
        '612,420 enterprises, 73% of them non-employing sole operators[[4]]',
        'A NZ$5.1B accounting services market, growing about 2.2% a year[[3]]',
        'Demand for advisory and compliance has stayed robust',
      ]},
      { num: 'The Response', title: 'Qualified capacity without local poaching', bullets: [
        'Global delivery brings scalable, qualified capacity without competing for scarce locals',
        'Judgement, sign-off, and client relationships stay in New Zealand',
        'Free senior time for the advisory work clients increasingly want',
      ]},
    ],
    sources: [
      { t: 'Chartered Accountants ANZ, on persistent accountant shortages (incl. Infometrics forecast).', url: 'https://www.charteredaccountantsanz.com/news-and-analysis/news/targeted-measures-needed-to-tackle-persistent-accountant-shortages' },
      { t: 'CA ANZ / Acuity, what members say about accounting talent shortages.', url: 'https://www.acuitymag.com/people/what-ca-anz-members-say-about-accounting-talent-shortages' },
      { t: 'IBISWorld, Accounting Services in New Zealand, market size and forecast.', url: 'https://www.ibisworld.com/new-zealand/industry/accounting-services/561' },
      { t: 'Stats NZ, New Zealand Business Demography Statistics, February 2024.', url: 'https://www.stats.govt.nz/information-releases/new-zealand-business-demography-statistics-at-february-2024/' },
    ],
  },
];

export const byCode = Object.fromEntries(REGIONS.map(r => [r.code, r]));
