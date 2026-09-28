/* our-story.js */
(() => {
  const root = document.documentElement;
  const chapters = [...document.querySelectorAll(".story-chapter")];
  const reveals = [...document.querySelectorAll(".reveal")];
  const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const customerViewport = document.querySelector(".customer-rail__viewport");
  const customerTrack = document.querySelector(".customer-rail__track");
  const testimonialDialog = document.getElementById("testimonialDialog");
  const testimonialTitle = document.getElementById("testimonialTitle");
  const testimonialLogo = document.getElementById("testimonialLogo");
  const testimonialQuote = document.getElementById("testimonialQuote");
  const testimonialStatus = document.getElementById("testimonialStatus");
  const testimonialVideo = document.getElementById("testimonialVideo");
  const customerStories = {
    romayos: { name: "Romayo’s Diner", logo: "assets/trailblazer-romayos.png", quote: "Their Maistro testimonial is coming soon.", video: "" },
    base: { name: "Base Wood Fired Pizza", logo: "assets/trailblazer-base.png", quote: "Their Maistro testimonial is coming soon.", video: "" },
    firedup: { name: "Fired Up Wood Fired Pizza", logo: "assets/trailblazer-fired-up.jpeg", quote: "Their Maistro testimonial is coming soon.", video: "" },
    "pizza-co": { name: "The Pizza Co", logo: "assets/trailblazer-pizza-co.png", quote: "Their Maistro testimonial is coming soon.", video: "" },
    mizzonis: { name: "Mizzoni’s Pizza", logo: "assets/trailblazer-mizzonis.jpeg", quote: "Their Maistro testimonial is coming soon.", video: "" },
    lyons: { name: "Lyons Fresh Flavour", logo: "assets/trailblazer-lyons.png", quote: "Their Maistro testimonial is coming soon.", video: "" }
  };
  let ticking = false;

  // Replace these clearly labelled placeholders with approved people details.
  const placeholderPerson = (name, number) => ({ name, number, role: "Role to be added", bio: "Biography coming soon. This space will introduce their background, what they do at Maistro and a little of the personality behind the person.", linkedin: "" });
  const peopleGroups = {
    ogs: { title: "THE OG’S", bios: true, people: Array.from({ length: 4 }, (_, i) => placeholderPerson(`OG ${i + 1} — name to be added`, i + 1)) },
    team: { title: "The team", bios: false, people: Array.from({ length: 6 }, (_, i) => placeholderPerson(`Team member ${i + 1}`, i + 1)) },
    legend: { title: "Latest legend", bios: true, people: [placeholderPerson("Name to be added", 1)] }
  };
  const peopleDialog = document.getElementById("peopleDialog");
  if (peopleDialog) {
    const title = document.getElementById("peopleTitle");
    const note = document.getElementById("peopleNote");
    const list = document.getElementById("peopleList");
    const bio = document.getElementById("peopleBio");
    const back = peopleDialog.querySelector(".people-back");
    let selectedGroup;
    let selectedIndex = 0;
    let opener;
    const showBio = (person, index) => {
      selectedIndex = index;
      list.hidden = true;
      bio.hidden = false;
      back.hidden = false;
      title.textContent = person.name;
      note.textContent = person.role;
      bio.replaceChildren();
      const label = document.createElement("span");
      label.className = "people-placeholder";
      label.textContent = "Placeholder biography";
      const copy = document.createElement("p");
      copy.textContent = person.bio;
      const linkedin = document.createElement(person.linkedin ? "a" : "span");
      linkedin.className = "people-linkedin";
      linkedin.textContent = person.linkedin ? "View LinkedIn profile ↗" : "in · LinkedIn profile — coming soon";
      if (person.linkedin) {
        linkedin.href = person.linkedin;
        linkedin.target = "_blank";
        linkedin.rel = "noopener noreferrer";
      }
      bio.append(label, copy, linkedin);
      peopleDialog.scrollTop = 0;
      title.focus({ preventScroll: true });
    };
    const showList = () => {
      const group = peopleGroups[selectedGroup];
      title.textContent = group.title;
      note.textContent = group.bios ? "Placeholder profiles · Select a name to read their bio." : "Placeholder team list · Names and roles coming soon.";
      list.hidden = false;
      bio.hidden = true;
      back.hidden = true;
      list.replaceChildren();
      group.people.forEach((person, index) => {
        const row = document.createElement("div");
        row.className = "people-person";
        const avatar = document.createElement("span");
        avatar.className = "people-avatar";
        avatar.textContent = String(person.number).padStart(2, "0");
        avatar.setAttribute("aria-hidden", "true");
        const details = document.createElement("div");
        const name = document.createElement(group.bios ? "button" : "h3");
        name.className = "people-name";
        name.textContent = person.name;
        if (group.bios) {
          name.type = "button";
          name.addEventListener("click", () => showBio(person, index));
        }
        const role = document.createElement("p");
        role.textContent = person.role;
        details.append(name, role);
        row.append(avatar, details);
        list.appendChild(row);
      });
    };
    document.querySelectorAll("[data-people]").forEach((trigger) => {
      const open = () => {
        opener = trigger;
        selectedGroup = trigger.dataset.people;
        showList();
        peopleDialog.showModal();
        peopleDialog.scrollTop = 0;
      };
      trigger.addEventListener("click", open);
      trigger.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open();
      });
    });
    back.addEventListener("click", () => {
      showList();
      list.querySelectorAll("button")[selectedIndex]?.focus();
    });
    peopleDialog.querySelector(".testimonial-dialog__close").addEventListener("click", () => peopleDialog.close());
    peopleDialog.addEventListener("click", (event) => {
      if (event.target === peopleDialog) peopleDialog.close();
    });
    peopleDialog.addEventListener("close", () => opener?.focus({ preventScroll: true }));
  }

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
    let cachedLoopWidth = 0;
    let autoPosition = customerViewport.scrollLeft;
    let autoRunning = false;
    let pointerDown = false;
    let suppressClickUntil = 0;

    const measureRail = () => {
      cachedLoopWidth = cloneCards[0].offsetLeft - originalCards[0].offsetLeft;
      autoRunning = false;
    };
    new ResizeObserver(measureRail).observe(customerTrack);
    measureRail();
    const loopWidth = () => cachedLoopWidth;
    const pauseRail = (duration = 900) => {
      pauseUntil = performance.now() + duration;
      autoRunning = false;
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
      if (!reduceMotion.matches && railIsVisible && !railIsHovered && !railHasFocus && !pointerDown && !railIsDragging && !testimonialDialog?.open && document.visibilityState === "visible" && now > pauseUntil && cachedLoopWidth > 0) {
        if (!autoRunning) autoPosition = customerViewport.scrollLeft;
        autoRunning = true;
        // Keep fractional pixels between frames; never read layout in the animation loop.
        autoPosition = (autoPosition + elapsed * .145) % cachedLoopWidth;
        customerViewport.scrollLeft = autoPosition;
      } else autoRunning = false;
      window.requestAnimationFrame(moveRail);
    };
    window.requestAnimationFrame(moveRail);

    customerViewport.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") railIsHovered = true;
    });
    customerViewport.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") railIsHovered = false;
    });
    customerViewport.addEventListener("focusin", (event) => {
      railHasFocus = event.target.matches(":focus-visible");
    });
    customerViewport.addEventListener("focusout", () => {
      railHasFocus = false;
    });
    customerViewport.addEventListener("wheel", () => pauseRail(), { passive: true });
    customerViewport.addEventListener("scroll", () => {
      // Let native touch momentum finish before taking over again.
      if (!autoRunning) pauseRail();
    }, { passive: true });

    customerViewport.addEventListener("pointerdown", (event) => {
      pauseRail();
      pointerDown = true;
      railHasFocus = false;
      if (event.pointerType === "touch" || event.button !== 0) return;
      dragStartX = event.clientX;
      dragStartScroll = customerViewport.scrollLeft;
    });
    customerViewport.addEventListener("pointermove", (event) => {
      if (!pointerDown || event.pointerType === "touch" || !(event.buttons & 1)) return;
      if (!railIsDragging && Math.abs(event.clientX - dragStartX) < 6) return;
      railIsDragging = true;
      customerViewport.classList.add("is-dragging");
      customerViewport.setPointerCapture(event.pointerId);
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
      if (!pointerDown) return;
      pointerDown = false;
      pauseRail();
      if (!railIsDragging) return;
      suppressClickUntil = performance.now() + 250;
      railIsDragging = false;
      customerViewport.classList.remove("is-dragging");
      if (customerViewport.hasPointerCapture(event.pointerId)) customerViewport.releasePointerCapture(event.pointerId);
    };
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    customerViewport.addEventListener("dragstart", (event) => event.preventDefault());

    document.querySelectorAll("[data-customer-scroll]").forEach((button) => {
      button.addEventListener("click", () => {
        pauseRail(1100);
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

    originalCards.forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
    });
    cloneCards.forEach((card) => card.removeAttribute("tabindex"));

    const openCustomerStory = (card) => {
      const story = customerStories[card.dataset.customer];
      if (!story || !testimonialDialog) return;
      testimonialTitle.textContent = story.name;
      testimonialLogo.src = story.logo;
      testimonialLogo.alt = `${story.name} logo`;
      testimonialQuote.textContent = story.quote;
      testimonialStatus.textContent = story.video ? "Video testimonial" : "Video testimonial not yet available";
      testimonialVideo.replaceChildren();
      testimonialVideo.hidden = true;
      if (story.video) {
        const video = document.createElement("video");
        video.src = story.video;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        testimonialVideo.appendChild(video);
        testimonialVideo.hidden = false;
      }
      testimonialDialog.showModal();
    };

    customerTrack.addEventListener("click", (event) => {
      const card = event.target.closest(".customer-card");
      if (card && !railIsDragging && performance.now() > suppressClickUntil) openCustomerStory(card);
    });
    customerTrack.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".customer-card");
      if (!card || card.getAttribute("aria-hidden") === "true") return;
      event.preventDefault();
      openCustomerStory(card);
    });
  }

  if (testimonialDialog) {
    testimonialDialog.querySelector(".testimonial-dialog__close").addEventListener("click", () => testimonialDialog.close());
    testimonialDialog.addEventListener("click", (event) => {
      if (event.target === testimonialDialog) testimonialDialog.close();
    });
    testimonialDialog.addEventListener("close", () => {
      testimonialVideo.querySelector("video")?.pause();
      testimonialVideo.replaceChildren();
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
})();
