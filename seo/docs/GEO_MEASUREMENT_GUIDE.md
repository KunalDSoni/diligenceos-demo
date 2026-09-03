# GEO Measurement Guide — AI Answer Extractability (EXP-011)

**Purpose:** Measure whether AI engines (ChatGPT, Perplexity, Claude) extract answers from dosacc.com money pages.

**Blocking factor:** Owner dep 8 (signed-in access to GEO prompt panel and all three AI engines)

**Checkpoint:** 2 weeks post-deploy for initial extraction rate

---

## What is the GEO Prompt Panel?

The GEO ("Generative Engine Optimization") prompt panel is a tool that:
1. Takes a query you provide
2. Runs it through multiple AI engines simultaneously
3. Captures the response and analyzes whether your domain is cited/quoted
4. Tracks extraction rate over time

**Access:** [GEO Prompt Panel] (requires signed-in access to ChatGPT, Perplexity, Claude)

---

## Test Plan for EXP-011 Checkpoint (Week 2)

### Queries to Test

Test each query in all three AI engines:

#### Cluster 1: Bookkeeping Queries

1. **"What does outsourced bookkeeping include?"**
   - Expected answer source: `/services/bookkeeping/` (answer-first paragraph)
   - Benchmark: Should cite or quote service scope (daily recording, reconciliation, close)

2. **"How much does outsourced bookkeeping cost?"**
   - Expected source: `/services/bookkeeping/` (75% cost savings claim)
   - Benchmark: Should mention cost comparison or savings percentage

3. **"Is outsourced bookkeeping secure?"**
   - Expected source: `/services/bookkeeping/` (SOC 2, encryption, controls)
   - Benchmark: Should mention security/compliance features

#### Cluster 2: Partnership Queries

4. **"What is white-label bookkeeping for CPA firms?"**
   - Expected source: `/partners/` (partnership models)
   - Benchmark: Should explain white-label model and CPA/firm positioning

5. **"What are partnership models for accounting services?"**
   - Expected source: `/partners/` (referral, white-label, alliance)
   - Benchmark: Should mention 2+ partnership types

#### Cluster 3: Advisory Queries

6. **"What does a part-time CFO do?"**
   - Expected source: `/services/advisory/` (part-time CFO scope)
   - Benchmark: Should mention strategic guidance, forecasting, or board reporting

### Testing Procedure

**For each query:**

1. **Open GEO panel** and run the query through all three engines (ChatGPT, Perplexity, Claude)

2. **Capture response:**
   - Screenshot the full response (including citations)
   - Note if dosacc.com is mentioned/linked
   - Copy the exact quote used (if any)

3. **Rate extraction:**
   ```
   Extraction Rate:
   - ✅ Full citation: Page quoted or linked directly
   - ✓ Partial: DiligenceOS or dosacc.com mentioned without direct quote
   - ✗ None: Answer comes entirely from competitors or non-specific
   ```

4. **Note engine behavior:**
   - ChatGPT: Does it link to the page?
   - Perplexity: How prominent is the citation?
   - Claude: Does it quote verbatim or paraphrase?

### Sample Data Capture Template

```markdown
## Query: "What does outsourced bookkeeping include?"

### ChatGPT
- Citation: [SCREENSHOT]
- Extraction: ✅ Full (cited /services/bookkeeping/)
- Quote: "Daily transaction recording, bank reconciliations, AP/AR, and a 21-step monthly close"
- Link: Yes, https://dosacc.com/services/bookkeeping/

### Perplexity
- Citation: [SCREENSHOT]
- Extraction: ✓ Partial (mentioned but no direct quote)
- Quote: None
- Link: No direct link

### Claude
- Citation: [SCREENSHOT]
- Extraction: ✓ Partial (paraphrased answer-first content)
- Paraphrase: "Including daily bookkeeping tasks like reconciliation and monthly closes"
- Link: No, but content clearly sourced

**Summary:** 1/3 full extraction (ChatGPT), 2/3 partial/recognized
```

---

## Interpretation & Decision Gate

