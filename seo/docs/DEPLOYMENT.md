# Deployment sequence

The repository is not wired to any CI, so **pushing to `main` does not deploy**.
The Apache host at dosacc.com is updated separately. That separation is what makes
the following possible: all experiments below are *built* and committed, but they
must be *deployed* in sequence, because spec section 10 caps concurrency at **two
experiments with disjoint instruments**.

Deploying everything at once would make the results unattributable, which puts the
whole batch out of scope under section 1.

## Order

### Wave 0 — before anything else
Complete owner dependency 1 (Search Console) and 2 (access logs) from
[`OWNER_ACTIONS.md`](OWNER_ACTIONS.md). GSC backfills no data from before
verification, so every day unverified is history permanently lost.

Then capture the Tier 1/2 baseline rows in `seo/METRICS_BASELINE.csv`, which
currently cannot be filled.

### Wave 1 — EXP-001 + EXP-002 (disjoint instruments)

| Experiment | Instrument | Checkpoint |
|---|---|---|
| EXP-001 Font Awesome off critical path | GSC Core Web Vitals (CrUX) | 28 days after deploy |
| EXP-002 Structured data | GSC Enhancements / Search Appearance | 4 weeks after deploy |

These read different reports and can run together.

**Immediately after deploying, re-run the crawler and diff against the baseline:**

```bash
node seo/crawl.mjs && diff seo/baseline/SEO_CRAWL_BASELINE.csv seo/SEO_CRAWL_BASELINE.csv
```

Expected: `Schema_Types` populated on `/us/`, `/au/`, `/leadership`, `/events`,
`/brochure/`, `/privacy`, `/terms`, `/hospitality-accounting/`, `/schedule/`,
`/guides/monthly-close-checklist`. `Internal_Inlinks` for `/brochure/` at 6.
Nothing else should move.

### Wave 2 — EXP-003 + EXP-004 (deploy only after Wave 1 checkpoints are read)

| Experiment | Instrument | Checkpoint |
|---|---|---|
| EXP-003 Bookkeeping title/description | GSC Performance, page CTR | 4 weeks after deploy |
| EXP-004 /brochure/ orphan fix | Crawl dataset + URL Inspection | 8 weeks after deploy |

EXP-003 reads GSC Performance, which EXP-002 also touches via Search Appearance.
Hold EXP-003 until the EXP-002 checkpoint is recorded, or its CTR movement cannot
be separated from rich-result eligibility changes.

Record every checkpoint decision in `SEO_CHANGELOG.md` using the kill-criteria
table in spec section 10.

---

## Pending, NOT applied: two `.htaccess` changes

Both are correct but neither is committed, because Apache config cannot be tested
in this environment and a malformed rule returns HTTP 500 for the entire site.
Apply on the host, verify, then commit.

### A. `/404` currently answers HTTP 200 (soft 404)

Measured on production:

```
/404                 -> 200   <-- soft 404
/definitely-not-real -> 404   <-- correct
/404.html            -> 301
```

The clean-URL rewrite serves `404.html` at `/404` with a success status, so a page
whose content says "Page Not Found" returns 200. It carries `noindex` so it will
not be indexed, but Search Console reports these under Soft 404.

The page-level half of this is already fixed and deployed with this commit: the
contradictory `<link rel="canonical" href="https://dosacc.com/404">` was removed,
since a canonical asserts an indexable preferred URL and directly contradicts
`noindex`.

Proposed rule, to be placed **immediately before** the generic clean-URL block:

```apache
# /404 must answer with a 404 status, not 200. Without this the clean-URL
# rewrite serves 404.html at /404 with a success status (a soft 404).
RewriteRule ^404/?$ - [R=404,L]
```

Apache then serves `ErrorDocument 404 /404.html` internally. That subrequest
targets `/404.html`, which is a real file, so the `!-f` guard on the clean-URL
rule leaves it alone, and `THE_REQUEST` still holds the browser's original request
so the `.html`->clean-URL redirect does not fire on it.

Verify after applying:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://dosacc.com/404
```

Expect `404`. Also confirm `https://dosacc.com/definitely-not-real` still returns
404 and renders the styled error page.

### B. CSP for Plausible

Blocked on owner dependency 4 — an account must exist first, or this ships a
broken script tag to production. The current policy blocks all third-party
scripts:

```
script-src 'self' 'unsafe-inline' https://s3.tradingview.com
```

Once the Plausible host is known, add it to **both** `script-src` and
`connect-src` (the script loads from the first, and beacons post to the second):

```apache
# ... script-src 'self' 'unsafe-inline' https://s3.tradingview.com https://plausible.io;
# ... connect-src 'self' https://api.gdeltproject.org https://plausible.io;
```

Then add the tag to each page's `<head>` and verify a test pageview arrives before
recording the Tier 1 baseline.
