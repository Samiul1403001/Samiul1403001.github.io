/* ==========================================================================
   Md Samiul Islam Sagar (msis.io) — Interactive Animations & Research UI
   Pure Vanilla ES6 JavaScript | Zero External Dependencies
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgressAndBackToTop();
  initScrollReveal();
  initStatCounters();
  initCardSpotlightAndTilt();
  initHeroNeuralCanvas();
  initHeroTypewriter();
  initPublicationLiveSearch();
});

/* --------------------------------------------------------------------------
   1. Top Scroll Progress Bar & Floating Back-to-Top Button
   -------------------------------------------------------------------------- */
function initScrollProgressAndBackToTop() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress-bar";
  document.body.prepend(progressBar);

  const backToTopBtn = document.createElement("button");
  backToTopBtn.className = "back-to-top-btn";
  backToTopBtn.setAttribute("aria-label", "Back to top");
  backToTopBtn.innerHTML = "&#8593;";
  document.body.appendChild(backToTopBtn);

  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;

      if (scrollTop > 380) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   2. Staggered Scroll-Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealSelectors = [
    ".hero",
    ".stat-card",
    ".card",
    ".timeline-item",
    ".pub-item",
    ".media-frame",
    ".section-header"
  ];

  const elements = document.querySelectorAll(revealSelectors.join(", "));
  if (!elements.length) return;

  // Assign staggered transition delays for grid siblings
  document
    .querySelectorAll(".stats-grid, .card-grid, .card-grid-2")
    .forEach((grid) => {
      Array.from(grid.children).forEach((child, index) => {
        child.style.transitionDelay = `${(index % 4) * 90}ms`;
      });
    });

  elements.forEach((el) => el.classList.add("reveal-on-scroll"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. Animated Metric Counters (.stat-number)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  const animateValue = (el) => {
    const rawText = el.textContent.trim();

    // Case 1: GPA format like "4.00 / 4.00"
    if (rawText.includes("/")) {
      const parts = rawText.split("/");
      const target = parseFloat(parts[0]);
      const suffix = ` / ${parts[1].trim()}`;
      if (isNaN(target)) return;

      const duration = 1400;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        el.textContent = `${(target * eased).toFixed(2)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      return;
    }

    // Case 2: Leading integer/float with suffix like "18+", "155+", "1 MW"
    const match = rawText.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return; // Skip pure text badges like "DoE & NSF"

    const targetNum = parseFloat(match[1]);
    const suffix = match[2] || "";
    const duration = 1500;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(targetNum * eased);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = rawText;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => counterObserver.observe(stat));
}

/* --------------------------------------------------------------------------
   4. Interactive 3D Card Tilt & Radial Cursor Spotlight
   -------------------------------------------------------------------------- */
function initCardSpotlightAndTilt() {
  const interactiveCards = document.querySelectorAll(".card, .stat-card");

  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for radial spotlight glow
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Subtle 3D tilt (max 3.5 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.2;
      const rotateY = ((x - centerX) / centerX) * 3.2;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* --------------------------------------------------------------------------
   5. Hero Neural-Network & Battery Node Interactive Canvas
   -------------------------------------------------------------------------- */
function initHeroNeuralCanvas() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.style.position = "relative";
  hero.style.overflow = "hidden";

  const canvas = document.createElement("canvas");
  canvas.className = "hero-neural-canvas";
  hero.prepend(canvas);

  // Ensure hero children sit above the background canvas
  Array.from(hero.children).forEach((child) => {
    if (child !== canvas) {
      child.style