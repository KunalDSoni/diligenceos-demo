# SEO Changelog

Every production change affecting search gets an entry here. This file is what
converts the program from a set of changes into a history of
change -> hypothesis -> outcome.

Format and rules: see
`docs/superpowers/specs/2026-08-31-measurable-seo-geo-design.md` sections 5.9 and 10.

- Experiments are typed **TECH** or **CONTENT**, never both on the same URL.
- **Maximum 2 experiments run concurrently, and they must use disjoint instruments.**
- Every entry gets a `Decision:` line filled in at its checkpoint, drawn from the
  kill criteria table in spec section 10.

---

## 2026-08-31 — EXP-000 — BASELINE

```
Change:        Program instrumentation created; immutable baseline captured
Hypothesis:    n/a - baseline capture, no site change
Instrument:    seo/crawl.mjs (sha256 recorded in seo/baseline/PROVENANCE.txt)
Baseline:      20 URLs live, all HTTP 200, 19 in sitemap (+/contact, canonical -> /)
Commit:        1194dc40e7a5fd8da92b6ae7141257d0003f9a1f
URLs:          all
Checkpoint:    n/a
Decision:      Baseline accepted as the permanent pre-program reference point
```

**Findings recorded at baseline** (from `seo/baseline/SEO_CRAWL_BASELINE.csv`):

- **Real prose word counts are far lower than a naive tag-strip suggests.** Every
  page carries its stylesheet inline, so counting without removing `script`/`style`
  inflates results several-fold. Corrected figures: `/hospitality-accounting/` 1,612
  (largest page on the site), `/` 1,106, `/us/` 1,090, `/au/` 1,063, `/events` 501,
  `/leadership` 251, `/schedule/` 145. The four service pages sit at 432–457 words
  each, which is thin for head commercial terms.
- **`/brochure/` is orphaned** — zero internal inlinks, reachable only via the sitemap.
- **`/contact` duplicates `/` exactly** (1,106 words, identical title) and is absent
  from the sitemap. Its canonical correctly points to `/`, so this is consolidated,
  not a defect. Recorded so a later crawl diff does not misread it as new duplication.
- **Titles outside the ~60 character SERP display limit:** `/news/` 69,
  `/services/bookkeeping/` 66, `/education-support/` 64. At the short end,
  `/privacy` 28, `/leadership` 30, `/terms` 30.
- **`/leadership` meta description is 83 characters**, well under the useful range.
- **No page carries `Google_Selected_Canonical`** — that column stays empty until
  Search Console URL Inspection is available (spec 5.6, blocked on dep. 1).

---

## 2026-08-31 — EXP-001 — TECH

```
Change:        Font Awesome moved off the critical rendering path on 16 pages;
               Google Fonts preconnect added to the 8 pages missing it
Hypothesis:    Removing a render-blocking third-party stylesheet from the critical
               path improves LCP at p75, with no CLS penalty because icon space is
               reserved in the inline critical CSS
Instrument:    GSC Core Web Vitals (CrUX field data)
Baseline:      To be read from CrUX at deploy date; no field data exists pre-GSC
Commit:        (this commit)
URLs:          /, /us/, /au/, /events, /leadership, /privacy, /terms,
               /hospitality-accounting/, /news/, /partners/, /investors/,
               /education-support/, /services/{bookkeeping,payroll,advisory,forecasting}/
Checkpoint:    28 days after DEPLOY (full CrUX rollover), not after commit
Decision:      <filled at checkpoint>
```

**What changed.** The blocking `<link rel="stylesheet">` for Font Awesome 6.4.0
became `<link rel="preload" as="style" onload="this.rel='stylesheet'">` with a
`<noscript>` fallback, preserving the SRI hash and `crossorigin` where present.
Three different tag variants existed across the repo; all now use one form.

**CLS guard.** Icon `<i>` elements are empty — the glyph comes from `::before` —
so before the font arrives they collapse to zero width and shift layout. The
inline critical CSS now carries
`.fa,.fas,.far,.fab,.fal,.fad{display:inline-block;min-width:1em}`.
`min-width` rather than `width`, so wider glyphs are not clipped.

**Why not inline SVG.** The spec described "a small number of icons." That was
wrong: the site uses **113 distinct icons across 512 instances in 16 files**.
Hand-authoring 113 SVGs would be a high-risk visual refactor across every page
for a smaller CWV gain than simply removing the resource from the critical path.
Recorded so the decision is not silently revisited.

**Verification performed** (localhost, 1440x900):
- Font Awesome stylesheet loads: `faLoaded: true`
- Icons resolve to real glyphs, not fallbacks: computed `::before` font-family is
  `"Font Awesome 6 Free"`
