/* ==========================================================================
   Md Samiul Islam Sagar (msis.io) — Single-Page Animations, Scroll-Spy & Security
   Compatible with Mobile Touchscreens, Tablets & Desktops
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMediaProtectionAndSecurity();
  initMobileNavAndScrollSpy();
  initScrollProgressAndBackToTop();
  initScrollReveal();
  initStatCounters();
  initCardSpotlightAndTilt();
  initHeroNeuralCanvas();
  initHeroTypewriter();
  initPublicationLiveSearch();
});

/* --------------------------------------------------------------------------
   1. Media Anti-Download & Client-Side Security Module
   -------------------------------------------------------------------------- */
function initMediaProtectionAndSecurity() {
  const toast = document.createElement("div");
  toast.className = "security-toast";
  toast.textContent = "🔒 Media downloading is disabled on this portfolio.";
  document.body.appendChild(toast);

  let toastTimeout;
  const showSecurityToast = () => {
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  document.querySelectorAll("img").forEach((img) => {
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showSecurityToast();
    });
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  document.querySelectorAll("video").forEach((video) => {
    video.setAttribute("controlsList", "nodownload noremoteplayback");
    video.setAttribute("disablePictureInPicture", "true");
    video.setAttribute("draggable", "false");
    video.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showSecurityToast();
    });
    video.addEventListener("dragstart", (e) => e.preventDefault());
  });

  document.querySelectorAll(".media-frame, canvas").forEach((frame) => {
    frame.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showSecurityToast();
    });
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (key === "s" || key === "u")) {
      e.preventDefault();
      showSecurityToast();
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Auto-Close & Section Scroll-Spy
   -------------------------------------------------------------------------- */
function initMobileNavAndScrollSpy() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".scroll-section");

  // Auto-close mobile menu when a link is tapped
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navToggle) navToggle.checked = false;
    });
  });

  // Highlight active section in navbar on scroll
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((sec) => spyObserver.observe(sec));
}

/* --------------------------------------------------------------------------
   3. Top Scroll Progress Bar & Floating Back-to-Top Button
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

      backToTopBtn.classList.toggle("visible", scrollTop > 380);
    },
    { passive: true }
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   4. Staggered Scroll-Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".hero, .stat-card, .card, .timeline-item, .pub-item, .media-frame, .section-header"
  );
  if (!elements.length) return;

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
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Animated Metric Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  const animateValue = (el) => {
    const rawText = el.textContent.trim();

    if (rawText.includes("/")) {
      const parts = rawText.split("/");
      const target = parseFloat(parts[0]);
      const suffix = ` / ${parts[1].trim()}`;
      if (isNaN(target)) return;

      const duration = 1400;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${(target * eased).toFixed(2)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      return;
    }

    const match = rawText.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const targetNum = parseFloat(match[1]);
    const suffix = match[2] || "";
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.floor(targetNum * eased)}${suffix}`;
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
    { threshold: 0.4 }
  );

  statNumbers.forEach((stat) => counterObserver.observe(stat));
}

/* --------------------------------------------------------------------------
   6. Desktop-Only 3D Card Tilt & Cursor Spotlight (Skipped on Touchscreens)
   -------------------------------------------------------------------------- */
function initCardSpotlightAndTilt() {
  // Only enable hover tilt on devices with a fine mouse pointer
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll(".card, .stat-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -2.8;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 2.8;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* --------------------------------------------------------------------------
   7. Hero Neural-Network Particle Canvas
   -------------------------------------------------------------------------- */
function initHeroNeuralCanvas() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.className = "hero-neural-canvas";
  hero.prepend(canvas);

  Array.from(hero.children).forEach((child) => {
    if (child !== canvas) {
      child.style.position = "relative";
      child.style.zIndex = "1";
    }
  });

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = hero.offsetWidth);
  let height = (canvas.height = hero.offsetHeight);

  const nodeCount = window.innerWidth < 600 ? 15 : 26;
  const nodes = Array.from({ length: nodeCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.6 + 1.1
  }));

  window.addEventListener("resize", () => {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;
      if (n1.x < 0 || n1.x > width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > height) n1.vy *= -1;

      ctx.beginPath();
      ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.42)";
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (dist < 125) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(45, 212, 191, ${0.16 * (1 - dist / 125)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* --------------------------------------------------------------------------
   8. Dynamic Research Specialty Typewriter
   -------------------------------------------------------------------------- */
function initHeroTypewriter() {
  const heroRole = document.querySelector(".hero-role");
  if (!heroRole) return;

  const specialties = [
    "AI-Driven Battery State of Health (SoH) & SoC Estimation",
    "LSTM Ensembles & Partial EIS Electrochemical Diagnostics",
    "1 MW / 1500 Vdc Silicon Carbide (SiC) Power Electronics",
    "Harsh-Environment YSZ & Inkjet-Printed UWB Antennas"
  ];

  const rotatorWrapper = document.createElement("div");
  rotatorWrapper.className = "hero-rotator";
  rotatorWrapper.innerHTML = `
    <span class="rotator-prefix">Focus:</span>
    <span class="rotator-text"></span><span class="rotator-cursor">|</span>
  `;
  heroRole.insertAdjacentElement("afterend", rotatorWrapper);

  const textEl = rotatorWrapper.querySelector(".rotator-text");
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = specialties[phraseIdx];
    charIdx += isDeleting ? -1 : 1;
    textEl.textContent = currentPhrase.substring(0, charIdx);

    let delay = isDeleting ? 26 : 48;
    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2100;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % specialties.length;
      delay = 320;
    }
    setTimeout(typeLoop, delay);
  }
  typeLoop();
}

/* --------------------------------------------------------------------------
   9. Live Keyword Search for Publications
   -------------------------------------------------------------------------- */
function initPublicationLiveSearch() {
  const pubControls = document.querySelector(".pub-filter-controls");
  const pubItems = document.querySelectorAll(".pub-item");
  if (!pubControls || !pubItems.length) return;

  const searchContainer = document.createElement("div");
  searchContainer.className = "pub-search-wrapper";
  searchContainer.innerHTML = `
    <input
      type="search"
      class="pub-search-input"
      placeholder="Search publications by keyword (e.g., LSTM, EIS, APEC 2026, YSZ, Antenna)..."
      aria-label="Search publications"
    />
  `;
  pubControls.insertAdjacentElement("beforebegin", searchContainer);

  const searchInput = searchContainer.querySelector(".pub-search-input");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    pubItems.forEach((item) => {
      const match = item.textContent.toLowerCase().includes(query);
      item.style.display = match ? "" : "none";
      if (match) {
        item.classList.remove("pub-pop-in");
        void item.offsetWidth;
        item.classList.add("pub-pop-in");
      }
    });
  });

  document.querySelectorAll(".pub-radio").forEach((radio) => {
    radio.addEventListener("change", () => {
      searchInput.value = "";
      pubItems.forEach((item) => {
        item.style.display = "";
        item.classList.remove("pub-pop-in");
        void item.offsetWidth;
        item.classList.add("pub-pop-in");
      });
    });
  });
}