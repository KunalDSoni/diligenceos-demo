/* DiligenceOS corporate brochure - interactions
   Motion aligned to dosacc.com: 0.3–0.6s cubic-bezier(.25,.46,.45,.94),
   elegant fades; counters, services accordion, expanding process
   cards, marquee, navbar. */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Navbar: solid teal on scroll ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1600, 1);
      el.textContent = Math.round(easeOut(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

  /* ---------- Services: vertical auto-cycling carousel ----------
     Steady state in the track: [past (peeking above, expanded),
     active (expanded), next (collapsed), ...]. Each step slides the
     window down one card, then silently moves the first card to the
     end and resets the transform - an endless loop. */
  const svTrack = document.getElementById("svTrack");
  const svRail = document.getElementById("svRail");
  const svStage = document.getElementById("svStage");
  const SV_GAP = 14, SV_PEEK = 72, SV_STEP = 600, SV_AUTO = 3800;

  // Mobile (≤900px): CSS stacks all cards expanded - skip the carousel
  if (!matchMedia("(max-width: 900px)").matches) {

  // Build the icon tab rail (overlaid on the image) from the cards
  // in service order, before rotation
  [...svTrack.children].forEach((card) => {
    const dot = document.createElement("button");
    dot.className = "sv-dot";
    dot.dataset.id = card.dataset.id;
    dot.innerHTML = card.querySelector(".sv-icon").innerHTML;
    dot.setAttribute("aria-label", card.querySelector("h5").textContent);
    dot.addEventListener("click", () => jumpTo(+card.dataset.id));
    svRail.appendChild(dot);
  });

  // Rotate the last card to the front so it plays the "past" role
  svTrack.insertBefore(svTrack.lastElementChild, svTrack.firstElementChild);
  svTrack.children[0].classList.add("past");
  svTrack.children[1].classList.add("active");

  function svSync(id) {
    [...svRail.children].forEach((d) => d.classList.toggle("active", +d.dataset.id === id));
    svStage.querySelectorAll("img").forEach((img, i) => img.classList.toggle("show", i === id));
  }
  function svBase(noAnim) {
    const ty = -(svTrack.children[0].offsetHeight - SV_PEEK);
    if (noAnim) svTrack.style.transition = "none";
    svTrack.style.transform = `translateY(${ty}px)`;
    if (noAnim) {
      void svTrack.offsetHeight;
      svTrack.style.transition = "";
    }
  }

  let svBusy = false;
  function svStep() {
    if (svBusy) return;
    svBusy = true;
    const [c0, c1, c2] = svTrack.children;
    c1.classList.remove("active");
    c1.classList.add("past");
    c2.classList.add("active");
    svSync(+c2.dataset.id);
    svTrack.style.transform = `translateY(${-(c0.offsetHeight + SV_GAP + c1.offsetHeight - SV_PEEK)}px)`;
    setTimeout(() => {
      c0.classList.remove("past");
      svTrack.appendChild(c0);
      svBase(true);
      svBusy = false;
    }, SV_STEP);
  }
  function jumpTo(target) {
    if (svBusy || +svTrack.children[1].dataset.id === target) return;
    svStep();
    setTimeout(() => jumpTo(target), SV_STEP + 40);
    restartSv();
  }

  let svTimer;
  function restartSv() {
    clearInterval(svTimer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svTimer = setInterval(svStep, SV_AUTO);
    }
  }
  const svGrid = document.querySelector(".sv-grid");
  svGrid.addEventListener("mouseenter", () => clearInterval(svTimer));
  svGrid.addEventListener("mouseleave", restartSv);

  svSync(+svTrack.children[1].dataset.id);
  svBase(true);
  window.addEventListener("load", () => svBase(true));
  restartSv();

  } // end desktop-only services carousel

  /* ---------- Process: expanding cards ---------- */
  const pCards = document.querySelectorAll(".p-card");
  pCards.forEach((card) => {
    const activate = () => {
      pCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
    };
    card.addEventListener("mouseenter", activate);
    card.addEventListener("click", activate);
  });

  /* ---------- Anchor links: smooth scroll without a #hash in the URL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href !== "#" && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  // Landing with a #hash in the URL (e.g. a shared link): let the browser
  // jump to the section, then drop the hash so the address stays clean.
  if (location.hash) {
    setTimeout(() => history.replaceState(null, "", location.pathname + location.search), 0);
  }
  window.addEventListener("hashchange", () => {
    history.replaceState(null, "", location.pathname + location.search);
  });

  /* ---------- Marquee: duplicate chips for seamless loop ---------- */
  const track = document.getElementById("marqueeTrack");
  track.innerHTML += track.innerHTML;
});
