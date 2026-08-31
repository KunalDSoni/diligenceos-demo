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
