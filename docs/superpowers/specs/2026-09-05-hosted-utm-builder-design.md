# Hosted UTM Link Builder — Design

**Date:** 2026-09-05
**Site:** https://dosacc.com (static HTML, Apache, GoDaddy shared hosting)
**Status:** Design — approved
**Supersedes:** the local-only builder from `2026-09-05-utm-tagging-design.md` §7

## 1. Goal

Give the marketing consultant — and any freelancer after them — a link they can open
and use without an account, a login, or a word of training, that cannot produce an
off-convention tag.

**Why the previous design does not serve this.** `seo/utm-builder.html` runs only from
Kunal's own disk. Anyone else tagging a link has to be told the format and trusted to
follow it, which is precisely how `linkedin` and `LinkedIn` become two GA4 rows that
never reconcile.

**Why not a private Claude artifact** (considered and rejected 2026-09-05): a private
claude.ai URL does not open for people outside the owner's organisation. The audience
here is an external consultant today and unknown freelancers later. A tool the intended
user cannot open is not a tool.

The governing requirement, in the owner's words, is that it be **strong and
independent**: no third-party service, no account, no dependency on Claude or on any
particular person remaining available.

## 2. Where it lives

| | |
|---|---|
| Repo path | `tools/utm/index.html` |
| Served at | `https://dosacc.com/tools/utm/` |
| Deployed | Yes — `tools/` is outside every `EXCLUDE` rule in `seo/deploy-manifest.mjs:33` |

Reachable by anyone holding the URL. That is acceptable and deliberate: a link builder
contains no secret. It is a form over a published naming convention.

**Kept out of search** three ways, because an internal tool must never compete with a
real page:

1. `<meta name="robots" content="noindex, nofollow">` in the page
2. `Disallow: /tools/` added to `robots.txt`
3. No `sitemap.xml` entry

## 3. Constraints this page must satisfy

Unlike the retired `seo/` version, this file is a real page on the site and is bound by
the site's own rules.

| Constraint | Source | Consequence |
|---|---|---|
| Fully self-contained — no CDN, no external fonts, no `fetch` | `.htaccess` CSP is `default-src 'self'` | System font stack; all CSS and JS inline |
| Exactly one `<h1>` | `seo/check.mjs:103-105` | One heading; sub-headings are `<h2>` |
| `<title>` present | `seo/check.mjs:96` | Required |
| `noindex` present, **no** canonical | `seo/check.mjs:113-121` | A canonical alongside `noindex` is flagged redundant; omit it |
| `<img>` needs `alt` | `seo/check.mjs:154` | Use no images |
| Internal links must resolve on disk | `seo/check.mjs:158-169` | Only link to `/`, which resolves |
| No `utm_` on an internal link | `seo/check.mjs` guard rail | The built URL is written to a `<textarea>` and to a JS-assigned `href`, never into static markup |

`noindex` also exempts the page from the meta-description, orphan and sitemap checks
(`seo/check.mjs:123-129`, and the `if (p.noindex) continue` at `seo/check.mjs:204`), so
it passes cleanly without pretending to be a marketing page.

## 4. Vocabulary

Unchanged from `seo/docs/UTM_CONVENTION.md` — this design does not redefine it.

Mediums: `social`, `paid-social`, `email`, `qr`, `referral`.
Sources: `linkedin`, `facebook`, `instagram`, `google-business`, `brochure`,
`deck-investor`, `deck-sales`, `outreach`, `signature`, `newsletter`, plus
`partner-<name>` and `event-<name>`.

Selected as **placements** — one dropdown of real-world choices, each mapping to a
(source, medium) pair. Meta ads must carry source `facebook` or `instagram` (the values
GA4 recognises as social networks) with medium `paid-social`, so one source maps to two
mediums and one medium to two sources; a placement list expresses that, two raw fields
do not.

## 5. Campaign names: a curated list, not a log

The retired builder remembered campaign names in the browser and offered them back. That
cannot work here — a hosted static file has no shared storage, and a per-browser list
would show the consultant nothing of what anyone else had used.

**The replacement is stronger.** Active campaigns live in the page as a fixed list,
version-controlled in the repo:

```
2026-q4-hospitality
investor-round
partner-launch
```

