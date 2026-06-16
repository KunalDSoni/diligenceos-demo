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
