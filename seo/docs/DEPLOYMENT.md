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

### CORRECTION — waves are not separable, deploy is a single upload

The wave plan below this heading was written assuming experiments could be
deployed independently. **They cannot.** Deployment is a manual FileZilla upload,
which works at file granularity, and single files carry up to four experiments:

```
us/index.html        EXP-001  EXP-002  EXP-004  EXP-006
au/index.html        EXP-001  EXP-002  EXP-004  EXP-006
leadership.html      EXP-001  EXP-002  EXP-004  EXP-006
events.html          EXP-001  EXP-002  EXP-004  EXP-006
index.html           EXP-001           EXP-004  EXP-006
privacy.html         EXP-001  EXP-002
terms.html           EXP-001  EXP-002
services/bookkeeping EXP-001  EXP-003
```

Uploading `us/index.html` to ship EXP-001 necessarily ships EXP-002, EXP-004 and
EXP-006 with it. Waves are unimplementable here.

**Attribution survives anyway**, because the concurrency cap exists to keep
results attributable, and these results remain attributable — each experiment is
read on a different report, and where two share a report they are scoped to
different URLs:

| Experiment | Instrument | Scope |
|---|---|---|
| EXP-001 | CrUX LCP/INP/CLS p75 | site-wide; nothing else moves CrUX |
| EXP-002 | GSC Enhancements | the 10 main-site URLs it marked up |
| EXP-003 | GSC Performance CTR | `/services/bookkeeping/` only — **EXP-002 never touched this page**, so its CTR is uncontaminated |
| EXP-004 | Internal_Inlinks, URL Inspection | `/brochure/` |
| EXP-005 | HTTP status, GSC Soft 404 | `/404` |
| EXP-006 | URL Inspection, GSC Performance | the 9 `/opportunity/` URLs, all previously unindexed |
| EXP-007 | GSC Enhancements (Breadcrumbs) | `/opportunity/` URLs — disjoint from EXP-002 by URL |
| EXP-008 | International Targeting, inlinks | 3 opportunity URLs, `business-landscape` |

So: **one upload, eight experiments, each still individually readable.** The cap
in spec section 10 continues to govern future work, where files are not already
entangled.

### Deploying

Generate the file list:

```bash
npm run seo:manifest
```

32 files, all overwrites — the `/opportunity/` pages already exist on the server
and were merely `noindex`, so no new directories are needed.

**The single biggest risk in this deploy is `.htaccess`.** FileZilla hides
dotfiles by default. Enable *Server > Force showing hidden files* before
uploading. If `.htaccess` is missed, clean URLs, the https/non-www canonical
redirect, the security headers and the `/404` fix all silently fail — and the
site will appear to work while every URL in the sitemap 404s.

Upload `.htaccess` **last**, so the site is never serving new HTML under old
routing rules for longer than necessary.

### Immediately after uploading

```bash
npm run seo:diff
```

Expect **0 regressions**. Then confirm the three things a file-level upload can
silently get wrong:

```bash
curl -sS -o /dev/null -w "404 page:    %{http_code}\n" https://dosacc.com/404
curl -sS -o /dev/null -w "opportunity: %{http_code}\n" https://dosacc.com/opportunity/
curl -sS -o /dev/null -w "clean url:   %{http_code}\n" https://dosacc.com/leadership
```

Expect `404`, `200`, `200`. A `200` on the first means `.htaccess` did not upload.
A `404` on the third means the same.

Then submit the updated sitemap in Search Console and request indexing for
`/opportunity/` so the newly unlocked cluster is discovered rather than waiting
on an organic crawl.

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
