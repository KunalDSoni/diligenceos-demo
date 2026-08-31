# Measurable SEO & GEO Program — Design (v2)

**Date:** 2026-08-31
**Site:** https://dosacc.com (static HTML, Apache)
**Status:** Design — revised after review

## 1. Goal and governing principle

Grow qualified organic acquisition for dosacc.com from search engines and generative
answer engines.

**Governing principle:**

> Never optimize a metric merely because it is measurable. Optimize metrics that are
> causally connected to search reach or qualified customer acquisition.

Measurability is a necessary condition for work entering this program, not a sufficient
one. A metric must also sit on a plausible causal path to acquisition. This rules out
celebrating results like "structured-data items went 0 → 18" as an outcome; that is an
*input*, and the program must always be able to name the acquisition metric it feeds.

Two operational consequences:

1. **The measurement rig and an immutable baseline are the first deliverables.** Until the
   instruments read and the prior state is captured, no other work is in scope, because no
   other work could be evaluated or reverted.
2. **Every change ships as an instrumented experiment**: stated hypothesis, baseline
   captured before, dated changelog entry at deploy, re-measurement at a pre-declared
   checkpoint, and an explicit decision at that checkpoint.

## 2. Metric hierarchy

Metrics are ranked. Lower tiers exist to diagnose the tier above, never to be optimized in
their own right.

### Tier 1 — Business outcome (the only true success measure)

| Metric | Instrument | Note |
|---|---|---|
| **Organic qualified leads** | CRM, joined to Plausible source | Primary KPI once CRM join exists. See section 11 dep. 6. |
| `/schedule/` booking completions | Plausible custom event | Interim primary KPI until the CRM join exists. |

### Tier 2 — Acquisition proxy (the headline SEO number)

| Metric | Instrument | Note |
|---|---|---|
| **Non-brand organic clicks** | GSC Performance, query filter excluding brand terms | **The primary SEO KPI.** |
| Non-brand ÷ total organic clicks | GSC Performance | Guards against brand traffic masking acquisition failure. |

Brand terms to exclude, confirmed present in site copy: `diligenceos`, `diligence os`,
`dosacc`, `DOSACC`. Brand and non-brand series are reported separately and never summed
into a single "organic traffic" figure.

Rationale: total organic clicks can rise entirely on brand searches from existing
awareness while acquisition from search is flat or falling. Non-brand clicks is the number
that cannot be inflated that way.

### Tier 3 — Diagnostic

Per-page impressions, average position, CTR, indexation state, Google-selected canonical,
Core Web Vitals, SERP feature presence, AI crawl volume, AI referral sessions, AI citation
rate, competitor benchmark variables.

These explain *why* Tier 2 moved. They are never reported as achievements on their own.

## 3. Scope filter

### In scope

Work is in scope only if it has (a) a named instrument and (b) a stated causal path to a
Tier 1 or Tier 2 metric.

### Out of scope

- **Link building and digital PR.** Referring domains are countable, but no ranking change
  is attributable to any individual link. Countable input, unmeasurable output.
- **Brand awareness and thought-leadership content.** No instrument.
- **Social signals and directory submissions**, except NAP citations, which are measurable
  through local pack performance.
- **Publish-and-hope content.** Content is in scope only under the page gate in section 7.
- **Work on `noindex` pages**, except the decision to remove `noindex`, which is itself
  measurable.
- **Vendor authority proxies** (DA, DR, "SEO score"). These are third-party inventions, not
  Google signals, and satisfy neither test.
- **Additional `FAQPage` markup.** See section 6.3.

## 4. Current state (audited 2026-08-31)

### Already correct — do not redo

- Unique `<title>`, meta description, canonical, and OG/Twitter tags on every page.
- Exactly one `<h1>` per page across all 29 HTML files.
- All 33 `<img>` elements carry `alt` text.
- `.htaccess` enforces https, non-www, and one canonical URL per page. Verified live:
  `/leadership` returns 200.
