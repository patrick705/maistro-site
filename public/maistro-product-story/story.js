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
  // context, so scrolling past our own top/bottom doesn't naturally hand
  // off to the host page the way nested scroll containers do in a single
  // document. Forward the residual wheel input to the parent once we're at
  // our own boundary, so the host page keeps scrolling instead of feeling
  // stuck. No-ops harmlessly if not actually embedded in an iframe.
  if (window.parent !== window) {
    window.addEventListener("wheel", (e) => {
      const atTop = root.scrollTop <= 0;
      const atBottom = root.scrollTop + window.innerHeight >= root.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
        window.parent.postMessage({ source: "maistro-widget-scroll", deltaY: e.deltaY }, "*");
      }
    }, { passive: false });
  }
})();
