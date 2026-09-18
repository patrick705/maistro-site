(() => {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll(".chapter")];
  let ticking = false;

  const updateProgress = () => {
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    const weaveProgress = Math.min(1, .18 + progress * 1.45);
    root.style.setProperty("--progress", progress.toFixed(4));
    root.style.setProperty("--weave-offset", (1 - weaveProgress).toFixed(4));
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });

  sections.forEach((section) => observer.observe(section));

  const frame = document.getElementById("marginAnimation");
  const gif = document.getElementById("marginGif");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const restartAnimation = () => {
    if (reducedMotion.matches) return;
    frame.classList.remove("is-playing");
    const cleanSource = gif.getAttribute("src").split("?")[0];
    gif.setAttribute("src", cleanSource + "?replay=" + Date.now());
    void frame.offsetWidth;
    frame.classList.add("is-playing");
  };

  window.addEventListener("load", () => {
    window.requestAnimationFrame(restartAnimation);
  }, { once: true });

  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    window.setTimeout(restartAnimation, 700);
  });

  // This page runs inside an iframe on the host site — a separate browsing
  // context, so scroll input over it never reaches the host page at all by
  // default. Forwarding EVERY wheel tick unconditionally (an earlier version
  // of this) fixed the host header feeling "stuck", but also dragged
  // whatever's below this block (footer, other sections) into view long
  // before the story itself finished — this page is much taller internally
  // than the host page has room for below it. Instead: forward just enough
  // to clear the host header (HEADER_CLEARANCE px), which needs very little
  // scroll since the header is a fixed height; any upward scroll forwards
  // immediately so scrolling back up always retreats the header right away;
  // and forwarding resumes at our own top/bottom boundary so the rest of the
  // host page is still reachable once the story is actually finished.
  // No-ops harmlessly if not actually embedded in an iframe.
  if (window.parent !== window) {
    const HEADER_CLEARANCE = 110;
    const atOwnTop = () => root.scrollTop <= 0;
    const atOwnBottom = () => root.scrollTop + window.innerHeight >= root.scrollHeight - 1;
    window.addEventListener("wheel", (e) => {
      let parentY;
      try { parentY = window.parent.scrollY } catch (err) { parentY = null }
      if (parentY === null) return;
      const forward = (e.deltaY > 0 && (parentY < HEADER_CLEARANCE || atOwnBottom())) ||
        (e.deltaY < 0 && (parentY > 0 || atOwnTop()));
      if (forward) window.parent.postMessage({ source: "maistro-widget-scroll", deltaY: e.deltaY }, "*");
    }, { passive: true });
  }
})();
