/* story.js */
(() => {
  const root = document.documentElement;
  const sections = [...document.querySelectorAll(".chapter")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const timeline = document.querySelector(".journey-timeline");
  const line = document.querySelector(".journey-line");
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const scenes = sections.map((section) => ({
    section,
    stage: section.querySelector(".chapter-stage"),
    image: section.querySelector(".story-panel__image"),
    color: section.dataset.color.split(",").map(Number),
  }));
  let ticking = false;

  root.classList.add("scroll-story");

  const updateProgress = () => {
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = clamp(window.scrollY / max);
    const weaveProgress = Math.min(1, .18 + progress * 1.45);
    root.style.setProperty("--progress", progress.toFixed(4));
    root.style.setProperty("--weave-offset", (1 - weaveProgress).toFixed(4));

    const bounds = scenes.map(({ section }) => section.getBoundingClientRect());
    const phases = [];
    let active = 0;
    scenes.forEach((scene, index) => {
      const rect = bounds[index];
      const hold = Math.max(window.innerHeight, rect.height);
      const p = clamp(-rect.top / hold);
      phases.push(p);
      if (rect.top <= window.innerHeight * .4 && rect.bottom > window.innerHeight * .4) active = index;
      // Keep each scene readable while native snapping handles the transition.
      scene.stage.style.opacity = reducedMotion.matches || index === scenes.length - 1
        ? "1" : String(1 - clamp((p - .75) / .25) * .88);
      if (scene.image) {
        if (reducedMotion.matches) scene.image.style.removeProperty("transform");
        else if (rect.top < window.innerHeight && rect.bottom > 0) {
          scene.image.style.transform = `scale(${1.04 + p * .09}) translateY(${-p * 2}%)`;
        }
      }
    });
    const color = scenes[active].color;
    const next = scenes[Math.min(active + 1, scenes.length - 1)].color;
    const p = phases[active];
    const mix = clamp((p - .65) / .35);
    root.style.setProperty("--journey-accent", `rgb(${color.map((v, i) => Math.round(v + (next[i] - v) * mix)).join(",")})`);
    line.style.strokeDashoffset = String(.75 - (active + p) * .24);
    timeline.style.opacity = String((window.innerWidth < 601 ? .45 : .7) * (1 - clamp((p - .7) / .3) * .8));
    ticking = false;
  };

  const queueUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  };
  const updateViewport = () => {
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    root.style.setProperty("--story-viewport", `${viewportHeight}px`);
    queueUpdate();
  };

  // Native scroll snapping owns navigation; scroll events only update visuals.
  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", updateViewport, { passive: true });
  window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });
  reducedMotion.addEventListener("change", queueUpdate);
  if ("ResizeObserver" in window) {
    const sizeObserver = new ResizeObserver(queueUpdate);
    scenes.forEach(({ stage }) => sizeObserver.observe(stage));
  }
  document.querySelectorAll(".voice-sample").forEach((sample) => sample.addEventListener("toggle", queueUpdate));
  if (document.fonts) document.fonts.ready.then(queueUpdate);
  window.addEventListener("load", updateViewport, { once: true });
  updateViewport();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, { threshold: 0.18, rootMargin: "-6% 0px -6% 0px" });

  sections.forEach((section) => observer.observe(section));

  const frame = document.getElementById("marginAnimation");
  const gif = document.getElementById("marginGif");

  const restartAnimation = () => {
    if (reducedMotion.matches) return;
    frame.classList.remove("is-playing");
    const cleanSource = gif.getAttribute("src").split("?")[0];
    gif.setAttribute("src", cleanSource + "?replay=" + Date.now());
    void frame.offsetWidth;
    frame.classList.add("is-playing");
  };

  frame.classList.remove("is-playing");
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) restartAnimation();
    });
  }, { threshold: 0.25 });
  animationObserver.observe(frame);

  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  });
})();
