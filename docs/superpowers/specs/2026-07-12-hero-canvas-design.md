# DOSACC Hero Canvas — Design

Date: 2026-07-12

## Purpose

Replace the static hero background on `index.html` with a restrained, interactive
data-mesh: an engineering grid, financial nodes at its intersections, and a gold
cursor response. The reference points are Stripe, Linear and Bloomberg — quiet
geometry, never decorative motion. The animation must be almost invisible when
idle and must never compete with the hero headline.

## Scope

Homepage hero only. The code lives in a standalone file so any other page can opt
in later by adding a single `<canvas>` element, but no other page is wired up in
this change.

## Files

- `assets/js/hero-canvas.js` — new. Self-contained IIFE, no dependencies.
- `index.html` — canvas element inside `.hero`, ~10 lines of CSS, one script tag.

## Architecture

Two render layers on a single Canvas2D context:

1. **Grid (static).** Never moves. Drawn once into an offscreen canvas on resize
   and blitted with one `drawImage` per frame, which the browser composites on the
   GPU. Zero per-frame path work.
2. **Nodes, lines, spotlight (dynamic).** Recomputed each frame.

Canvas2D rather than WebGL: at this node count WebGL buys no measurable frame time
and costs a shader pipeline plus several KB.

### Cursor cost

Nodes sit on a known grid, so the affected index range is derived directly from the
cursor position rather than by testing every node. Within the 180px radius that is
roughly 30 nodes on a typical viewport. Connection lines are only considered among
those illuminated nodes, between adjacent grid neighbours (including diagonals).
Everything else in a frame is one blit plus small fills.

### Motion model

- **Ambient float:** two summed sines per node with a per-node phase offset,
  amplitude ~1.5px.
- **Illumination:** exponential ease toward a smoothstep falloff target,
  `glow += (target - glow) * k`, with `k` normalised by delta-time so behaviour is
  identical at 60Hz and 120Hz.
- **Cursor:** the pointer position is itself eased before anything reads it. No part
  of the system reacts to a raw pointer coordinate — this is what removes jitter.
- No per-frame randomness anywhere.

### Idle cost

`IntersectionObserver` stops the loop when the hero scrolls out of view.
`visibilitychange` stops it on a background tab.

## Colours (as specified)

| Element      | Value                    |
|--------------|--------------------------|
| Grid         | `rgba(0,0,0,0.04)`       |
| Node (idle)  | `rgba(0,0,0,0.08)`       |
| Node (active)| `#B68A1F`                |
| Lines        | `rgba(182,138,31,0.18)`  |
| Spotlight    | `rgba(255,255,255,0.18)` |

**Known interaction:** the hero background is `#ffffff`, so a white spotlight is
inert over plain background. It reads only where it overlaps the existing gold
radial washes in `.hero::before`, lightening them as the cursor passes. This is
built as specified; if a visible halo over white is wanted, the spotlight colour
must change to a faint warm grey.

## Accessibility

`matchMedia('(prefers-reduced-motion: reduce)')` → draw one static frame (grid plus
idle nodes), never start `requestAnimationFrame`, ignore the pointer entirely. The
listener is live, so toggling the OS setting takes effect without a reload.

The canvas is `aria-hidden="true"` and `pointer-events: none`; it is purely
decorative and never intercepts clicks on the hero CTA.

## Budgets

- JavaScript: well under the 60KB ceiling (target < 10KB unminified).
- Frame: 60 FPS, with device pixel ratio capped at 2.

## Verification

No test framework exists in this repo. Verification is by loading the page,
confirming a clean console, confirming the hero renders and reacts, and confirming
the reduced-motion path produces a static frame.
