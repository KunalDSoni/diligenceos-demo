# SEO Extensions — Exploratory Spec

**Date:** 2026-09-03  
**Context:** Four additional optimizations identified post-baseline, ready for decision on whether to ship as experiments or defer.

**Decision gate:** These are exploratory — they improve measured coverage but are not on the critical path until the eight core experiments (EXP-001…008) ship and begin measuring. Each is scoped for independent delivery and has a clear causal link to either Tier 1 or Tier 2 metrics per spec section 1.

---

## EXP-009 — EEAT / Entity Signals (Leadership markup)

### Hypothesis

Adding `Person` schema markup to real executives on `leadership.html`, with LinkedIn `sameAs` links and role/credential information, increases brand term clicks and improves AI engine authority citations for the company. YMYL-adjacent (accounting/finance) categories treat entity signals as a trust marker more heavily than competitive categories.

### Why now

- `leadership.html` names 8 executives with headshots but carries **zero** structured data markup
- Existing `Organization` JSON-LD on the homepage carries one `sameAs` (LinkedIn); no Person links exist
- Codebase already includes `Person` schema on 1 page — pattern exists
- **Cost:** ~40 lines of JSON-LD added to 1 file (leadership.html)
- **No new dependencies:** requires confirming LinkedIn profile URLs; no API calls or external data

### Scope

**In scope:**
- Add `Person` schema for 8 executives: name, role, image, LinkedIn `sameAs`
- Extend homepage `Organization` schema to include `founder` / `employee` relationships (optional; depends on data completeness)
- Link to full `Person` URIs in Job postings (if Job schema exists — check `/careers/` state)

**Out of scope:**
- Educational credentials markup (too specific; requires formal schema extensions and audit trail)
- Third-party credentialing systems (trust badges, credentials APIs)

### Measurement

**Instrument:** Tier 3 diagnostic only (no direct business outcome yet)
- GSC Enhancements — `Person` schema presence and clicks to profile pages
- Brand term impressions/CTR as proxy (measure separately by branded vs. generic)

**Tier 2 proxy:** Monitor brand organic clicks (GSC) for any uplift in team/leadership intent cluster (queries like "dosacc team", "diligence os founders", etc.). If present, attribute to entity signals.

**Checkpoint:** 4 weeks post-deploy; re-run baseline crawler to verify markup presence.

### Why it matters (if proven)

- Establishes credibility for outbound founder/executive interviews, thought leadership content, and partnership inquiries
- Enables AI engines (ChatGPT, Perplexity) to surface founder/team bios in responses, which increases non-commercial brand awareness
- Positions for future "people expertise" queries (e.g., "experts in offshore accounting")

### Decision required

Approved → add to next wave deploy  
Deferred → close as "optimization for post-EXP-008 checkpoint review"

---

## EXP-010 — IndexNow Integration

### Hypothesis

Submitting new and modified URLs to Bing's IndexNow (a ping-based, permission-free indexing channel) accelerates Bing index coverage and, consequently, accelerates ChatGPT's index updates (which historically draw from Bing). This reduces the lag between content changes and GEO visibility.

### Why now

- **No dependencies:** IndexNow requires only a single POST endpoint + key on the server; requires no external account creation or verification beyond Bing Webmaster Tools (owner dep 3)
- **Payoff is measurable:** Bing's index lag is quantifiable; AI crawler response time is logged
- **Fits natural process:** IndexNow pings on deploy, making it a natural addition to the deploy-manifest workflow
- **Cost:** ~20 lines of server config (`.htaccess` rewrite or script) + one integration node in build pipeline

### Scope

**In scope:**
- IndexNow endpoint setup (Apache rewrite or Node.js wrapper)
- Integration with `npm run seo:manifest` — ping all 32 files post-deploy
- Bing Webmaster Tools verification (depends on owner dep 3)

**Out of scope:**
- Building a general-purpose IndexNow client (reuse existing libraries)
- Bing-specific crawl rate optimization (covered by `robots.txt` and crawl-delay if needed)

### Measurement

**Instrument:** AI crawl log (server logs)
- Time from deploy ping → first PerplexityBot/OAI-SearchBot/ChatGPT-User hit on updated URL
- Bing-specific: time from IndexNow ping → Bingbot re-crawl

**Tier 2 proxy:** Monitor AI crawler hit count and URL coverage post-deploy. Compare date of first hit vs. date of deploy ping.

**Checkpoint:** 2 weeks post-deploy; inspect AI_CRAWL_LOG.csv for pre/post differences in Bing and ChatGPT crawler behavior.

### Why it matters (if proven)

- Shorten the feedback loop for content changes to land in AI answers
- Establish a reusable pattern for future bulk content updates
- Demonstrate measurable impact from a zero-cost infrastructure investment

### Decision required

Approved → add to deploy-manifest automation  
Deferred → document as "post-deployment optimization"

---

## EXP-011 — AI Answer Extractability

### Hypothesis

