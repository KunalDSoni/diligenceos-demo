# DiligenceOS — Global Bookkeeping & Accounting Services

A static, multi-region marketing website for DiligenceOS, a global bookkeeping and accounting services company. Built with a Stripe-inspired design language — clean, modern, and international.

## Project Structure

Diligiance/
├── index.html            # Global landing page (default)
├── us/index.html         # United States region page
├── au/index.html         # Australia region page
├── uk/index.html         # United Kingdom region page
├── diligenceos-redesign.html  # Legacy design (archived)
└── README.md
```

## Architecture

Each page is a **self-contained single HTML file** with embedded CSS and JavaScript — no build tools, no frameworks, no external dependencies beyond Google Fonts and Font Awesome via CDN.

### Multi-Region System

The site supports region-specific pages, each with fully unique content:

- **Global** (`/index.html`) — Default landing page with a globe icon trigger, general worldwide messaging
- **US** (`/us/index.html`) — IRS, GAAP, USD pricing, Delaware & Illinois offices
- **AU** (`/au/index.html`) — ATO, BAS/GST, AUD pricing, Sydney & Melbourne offices
- **UK** (`/uk/index.html`) — HMRC, VAT/MTD, GBP pricing, London & Manchester offices

A **region selector** in the top-right nav allows switching between regions via flag emojis. Each region page displays its own flag as the trigger; the global page uses a 🌎 globe.

## Features

- **Dark/Light Theme Toggle** — Sun and moon buttons in the nav. Persists preference via `localStorage`. Gracefully degrades on `file://` protocol.
- **Stripe-Inspired Design** — Inter font, indigo (#635bff) accent, clean card layouts, generous whitespace.
- **Scroll Reveal Animations** — Sections animate in on scroll via IntersectionObserver. Visible by default if JS is unavailable.
- **Animated Counters** — Key metrics count up when scrolled into view.
- **FAQ Accordion** — Expandable question/answer pairs.
- **Financial Ticker** — Scrolling ticker bar with key financial metrics.
- **Mobile Responsive** — Three breakpoints: 1200px, 768px, 480px.
- **Social Media Hover Effects** — Brand-colored hover states (LinkedIn blue, Twitter blue, Facebook blue, Instagram gradient).

## Design Tokens (CSS Variables)

### Light Theme (default)

| Variable            | Value     |
|---------------------|-----------|
| `--primary-bg`      | `#ffffff` |
| `--secondary-bg`    | `#f6f9fc` |
| `--accent-primary`  | `#635bff` |
| `--accent-secondary`| `#0073e6` |
| `--text-primary`    | `#0a2540` |
| `--text-secondary`  | `#425466` |
| `--text-light`      | `#8898aa` |
| `--border-color`    | `#e6ebf1` |

### Dark Theme (`data-theme="dark"`)

| Variable            | Value     |
|---------------------|-----------|
| `--primary-bg`      | `#0a0e1a` |
| `--secondary-bg`    | `#111827` |
| `--accent-primary`  | `#818cf8` |
| `--accent-secondary`| `#60a5fa` |
| `--text-primary`    | `#f1f5f9` |
| `--text-secondary`  | `#94a3b8` |
| `--text-light`      | `#64748b` |
| `--border-color`    | `#1e293b` |

## How to Run

No build step required. Simply open `index.html` in a browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Local HTTP server (recommended for region navigation)
python3 -m http.server 8080
# Then visit http://localhost:8080
```

Using a local server is recommended because `file://` protocol doesn't auto-resolve directory paths to `index.html`.

## Browser Support

Tested on modern browsers (Chrome, Safari, Firefox, Edge). Uses CSS custom properties, CSS Grid, IntersectionObserver, and ES6 — all widely supported.

## License

Copyright © 2026 DiligenceOS. All rights reserved.
>>>>>>> 978ffa6 (Initial commit: DiligenceOS multi-region website)
