# SEO & GEO measurement rig

Implements P0 of
[`docs/superpowers/specs/2026-08-31-measurable-seo-geo-design.md`](../docs/superpowers/specs/2026-08-31-measurable-seo-geo-design.md).

**Governing principle:** never optimize a metric merely because it is measurable.
Optimize metrics causally connected to search reach or qualified customer acquisition.

## Files

| Path | What it is |
|---|---|
| `crawl.mjs` | Site crawler producing the fixed-column crawl dataset |
| `parse-access-logs.mjs` | Apache logs -> AI crawler dataset. The only instrument that can see AI bots. |
| `capture-baseline.sh` | One-time immutable baseline capture |
| `baseline/` | **Frozen.** Pre-program state, pinned to a source commit. Never edit. |
| `SEO_CRAWL_BASELINE.csv` | Current crawl. Re-generated after every release. |
| `SEO_CHANGELOG.md` | change -> hypothesis -> outcome history |
| `SEO_QUERY_MAP.csv` | One primary intent per URL. Cannibalization control. |
| `PROMPT_PANEL.csv` | 30 frozen GEO prompts. **Do not edit after creation.** |
| `PROMPT_RESULTS.csv` | Biweekly GEO citation observations |
| `URL_INSPECTION.csv` | Per-URL GSC inspection log |
| `AI_CRAWL_LOG.csv` | Weekly AI crawler hits by user-agent |
| `COMPETITORS.csv` | Benchmark set, derived from data then frozen |
| `COMPETITOR_BENCHMARK.csv` | Monthly fixed-variable competitor observations |
| `METRICS_BASELINE.csv` | Tier 1/2/3 metric values over time |

## Commands

Re-crawl the live site (run after every release, then diff against `baseline/`):

```bash
node seo/crawl.mjs
```

Crawl the working tree instead of production:

```bash
node seo/crawl.mjs --local
```

Parse Apache access logs into the AI crawl dataset (safe to re-run over
overlapping windows — it replaces recomputed weeks rather than adding to them):

```bash
node seo/parse-access-logs.mjs /path/to/access_log
```

Diff the current crawl against the frozen baseline:

```bash
diff <(cut -d, -f1-6 seo/baseline/SEO_CRAWL_BASELINE.csv) <(cut -d, -f1-6 seo/SEO_CRAWL_BASELINE.csv)
```

## Rules that keep the data valid

1. **`crawl.mjs` must not change.** Its parsing rules define comparability across
   captures; its sha256 is recorded in `baseline/PROVENANCE.txt`. If it genuinely
   must change, re-capture the baseline and note the series restart in the changelog.
2. **`PROMPT_PANEL.csv` is frozen.** Editing prompts mid-program destroys the
   longitudinal series.
3. **`baseline/` is immutable.** It is the only record of the pre-program state.
4. **Maximum 2 concurrent experiments, on disjoint instruments.** See spec section 10.
5. **Every production change gets a changelog entry**, including its checkpoint
   decision once the checkpoint arrives.

## Word counts

`crawl.mjs` strips `script`, `style`, and `noscript` before counting prose. This
matters on this site: every page carries its stylesheet inline, so a naive
`sed 's/<[^>]*>//g' | wc -w` overstates length several-fold. Compare only against
numbers produced by this crawler.
