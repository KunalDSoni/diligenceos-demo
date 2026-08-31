# Measurable SEO & GEO Program — Design

**Date:** 2026-08-31
**Site:** https://dosacc.com (static HTML, Apache)
**Status:** Design — approved for planning

## 1. Goal and governing constraint

Grow organic reach to dosacc.com from search engines and generative answer engines.

**Governing constraint: do only work that is measurable.** This is a scope filter, not a
priority. If a proposed task has no instrument that can show whether it worked, it is not
in this program.

Two consequences follow, and they shape everything below:

1. **The measurement rig is the first deliverable**, not preparatory work. Until the
   instruments read, no other work is in scope, because no other work could be evaluated.
2. **Every change ships as an instrumented intervention**: stated hypothesis, baseline
   captured before the change, dated annotation at the change, re-measurement at a
   pre-declared checkpoint.

### Definition of reach

Reach decomposes into four multipliers. Every intervention in this program targets one:

```
reach = (queries you can appear for)
      x (how high you rank)
      x (how often people click)
      x (how many surfaces you appear on)
```

## 2. Scope filter

### In scope — has an instrument

| Work | Instrument | Metric | Readable after |
|---|---|---|---|
| Indexation | GSC > Page Indexing | indexed / submitted | 3-7 days |
| Structured data | GSC > Enhancements; Search Appearance filter | valid items 0->N; impressions attributable to rich results | 2-4 weeks |
| Titles / descriptions | GSC > Performance, page-level | CTR at held average position | ~4 weeks |
| New pages | GSC > Performance, page filter | impressions + average position for one declared target query | 6-12 weeks |
| Core Web Vitals | GSC > Core Web Vitals (CrUX field data) | LCP / INP / CLS at p75 | 28-day rolling |
| Local pack | Google Business Profile Insights | discovery searches, calls, direction requests | 2-4 weeks |
| AI crawling | Apache access logs | hits/week by AI user-agent | immediate |
| AI referrals | Plausible referrer segment | sessions from AI engine hosts | immediate |
| AI citations | fixed prompt panel, scheduled | % of N prompts citing dosacc.com | biweekly |
| Conversion | Plausible custom event | `/schedule/` booking starts | immediate |

### Out of scope — no instrument

- **Link building and digital PR.** Referring domains are countable, but no ranking change
  can be attributed to any individual link. Countable input, unmeasurable output.
- **Brand awareness and thought-leadership content.** No instrument.
- **Social signals and directory submissions**, except NAP citations, which are measurable
  through local pack performance.
- **Publish-and-hope content.** Content remains in scope, but only when a page ships with
  exactly one declared target query and a dated checkpoint. Each page is its own experiment.
- **Work on `noindex` pages.** The single exception is the decision to remove `noindex`
  from a page, which is itself measurable.

## 3. Current state (audited 2026-08-31)

### Already correct — do not redo

- Every page has a unique `<title>`, meta description, canonical, and OG/Twitter tags.
- Exactly one `<h1>` per page across all 29 HTML files.
- All 33 `<img>` elements carry `alt` text.
- `.htaccess` enforces https, non-www, and one canonical URL per page. Clean URLs verified
  live: `/leadership` returns 200.
- Security headers, gzip, and cache headers are configured.
- `robots.txt` is `User-agent: * / Allow: /` — every AI crawler is permitted. **Correct as
  is. Do not restrict.**
- `llms.txt` exists at the site root.
- `sitemap.xml` serves 19 URLs and returns 200.

### Gaps this program addresses

- **No measurement of any kind.** No Search Console verification, no analytics, no log
  analysis, on any page.
- **No structured data on the highest-value pages.** `/us/` and `/au/` are the two largest
  pages on the site at roughly 6,900 words each and carry zero JSON-LD. `events.html`
  (4,392 words, 25 photographs) has no `Event` schema. `leadership.html` (4,083 words, 8
  executive photographs) has no `Person` schema.
- **No `LocalBusiness` schema anywhere**, despite four stated offices.
- **NAP inconsistency**, which directly blocks local pack eligibility:
  - Three different US phone numbers in use: `+1 (708) 629-1744` (homepage, schedule,
    brochure, hospitality), plus `+1 (302) 231-1438` and `+1 (302) 231-1573` (both on
    `/us/` only).
  - The Australian number `+61 7 2115 0821` uses a Queensland area code, while the stated
    offices are Sydney NSW 2000 and Melbourne VIC 3000. NSW landlines are `+61 2`.
- **Render-blocking CSS.** Font Awesome 6.4.0 loads from cdnjs on every page for a small
  number of icons.
