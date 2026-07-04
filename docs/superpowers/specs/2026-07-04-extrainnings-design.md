# /extrainnings — Premium DOSACC Landing Page — Design Spec

**Date:** 2026-07-04
**URL:** `https://dosacc.com/extrainnings` → `extrainnings/index.html`
**Status:** Approved by user (direction + section flow + content decisions)

## Goal

A standalone, enterprise-grade landing page presenting DiligenceOS's offshore
accounting partnership offer to US CPA/EA firms. Design language adapted from
the Biotiix Framer template family (home-01, pricing-01, features, about-us);
content is 100% the user-supplied DOSACC copy, preserved verbatim. The page
should read like a $250k SaaS site: Apple/Stripe/Linear-class polish.

## Non-negotiable content rules

- Every sentence, heading, bullet, and price from the two supplied content
  sets appears exactly as written — no rewriting, summarizing, adding, or
  shortening. (Exception approved by user: two lines omitted, see below.)
- No copy, graphics, icons, or screenshots from Biotiix. Design language only.
- Functional microcopy (nav labels, button labels like "Book your free
  consultation", section pill-labels naming the section) is permitted; no new
  marketing claims.

### Approved content decisions

- **URL**: `/extrainnings` (corrected spelling; brief's "extrainnigs" was a typo).
- **Branding**: DiligenceOS name + indigo `#635bff` accent (site brand).
- **Page type**: standalone landing (own minimal sticky nav), like /brochure.
- **Pricing**: show BOTH sets — email's 4 hourly tiers as primary cards, and
  the document's 2 dedicated monthly plans as a visually distinct
  "Dedicated Full-Time Professionals" engagement-model panel.
- **Trial offer**: the document's Complimentary One-Week Evaluation is the
  featured CTA. Email's "20-hour free trial" bullet **omitted** (user approved).
- **Time zone**: document's full ET/CT/MT/PT coverage. Email's "we operate
  until 2:00 PM Eastern" line **omitted** (user approved).
- **Trust stats**: email's figures (100+ CPAs & EAs, 40–50% overhead
  reduction, up to 40% quarterly growth, up to 60% cost cut) are approved
  supplied copy and power the stats section.
- Email correspondence framing ("Good afternoon… thanks for your time on the
  call today", "I'll follow up with a call on Next week", scheduling lines,
  "I've attached our brochure") is letter furniture, not page copy — excluded.
  The brochure reference is honored via a Download Brochure CTA → `/brochure`.

## Design language (extracted from Biotiix CSS, translated to DiligenceOS)

- **Font**: Inter (Google Fonts, already used site-wide).
- **Type scale**: H1 clamp(~40→64px), weight 500–600, letter-spacing ≈ −0.04em,
  line-height 1.1; H2 ~40px, −0.035em, lh 1.2; body 16–18px, lh 1.7;
  pill labels 12–13px uppercase/medium.
- **Palette**:
  - Ink `#0e0d1a` (near-black, cool-shifted to suit indigo), secondary `#4b4a57`
  - Backgrounds: white + alternating off-white bands `#f7f7fb` / `#f2f1f9`
  - Accent: indigo `#635bff`; deep hover `#5147e5`; soft tint `#eeedff`
  - Hairline borders `rgba(14,13,26,.08)`
- **Surfaces**: cards radius 20–24px; hero/CTA bands radius up to 32px; soft
  ambient shadow `0 4px 40px rgba(0,0,0,.05)` + hover elevation
  `0 12px 32px rgba(99,91,255,.12)`.
- **Rhythm**: every section = pill label → tight H2 → supporting copy → cards;
  alternating white/off-white backgrounds; generous 96–140px section padding.
- **Hero atmosphere**: floating indigo/violet radial-gradient blobs, slow CSS
  drift animation, subtle grain-free glass card accents.
- **Animations**: IntersectionObserver reveal (fade + 24px rise, staggered
  `--d` delays, matching existing site pattern), animated counters on stats,
  card hover lift, button micro-interactions. `prefers-reduced-motion`
  disables all. No scroll-jacking.
- **Responsive**: breakpoints 1200px, 810px, 480px. No horizontal overflow;
  pricing cards wrap 4→2→1; alternating features stack.

## Architecture

Single self-contained file `extrainnings/index.html` (embedded CSS + JS),
consistent with repo convention (each page self-contained; Google Fonts +
Font Awesome CDN allowed). No build step. SEO head: title, description,
canonical `https://dosacc.com/extrainnings`, OG tags reusing
`/og-image.png`. Add to `sitemap.xml`.

Sticky nav: DiligenceOS wordmark (links to `/`), anchor links (Services,
Why Us, Security, Pricing, Evaluation), CTA button "Book your free
consultation" → `/schedule`. Collapses to logo + CTA on mobile.

Footer: minimal — wordmark, email `sales@dosacc.com`, phone
`+1 (708) 629-1744`, links to `/`, `/brochure`, `/schedule`, `/privacy`,
`/terms`.

## Section flow and content mapping

1. **Hero** — H1: "Our objective is simple—to become an extension of your
   team rather than just another outsourcing provider." ("extension of your
   team" in indigo). Sub: "We specialize in providing Bookkeeping,
   Accounting, Payroll, Audit, CFO, and Tax Preparation services, all at
   competitive rates without compromising quality." CTAs: primary →
   `/schedule`, secondary → #evaluation.
2. **Stats strip** — 4 stat cards: `100+` CPAs and EAs ("In fact, we're
   currently helping 100+ CPAs and EAs streamline their processes and reduce
   overhead by 40–50%, allowing them to reallocate their internal resources
   to more strategic growth initiatives."); `40–50%` overhead reduction;
   `up to 40%` growth ("Most of our clients have experienced up to 40%
   growth every quarter, simply by outsourcing non-core, back-office
   tasks…"); `up to 60%` cost cut. Sentences distributed without duplication:
   each sentence appears once, attached to its most relevant stat.
3. **Introduction (About Us)** — full About Us paragraphs verbatim: "Thank
   you for considering us as your offshore accounting partner." / "We are a
   professional offshore accounting company based in Ahmedabad, India…" /
   objective line (used as the hero H1, so not repeated here — the remaining
   About paragraphs flow around it) / "By combining
   experienced professionals, transparent communication, structured
   reporting, and a strong quality assurance process, we help firms increase
   capacity, reduce staffing costs, improve turnaround times, and focus on
   higher-value advisory services."
4. **Services overview** — email task list as icon cards: Bookkeeping,
   Accounts Payable / Receivable, Tax Preparation & Resolution, Accounting,
   Payroll, CFO Services, Cleanups. Lead-in: "Most of our clients…" sentence
   lives in stats; this section's lead is "This shift enables their in-house
   teams to focus on client acquisition, core strategy, and advisory
   services, rather than getting stuck in day-to-day administrative
   functions."
5. **Detailed services** — four alternating feature sections, full verbatim
   bullet lists: Accounting & Bookkeeping (10 items), Tax Preparation
   Support (8), Payroll Services (4), Sales Tax Services (3).
6. **Our Professionals** — "Our team consists of highly qualified accounting
   professionals with 3 to 8 years of hands-on experience in U.S. accounting
   and taxation." + training sentence + "Our professionals are experienced
   in working with:" 15-tool chip grid (QuickBooks Online … Microsoft Excel
   (Advanced)).
7. **Why Partner With Us** — three premium blocks verbatim: Dedicated
   Resources; U.S. Time Zone Support (four zones + "This allows:" list);
   Quality Assurance (process list + transparency list). Plus email's
   remaining Why-Firms-Choose items as compact highlight chips: "Cut Costs
   by Up to 60%", "Top-Tier Talent with strong accounting and tax
   experience", "Transparent Pricing – no hidden fees", "US Time Zone
   Coverage". Omitted (approved): "– we operate until 2:00 PM Eastern";
   "No Strings Attached – We offer a 20-hour free trial…".
8. **Data Security & Confidentiality** — intro sentence, 12 security-measure
   cards, closing policy sentence.
9. **Transparent Reporting** — intro sentence, six report tiles (Daily Work
   Reports, Weekly Performance Reports, Monthly Productivity Reports,
   Task-wise Time Tracking, Error Logs, Performance Reviews), closing
   "This allows partners to monitor…" sentence.
10. **Pricing** — Part A: four hourly tier cards verbatim from email
    (Accounting $10/hr · $1,600/mo; Tax $15/hr · $2,400/mo; Controller
    $30/hr · $4,800/mo; Part-Time CFO $40/hr · $6,400/mo) each with its
    bullet list. Part B: distinct panel "Dedicated Full-Time Professionals"
    — table/cards for Dedicated Full-Time Accountant USD 1,800 and Dedicated
    Full-Time Tax Preparer USD 2,200, "Pricing Includes" 9-item list, and
    the four "No recruitment costs…" lines + "Simply a dedicated
    professional focused on helping your firm grow."
11. **Complimentary One-Week Evaluation** — large indigo CTA band: full
    verbatim section incl. 7 assessment bullets and closing sentence.
    CTA → `/schedule`.
12. **Benefits to Your Firm** — "By partnering with us, your firm can:" +
    9 icon benefit cards.
13. **Our Commitment** — quiet large-type closing: all four paragraphs
    verbatim.
14. **Final CTA + footer** — "Book your free consultation" → `/schedule`,
    "Download brochure" → `/brochure`, email + phone. Footer per
    Architecture above.

## Icons

Font Awesome 6 (already used site-wide) — minimal line-style usage, indigo
tint on soft-tint circles. No Biotiix assets.

## Performance

Single HTML file; no images beyond OG tag; CSS gradients for atmosphere;
fonts via Google Fonts with `preconnect`; FA via CDN (as site-wide);
IntersectionObserver lazy reveals; target Lighthouse ≥95 performance.

## Error handling / degradation

- No JS → all content visible (reveal classes default visible without JS,
  matching existing site pattern), counters show final values.
- `prefers-reduced-motion` → no animation.
- Old browsers → flex/grid with sensible wrapping; no critical JS.

## Testing

- Serve locally (`python3 -m http.server`), verify at 1440/1200/810/480px:
  no horizontal overflow, grids wrap correctly.
- Content audit: diff every supplied sentence against rendered text — 100%
  verbatim presence check (scripted grep pass over the HTML).
- Link check: /schedule, /brochure, mailto, tel, anchors.
- Lighthouse run (performance + accessibility) if available.

## Out of scope

FAQ section (no FAQ content supplied), dark-mode toggle, region variants,
nav integration with main site, analytics.
