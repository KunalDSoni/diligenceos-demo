/* Data for the AU deep-dive chapter "The Australian Business Opportunity".
   Every figure is sourced; [[n]] citation tokens map to SOURCES and are
   rendered as superscript links by the build. */

export const ADDRESSABLE = {
  stats: [
    { v: '2.73M', l: 'Actively trading businesses, June 2025[[1]]' },
    { v: '97.3%', l: 'Are small businesses[[1]]' },
    { v: '436,000', l: 'New businesses entering in a single year[[1]]' },
    { v: '+66,650', l: 'Net new businesses in a year, a 2.5% rise[[1]]' },
  ],
  services: [
    ['file-invoice', 'Bookkeeping'], ['users-gear', 'Payroll'], ['receipt', 'GST / BAS'],
    ['landmark', 'Tax Returns'], ['file-lines', 'Financial Statements'],
    ['water', 'Cash-Flow Management'], ['lightbulb', 'Business Advisory'],
  ],
};

export const INDUSTRIES = [
  {
    icon: 'helmet-safety', name: 'Construction', covers: 'Builders, contractors, electricians, plumbers, civil contractors',
    stats: [
      { v: '410,856', l: 'Businesses, the largest division[[3]]' },
      { v: '~$641B', l: 'Construction-division revenue[[3]]' },
      { v: '+0.1%', l: 'Business growth, 2024-25; houses +2.1% CAGR[[3]]' },
    ],
    meaning: 'Construction is the single largest division of the Australian economy by business count, and one of the most accounting-intensive. Project-based work, progress claims, retentions, and a deep web of subcontractors make every builder a high-frequency compliance client.',
    accounting: ['Job costing and WIP per project', 'Progress claims and retentions', 'Subcontractor and contractor (ABN) management', 'Plant and equipment depreciation'],
    compliance: ['BAS / GST, often large and quarterly', 'Taxable Payments Annual Report (TPAR)', 'PAYG withholding, payroll tax, super', 'Workers compensation'],
    advisory: ['Cash-flow across long project cycles', 'Tender and margin analysis', 'Asset and equipment finance', 'Structuring and succession'],
    workload: 'Very high. Multiple BAS, the annual TPAR, multi-site payroll, and job-cost reporting make construction one of the most support-intensive sectors a firm can serve.',
  },
  {
    icon: 'utensils', name: 'Hospitality', covers: 'Hotels, motels, restaurants, cafes, bars, franchises',
    stats: [
      { v: '55,000+', l: 'Cafes and restaurants[[4]]' },
      { v: '$65.5B', l: 'Cafe, restaurant & takeaway revenue, 2024[[4]]' },
      { v: '~5.8%', l: 'Cafe & bars market CAGR[[4]]' },
    ],
    meaning: 'Thin margins, high staff turnover, and a mix of cash and card sales make hospitality one of the most demanding sectors to keep accurate, and therefore one of the most reliant on ongoing accounting support. Payroll alone, under complex awards and penalty rates, is a continuous engagement.',
    accounting: ['Daily takings and POS reconciliation', 'Inventory and cost of goods sold', 'Wage costing and labour ratios', 'Tip and gratuity handling'],
    compliance: ['GST / BAS', 'Complex award payroll, penalty rates, casuals', 'Single Touch Payroll and super', 'Payroll tax, liquor licensing'],
    advisory: ['Menu and margin profitability', 'Labour-cost-to-revenue management', 'Seasonal cash-flow planning', 'Franchise reporting and site expansion'],
    workload: 'High and continuous. Weekly payroll, monthly reconciliations, and quarterly BAS mean hospitality clients need a firm in their numbers every single week.',
  },
  {
    icon: 'gas-pump', name: 'Fuel Stations', covers: 'Service stations, fuel retailers, convenience stores',
    stats: [
      { v: '$58.7B', l: 'Fuel-retailing revenue, 2024-25[[5]]' },
      { v: '1,800+', l: 'Ampol-branded sites alone[[5]]' },
      { v: '+4.4%', l: 'Annualised revenue growth to 2024-25[[5]]' },
    ],
    meaning: 'Service stations combine enormous turnover with razor-thin fuel margins and a second, higher-margin convenience-retail business under one roof. Dual inventories, fuel excise, and fuel tax credits make them one of the most technically complex small-business clients in the country.',
    accounting: ['Daily fuel and shop reconciliation', 'Wet and dry stock control, shrinkage', 'Fuel tax credit calculation', 'Multi-site consolidation'],
    compliance: ['GST / BAS, high volume', 'Fuel excise and fuel tax credits', 'Payroll / STP and super', 'Franchise and environmental reporting'],
    advisory: ['Fuel and shop margin management', 'Site-by-site profitability', 'Inventory controls and loss prevention', 'Structuring and valuation'],
    workload: 'Very high. High transaction volumes, constant inventory reconciliation, and recurring fuel tax credit claims generate a heavy, year-round accounting load.',
  },
  {
    icon: 'stethoscope', name: 'Healthcare', covers: 'Medical clinics, GP practices, dental, physiotherapy, NDIS providers, aged care',
    stats: [
      { v: '199,763', l: 'Businesses, up 7.7% in a year[[2]]' },
      { v: '$45.0B', l: 'NDIS-provider revenue alone, 2025-26[[6]]' },
      { v: '+7.7%', l: 'One of the fastest-growing divisions[[2]]' },
    ],
    meaning: 'Healthcare is among the fastest-growing divisions in the economy, and one of the most structurally complex. Service-trust arrangements, contractor doctors, payroll-tax exposure, and NDIS and aged-care reporting make these high-value clients who need a firm that understands the sector.',
    accounting: ['Service-trust and practice structures', 'Doctor and associate payments', 'NDIS and plan-managed billing', 'Payroll for clinical and admin staff'],
    compliance: ['GST on mixed taxable / GST-free health', 'Payroll tax (medical-centre rulings)', 'STP, super, and contractor rules', 'NDIS audits and aged-care reporting'],
    advisory: ['Practice structuring and payroll-tax planning', 'Associate and service agreements', 'Succession and practice sale', 'NDIS and clinic growth strategy'],
    workload: 'High and rising. Structuring-intensive set-up plus ongoing payroll and sector-specific reporting make healthcare a deep, durable, advisory-rich engagement.',
  },
  {
    icon: 'bag-shopping', name: 'Retail', covers: 'Grocery, fashion, automotive, e-commerce, electronics',
    stats: [
      { v: '156,938', l: 'Retail-trade businesses[[2]]' },
      { v: '$271.3B', l: 'Consumer-goods retailing revenue, 2025-26[[7]]' },
      { v: '$144.3B', l: 'Supermarkets and grocery alone, 2025[[7]]' },
    ],
    meaning: 'Retail is inventory-heavy and increasingly multi-channel, with stock sitting across stores, warehouses, and online platforms. Accurate stock valuation, margin tracking, and reconciliation across sales channels make retail a continuous accounting engagement.',
    accounting: ['Inventory accounting and stocktakes', 'Cost of goods sold and margins', 'Multi-channel sales reconciliation (POS + online)', 'Gift cards and returns'],
    compliance: ['GST / BAS', 'Payroll / STP and payroll tax', 'Import duties for importers', 'Superannuation'],
    advisory: ['Range and margin analysis', 'Inventory turnover and working capital', 'Seasonal cash-flow forecasting', 'E-commerce and channel expansion'],
    workload: 'High. Inventory, multi-channel reconciliation, BAS, and payroll combine into a steady monthly and quarterly workload.',
  },
  {
    icon: 'truck-fast', name: 'Transport & Logistics', covers: 'Trucking, courier services, warehousing, delivery businesses',
    stats: [
      { v: '237,506', l: 'Businesses, the fastest-growing division[[2]]' },
      { v: '+8.5%', l: 'Business growth in a single year[[2]]' },
      { v: '$76.9B', l: 'Road-freight revenue, 2025-26[[8]]' },
    ],
    meaning: 'Transport is the fastest-growing division by business count, swollen by owner-drivers, couriers, and last-mile delivery operators. Fleet assets, fuel, fuel tax credits, and per-job costing make it a sector that lives or dies on accurate numbers.',
    accounting: ['Fleet depreciation and finance', 'Fuel tax credit calculation', 'Per-vehicle and per-job cost tracking', 'Subcontractor and driver payments'],
    compliance: ['GST / BAS', 'Taxable Payments Annual Report (TPAR)', 'Fuel tax credits', 'Payroll / STP, heavy-vehicle compliance'],
    advisory: ['Cost-per-kilometre analysis', 'Fleet finance and replacement', 'Fuel-cost management', 'Route and job profitability'],
    workload: 'High. Fuel tax credits, the annual TPAR, asset finance, and contractor payments generate recurring, technical work every quarter.',
  },
  {
    icon: 'briefcase', name: 'Professional Services', covers: 'Accounting firms, law firms, marketing agencies, IT services, engineering firms',
    stats: [
      { v: '300,000+', l: 'Businesses, a top-three division[[9]]' },
      { v: 'High', l: 'Margin, time-billed, low inventory[[9]]' },
      { v: 'Sticky', l: 'Advisory-led, long-tenure clients' },
    ],
    meaning: 'Professional-services firms are, in accounting terms, close to ideal clients. They are high-margin, low-inventory, and time-billed; they understand the value of advice; and they stay for years. They are also the firms most likely to buy advisory, structuring, and CFO work.',
    accounting: ['Work-in-progress and time billing', 'Trust accounting (law firms)', 'Revenue recognition', 'Partner and profit distributions'],
    compliance: ['GST / BAS', 'Payroll / STP and payroll tax', 'Trust-account audits (law)', 'Division 7A and loan accounts'],
    advisory: ['Profit distribution and structuring', 'Partner remuneration models', 'Valuation, succession, and M&A', 'Cash-flow and growth planning'],
    workload: 'Moderate but high-value. Lower transaction volume than trade sectors, but these clients pay well for quality advisory and rarely leave, making them the most profitable per hour.',
  },
];