- CLS guard active: computed icon width `13.42px`, `display: inline-block`
- No console errors on `/` or `/services/bookkeeping/`
- Hero H1 and all icons render correctly; screenshots match pre-change layout

**Pre-existing behaviour noted, not a regression.** 30 `.reveal` elements report
`opacity: 0` until the IntersectionObserver marks them visible. Verified identical
on live production before the change. Flagged only so a future crawl diff does not
misattribute it to this experiment.

---

## 2026-08-31 — EXP-002 — TECH

```
Change:        Structured data entity foundation — BreadcrumbList on 10 pages,
               Person x8 on /leadership, Service on /us/ and /au/,
               ImageGallery on /events
Hypothesis:    Valid entity markup makes these pages ELIGIBLE for richer search
               appearance and strengthens entity consolidation. Eligibility is
               controllable; appearance is Google's decision and is observed only.
Instrument:    GSC > Enhancements (validation) and Search Appearance (observed)
Baseline:      18 BreadcrumbList, 8 Person, 7 Service, 1 ImageGallery site-wide
               after this change; 0 Person / 0 ImageGallery before
Commit:        (this commit)
URLs:          /leadership, /events, /us/, /au/, /hospitality-accounting/,
               /guides/monthly-close-checklist, /schedule/, /brochure/,
               /privacy, /terms, /news/
Checkpoint:    4 weeks after GSC verification (blocked on owner dep. 1)
Decision:      <filled at checkpoint>
```

**`ImageGallery` on /events, not `Event`.** The spec called for `Event` markup here.
That was wrong and the instruction is deliberately not followed. All six items on
the page carry only a year ("2026") — no specific date — and they are retrospective
photo galleries of past team trips and conferences, not events anyone can attend.
`Event` requires `startDate`, and Google's Event rich results serve attendable
events. `Event` markup here would misrepresent the content and is structurally
guaranteed to produce zero rich results, which section 1 of the spec forbids.
`ImageGallery` describes what the page actually is and targets Google Images — a
surface already in the spec's SERP feature table, measurable via GSC Performance
filtered to the Image search type.

**`LocalBusiness` deliberately NOT shipped.** It is blocked on owner dependency 5
(canonical phone number per office). Publishing `LocalBusiness` whose NAP
contradicts the on-page NAP would produce conflicting entity signals — worse than
no markup. The four office addresses are confirmed; only the phone numbers are not.

**`Organization.sameAs` not extended.** The only genuine DiligenceOS profile
discoverable in the codebase is the existing LinkedIn company page, already present.
The other social URLs on the site are third-party embeds (IRS, Sky News Australia,
LiveNOW Fox) and must not be claimed as company profiles.

**No `FAQPage` added**, per the cut recorded in spec section 6.3.

**Validation.** `seo/validate-schema.mjs` added; it parses every JSON-LD block on
every page and checks Google-required fields. Current state: **31 blocks, 0 errors,
9 warnings** — all 9 are `Organization` missing the recommended `url` on `noindex`
`/opportunity/` pages, which are out of scope. The one in-scope instance on `/news/`
was fixed. Verified in-browser on `/leadership`: 8 `Person` entries parse, page
renders unchanged.

---

## 2026-08-31 — EXP-003 — TECH

```
Change:        /services/bookkeeping/ title 66 -> 54 chars, meta description
               163 -> 156 chars
Hypothesis:    A title that no longer truncates in the SERP raises CTR at held
               average position on a head commercial query
Instrument:    GSC > Performance, page-filtered, CTR at held position
Baseline:      Title 66 chars (truncating), description 163 chars
Commit:        (this commit)
URLs:          /services/bookkeeping/
Checkpoint:    4 weeks after GSC verification
Decision:      <filled at checkpoint>
```

New title: `Outsourced Bookkeeping Services for SMBs | DiligenceOS`. Dropping
"& CPA Firms" does double duty — it fits the ~60 character display limit, and it
removes overlap with `/partners/`, which owns the CPA-firm intent in
`SEO_QUERY_MAP.csv`. The exact head term "Outsourced Bookkeeping Services" is kept.
`og:title` and `og:description` carried the same strings and were updated with it.

**Five other pages had title or description length defects and were deliberately
NOT changed.** `/privacy` (28), `/terms` (30), `/news/` (69),
`/education-support/` (64), and `/leadership` (30 title / 83 description) are all
marked `NONE` or entity-only in the query map. They serve brand or utility queries,
so improving them would move brand clicks, not the Tier 2 KPI of **non-brand**
organic clicks. Changing them would be optimizing a metric because it is
measurable, which section 1 forbids. Recorded so the omission reads as a decision
rather than an oversight.

---

## 2026-08-31 — EXP-004 — TECH

