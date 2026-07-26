(() => {
  const SKIP =
    "script, style, svg, noscript, textarea, input, select, option, code, pre, .lang-slider";
  const WORD_MS = 140;
  const MAX_POS_DELAY = 380;
  const WORD_STAGGER = 18;

  if (window.__gdptLangMorph) return;
  window.__gdptLangMorph = true;

  let busy = false;

  function reducedMotion() {
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

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function collectTextNodes(root) {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent || !String(node.textContent).trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (!parent || parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function splitWords(text) {
    const parts = String(text).split(/(\s+)/);
    const words = [];
    for (const part of parts) {
      if (!part || /^\s+$/.test(part)) continue;
      words.push(part);
    }
    return words;
  }

  function leadingSpace(text) {
    const m = String(text).match(/^\s*/);
    return m ? m[0] : "";
  }

  function trailingSpace(text) {
    const m = String(text).match(/\s*$/);
    return m ? m[0] : "";
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

  function syncSlider(locale) {
    const path = stripLocale(location.pathname);
    const slider = document.querySelector(".lang-slider");
    if (!(slider instanceof HTMLElement)) return;
    const en = slider.querySelector('[hreflang="en"]');
    const vi = slider.querySelector('[hreflang="vi"]');
    if (en instanceof HTMLElement) en.setAttribute("href", localePath("en", path));
    if (vi instanceof HTMLElement) vi.setAttribute("href", localePath("vi", path));
    setSliderLocale(locale);
  }

  function rewriteInternalLinks(locale) {
    document.querySelectorAll("a[href]").forEach((a) => {
      if (!(a instanceof HTMLElement)) return;
      if (a.closest(".lang-slider")) return;
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      if (/^https?:\/\//i.test(href)) return;
      const path = stripLocale(href.split("?")[0].split("#")[0] || "/");
      a.setAttribute("href", localePath(locale, path || "/"));
    });
  }

  function posDelay(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const vw = window.innerWidth || 1;
    const top = Math.min(Math.max(r.top, 0), vh);
    const left = Math.min(Math.max(r.left, 0), vw);
    return (top / vh) * MAX_POS_DELAY * 0.7 + (left / vw) * MAX_POS_DELAY * 0.3;
  }

  function uiChrome(el) {
    return el.closest(
      ".btn, .nav-link, .header-action, summary.btn, button, [role='button']",
    );
  }

  function isFitButton(ui) {
    return ui instanceof HTMLElement && ui.classList.contains("btn");
  }

  function contentBoxWidth(el) {
    const cs = getComputedStyle(el);
    return Math.max(
      0,
      el.clientWidth -
        (parseFloat(cs.paddingLeft) || 0) -
        (parseFloat(cs.paddingRight) || 0),
    );
  }

  /** CSS design size — ignores any inline fit we already applied. */
  function baseFontSize(el) {
    const kept = el.style.fontSize;
    el.style.fontSize = "";
    const px = parseFloat(getComputedStyle(el).fontSize) || 14;
    el.style.fontSize = kept;
    return px;
  }

  function measureTextWidth(text, el, fontPx) {
    const cs = getComputedStyle(el);
    const probe = document.createElement("span");
    probe.style.cssText = [
      "position:absolute",
      "left:-9999px",
      "top:0",
      "visibility:hidden",
      "white-space:nowrap",
      "font-family:" + cs.fontFamily,
      "font-weight:" + cs.fontWeight,
      "font-style:" + cs.fontStyle,
      "letter-spacing:" + cs.letterSpacing,
      "font-size:" + fontPx + "px",
    ].join(";");
    probe.textContent = text;
    document.body.appendChild(probe);
    const w = probe.getBoundingClientRect().width;
    probe.remove();
    return w;
  }

  function fitFontSize(text, el, availPx) {
    const base = baseFontSize(el);
    const t = String(text || "").trim();
    if (!t || !(availPx > 0)) return base;
    const w = measureTextWidth(t, el, base);
    if (!(w > 0) || w <= availPx) return base;
    // Floor ~75% of design size so it stays readable
    return Math.max(base * 0.75, (base * availPx) / w);
  }

  function freezeButtonBox(ui, widthPx) {
    const w = Math.ceil(widthPx);
    if (!(w > 0)) return;
    ui.style.boxSizing = "border-box";
    ui.style.width = w + "px";
    ui.style.minWidth = w + "px";
    ui.style.maxWidth = w + "px";
    ui.style.whiteSpace = "nowrap";
    ui.style.overflow = "hidden";
    ui.style.flexShrink = "0";
  }

  // Nav links only: hold width for the crossfade, then release.
  function lockUiSize(ui, width) {
    if (!(ui instanceof HTMLElement) || !(width > 0)) return;
    if (isFitButton(ui)) return;
    const prev = parseFloat(ui.style.minWidth) || 0;
    const next = Math.ceil(Math.max(prev, width));
    if (next > prev) ui.style.minWidth = next + "px";
  }

  function releaseUiSize(ui) {
    if (!(ui instanceof HTMLElement) || isFitButton(ui)) return;
    ui.style.minWidth = "";
  }

  function buildWordLayer(words, className, lead, trail) {
    const layer = document.createElement("span");
    layer.className = "lang-morph-layer " + className;
    if (lead) layer.appendChild(document.createTextNode(lead));
    /** @type {HTMLSpanElement[]} */
    const spans = [];
    for (let i = 0; i < words.length; i++) {
      const span = document.createElement("span");
      span.className = "lang-word";
      span.textContent = words[i];
      spans.push(span);
      layer.appendChild(span);
      if (i < words.length - 1) layer.appendChild(document.createTextNode(" "));
    }
    if (trail) layer.appendChild(document.createTextNode(trail));
    return { layer, spans };
  }

  function buildPlainLayer(text, className) {
    const layer = document.createElement("span");
    layer.className = "lang-morph-layer " + className;
    layer.textContent = text;
    return layer;
  }

  async function morphTextNode(textNode, nextText, instant) {
    const parent = textNode.parentElement;
    if (!parent) {
      textNode.textContent = nextText;
      return;
    }

    const prev = textNode.textContent || "";
    if (prev === nextText) return;

    const ui = uiChrome(parent);
    const beforeUiW =
      ui instanceof HTMLElement ? ui.getBoundingClientRect().width : 0;

    if (instant) {
      textNode.textContent = nextText;
      if (isFitButton(ui)) {
        freezeButtonBox(ui, beforeUiW || ui.getBoundingClientRect().width);
        const fit = fitFontSize(nextText, ui, contentBoxWidth(ui));
        ui.style.fontSize = fit + "px";
      }
      return;
    }

    const lead = leadingSpace(nextText) || leadingSpace(prev);
    const trail = trailingSpace(nextText) || trailingSpace(prev);
    const oldWords = splitWords(prev);
    const newWords = splitWords(nextText);
    const finalText = lead + newWords.join(" ") + trail;

    if (!oldWords.length && !newWords.length) {
      textNode.textContent = nextText;
      return;
    }

    const run = document.createElement("span");
    const base = posDelay(parent);
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    const dur = WORD_MS * 2;
    const fitBtn = isFitButton(ui);

    // Nav (non-button) chrome: full-label crossfade
    if (ui && !fitBtn) {
      run.className = "lang-morph-run lang-morph-run--ui";
      const out = buildPlainLayer(prev, "lang-morph-out");
      const inn = buildPlainLayer(nextText, "lang-morph-in");
      inn.setAttribute("aria-hidden", "true");
      run.appendChild(out);
      run.appendChild(inn);
      parent.replaceChild(run, textNode);

      lockUiSize(ui, Math.max(beforeUiW, ui.getBoundingClientRect().width));

      await sleep(base);
      await Promise.all([
        out.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: dur,
          easing: ease,
          fill: "forwards",
        }).finished,
        inn.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: dur,
          easing: ease,
          fill: "forwards",
        }).finished,
      ]);

      out.remove();
      run.replaceWith(document.createTextNode(finalText));
      releaseUiSize(ui);
      return;
    }

    // Prose + buttons: stacked word layers, TL→BR stagger
    if (fitBtn) {
      freezeButtonBox(ui, beforeUiW || ui.getBoundingClientRect().width);
      run.className = "lang-morph-run lang-morph-run--ui";
    } else {
      run.className = "lang-morph-run";
    }

    const out = buildWordLayer(oldWords, "lang-morph-out", lead, trail);
    const inn = buildWordLayer(newWords, "lang-morph-in", lead, trail);
    inn.layer.setAttribute("aria-hidden", "true");
    run.appendChild(out.layer);
    run.appendChild(inn.layer);
    parent.replaceChild(run, textNode);

    const max = Math.max(out.spans.length, inn.spans.length);
    /** @type {Promise<unknown>[]} */
    const jobs = [
      ...Array.from({ length: max }, async (_, i) => {
        await sleep(base + i * WORD_STAGGER);
        const step = [];
        if (out.spans[i]) {
          step.push(
            out.spans[i].animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: WORD_MS,
              easing: ease,
              fill: "forwards",
            }).finished,
          );
        }
        if (inn.spans[i]) {
          step.push(
            inn.spans[i].animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: WORD_MS,
              easing: ease,
              fill: "forwards",
            }).finished,
          );
        }
        await Promise.all(step);
      }),
    ];

    let inFit = 0;
    if (fitBtn) {
      const avail = contentBoxWidth(ui);
      const outFit = fitFontSize(prev, ui, avail);
      inFit = fitFontSize(nextText, ui, avail);
      run.style.fontSize = outFit + "px";
      const fontDur = Math.max(
        WORD_MS,
        base + Math.max(0, max - 1) * WORD_STAGGER + WORD_MS,
      );
      jobs.push(
        run.animate(
          [
            { fontSize: outFit + "px" },
            { fontSize: inFit + "px" },
          ],
          { duration: fontDur, easing: ease, fill: "forwards" },
        ).finished,
      );
    }

    await Promise.all(jobs);

    out.layer.remove();
    run.replaceWith(document.createTextNode(finalText));
    if (fitBtn) ui.style.fontSize = inFit + "px";
  }

  async function morphToDocument(newDoc, locale, href) {
    const fromNodes = collectTextNodes(document.body);
    const toNodes = collectTextNodes(newDoc.body);
    const count = Math.min(fromNodes.length, toNodes.length);
    const instant = reducedMotion();

    await Promise.all(
      Array.from({ length: count }, (_, i) =>
        morphTextNode(fromNodes[i], toNodes[i].textContent || "", instant),
      ),
    );

    const newTitle = newDoc.querySelector("title");
    if (newTitle) document.title = newTitle.textContent || document.title;

    const newDesc = newDoc.querySelector('meta[name="description"]');
    const curDesc = document.querySelector('meta[name="description"]');
    if (newDesc && curDesc) {
      curDesc.setAttribute("content", newDesc.getAttribute("content") || "");
    }

    document.documentElement.lang = locale === "vi" ? "vi" : "en";
    history.pushState({ langMorph: true }, "", href);
    rewriteInternalLinks(locale);
    syncSlider(locale);

    const path = stripLocale(location.pathname);
    document.querySelectorAll("a.nav-link").forEach((a) => {
      if (!(a instanceof HTMLElement)) return;
      const hrefPath = stripLocale((a.getAttribute("href") || "").split("?")[0]);
      const here =
        hrefPath === path ||
        (path !== "/" && hrefPath !== "/" && path.startsWith(hrefPath + "/"));
      if (here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  async function switchLanguage(href, locale) {
    if (busy) return;
    busy = true;
    setSliderLocale(locale);

    try {
      const res = await fetch(href, {
        headers: { Accept: "text/html" },
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("fetch failed");
      const html = await res.text();
      const newDoc = new DOMParser().parseFromString(html, "text/html");
      await morphToDocument(newDoc, locale, href);
      // Current page is now `href`; keep the previous locale doc as alt cache
      const prevLocale = locale === "vi" ? "en" : "vi";
      altDocCache = {
        href: localePath(prevLocale, stripLocale(href)),
        doc: null,
      };
    } catch {
      location.assign(href);
      return;
    } finally {
      busy = false;
    }
  }

  /** @type {{ href: string, doc: Document | null }} */
  let altDocCache = { href: "", doc: null };

  async function fetchAltDoc() {
    const locale = localeOf(location.pathname);
    const other = locale === "vi" ? "en" : "vi";
    const href = new URL(
      localePath(other, stripLocale(location.pathname)),
      location.origin,
    ).href;
    if (altDocCache.href === href && altDocCache.doc) return altDocCache.doc;

    const res = await fetch(href, {
      headers: { Accept: "text/html" },
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const doc = new DOMParser().parseFromString(await res.text(), "text/html");
    altDocCache = { href, doc };
    return doc;
  }

  let warmPromise = null;

  // Prefetch alt locale for faster EN↔VI switches (no width locking).
  async function warmAltDoc() {
    if (warmPromise) return warmPromise;
    warmPromise = (async () => {
      try {
        await fetchAltDoc();
      } catch {
        /* ignore — fetch again on first lang switch */
      } finally {
        warmPromise = null;
      }
    })();
    return warmPromise;
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest(".lang-slider-opt");
      if (!(link instanceof HTMLElement)) return;

      const locale = link.getAttribute("hreflang") === "vi" ? "vi" : "en";
      if (link.getAttribute("aria-current") === "true") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // No ClientRouter, no document swap — words change in place
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      void switchLanguage(link.href, locale);
    },
    true,
  );

  function onPageReady() {
    syncSlider(localeOf(location.pathname));
    void warmAltDoc();
  }

  document.addEventListener("astro:page-load", onPageReady);
  onPageReady();
})();
