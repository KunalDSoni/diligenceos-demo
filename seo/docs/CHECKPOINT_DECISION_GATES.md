# Checkpoint Decision Gates — SEO/GEO Experiments

**Purpose:** Define go/no-go decisions at each experiment checkpoint (4-week, 8-week, 12-week marks).

**Principle:** Every experiment must show measurable attribution to a causal metric (Tier 1 or Tier 2) to continue. If not, rollback or iterate immediately.

---

## Checkpoint Schedule

All experiments deploy simultaneously (single FileZilla upload). Checkpoints are measured from **deploy date**, not commit date.

| Checkpoint | Days | Experiments Due | Measurement Window |
|---|---|---|---|
| **Week 1** | Day 7 | EXP-005, EXP-010 (quick check) | CrUX LCP p75, Bing crawl |
| **Week 2** | Day 14 | EXP-009, EXP-011 | GSC Enhancements, AI extraction |
| **Week 4** | Day 28 | EXP-001, EXP-002, EXP-003, EXP-005, EXP-007, EXP-011 | GSC Performance, CTR changes |
| **Week 8** | Day 56 | EXP-004, EXP-006, EXP-008, EXP-010 | URL Inspection, Bing index lag |
| **Week 12** | Day 84 | ALL experiments | Final measurement, Tier 1 impact if ready |

---

## Decision Matrix per Experiment

### EXP-001: CrUX LCP/INP/CLS (Core Web Vitals)

**Instrument:** CrUX (Chrome User Experience Report)

**Measurement Window:** 28 days (full CrUX reporting lag)

**Pass Criteria:**
- ✅ LCP p75 improves ≥ 100ms (or remains stable if already optimized)
- ✅ INP p75 improves ≥ 50ms
- ✅ CLS p95 stays < 0.1

**Fail Criteria:**
- ❌ Any metric regresses >10%
- ❌ Page load time increases >200ms

**If Pass:** Approve EXP-001 as permanent. Note: This is a site-wide experiment, so "pass" means no performance regression.

**If Fail:** 
1. Identify which change caused regression (CSS, JS, or image optimization)
2. Rollback problematic file or fix the issue (e.g., image compression, lazy loading)
3. Re-measure in Week 4

---

### EXP-002: GSC Enhancements (Schema Markup)

**Instrument:** GSC Enhancements report (data is delayed 2-4 weeks)

**Measurement Window:** 28-42 days (GSC processing lag)