- **Query coverage is the binding constraint.** 19 indexable pages, of which two are
  non-commercial (one guide, one news index). `hreflang` exists on only three pages.
- **13,000 words behind `noindex, nofollow`** across ten `/opportunity/` pages. Most is
  deliberately gated investor and recruitment material.

### Confirmed office data

| Office | Locality | Postcode |
|---|---|---|
| US HQ | 919 North Market St, Suite 950, Wilmington, DE | 19801 |
| US | Schaumburg, IL | 60193 |
| AU | Sydney, NSW | 2000 |
| AU | Melbourne, VIC | 3000 |

Existing `Organization` JSON-LD on the homepage carries the Wilmington address,
`sales@dosacc.com`, `+1-708-629-1744`, and one `sameAs` (LinkedIn).

## 4. Phase 0 — Build the rig

No other phase begins until every component here reads.

### 4.1 Google Search Console
Verify `https://dosacc.com` as a **Domain property** (DNS TXT), so all subdomains and
protocols are covered by one property. Submit `sitemap.xml`. Requires registrar access.

### 4.2 Bing Webmaster Tools
Verify and submit the same sitemap. Bing is not filler in this program: ChatGPT's web
results have historically drawn on Bing's index, making Bing coverage one of very few GEO
levers with a free, first-party instrument attached.

### 4.3 Server log analysis — the GEO instrument
**JavaScript analytics cannot see AI crawlers.** GPTBot and OAI-SearchBot do not execute
JavaScript and will never appear in Plausible. Server logs are therefore the only possible
instrument for AI crawl behaviour.

A parsing script reads raw Apache access logs and reports weekly hits, unique URLs, and
status codes, broken down by user-agent, for at least:

`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`,
`PerplexityBot`, `Perplexity-User`, `Bingbot`, `Googlebot`, `Applebot`, `Amazonbot`,
`Meta-ExternalAgent`, `Bytespider`.

Output is a dated CSV committed to the repo, so the series survives log rotation.

### 4.4 Plausible — human behaviour and AI referrals
Covers the two rows server logs cannot: AI referral sessions and conversions. Chosen over
GA4 because it needs no cookie-consent banner and does not threshold low-volume data.

**This requires a CSP change.** The current policy is
`script-src 'self' 'unsafe-inline' https://s3.tradingview.com`, which will block the
script. `.htaccess` must add the Plausible host to `script-src` and `connect-src`.

Configure a referrer segment for `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`,
and `gemini.google.com`.

### 4.5 Conversion event
One Plausible custom event on the `/schedule/` booking interaction. This is the only
bottom-of-funnel number in the program; without it, every other metric is a proxy.

### 4.6 Prompt panel
A fixed, version-controlled list of 20 prompts a real prospect would ask, spanning both
audiences (SMB buyers and white-label partner firms) and both regions. Run biweekly
against ChatGPT, Perplexity, and Google AI Mode. Record for each: cited or not, and
position if cited. Committed as a dated CSV.

The panel is fixed at creation and must not be edited mid-programme; changing the prompts
invalidates the series.

## 5. Phase 1 — Baseline

Capture the before-number for every row in the section 2 table, on the same day, before
any Phase 2 change ships. **A baseline can only be captured once.** GSC backfills no data
prior to verification, so this phase gates all others.

Baselines are committed to the repo as dated CSVs alongside the log and prompt-panel output.

Note the reporting lag honestly: GSC needs 2-4 weeks to accumulate a stable series, and
CrUX is a 28-day rolling window. Phase 2 work proceeds during this period, but no Phase 2
result is read before its declared checkpoint.

## 6. Phase 2 — Instrumented interventions

Ordered by cleanliness of signal, not by size of expected effect. Each intervention
declares its hypothesis, instrument, metric, and checkpoint before it ships.

### 2a. Structured data
The cleanest signal available: GSC Enhancements moves from zero to a countable number
within days, and the Search Appearance filter isolates rich-result impressions from
background variation.

- `LocalBusiness` (as `AccountingService`) for each of the four offices
- `Person` with `sameAs` for the 8 leadership bios
- `Event` on `events.html`
- `Service` and `FAQPage` on `/us/` and `/au/`
- Consolidate `Organization` `sameAs` across all profiles

**Blocking sub-task:** resolve the NAP inconsistencies in section 3 first. Schema that
contradicts on-page NAP is worse than no schema, because it introduces conflicting entity
signals. Requires the correct canonical phone number per office from the business owner.

- *Hypothesis:* rich-result eligibility raises CTR at held position.
- *Metric:* valid enhancement items; impressions and CTR filtered by Search Appearance.
- *Checkpoint:* 4 weeks after validation passes.

