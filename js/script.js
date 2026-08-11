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
  // Service detail modal
  // ------------------------------------------------------------------
  var SERVICE_DETAILS = {
    creation: {
      tag: "ENTREPRISE",
      title: "Création d’entreprise",
      intro: "Plus qu’une simple création : une structuration complète pour démarrer votre activité sur des bases solides, sans avoir à connaître le système vous-même.",
      bullets: [
        "Certificat négatif",
        "Préparation et enregistrement des statuts",
        "Taxe professionnelle",
        "Registre de Commerce",
        "Identifiant fiscal et publication légale",
        "Adhésion SIMPL DGI et affiliation CNSS",
        "Coordination complète du processus de constitution"
      ],
      note: "Vous gérez votre business. Nous gérons la paperasse."
    },
    invest: {
      tag: "ENTREPRISE",
      title: "Investissement",
      intro: "Avant de vous engager, nous analysons votre projet avec vous pour vous donner une vision claire du terrain et du potentiel réel de votre investissement.",
      bullets: [
        "Analyse de projet et étude de rentabilité",
        "Évaluation des opportunités locales",
        "Accompagnement personnalisé selon votre profil",
        "Un interlocuteur unique pour structurer votre décision"
      ],
      note: "Vous avez l’idée, le capital ou le partenaire. Nous vous aidons à la transformer en projet structuré."
    },
    domic: {
      tag: "ENTREPRISE",
      title: "Domiciliation",
      intro: "Une adresse professionnelle pour donner à votre entreprise une base crédible dès le premier jour, avec toutes les formalités prises en charge.",
      bullets: [
        "Adresse professionnelle",
        "Documents de domiciliation",
        "Formalités liées au siège social",
        "Gestion et réexpédition du courrier",
        "Accompagnement sur les démarches de domiciliation"
      ],
      note: "Votre entreprise démarre avec une présence professionnelle dès sa création."
    },
    ads: {
      tag: "CROISSANCE",
      title: "Publicités payantes",
      intro: "Des campagnes pensées pour transformer votre budget publicitaire en opportunités commerciales concrètes, avec un suivi transparent des résultats.",
      bullets: [
        "Stratégie et paramétrage Meta Ads",
        "Campagnes Google Ads",
        "Optimisation continue des performances",
        "Reporting clair pour décider sur des chiffres, pas des impressions"
      ],
      note: "Un accompagnement pensé pour la performance, pas seulement la visibilité."
    },
    social: {
      tag: "CROISSANCE",
      title: "Gestion des réseaux sociaux",
      intro: "Construisez une présence cohérente et professionnelle qui reflète votre marque, sans avoir à gérer le calendrier de publication vous-même.",
      bullets: [
        "Stratégie de contenu adaptée à votre activité",
        "Création et publication régulière",
        "Analyse des performances",
        "Cohérence visuelle avec votre identité de marque"
      ],
      note: "Une présence digitale alignée sur une même image de marque."
    },
    web: {
      tag: "CROISSANCE",
      title: "Création de sites web",
      intro: "Un site professionnel pensé pour présenter votre activité, inspirer confiance et convertir vos visiteurs en clients.",
      bullets: [
        "Design sur mesure adapté à votre secteur",
        "Site responsive sur tous les écrans",
        "Optimisation SEO et performance",
        "Structure pensée pour la conversion"
      ],
      note: "Votre vitrine digitale, à l’image de votre ambition."
    }
  };

  var modalOverlay = document.querySelector("[data-modal-overlay]");

  if (modalOverlay) {
    var modalTag = modalOverlay.querySelector("[data-modal-tag]");
    var modalTitle = modalOverlay.querySelector("[data-modal-title]");
    var modalIntro = modalOverlay.querySelector("[data-modal-intro]");
    var modalList = modalOverlay.querySelector("[data-modal-list]");
    var modalNote = modalOverlay.querySelector("[data-modal-note]");
    var modalCta = modalOverlay.querySelector("[data-modal-cta]");
    var lastFocused = null;

    function openModal(key) {
      var data = SERVICE_DETAILS[key];
      if (!data) return;
      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalIntro.textContent = data.intro;
      modalList.innerHTML = "";
      data.bullets.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b;
        modalList.appendChild(li);
      });
      modalNote.textContent = data.note;
      modalCta.setAttribute("href", waLink(MESSAGES[key] || MESSAGES.general));

      lastFocused = document.activeElement;
      modalOverlay.classList.add("open");
      modalOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      modalOverlay.querySelector(".modal-close").focus();
    }

    function closeModal() {
      modalOverlay.classList.remove("open");
      modalOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll("[data-modal-trigger]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-modal-trigger"));
      });
    });

    modalOverlay.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });

    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
    });
  }

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

    var mqDesktop = window.matchMedia("(min-width: 1000px)");
    mqDesktop.addEventListener("change", function (e) {
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
  // Count-up numbers (stat cards)
  // ------------------------------------------------------------------
  var countEls = document.querySelectorAll("[data-count]");
  var reduceMotionCount = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function parseCountTarget(text) {
    var m = text.match(/^([^\d]*)(\d+(?:[.,]\d+)?)([^\d]*)$/);
    if (!m) return null;
    var prefix = m[1], numStr = m[2], suffix = m[3];
    var hasDecimal = numStr.indexOf(",") !== -1;
    var pad = !hasDecimal && numStr.charAt(0) === "0" && numStr.length > 1 ? numStr.length : 0;
    return {
      prefix: prefix,
      suffix: suffix,
      target: parseFloat(numStr.replace(",", ".")),
      decimal: hasDecimal,
      pad: pad
    };
  }

  function formatCount(cfg, value) {
    var numStr = cfg.decimal ? value.toFixed(1).replace(".", ",") : String(Math.round(value));
    if (cfg.pad && numStr.length < cfg.pad) {
      numStr = new Array(cfg.pad - numStr.length + 1).join("0") + numStr;
    }
    return cfg.prefix + numStr + cfg.suffix;
  }

  function animateCount(el, cfg) {
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(cfg, cfg.target * eased);
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  if (countEls.length) {
    var countConfigs = new WeakMap();
    countEls.forEach(function (el) {
      var cfg = parseCountTarget(el.textContent.trim());
      if (!cfg) return;
      countConfigs.set(el, cfg);
      if (!reduceMotionCount) {
        el.textContent = formatCount(cfg, 0);
      }
    });

    if (!reduceMotionCount && "IntersectionObserver" in window) {
      var countIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var cfg = countConfigs.get(entry.target);
              if (cfg) animateCount(entry.target, cfg);
              countIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      countEls.forEach(function (el) { countIo.observe(el); });
    }
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

  // ------------------------------------------------------------------
  // Starfield background
  // ------------------------------------------------------------------
  var starsCanvas = document.getElementById("mb-stars");

  if (starsCanvas && starsCanvas.getContext) {
    var ctx = starsCanvas.getContext("2d");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [];
    var raf = null;

    function resizeStars() {
      var w = window.innerWidth, h = window.innerHeight;
      starsCanvas.width = w * dpr;
      starsCanvas.height = h * dpr;
      var count = Math.round((w * h) / 11000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * starsCanvas.width,
          y: Math.random() * starsCanvas.height,
          r: (Math.random() * 1.2 + 0.25) * dpr,
          a: Math.random() * 0.45 + 0.12,
          speed: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawStars(t) {
      ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduceMotion ? s.a : s.a + Math.sin((t / 1000) * s.speed + s.phase) * 0.2;
        ctx.beginPath();
        ctx.fillStyle = "rgba(198,224,255," + Math.max(0, Math.min(1, tw)) + ")";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) raf = window.requestAnimationFrame(drawStars);
    }

    resizeStars();
    window.addEventListener("resize", resizeStars);
    if (reduceMotion) {
      drawStars(0);
    } else {
      raf = window.requestAnimationFrame(drawStars);
    }
  }
})();