- Security headers, gzip, cache headers configured.
- `robots.txt` is `User-agent: * / Allow: /` — every AI crawler permitted. **Correct as is.
  Do not restrict.**
- `sitemap.xml` serves 19 URLs, returns 200.
- Internal navigation is functional: `/partners/` is linked from 8 pages,
  `/hospitality-accounting/` from 6, and each service page carries 6 internal outbound
  links.

### Gaps this program addresses

- **No measurement of any kind.** No Search Console verification, no analytics, no log
  analysis, on any page.
- **No structured data on the highest-value pages.** `/us/` and `/au/` are the two largest
  pages at roughly 6,900 words each and carry zero JSON-LD. `events.html` (4,392 words, 25
  photographs) has no `Event` schema. `leadership.html` (4,083 words, 8 executive
  photographs) has no `Person` schema. No `BreadcrumbList` on several deep pages.
- **No `LocalBusiness` schema anywhere**, despite four stated offices.
- **NAP inconsistency**, which directly blocks local pack eligibility:
  - Three different US phone numbers: `+1 (708) 629-1744` (homepage, schedule, brochure,
    hospitality), plus `+1 (302) 231-1438` and `+1 (302) 231-1573` (both on `/us/` only).
  - `+61 7 2115 0821` uses a Queensland area code, while the stated offices are Sydney NSW
    2000 and Melbourne VIC 3000. NSW landlines are `+61 2`.
- **Internal linking is boilerplate, not contextual.** Links are concentrated in nav and
  footer (e.g. `us/index.html:2562` is inside the footer opening at line 2527) plus a
  related-services block. There is little in-prose topical linking, which is what carries
  topical signal between related pages.
- **Render-blocking CSS.** Font Awesome 6.4.0 loads from cdnjs on every page for a small
  number of icons.
- **Query coverage is the binding constraint.** 19 indexable pages, two of them
  non-commercial. `hreflang` on only three pages.
- **13,000 words behind `noindex, nofollow`** across ten `/opportunity/` pages, mostly
  deliberate investor and recruitment material.

### Confirmed office data

| Office | Locality | Postcode |
|---|---|---|
| US HQ | 919 North Market St, Suite 950, Wilmington, DE | 19801 |
| US | Schaumburg, IL | 60193 |
| AU | Sydney, NSW | 2000 |
| AU | Melbourne, VIC | 3000 |

Existing homepage `Organization` JSON-LD carries the Wilmington address,
`sales@dosacc.com`, `+1-708-629-1744`, and one `sameAs` (LinkedIn).

## 5. P0 — Safety, baseline integrity, and instrumentation

No other phase begins until every item here is complete. Baselines can be captured exactly
once; GSC backfills nothing prior to verification.

### 5.1 Immutable crawl baseline

A crawler produces `seo/SEO_CRAWL_BASELINE.csv` with one row per URL:

`URL, Status, Indexable, Robots, Canonical, Google_Selected_Canonical, Title,
Title_Length, Meta_Description, Meta_Description_Length, H1, H1_Count, Word_Count,
Internal_Inlinks, Internal_Outlinks, Outbound_Links, Images, Images_Missing_Alt,
Schema_Types, Response_Time_ms, Redirect_Target`

Captured alongside it, in `seo/baseline/`:

- verbatim copies of `robots.txt`, `sitemap.xml`, `.htaccess`
- the full sitemap URL list
- Core Web Vitals field data where CrUX has coverage
- **the git commit hash of the source tree at capture time**

The commit hash is what makes the baseline immutable and diffable: any later regression can
be traced to an exact source state.

The same crawler is re-run **unchanged** after every release. Changing the crawler
invalidates comparability; if it must change, the baseline is re-captured and the series
restarted with a note in the changelog.

`Google_Selected_Canonical` is populated from URL Inspection (5.6), not from the page, so
the column exists from the first run even though it fills in later.

### 5.2 Google Search Console
Verify `https://dosacc.com` as a **Domain property** (DNS TXT) so all subdomains and
protocols fall under one property. Submit `sitemap.xml`. Requires registrar access.

