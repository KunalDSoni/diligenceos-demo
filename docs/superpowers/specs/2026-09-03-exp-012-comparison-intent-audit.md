# EXP-012 — Comparison Intent Audit (Phase 1)

**Date:** 2026-09-03  
**Status:** Pre-implementation audit framework  
**Blocking factor:** Requires GSC + Bing Webmaster Tools data post-deploy

## Objective

Identify high-demand "vs." and "comparison" query variants that:
1. Are currently unowned by dosacc.com
2. Have measurable search volume
3. Align with DiligenceOS service offerings
4. Convert well (B2B services comparison typically 2-3x higher intent)

## Query Variants to Audit

### Cluster 1: Bookkeeping Comparisons

**Primary intent candidates:**
- `outsourced bookkeeping vs in-house bookkeeping`
- `outsourced bookkeeping vs freelance bookkeeper`
- `virtual bookkeeping vs in-house`
- `bookkeeping outsourcing alternatives`
- `outsourced bookkeeping companies comparison`

**SERP analysis goals:**
- Identify top 5 ranking domains (are they competitors? aggregators? DIY guides?)
- Estimate monthly volume (Bing Webmaster Tools or public data)
- Check if any page on dosacc.com ranks (unlikely — we don't have comparison content yet)
- Document SERP features present (FAQ, People Also Ask, featured snippet)

### Cluster 2: Accounting Outsourcing Comparisons

**Primary intent candidates:**
- `outsourced accounting vs in-house accounting`
- `offshore accounting vs onshore`
- `accounting outsourcing vs hiring`
- `outsourced accounting for CPA firms` (white-label comparison angle)
- `accounting process outsourcing providers`

**SERP analysis goals:**
- Volume estimation by region (US-focused given dosacc.com positioning)
- Competitor mention in winning pages (who ranks?)
- Depth of comparison content (are pages thin or comprehensive?)
- Click-through rate proxy from Title/Description analysis

### Cluster 3: Services Comparison

**Primary intent candidates:**
- `bookkeeping vs payroll services`
- `CFO services vs controller services`
- `tax preparation outsourcing alternatives`
- `financial advisory services comparison`

**SERP analysis goals:**
- Is comparison content useful (multiple providers) or educational (roles/scope)?
- If educational: lower commercial intent, but still valuable for brand authority
- If provider comparison: high-intent, suitable for white-label/partner positioning

## Data Collection Template

### Per Query Variant

```
Query: [search term]
─────────────────
Monthly Volume:        [est. from GSC/Bing/paid tool]
Search Intent Level:   [Low/Med/High — commercial vs educational]
Top 5 SERP Domains:    [list]
DiligenceOS Coverage:  [None / Existing page (which?) / Can own]
SERP Features:         [Featured snippet, FAQ, People Also Ask, etc.]
Content Depth (Avg):   [# words in top 3 results]
Recommendation:        [Skip / Own as section / Own as dedicated page]
---
```

### Aggregated Cluster Summary

```
Cluster: [Bookkeeping | Accounting | Services]
─────────────────────────────────────
Total Queries Audited:         [#]
High-Volume Queries:           [#, est. total monthly]
Unowned by DiligenceOS:        [#]
Owned & Defensible:            [#]
Cannibalization Risk:          [Yes/No — does it compete with existing pages?]
Recommended Actions:           [1. 2. 3. ...]
Business Value (if approved):  [est. lead uplift %]
```

## Execution Steps (Post-Deploy)

### Week 1–2 (post-deploy, pending owner dep 3 + 8)

1. **GSC + Bing Webmaster Tools data pull**
   - Export query reports for each cluster's variants
   - Record actual monthly volume for dosacc.com queries
   - Note impressions vs clicks (conversion proxy)

2. **SERP analysis**
   - Run each query variant in search engine (incognito mode)
   - Screenshot top 10 results
   - Document title/description patterns (comparison keywords present?)
   - Note any featured snippets or People Also Ask boxes

3. **Competitor analysis**
   - Identify who ranks in top 5 (are they direct competitors?)
   - Analyze their page structure (how do they handle "vs."?)
   - Look for gaps in their comparison coverage

4. **Volume estimation**
   - Cross-reference GSC volume with Bing data
   - Estimate US-specific volume (target market)
   - Flag queries with >100 monthly volume as high-priority

### Deliverable

**Audit Report:** `seo/audits/2026-09-xx-comparison-intent-audit.md`

Contains:
- Per-query analysis (volume, SERP, ranking domains, opportunity)
- Clustered summary (total volume, cannibalization check, recommendation)
- Decision matrix: which queries → dedicated page vs. section vs. skip
- Implementation roadmap if approved (content brief, word count target, internal linking)

## Decision Gates (Phase 2 Entry)

**Approve EXP-012 Phase 2 (content write) only if:**

1. ✅ Total unowned comparison query volume ≥ 500/month
2. ✅ No cannibalization with existing pages (partners/, services/bookkeeping/, etc.)
3. ✅ Top-ranking competitors have thin content (<800 words) — entry point exists
4. ✅ Business decides white-label vs. comparison angle makes sense for positioning

**Defer EXP-012 if:**

- Volume <500/month (too small relative to effort)
- Existing pages already answer the "vs." intent well
- Cannibalizes partners/ or services/bookkeeping/ positioning
- Post-checkpoint data from EXP-001…008 prioritizes other levers

## Success Metrics (if Phase 2 ships)

| Metric | Target | Timeline |
|--------|--------|----------|
| Impressions on comparison pages | ≥ 2x base bookkeeping page | 12 weeks |
| CTR from comparison queries | ≥ 5% | 12 weeks |
| Conversion rate (click → lead) | ≥ 8% (2–3x higher than base) | Post-measurement |
| Pages in Google index | ≥ 2 new URLs | 8 weeks |

## References

- Spec section: EXP-012 (exploratory-specs)
- Owner dep 3: Bing Webmaster Tools verification
- Owner dep 8: Signed-in access for GEO prompt panel (AI citation measurement)
- Related: BRIEF-partners.md, BRIEF-bookkeeping.md (positioning constraints)
