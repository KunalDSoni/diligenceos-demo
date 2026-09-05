# UTM Campaign Tagging — Design

**Date:** 2026-09-05
**Site:** https://dosacc.com (static HTML, Apache)
**Status:** Design — approved

## 1. Goal

Make off-site traffic attributable. Today a click from a LinkedIn post, a Meta ad, a
sales email and a brochure QR code arrive in GA4 as either `linkedin / referral` (one
undifferentiated bucket) or `direct` (no origin at all). The goal is to know which
specific push produced a visit and a `book_meeting_click`.

**Scope boundary:** UTMs are not a change to the website. They are tags appended to
links that point *at* the site, authored in surfaces the owner controls off-site. GA4
captures them with no code change. The deliverable is therefore a *convention*, a tool
that enforces it, and a guard against the one way tagging corrupts data — not site
markup.

## 2. Verified preconditions

Both checked against the live host on 2026-09-05, not assumed:

| Precondition | Evidence |
|---|---|
| GA4 is live and will capture UTMs automatically | `assets/js/analytics.js:36` — `gtag('config', 'G-S93VBWDEMY', …)` |
| Redirects preserve the query string | `GET /index.html?utm_source=linkedin&utm_medium=social&utm_campaign=test` → `301` → `https://dosacc.com/?utm_source=linkedin&utm_medium=social&utm_campaign=test` |
| `www` → apex redirect preserves it too | `GET www.dosacc.com/us?utm_source=test` → `301` → `https://dosacc.com/us?utm_source=test` |
| Tooling in `seo/` never reaches the host | `seo/deploy-manifest.mjs:33` — `EXCLUDE` contains `/^seo\//` |

No `utm_` string exists anywhere in the repo today, so this is greenfield.

## 3. Channel scope

Confirmed with the owner:

- **LinkedIn** — company page posts and leadership sharing from personal profiles
- **Meta — paid** — Facebook/Instagram ads (live spend)
- **Email** — sales outreach, signatures, newsletter
- **Print/offline** — brochure, decks, QR codes
- **Events and partner referrals**
- **Google — organic only.** No Google Ads. This removes the usual hazard: manual UTMs
  on Google Ads links override `gclid` auto-tagging and break cost reporting. Not
  applicable here. Google organic search needs no tagging; only a Google Business
  Profile listing link is worth tagging, since it otherwise reads as `direct`.

## 4. Vocabulary

### 4.1 `utm_medium` — fixed, five values

GA4 sorts traffic into channel groups primarily on medium, so this list is closed. Adding
a sixth value is a decision to be made deliberately, not in passing.

| Value | Used for | GA4 default channel |
|---|---|---|
| `social` | Organic LinkedIn / Facebook / Instagram posts | Organic Social |
| `paid-social` | Meta ads | Paid Social |
| `email` | Sales outreach, signatures, newsletter | Email |
| `qr` | Printed QR codes — brochure, decks, event banners | Unassigned (see §9.2) |
| `referral` | Partner sites, event listings, directories | Referral |

`paid-social` matches GA4's Paid Social medium pattern `^(.*cp.*|ppc|retargeting|paid.*)$`
via the `paid.*` branch. The industry-conventional `paid_social` would behave identically;
the hyphenated form is chosen so that "hyphens, never underscores" is a single rule with
no exception to remember.

### 4.2 `utm_source` — where it was seen

Fixed list, plus two extensible patterns:

`linkedin`, `facebook`, `instagram`, `google-business`, `brochure`, `deck-investor`,
`deck-sales`, `outreach`, `signature`, `newsletter`, `partner-<name>`, `event-<name>`.

### 4.3 `utm_campaign` — the push

Lowercase hyphenated slug, date-prefixed where the push is time-bound:
`2026-q4-hospitality`, `investor-round`, `partner-launch`.

### 4.4 `utm_content` — optional

Distinguishes variants within one campaign: `ad-a` / `ad-b`, `post-1`, `footer-link`.
Only populate it when two variants of the same campaign need separating.