### 5.3 Bing Webmaster Tools
Verify and submit the same sitemap. Bing is a genuine GEO instrument here: ChatGPT's web
results have historically drawn on Bing's index, making Bing coverage one of very few GEO
levers with a free first-party instrument.

### 5.4 Server log analysis — the AI crawl instrument

**JavaScript analytics cannot see AI crawlers.** GPTBot and OAI-SearchBot do not execute
JavaScript and will never appear in Plausible. Server logs are the only possible instrument
for AI crawl behaviour.

A parser reads raw Apache access logs into `seo/AI_CRAWL_LOG.csv`, reporting weekly hits,
unique URLs, and status codes per user-agent, for at least:

`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`,
`PerplexityBot`, `Perplexity-User`, `Bingbot`, `Googlebot`, `Applebot`, `Amazonbot`,
`Meta-ExternalAgent`, `Bytespider`.

Output is committed dated, so the series survives log rotation.

### 5.5 Plausible — human behaviour, AI referrals, conversion
Covers the rows server logs cannot. Chosen over GA4: no cookie-consent banner required and
no low-volume data thresholding.

**Requires a CSP change.** Current policy is
`script-src 'self' 'unsafe-inline' https://s3.tradingview.com`, which will block the
script. `.htaccess` must add the Plausible host to `script-src` and `connect-src`.

Configure: referrer segment for `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`,
`gemini.google.com`; and one custom event on the `/schedule/` booking interaction.

### 5.6 GSC URL Inspection protocol

Aggregate indexation is insufficient for individual new pages. Every page created or
materially changed by this program passes through a recorded per-URL sequence:

```
URL discovered
  -> crawl requested
  -> indexed? (yes/no)
  -> Google-selected canonical == declared canonical?
  -> impressions
  -> clicks
  -> average position
```

Recorded in `seo/URL_INSPECTION.csv`, dated, one row per URL per check.

The canonical comparison is the highest-value column: a Google-selected canonical differing
from the declared one is the earliest detectable signal of duplication or cannibalization,
and it appears well before ranking data does.

### 5.7 Prompt panel — 30 prompts

Fixed, version-controlled in `seo/PROMPT_PANEL.csv`:

| Segment | Count | Example |
|---|---|---|
| SMB buyer | 10 | "Best outsourced accounting services for a small business" |
| CPA firm | 10 | "Best white-label bookkeeping partner for CPA firms" |
| Problem | 5 | "How do I fix a bookkeeping backlog?" |
| Regional | 5 | "Outsourced accounting services in the US" |

Run biweekly against ChatGPT, Perplexity, and Google AI Mode. Results appended to
`seo/PROMPT_RESULTS.csv`:

`Date, Engine, Prompt_ID, Mentioned, Cited, Citation_URL, Position, Competitors_Mentioned,
Answer_Type`

`Mentioned` and `Cited` are separate columns deliberately: being named without a link and
being linked are different outcomes with different value.

**The panel is frozen at creation.** Editing prompts mid-program invalidates the
longitudinal series.

### 5.8 Competitor benchmark set

The competitor set is **derived, not guessed**: at the end of P0, take the fixed query set
from the query map (section 6.4) plus the prompt panel, observe which domains recur in SERPs
and AI answers, and freeze the top 5–10 as the benchmark set in `seo/COMPETITORS.csv`.

Measured monthly, same fixed variables every time, into `seo/COMPETITOR_BENCHMARK.csv`:
indexed commercial page count, presence for each query in the fixed set, page titles,
content coverage against our topic list, structured data types, Core Web Vitals where CrUX
has coverage, and AI prompt citation count.

No composite "SEO strength" score is computed. Composite scores hide which variable moved.

### 5.9 SEO changelog

`seo/SEO_CHANGELOG.md`. Every production change affecting search gets an entry:

