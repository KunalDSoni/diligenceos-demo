# Brief — deepen `/services/bookkeeping/`

```
Experiment:      EXP-006 (CONTENT)
Primary intent:  outsourced bookkeeping services
Query cluster:   outsourced bookkeeping company | virtual bookkeeping services |
                 remote bookkeeping services | bookkeeping outsourcing
Current depth:   457 prose words
Instrument:      GSC Performance, page-filtered, measured on the query cluster
Checkpoint:      12 weeks after deploy
Priority:        2 of 5
Dependency:      Do not deploy while EXP-003 (title/description) is still inside
                 its own 4-week checkpoint. Both read GSC Performance for this
                 exact URL; overlapping them makes neither attributable.
```

## Positioning

EXP-003 retitled this page to **SMBs**, deliberately dropping "& CPA Firms" so it
stops competing with `/partners/`. The content must follow that split: this page
is for a business owner buying bookkeeping for their own company, not for a firm
buying capacity.

## What an SMB buyer needs answered

- `[NEEDED: pricing]` — the current description claims "up to 75% less than
  in-house." What is the actual model — monthly tiers by transaction volume, by
  hours? The 75% figure needs a stated basis or it should be removed; an
  unsupported savings claim is a liability.
- `[NEEDED: scope boundaries]` — exactly what is and is not included. Where does
  bookkeeping end and `/services/advisory/` begin?
- `[NEEDED: software]` — the homepage FAQ lists QuickBooks, Xero, NetSuite,
  FreshBooks, Wave. Which are fully supported vs. supported on request?
- `[NEEDED: close timeline]` — how many business days to a monthly close?
- `[NEEDED: deliverables]` — which reports, in what format, on what cadence?
- `[NEEDED: communication]` — named contact, response times, meeting cadence.
- `[NEEDED: catch-up work]` — is backlog cleanup in scope, and priced how? This
  matters: "bookkeeping backlog" is the one P2 candidate that passed the gate's
  uniqueness test, and it may belong here as a section rather than as its own page.
- `[NEEDED: transition out]` — what a client takes with them if they leave. The
  homepage FAQ promises full documentation; state it here.

## Structure

1. H1 — already good
2. Who it is for — SMB profile
3. What is included — by task, with explicit exclusions
4. How the monthly close works — timeline
5. Software and integrations
6. Pricing model
7. Catch-up and backlog cleanup — *decide: section here, or its own page*
8. Security and data handling
9. Proof — `[NEEDED: 2–3 anonymised outcomes]`
10. CTA to `/schedule/`

## Decision this brief must resolve

**Does "bookkeeping backlog / catch-up bookkeeping" become a section of this page,
or its own page?** It is the only P2 candidate that passed the uniqueness test.
Resolve it against GSC data once available:

- Distinct, substantial query demand → its own page, added to `SEO_QUERY_MAP.csv`
  with its own primary intent
- Demand mostly overlapping "outsourced bookkeeping" → a section here

Do not build it as a separate page before that data exists. Guessing wrong creates
a cannibalization problem that costs more to unwind than it saves.
