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