```
## 2026-09-05 — EXP-001 — TECH
Change:        Homepage title and H1 revised
Hypothesis:    Clearer intent match raises CTR at held position
Instrument:    GSC Performance, page-filtered
Baseline:      CTR 1.8%, avg position 14.2 (28d pre-change)
Commit:        <sha>
URLs:          /
Checkpoint:    2026-10-03 (4 weeks)
Decision:      <filled at checkpoint>
```

This is what converts the program from a set of changes into a history of
change -> hypothesis -> outcome.

## 6. P1 — Technical corrections

### 6.1 NAP correction (blocks 6.3 and P3 local work)
Resolve to one canonical phone number per office and one canonical address format, applied
site-wide. Schema contradicting on-page NAP is worse than no schema — it produces
conflicting entity signals. Requires the correct numbers from the business owner
(section 11, dep. 4).

### 6.2 Core Web Vitals
Remove the render-blocking Font Awesome CDN stylesheet; inline the icons actually used
as SVG.

- *Type:* TECH · *Instrument:* GSC Core Web Vitals (CrUX field data)
- *Metric:* LCP / INP / CLS at p75 · *Checkpoint:* 28 days after deploy (full CrUX rollover)
- *Causal path:* CWV is a confirmed ranking input and affects bounce on mobile → position →
  non-brand clicks.

### 6.3 Structured data, prioritized

**Structured data is not a ranking strategy.** The controllable objective is *eligibility*;
appearance is Google's decision and is observed, not targeted. See section 12.

**First — entity foundation**
- `Organization` — consolidate and extend `sameAs` across all verified profiles
- `BreadcrumbList` — on all deep pages currently missing it
- `LocalBusiness` / `AccountingService` — one per office, after 6.1

**Second — supporting entities**
- `Person` with `sameAs` for the 8 leadership bios
- `Event` on `events.html`

**Conditional — implement only where a rich result is actually attainable**
- `Service` on `/us/` and `/au/`

**Explicitly cut: additional `FAQPage` markup.** Google restricted FAQ rich results to
well-known authoritative government and health sites in 2023. The site already carries
`FAQPage` on 6 indexable pages (homepage, `/partners/`, and all 4 service pages), which are
therefore almost certainly generating zero rich results today. Adding more would create an
input that is structurally guaranteed to read zero — a direct violation of section 1.
*Verify current Google documentation at implementation time before acting on this.*

- *Type:* TECH · *Instrument:* GSC Enhancements (validation) + Search Appearance (observed)
- *Metric:* valid items by type; separately, Search Appearance performance
- *Checkpoint:* 4 weeks after validation passes

### 6.4 Query map and cannibalization control

`seo/SEO_QUERY_MAP.csv` assigns **exactly one primary intent to exactly one URL**:

`Primary_Intent, Primary_URL, Query_Cluster, Status, Notes`

Using live site URLs. Illustrative rows:

| Primary intent | Primary URL |
|---|---|
| outsourced bookkeeping | `/services/bookkeeping/` |
| outsourced payroll | `/services/payroll/` |
| hospitality accounting | `/hospitality-accounting/` |
| white-label bookkeeping for CPA firms | `/partners/` |

**Measurement unit is the query cluster, not a single keyword.** Google ranks on topics and
entities; a page earns impressions across many phrasings. Measuring one exact string
understates performance and produces false negatives. So each page declares:

- **one primary intent** — for ownership and cannibalization control
- **a query cluster** — for measurement

Example cluster for `outsourced accounting services`: *outsourced accounting company,
accounting outsourcing services, outsourced finance services, outsourced accounting firm.*

**Cannibalization monitoring** runs monthly once page count exceeds 25. Two triggers:

1. Two URLs both ranking for another URL's declared primary intent in GSC.
2. Google-selected canonical differing from declared canonical in URL Inspection (5.6).

Either trigger opens an investigation with outcomes: consolidate, differentiate intent,
301, or `noindex`.

### 6.5 Contextual internal linking
Add in-prose topical links between related pages, distinct from the existing nav/footer
boilerplate, following the query map's cluster relationships.