### Week 2 Checkpoint (Initial Measurement)

**Extract success rate:**
- ✅ **≥ 60% of queries show extraction** → EXP-011 is working; approve continued measurement
- ⚠️ **30-60% extraction** → Extraction is happening but inconsistent; content restructuring working partially
- ❌ **< 30% extraction** → Experiment is not working; may need content rewrites or different answer structure

### Week 4 Checkpoint (Extended Measurement)

**Repeat the same 6 queries.** Expected trend:
- Extraction rate should be **stable or increasing** (as AI engines index more recent content)
- Bing index should include /opportunity/ pages (measured separately via crawl)

**If extraction rate is increasing:**
- ✅ Answer-first format is helping AI engines surface your content
- Proceed with full 12-week measurement

**If extraction rate is flat or declining:**
- ⚠️ May indicate AI engines are using cached/older content
- Consider: (1) adding more answer-first content, (2) checking if pages are crawled by AI bots, (3) verifying structured data

---

## Measurement Infrastructure

### What to Capture

For each checkpoint (Week 2, Week 4, etc.):

```
Date:               [YYYY-MM-DD]
Checkpoint:         [Week 2 | Week 4 | Week 6 | etc.]
Queries Tested:     [# of queries]
Engines Tested:     [ChatGPT | Perplexity | Claude]
Full Extraction:    [# queries cited directly / total]
Partial Extraction: [# queries mentioned without quote / total]
No Extraction:      [# queries missing / total]
Avg Extraction:     [% from all engines]
Notes:              [observed patterns, engine differences]
```

### Tracking Dashboard

Create a simple spreadsheet to track extraction rate over time:

```
Week 2:  45% extraction (1/6 full, 2/6 partial)
Week 4:  58% extraction (2/6 full, 2/6 partial)
Week 6:  67% extraction (3/6 full, 2/6 partial)
Week 12: 75% extraction (4/6 full, 2/6 partial)
```

---

## Ownership & Timing

**Who:** You (owner) + team member with access to GEO panel + signed-in AI accounts

**When:**
- **Week 2 post-deploy:** Initial checkpoint (validate answer-first format is working)
- **Week 4 post-deploy:** Extended measurement (confirm trend)
- **Week 12 post-deploy:** Final checkpoint (compare to Tier 2 SEO metrics from other experiments)

**Time investment:** ~30 min per checkpoint (6 queries × 3 engines, screenshot and rate each)

---

## What to Do If Extraction Fails

**If <30% of queries extract answers:**

1. **Check page crawl status** (AI bots)
   - Verify /services/bookkeeping/, /partners/, etc. are in Bing index (requires GSC)
   - Check if ChatGPT-User / GPTBot visited the pages (AI crawl log)

2. **Verify answer quality**
   - Run answer paragraphs through readability checker
   - Are they clear and standalone (not dependent on surrounding context)?
   - Is the answer length in line with what AI engines quote (usually 1-3 sentences)?

3. **Consider rewrites**
   - If answers are too long or jargon-heavy, condense and simplify
   - Make sure answer directly responds to the query (not just related content)

4. **Monitor over time**
   - Extraction may lag 2-4 weeks behind page indexing
   - Don't abandon based on Week 2 data alone; measure through Week 12

---

## Success Definition

**EXP-011 is a success if:**

1. ✅ Extraction rate ≥ 50% by Week 4 (at least half the test queries cite dosacc.com)
2. ✅ Extraction rate **stable or growing** through Week 12
3. ✅ Non-brand organic clicks from AI referrers increase (measured via Plausible source tracking, tied to CRM when available)

---

## References

- Spec: EXP-011 in `docs/superpowers/specs/2026-09-03-seo-extensions-exploratory.md`
- Money pages updated: `/partners/`, `/services/bookkeeping/`, `/services/advisory/`, `/us/`, `/au/`
- Answer-first paragraph pattern: First sentence after H2, direct response to intent, AI-extractable
- Owner dep 8: Signed-in access to GEO prompt panel (all three engines)