A curated vocabulary *prevents* drift; a self-populating log only *records* it. This is
the ordinary practice for a small team and it removes the failure mode entirely.

**With an escape hatch.** A free-text field accepts a new campaign, lowercased and
hyphenated as typed, so an outside consultant starting a push at 9pm is never blocked
waiting on the repo. The list is the default path, not a gate.

Adding a campaign to the list is a repo edit plus one upload. That cost is accepted:
campaigns start rarely, and the list is what keeps four people naming one push the same
way.

## 6. Teaching guards

The audience is someone who does not know this site's conventions. Two selections are
therefore refused rather than served, each with the reason:

**Google Ads → refused.** Google Ads auto-tags every click with `gclid`, and a manual UTM
overrides it and breaks cost and conversion reporting in the linked GA4 property. The
fix is to link GA4 to Google Ads, not to tag the link. This is the most expensive
mistake available in UTM practice and an unbriefed consultant will otherwise make it.

**Google organic search → refused.** Already attributed correctly; there is nothing to
tag, and a URL cannot be tagged before Google serves it anyway.

A third guard warns rather than refuses: **a destination that already carries `utm_`**,
which means someone is tagging an already-tagged link.

## 7. What the page does

One `<h1>`, a short "what this is" paragraph, then:

| Field | Control | Behaviour |
|---|---|---|
| Destination | Text input + `datalist` of the 28 `sitemap.xml` URLs | Pre-filled `https://dosacc.com/`. Accepts anything typed, so a new page does not break the tool |
| Placement | `<select>` | Real-world choices; sets source and medium. Includes the two refused options from §6 |
| Partner / event name | Text input, revealed only for those placements | Suffix for `partner-<name>` / `event-<name>` |
| Medium | `<select>` | Set from the placement, overridable |
| Campaign | `<select>` of curated names, plus "Something else…" revealing a text input | Slugified live |
| Variant | Text input, optional | `utm_content`; slugified |

Output is a readonly `<textarea>` showing the whole URL, with **Copy** and **Open**.
Parameter order fixed: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
`utm_term` and `utm_id` are never emitted.

**Built-in guidance**, so no training is needed: one sentence under each field, and a
short "how to read the results in GA4" note naming the exact report and dropdown.

**Recent links** in `localStorage` — the user's own, this browser only, clearly labelled
as such so nobody mistakes it for a team record. With **Copy all as CSV**. Every read
and write wrapped in `try/catch`; the page renders correctly with no stored value, and
a save that the browser refuses says so rather than claiming success.

## 8. The retired file

`seo/utm-builder.html` is **deleted**, not kept as a fallback. Two builders drifting
apart is the exact failure this session spent its afternoon on, and the hosted page is
strictly better: same vocabulary, more guards, reachable by everyone including its owner.
`seo/docs/UTM_CONVENTION.md` is updated to point at the URL.

## 9. Deployment

`tools/utm/index.html` and `robots.txt` are both deployable and must be uploaded by
FileZilla to the web root, preserving the `tools/utm/` directory structure.
`npm run seo:manifest` will list them.

Verify after upload: `https://dosacc.com/tools/utm/` returns 200,
`https://dosacc.com/robots.txt` contains `Disallow: /tools/`.

## 10. Testing

| What | How |
|---|---|
| Passes the site's own checks | `npm run seo:check` — expect 30 files, 0 errors, 0 warnings |
| Output correctness | In the browser, build one link per medium and assert the exact URL string |
| Slugify | `Q4 Hospitality Push!` → `q4-hospitality-push` |
| Google Ads guard | Selecting it produces no URL and shows the reason |
| Google organic guard | Same |
| Already-tagged destination | Warns |
| Storage refused | Simulate a throwing `localStorage`; page still builds links and says the log cannot be kept |
| Self-contained | `read_network_requests` shows no external request |
| CSP-safe on the live host | After upload, load the page and confirm no CSP violation in the console |
| Not indexable | `robots.txt` served with the rule; page carries `noindex` |

## 11. Success criteria

1. A consultant with the URL and no briefing can build a correct link.
2. No selection or typing can produce an off-vocabulary source or medium.
3. Attempting to tag Google Ads is refused, with the reason.
4. The page does not appear in search and is not in the sitemap.
5. Kunal's own tagging is unaffected by whether Claude, or any account, still exists.