Pages that open with an answer-shaped paragraph (a direct response to the primary intent query, followed by detail) are more likely to be quoted in ChatGPT/Perplexity/Claude responses than pages that bury the answer in prose. This increases AI referral traffic and citation rate.

### Why now

- **Measurable:** The GEO prompt panel (owner dep 8) will report whether answers are being pulled from your pages into AI responses
- **Low cost:** Restructure 5 money pages (highest contract value) with answer-first format; no HTML changes needed
- **Precedent exists:** `hospitality-accounting/` already uses answer-first structure; `partners/` and service pages do not
- **Can test now:** Run manual GEO prompt panel tests post-deploy before waiting for owner dep 8 to land

### Scope

**In scope:**
- Audit 5 highest-value pages (partners/, services/bookkeeping/, services/advisory/, us/, au/) for answer presence
- Add answer-first paragraph under each H2 (not just the lede)
- Ensure answers stand alone (readable without the following detail paragraph)

**Out of scope:**
- Creating TL;DR or executive summary sections (those read as marketing, not answers)
- Modifying snippet length or meta descriptions (covered by EXP-003 title/description work)

### Measurement

**Instrument:** GEO prompt panel (owner dep 8)
- Manual testing: run queries for each page's primary intent through ChatGPT/Perplexity/Claude, capture whether your answer is quoted
- Automated: parse LLM responses for your domain and compare citation rate pre/post

**Tier 2 proxy:** Monitor AI referral sessions in Plausible (once CRM join is available). If sessions increase post-deploy, attribute partially to answer extractability.

**Checkpoint:** 2 weeks post-deploy (manual testing); 4 weeks for statistical significance in AI referral volume.

### Why it matters (if proven)

- Direct lever over AI engine behavior (no crawl dependency, no ranking algorithm mystery)
- Measurable contribution to Tier 1 metrics (qualified leads from AI referral)
- Informs content strategy for all future pages

### Decision required

Approved → include in EXP-005/006 page rewrites  
Deferred → document as "content structure audit for post-checkpoint review"

---

## EXP-012 — Comparison Intent Coverage

### Hypothesis

Adding a "vs." section or comparison pages (e.g., "Outsourced bookkeeping vs. in-house bookkeeping", "White-label vs. freelance accounting") captures high-intent comparison queries, which convert well for B2B services. This expands the query map and addresses an unowned intent cluster.

### Why now

- **Intent gap confirmed:** Current `SEO_QUERY_MAP.csv` has no "vs." or "comparison" entries; comparison queries do not appear in SERP analysis
- **High-value cluster:** Comparison queries typically convert 2–3× higher than non-comparative equivalents in B2B
- **Natural fit:** Can be sections within existing pages (partners/, services/*) or standalone URLs, decided via GSC data post-deploy
- **Low conflict:** No cannibalization risk — comparison intent is unowned, so new coverage is pure upside

### Scope

**In scope (Phase 1 — auditing):**
- Analyze SERPs for "vs." variants of primary intents (e.g., "outsourced bookkeeping vs. in-house", "white label vs. freelance")
- Categorize: owned by competitors, owned by yourself (unlikely), unowned
- Estimate search volume per competitor SERP (Bing Webmaster Tools data once owner dep 3 lands)

**In scope (Phase 2 — writing, if approved post-audit):**
- Draft 2–3 comparison sections/pages as part of post-checkpoint content refresh
- Structure: head-to-head comparison table + narrative on why outsourcing works for your model

**Out of scope:**
- Building a "comparison tool" (interactive, dynamic comparison matrix — too large in scope)
- Comparison content for non-commercial intents (e.g., "bookkeeping software comparisons") — no direct link to lead generation

### Measurement

**Instrument:** GSC Performance
- New impressions and clicks on pages/sections targeting "vs." queries
- CTR and average position for comparison query cluster

**Tier 2 proxy:** Monitor lead source from "/services/*" pages to isolate comparison traffic from base bookkeeping/payroll demand.

**Checkpoint:** 4 weeks post-deploy for phase 1 (audit); if approved, 12 weeks after new pages/sections deploy.

### Why it matters (if proven)

- Unlock a new query cluster with higher conversion intent
- Establish competitive positioning on a new dimension (not just "we do X" but "why outsourced is better than Y")
- Expands total addressable query volume without cannibalizing existing pages

### Decision required

Approved → begin Phase 1 audit immediately post-deploy  
Deferred → close; revisit after EXP-001…008 deliver results

---

## Priority Ranking for Decision

**Tier A (ship with EXP-001…008):**
- EXP-011 (AI Answer Extractability) — can start immediately, costs only content restructuring
- EXP-009 (Entity Signals) — single file, no dependencies beyond data collection

**Tier B (ship in wave 2, post-EXP-001…008 checkpoint):**
- EXP-010 (IndexNow) — natural fit to deploy automation, measurable immediately
- EXP-012 (Comparison Intent) — requires GSC data post-deploy for audit phase

---

## Next Step

Schedule a decision call to approve which experiments proceed to implementation, or defer all four pending post-checkpoint review of EXP-001…008.
