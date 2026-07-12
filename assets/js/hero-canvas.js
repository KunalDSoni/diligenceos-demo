/*
 * DOSACC hero canvas — an engineering grid with financial nodes that
 * illuminate in gold under the cursor.
 *
 * Mounts on any <canvas data-hero-canvas> whose parent is the positioned
 * container it should fill. Decorative only: aria-hidden, pointer-events none.
 */
(function () {
  'use strict';

  var GRID = 64;                 // px between intersections (CSS px)
  var RADIUS = 180;              // cursor influence radius
  var LINK = GRID * 1.55;        // node-to-node link distance (reaches diagonals)
  var FLOAT = 1.5;               // ambient float amplitude, px
  var NODE_R = 1.4;              // idle node radius, px
  var SPOT_R = 260;              // spotlight radius, px
  var GLOW_EASE = 9;             // per-second easing rate for node glow
  var CURSOR_EASE = 11;          // per-second easing rate for the cursor itself
  var MAX_DPR = 2;

  var GRID_COLOR = 'rgba(0,0,0,0.04)';
  var NODE_COLOR = 'rgba(0,0,0,0.08)';
  var ACTIVE_COLOR = '182,138,31';   // #B68A1F, as components for alpha blending
  var LINE_COLOR = 'rgba(182,138,31,0.18)';
  var SPOT_COLOR = '255,255,255';

  var canvas = document.querySelector('canvas[data-hero-canvas]');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var host = canvas.parentElement;
  var grid = document.createElement('canvas');   // static grid, blitted each frame
  var gctx = grid.getContext('2d');

  var dpr = 1;
  var w = 0, h = 0;
  var cols = 0, rows = 0;
  var nodes = [];

  // Eased cursor. `strength` fades the whole interaction in and out, so nodes
  // return to idle together when the pointer leaves rather than snapping.
  var cur = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, tStrength: 0, seen: false };

  var running = false;
  var visible = true;
  var onScreen = true;
  var last = 0;
  var frame = 0;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── geometry ─────────────────────────────────────────────────────────── */

  function build() {
    var rect = host.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Inset by half a cell so the grid never lands hard against the edges.
    cols = Math.floor(w / GRID) + 1;
    rows = Math.floor(h / GRID) + 1;
    var ox = (w - (cols - 1) * GRID) / 2;
    var oy = (h - (rows - 1) * GRID) / 2;

    nodes = new Array(cols * rows);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c;
        nodes[i] = {
          ox: ox + c * GRID,
          oy: oy + r * GRID,
          x: 0, y: 0,
          // Deterministic phase per node — no per-frame randomness anywhere.
          phase: (c * 0.9 + r * 1.7) % (Math.PI * 2),
          glow: 0
        };
        settle(nodes[i], 0);
      }
    }

    drawGrid(ox, oy);
  }

  function drawGrid(ox, oy) {
    grid.width = canvas.width;
    grid.height = canvas.height;
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gctx.clearRect(0, 0, w, h);
    gctx.strokeStyle = GRID_COLOR;
    gctx.lineWidth = 1;
    gctx.beginPath();
    for (var c = 0; c < cols; c++) {
      // Half-pixel offset keeps hairlines crisp instead of smearing over two rows.
      var x = Math.round(ox + c * GRID) + 0.5;
      gctx.moveTo(x, 0);
      gctx.lineTo(x, h);
    }
    for (var r = 0; r < rows; r++) {
      var y = Math.round(oy + r * GRID) + 0.5;
      gctx.moveTo(0, y);
      gctx.lineTo(w, y);
    }
    gctx.stroke();
  }

  /* ── motion ───────────────────────────────────────────────────────────── */

  function settle(n, t) {
    n.x = n.ox + Math.sin(t * 0.00021 + n.phase) * FLOAT;
    n.y = n.oy + Math.cos(t * 0.00017 + n.phase * 1.3) * FLOAT;
  }

  function smoothstep(e) {
    return e * e * (3 - 2 * e);
  }

  /* ── render ───────────────────────────────────────────────────────────── */

  function render(t, dt) {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(grid, 0, 0, w, h);

    // Delta-time normalised easing: identical behaviour at 60Hz and 120Hz.
    var k = dt > 0 ? 1 - Math.exp(-CURSOR_EASE * dt) : 1;
    cur.x += (cur.tx - cur.x) * k;
    cur.y += (cur.ty - cur.y) * k;
    cur.strength += (cur.tStrength - cur.strength) * k;

    var gk = dt > 0 ? 1 - Math.exp(-GLOW_EASE * dt) : 1;
    var i, n;

    for (i = 0; i < nodes.length; i++) settle(nodes[i], t);

    // Only nodes whose grid index falls inside the cursor radius can have a
    // non-zero target, so the falloff is computed over ~30 nodes, not all of them.
    var lit = [];
    if (cur.strength > 0.001 && cur.seen) {
      var span = Math.ceil(RADIUS / GRID) + 1;
      var cc = Math.round((cur.x - nodes[0].ox) / GRID);
      var cr = Math.round((cur.y - nodes[0].oy) / GRID);
      for (var r = Math.max(0, cr - span); r <= Math.min(rows - 1, cr + span); r++) {
        for (var c = Math.max(0, cc - span); c <= Math.min(cols - 1, cc + span); c++) {
          n = nodes[r * cols + c];
          var dx = n.x - cur.x, dy = n.y - cur.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d > RADIUS) continue;
          n.target = smoothstep(1 - d / RADIUS) * cur.strength;
          lit.push(n);
        }
      }
    }

    // Ease every node toward its target; anything not lit this frame targets 0
    // and drifts back down at the same rate, so there is no snap on pointer-out.
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      var target = n.target || 0;
      n.glow += (target - n.glow) * gk;
      n.target = 0;
    }

    // Spotlight sits under the nodes so it never washes out the gold.
    if (cur.strength > 0.001 && cur.seen) {
      var g = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, SPOT_R);
      g.addColorStop(0, 'rgba(' + SPOT_COLOR + ',' + (0.18 * cur.strength).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(' + SPOT_COLOR + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cur.x, cur.y, SPOT_R, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lines between lit neighbours. Fades with the weaker of the two endpoints,
    // so a line never outlives the glow that justified it.
    if (lit.length > 1) {
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 1;
      for (i = 0; i < lit.length; i++) {
        var a = lit[i];
        for (var j = i + 1; j < lit.length; j++) {
          var b = lit[j];
          var lx = a.x - b.x, ly = a.y - b.y;
          var dist = Math.sqrt(lx * lx + ly * ly);
          if (dist > LINK) continue;
          var strength = Math.min(a.glow, b.glow) * (1 - dist / LINK);
          if (strength < 0.02) continue;
          ctx.globalAlpha = strength;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    // Idle nodes in one pass, then lit nodes on top in gold.
    ctx.fillStyle = NODE_COLOR;
    ctx.beginPath();
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      ctx.moveTo(n.x + NODE_R, n.y);
      ctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2);
    }
    ctx.fill();

    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      if (n.glow < 0.02) continue;
      ctx.fillStyle = 'rgba(' + ACTIVE_COLOR + ',' + n.glow.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(n.x, n.y, NODE_R + n.glow * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── loop ─────────────────────────────────────────────────────────────── */

  function tick(t) {
    if (!running) return;
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    render(t, dt);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (running || reduced()) return;
    running = true;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  function sync() {
    if (visible && onScreen) start(); else stop();
  }

  function reduced() {
    return motionQuery.matches;
  }

  /* ── static frame (reduced motion) ────────────────────────────────────── */

  function still() {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(grid, 0, 0, w, h);
    ctx.fillStyle = NODE_COLOR;
    ctx.beginPath();
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.moveTo(n.ox + NODE_R, n.oy);
      ctx.arc(n.ox, n.oy, NODE_R, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  /* ── input ────────────────────────────────────────────────────────────── */

  function point(e) {
    if (reduced()) return;
    var rect = host.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (!cur.seen) { cur.x = x; cur.y = y; cur.seen = true; }
    cur.tx = x;
    cur.ty = y;
    cur.tStrength = 1;
  }

  function leave() {
    cur.tStrength = 0;
  }

  /* ── wiring ───────────────────────────────────────────────────────────── */

  function apply() {
    if (reduced()) {
      stop();
      still();
    } else {
      sync();
    }
  }

  function resize() {
    build();
    if (reduced()) still();
  }

  build();

  // Fine pointers only — a touch "hover" would leave the mesh lit with no way
  // to dismiss it.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    host.addEventListener('pointermove', point, { passive: true });
    host.addEventListener('pointerleave', leave, { passive: true });
  }

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function () { resize(); });
    ro.observe(host);
  } else {
    window.addEventListener('resize', resize);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (!reduced()) sync();
    }, { threshold: 0 });
    io.observe(host);
  }

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    if (!reduced()) sync();
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', apply);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(apply);
  }

  apply();
})();