### 4.5 `utm_term` — not used

Reserved for paid search keywords. Google is organic only here, so it stays empty.
`utm_id` is likewise unused; it is only meaningful when importing ad cost data.

## 5. Rules

1. **Lowercase, hyphens for spaces, never underscores.** GA4 treats `LinkedIn` and
   `linkedin` as two distinct sources and will split one campaign across two rows that
   never reconcile.
2. **One campaign name per push, reused across every channel in it.** A Q4 hospitality
   push running on LinkedIn, Meta and email carries `utm_campaign=2026-q4-hospitality`
   on all three, with three different sources. This is the rule that makes the whole
   scheme worth having: it is what allows a single report to rank channels against each
   other rather than presenting three unrelated rows.
3. **Never tag an internal link.** Enforced by §8.
4. **Tag the canonical destination.** No `/index.html`, no `www`, trailing slash as it
   appears in `sitemap.xml`. Avoids a needless redirect hop.
5. **`utm_source` and `utm_medium` are always both present.** GA4 discards a campaign
   with a source but no medium into `(not set)`.

## 6. Deliverable 1 — `seo/docs/UTM_CONVENTION.md`

The rulebook, written for a non-technical owner rather than an analyst. Contents:

- What a UTM is and what it fixes, in three sentences
- The vocabulary tables from §4
- The five rules from §5, each with the failure it prevents
- One worked example per channel, showing the finished URL
- **How to read the results:** Reports → Acquisition → Traffic acquisition, then switch
  the dimension dropdown to *Session campaign*
- The known limits from §9, stated plainly

## 7. Deliverable 2 — `seo/utm-builder.html`

A single self-contained file opened from disk by double-clicking. Never deployed
(`seo/` is excluded from the manifest). No external fonts, no CDN, no network calls —
it must work offline over `file://`, so it uses a system font stack rather than the
site's Google Fonts.

### 7.1 Fields

| Field | Control | Behaviour |
|---|---|---|
| Destination | Text input + `<datalist>` | Pre-filled `https://dosacc.com/`. Datalist holds the 28 URLs from `sitemap.xml`. Autocomplete, **not** a locked dropdown: when a page is added later the list is stale but the field still accepts anything typed, so the tool degrades into mild inconvenience rather than becoming unusable. |
| Source | `<select>` | Fixed list from §4.2. Selecting `partner-…` or `event-…` reveals a text input for the suffix. |
| Medium | `<select>` | Fixed list from §4.1. Auto-set from the chosen source (linkedin → `social`, meta ads → `paid-social`), overridable. |
| Campaign | Text input + `<datalist>` | Slugified live as typed: lowercased, spaces → hyphens, non `[a-z0-9-]` stripped, runs of hyphens collapsed. Datalist is populated from previously used campaign names (§7.3). |
| Content | Text input | Optional. Same slugify. Omitted from the URL when empty. |

### 7.2 Output

A readonly text field holding the assembled URL, a **Copy** button, and an **Open** link
whose `href` is assigned by JavaScript, since it changes as the fields change. A useful
side effect: the file therefore contains no static internal URL bearing `utm_`, so it
would pass §8 even without the `seo/` exclusion.

Parameter order is fixed: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
Values are `encodeURIComponent`-escaped. Building is blocked with an inline message when
campaign is empty, and warns when the destination already carries a query string.

### 7.3 History

`localStorage` under key `dos-utm-history`: an array of
`{ built, url, source, medium, campaign, content }`, newest first, capped at 100 entries.
Rendered as a list beneath the builder, with a **Copy all as CSV** button.

Its real purpose is the campaign datalist in §7.1. Re-offering previously used campaign
names is what stops `2026-q4-hospitality` from becoming `q4-hospitality-2026` three
months later — the drift this whole design exists to prevent. The link log is a
secondary convenience.

Storage is per-browser and can be cleared; every read is wrapped in `try/catch` and the
page renders correctly with no stored value, matching `assets/js/analytics.js:20-25`.

