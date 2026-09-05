# Actions only the site owner can take

These are the dependencies in spec section 11. Each blocks specific work, noted
below. Nothing here can be completed from the codebase.

## 1. DNS access — Google Search Console
**Blocks:** all GSC-dependent measurement (indexation, non-brand clicks, URL
Inspection, Core Web Vitals field data, Search Appearance).

Verify `dosacc.com` as a **Domain property**, not a URL-prefix property, so every
subdomain and protocol falls under one property.

1. Search Console -> Add property -> **Domain** -> `dosacc.com`
2. Add the supplied TXT record at the registrar
3. Verify, then submit `https://dosacc.com/sitemap.xml`

GSC backfills **no** data from before verification, so every day unverified is a
day of history permanently lost.

### If DNS access is not available: verify today anyway

A Domain property is the better end state, but it is not worth waiting for. A
**URL-prefix property** verified by HTML file needs only FTP access, which the
owner already has:

1. Search Console -> Add property -> **URL prefix** -> `https://dosacc.com`
2. Choose **HTML file** verification and download the `google*.html` file
3. Upload it to the web root with FileZilla, alongside `index.html`
4. Confirm it loads at `https://dosacc.com/google<...>.html`, then click Verify
5. Submit `https://dosacc.com/sitemap.xml`

Keep the file on the server permanently; removing it un-verifies the property.

This starts the data clock immediately. Add the Domain property later when DNS
access lands - the two coexist, and the URL-prefix history is not lost.

## 2. Raw Apache access logs
**Blocks:** all AI crawler measurement (`parse-access-logs.mjs`).

Needed: raw access logs in Apache combined format, via cPanel (Raw Access Logs) or
SSH. Enable log archiving/retention so logs survive rotation.

If unavailable, AI crawl measurement is impossible by any other route — client-side
analytics cannot see AI bots, because they do not execute JavaScript. In that case
GEO proceeds on referrals and the prompt panel only, and AI crawl volume is recorded
as out of scope rather than silently dropped.

## 3. Bing Webmaster Tools
**Blocks:** Bing index coverage, and one GEO signal.

Not filler: ChatGPT's web results have historically drawn on Bing's index, making
this one of very few GEO levers with a free first-party instrument. Verification can
be imported directly from Search Console once step 1 is done.

## 4. ~~Plausible account~~ — RESOLVED 2026-09-04 by GA4

Superseded. Google Analytics 4 (`G-S93VBWDEMY`) is deployed and verified
receiving live data, so this dependency no longer blocks anything.

Now measurable that previously was not:

- `/schedule/` booking completions — `book_meeting_click` event
- Contact conversions — `form_submit` and `email_click` events
- Referral attribution, including AI referrers, via GA4 acquisition reports

The CSP problem this section predicted was real and did occur: the tag loaded
but sent nothing, because `connect-src` was not updated alongside `script-src`.
Both are now set for the Google hosts. **The failure mode is worth recording -
with the script allowed and the beacon blocked, the console stays silent and the
property simply reports no traffic, which is indistinguishable from a correct
install with no visitors.** Any future third-party tag needs both directives.

Note the CSP still blocks the host's own injected tracker
(`img1.wsimg.com/traffic-assets/js/tccl.min.js`). That is deliberate: it is not
ours and is not disclosed in `privacy.html`.

## 5. Canonical phone number per office
**Blocks:** NAP normalization, `LocalBusiness` schema, and all Google Business
Profile work.

The site currently publishes conflicting numbers. **These are real business facts
and must not be guessed** — they need confirming by the business:

| Where | Number | Issue |
|---|---|---|
| Homepage, `/schedule/`, `/brochure/`, `/hospitality-accounting/` | `+1 (708) 629-1744` | Also the number in the homepage `Organization` JSON-LD |
| `/us/` only | `+1 (302) 231-1438` | Not used anywhere else |
| `/us/` only | `+1 (302) 231-1573` | Not used anywhere else |
| Homepage, `/brochure/`, `/au/`, `/hospitality-accounting/` | `+61 7 2115 0821` | **`+61 7` is a Queensland area code.** The stated offices are Sydney NSW 2000 and Melbourne VIC 3000; NSW landlines are `+61 2`. |

Required: one canonical number per office, for these four offices:

- 919 North Market St, Suite 950, Wilmington, DE 19801
- Schaumburg, IL 60193
- Sydney, NSW 2000
- Melbourne, VIC 3000

Schema that contradicts on-page NAP is worse than no schema — it produces
conflicting entity signals.

## 6. Google Business Profile
**Blocks:** local pack work in P3.

One profile per office, each verified (usually by postcard). Must match the
canonical NAP from step 5 exactly.

## 7. CRM access, or confirmation none exists
**Blocks:** nothing. Determines only whether the Tier 1 metric is organic qualified
leads, or remains `/schedule/` completions as the interim measure.

## 8. Signed-in access for the GEO prompt panel
**Blocks:** the first prompt-panel data point, and every one after it.

Verified 2026-08-31: Perplexity no longer answers logged-out queries — it returns
"Sign up and repeat your request." ChatGPT and Google AI Mode already required
sign-in. All three engines are therefore gated, which makes the biweekly panel run
an owner task rather than an automatable one.

Procedure is in [`GEO_RUNBOOK.md`](GEO_RUNBOOK.md). Roughly 45 minutes per run,
30 prompts x 3 engines. The panel is frozen — ask each prompt verbatim, in a fresh
session, and record what you observe rather than what you hoped for.

## 9. GA4 key events, for comparing campaigns on outcomes
**Blocks:** nothing for capture. Blocks only the ability to rank campaigns by result
rather than by visit count.

UTM campaign tagging needs **no GA4 configuration at all** — GA4 reads the tags the
moment a tagged link is opened. The convention and the link builder are in
[`UTM_CONVENTION.md`](UTM_CONVENTION.md).

The one owner action is a five-minute one, in GA4 → Admin → Events. Confirm these three
are toggled **Mark as key event**:

- `book_meeting_click`
- `form_submit`
- `email_click`

Without that, a campaign can only be compared on sessions, which says how many people a
push reached and nothing about whether it worked. Events appear in this list only after
they have fired at least once, so if one is missing, trigger it on the live site first.
