(() => {
  const WORD_CLASS = "lang-word";
  const SKIP_SELECTOR =
    "script, style, svg, noscript, textarea, input, select, option, code, pre, .lang-slider, .lang-word";
  const IN_MS = 300;
  const OUT_MS = 260;
  const MAX_DELAY_MS = 420;

  if (window.__gdptLangMorph) return;
  window.__gdptLangMorph = true;

  let morphing = false;
  let pendingLocale = null;
  /** @type {HTMLElement | null} */
  let overlay = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function stripLocale(pathname) {
    if (pathname === "/vi" || pathname.startsWith("/vi/")) {
      return pathname.replace(/^\/vi/, "") || "/";
    }
    return pathname;
  }

  function localeOf(pathname) {
    return pathname === "/vi" || pathname.startsWith("/vi/") ? "vi" : "en";
  }

  function localePath(locale, path) {
    const clean = path === "/" ? "" : path.replace(/\/$/, "");
    if (locale === "vi") return clean ? "/vi" + clean : "/vi";
    return clean || "/";
  }

  function isLangSwitch(from, to) {
    return (
      stripLocale(from.pathname) === stripLocale(to.pathname) &&
      localeOf(from.pathname) !== localeOf(to.pathname)
    );
  }

  function wordDelay(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const vw = window.innerWidth || 1;
    const top = Math.min(Math.max(r.top, 0), vh);
    const left = Math.min(Math.max(r.left, 0), vw);
    return Math.min(
      MAX_DELAY_MS,
      (top / vh) * MAX_DELAY_MS * 0.68 + (left / vw) * MAX_DELAY_MS * 0.32,
    );
  }

  function wrapWords(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent || !node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = [];
    for (const textNode of textNodes) {
      const text = textNode.textContent || "";
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const span = document.createElement("span");
        span.className = WORD_CLASS;
        span.textContent = part;
        frag.appendChild(span);
        words.push(span);
      }
      if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
    }
    return words;
  }

  function unwrapWords(root) {
    const scope = root || document.body;
    for (const word of scope.querySelectorAll("." + WORD_CLASS)) {
      const parent = word.parentNode;
      if (!parent) continue;
      parent.replaceChild(document.createTextNode(word.textContent || ""), word);
      parent.normalize();
    }
  }

  function animateWords(words, direction) {
    if (!words.length) return Promise.resolve();
    const duration = direction === "out" ? OUT_MS : IN_MS;
    const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
    return Promise.all(
      words.map((el) => {
        const keyframes =
          direction === "out"
            ? [
                { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
                { opacity: 0, filter: "blur(3px)", transform: "translateY(0.1em)" },
              ]
            : [
                { opacity: 0, filter: "blur(3px)", transform: "translateY(-0.1em)" },
                { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
              ];
        return el.animate(keyframes, {
          duration,
          delay: wordDelay(el),
          easing,
          fill: direction === "out" ? "forwards" : "both",
        }).finished;
      }),
    );
  }

  function setSliderLocale(locale) {
    const slider = document.querySelector(".lang-slider");
    if (!(slider instanceof HTMLElement)) return;
    slider.dataset.locale = locale;
    slider.setAttribute(
      "aria-label",
      locale === "vi" ? "Ngôn ngữ" : "Language",
    );
    for (const opt of slider.querySelectorAll(".lang-slider-opt")) {
      if (!(opt instanceof HTMLElement)) continue;
      const optLocale = opt.getAttribute("hreflang") === "vi" ? "vi" : "en";
      if (optLocale === locale) opt.setAttribute("aria-current", "true");
      else opt.removeAttribute("aria-current");
    }
  }

  function syncSlider() {
    const path = stripLocale(location.pathname);
    const locale = localeOf(location.pathname);
    const slider = document.querySelector(".lang-slider");
    if (!(slider instanceof HTMLElement)) return;

    const en = slider.querySelector('[hreflang="en"]');
    const vi = slider.querySelector('[hreflang="vi"]');
    if (en instanceof HTMLElement) en.setAttribute("href", localePath("en", path));
    if (vi instanceof HTMLElement) vi.setAttribute("href", localePath("vi", path));

    setSliderLocale(pendingLocale || locale);
    pendingLocale = null;
  }

  function buildOverlay() {
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    if (!main) return null;

    const wrap = document.createElement("div");
    wrap.id = "lang-morph-overlay";
    wrap.setAttribute("aria-hidden", "true");

    const mainClone = main.cloneNode(true);
    mainClone.removeAttribute("id");
    mainClone.querySelectorAll("img").forEach((img) => {
      img.style.visibility = "hidden";
    });
    wrap.appendChild(mainClone);

    if (footer instanceof HTMLElement) {
      const footClone = footer.cloneNode(true);
      footClone.querySelectorAll("img").forEach((img) => {
        img.style.visibility = "hidden";
      });
      wrap.appendChild(footClone);
    }

    const top = main.getBoundingClientRect().top + window.scrollY;
    wrap.style.top = top + "px";
    return wrap;
  }

  function clearOverlay() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    const stray = document.getElementById("lang-morph-overlay");
    if (stray) stray.remove();
  }

  // Thumb moves on pointerdown — before navigation
  document.addEventListener(
    "pointerdown",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest(".lang-slider-opt");
      if (!(link instanceof HTMLElement)) return;
      if (link.getAttribute("aria-current") === "true") return;
      const locale = link.getAttribute("hreflang") === "vi" ? "vi" : "en";
      pendingLocale = locale;
      setSliderLocale(locale);
    },
    true,
  );

  document.addEventListener("astro:before-preparation", (event) => {
    if (!isLangSwitch(event.from, event.to) || prefersReducedMotion()) {
      morphing = false;
      clearOverlay();
      return;
    }

    morphing = true;
    document.documentElement.classList.add("lang-morphing");

    const locale = localeOf(event.to.pathname);
    pendingLocale = locale;
    setSliderLocale(locale);
  });

  document.addEventListener("astro:before-swap", (event) => {
    if (!morphing) return;
    clearOverlay();
    overlay = buildOverlay();
    event.newDocument.documentElement.classList.add(
      "lang-morphing",
      "lang-morph-pre",
    );
  });

  document.addEventListener("astro:after-swap", () => {
    if (!morphing) return;
    document.documentElement.classList.add("lang-morphing", "lang-morph-pre");
    if (overlay) document.body.appendChild(overlay);
    syncSlider();
  });

  document.addEventListener("astro:page-load", () => {
    syncSlider();

    if (!morphing) {
      clearOverlay();
      return;
    }

    void (async () => {
      const header = document.querySelector(".site-header");
      const main = document.getElementById("main");
      const footer = document.querySelector("footer");
      const roots = [header, main, footer].filter(Boolean);

      const incoming = roots.flatMap((root) => wrapWords(root));
      const outgoing = overlay ? wrapWords(overlay) : [];

      document.documentElement.classList.add("lang-morph-words");
      document.documentElement.classList.remove("lang-morph-pre");

      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );

      // Crossfade: old words cascade out on overlay, new words cascade in underneath
      await Promise.all([
        animateWords(outgoing, "out"),
        animateWords(incoming, "in"),
      ]);

      for (const root of roots) unwrapWords(root);
      clearOverlay();

      document.documentElement.classList.remove(
        "lang-morphing",
        "lang-morph-words",
        "lang-morph-pre",
      );
      morphing = false;
    })();
  });
})();
