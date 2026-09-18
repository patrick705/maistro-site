(() => {
  const root = document.documentElement;
  const chapters = [...document.querySelectorAll(".story-chapter")];
  const reveals = [...document.querySelectorAll(".reveal")];
  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const customerViewport = document.querySelector(".customer-rail__viewport");
  const customerTrack = document.querySelector(".customer-rail__track");
  let ticking = false;

  if (customerViewport && customerTrack) {
    const originalCards = [...customerTrack.children];
    const cloneCards = originalCards.map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      customerTrack.appendChild(clone);
      return clone;
    });
    let railIsVisible = false;
    let railIsHovered = false;
    let railHasFocus = false;
    let railIsDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let pauseUntil = 0;
    let lastFrame = performance.now();

    const loopWidth = () => cloneCards[0].offsetLeft - originalCards[0].offsetLeft;
    const pauseRail = (duration = 3200) => {
      pauseUntil = performance.now() + duration;
    };
    const normaliseRail = () => {
      const width = loopWidth();
      if (width > 0 && customerViewport.scrollLeft >= width) {
        customerViewport.scrollLeft -= width;
      }
    };

    new IntersectionObserver(([entry]) => {
      railIsVisible = entry.isIntersecting;
    }, { threshold: .08 }).observe(customerViewport);

    const moveRail = (now) => {
      const elapsed = Math.min(64, now - lastFrame);
      lastFrame = now;
      if (!reduceMotion.matches && railIsVisible && !railIsHovered && !railHasFocus && !railIsDragging && document.visibilityState === "visible" && now > pauseUntil) {
        customerViewport.scrollLeft += elapsed * .035;
        normaliseRail();
      }
      window.requestAnimationFrame(moveRail);
    };
    window.requestAnimationFrame(moveRail);

    customerViewport.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") railIsHovered = true;
    });
    customerViewport.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") railIsHovered = false;
    });
    customerViewport.addEventListener("focusin", () => {
      railHasFocus = true;
    });
    customerViewport.addEventListener("focusout", () => {
      railHasFocus = false;
    });
    customerViewport.addEventListener("wheel", () => pauseRail(), { passive: true });

    customerViewport.addEventListener("pointerdown", (event) => {
      pauseRail();
      if (event.pointerType === "touch" || event.button !== 0) return;
      railIsDragging = true;
      dragStartX = event.clientX;
      dragStartScroll = customerViewport.scrollLeft;
      customerViewport.classList.add("is-dragging");
      customerViewport.setPointerCapture(event.pointerId);
    });
    customerViewport.addEventListener("pointermove", (event) => {
      if (!railIsDragging) return;
      event.preventDefault();
      const width = loopWidth();
      let nextScroll = dragStartScroll - (event.clientX - dragStartX);
      if (width > 0 && nextScroll < 0) {
        nextScroll += width;
        dragStartScroll += width;
      } else if (width > 0 && nextScroll >= width) {
        nextScroll -= width;
        dragStartScroll -= width;
      }
      customerViewport.scrollLeft = nextScroll;
    });

    const finishDrag = (event) => {
      if (!railIsDragging) return;
      railIsDragging = false;
      customerViewport.classList.remove("is-dragging");
      if (customerViewport.hasPointerCapture(event.pointerId)) customerViewport.releasePointerCapture(event.pointerId);
    };
    customerViewport.addEventListener("pointerup", finishDrag);
    customerViewport.addEventListener("pointercancel", finishDrag);

    document.querySelectorAll("[data-customer-scroll]").forEach((button) => {
      button.addEventListener("click", () => {
        pauseRail(4200);
        const direction = Number(button.dataset.customerScroll);
        const gap = parseFloat(getComputedStyle(customerTrack).columnGap) || 0;
        const distance = originalCards[0].getBoundingClientRect().width + gap;
        if (direction < 0 && customerViewport.scrollLeft < distance * .35) {
          customerViewport.scrollLeft = loopWidth();
        }
        customerViewport.scrollBy({
          left: distance * direction,
          behavior: reduceMotion.matches ? "auto" : "smooth"
        });
        window.setTimeout(normaliseRail, reduceMotion.matches ? 0 : 520);
      });
    });
  }

  const update = () => {
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    root.style.setProperty("--story-offset", (1 - progress).toFixed(4));
    if (!reduceMotion.matches) {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        item.style.setProperty("--drift", `${Math.max(-13, Math.min(13, centerOffset * -13)).toFixed(1)}px`);
      });
    }
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  }, { threshold: .14, rootMargin: "0px 0px -8% 0px" });

  chapters.forEach((chapter) => observer.observe(chapter));
  reveals.forEach((element) => observer.observe(element));
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();

  document.getElementById("replayStory").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
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
    const HEADER_CLEARANCE = 200;
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
