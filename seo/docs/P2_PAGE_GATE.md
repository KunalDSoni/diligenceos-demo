# P2 page gate — results

Applies the four-test gate from spec section 7 to the P2 candidate set.
**Page count is an output of this gate, not a target.**

## Result: 1 of 4 candidates passes

| # | Candidate intent | T1 unique | T2 opportunity | T3 distinct | T4 business value | Verdict |
|---|---|---|---|---|---|---|
| 1 | outsourced accounting services | **FAIL** — owned by `/` | — | — | — | **REJECT** |
| 2 | white label bookkeeping | **FAIL** — owned by `/partners/` | — | — | — | **REJECT** |
| 3 | accounting outsourcing for CPA firms | **FAIL** — in `/partners/` cluster | — | — | — | **REJECT** |
| 4 | bookkeeping backlog / catch-up bookkeeping | PASS — unowned | PENDING GSC | PASS | PASS | **HOLD** |

Tests 2–4 are not evaluated once test 1 fails; a page that would cannibalize an
existing URL is rejected regardless of its other merits.

Candidate 4 passes uniqueness but **cannot clear test 2 yet**. Demonstrated
opportunity requires GSC data or SERP observation, and GSC is blocked on owner
dependency 1. It is held, not approved.

## Why three candidates were rejected

The P2 list in the spec was written before `SEO_QUERY_MAP.csv` existed. Checked
against the map, three of the four intents are already assigned to live URLs:

```
outsourced accounting services         -> /            (homepage)
white label bookkeeping                -> /partners/
accounting outsourcing for CPA firms   -> /partners/   (same cluster)
```

Building them would have created precisely the cannibalization the query map
exists to prevent, and the first symptom would have been a Google-selected
canonical diverging from the declared one — the signal spec 6.4 nominates as the
earliest detectable evidence of duplication.

## What the baseline says instead

The measured baseline points at a different constraint. The problem is not that
DiligenceOS lacks pages for its commercial intents — it has them. The problem is
that those pages are **thin**:

| URL | Owns intent | Prose words |
|---|---|---|
| `/partners/` | white label bookkeeping for CPA firms | **374** |
| `/services/advisory/` | CFO advisory services | 432 |
| `/services/payroll/` | outsourced payroll services | 437 |
| `/services/forecasting/` | financial forecasting services | 448 |
| `/services/bookkeeping/` | outsourced bookkeeping services | 457 |
| `/us/` | outsourced accounting services US | 1,090 |
| `/au/` | outsourced accounting services AU | 1,063 |
| `/hospitality-accounting/` | hospitality accounting services | 1,612 |

Site-wide prose totals **12,156 words across 20 pages**.

`/partners/` targets the highest-value commercial term on the site — CPA firms
seeking white-label capacity, the segment with the largest contract value — in
374 words.

## Recommendation

**Reprioritise P2 from page creation to page depth.** Deepening a page that
already owns its intent is strictly better than building a second page for the
same intent: it concentrates rather than splits signal, it carries no
cannibalization risk, and it is measurable on exactly the same instrument
(per-page impressions and average position for the declared query cluster).

Suggested order, highest contract value first:

1. `/partners/` — 374 words, highest-value intent
2. `/services/bookkeeping/` — head commercial term
3. `/services/payroll/`, `/services/advisory/`, `/services/forecasting/`

Each deepening is a CONTENT experiment under the same protocol: one declared
primary intent, measured on its query cluster, 12-week checkpoint, kill criteria
applied at the checkpoint.

## Why no content was written in this pass

Deepening these pages requires facts that exist only inside the business —
service scope and exclusions, pricing structure, onboarding steps, SLAs, team
composition, security and compliance specifics, named client outcomes. Writing
them without those facts would mean inventing claims about a real company's
services, which is the same failure mode as inventing the missing phone numbers
in owner dependency 5.

The blocking input is a content brief filled in by the business, not engineering
time.
