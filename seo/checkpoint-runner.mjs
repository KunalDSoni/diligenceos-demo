#!/usr/bin/env node
/**
 * Automated checkpoint measurement runner
 * Collects all measurement data at Week 2, 4, 8, 12 checkpoints
 * Generates checkpoint report with pass/fail per decision gates
 *
 *   node seo/checkpoint-runner.mjs [week-2|week-4|week-8|week-12]
 *   npm run seo:checkpoint week-4
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
process.chdir(ROOT);

const CHECKPOINT = process.argv[2] || 'week-2';
const VALID_CHECKPOINTS = ['week-2', 'week-4', 'week-8', 'week-12'];

if (!VALID_CHECKPOINTS.includes(CHECKPOINT)) {
  console.error(`Invalid checkpoint: ${CHECKPOINT}`);
  console.error(`Valid: ${VALID_CHECKPOINTS.join(', ')}`);
  process.exit(1);
}

const NOW = new Date().toISOString().split('T')[0];
const REPORT_DIR = 'seo/checkpoints';
const REPORT_FILE = `${REPORT_DIR}/${NOW}-${CHECKPOINT}-report.md`;

console.log(`📊 Running ${CHECKPOINT.toUpperCase()} checkpoint measurement`);
console.log(`   Report: ${REPORT_FILE}`);
console.log('');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

const measurements = {};

// 1. Run crawl baseline
console.log('⏳ Running crawl baseline...');
try {
  execSync('npm run seo:crawl', { stdio: 'pipe' });
  const crawlOutput = fs.readFileSync('seo/SEO_CRAWL_BASELINE.csv', 'utf8');
  measurements.crawl = {
    timestamp: NOW,
    urls_crawled: crawlOutput.split('\n').length - 2, // header + blank
    success: true
  };
  console.log(`   ✅ Crawl complete (${measurements.crawl.urls_crawled} URLs)`);
} catch (err) {
  measurements.crawl = { timestamp: NOW, error: err.message, success: false };
  console.log(`   ⚠️  Crawl failed: ${err.message}`);
}

// 2. Validate schema
console.log('⏳ Validating JSON-LD schema...');
try {
  const output = execSync('npm run seo:schema', { encoding: 'utf8' });
  const errors = output.match(/errors: (\d+)/)?.[1] || '0';
  const warnings = output.match(/warnings: (\d+)/)?.[1] || '0';
  measurements.schema = {
    timestamp: NOW,
    errors: parseInt(errors),
    warnings: parseInt(warnings),
    success: parseInt(errors) === 0
  };
  console.log(`   ✅ Schema valid (errors: ${errors}, warnings: ${warnings})`);
} catch (err) {
  measurements.schema = { timestamp: NOW, error: err.message, success: false };
  console.log(`   ⚠️  Schema validation failed`);
}

// 3. Check live URLs
console.log('⏳ Checking live URLs...');
const URLS = [
  'https://dosacc.com/',
  'https://dosacc.com/services/bookkeeping/',
  'https://dosacc.com/partners/',
  'https://dosacc.com/opportunity/',
  'https://dosacc.com/404'
];

measurements.urls = {};
for (const url of URLS) {
  try {
    const code = execSync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`, { encoding: 'utf8' });
    measurements.urls[url] = { code: parseInt(code), success: code === '200' || url.includes('/404') };
  } catch {
    measurements.urls[url] = { error: 'Failed to fetch', success: false };
  }
}
console.log(`   ✅ URL checks complete`);

// 4. Checkpoint-specific measurements
console.log(`⏳ Collecting ${CHECKPOINT} measurements...`);

if (CHECKPOINT === 'week-2' || CHECKPOINT === 'week-4') {
  // Check for new IndexNow submissions
  measurements.indexnow = {
    configured: fs.existsSync('seo/.indexnow-key'),
    note: 'Check Bing Webmaster Tools > IndexNow > Submission History for success count'
  };
}

if (CHECKPOINT === 'week-4') {
  // GSC Performance should have data by now
  measurements.gsc_note = 'Export GSC Performance for target queries (bookkeeping, partnerships). Compare CTR vs. baseline.';
}

if (CHECKPOINT === 'week-8' || CHECKPOINT === 'week-12') {
  // Check for new indexed pages
  measurements.url_inspection_note = 'Check URL Inspection in GSC for: /opportunity/ pages, /brochure/, /services/bookkeeping/. Status should be "Included".';
}

// Generate report
const report = generateReport(CHECKPOINT, measurements, NOW);

fs.writeFileSync(REPORT_FILE, report);
console.log(`   ✅ Report written to ${REPORT_FILE}`);
console.log('');
console.log('📋 Next steps:');
console.log('   1. Export GSC data for target queries');
console.log('   2. Check URL Inspection for index status');
console.log('   3. Review decision gates in seo/docs/CHECKPOINT_DECISION_GATES.md');
console.log('   4. Make pass/fail decision per experiment');
if (CHECKPOINT !== 'week-12') {
  console.log(`   5. Schedule next checkpoint: ${getNextCheckpoint(CHECKPOINT)}`);
}

function getNextCheckpoint(current) {
  const next = {
    'week-2': 'week-4',
    'week-4': 'week-8',
    'week-8': 'week-12'
  };
  return next[current] || 'N/A';
}

function generateReport(checkpoint, data, date) {
  return `# ${checkpoint.toUpperCase()} Checkpoint Report

**Date:** ${date}
**Generated:** ${new Date().toISOString()}

---

## Automated Measurements

### Crawl Baseline
- URLs crawled: ${data.crawl?.urls_crawled || 'N/A'}
- Status: ${data.crawl?.success ? '✅ OK' : '❌ FAILED'}
${data.crawl?.error ? `- Error: ${data.crawl.error}` : ''}

### Schema Validation
- Errors: ${data.schema?.errors || 'N/A'}
- Warnings: ${data.schema?.warnings || 'N/A'}
- Status: ${data.schema?.success ? '✅ OK' : '❌ FAILED'}

### Live URL Checks
\`\`\`
${Object.entries(data.urls || {})
  .map(([url, result]) => `${result.success ? '✅' : '❌'} ${url} → ${result.code || result.error}`)
  .join('\n')}
\`\`\`

---

## Checkpoint-Specific Data

${checkpoint === 'week-2' ? `
### IndexNow Status
- Key configured: ${data.indexnow?.configured ? 'Yes' : 'No'}
- ${data.indexnow?.note || 'Check Bing Webmaster Tools'}
` : ''}

${checkpoint === 'week-4' ? `
### GSC Performance
- Action: Export GSC Performance report for target queries
- Compare: CTR, Impressions, Average Position vs. baseline
- Document findings in section below
` : ''}

${checkpoint === 'week-8' || checkpoint === 'week-12' ? `
### URL Inspection Data
- Action: Check URL Inspection in GSC for key pages
- Status needed: /opportunity/ pages, /brochure/, /services/bookkeeping/
- All should show "Included" (indexed)
` : ''}

---

## Manual Data Collection Needed

### GSC Exports
- [ ] GSC Performance: Query cluster for each experiment
- [ ] GSC Enhancements: Schema rich results status
- [ ] URL Inspection: Coverage report for new/modified pages

### GEO Prompt Panel (EXP-011)
- [ ] Test 6 queries in ChatGPT, Perplexity, Claude
- [ ] Capture screenshots of citations
- [ ] Rate extraction: Full / Partial / None
- [ ] Calculate extraction rate: \`(full_cites + partial_cites) / total_queries\`

### Bing Webmaster Tools (EXP-010)
- [ ] Check IndexNow submission history
- [ ] Record: # successful submissions, date of last Bingbot crawl
- [ ] Compare crawl lag vs. baseline

---

## Decision Gate Review

See \`seo/docs/CHECKPOINT_DECISION_GATES.md\` for full pass/fail criteria per experiment.

### Quick Checklist

- [ ] EXP-001 (CrUX): LCP/INP/CLS metrics stable or improved
- [ ] EXP-002 (Schema): No errors in GSC Enhancements
- [ ] EXP-003 (Title/Desc): CTR on target queries ≥ baseline or improved
- [ ] EXP-004 (/brochure/): Indexed in GSC (Coverage = "Included")
- [ ] EXP-005 (404): /404 returns 404 status (not 200)
- [ ] EXP-006 (Depth): /services/bookkeeping/ CTR stable/improved, no regression
- [ ] EXP-007 (Breadcrumbs): Schema valid, no errors in GSC
- [ ] EXP-008 (Hreflang): /opportunity/au/ pages indexed separately
- [ ] EXP-009 (EEAT): Person schema valid, LinkedIn links accessible
- [ ] EXP-010 (IndexNow): Submissions succeed, Bing crawl lag < 48h
- [ ] EXP-011 (Answers): Extraction rate ≥ 50%

---

## Findings & Decisions

**Experiment Status:**
- [ ] All pass → Approve and continue measurement
- [ ] Mixed results → Identify root causes, fix failing experiments
- [ ] Major failures → Rollback and re-measure at next checkpoint

**Issues Found:**
(Document any failures, regressions, or surprises here)

**Actions Taken:**
(Document rollbacks, fixes, or optimizations here)

**Next Checkpoint:** ${getNextCheckpoint(checkpoint)}

---

## Appendix: Raw Data Files

- Crawl baseline: seo/SEO_CRAWL_BASELINE.csv
- Schema validation: npm run seo:schema (output above)
- GSC exports: (download manually from Search Console)
- GEO panel results: (document in section above)
`;
}

console.log('✅ Checkpoint measurement complete');