**Pass Criteria:**
- ✅ Rich result impressions appear on GSC for marked-up pages (FAQPage, Breadcrumbs, BreadcrumbList)
- ✅ No reduction in organic impressions (schema didn't cannibalize visibility)

**Fail Criteria:**
- ❌ Marked-up pages drop in impressions >20% (schema may be misconfigured)
- ❌ "Rich results" report shows errors for marked-up pages

**If Pass:** Approve schema markup as permanent. Rich results may or may not surface (depends on Google algorithm), but markup is correct and not harmful.

**If Fail:** 
1. Run `npm run seo:schema` to validate markup
2. Check GSC for schema errors (Enhancements > Issues)
3. Fix invalid fields or remove problematic schema
4. Re-validate and re-measure in Week 8

---

### EXP-003: GSC Performance CTR (Title/Description Rewrite)

**Instrument:** GSC Performance report (query filtered to "bookkeeping backlog")

**Measurement Window:** 28 days

**Pass Criteria:**
- ✅ CTR improves ≥ 15% on target query cluster
- ✅ Impressions remain stable (no drop)
- ✅ No new errors in GSC (page is crawlable)

**Fail Criteria:**
- ❌ CTR drops vs. baseline
- ❌ Impressions drop >10% (title/description may have reduced relevance)

**If Pass:** Approve title/description changes. This is a direct SEO win.

**If Fail:**
1. Analyze competitor titles for target query (SERP analysis)
2. A/B test alternative titles (if GSC allows)
3. Or rollback to original title/description
4. Re-measure in Week 8

---

### EXP-004: URL Inspection & Internal Links (/brochure/)

**Instrument:** URL Inspection (from GSC), internal inlinks

**Measurement Window:** 42 days

**Pass Criteria:**
- ✅ /brochure/ is indexed (Coverage shows "Included")
- ✅ Internal inlinks from /services/* pages appear
- ✅ No "Excluded by robots.txt" or "Noindex" status

**Fail Criteria:**
- ❌ Still shows 404 or "Not found" in URL Inspection
- ❌ No inbound internal links detected

**If Pass:** /brochure/ is now discoverable. Approve linking structure.

**If Fail:**
1. Verify /brochure/index.html is deployed and live
2. Verify robots.txt allows /brochure/ (should see `Allow: /`)
3. Manually request indexing in GSC (force crawl)
4. Check for 404 or canonical redirect issues
5. Re-measure in Week 12

---

### EXP-005: HTTP 404 Status (Soft-404 Fix)

**Instrument:** GSC Soft-404 report, HTTP status in URL Inspection

**Measurement Window:** 14 days

**Pass Criteria:**
- ✅ /404 returns 404 status (not 200)
- ✅ No "Soft 404" errors in GSC after 2 weeks
- ✅ .htaccess deployment succeeded (verified via deploy-verify-post.sh)

**Fail Criteria:**
- ❌ /404 still returns 200 (soft-404 remains)
- ❌ GSC reports soft-404 errors (site-wide URLs returning 200 when they should 404)

**If Pass:** Approve soft-404 fix. This is a foundation for all other experiments (if this fails, others may be compromised).

**If Fail:**
1. Verify .htaccess was actually uploaded (not skipped in FileZilla)
2. Check Apache configuration for .htaccess support
3. Reupload .htaccess and run deploy-verify-post.sh again
4. Re-measure in Week 2 (urgent)

---

### EXP-006: Content Depth (/services/bookkeeping/) & URL Inspection

**Instrument:** GSC Performance, URL Inspection, word count baseline

**Measurement Window:** 56 days

**Pass Criteria:**
- ✅ /services/bookkeeping/ indexed (URL Inspection = "Included")
- ✅ GSC impressions stable or increasing by Week 4 (content depth doesn't hurt visibility)
- ✅ CTR stable or improving (deeper content is more relevant)
- ✅ Word count increased 457 → 800+ (goal: 2x baseline)

**Fail Criteria:**
- ❌ CTR drops >15% (new content may be less relevant to existing queries)
- ❌ Impressions drop >20% (possible cannibalization or content quality issue)

**If Pass:** Approve content depth strategy. Can apply to other service pages (advisory, payroll).

**If Fail:**
1. Analyze GSC query data: which queries lost CTR?
2. Compare new content vs. competitor depth (benchmark comparison)
3. Revise content or revert to original page copy
4. Re-measure in Week 12

---

### EXP-007: Breadcrumbs (Schema + Navigation)

**Instrument:** GSC Enhancements (Breadcrumbs report)

**Measurement Window:** 28-42 days

**Pass Criteria:**
- ✅ Breadcrumb schema marked up on 9 /opportunity/ pages
- ✅ Breadcrumbs appear in GSC Enhancements report (no errors)
- ✅ No indexation issues on marked-up pages

**Fail Criteria:**
- ❌ Schema errors in GSC (Enhancements > Issues)
- ❌ Breadcrumb coverage <8 pages (markup missing or invalid)

**If Pass:** Breadcrumbs are live and may surface in rich results.

**If Fail:**
1. Validate breadcrumb schema: `npm run seo:schema`
2. Check GSC Enhancements for specific validation errors
3. Fix schema format (ensure itemListElement array is correct)
4. Re-measure in Week 8

---

### EXP-008: International Targeting (hreflang + /opportunity/)

**Instrument:** URL Inspection (international), GSC Coverage

**Measurement Window:** 56 days

**Pass Criteria:**
- ✅ hreflang tags deployed on /opportunity/ pages
- ✅ AU /opportunity/au/ pages indexed separately (URL Inspection shows AU crawl)
- ✅ No hreflang errors in GSC

**Fail Criteria:**
- ❌ hreflang syntax errors in GSC
- ❌ AU pages are not indexed as separate URLs

**If Pass:** International targeting is working. AU opportunity cluster can be measured independently.

**If Fail:**
1. Validate hreflang: `grep -r "hreflang" opportunity/` (should be present)
2. Check for circular references (x-default should link to self)
3. Fix hreflang syntax and reupload
4. Request re-indexing in GSC
5. Re-measure in Week 12

---

### EXP-009: EEAT / Entity Signals (Person Schema)

**Instrument:** GSC Enhancements, brand term impressions

**Measurement Window:** 28-42 days

**Pass Criteria:**
- ✅ Person schema markup present on all 8 executives (leadership.html)
- ✅ LinkedIn sameAs links are valid (no 404s)
- ✅ No schema errors in GSC

**Fail Criteria:**
- ❌ Schema validation errors: `npm run seo:schema` shows issues
- ❌ LinkedIn links return 404 or are unreachable

**If Pass:** Entity signals are live. Monitor for brand entity clicks in GSC (e.g., "john doe diligenceos").

**If Fail:**
1. Validate Person schema: `npm run seo:schema`
2. Verify LinkedIn URLs are correct and accessible
3. Fix sameAs URLs or remove if URLs don't exist
4. Re-validate and re-measure in Week 4

---

### EXP-010: IndexNow (Bing Acceleration)

**Instrument:** AI crawl log (Bing crawl lag), Bing Webmaster Tools

**Measurement Window:** 14-28 days

**Pass Criteria:**
- ✅ IndexNow submission succeeds (HTTP 200 from Bing)
- ✅ Bing crawl lag reduces from 7-14 days to <48 hours (compared to baseline)
- ✅ Bingbot re-crawls on updated URLs within 3 days

**Fail Criteria:**
- ❌ IndexNow submission fails (HTTP 4xx/5xx)
- ❌ Bing crawl lag unchanged (submission not working)

**If Pass:** Bing indexing is accelerated. AI engines (ChatGPT via Bing) see new content faster.

**If Fail:**
1. Check if IndexNow key is valid (generated from Bing Webmaster Tools)
2. Verify /well-known/indexnow endpoint is deployed
3. Re-run `npm run seo:indexnow` and check response
4. Check Bing Webmaster Tools > IndexNow for error details
5. Re-measure in Week 2

---

### EXP-011: AI Answer Extractability (Answer-First Paragraphs)

**Instrument:** GEO prompt panel (manual testing), AI referral sessions (Plausible)

**Measurement Window:** 14-28 days

**Pass Criteria:**
- ✅ ≥ 50% of test queries show extraction (ChatGPT/Perplexity/Claude cite dosacc.com)
- ✅ Answer-first paragraphs appear in at least 1/3 of AI responses
- ✅ No drop in organic impressions on money pages

**Fail Criteria:**
- ❌ < 30% extraction rate (content is not being picked up by AI)
- ❌ Organic impressions drop >15% (content restructuring hurt relevance)

**If Pass:** Answer-first format is working for AI extraction. Approve strategy for other pages.

**If Fail:**
1. Check if pages are crawled by AI bots: `grep "GPTBot\|OAI-SearchBot" seo/AI_CRAWL_LOG.csv`
2. Verify answer paragraphs are in Bing index (may take 2-4 weeks)
3. Consider rewrites if answers are unclear or too long
4. Re-measure in Week 4

---

## Summary: Rollback & Continuation Decision

At each checkpoint:

| Status | Action | Next Step |
|--------|--------|-----------|
| ✅ **Pass** | Approve as permanent | Keep deployed; measure at next checkpoint |
| ⚠️ **Partial Pass** | Approve with observation | Monitor trend through Week 12; fix identified issues if regression appears |
| ❌ **Fail** | Identify root cause | Fix issue or rollback; re-measure at next checkpoint |

---

## Rollback Procedure

If experiment fails checkpoint:

1. **Identify the change** (which file, which HTML change, which schema)
2. **Rollback locally** (git revert or restore original file)
3. **Re-deploy** (re-upload changed file to Apache)
4. **Verify** (run deploy-verify-post.sh)
5. **Re-measure** at next checkpoint

**Cost:** ~1-2 hours to identify, fix, deploy, and re-test.

---

## Tier 1 Impact Measurement (Week 12)

If all experiments pass their checkpoints, measure **final Tier 1 outcome** at Week 12:

- **Organic qualified leads** (if CRM join is live)
- **Schedule booking completions** (Plausible event, interim metric)

**Expected impact:** 15-30% increase in qualified lead volume (conservative estimate, depends on baseline volume).

---

## Document References

- Spec: `docs/superpowers/specs/2026-08-31-measurable-seo-geo-design.md` (section 10)
- Checkpoint schedules: Individual experiment specs (EXP-001…008)
- Measurement tools: `seo/status.mjs`, `seo/crawl.mjs`, `seo/report-diff.mjs`
- Owner actions: `seo/docs/OWNER_ACTIONS.md`