export const CADENCE = [
  { h: 'Monthly', items: ['Bookkeeping', 'Payroll', 'Management reporting'] },
  { h: 'Quarterly', items: ['BAS lodgement', 'GST compliance', 'PAYG instalments'] },
  { h: 'Annually', items: ['Tax returns', 'Financial statements', 'FBT and year-end'] },
  { h: 'Strategic, ongoing', items: ['Forecasting', 'Business advisory', 'Virtual CFO', 'Tax planning'] },
];

export const FORMATION = {
  stats: [
    { v: '436,000', l: 'New businesses entering in a year[[1]]' },
    { v: '~77%', l: 'Survive their first year[[10]]' },
    { v: '~52%', l: 'Still trading after four years[[10]]' },
    { v: '+66,650', l: 'Net growth in the business base in a year[[1]]' },
  ],
  states: [
    { l: 'Western Australia', v: '+4.3%', w: 100, note: '10,877 more businesses, the fastest growth[[1]]' },
    { l: 'Queensland', v: '+2.7%', w: 63, note: '13,579 more; top interstate destination[[1]]' },
    { l: 'National average', v: '+2.5%', w: 58, note: 'A record 436,000 entries[[1]]', muted: true },
    { l: 'New South Wales', v: '+20,040', w: 50, note: 'Largest absolute gain; 916,603 total businesses[[1]]' },
  ],
  note: 'Even with churn, the base grows every year. Brisbane alone now anchors a city economy worth more than $200 billion, and Queensland continues to attract more interstate businesses than any other state.[[11]] Each net new business is a new, recurring accounting annuity.',
};