- *Type:* TECH · *Instrument:* `Internal_Inlinks` column in the crawl dataset; GSC position
  for receiving pages · *Checkpoint:* 8 weeks

## 7. P2 — Commercial pages

Highest commercial intent first. Each page is one CONTENT experiment.

Candidate set, in priority order:

1. Outsourced accounting services (primary commercial term)
2. Accounting outsourcing for CPA firms
3. White-label bookkeeping
4. Problem pages (e.g. bookkeeping backlog / catch-up bookkeeping)

### The page gate

**Page count is an output of this gate, not a target.** Every candidate must pass all four
tests before it is built:

1. **Declared intent** — one primary search intent not already owned by an existing URL in
   the query map.
2. **Demonstrated opportunity** — evidence of real query demand from GSC data or SERP
   observation, not assumption.
3. **Genuine uniqueness** — substantive content that could not simply be a section of an
   existing page.
4. **Business value** — maps to a service actually sold, and to a Tier 1 metric.

If 4 of 4 candidates pass, build 4. **If only 2 pass, build 2.** A page that fails the gate
is not built, and that is a successful outcome of the gate.

- *Type:* CONTENT · *Instrument:* URL Inspection then GSC Performance, per page, measured
  on the declared query cluster · *Checkpoint:* 12 weeks per page

## 8. P3 — Industry, regional, and tools

Only after P2 pages have reached their checkpoints and been evaluated.

Candidates: industry pages, regional service variants, city pages for the four offices,
calculators, case studies. Same page gate as section 7 applies.

**Highest risk in the program.** Four services across two regions, differing only in "IRS"
versus "ATO", is a doorway-page pattern and Google demotes it. Each regional variant needs
genuine regional substance — Single Touch Payroll and BAS/GST for AU; W-2 and 941 filings
for US; Xero's market position in Australia versus QuickBooks in the States — and each city
page needs real local substance such as state nexus rules. **Thin regional clones would
actively harm the site.** The gate in section 7 is the control; expect candidates to fail
it, and build only those that pass.

Google Business Profile work sits here, one profile per office, NAP-consistent with 6.3.

- *Type:* CONTENT (pages) / TECH (GBP) · *Instrument:* GSC per page; GBP Insights
  (discovery searches, calls, direction requests) · *Checkpoint:* 12 weeks / 4 weeks

## 9. P4 — GEO

- Answer-shaped content blocks: direct, self-contained, quotable answers to the 30 panel
  prompts, placed on the relevant existing pages.
- Strengthen entity information (feeds from 6.3 `Organization` / `sameAs`).
- Keep `robots.txt` permissive to all AI crawlers.

**`llms.txt` is classified optional / experimental — not a core deliverable.** There is
no confirmed evidence that major AI engines use it as a retrieval or ranking input. It
already exists, costs nothing to maintain, and may be kept — but no measurable GEO
improvement should be expected from it and no checkpoint is defined for it.

Measured on three independent instruments: AI crawl deltas (5.4), AI referral sessions
(5.5), citation rate (5.7).

- *Type:* CONTENT · *Checkpoint:* 8 weeks — citation behaviour moves more slowly than
  search ranking.

### SERP and answer-surface feature tracking

Tracked explicitly, with instrument assignment:

| Feature | Instrument |
|---|---|
| Rich results, sitelinks, videos | GSC Search Appearance |
| Local pack | GBP Insights |
| Image results | GSC Performance, Image search type |
| Featured snippets | Manual SERP check against fixed query set |
| **AI Overviews / AI Mode** | **Prompt panel only** |

**AI Overview impressions are not separable in GSC** — they are folded into ordinary
web-result rows in Search Appearance. Assigning them to GSC would create an unmeasurable
row, so they are tracked through the manual panel instead.

## 10. P5 — Continuous experiments and the experiment protocol

### Experiment types

Every experiment is typed, for attribution cleanliness:

- **TECH** — schema, CWV, metadata, internal links, canonicals, crawlability
- **CONTENT** — new page, rewritten page, answer block, calculator, case study

TECH and CONTENT experiments are never run simultaneously on the same URL.

