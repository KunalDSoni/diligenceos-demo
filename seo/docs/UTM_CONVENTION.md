# UTM campaign tagging — the convention

## What this is

A UTM is a short tag added to the end of a link that points **at** dosacc.com. You add
it wherever the link is published — a LinkedIn post, a Meta ad, an email, a QR code on a
brochure. Google Analytics reads the tag the moment somebody lands, so nothing on the
website itself has to change.

Without tags, a click from a sales email and a click from someone typing the address in
look identical in GA4: both are `direct`. Every LinkedIn post collapses into one row
called `linkedin`. Tagging is what separates them.

## Build links with the tool, not by hand

**https://dosacc.com/tools/utm/**

Open it in any browser, on any device. No login. Send that URL to anyone who needs to tag
a link — consultants and agencies included.

Pick the destination page, pick where the link is going, pick the campaign, copy the
result. That is the whole job. Building links by hand is how the vocabulary below rots.

The page is `noindex` and excluded in `robots.txt`, so it never appears in search or
competes with a real page.

**Adding a campaign:** the campaign dropdown is a fixed list in `tools/utm/index.html`
(the `CAMPAIGNS` array). Add a name there and re-upload the file. Anyone can still type a
new campaign in the tool when they need one, so nobody is ever blocked waiting for that.

---

## The vocabulary

### Medium — five values, and only these five

GA4 sorts traffic into channels mainly on the medium, so this list is closed. Adding a
sixth is a decision to make deliberately, not in passing.

| Value | Used for | Where it lands in GA4 |
|---|---|---|
| `social` | Organic LinkedIn / Facebook / Instagram posts | Organic Social |
| `paid-social` | Meta ads | Paid Social |
| `email` | Sales outreach, signatures, newsletter | Email |
| `qr` | Printed QR codes — brochure, decks, event banners | Unassigned (see below) |
| `referral` | Partner sites, event listings, directories | Referral |

### Source — where the link was seen

`linkedin`, `facebook`, `instagram`, `google-business`, `brochure`, `deck-investor`,
`deck-sales`, `outreach`, `signature`, `newsletter`, and the two patterns
`partner-<name>` and `event-<name>`.

**Meta ads use `facebook` or `instagram`, not `meta`.** GA4 only files a click under Paid
Social when it recognises the source as a social network, and it has never heard of
`meta`. The builder handles this for you: pick the placement, it picks the pair.

### Campaign — the push itself

Lowercase, hyphenated, dated when the push is time-bound: `2026-q4-hospitality`,
`investor-round`, `partner-launch`.

### Variant — optional

`utm_content`, for telling two versions of the same campaign apart: `ad-a` / `ad-b`,
`post-1`. Leave it empty unless you actually need the split.

### Two tags we never use

`utm_term` is for paid search keywords, and we run no paid search. `utm_id` only matters
when importing ad cost data into GA4. Both stay empty.

---

## The five rules

**1. Lowercase, hyphens, never underscores or spaces.**
GA4 treats `LinkedIn` and `linkedin` as two different sources. One campaign spelled two
ways becomes two rows that never add up, and you will not notice until you are trying to
work out why the numbers are half what you expected.

**2. One campaign name per push, reused across every channel in it.**
This is the rule that makes tagging worth doing. A Q4 hospitality push running on
LinkedIn, on Meta and by email carries `utm_campaign=2026-q4-hospitality` on all three,
with three different sources. That is what lets one report rank the channels against each
other. Give each channel its own campaign name and you get three unrelated rows instead.

The builder's link log exists to protect this rule: it offers back every campaign name
you have used before, so a push cannot quietly acquire a second spelling three months
later.

**3. Never tag a link that is already on the site.**
This is the one mistake that destroys data rather than just muddling it. GA4 reads a
tagged internal click as a brand-new visit from a brand-new campaign, and throws away the
source that genuinely brought that person in.

`npm run seo:check` now fails the commit if anyone tries, with:

```
ERROR  index.html: UTM tag on an internal link: /us?utm_source=x
```

Links pointing *away* from the site are fine to tag — that is the entire point of
tagging.

**4. Tag the clean destination.**
No `/index.html`, no `www.`, and keep the trailing slash where `sitemap.xml` has one.
The redirects preserve tags correctly either way, but a tidy URL skips a needless hop.

**5. Source and medium are always both present.**
A campaign arriving with a source but no medium is filed by GA4 under `(not set)`. The
builder cannot produce one, which is a good reason to use it.

**6. Never hand-tag Google Ads.**
Google Ads tags every click itself with a `gclid`. A manual UTM overrides it and breaks
cost and conversion reporting for the whole account. Link GA4 to Google Ads instead:
GA4 Admin → Product links → Google Ads links. The builder refuses to produce a Google Ads
link for this reason, and says so.

---

## Worked examples

| Where | Link |
|---|---|
| LinkedIn post | `https://dosacc.com/hospitality-accounting/?utm_source=linkedin&utm_medium=social&utm_campaign=2026-q4-hospitality` |
| Meta ad, Instagram placement, first creative | `https://dosacc.com/hospitality-accounting/?utm_source=instagram&utm_medium=paid-social&utm_campaign=2026-q4-hospitality&utm_content=ad-a` |
| Sales outreach email | `https://dosacc.com/schedule/?utm_source=outreach&utm_medium=email&utm_campaign=2026-q4-hospitality` |
| Email signature | `https://dosacc.com/?utm_source=signature&utm_medium=email&utm_campaign=signature-evergreen` |
| Brochure QR code | `https://dosacc.com/brochure/?utm_source=brochure&utm_medium=qr&utm_campaign=2026-brochure-print` |
| Partner site link | `https://dosacc.com/partners/?utm_source=partner-acme&utm_medium=referral&utm_campaign=partner-launch` |

Note the first three: same campaign, three sources. That is rule 2 doing its work.

---

## How to read the results

In GA4: **Reports → Acquisition → Traffic acquisition**, then change the dimension
dropdown at the top-left of the table from *Session default channel group* to
**Session campaign**.

That gives you sessions per push. To compare pushes on outcomes rather than visits, add
`book_meeting_click` as the metric — it needs to be marked as a key event first, which is
step 9 in [`OWNER_ACTIONS.md`](OWNER_ACTIONS.md).

Give it 24-48 hours. GA4 is not real-time outside its Realtime report.

---

## What this will not tell you

Three limits, stated plainly so they do not come as a surprise later.

**The campaign does not reach the meeting invite.** The booking page embeds a Google
Calendar appointment schedule, which accepts no parameters we can pass through it. Sales
will not see "this booking came from the Meta ad" on the invite. GA4 still credits the
campaign for the `book_meeting_click` event, so the question is answerable in the
reports — just not on the calendar entry.

**Print and QR traffic sits under *Unassigned*.** `qr` is not a channel Google
recognises, so brochure and deck traffic falls outside GA4's tidy Channels report. Read
it in Traffic acquisition instead, where it appears correctly as `brochure / qr`. The
alternative was to label print traffic `referral`, which would file it neatly by
asserting something untrue about where it came from.

**Visitors who decline cookies are never counted.** Analytics only loads after someone
accepts the consent banner, and Do Not Track counts as a decline. So these figures are a
subset of real traffic, not a headcount. Compare campaigns *against each other* — never
quote a campaign's session count as the number of people who saw it.