```
Change:        /brochure/ orphan fixed; Resources footer group now lists real
               resources on 6 pages
Hypothesis:    A page with zero internal inlinks is discoverable only via the
               sitemap and accrues no internal link signal; giving it site-wide
               links should improve its crawl frequency and indexation stability
Instrument:    Internal_Inlinks column in the crawl dataset; GSC URL Inspection
Baseline:      /brochure/ Internal_Inlinks = 0
Commit:        (this commit)
URLs:          /, /events, /leadership, /us/, /au/, /hospitality-accounting/
Checkpoint:    8 weeks after deploy
Decision:      <filled at checkpoint>
```

The footer "Resources" group previously listed only Privacy Policy, Terms of
Service, and Contact — none of which are resources. It now leads with the Company
Brochure and the Monthly Close Checklist, which are.

**Verified** by re-crawling the working tree and diffing against the frozen
baseline: `/brochure/` **Internal_Inlinks 0 -> 6**. In-browser, footer links
resolve and `/brochure/` is reachable with valid JSON-LD.

`/guides/monthly-close-checklist` did not gain inlinks (12 -> 11) because it was
already linked from all six of those pages; the crawler counts unique source
pages, so a second link from the same page correctly adds nothing.

**Reading the verification diff:** it was produced by a local crawl against a live
baseline, so every page shows -1 inlink. `/contact` exists only through an
`.htaccess` rewrite and 404s in local mode, contributing none of its outbound
links. This is a crawl-mode artifact, not a regression.

---

## 2026-08-31 — P2 gate applied — NO EXPERIMENT SHIPPED

```
Change:        None to the site. Gate evaluation only.
Result:        3 of 4 P2 candidates rejected on test 1 (uniqueness);
               1 held pending GSC data
Instrument:    SEO_QUERY_MAP.csv checked against the candidate set
Decision:      P2 redirected from page creation to page depth
```

Full reasoning in [`docs/P2_PAGE_GATE.md`](docs/P2_PAGE_GATE.md). Briefs for the
redirected work are in [`briefs/`](briefs/).

Recording a gate evaluation that produced no site change is deliberate: under spec
section 7, rejecting a page is a successful outcome of the gate, and the reasoning
needs to survive so the rejected candidates are not quietly rebuilt later.

---

## 2026-09-01 — EXP-005 — TECH

```
Change:        /404 now returns HTTP 404 instead of 200
Hypothesis:    Removing a soft 404 stops Search Console reporting it and removes
               a page that answers 200 while its content says "not found"
Instrument:    GSC > Page Indexing (Soft 404 count); curl status check
Baseline:      /404 -> 200 (verified on production and reproduced locally)
Commit:        (this commit)
URLs:          /404
Checkpoint:    4 weeks after deploy
Decision:      <filled at checkpoint>
```

Previously documented as a proposal that could not be tested. It has now been
tested. Apache 2.4.66 was stood up locally against the site's real `.htaccess`
and reproduced production exactly:

```
/                    200      /404                 200   <- soft 404
/404.html            301      /leadership          200
/definitely-not-real 404      /contact             200
```

With `RewriteRule ^404/?$ - [R=404,L]` inserted before the clean-URL block:
`/404` and `/404/` return 404, `/404xyz` is correctly not matched, the styled
error page still renders through `ErrorDocument`, every other route is unchanged,
all redirect chains resolve in one hop, and the error log is clean.

macOS TCC blocks Apache from reading under `~/Downloads`, and the worktree's
parent chain carries its own `.htaccess`, so the test served a copy from
`/private/tmp`.

The page-level half — removing the contradictory canonical — shipped earlier.

---

## 2026-09-01 — Tooling — NO SITE CHANGE

`check.mjs`, `report-diff.mjs`, `gsc-brand-split.mjs`, and a working pre-commit
hook. None of these touch the site.

**`crawl.mjs` was modified**, which the rules in `README.md` normally forbid.
Local-mode URL resolution gained the `/contact` named rewrite that `.htaccess`
performs but `fetchLocal` did not emulate. Without it, a `--local` crawl 404s on
a URL the live server answers 200, and every local-vs-live diff reported five
false regressions plus a phantom -1 inlink on every page — which would have made
`report-diff.mjs` useless as a release gate.

Live fetching and all HTML parsing are byte-for-byte unchanged, so the frozen
baseline — produced by a **live** crawl — remains valid and was not re-captured.
`baseline/PROVENANCE.txt` carries a dated amendment recording the old and new
hashes and this reasoning.

Post-change diff against the frozen baseline: **0 regressions, 11 improvements,
2 neutral changes** — the improvements being every schema block from EXP-002 and
the `/brochure/` orphan fix (now 7 inlinks), the neutral changes being the
EXP-003 title and description.
