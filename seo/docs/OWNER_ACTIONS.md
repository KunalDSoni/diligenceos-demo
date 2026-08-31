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

## 4. Plausible account
**Blocks:** AI referral attribution and the `/schedule/` conversion event.

Create the account for `dosacc.com`, then supply the script host. The site's
Content-Security-Policy currently blocks all third-party scripts
(`script-src 'self' 'unsafe-inline' https://s3.tradingview.com`), so `.htaccess`
needs the Plausible host added to `script-src` and `connect-src`. That change is
prepared but not applied, because applying it without an account would ship a
broken tag to production.

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
