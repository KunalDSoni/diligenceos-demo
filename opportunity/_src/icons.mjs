/* Inline SVG icon set (replaces the FontAwesome CDN).
   Line-style, 24x24, inherit colour via currentColor (see .svgi in CSS).
   Note: fa-handshake-angle is rendered as an exchange/transactions glyph. */
export const ICONS = {
  'arrow-down':       '<path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/>',
  'arrow-left':       '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
  'arrow-right':      '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  'arrow-trend-up':   '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
  'binoculars':       '<circle cx="6.5" cy="14.5" r="3.5"/><circle cx="17.5" cy="14.5" r="3.5"/><path d="M5 11l1.2-5h3.3L10 11"/><path d="M19 11l-1.2-5h-3.3L14 11"/><path d="M10 13.5h4"/>',
  'calendar-check':   '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M16 2.5v4"/><path d="M8 2.5v4"/><path d="M3 9.5h18"/><path d="m9 15 2 2 4-4"/>',
  'chart-line':       '<path d="M4 4v16h16"/><path d="M7 14l4-4 3 3 5-6"/>',
  'earth-oceania':    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>',
  'gauge-high':       '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-5"/><circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none"/>',
  'handshake-angle':  '<path d="M7 5L3 9l4 4"/><path d="M3 9h13"/><path d="M17 19l4-4-4-4"/><path d="M21 15H8"/>',
  'layer-group':      '<path d="M12 3 3 8l9 5 9-5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
  'lightbulb':        '<path d="M9 18h6"/><path d="M10 21.5h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  'scale-balanced':   '<path d="M12 3v18"/><path d="M7.5 21h9"/><path d="M5 7l14-1.5"/><path d="M7 7l-3 6a3 3 0 0 0 6 0z"/><path d="M17 6l-3 6a3 3 0 0 0 6 0z"/>',
  'table-cells-large':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/>',
  'water':            '<path d="M12 3.5s6 5.8 6 10.5a6 6 0 0 1-12 0c0-4.7 6-10.5 6-10.5z"/>',
  'print':            '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  // industry + service icons
  'helmet-safety':    '<path d="M4 15a8 8 0 0 1 16 0"/><path d="M2 15h20v3H2z"/><path d="M10 7V4h2.5a4 4 0 0 1 3.5 3"/>',
  'utensils':         '<path d="M7 2v7a2 2 0 0 0 4 0V2"/><path d="M9 9v13"/><path d="M16 2c-1.7 0-3 2.7-3 6 0 2.5 .9 3.6 2 3.6h1V22"/>',
  'gas-pump':         '<path d="M4 22V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v18"/><path d="M3 22h10"/><rect x="5" y="6" width="6" height="4"/><path d="M12 8h3a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9l-2.5-2.5"/>',
  'stethoscope':      '<path d="M4 3v6a4 4 0 0 0 8 0V3"/><path d="M4 3H3M12 3h1"/><path d="M8 13a6 6 0 0 0 6 6 4 4 0 0 0 4-4v-2"/><circle cx="18" cy="11" r="2"/>',
  'bag-shopping':     '<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  'truck-fast':       '<path d="M2 8a1 1 0 0 1 1-1h9v10H3a1 1 0 0 1-1-1z"/><path d="M12 9h4l4 4v3h-8z"/><circle cx="7" cy="18.5" r="1.5"/><circle cx="17" cy="18.5" r="1.5"/><path d="M1 10h3M0 13h3"/>',
  'briefcase':        '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  'file-invoice':     '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/><path d="M9 9h3M9 13h6M9 17h6"/>',
  'users-gear':       '<circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6"/><path d="M17 13a6 6 0 0 1 4 6"/>',
  'receipt':          '<path d="M5 2v20l2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  'landmark':         '<path d="M3 21h18"/><path d="M5 21V10M9 21V10M15 21V10M19 21V10"/><path d="M3 10h18"/><path d="M12 3 21 8H3z"/>',
  'file-lines':       '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4"/><path d="M9 7h2M9 11h6M9 15h6"/>',
};

/* Replace every <i class="fas fa-NAME" ...></i> with an inline <svg>.
   Any extra attributes on the <i> (e.g. style="font-size:.8rem") are carried over. */
export function replaceIcons(html) {
  return html.replace(/<i class="fa[sb]? fa-([a-z0-9-]+)"([^>]*)><\/i>/g, (m, name, rest) => {
    const inner = ICONS[name];
    if (!inner) throw new Error('Missing inline icon for: ' + name);
    return `<svg class="svgi"${rest} viewBox="0 0 24 24" aria-hidden="true">${inner}</svg>`;
  });
}
