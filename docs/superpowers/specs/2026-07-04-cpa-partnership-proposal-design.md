# CPA Partnership Proposal Section Design Spec

**Document:** Partnership Proposal Section for DiligenceOS US Website  
**Date:** July 4, 2026  
**Status:** Design Specification (Ready for Implementation)  
**Location:** Integration into `/us/index.html` as a new major section  
**Audience:** Warm CPA firm prospects (decision-stage sales)

---

## 1. EXECUTIVE SUMMARY

This design specification defines a world-class, aggressive, action-oriented proposal section integrated into the existing DiligenceOS US website. The section is designed to convert warm CPA firm prospects into partnership commitments through:

- **Aggressive positioning** (Hybrid Narrative Approach)
- **Multiple conversion moments** (10+ strategic CTAs)
- **Premium visual design** (Stripe + Linear + McKinsey aesthetic)
- **Trust-building proof blocks** (Team, Process, Security, Pricing)
- **Sticky engagement elements** (Always-accessible trial/onboarding)

**Primary Goal:** Move warm prospects from "interested" → "partnership agreement" within a single scrolling experience.

**Success Metrics:**
- CTA click-through rate > 35%
- Trial signup conversion > 25%
- Call booking completion > 15%
- Time on section > 3 minutes

---

## 2. INFORMATION ARCHITECTURE

### 2.1 Section Flow (Top to Bottom)

```
1. HERO BLOCK (90vh)
   └─ Aggressive positioning + Trust badges + 2 CTAs
   
2. THE CASE FOR PARTNERSHIP (3 Story Cards)
   ├─ Card A: Market Opportunity ("Why Now")
   ├─ Card B: Team Strength ("Your Dedicated Team")
   └─ Card C: Proven Results ("The Numbers Work")
   
3. PROOF BLOCKS (4 Modular Sections)
   ├─ Block 1: Team Credentials (Experience + Software)
   ├─ Block 2: Operational Process (Visual Workflow)
   ├─ Block 3: Security & Compliance (Trust Framework)
   └─ Block 4: Transparent Pricing (No Surprises)
   
4. TRIAL & ONBOARDING (Sticky + Full Section)
   ├─ Sticky sidebar (Desktop): Always-visible CTA hub
   └─ Full section: Timeline + Decision framework
   
5. FINAL CTA BLOCK (Closing)
   └─ Strong closing statement + Multiple booking options
```

### 2.2 Integration into `/us/index.html`

**Position:** New section after existing main content, before footer  
**Section ID:** `#proposal-section`  
**Navigation:** Add "Partnership Proposal" link to main nav (optional)  
**Anchor Navigation:** Support deep-linking to specific proof blocks  

---

## 3. HERO BLOCK DESIGN

### 3.1 Layout & Dimensions

```
Hero Block: 90vh height (desktop), 60vh (tablet), 50vh (mobile)
Full-width, edge-to-edge
Sticky navigation bar (76px) on top
```

### 3.2 Visual Hierarchy

