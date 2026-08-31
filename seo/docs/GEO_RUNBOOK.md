# GEO prompt panel — runbook

Operationalises spec section 5.7. Run **biweekly**. Roughly 45 minutes per run.

## Rules

1. **The panel is frozen.** Never edit, add, or remove a prompt in
   `PROMPT_PANEL.csv`. Changing the instrument mid-programme destroys the
   longitudinal series. If a prompt becomes obsolete, mark it in a `Notes` column
   and keep asking it.
2. **Ask each prompt verbatim.** No rephrasing, no follow-ups, no added context.
3. **Use a fresh session per prompt** — logged out or in a private window where the
   engine allows it. Personalisation and conversation memory contaminate results.
4. **Record what you observe, not what you hoped for.** A run where DiligenceOS is
   never cited is a valid, useful data point.

## Engines

| Engine | Access |
|---|---|
| ChatGPT | Requires a signed-in account. Web search enabled. Its results have historically drawn on Bing's index, so Bing coverage matters here. |
| Perplexity | **Requires a signed-in account.** Verified 2026-08-31: a logged-out query returns "Sign up and repeat your request" instead of an answer. |
| Google AI Mode | Requires a signed-in Google account. |

**All three engines now require authentication, so this panel is an owner-run
task.** It was not possible to capture a first data point automatically. Sign in to
each engine, then work through the panel; the recording rules below are unchanged.

## Recording

Append one row per prompt per engine to `PROMPT_RESULTS.csv`:

| Column | Meaning |
|---|---|
| `Date` | ISO date of the run |
| `Engine` | `ChatGPT` / `Perplexity` / `Google AI Mode` |
| `Prompt_ID` | From `PROMPT_PANEL.csv`, e.g. `CPA-03` |
| `Mentioned` | `YES` if "DiligenceOS" appears in the answer text at all |
| `Cited` | `YES` if a dosacc.com link appears in sources/citations |
| `Citation_URL` | The exact URL cited, or blank |
| `Position` | Ordinal position among cited sources, or blank |
| `Competitors_Mentioned` | Pipe-separated brands named in the answer |
| `Answer_Type` | `list` / `prose` / `comparison table` / `refusal` / `no answer` |

`Mentioned` and `Cited` are separate on purpose: being named without a link and
being linked are different outcomes with different value.

## Why `Competitors_Mentioned` matters

It is the discovery mechanism for `COMPETITORS.csv`. Per spec 5.8 the benchmark set
is **derived, not guessed** — brands that recur across answers become the frozen
competitor set at the end of P0.

## Reading the results

Three independent instruments cover GEO; do not conflate them.

| Question | Instrument |
|---|---|
| Are AI crawlers fetching the site? | `AI_CRAWL_LOG.csv` (server logs) |
| Are AI engines sending traffic? | Plausible referrer segment |
| Are AI engines citing us? | This panel |

Crawling can rise while citations stay flat. That is informative, not a failure —
it separates "can they see us" from "do they choose us."
