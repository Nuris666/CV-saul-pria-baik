(function () {
  const body = document.body;
  const header = document.querySelector("header");
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sectionLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  body.classList.add("js-enabled");

  function getHeaderOffset() {
    return header ? header.offsetHeight + 14 : 0;
  }

  function closeMenu() {
    if (!menuButton || !navMenu) return;

    menuButton.classList.remove("is-open");
    navMenu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka menu navigasi");
  }

  function toggleMenu() {
    if (!menuButton || !navMenu) return;

    const willOpen = !navMenu.classList.contains("is-open");
    menuButton.classList.toggle("is-open", willOpen);
    navMenu.classList.toggle("is-open", willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  }

  function scrollToTarget(target) {
    const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", toggleMenu);

    document.addEventListener("click", function (event) {
      const clickedInsideMenu = navMenu.contains(event.target);
      const clickedButton = menuButton.contains(event.target);

      if (!clickedInsideMenu && !clickedButton) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 660) {
        closeMenu();
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();
      scrollToTarget(target);
      history.pushState(null, "", targetId);
    });
  });

  const revealItems = Array.from(document.querySelectorAll(
    ".hero-copy, .hero-art, .section, .card, .practice-card, .stat-card, .testimonial-card, .contact-card, .office-photo-placeholder, .cta-banner, .contact-form"
  ));

  revealItems.forEach(function (item, index) {
    item.classList.add("scroll-reveal");
    item.classList.add("reveal-delay-" + ((index % 3) + 1));
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  const sections = Array.from(document.querySelectorAll(".hero, main section[id]"));

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const activeId = entry.target.id || "home";
        const activeLink = document.querySelector('.nav-menu a[href="#' + activeId + '"]');
        sectionLinks.forEach(function (link) {
          link.classList.toggle("is-active", link === activeLink);
        });
      });
    }, {
      threshold: 0.4,
      rootMargin: "-18% 0px -52% 0px"
    });

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });
  }

  const counters = Array.from(document.querySelectorAll("[data-count]"));

  function animateCounter(counter) {
    const target = Number(counter.dataset.count || "0");
    const duration = reduceMotion ? 1 : 1200;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString("id-ID");

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (counter) {
        counter.textContent = Number(counter.dataset.count || "0").toLocaleString("id-ID");
      });
    } else {
      const counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.6
      });

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    }
  }

  const consultationForms = Array.from(document.querySelectorAll("[data-consultation-form]"));

  consultationForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const note = form.querySelector("[data-form-note]");
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : "";

      if (submitButton) {
        submitButton.textContent = "Permintaan Terkirim";
        submitButton.disabled = true;
      }

      if (note) {
        note.textContent = "Terima kasih. Tim Saul Pria Baik & Partners akan menghubungi Anda untuk konsultasi awal.";
        note.classList.add("is-success");
      }

      window.setTimeout(function () {
        if (submitButton) {
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }
      }, 2600);
    });
  });
})();
