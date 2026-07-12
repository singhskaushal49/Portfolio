document.addEventListener("DOMContentLoaded", () => {
  // Current Year
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* =========================
     Utility Functions
  ========================= */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /* =========================
     Haptic Feedback (Vibration API)
  ========================= */
  const haptic = {
    // Check if vibration is supported (mobile only)
    supported: 'vibrate' in navigator,

    // Light tap — for nav links, chips, small buttons
    light() {
      if (this.supported) navigator.vibrate(15);
    },

    // Medium — for main CTAs, toggle buttons
    medium() {
      if (this.supported) navigator.vibrate(35);
    },

    // Heavy — for send/submit actions, important feedback
    heavy() {
      if (this.supported) navigator.vibrate([30, 20, 30]);
    },

    // Success pattern — for form submit, download
    success() {
      if (this.supported) navigator.vibrate([10, 50, 10, 50, 80]);
    },

    // Error pattern — for wrong input etc.
    error() {
      if (this.supported) navigator.vibrate([100, 30, 100]);
    }
  };

  // Auto-apply haptics to all interactive elements
  function initHaptics() {
    if (!haptic.supported) return; // Skip on desktop

    // Light haptic: nav links, sidebar links, quick reply chips
    document.querySelectorAll('.nav-link, .sidebar-nav-link, .quick-reply-chip, .social-pill').forEach(el => {
      el.addEventListener('click', () => haptic.light());
    });

    // Medium haptic: all main buttons (CTAs, toggle, hamburger, chatbot button)
    document.querySelectorAll('.magnetic-btn, .chatbot-toggle, .hamburger, .back-to-top, .sidebar-close, #chatbot-close, .music-toggle, .submit-btn').forEach(el => {
      el.addEventListener('click', () => haptic.medium());
    });

    // Heavy haptic: chatbot send button (important action)
    const chatSend = document.getElementById('chatbot-send');
    if (chatSend) {
      chatSend.addEventListener('click', () => haptic.heavy());
    }

    // Success haptic: resume download
    document.querySelectorAll('[download], .cert-link-btn').forEach(el => {
      el.addEventListener('click', () => haptic.success());
    });

    // Medium haptic: back-to-top
    const btt = document.getElementById('back-to-top');
    if (btt) btt.addEventListener('click', () => haptic.medium());

    console.log('✅ Haptic Feedback initialized on mobile');
  }

  initHaptics();

  /* =========================
     Loader & GSAP Animations
  ========================= */
  function initGSAP() {
    console.log("Initializing GSAP animations...");
    if (typeof gsap === "undefined") {
      console.warn("GSAP is not loaded. Skipping animations.");
      return;
    }

    // Register ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // --- Entrance Animation Timeline ---
    const entranceTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial state setup to prevent flashes
    gsap.set(".header", { y: -100, opacity: 0 });
    gsap.set(".logo", { scale: 0.8, opacity: 0 });
    gsap.set(".nav-links li", { opacity: 0, y: -20 });
    gsap.set(".nav-actions button, .nav-socials a", { opacity: 0, scale: 0.5 });
    gsap.set(".hero h1", { y: 60, opacity: 0 });
    gsap.set(".hero h2", { y: 40, opacity: 0 });
    gsap.set(".hero .btn-primary, .hero .btn-secondary", { y: 30, opacity: 0 });

    entranceTimeline
      .to(".header", { y: 0, opacity: 1, duration: 1.2 })
      .to(".logo", { scale: 1, opacity: 1, duration: 0.8 }, "-=0.6")
      .to(".nav-links li", { opacity: 1, y: 0, stagger: 0.08, duration: 0.8 }, "-=0.5")
      .to(".nav-actions button, .nav-socials a", { opacity: 1, scale: 1, stagger: 0.08, duration: 0.6 }, "-=0.4")
      .to(".hero h1", { y: 0, opacity: 1, duration: 1.2 }, "-=0.6")
      .to(".hero h2", { y: 0, opacity: 1, duration: 1 }, "-=0.8")
      .to(".hero .btn-primary, .hero .btn-secondary", { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 }, "-=0.7");

    // --- Scroll-Triggered Section Animations ---
    if (typeof ScrollTrigger !== "undefined") {
      // About Section
      gsap.from(".about-img-frame", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      gsap.from(".about-content", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        x: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      // Location Section
      gsap.from(".map-container", {
        scrollTrigger: {
          trigger: ".location",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Leetcode Dashboard Card
      gsap.from(".leetcode-stats-card", {
        scrollTrigger: {
          trigger: ".leetcode",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)"
      });

      // Skills Section
      gsap.from(".skills .skill", {
        scrollTrigger: {
          trigger: ".skills",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        scale: 0.5,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.5)"
      });

      // Projects Section
      gsap.from(".projects-swiper", {
        scrollTrigger: {
          trigger: ".projects",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Experience Section
      gsap.from(".experience .timeline-item", {
        scrollTrigger: {
          trigger: ".experience",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        x: -40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });


      // Contact Form
      gsap.from(".connect .connect-container", {
        scrollTrigger: {
          trigger: ".connect",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Testimonials Section
      gsap.from(".testimonials-swiper", {
        scrollTrigger: {
          trigger: ".testimonials",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // --- Scroll Progress Indicator Animation ---
      gsap.to(".scroll-progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3
        }
      });

      // Refresh ScrollTrigger positions after configuration
      ScrollTrigger.refresh();
      console.log("ScrollTrigger registered and refreshed.");
    }

    // --- Magnetic CTA Buttons ---
    const magneticButtons = document.querySelectorAll(".btn-primary, .btn-secondary");
    magneticButtons.forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });
  }

  const loader = document.getElementById("loader");
  if (loader) {
    let loaderHidden = false;
    const handleLoaderOut = () => {
      if (loaderHidden) return;
      loaderHidden = true;
      try {
        if (typeof gsap !== "undefined") {
          gsap.to(loader, {
            opacity: 0,
            y: -100,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
              loader.style.display = "none";
              initGSAP();
            }
          });
        } else {
          loader.style.display = "none";
          initGSAP();
        }
      } catch (e) {
        console.error("Error hiding loader:", e);
        loader.style.display = "none";
        initGSAP();
      }
    };

    window.addEventListener("load", handleLoaderOut);
    // Fallback if window load already fired or takes too long (e.g. broken images)
    if (document.readyState === "complete") {
      handleLoaderOut();
    } else {
      setTimeout(handleLoaderOut, 1500); // 1.5s fallback
    }
  } else {
    initGSAP();
  }

  /* =========================
     Navbar Toggle & Hamburger Animation
  ========================= */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navPillWrapper = document.querySelector(".nav-pill-wrapper");
  const navActions = document.querySelector(".nav-actions");
  const navSocials = document.querySelector(".nav-socials");
  const sidebarClose = document.getElementById("sidebarClose");

  const closeSidebar = () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
    if(navPillWrapper) navPillWrapper.classList.remove("mobile-open");
    if(navActions) navActions.classList.remove("mobile-open");
    if(navSocials) navSocials.classList.remove("mobile-open");
    document.body.style.overflow = "";
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("open");
      // Show links / socials / actions in mobile drawer
      if(navPillWrapper) navPillWrapper.classList.toggle("mobile-open");
      if(navActions) navActions.classList.toggle("mobile-open");
      if(navSocials) navSocials.classList.toggle("mobile-open");
      // Prevent body scroll when menu open
      document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
    });

    // Close on close button click
    if(sidebarClose) {
      sidebarClose.addEventListener("click", closeSidebar);
    }

    // Close nav on link click (mobile)
    navMenu.querySelectorAll("a.nav-link").forEach(link => {
      link.addEventListener("click", closeSidebar);
    });

    // Close on clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeSidebar();
      }
    });
  }

  /* =========================
     Sliding Nav Indicator
  ========================= */
  const pillWrapper = document.querySelector(".nav-pill-wrapper");
  const navIndicator = document.getElementById("navIndicator");
  const header = document.getElementById("header");
  const navLinks = document.querySelectorAll(".nav-link");
  let activeLink = document.querySelector(".nav-link.active");

  function moveIndicator(el) {
    if (!el || !pillWrapper || !navIndicator) return;
    if (window.innerWidth <= 1024) {
      navIndicator.style.opacity = "0";
      return;
    }
    const wrapperRect = pillWrapper.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    const left = linkRect.left - wrapperRect.left;
    const width = linkRect.width;

    navIndicator.style.left = left + "px";
    navIndicator.style.width = width + "px";
    navIndicator.style.opacity = "1";
  }

  // Initialize indicator after fonts/layout settle
  if (activeLink) {
    window.addEventListener("load", () => {
      setTimeout(() => moveIndicator(activeLink), 100);
    });
    // Fallback
    setTimeout(() => moveIndicator(activeLink), 500);
  }

  // Hover: move indicator to hovered link
  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
      if (window.innerWidth > 1024) moveIndicator(link);
    });
    link.addEventListener("mouseleave", () => {
      if (window.innerWidth > 1024) moveIndicator(activeLink);
    });
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if(!targetSection) return;

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      activeLink = link;
      moveIndicator(activeLink);

      // Wipe Animation
      const wipe = document.getElementById("pageWipe");
      const wipeText = document.getElementById("wipeText");
      
      if(wipe && typeof gsap !== "undefined") {
        const sectionName = link.textContent;
        if(wipeText) wipeText.textContent = sectionName;

        const tl = gsap.timeline();
        tl.to(wipe, { top: 0, duration: 0.6, ease: "power4.inOut" })
          .to(wipeText, { opacity: 1, duration: 0.3 })
          .call(() => {
            const yOffset = -70; 
            const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'instant'});
          })
          .to(wipeText, { opacity: 0, duration: 0.3 }, "+=0.2")
          .to(wipe, { top: "-100%", duration: 0.6, ease: "power4.inOut" })
          .set(wipe, { top: "100%" });
      } else {
        const yOffset = -70; 
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    });
  });

  // Recalculate on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      moveIndicator(activeLink);
    } else {
      if (navIndicator) navIndicator.style.opacity = "0";
    }
  });

  /* =========================
     Header Scroll Effect
  ========================= */
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  /* =========================
     Scroll Spy — highlight active nav link
  ========================= */
  const spySections = document.querySelectorAll("section[id]");
  if (spySections.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          const match = document.querySelector(`.nav-link[data-section="${id}"]`);
          if (match) {
            navLinks.forEach(l => l.classList.remove("active"));
            match.classList.add("active");
            activeLink = match;
            if (window.innerWidth > 1024) moveIndicator(activeLink);
          }
        }
      });
    }, {
      root: null,
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    });

    spySections.forEach(s => spyObserver.observe(s));
  }


  /* =========================
     Background Music Toggle
   ========================= */

  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");
  let isPlaying = false;

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", () => {
      if (!isPlaying) {
        bgMusic.play().then(() => {
          const icon = musicToggle.querySelector(".action-icon");
          if (icon) icon.textContent = "⏸";
          isPlaying = true;
        }).catch(err => console.log("Audio play prevented:", err));
      } else {
        bgMusic.pause();
        const icon = musicToggle.querySelector(".action-icon");
        if (icon) icon.textContent = "🎵";
        isPlaying = false;
      }
    });
  }



  /* =========================
     Custom Cursor (Physics-based trail)
  ========================= */
  (() => {
    const cursorWrap = document.getElementById("customCursor");
    const cursorDot = document.getElementById("cursorDot");
    if (!cursorWrap || !cursorDot) return;

    const isTouch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) {
      cursorWrap.style.display = "none";
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Outer cursor physics coordinates
    let outerX = mouseX;
    let outerY = mouseY;
    
    // Inner cursor coordinates
    let innerX = mouseX;
    let innerY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorWrap.style.opacity = 1;
    });

    window.addEventListener("mouseleave", () => {
      cursorWrap.style.opacity = 0;
    });

    window.addEventListener("mouseenter", () => {
      cursorWrap.style.opacity = 1;
    });

    function animateCursor() {
      // Lagging effect for outer ring
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;

      // Faster response for inner dot
      innerX += (mouseX - innerX) * 0.25;
      innerY += (mouseY - innerY) * 0.25;

      cursorWrap.style.transform = `translate3d(${outerX}px, ${outerY}px, 0)`;
      cursorDot.style.transform = `translate3d(${innerX - outerX}px, ${innerY - outerY}px, 0)`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover interactive elements scaling
    const hoverSelectors = "a, button, .card, .card-btn, .nav ul li a, .social-icon, .connect-form button, .skill, .lc-card, .timeline-item";
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener("mouseenter", () => cursorWrap.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursorWrap.classList.remove("hover"));
    });

    // Click feedback
    window.addEventListener("mousedown", () => cursorWrap.classList.add("active"));
    window.addEventListener("mouseup", () => cursorWrap.classList.remove("active"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cursorWrap.style.display = "none";
    }
  })();

  /* =========================
     Typewriter Auto-text
  ========================= */
  const autoTextEl = document.querySelector(".auto-text");
  if (autoTextEl) {
    const texts = ["Web Developer", "DevOps Enthusiast", "Cloud Engineer", "Problem Solver"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    
    function type() {
      if (count === texts.length) count = 0;
      currentText = texts[count];
      letter = currentText.slice(0, ++index);
      autoTextEl.textContent = letter;
      
      if (letter.length === currentText.length) {
        setTimeout(() => {
          index = 0;
          count++;
          autoTextEl.textContent = '';
          type();
        }, 2200);
      } else {
        setTimeout(type, 100);
      }
    }
    type();
  }

  /* =========================
     LeetCode Realtime Dashboard
  ========================= */
  (function initLeetCodeDashboard() {
    const LC_USERNAME = "singhskaushal49";
    const API_URL     = `https://leetcode-api-faisalshohag.vercel.app/${LC_USERNAME}`;
    const REFRESH_MS  = 5 * 60 * 1000; // auto-refresh every 5 min

    // DOM refs
    const card         = document.getElementById("leetcodeCard");
    const elSolved     = document.getElementById("lcSolved");
    const elTotal      = document.getElementById("lcTotal");
    const elRank       = document.getElementById("lcRank");
    const elAccept     = document.getElementById("lcAcceptance");
    const elCircle     = document.getElementById("lcProgressCircle");
    const elEasyS      = document.getElementById("lcEasySolved");
    const elEasyT      = document.getElementById("lcEasyTotal");
    const elEasyBar    = document.getElementById("lcEasyBar");
    const elMedS       = document.getElementById("lcMediumSolved");
    const elMedT       = document.getElementById("lcMediumTotal");
    const elMedBar     = document.getElementById("lcMediumBar");
    const elHardS      = document.getElementById("lcHardSolved");
    const elHardT      = document.getElementById("lcHardTotal");
    const elHardBar    = document.getElementById("lcHardBar");
    const liveBadge    = document.querySelector(".live-badge");

    if (!card) return;

    // ── Animated counter (pure rAF — GSAP counter proxy is unreliable here) ──
    function animateCount(el, from, to, duration = 1200) {
      const start = performance.now();
      const range = to - from;
      function tick(now) {
        const elapsed = Math.min(now - start, duration);
        const t = elapsed / duration;
        // cubic ease-out
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(from + range * ease);
        if (elapsed < duration) requestAnimationFrame(tick);
        else el.textContent = to; // guarantee final value
      }
      requestAnimationFrame(tick);
    }

    // ── Circular SVG progress ──
    const CIRCLE_R  = 60;
    const CIRCUM    = 2 * Math.PI * CIRCLE_R; // ≈ 377
    function setCircularProgress(pct) {
      const offset = CIRCUM - (CIRCUM * Math.min(pct, 1));
      if (elCircle) elCircle.style.strokeDashoffset = offset;
    }

    // ── Populate UI with data ──
    function render(data) {
      const totalSolved  = data.totalSolved       || 0;
      const totalQ       = data.totalQuestions    || 3977;
      const easySolved   = data.easySolved        || 0;
      const easyTotal    = data.totalEasy         || 951;
      const medSolved    = data.mediumSolved      || 0;
      const medTotal     = data.totalMedium       || 2077;
      const hardSolved   = data.hardSolved        || 0;
      const hardTotal    = data.totalHard         || 949;
      const ranking      = data.ranking           || null;

      // Compute acceptance: acSubmissions / totalSubmissions for "All"
      const allAc    = (data.matchedUserStats?.acSubmissionNum?.find(d => d.difficulty === "All")?.submissions) || 0;
      const allTotal = (data.totalSubmissions?.find(d => d.difficulty === "All")?.submissions) || 0;
      const acceptance = allTotal > 0
        ? ((allAc / allTotal) * 100).toFixed(1) + "%"
        : "—";

      // counters
      animateCount(elSolved, 0, totalSolved);
      if (elTotal) elTotal.textContent = totalQ;

      // rank
      if (elRank) elRank.textContent = ranking
        ? "#" + Number(ranking).toLocaleString()
        : "—";

      // acceptance
      if (elAccept) elAccept.textContent = acceptance;

      // bars
      setTimeout(() => {
        if (elEasyS) animateCount(elEasyS, 0, easySolved, 1400);
        if (elEasyT) elEasyT.textContent = easyTotal;
        if (elEasyBar) elEasyBar.style.width = ((easySolved / easyTotal) * 100).toFixed(1) + "%";

        if (elMedS) animateCount(elMedS, 0, medSolved, 1400);
        if (elMedT) elMedT.textContent = medTotal;
        if (elMedBar) elMedBar.style.width = ((medSolved / medTotal) * 100).toFixed(1) + "%";

        if (elHardS) animateCount(elHardS, 0, hardSolved, 1400);
        if (elHardT) elHardT.textContent = hardTotal;
        if (elHardBar) elHardBar.style.width = ((hardSolved / hardTotal) * 100).toFixed(1) + "%";
      }, 300);

      // circle
      setTimeout(() => setCircularProgress(totalSolved / totalQ), 200);

      // badge – show "UPDATED" briefly then revert
      if (liveBadge) {
        liveBadge.textContent = "● UPDATED";
        liveBadge.style.color = "#22c55e";
        liveBadge.style.background = "rgba(34,197,94,0.15)";
        setTimeout(() => {
          liveBadge.textContent = "● LIVE STREAMING";
          liveBadge.style.color = "";
          liveBadge.style.background = "";
        }, 2500);
      }
    }

    // ── Error state ──
    function showError() {
      if (liveBadge) {
        liveBadge.textContent = "⚠ OFFLINE";
        liveBadge.style.color = "#f59e0b";
        liveBadge.style.background = "rgba(245,158,11,0.12)";
      }
    }

    // ── Fetch ──
    async function fetchStats() {
      try {
        const res = await fetch(API_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        render(data);
        console.log("[LeetCode] Stats loaded:", data);
      } catch (err) {
        console.warn("[LeetCode] API error:", err.message);
        showError();
      }
    }

    // Initial fetch + periodic refresh
    fetchStats();
    setInterval(fetchStats, REFRESH_MS);

    // ── 3D Card tilt on hover ──
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -18;
      card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.15s ease";
    });
  })();

  /* =========================
     Back To Top Button
  ========================= */
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     Interactive 3D Environment (Three.js)
  ========================= */
  const canvas = document.getElementById("webgl-canvas");
  if (canvas && typeof THREE !== "undefined") {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Generative Art: Particle Geometry
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color('#38bdf8');
    const colorOutside = new THREE.Color('#818cf8');

    for (let i = 0; i < count * 3; i += 3) {
      // Spherical distribution
      const radius = 20 * Math.random();
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i] = x;
      positions[i+1] = y;
      positions[i+2] = z;

      // Color mixing based on radius
      const mixedColor = colorInside.clone().lerp(colorOutside, radius / 20);
      colors[i] = mixedColor.r;
      colors[i+1] = mixedColor.g;
      colors[i+2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    // Mesh
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.001;
      mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Scroll Interaction
    let scrollY = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();
    
    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate sphere slowly
      particles.rotation.y = elapsedTime * 0.1;
      particles.rotation.x = elapsedTime * 0.05;

      // Interactive Parallax
      targetX = mouseX * 2;
      targetY = mouseY * 2;
      
      // Add scroll effect to camera position
      const scrollOffset = scrollY * 0.01;

      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - scrollOffset - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    
    // Render animation on all devices as requested
    animate();
  }

  /* =========================
     Smart Chatbot Engine
  ========================= */
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbot = document.getElementById("chatbot");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotSend = document.getElementById("chatbot-send");
  const typingIndicator = document.getElementById("typing-indicator");
  const quickReplies = document.querySelectorAll(".chip");

  if (chatbotToggle && chatbot) {
    chatbotToggle.addEventListener("click", () => {
      chatbot.classList.add("active");
    });
  }

  if (chatbotClose && chatbot) {
    chatbotClose.addEventListener("click", () => {
      chatbot.classList.remove("active");
    });
  }

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerHTML = text; // allow bolding and links
    chatbotMessages.insertBefore(msg, typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function showTyping() {
    typingIndicator.classList.remove("hidden");
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function hideTyping() {
    typingIndicator.classList.add("hidden");
  }

  const knowledgeBase = [
    {
      patterns: [/hi/i, /hello/i, /hey/i, /greet/i, /morning/i, /evening/i, /afternoon/i],
      responses: [
        "Hi there! 👋 I'm Kaushal's virtual assistant. How can I help you today?",
        "Hello! I'm here to answer questions about Kaushal's portfolio.",
        "Hey! What would you like to know about Kaushal?"
      ]
    },
    {
      patterns: [/skill/i, /tech/i, /stack/i, /language/i, /framework/i, /know/i],
      responses: [
        "Kaushal is skilled in <strong>HTML, CSS, JavaScript, React, Java, AWS, Azure, Docker, Kubernetes</strong>, and more! Check out the Skills section for the full list. 🚀",
        "His core stack revolves around <strong>Cloud (AWS/Azure)</strong>, <strong>DevOps (Docker/K8s/CI-CD)</strong>, and <strong>Web Development (React, JS)</strong>. 💻",
        "He's a versatile engineer with strong skills in Cloud architecture, DevOps automation, and Full-Stack development!"
      ]
    },
    {
      patterns: [/experience/i, /work/i, /job/i, /intern/i, /company/i],
      responses: [
        "Kaushal is currently a <strong>Cloud Engineer at Primenet Global</strong>. He has also interned at <strong>Maruti Suzuki</strong> (DevOps), <strong>QX-Lencer</strong> (Web Dev), and <strong>Honeywell</strong> (Data Analysis). 💼",
        "He has rich experience spanning Cloud Architecture, DevOps CI/CD pipelines, and Web Development across multiple top companies like Maruti Suzuki and Honeywell!"
      ]
    },
    {
      patterns: [/project/i, /portfolio/i, /build/i, /made/i],
      responses: [
        "Some of his top projects include a <strong>Sorting Visualizer</strong>, a <strong>Hospital Management System</strong>, and <strong>Maven Market</strong>. You can see them in the Projects section above! 🛠️",
        "He builds responsive web apps and scalable cloud architectures. The Sorting Visualizer and Hospital Management systems are great examples of his work!"
      ]
    },
    {
      patterns: [/contact/i, /email/i, /phone/i, /reach/i, /call/i, /hire/i],
      responses: [
        "You can reach Kaushal via email at <a href='mailto:singhskaushal49@gmail.com'>singhskaushal49@gmail.com</a> or call him at <strong>+91 9625882776</strong>. Let's connect! 📞",
        "Looking to hire? Shoot an email to singhskaushal49@gmail.com or connect with him on LinkedIn! 🤝"
      ]
    },
    {
      patterns: [/resume/i, /cv/i, /download/i],
      responses: [
        "You can download Kaushal's resume directly from the Hero section at the top of the page! 📄",
        "Scroll up to the top and click 'Download Resume' to get a copy of his CV."
      ]
    },
    {
      patterns: [/location/i, /where/i, /live/i, /city/i, /relocate/i],
      responses: [
        "Kaushal is based in <strong>Lucknow, Uttar Pradesh, India</strong> 📍. He is open to relocation and remote opportunities worldwide! 🌍"
      ]
    },
    {
      patterns: [/who are you/i, /bot/i, /ai/i],
      responses: [
        "I'm a SmartBot created by Kaushal to help visitors navigate this portfolio and learn more about his skills and experience! 🤖"
      ]
    }
  ];

  function getBotResponse(input) {
    for (const entry of knowledgeBase) {
      if (entry.patterns.some(pattern => pattern.test(input))) {
        const randomIndex = Math.floor(Math.random() * entry.responses.length);
        return entry.responses[randomIndex];
      }
    }
    return "That's an interesting question! For specific details not covered here, I highly recommend reaching out to Kaushal directly at singhskaushal49@gmail.com. ✉️";
  }

  if (chatbotSend && chatbotInput) {
    const processInput = (text) => {
      if (!text) return;
      addMessage(text, "user");
      chatbotInput.value = "";
      
      showTyping();
      
      // Simulate network delay for realism
      setTimeout(() => {
        hideTyping();
        const reply = getBotResponse(text);
        addMessage(reply, "bot");
      }, 800 + Math.random() * 500); // random delay between 800ms and 1300ms
    };

    const handleSend = () => {
      processInput(chatbotInput.value.trim());
    };

    chatbotSend.addEventListener("click", handleSend);
    chatbotInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSend();
    });

    // Quick Replies
    quickReplies.forEach(chip => {
      chip.addEventListener("click", () => {
        processInput(chip.textContent);
      });
    });
  }

  /* =========================
     Form Submission & Custom Popup
  ========================= */
  const connectForm = document.querySelector(".connect-form");
  if (connectForm) {
    connectForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = connectForm.querySelector("button");
      const originalText = button.textContent;
      button.textContent = "Sending...";
      button.disabled = true;

      try {
        await fetch(connectForm.action, {
          method: "POST",
          body: new FormData(connectForm),
          headers: { Accept: "application/json" },
        });
        showPopup("✅ Message sent successfully!");
        connectForm.reset();
      } catch (error) {
        showPopup("❌ Failed to send message. Please try again.");
      } finally {
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  }

  function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup-message";
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 50);
    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 400);
    }, 3200);
  }

  /* =========================
     Swiper.js Initialization
  ========================= */
  if (typeof Swiper !== 'undefined') {
    // Projects Swiper
    new Swiper('.projects-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      keyboard: { enabled: true },
      pagination: {
        el: '.proj-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.proj-next',
        prevEl: '.proj-prev',
      },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 20 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      }
    });

    // Testimonials Swiper
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      keyboard: { enabled: true },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.test-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      }
    });
  } else {
    console.warn("Swiper.js not loaded");
  }

  /* =========================
     Particle Click Burst Effect
  ========================= */
  (function initParticleClickEffect() {
    const COLORS = [
      '#38bdf8', '#818cf8', '#34d399', '#fb923c',
      '#f472b6', '#facc15', '#a78bfa', '#60a5fa'
    ];

    function spawnParticles(x, y) {
      const count = 18;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'click-particle';

        // Random properties
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size  = Math.random() * 8 + 4;   // 4–12 px
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = Math.random() * 90 + 40;  // 40–130 px
        const tx    = Math.cos(angle) * speed;
        const ty    = Math.sin(angle) * speed;

        Object.assign(particle.style, {
          left            : x + 'px',
          top             : y + 'px',
          width           : size + 'px',
          height          : size + 'px',
          background      : color,
          '--tx'          : tx + 'px',
          '--ty'          : ty + 'px',
          boxShadow       : `0 0 ${size + 4}px ${color}`,
          animationDuration: (Math.random() * 0.4 + 0.5) + 's'
        });

        document.body.appendChild(particle);

        // Remove after animation completes
        particle.addEventListener('animationend', () => particle.remove());
      }
    }

    document.addEventListener('click', (e) => {
      // Don't fire on input, button, or link elements — let those be
      spawnParticles(e.clientX, e.clientY);
    });
  })();

  /* =========================
     3D Tilt Effect on Cards
  ========================= */
  (function initTiltEffect() {
    const TILT_SELECTORS = [
      '.card',
      '.cert-card',
      '.swiper-slide.testimonial-card',
      '.skill-category',
      '.timeline-content',
      '.about-img-frame',
      '.lc-stat-box',
    ];

    const MAX_TILT   = 12;   // degrees
    const SCALE      = 1.04;
    const GLOW_SIZE  = 200;  // px

    function applyTilt(card) {
      // Ensure perspective is on the parent
      card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      card.style.willChange = 'transform';
      card.style.transformStyle = 'preserve-3d';

      // Glowing inner-light div
      const glow = document.createElement('div');
      glow.className = 'tilt-glow';
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        const rect    = card.getBoundingClientRect();
        const cx      = rect.left + rect.width  / 2;
        const cy      = rect.top  + rect.height / 2;
        const dx      = e.clientX - cx;
        const dy      = e.clientY - cy;
        const rotateX = (-dy / (rect.height / 2)) * MAX_TILT;
        const rotateY = ( dx / (rect.width  / 2)) * MAX_TILT;

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${SCALE})`;

        // Move glow to follow cursor
        const glowX = e.clientX - rect.left - GLOW_SIZE / 2;
        const glowY = e.clientY - rect.top  - GLOW_SIZE / 2;
        glow.style.left    = glowX + 'px';
        glow.style.top     = glowY + 'px';
        glow.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        glow.style.opacity = '0';
      });
    }

    // Apply to all matching cards
    TILT_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(applyTilt);
    });

    // Re-apply for dynamically-rendered Swiper slides (after Swiper init)
    const observer = new MutationObserver(() => {
      TILT_SELECTORS.forEach(sel => {
        document.querySelectorAll(sel + ':not([data-tilt-init])').forEach(card => {
          card.setAttribute('data-tilt-init', '1');
          applyTilt(card);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  })();

  /* =========================
     Number Counter Animation
  ========================= */
  (function initCounters() {
    function animateCounter(el) {
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1800; // ms
      const stepTime = 16;   // ~60fps
      const steps    = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
      }, stepTime);
    }

    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // only animate once
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  })();
  /* =========================
     Next-Level Canvas Cursor Trail
  ========================= */
  (function initNextLevelCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Ignore on touch devices

    const dot = document.getElementById('cursorDot');
    const canvas = document.getElementById('cursorTrailCanvas');
    if (!dot || !canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });

    let mouse = { x: width / 2, y: height / 2 };
    
    // Trail Points
    const numPoints = 25;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      points.push({ x: width / 2, y: height / 2 });
    }

    let isHovering = false;
    let targetRadiusBase = 6;
    let currentRadiusBase = 6;
    let targetAlpha = 0.8;
    let currentAlpha = 0.8;

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.left = `${mouse.x}px`;
      dot.style.top = `${mouse.y}px`;
    });

    const clickables = document.querySelectorAll('a, button, input, textarea, .project-card, .timeline-item, .nav-link');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        dot.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        isHovering = false;
        dot.classList.remove('hovered');
      });
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Lerp base properties for hover transition
      targetRadiusBase = isHovering ? 12 : 6;
      targetAlpha = isHovering ? 1.0 : 0.8;
      currentRadiusBase += (targetRadiusBase - currentRadiusBase) * 0.15;
      currentAlpha += (targetAlpha - currentAlpha) * 0.15;

      // Point 0 follows mouse instantly
      points[0].x = mouse.x;
      points[0].y = mouse.y;

      // Other points follow the one in front of them for fluid motion
      for (let i = 1; i < numPoints; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.35;
        points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      }

      // Draw glowing fluid spheres along the curve
      for (let i = 0; i < numPoints; i++) {
        const progress = 1 - (i / numPoints); // 1 at head, 0 at tail
        // Base radius gets smaller towards the tail
        const radius = progress * currentRadiusBase + 1; 
        
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2);
        
        // Use HSL for dynamic color if hovering, otherwise cyan
        const r = isHovering ? 14 : 56;
        const g = isHovering ? 165 : 189;
        const b = isHovering ? 233 : 248;
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${progress * currentAlpha})`;
        ctx.shadowBlur = progress * 15;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    
    draw();
  })();

  /* =========================
     Swiper Initialization
  ========================= */
  if (document.querySelector(".certifications-swiper")) {
    new Swiper(".certifications-swiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      }
    });
  }
});
