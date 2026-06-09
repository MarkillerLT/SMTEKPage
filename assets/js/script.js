/* =====================================================
   SMTEK Smart Technologies — script.js
   ===================================================== */

(function () {
  "use strict";

  // ── Dark mode ──────────────────────────────────────────
  const body = document.body;
  const toggleBtn = document.getElementById("dark-toggle");
  const toggleLabel = document.querySelector(".toggle-label");
  const logoImg = document.getElementById("logo-img");

  const LOGO_LIGHT = "assets/img/1.svg";
  const LOGO_DARK  = "assets/img/1b.svg";

  const LABEL_LIGHT = "Modo Oscuro";
  const LABEL_DARK  = "Modo Claro";

  function applyDarkMode(isDark) {
    body.classList.toggle("dark-mode", isDark);

    if (toggleLabel) {
      toggleLabel.textContent = isDark ? LABEL_DARK : LABEL_LIGHT;
    }

    if (logoImg) {
      logoImg.src = isDark ? LOGO_DARK : LOGO_LIGHT;
      logoImg.alt = "SMTEK Logo";
    }

    try {
      localStorage.setItem("smtek-dark-mode", isDark ? "1" : "0");
    } catch (_) {}
  }

  // Restore preference
  let prefersDark = false;
  try {
    const saved = localStorage.getItem("smtek-dark-mode");
    if (saved !== null) {
      prefersDark = saved === "1";
    } else {
      prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  } catch (_) {}

  applyDarkMode(prefersDark);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      applyDarkMode(!body.classList.contains("dark-mode"));
    });
  }

  // ── Mobile nav ────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav-principal");

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("abierto");
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Close on link click
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("abierto");
        hamburger.setAttribute("aria-expanded", false);
      });
    });
  }

  // ── Animated counters ─────────────────────────────────
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll("[data-counter]");

  if (counters.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  // ── Scroll reveal ─────────────────────────────────────
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }
})();
