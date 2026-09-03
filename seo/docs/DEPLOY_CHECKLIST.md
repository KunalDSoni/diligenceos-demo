# Deployment Checklist — 32 Files Ready

**Generated:** 2026-09-03  
**Files to upload:** 32  
**Status:** Ready for manual FileZilla upload  
**Current live commit:** a1ea778

---

## Pre-Deployment Verification

Before uploading, confirm everything is ready:

```bash
bash seo/deploy-verify-pre.sh    # Automated pre-upload checks
```

Manual checks:
- [ ] **Owner dependencies** — GSC verification (DNS TXT) and access logs availability (see `seo/docs/OWNER_ACTIONS.md`)
- [ ] **Content briefs** — all 26 `[NEEDED:]` items filled in `seo/briefs/FACT_CHECKLIST.md` if you're deploying EXP-005 or EXP-006
- [ ] **Deployment manifest reviewed** — run `npm run seo:manifest` one more time to confirm no unexpected changes
- [ ] **FileZilla configured** — Server menu → "Force showing hidden files" (critical)

---

## Upload Sequence

**CRITICAL:** `.htaccess` uploads last. The site must not serve new HTML under old routing rules.

### Step 1: Site Root (9 files)

```
.htaccess         [UPLOAD LAST — see step 3]
404.html
events.html
index.html
leadership.html
llms.txt
privacy.html
sitemap.xml
terms.html
```

### Step 2: Subdirectories (23 files)

Upload in any order:

```
au/index.html
brochure/index.html
education-support/index.html
guides/monthly-close-checklist.html
hospitality-accounting/index.html
investors/index.html
news/index.html
opportunity/index.html
opportunity/au/index.html
opportunity/au/business-landscape/index.html
opportunity/au/part-1/index.html
opportunity/au/part-2/index.html
opportunity/au/part-3/index.html
opportunity/au/part-4/index.html
opportunity/au/part-5/index.html
opportunity/us/index.html
partners/index.html
schedule/index.html
services/advisory/index.html
services/bookkeeping/index.html
services/forecasting/index.html
services/payroll/index.html
us/index.html
```

### Step 3: Critical — Upload `.htaccess` Last

```
.htaccess
```

**Why:** If `.htaccess` misses:
- Clean URLs fail (e.g., `/services/bookkeeping` → 404)
- Canonical redirect (`https://non-www`) silently fails
- Security headers and gzip stop working
- Every URL in sitemap 404s (site appears live while broken for search engines)

**Verification:** Do NOT test yet. Let the DNS propagate for a few minutes, then verify below.

---

## Post-Deployment Verification

Run automated verification:

```bash
bash seo/deploy-verify-post.sh   # Automated post-upload tests
```

Then run detailed comparison:

```bash
npm run seo:diff        # Verify zero regressions in crawl data
npm run seo:indexnow    # Submit URLs to Bing IndexNow (if key configured)
```

If all tests pass, deployment succeeded and experiment clocks have started.

---

## Experiment Clock Start

Once deployed, all experiment clocks start. Checkpoints:

| Exp | Instrument | Checkpoint | Days |
|-----|-----------|-----------|------|
| EXP-001 | CrUX LCP/INP/CLS | 28 days (full CrUX rollover) | 28 |
| EXP-002 | GSC Enhancements | 28 days after GSC verification | 28 |
| EXP-003 | GSC Performance CTR | 28 days after GSC verification | 28 |
| EXP-004 | URL Inspection | 56 days | 56 |
| EXP-005 | HTTP status / Soft 404 | 28 days | 28 |
| EXP-006 | URL Inspection / GSC Perf | 56 days | 56 |
| EXP-007 | GSC Enhancements (Breadcrumbs) | 28 days | 28 |
| EXP-008 | Intl. Targeting / Inlinks | 56 days | 56 |

---

## Rollback (if needed)

If post-deployment verification fails:

1. Download `.htaccess` from dosacc.com live
2. Inspect for corruption or upload errors
3. Reupload `.htaccess` if needed
4. Rerun verification

For HTML regressions, identify the file, compare to local copy, reupload.

---

## Reference

- Deployment manifest: `npm run seo:manifest`
- Spec: `docs/superpowers/specs/2026-08-31-measurable-seo-geo-design.md`
- Status tool: `npm run seo:status`