**Layer 1: Urgency Badge**
- Text: "⚡ THE MARKET IS MOVING FAST ⚡"
- Font size: 0.85rem
- Font weight: Bold, ALL CAPS
- Color: `--accent-gold` (#8a6a12)
- Background: Gold glow (rgba(138, 106, 18, 0.08))
- Padding: 8px 16px
- Border radius: 20px
- Letter-spacing: 0.3px
- Animation: Fade in with scale (0.3s, spring easing)

**Layer 2: Main Headline**
- Text: "While Your Competitors Scale, You're Still Hiring and Losing Talent"
- Font size: 3.2rem (desktop), 2.2rem (mobile)
- Font weight: 800
- Color: `--text-primary` (#111111)
- Letter-spacing: -0.5px
- Line height: 1.2
- Animation: Slide in from left (0.5s, bouncy easing)

**Layer 3: Subheadline**
- Text: "Stop. Your Offshore Accounting Team is Ready."
- Font size: 2rem (desktop), 1.4rem (mobile)
- Font weight: 700
- Color: `--accent-primary` (#635bff)
- Animation: Fade + scale (0.4s, 0.1s delay)

**Layer 4: Body Copy**
- Text: "100+ CPA Firms Are Already Growing 40% Faster With Dedicated Indian Professionals"
- Font size: 1.1rem
- Font weight: 500
- Color: `--text-secondary` (#2a2a2a)
- Line height: 1.8
- Animation: Fade in (0.5s, 0.2s delay)

**Layer 5: Trust Badges Block**
- 5 stat cards with icons + numbers + labels
- Each card: Icon (2.5rem) + Stat (1.8rem bold) + Label (0.95rem)
- Layout: Horizontal row (1 col mobile, 5 cols desktop)
- Spacing: 20px gap between cards
- Animation: Stagger cascade (0.05s between cards)

### 3.3 Background & Visual Effects

- Base: White background (#ffffff)
- Overlay gradient: Navy to purple (20% opacity) subtle background
- Animated pattern: Subtle floating shapes (slow drift, 8s duration)
- Dark mode: Adjust colors via CSS variables

### 3.4 Call-to-Action Buttons

**Primary CTA:**
- Text: "SCHEDULE PARTNERSHIP CALL - NOW"
- Button style: Solid purple (#635bff)
- Padding: 16px 48px
- Font size: 1rem
- Font weight: 700
- Border radius: 8px
- Hover state: Lift + glow effect (shadow increase, color brighten)
- Click animation: Pulse effect (0.2s)

**Secondary CTA:**
- Text: "START YOUR FREE TRIAL - ZERO RISK"
- Button style: Gold outline (#8a6a12), transparent bg
- Same padding + sizing as primary
- Hover state: Fill background + text color shift
- Animation: Pulsing glow on load (attracts attention)

**Spacing:** 20px vertical gap between buttons

### 3.5 Scroll Indicator

- Arrow icon at bottom center
- Animated up-down movement (infinite loop, 1s duration)
- Color: `--accent-gold` (#8a6a12)
- Opacity: 0.6
- Fade out as user scrolls past hero

### 3.6 Responsive Breakpoints

**Desktop (1200px+):**
- Hero height: 90vh
- Headline: 3.2rem
- Subheadline: 2rem
- Trust badges: 5 columns
- Buttons: Side-by-side (flexible layout)

**Tablet (768px - 1199px):**
- Hero height: 70vh
- Headline: 2.6rem
- Subheadline: 1.6rem
- Trust badges: 2-3 columns
- Buttons: Stacked vertically, full-width

**Mobile (< 768px):**
- Hero height: 50vh (can scroll to see all content)
- Headline: 2.2rem
- Subheadline: 1.4rem
- Trust badges: 1 column, full-width
- Buttons: Stacked, full-width, large tap targets (56px min height)

---

## 4. "THE CASE FOR PARTNERSHIP" - 3 STORY CARDS

### 4.1 Card Layout & Styling

**General Card Specs:**
- Full width with contained max-width (1200px)
- Rounded corners: 12px
- Soft shadow: `--shadow-subtle` + gold glow on hover
- Padding: 48px (desktop), 32px (tablet), 24px (mobile)
- Margin bottom: 60px
- Border-left: 4px (solid, color varies by card)
- Hover state: Lift (transform: translateY(-8px)) + enhanced shadow + border glow

### 4.2 CARD A: "Why Top CPA Firms Are Scaling NOW"

**Border Color:** Purple (`--accent-primary` #635bff)  
**Background:** White with subtle purple gradient (8% opacity)  
**Icon:** 📊 (2.5rem)

**Structure:**
```
Header Icon + Bold Headline
├─ "THE MARKET WINDOW IS OPEN (And Closing Fast)"
│
Section 1: "While you're:"
├─ Bullet list (purple emphasis on key phrases)
├─ • Hiring accountants (6-month search cycles)
├─ • Training new staff (lost productivity)
├─ • Losing talent (30% turnover in accounting)
└─ • Stuck in bookkeeping (missing growth clients)

Section 2: "Your competitors are:"
├─ Bullet list (gold emphasis on competitive advantages)
├─ • Growing 40% YoY (through scale, not hiring)
├─ • Doubling advisory revenue (high-margin work)
├─ • Keeping clients longer (better service quality)
└─ • Expanding into new markets (with offshore capacity)

Closing Statement (Bold, 1.1rem):
└─ "The question isn't: 'Should we offshore?' The question is: 'How fast can we get started?'"

CTA Link: "→ SCHEDULE CALL TO EXPLORE YOUR OPPORTUNITY"
```

**Typography:**
- Headline: 1.8rem, bold, `--text-primary`
- Section headers: 1.1rem, bold, `--accent-primary` (or gold for competitors)
- Bullet text: 1rem, `--text-secondary`
- Bold phrases: Color-highlighted (purple for your challenges, gold for their wins)
- Closing statement: Italic, 1.1rem, `--accent-primary`

**Animation:**
- Card slides up + fades in (0.6s on scroll)
- Text appears line-by-line (0.05s stagger)
- CTA button pulses on load (subtle)

### 4.3 CARD B: "Your Dedicated Team Awaits"

**Border Color:** Blue (`--accent-secondary` #0073e6)  
**Background:** White with subtle blue gradient (8% opacity)  
**Icon:** 👥 (2.5rem)

**Structure:**
```
Header Icon + Bold Headline
├─ "PROFESSIONAL ACCOUNTANTS. DEDICATED. JUST FOR YOU."
│
Subheading (Larger, bold):
├─ "Not rotating freelancers. Not project-based staff."
├─ "A dedicated professional focused 100% on YOUR firm."
│
Credential Checklist Box:
├─ "WHAT YOU GET:"
├─ ✓ 3–8 Years Hands-On U.S. Accounting Experience
├─ ✓ QuickBooks, UltraTax, Drake, Lacerte Expertise
├─ ✓ Full-Time Commitment (Not Shared Resources)
├─ ✓ U.S. Time Zone Availability (ET to PT)
├─ ✓ Continuous Training & Certifications
├─ ✓ No Turnover = No Onboarding Cycles
├─ ✓ Daily Reporting & Transparency
└─ ✓ Quality Assurance Built-In

Tech Stack Section:
├─ "Software Expertise:"
├─ [Badge] QuickBooks | [Badge] Xero | [Badge] Zoho |
├─ [Badge] Bill.com | [Badge] Gusto | [Badge] ADP |
├─ [Badge] Drake | [Badge] UltraTax | [Badge] Lacerte |
├─ [Badge] ProConnect | [Badge] Excel Pro
│
Closing Statement (Bold, 1.1rem, Gold):
└─ "This is your team. They know your clients. They know your processes. They deliver like they're in your office."

CTA Link: "→ MEET OUR TEAM & DISCUSS PERFECT FIT"
```

**Typography:**
- Headline: 1.8rem, bold, `--text-primary`
- Subheading: 1.1rem, bold, `--text-secondary`
- Checklist header: 0.95rem, bold, purple
- Checklist items: 1rem, `--text-secondary` (green checkmarks)
- Tech badge labels: 0.85rem, light blue background
- Closing statement: 1.1rem, bold, gold (#8a6a12)

**Visual Elements:**
- Credential box: Light border (1px, `--border-color`), 8px radius, soft padding
- Tech badges: Light blue background (rgba(0, 115, 230, 0.1)), rounded (20px), inline layout

**Animation:**
- Card scales up slightly (0.6s on scroll, spring easing)
- Checklist items cascade in (0.08s stagger)
- Tech badges fade in after text (0.3s delay)
- On hover: Entire card lifts + border glows

### 4.4 CARD C: "The Results: Growth + Profitability"

**Border Color:** Gold (`--accent-gold` #8a6a12)  
**Background:** White with subtle gold gradient (8% opacity)  
**Icon:** 📈 (2.5rem, gold color)

**Structure:**
```
Header Icon + Bold Headline
├─ "REAL RESULTS FROM REAL PARTNERS"
│
Stat Boxes (3):
├─ Box 1: "40–60% Cost Savings" | "Within 90 Days"
├─ Box 2: "100+ Partners" | "Scaling Successfully (Yours Could Be Next)"
└─ Box 3: "40% Quarterly Firm Growth" | "Through Scale, Not Hiring"

Benefit Cards Grid (4 columns):
├─ Card 1:
│  ├─ Icon: 💰 (purple)
│  ├─ Title: "Higher Profit Margins"
│  ├─ Description: "Reduce headcount costs. Keep revenue flat. Margins up."
│
├─ Card 2:
│  ├─ Icon: 🎯 (purple)
│  ├─ Title: "Focus On Advisory (Where Real Money Lives)"
│  ├─ Description: "Your team works on strategy. We handle the books."
│
├─ Card 3:
│  ├─ Icon: 📊 (purple)
│  ├─ Title: "Scale Without Infrastructure"
│  ├─ Description: "Tax season? Peak projects? We absorb the load."
│
└─ Card 4:
   ├─ Icon: 🔄 (purple)
   ├─ Title: "Zero Hiring Headaches"
   └─ Description: "No recruitment. No training. No turnover stress."

CTA Link: "→ BOOK DISCOVERY CALL: SEE YOUR SPECIFIC OPPORTUNITY"
```

**Typography:**
- Headline: 1.8rem, bold, `--text-primary`
- Stat boxes header: 1.4rem, bold, purple
- Stat boxes description: 0.95rem, `--text-secondary`
- Benefit card title: 1.1rem, bold, `--text-primary`
- Benefit card description: 0.95rem, `--text-secondary`

**Visual Elements:**
- Stat boxes: Large numbers (2rem, purple), supporting text underneath
- Benefit card grid: Flex layout (1 col mobile, 2 tablet, 4 desktop)
- Each card: 12px border-radius, soft border (1px), subtle shadow
- Icons: 2.5rem, purple, centered

**Animation:**
- Card slides up + fades (0.6s)
- Stat boxes animate number counters (0-40, 0-100, 0-40 over 1.5s)
- Benefit cards cascade in left to right (0.1s stagger)
- Icons scale + rotate on load (spring easing)
- On hover: Each card lifts individually + color brightens

---

## 5. PROOF BLOCKS (4 MODULAR SECTIONS)

### 5.1 PROOF BLOCK 1: Team Credentials

**Section ID:** `#team-credentials`  
**Layout:** Full-width with contained content (max 1200px)  
**Spacing:** 80px top, 80px bottom  

**Structure:**
```
Bold Headline (1.4rem):
└─ "YOUR TEAM IS BATTLE-TESTED & READY"

Credential Box:
├─ Gold left border (4px)
├─ White background + soft shadow
├─ Padding: 32px
├─
├─ "EXPERIENCE LEVEL" (Bold, purple)
├─ "3–8 Years Hands-On"
├─
├─ Credential points (with checkmarks):
├─ ✓ Full U.S. Accounting & Tax Background
├─ ✓ IRS Regulations & GAAP Compliant
├─ ✓ CPA Firm Workflows Mastered
├─ ✓ Continuous Professional Development

Tech Stack Matrix (3 columns):
├─ Column 1: ACCOUNTING
│  ├─ QuickBooks Online
│  ├─ QuickBooks Desktop
│  ├─ Xero
│  ├─ Zoho Books
│  └─ Sage
│
├─ Column 2: TAX PREP
│  ├─ UltraTax
│  ├─ Drake
│  ├─ Lacerte
│  ├─ ProConnect
│  └─ CCH Suite
│
└─ Column 3: PAYROLL & OPERATIONS
   ├─ Gusto
   ├─ ADP
   ├─ Bill.com
   ├─ Rippling
   └─ Paylocity

Skill Badge Row:
└─ "ADVANCED EXCEL | FINANCIAL MODELING | DATA ANALYSIS"

Bold Closing Statement (1.1rem, purple):
└─ "NOT OFFSHORE GENERALISTS. SPECIALIZED U.S. ACCOUNTING PROFESSIONALS."

CTA Link: "→ REVIEW DETAILED TEAM QUALIFICATIONS"
```

**Design Specs:**
- Credential box: Light purple/blue gradient background (8% opacity)
- Tech column cards: 12px radius, light border (1px), soft shadow, hover lifts
- Skill badge row: Single row, badges with tech icon + text
- Text sizing: Headline 1.4rem, section labels 1rem bold, items 0.95rem

**Animations:**
- Credential box fades + slides up (0.5s)
- Tech cards cascade in left-to-right (0.1s stagger)
- Badges fade in after cards (0.3s delay)
- On hover: Tech cards lift + glow effect

### 5.2 PROOF BLOCK 2: Operational Process

**Section ID:** `#operational-process`  
**Layout:** Full-width vertical timeline  
**Spacing:** 80px top, 80px bottom  

**Structure:**
```
Bold Headline (1.4rem):
└─ "HOW WE WORK: SEAMLESS DAILY COLLABORATION"

Subtitle (1rem):
└─ "Transparency at every step. No black box. Just results."

Vertical Timeline (Visual Flow Diagram):

Step 1: YOUR FIRM
├─ Icon: Building/briefcase
├─ Color: Gold
├─ Connection line (2px, purple) to next step

Step 2: DAILY STANDUP
├─ Icon: Chat/message
├─ Color: Blue
├─ Text: "(Slack/Email)"
├─ Connection line

Step 3: DEDICATED DILIGENCEOS TEAM
├─ Icon: People
├─ Color: Purple
├─ Text: "(Focused 100% On Your Work)"
├─ Connection line

Step 4: DAILY REPORTING
├─ Icon: Chart
├─ Color: Blue
├─ Text: "(Tasks + Time Tracking)"
├─ Connection line

Step 5: WEEKLY QUALITY REVIEW
├─ Icon: Checkmark
├─ Color: Purple
├─ Text: "(Your Partner Validates)"
├─ Connection line

Step 6: MONTHLY PERFORMANCE REVIEW
├─ Icon: Metrics/graph
├─ Color: Blue
├─ Text: "(Metrics + Continuous Improvement)"
├─ Connection line

Step 7: CLIENT DELIVERY
├─ Icon: Checkmark (final)
├─ Color: Gold
├─ Text: "(Quality Assured)"

Bold Closing Statement (1.1rem, purple):
└─ "TRANSPARENCY AT EVERY STEP. No black box. No surprises. Just results."

CTA Link: "→ SEE SAMPLE DAILY REPORT & METRICS DASHBOARD"
```

**Design Specs:**
- Timeline boxes: Rounded corners (12px), soft shadow, 48px padding
- Connecting lines: Purple (2px), animate as if "drawing" on scroll
- Icons: 2rem, centered in each box
- Step text: Bold title (1.1rem) + gray subtitle (0.9rem)
- Alternating alignment: Left-aligned odd steps, right-aligned even (creates visual rhythm)

**Animations:**
- Entire timeline draws in from top to bottom (1s on scroll)
- Connecting lines animate as draw-in (1.2s duration)
- Each box fades + scales in sequence (0.1s stagger)
- Arrow icons between boxes pulse infinitely (attracts attention)

### 5.3 PROOF BLOCK 3: Security & Compliance

**Section ID:** `#security-compliance`  
**Layout:** 2-column card layout  
**Spacing:** 80px top, 80px bottom  

**Structure:**
```
Bold Headline (1.4rem):
└─ "ENTERPRISE-GRADE SECURITY. YOUR DATA IS SACRED."

Icon: 🔒 (2.5rem, gold)

Column 1: INFRASTRUCTURE
├─ Border: Gold left (4px)
├─ Header: "INFRASTRUCTURE" (purple, bold)
├─
├─ ✓ Company-Issued Laptops Only (No Personal Devices)
├─ ✓ Secure Office-Based Work Environment
├─ ✓ Role-Based Access Controls (No Over-Sharing)
├─ ✓ Restricted USB & External Storage
├─ ✓ Secure File Sharing (Approved Platforms Only)
├─ ✓ Endpoint Protection & Antivirus
├─ ✓ VPN Required (All Connections Encrypted)

Column 2: COMPLIANCE & LEGAL
├─ Border: Gold left (4px)
├─ Header: "COMPLIANCE & LEGAL" (purple, bold)
├─
├─ ✓ Signed Non-Disclosure Agreements (NDAs)
├─ ✓ Multi-Factor Authentication (MFA)
├─ ✓ Secure Password Management
├─ ✓ Regular Cybersecurity Training
├─ ✓ Immediate Incident Reporting & Investigation
├─ ✓ Confidentiality Controls (Built-In)
├─ ✓ Data Integrity Monitoring

Bold Closing Statement (1.1rem, gold):
└─ "WE DON'T JUST COMPLY. WE EXCEED STANDARDS."

CTA Link: "→ DOWNLOAD SECURITY & COMPLIANCE DOCUMENTATION"
```

**Design Specs:**
- Card background: White + subtle blue gradient (8% opacity)
- Card layout: 2 columns (1 col mobile, 2 tablet+)
- Padding: 32px per card
- Soft shadow + border-radius (12px)
- Checklist icons: Green checkmarks (or gold for emphasis)
- Item text: 1rem, bold descriptor + 0.85rem gray supporting text

**Animations:**
- Infrastructure card slides up (0.5s)
- Compliance card slides up (0.5s, 0.1s delay)
- Checklist items cascade in (0.06s stagger per card)
- Icons scale + fade on load (spring easing)

### 5.4 PROOF BLOCK 4: Transparent Pricing

**Section ID:** `#pricing-transparent`  
**Layout:** 2 pricing cards + supporting section  
**Spacing:** 80px top, 80px bottom  

**Structure:**
```
Bold Headline (1.4rem):
└─ "SIMPLE PRICING. NO HIDDEN FEES. NO SURPRISES."

Pricing Card 1: DEDICATED FULL-TIME ACCOUNTANT
├─ Border: Purple left (4px)
├─ Icon: 📊 (purple)
├─ Bold Rate: "$10/hour" + "or" + "$1,800/month"
├─ Subtitle: "(160 hours/month)"
├─
├─ "Includes:" (bold, gold)
├─ • Bookkeeping & General Ledger
├─ • Bank & Credit Card Reconciliations
├─ • A/P, A/R, Payroll Processing
├─ • Month-End & Year-End Closing
├─ • Financial Statement Preparation
├─ • Daily Reporting & Quality Assurance
├─ • U.S. Time Zone Support
├─ • Dedicated Professional
├─ • No Employee Benefits Cost
├─ • No Recruiting or Training Overhead

Pricing Card 2: DEDICATED FULL-TIME TAX PREPARER
├─ Border: Purple left (4px)
├─ Icon: 📋 (purple)
├─ Bold Rate: "$15/hour" + "or" + "$2,400/month"
├─ Subtitle: "(160 hours/month)"
├─
├─ "Includes:" (bold, gold)
├─ • 1040, 1065, 1120/1120S, 1041, 990 Returns
├─ • 940/941, W-2, Sales Tax Filings
├─ • 5+ Years Tax Season Experience
├─ • Tax Workpapers & Research Support
├─ • Tax Notice Assistance
├─ • Daily Reporting & Quality Assurance
├─ • U.S. Time Zone Support
├─ • Dedicated Professional
├─ • No Employee Benefits Cost
├─ • No Recruiting or Training Overhead

Optional Services Row:
└─ "ADD OPTIONAL SERVICES (À La Carte):"
   └─ [Badge] Payroll Services | [Badge] Controller Support | [Badge] CFO Advisory

What You DON'T Pay Section:
├─ Header: "WHAT YOU DON'T PAY:" (bold, red/gold accent)
├─ ✗ Employee Benefits (No 401k, Health, Taxes)
├─ ✗ Recruiting Costs ($10–30K per hire)
├─ ✗ Training & Onboarding Overhead
├─ ✗ Turnover Replacement Costs
├─ ✗ Infrastructure & Office Space
├─ ✗ Long-Term Hiring Commitments

The Math Section (Highlighted box):
├─ Background: Gold glow (5% opacity)
├─ Bold text (1.1rem):
├─ "THE MATH: $1,800/month beats a $60–80K/year hire."
├─ "Plus: No turnover. No training. No hiring cycles."

CTA Button: "→ BOOK CALL TO CUSTOMIZE YOUR PRICING & TEAM STRUCTURE"
```

**Design Specs:**
- Pricing cards: 2 columns (1 col mobile), white bg, soft shadow, 40px padding
- Rate text: 2rem bold, purple color
- Checkmarks: Gold color (or green)
- Optional services: Inline badges with light blue background
- "What You Don't Pay" section: Red X icons (or gold minus signs), bold text
- Math box: Gold gradient background (8% opacity), bold statement
- CTA: Primary button (purple) or text link (gold)

**Animations:**
- Accountant card fades + slides up (0.5s)
- Tax preparer card fades + slides up (0.5s, 0.1s delay)
- Rate numbers animate with counter (0-10, 0-1800, etc. over 1s)
- Included items cascade in (0.05s stagger)
- "What You Don't Pay" section highlights with subtle glow on scroll

---

## 6. TRIAL & ONBOARDING SECTION

### 6.1 Sticky Sidebar (Desktop Only)

**Position:** Fixed right side, stays visible as user scrolls  
**Visibility:** Desktop only (display: none on tablet/mobile)  
**Width:** 320px (or 25% of viewport)  
**Top:** 100px (appears after hero scrolls past)  
**Background:** Gradient (gold to purple, premium glow)  
**Padding:** 32px  
**Border-radius:** 16px  
**Shadow:** Premium soft shadow  

**Content:**
```
Header (Bold, 1.2rem):
├─ "🎯 RISK-FREE PARTNERSHIP TRIAL"
│
Subheader (1rem):
├─ "20 Hours. Zero Commitment. See It For Yourself."
│
Timeline Summary:
├─ Week 1: Discovery & Onboarding (4 hours)
├─ Week 2-3: Work & Evaluation (16 hours)
├─ Week 4: Final Review & Decision (0 hours invested by you)
│
Evaluation Points:
├─ 🎯 Communication Quality
├─ 🎯 Turnaround Speed
├─ 🎯 Work Accuracy
├─ 🎯 Team Reliability
├─ 🎯 Cultural Fit
│
Primary CTA Button (Bold, uppercase):
├─ "START YOUR 20-HOUR FREE TRIAL"
├─ (BOOK A CALL NOW)
│
Secondary CTA Link (Gold text):
└─ "Questions? Schedule a 30-Min Discovery Call"
```

**Animation:**
- Sticky box fades in on scroll (0.6s)
- Appears after hero section exits viewport
- Pulse effect on primary button (attracts attention)
- Smooth transitions as user scrolls

### 6.2 Full Trial Section (All Devices)

**Section ID:** `#trial-onboarding`  
**Layout:** Full-width with centered content (max 1200px)  
**Spacing:** 100px top, 100px bottom  

**Structure:**
```
Bold Headline (1.4rem):
└─ "🎯 RISK-FREE PARTNERSHIP TRIAL"

Subheading (1.1rem):
└─ "20 Hours. Zero Commitment. See It For Yourself."

Timeline Blocks (Expandable/Accordion):

WEEK 1: DISCOVERY & ONBOARDING
├─ Status: [Collapsed/Expandable]
├─ Timeline label: "4 hours invested"
├─ Expanded content:
│  ├─ ✓ Initial consultation & team assignment
│  ├─ ✓ System setup (QB, tax software, communication)
│  ├─ ✓ Process walkthrough & questions answered
│  └─ [Collapse button]

WEEK 2-3: WORK & EVALUATION
├─ Status: [Collapsed/Expandable]
├─ Timeline label: "16 hours of productive work"
├─ Expanded content:
│  ├─ ✓ Team works on real tasks
│  ├─ ✓ Daily reports showing progress
│  ├─ ✓ Your feedback incorporated in real-time
│  ├─ ✓ Quality & accuracy demonstrated
│  └─ [Collapse button]

WEEK 4: FINAL REVIEW & DECISION
├─ Status: [Collapsed/Expandable]
├─ Timeline label: "Your decision point"
├─ Expanded content:
│  ├─ ✓ Comprehensive performance report
│  ├─ ✓ Reference call with existing partner (optional)
│  ├─ ✓ Custom proposal based on your needs
│  ├─ ✓ Decision point: Full partnership or no strings
│  └─ [Collapse button]

Evaluation Criteria (Large bold checklist):
├─ 🎯 Communication Quality
├─ 🎯 Turnaround Speed
├─ 🎯 Work Accuracy
├─ 🎯 Team Reliability
├─ 🎯 Cultural Fit

Primary CTA Box (Prominent, centered):
├─ Bold Button (Large, purple):
├─ "START YOUR 20-HOUR FREE TRIAL"
├─ "(BOOK A CALL NOW)"
│
Secondary Link (Gold):
└─ "Questions? → Schedule a 30-Min Discovery Call"
```

**Design Specs:**
- Timeline blocks: Cards with 12px radius, soft shadow, 32px padding
- Expanded state: Smooth height animation (0.3s)
- Accordion headers: Bold (1.1rem), clickable with chevron icon
- Expanded content: Light blue/gold gradient background (8% opacity)
- Evaluation criteria: Large checkmarks (gold), bold text (1rem)
- Primary CTA: Large button (200px width, 56px height), purple, glow effect
- Secondary CTA: Text link (gold), underline on hover

**Animations:**
- Timeline blocks cascade in on scroll (0.1s stagger)
- Accordion expand/collapse: Smooth height animation (0.3s, ease)
- Primary button pulses (catches attention)
- Evaluation criteria fade in with stagger (0.06s)

---

## 7. CONVERSION MOMENTS & CTA STRATEGY

### 7.1 CTA Placement Map (10+ Conversion Points)

| # | Location | CTA Text | Button Style | Goal |
|---|----------|----------|--------------|------|
| 1 | Hero Primary | "SCHEDULE PARTNERSHIP CALL - NOW" | Purple, large | Initial interest |
| 2 | Hero Secondary | "START FREE TRIAL - ZERO RISK" | Gold outline, large | Trial signup |
| 3 | Card A Footer | "Schedule Call to Explore Opportunity" | Text link, gold | Market positioning |
| 4 | Card B Footer | "Meet Our Team & Discuss Fit" | Text link, gold | Credential trust |
| 5 | Card C Footer | "Book Discovery Call" | Text link, gold | Results proof |
| 6 | Team Credentials | "Review Detailed Qualifications" | Text link, gold | Deep dive |
| 7 | Operational Process | "See Sample Daily Report" | Text link, gold | Process clarity |
| 8 | Security & Compliance | "Download Compliance Documentation" | Text link + icon | Trust building |
| 9 | Pricing | "Customize Your Pricing & Team" | Purple button, medium | Personalization |
| 10 | Sticky Sidebar | "START YOUR TRIAL (Book a Call)" | Purple, large, pulsing | Always accessible |
| 11 | Trial Section | "START YOUR 20-HOUR FREE TRIAL" | Purple, XL | Final push |
| 12 | Final CTA Block | "BOOK PARTNERSHIP CALL" | Purple, XL | Closing action |

### 7.2 CTA Button Styles

**Primary (Purple #635bff):**
- Used for main conversions (booking calls, starting trials)
- Font: Bold, uppercase
- Padding: 16px 48px
- Shadow: Soft + glow on hover
- Hover: Lift effect + brighten + glow
- Active: Pulse effect

**Secondary (Gold #8a6a12):**
- Used for optional deep-dives (reviews, downloads)
- Style: Outline or text link with arrow
- Hover: Underline + color shift
- Used strategically to avoid CTA fatigue

**Text Links (with arrow →):**
- Use for lightweight CTAs between sections
- Hover: Underline + color shift to gold
- Encourages clicks without aggressive button styling

### 7.3 CTA Conversion Funnel

```
HERO (35% of prospects)
└─ High-intent, ready to book
   └─ Primary CTA: "Schedule Partnership Call"
   └─ Alternative CTA: "Start Free Trial"

CASE CARDS (25% of prospects)
└─ Engaged but still evaluating
   └─ Text links for specific sections
   └─ Soft CTA: "Learn more" / "See details"

PROOF BLOCKS (20% of prospects)
└─ Detailed evaluation phase
   └─ Multiple micro-CTAs
   └─ Downloads and deep-dives

TRIAL SECTION (15% of prospects)
└─ Risk-reduction phase
   └─ Strong CTA: "Start Free Trial"
   └─ Book discovery call

FINAL BLOCK (5% of prospects)
└─ Final hesitation
   └─ Multiple contact options
   └─ Urgency messaging
```

---

## 8. DESIGN SYSTEM & STYLING

### 8.1 Color Palette (Existing DiligenceOS System)

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-bg` | #ffffff | Card backgrounds |
| `--secondary-bg` | #f6f9fc | Section backgrounds |
| `--accent-primary` | #635bff | Primary CTAs, headlines |
| `--accent-secondary` | #0073e6 | Secondary accents, borders |
| `--accent-gold` | #8a6a12 | Urgency, premium accents |
| `--text-primary` | #111111 | Main headlines |
| `--text-secondary` | #2a2a2a | Body text |
| `--text-light` | #555555 | Secondary text |
| `--border-color` | #e6ebf1 | Card borders |
| `--shadow-subtle` | 0 2px 4px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04) | Cards |
| `--shadow-gold` | 0 4px 16px rgba(138, 106, 18, 0.12) | Gold accents |

### 8.2 Typography Scale

| Element | Size | Weight | Line Height | Letter-Spacing |
|---------|------|--------|-------------|-----------------|
| H1 (Hero) | 3.2rem | 800 | 1.2 | -0.5px |
| H2 (Subheadline) | 2rem | 700 | 1.3 | 0 |
| H3 (Section Header) | 1.8rem | 700 | 1.3 | 0 |
| H4 (Card Header) | 1.4rem | 600 | 1.3 | 0 |
| Body | 1rem | 500 | 1.6 | 0 |
| Small | 0.95rem | 400 | 1.5 | 0 |
| Extra Small | 0.85rem | 400 | 1.4 | 0.3px |

### 8.3 Spacing System

| Scale | Size | Usage |
|-------|------|-------|
| xs | 8px | Small gaps, icon spacing |
| sm | 16px | Button padding, small margins |
| md | 24px | Card padding, section spacing |
| lg | 32px | Content padding, larger gaps |
| xl | 48px | Card padding, section headers |
| xxl | 60px | Between major sections |
| xxxl | 80px | Section top/bottom padding |

### 8.4 Border Radius

- Cards: 12px
- Buttons: 8px
- Badges: 20px (pill-shaped)
- Large rounded: 16px (sticky section)

### 8.5 Shadows

**Subtle Shadow:** `0 2px 4px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)`  
**Gold Shadow:** `0 4px 16px rgba(138, 106, 18, 0.12)`  
**Premium Lift:** `0 8px 24px rgba(0,0,0,0.08)` (on hover)  

### 8.6 Transitions

- Default: `all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)`
- Fast: `0.2s` (buttons, hovers)
- Slow: `0.6s` (scroll reveals)
- Spring: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy animations)

---

## 9. ANIMATION & INTERACTION SPECIFICATIONS

### 9.1 Scroll Reveal Animations

**Default behavior:** Elements are visible by default (accessible without JS)  
**With JS enabled:** Elements start hidden, animate in as scrolled into view

**Animation Types:**

1. **Fade In + Slide Up**
   - Duration: 0.6s
   - Delay: 0s (first element)
   - Easing: ease-out
   - Transform: translateY(20px) → translateY(0)
   - Opacity: 0 → 1
   - Use: Cards, sections

2. **Scale + Fade In**
   - Duration: 0.6s
   - Delay: 0.1s
   - Easing: cubic-bezier(0.25,0.46,0.45,0.94)
   - Transform: scale(0.95) → scale(1)
   - Opacity: 0 → 1
   - Use: Icons, important cards

3. **Slide Left + Fade In**
   - Duration: 0.5s
   - Delay: 0s
   - Easing: ease-out
   - Transform: translateX(-20px) → translateX(0)
   - Opacity: 0 → 1
   - Use: Hero headline

4. **Cascade/Stagger**
   - Duration: 0.05s - 0.1s per element
   - Applies to: List items, checkmarks, badges
   - Total time: 0.4s - 0.8s for full cascade

### 9.2 Hover States

**Cards:**
- Transform: translateY(-8px)
- Box-shadow: Increase (premium lift effect)
- Border: Glow or color shift (to gold)
- Transition: 0.2s

**Buttons:**
- Primary (Purple): Brighten + glow + lift
- Secondary (Gold): Underline + color shift
- Transition: 0.2s

**Links:**
- Underline fade in
- Color shift to gold
- Transition: 0.2s

### 9.3 Interactive Elements

**Accordion (Timeline Blocks):**
- Click header to expand/collapse
- Smooth height animation (0.3s)
- Chevron icon rotates 180° on expand
- Only one open at a time (optional)

**Number Counters:**
- Animate on scroll into view
- Duration: 1.5s
- Easing: ease-out
- Example: 0 → 40 (for 40%)

**Pulsing Button:**
- Opacity: 1 → 0.7 → 1
- Duration: 2s
- Infinite loop (runs continuously)
- Used on primary CTAs to attract attention

**Animated Lines (Timeline):**
- SVG stroke animation
- Draws from top to bottom
- Duration: 1.2s
- Triggered on scroll into view

---

## 10. RESPONSIVE DESIGN

### 10.1 Breakpoints

- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** < 768px

### 10.2 Desktop (1200px+)

- Hero height: 90vh
- Headline: 3.2rem
- Cards: Full width with max-width container (1200px)
- Proof blocks: Full width, generous padding
- Sticky sidebar: Visible on right
- CTA buttons: Side-by-side (where applicable)
- Grid layouts: 4 columns (benefit cards), 3 columns (tech stack)

### 10.3 Tablet (768px - 1199px)

- Hero height: 70vh
- Headline: 2.6rem
- Cards: Responsive padding (32px)
- Proof blocks: Adjusted spacing
- Sticky sidebar: Hidden
- CTA buttons: Stacked vertically, full-width
- Grid layouts: 2 columns (benefit cards), 2 columns (tech stack)
- Font sizes: Scaled down 10-15%

### 10.4 Mobile (< 768px)

- Hero height: 50vh (scrollable)
- Headline: 2.2rem
- Subheadline: 1.4rem
- Cards: Full-width, stacked
- Padding: 24px (reduced from 32-48px)
- Sticky sidebar: Hidden (content moved to full section)
- CTA buttons: Full-width, large tap targets (56px min height)
- Grid layouts: 1 column (stacked)
- Font sizes: Scaled further (90% of tablet)
- Touch-friendly spacing: 48px min between interactive elements

### 10.5 Portrait vs Landscape (Mobile)

**Portrait (most common):**
- Standard mobile layout
- Full-width sections

**Landscape:**
- Reduced height sections (use min-height instead of vh units)
- Adjusted padding for smaller viewport height
- Simplified layouts where applicable

---

## 11. DARK MODE SUPPORT

**Implementation:** CSS custom properties automatically swap on `data-theme="dark"`

**Color Adjustments:**

| Light Mode | Dark Mode |
|-----------|-----------|
| `--primary-bg`: #ffffff | `--primary-bg`: #0a0e1a |
| `--secondary-bg`: #f6f9fc | `--secondary-bg`: #111827 |
| `--accent-primary`: #635bff | `--accent-primary`: #818cf8 |
| `--accent-secondary`: #0073e6 | `--accent-secondary`: #60a5fa |
| `--text-primary`: #111111 | `--text-primary`: #f1f5f9 |
| `--text-secondary`: #2a2a2a | `--text-secondary`: #94a3b8 |
| `--text-light`: #555555 | `--text-light`: #64748b |
| `--border-color`: #e6ebf1 | `--border-color`: #1e293b |

**Gold Accent (#8a6a12):** Remains consistent in both themes  
**Shadows:** Adjust opacity (slightly more transparent in dark mode)  
**Gradients:** Apply to dark-mode appropriate colors (lighter purples, blues)

---

## 12. ACCESSIBILITY

### 12.1 Semantic HTML

- Use `<section>`, `<article>`, `<header>`, `<footer>` tags
- Buttons: `<button>` or `<a role="button">`
- Headings: Proper hierarchy (H1 → H2 → H3, etc.)
- Lists: `<ul>` / `<ol>` with `<li>` items

### 12.2 ARIA Labels

- Icon buttons: `aria-label="Close"`, `aria-label="Expand"`
- Accordion headers: `aria-expanded="true/false"`, `aria-controls="target-id"`
- Modals/overlays: `role="dialog"`, `aria-modal="true"`

### 12.3 Color Contrast

- Text on background: Minimum 4.5:1 ratio (AA standard)
- Large text: Minimum 3:1 ratio
- Icons on buttons: Minimum 3:1 ratio
- Verified via WCAG Color Contrast Checker

### 12.4 Focus States

- All interactive elements: Clear focus outline (2px, color contrasted)
- Tab order: Logical (left-to-right, top-to-bottom)
- Keyboard navigation: Fully supported (no mouse-only elements)
- Focus visible: `:focus-visible` for visual feedback

### 12.5 Motion Accessibility

- Respect `prefers-reduced-motion` media query
- Disable animations if user has reduced-motion enabled
- Provide text alternatives for animated counters
- No auto-playing videos or infinite animations that can't be paused

---

## 13. PERFORMANCE CONSIDERATIONS

### 13.1 Image Optimization

- Use `.webp` format with `.png` fallback
- Lazy load images below the fold
- Compress all images (target: < 100KB per image)
- Use appropriately sized images for different breakpoints

### 13.2 CSS Optimization

- Keep CSS file size < 50KB (gzipped)
- Use CSS custom properties (already done)
- Minimize repaints/reflows (batch animations)
- Use transform and opacity for animations (GPU-accelerated)

### 13.3 JavaScript Optimization

- Intersection Observer for scroll animations (efficient)
- Debounce/throttle event listeners
- Lazy load heavy scripts
- Minimal dependencies

### 13.4 Web Fonts

- Pre-load Google Fonts (already using Inter)
- Use `font-display: swap` for faster text rendering
- Limit font weights (currently using 300-800 — acceptable)

---

## 14. BROWSER & DEVICE COMPATIBILITY

### 14.1 Supported Browsers

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 14.2 Mobile Devices

- iOS Safari (14+)
- Android Chrome (latest)
- Android Firefox (latest)
- Samsung Internet (latest)

### 14.3 Feature Detection

- CSS custom properties: Supported by all modern browsers
- Intersection Observer: Supported by all modern browsers
- Flexbox / Grid: Supported by all modern browsers
- No polyfills needed for this design

---

## 15. TESTING CHECKLIST

Before implementation completion:

- [ ] Desktop, tablet, mobile responsive testing
- [ ] Light and dark mode verification
- [ ] All CTAs clickable and functional
- [ ] Scroll animations smooth (60fps)
- [ ] Accordion expand/collapse working
- [ ] Number counters animating correctly
- [ ] Sticky sidebar appears/disappears at correct scroll points
- [ ] Keyboard navigation fully supported
- [ ] WCAG color contrast verified
- [ ] Images optimized and loading quickly
- [ ] No console errors or warnings
- [ ] Print styles (if needed) work correctly
- [ ] Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Accessibility audit via axe DevTools
- [ ] Performance testing (Google Lighthouse 90+)

---

## 16. FUTURE ENHANCEMENTS (Out of Scope)

- Video testimonials from existing CPA firm partners
- Interactive ROI calculator (input firm size, see savings)
- Live chat integration for immediate questions
- Animated team member profiles/bios
- Case study deep-dives (expandable case study cards)
- Custom PDF proposal generation
- Personalized onboarding based on firm size/needs

---

## 17. IMPLEMENTATION NOTES

### 17.1 File Structure

```
/us/index.html
├─ [Existing content above]
├─ <section id="proposal-section">
│  ├─ Hero block
│  ├─ Case cards (3)
│  ├─ Proof blocks (4)
│  ├─ Trial & onboarding
│  └─ Final CTA
├─ [Existing footer below]
```

### 17.2 CSS Classes

```
.proposal-section {}
.proposal-hero {}
.proposal-case-cards {}
.proposal-card { border-left: 4px solid; }
.proposal-card.primary-border { border-color: var(--accent-primary); }
.proposal-card.secondary-border { border-color: var(--accent-secondary); }
.proposal-proof-blocks {}
.proposal-proof-block {}
.proposal-trial-sticky {}
.proposal-trial-section {}
.proposal-cta {}
.proposal-cta.primary {}
.proposal-cta.secondary {}
```

### 17.3 JavaScript Hooks

- IntersectionObserver for scroll reveals
- Click handlers for accordion expand/collapse
- Counter animations on scroll into view
- Sticky sidebar position tracking

---

## 18. SIGN-OFF

This specification defines a premium, aggressive, action-oriented proposal section designed to convert warm CPA firm prospects into partnership commitments. The design follows the existing DiligenceOS design system while elevating the visual impact and conversion psychology.

**Status:** ✅ Ready for Implementation  
**Date Completed:** July 4, 2026  
**Author:** Creative Direction (Claude Code)  
**Next Step:** Implementation planning & development

---

**END OF SPECIFICATION**