export const SOURCES = [
  { t: 'Australian Bureau of Statistics, Counts of Australian Businesses, including Entries and Exits, July 2021 to June 2025.', url: 'https://www.abs.gov.au/statistics/economy/business-indicators/counts-australian-businesses-including-entries-and-exits/latest-release' },
  { t: 'Australian Bureau of Statistics, Counts of Australian Businesses, July 2020 to June 2024 (business counts by industry division).', url: 'https://www.abs.gov.au/statistics/economy/business-indicators/counts-australian-businesses-including-entries-and-exits/jul2020-jun2024' },
  { t: 'IBISWorld, Construction in Australia, number of businesses and industry analysis, 2025-26.', url: 'https://www.ibisworld.com/australia/industry/construction/306/' },
  { t: 'Statista, Australia cafes, restaurants and takeaway food services turnover; ABS Counts of Australian Businesses.', url: 'https://www.statista.com/statistics/653860/australia-cafes-restaurants-and-takeaway-food-services-turnover/' },
  { t: 'IBISWorld, Fuel Retailing in Australia, industry analysis, 2024-25.', url: 'https://www.ibisworld.com/australia/industry/fuel-retailing/438/' },
  { t: 'IBISWorld, National Disability Insurance Scheme Providers in Australia and related health-sector reports.', url: 'https://www.ibisworld.com/au/industry/national-disability-insurance-scheme-providers/1977/' },
  { t: 'IBISWorld, Consumer Goods Retailing in Australia, industry analysis, 2025-26.', url: 'https://www.ibisworld.com/australia/industry/consumer-goods-retailing/1720/' },
  { t: 'IBISWorld, Road Freight Transport in Australia, industry analysis, 2025-26.', url: 'https://www.ibisworld.com/australia/industry/road-freight-transport/456/' },
  { t: 'business.gov.au, Professional, scientific and technical services industry overview.', url: 'https://business.gov.au/planning/industry-information/professional-scientific-and-technical-services-industry' },
  { t: 'Australian Bureau of Statistics business-survival data, reported via Inside Small Business.', url: 'https://insidesmallbusiness.com.au/latest-news/almost-half-of-new-businesses-fail-within-their-first-four-years' },
  { t: 'Brisbane Economic Development Agency, 2025 State of the City report.', url: 'https://beda.brisbane.qld.au/news-and-events/2025-state-of-the-city-report-launch' },
];
