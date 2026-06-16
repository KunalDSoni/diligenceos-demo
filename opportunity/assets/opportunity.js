(function () {
  var html = document.documentElement;
  html.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* --- Reading progress bar --- */
  var bar = document.getElementById('progress');
  function onScroll() {
    var st = html.scrollTop || document.body.scrollTop;
    var max = (html.scrollHeight - html.clientHeight) || 1;
    if (bar) bar.style.width = Math.min(st / max * 100, 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Smooth-scroll same-page anchors, keep URL clean --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var t = id.length > 1 ? document.querySelector(id) : null;
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
  if (location.hash) { setTimeout(function () { history.replaceState(null, '', location.pathname + location.search); }, 0); }
  window.addEventListener('hashchange', function () { history.replaceState(null, '', location.pathname + location.search); });

  /* --- Count-up for headline statistics --- */
  function fmt(v, dec, grouped) {
    var s = v.toFixed(dec);
    if (grouped) { var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = p.join('.'); }
    return s;
  }
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var raw = el.textContent.trim();
    var m = raw.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return;
    var prefix = m[1], core = m[2], suffix = m[3];
    var grouped = core.indexOf(',') !== -1;
    var dec = core.indexOf('.') !== -1 ? core.split('.')[1].length : 0;
    var target = parseFloat(core.replace(/,/g, ''));
    if (reduce || isNaN(target)) { el.textContent = raw; return; }
    var dur = 1300, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(target * e, dec, grouped) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
    }
    requestAnimationFrame(step);
  }

  /* --- Animate bar/column fills on reveal --- */
  function animFills(scope) {
    scope.querySelectorAll('.bar-fill').forEach(function (b) {
      if (b.dataset.w) return; var w = b.style.width || '0%'; b.dataset.w = w;
      b.style.width = '0%'; requestAnimationFrame(function () { requestAnimationFrame(function () { b.style.width = w; }); });
    });
    scope.querySelectorAll('.col-bar, .gbar, .stack-seg').forEach(function (b) {
      if (b.dataset.h) return; var h = b.style.height || '0%'; b.dataset.h = h;
      b.style.height = '0%'; requestAnimationFrame(function () { requestAnimationFrame(function () { b.style.height = h; }); });
    });
  }

  /* --- Donut rings --- */
  function initDonut(c) {
    var r = parseFloat(c.getAttribute('r')), circ = 2 * Math.PI * r;
    var pct = parseFloat(c.dataset.pct) || 0, arc = circ * pct / 100;
    c.style.strokeDasharray = arc + ' ' + circ;
    c.style.strokeDashoffset = reduce ? 0 : arc;
  }
  document.querySelectorAll('.donut-val').forEach(initDonut);

  function onEnter(el) {
    el.classList.add('in');
    animFills(el);
    el.querySelectorAll('.donut-val').forEach(function (c) { c.style.strokeDashoffset = 0; });
    if (el.classList.contains('numbers')) el.querySelectorAll('b').forEach(countUp);
  }

  function revealAll() {
    document.querySelectorAll('.reveal').forEach(onEnter);
    document.querySelectorAll('.numbers b').forEach(countUp);
    document.querySelectorAll('.donut-val').forEach(function (c) { c.style.strokeDashoffset = 0; });
  }

  try {
    if (reduce) {
      /* reduced-motion: render everything at its final state, no animation */
      document.querySelectorAll('.numbers b').forEach(countUp);
      document.querySelectorAll('.donut-val').forEach(function (c) { c.style.strokeDashoffset = 0; });
    } else {
      /* stagger cards/donuts within their row */
      document.querySelectorAll('.grid, .grid-2, .donut-row').forEach(function (g) {
        var i = 0;
        Array.prototype.forEach.call(g.children, function (c) {
          if (c.classList && (c.classList.contains('card') || c.classList.contains('donut-card'))) {
            c.classList.add('d' + (i % 3 + 1)); i++;
          }
        });
      });

      /* Scroll-based reveal: bulletproof. Anything in (or above) view is shown
         immediately; lower content animates in as it is scrolled to. Nothing can
         ever stay hidden, because every element is reveal-checked on each frame. */
      var revealEls = [].slice.call(document.querySelectorAll(
        '.numbers, .chart, .callout, .pull, .compare, .table-wrap, .donut-card, .card'));
      revealEls.forEach(function (el) { el.classList.add('reveal'); });

      var ticking = false;
      function check() {
        ticking = false;
        var vh = window.innerHeight || html.clientHeight;
        for (var i = revealEls.length - 1; i >= 0; i--) {
          if (revealEls[i].getBoundingClientRect().top < vh * 0.92) {
            onEnter(revealEls[i]); revealEls.splice(i, 1);
          }
        }
      }
      function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      window.addEventListener('load', check);
      check();
      /* hard failsafe: after 3s, reveal anything still hidden no matter what */
      setTimeout(function () { revealEls.slice().forEach(onEnter); revealEls.length = 0; }, 3000);
    }
  } catch (err) {
    /* absolute failsafe: never leave content hidden */
    revealAll();
  }
})();
