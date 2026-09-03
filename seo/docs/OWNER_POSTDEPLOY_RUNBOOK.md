# Owner Post-Deploy Runbook

**Before you start:** Ensure all 32 files have been uploaded via FileZilla and `deploy-verify-post.sh` has passed.

---

## Immediate (Day 1)

```bash
# 1. Verify deployment
bash seo/deploy-verify-post.sh

# 2. Submit to Bing IndexNow (if key is configured)
npm run seo:indexnow

# 3. Request index in Google Search Console
#    - Go to https://search.google.com/search-console
#    - URL Inspection for key pages
#    - Request indexing for each
```

---

## Week 1–2

```bash
# Run Week 2 checkpoint
npm run seo:checkpoint week-2
```

**Manual checks:**
1. Open GEO Prompt Panel (owner dep 8)
2. Test 6 queries in ChatGPT, Perplexity, Claude
3. Capture screenshots of answers (cite dosacc.com? yes/no)
4. Record extraction rate

---

## Week 4

```bash
npm run seo:checkpoint week-4
```

**Manual checks:**
1. Export GSC Performance data (all query clusters)
2. Compare CTR, impressions vs. baseline
3. Check URL Inspection for /opportunity/, /brochure/, /services/bookkeeping/

---

## Week 8

```bash
npm run seo:checkpoint week-8
```

**Manual checks:**
1. Check URL Inspection: all new pages "Included"?
2. Bing Webmaster Tools: Crawl lag improving?
3. Run GEO panel again (EXP-011 trend check)

---

## Week 12

```bash
npm run seo:checkpoint week-12
```

**Final measurement:**
1. Full GSC performance review
2. Check lead/booking increase in CRM (Tier 1 outcome)
3. Document wins and losses in decision gates

---

## Decision Framework

For each checkpoint, follow `seo/docs/CHECKPOINT_DECISION_GATES.md`:
- ✅ **Pass:** Approve experiment, keep deployed
- ⚠️ **Partial:** Monitor, plan optimizations
- ❌ **Fail:** Identify issue, rollback, re-measure

---

## Reference

- Deployment: `seo/docs/DEPLOY_CHECKLIST.md`
- Decisions: `seo/docs/CHECKPOINT_DECISION_GATES.md`
- GEO testing: `seo/docs/GEO_MEASUREMENT_GUIDE.md`
- Automation: `seo/checkpoint-runner.mjs`
