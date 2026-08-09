(function () {
  "use strict";

  // ------------------------------------------------------------------
  // WhatsApp links
  // ------------------------------------------------------------------
  var WHATSAPP_NUMBER = "212777010882";

  var MESSAGES = {
    general: "Bonjour MB Affaires, je souhaite prendre rendez-vous pour discuter de mon projet.",
    rdv: "Bonjour MB Affaires, je souhaite prendre rendez-vous pour discuter de mon projet.",
    creation: "Bonjour MB Affaires, je souhaite avoir plus d’informations concernant la création d’entreprise.",
    invest: "Bonjour MB Affaires, je souhaite discuter d’un projet d’investissement.",
    domic: "Bonjour MB Affaires, je souhaite avoir plus d’informations concernant votre service de domiciliation.",
    ads: "Bonjour MB Affaires, je souhaite discuter de la gestion de mes campagnes publicitaires.",
    social: "Bonjour MB Affaires, je souhaite avoir plus d’informations sur la gestion des réseaux sociaux.",
    web: "Bonjour MB Affaires, je souhaite discuter de la création de mon site web."
  };

  function waLink(msg) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var key = el.getAttribute("data-wa-msg") || "general";
    el.setAttribute("href", waLink(MESSAGES[key] || MESSAGES.general));
  });

  // ------------------------------------------------------------------
  // Services dropdown (desktop)
  // ------------------------------------------------------------------
  var servicesNav = document.querySelector("[data-services-nav]");
  var servicesTrigger = document.querySelector("[data-services-trigger]");

  if (servicesNav && servicesTrigger) {
    servicesTrigger.addEventListener("click", function () {
      var isOpen = servicesNav.classList.toggle("open");
      servicesTrigger.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (e) {
      if (!servicesNav.contains(e.target)) {
        servicesNav.classList.remove("open");
        servicesTrigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        servicesNav.classList.remove("open");
        servicesTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ------------------------------------------------------------------
  // Mobile menu
  // ------------------------------------------------------------------
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  var mobileClosers = document.querySelectorAll("[data-mobile-close]");

  function openMobileMenu() {
    mobileMenu.classList.add("open");
    mobileToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileMenu && mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileClosers.forEach(function (el) {
      el.addEventListener("click", closeMobileMenu);
    });

    var mq900 = window.matchMedia("(min-width: 900px)");
    mq900.addEventListener("change", function (e) {
      if (e.matches) closeMobileMenu();
    });
  }

  // ------------------------------------------------------------------
  // Scroll reveal
  // ------------------------------------------------------------------
  var revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  // ------------------------------------------------------------------
  // Floating WhatsApp button
  // ------------------------------------------------------------------
  var floatWa = document.querySelector("[data-float-wa]");

  if (floatWa) {
    var ticking = false;
    function updateFloat() {
      var show = window.scrollY > window.innerHeight * 0.75;
      floatWa.classList.toggle("visible", show);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateFloat);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateFloat();
  }
})();