## 8. Deliverable 3 — guard rail in `seo/check.mjs`

A UTM tag on an internal link is the one tagging mistake that silently destroys data:
GA4 reads it as a brand-new session from a brand-new campaign and overwrites the source
that genuinely brought the visitor in. The damage is invisible until the reports are
already wrong, which is precisely what a pre-commit check is for.

**Rule:** for every scanned page, error if any of the following contains `utm_`
(case-insensitive):

- an `<a href>` that is internal — relative, root-relative (`/…`), protocol-relative
  (`//dosacc.com/…`), or absolute against `dosacc.com` / `www.dosacc.com`
- the `<link rel="canonical">` href
- the `og:url` content

The existing internal-link loop at `seo/check.mjs:144` cannot host this: line 146 skips
every `https?:`-prefixed href, so `https://dosacc.com/us?utm_source=x` would pass
straight through. This is a separate pass.

Severity is **error**, not warning — `ERRORS` causes exit 1 and fails the pre-commit hook.

**One supporting change:** `seo/utm-builder.html` would be the first HTML file in `seo/`
and would newly enter `check.mjs`'s `find`. Add `-not -path "./seo/*"` to that command
(`seo/check.mjs:32`). This is correct on its own terms — `seo/` is excluded from deploys,
so auditing it for search defects is meaningless — and no existing behaviour changes,
since `seo/` currently contains no HTML.

## 9. Known limits — stated, not solved

### 9.1 Campaign attribution stops at the booking iframe

`schedule/index.html:126` embeds a Google Calendar appointment schedule. Google Calendar
appointment schedules accept no custom parameters, so the campaign cannot travel into the
booking record; sales will not see "this meeting came from the Meta ad" on the invite.
GA4 still credits the campaign for the `book_meeting_click` event fired at
`assets/js/analytics.js:58`, which answers the same question at the reporting layer.
Out of scope — closing it means replacing the booking tool.

### 9.2 QR traffic lands in *Unassigned*

`qr` is not a medium GA4 recognises, so brochure and print traffic falls outside the
default Channels report. It reads correctly in Traffic acquisition by source/medium.
Accepted deliberately: the alternative is labelling print traffic `referral`, which files
it tidily by asserting something false about where it came from.

### 9.3 Consent gating caps every campaign number

`assets/js/analytics.js:187-201` loads GA4 only after the visitor accepts the banner, and
treats Do Not Track as a decline. A visitor who declines produces no hit, so their UTM is
never recorded. Campaign figures are therefore a *subset* of real traffic, not a census.
This is correct behaviour and is not to be "fixed"; it means campaigns should be compared
against each other, never read as absolute visit counts.

## 10. Testing

| What | How |
|---|---|
| Guard rail fires | Write a fixture page containing `<a href="/us?utm_source=x">`, run `npm run seo:check`, confirm exit 1 and the error names the file. Delete the fixture. |
| Guard rail catches the absolute form | Same, with `href="https://dosacc.com/us?utm_source=x"` — the case the existing loop misses. |
| No false positives | `npm run seo:check` on the clean tree exits as it does today. |
| Builder output | Open in the browser pane, build a link for each of the five mediums, assert the exact URL string. |
| Slugify | Enter `Q4 Hospitality Push!` → `q4-hospitality-push`. |
| History survives reload | Build two links, reload, confirm both listed and both campaigns offered in the datalist. |
| Offline | Confirm the page works over `file://` with no network requests. |

**Owner verification, not automatable here:** accept the cookie banner, load a tagged URL,
and confirm the campaign appears in GA4 Realtime. Requires the live GA4 property.

## 11. Success criteria

1. A link built by the tool cannot carry a typo'd or off-vocabulary source or medium.
2. A campaign name used once is offered back the next time, so the same push keeps one
   name across channels and across months.
3. A UTM on an internal link cannot be committed.
4. The owner can answer "which push brought this booking enquiry?" from one GA4 report,
   without help.