### Concurrency limit

**Maximum 2 major experiments running simultaneously, and they must use disjoint
instruments.**

Permitted example: Experiment A = schema (reads GSC Enhancements) alongside Experiment B =
CWV (reads CrUX). Different instruments, separable results.

Prohibited: simultaneously rewriting the homepage, launching 14 pages, restructuring
internal links, changing titles, and changing schema — then asking whether SEO improved.
That question would be unanswerable, which makes the whole sequence out of scope under
section 1.

**This constraint sets the program's pace.** With 4–12 week checkpoints and at most two
concurrent experiments, this is a multi-quarter program. Attempting to compress it means
abandoning attribution, which means abandoning the governing principle.

### Kill criteria — the checkpoint decision tree

At each page's checkpoint, exactly one decision is recorded in the changelog:

| Observation | Decision |
|---|---|
| Not indexed | Diagnose: crawlability, canonical conflict, quality signal |
| Indexed, impressions = 0 | Investigate query/page mismatch; the intent may not exist as searched |
| Impressions > 0, poor position | Improve content depth and contextual internal links |
| Impressions healthy, CTR materially below comparable pages | Test title and meta description |
| Ranking for another URL's primary intent | Cannibalization — consolidate, differentiate, or 301 |
| No measurable opportunity after remediation | 301, `noindex`, or merge |

A page that is retired at its checkpoint is a successful application of this protocol, not
a failure of the program.

## 11. Dependencies requiring the site owner

1. **DNS/registrar access** for GSC Domain property verification. *Blocks P0.*
2. **Raw Apache access log access** (cPanel or SSH). *Blocks 5.4 and one third of P4.*
   Fallback: P4 proceeds on referrals and prompt panel alone, with AI crawl measurement
   documented as out of scope rather than silently dropped.
3. **Plausible account.** *Blocks 5.5.*
4. **Canonical phone number per office**, resolving the three US numbers and the Sydney
   area-code conflict in section 4. *Blocks 6.1, 6.3, and GBP in P3.*
5. **Google Business Profile ownership/verification** per office. *Blocks P3 local work.*
6. **CRM access, or confirmation that no CRM exists.** Determines whether Tier 1 is
   organic qualified leads or remains `/schedule/` completions. *Affects section 2 only;
   blocks nothing.*

## 12. Success criteria

Judged at **two checkpoints**, not one, because serialized experiments cannot resolve
inside a quarter.

### At 12 weeks past baseline — process integrity

1. Every metric in section 2 has a baseline value and a current value.
2. `SEO_CRAWL_BASELINE.csv`, `SEO_QUERY_MAP.csv`, `SEO_CHANGELOG.md`, `AI_CRAWL_LOG.csv`,
   `PROMPT_RESULTS.csv`, and `COMPETITOR_BENCHMARK.csv` all exist and are current.
3. Every experiment run has a changelog entry with a recorded checkpoint decision.
4. **Structured data: eligible items are validated in GSC**, and Search Appearance
   performance is monitored — *without assuming rich-result appearance will occur.*
   Validation is controllable; appearance is Google's decision. These are reported as two
   separate facts and never conflated.
5. Every page built has an individually known indexation state and Google-selected
   canonical.

### At 2–3 quarters — outcome

6. **Non-brand organic clicks** have a trend line, reported separately from brand clicks.
7. Non-brand share of organic clicks is reported and trending.
8. Tier 1 conversions are attributable to organic source.
9. AI crawl volume, AI referral sessions, and prompt-panel citation rate each have a trend
   line.
10. Competitor benchmark has at least two monthly observations on identical variables.

### On direction

Criteria 6–10 deliberately do not specify a direction of movement.

The program's contract is that every intervention is **evaluable** and **causally connected
to acquisition** — not that every intervention succeeds. An intervention measured, found
ineffective, and retired under the kill criteria is a successful outcome of this design. An
intervention that cannot be evaluated, or that moves a metric with no causal path to
acquisition, is a failure of it.