### 2b. Core Web Vitals
Remove the render-blocking Font Awesome CDN stylesheet, replacing the icons actually in
use with inline SVG.

- *Hypothesis:* removing blocking CSS improves LCP at p75.
- *Metric:* GSC Core Web Vitals, LCP/INP/CLS at p75.
- *Checkpoint:* 28 days after deploy, once CrUX has fully rolled over.

### 2c. Page multiplication
Each new page ships with exactly one declared target query and is measured individually.

- Regional service matrix: 4 services x 2 regions = 8 pages
- City pages for the 4 offices = 4 pages
- Remove `noindex` from `/opportunity/au/business-landscape/` (2,485 words)

Target: 19 -> approximately 33 indexable pages.

- *Hypothesis:* a page targeting a query it currently has no page for will earn
  non-zero impressions for that query.
- *Metric:* per-page impressions and average position for the declared query.
- *Checkpoint:* 12 weeks per page (allowing for indexing plus ranking settle).

**This is the highest-risk item in the program. See section 8.**

### 2d. Google Business Profile
One profile per office, NAP-consistent with the schema from 2a.

- *Hypothesis:* a new surface produces incremental discovery independent of web results.
- *Metric:* GBP Insights — discovery searches, calls, direction requests.
- *Checkpoint:* 4 weeks after verification.

Local pack is a genuinely separate surface with its own instrument, so its attribution is
uncontaminated by any other intervention running concurrently.

## 7. Phase 3 — GEO, instrumented

- Expand `llms.txt` to cover the full service and regional surface.
- Add answer-shaped content blocks — direct, self-contained, quotable answers to the
  panel's 20 prompts, placed on the relevant existing pages.
- Keep `robots.txt` permissive to all AI crawlers.

Measured on three independent instruments: AI crawl deltas from server logs, AI referral
sessions from Plausible, and citation rate from the prompt panel.

- *Checkpoint:* 8 weeks, given citation behaviour changes more slowly than search ranking.

## 8. Risks

**Doorway pages (highest risk).** Four services across two regions, differing only in
"IRS" versus "ATO", is a doorway-page pattern and Google demotes it. Each regional variant
must carry genuine regional substance — Single Touch Payroll and BAS/GST for AU; W-2 and
941 filings for US; Xero's market dominance in Australia versus QuickBooks in the States —
and each city page must carry real local substance such as state nexus rules. Thin
regional clones would actively harm the site. Writing capacity is the constraint here, not
engineering: at the agreed pace of roughly two substantial pages per week, the 12-page
build in 2c is a six-week writing commitment.

**Attribution contamination.** Interventions running concurrently cannot be cleanly
separated in a single metric. Mitigated by choosing interventions with *disjoint*
instruments wherever possible: 2a reads Search Appearance, 2b reads CrUX, 2d reads GBP
Insights. Only 2c shares an instrument with 2a, so 2c pages are measured individually by
declared query rather than in aggregate.

**Log access.** If raw Apache logs prove unreachable, AI crawl measurement is impossible
and Phase 3 loses one of its three instruments. See section 9.

**Small-numbers noise.** At low traffic volumes, week-to-week variation can exceed
intervention effects. Mitigated by the long checkpoints declared above; no result is read
early.

## 9. Dependencies requiring the site owner

These cannot be resolved from the codebase and block the phases named.

1. **DNS/registrar access** for GSC Domain property verification. *Blocks Phase 0.*
2. **Raw Apache access log access**, via cPanel or SSH. *Blocks 4.3 and part of Phase 3.*
   Fallback if unavailable: Phase 3 proceeds on referrals and prompt panel alone, with AI
   crawl measurement documented as out of scope.
3. **Plausible account.** *Blocks 4.4, 4.5.*
4. **Canonical phone number per office**, resolving the three US numbers and the Sydney
   area-code conflict in section 3. *Blocks 2a and 2d.*
5. **Google Business Profile ownership/verification** per office, including postcard or
   equivalent verification. *Blocks 2d.*

## 10. Success criteria

The program succeeds if, at 12 weeks past baseline:

1. Every row of the section 2 table has a baseline value and a current value.
2. Indexed page count has risen from 19 toward 33, with each new page's indexation status
   individually known.
3. Rich-result impressions are non-zero, having started at zero.
4. AI crawl volume and AI referral sessions have a trend line, in either direction.
5. Prompt panel citation rate has at least two data points.

Note criterion 4 and 5 deliberately do not specify a direction. The program's contract is
that every intervention is *evaluable*, not that every intervention succeeds. An
intervention measured and found ineffective is a successful outcome of this design; an
intervention that cannot be evaluated is a failure of it.
