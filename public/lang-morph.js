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

  function lockUiSize(ui, width) {
    if (!(ui instanceof HTMLElement) || !(width > 0)) return;
    const prev = parseFloat(ui.style.minWidth) || 0;
    const next = Math.ceil(Math.max(prev, width));
    if (next > prev) ui.style.minWidth = next + "px";
  }

  function equalizeNavGroup(selector, newDoc) {
    const cur = [...document.querySelectorAll(selector)];
    if (cur.length < 2) return;

    const next = newDoc
      ? [...newDoc.querySelectorAll(selector)]
      : [];

    const probe = document.createElement("span");
    const cs = getComputedStyle(cur[0]);
    probe.style.cssText = [
      "position:absolute",
      "left:-9999px",
      "top:0",
      "visibility:hidden",
      "white-space:nowrap",
      "font:" + cs.font,
      "font-weight:600",
      "letter-spacing:" + cs.letterSpacing,
      "text-transform:" + cs.textTransform,
    ].join(";");
    document.body.appendChild(probe);

    let maxContent = 0;
    for (let i = 0; i < cur.length; i++) {
      const texts = [(cur[i].textContent || "").trim()];
      if (next[i]) texts.push((next[i].textContent || "").trim());
      for (const t of texts) {
        if (!t) continue;
        probe.textContent = t;
        maxContent = Math.max(maxContent, probe.getBoundingClientRect().width);
      }
    }
    probe.remove();

    const pad =
      (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    const border =
      (parseFloat(cs.borderLeftWidth) || 0) +
      (parseFloat(cs.borderRightWidth) || 0);

    let maxW = Math.ceil(maxContent + pad + border);
    for (const a of cur) {
      maxW = Math.max(
        maxW,
        Math.ceil(a.getBoundingClientRect().width),
        Math.ceil(parseFloat(a.style.minWidth) || 0),
      );
    }

    for (const a of cur) a.style.minWidth = maxW + "px";
  }

  function equalizeNav(newDoc) {
    equalizeNavGroup('header nav[aria-label="Primary"] .nav-link', newDoc);
    equalizeNavGroup("header details .nav-link", newDoc);
    lockPairWidth(
      ".header-end .btn.header-action",
      newDoc,
    );
    lockPairWidth(".header-brand-sub", newDoc);
  }

  function lockPairWidth(selector, newDoc) {
    const cur = document.querySelector(selector);
    const next = newDoc ? newDoc.querySelector(selector) : null;
    if (!(cur instanceof HTMLElement)) return;

    const probe = document.createElement("span");
    const cs = getComputedStyle(cur);
    probe.style.cssText = [
      "position:absolute",
      "left:-9999px",
      "top:0",
      "visibility:hidden",
      "white-space:nowrap",
      "font:" + cs.font,
      "font-weight:" + cs.fontWeight,
      "letter-spacing:" + cs.letterSpacing,
    ].join(";");
    document.body.appendChild(probe);

    let maxContent = 0;
    for (const t of [
      (cur.textContent || "").trim(),
      next ? (next.textContent || "").trim() : "",
    ]) {
      if (!t) continue;
      probe.textContent = t;
      maxContent = Math.max(maxContent, probe.getBoundingClientRect().width);
    }
    probe.remove();

    const pad =
      (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    const border =
      (parseFloat(cs.borderLeftWidth) || 0) +
      (parseFloat(cs.borderRightWidth) || 0);
    const w = Math.ceil(
      Math.max(
        maxContent + pad + border,
        cur.getBoundingClientRect().width,
        parseFloat(cur.style.minWidth) || 0,
      ),
    );
    cur.style.minWidth = w + "px";
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
      if (ui instanceof HTMLElement) {
        lockUiSize(ui, Math.max(beforeUiW, ui.getBoundingClientRect().width));
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

    // Buttons/nav: one centered crossfade of the full label (no per-word reflow)
    if (ui) {
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
          duration: WORD_MS * 2,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }).finished,
        inn.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: WORD_MS * 2,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        }).finished,
      ]);

      out.remove();
      run.replaceWith(document.createTextNode(finalText));
      lockUiSize(ui, Math.max(beforeUiW, ui.getBoundingClientRect().width));
      return;
    }

    // Prose: stacked word layers, TL→BR stagger
    run.className = "lang-morph-run";
    const out = buildWordLayer(oldWords, "lang-morph-out", lead, trail);
    const inn = buildWordLayer(newWords, "lang-morph-in", lead, trail);
    inn.layer.setAttribute("aria-hidden", "true");
    run.appendChild(out.layer);
    run.appendChild(inn.layer);
    parent.replaceChild(run, textNode);

    const max = Math.max(out.spans.length, inn.spans.length);
    await Promise.all(
      Array.from({ length: max }, async (_, i) => {
        await sleep(base + i * WORD_STAGGER);
        const jobs = [];
        if (out.spans[i]) {
          jobs.push(
            out.spans[i].animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: WORD_MS,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "forwards",
            }).finished,
          );
        }
        if (inn.spans[i]) {
          jobs.push(
            inn.spans[i].animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: WORD_MS,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "forwards",
            }).finished,
          );
        }
        await Promise.all(jobs);
      }),
    );

    out.layer.remove();
    run.replaceWith(document.createTextNode(finalText));
  }

  async function morphToDocument(newDoc, locale, href) {
    const fromNodes = collectTextNodes(document.body);
    const toNodes = collectTextNodes(newDoc.body);
    const count = Math.min(fromNodes.length, toNodes.length);
    const instant = reducedMotion();

    // Uniform nav widths = max label across all items × both locales (before morph)
    equalizeNav(newDoc);

    await Promise.all(
      Array.from({ length: count }, (_, i) =>
        morphTextNode(fromNodes[i], toNodes[i].textContent || "", instant),
      ),
    );

    equalizeNav(newDoc);

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

  async function warmNavWidths() {
    if (warmPromise) return warmPromise;
    warmPromise = (async () => {
      try {
        const doc = await fetchAltDoc();
        if (doc) equalizeNav(doc);
      } catch {
        /* ignore — widths settle on first lang switch */
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
    void warmNavWidths();
  }

  document.addEventListener("astro:page-load", onPageReady);
  onPageReady();
})();
