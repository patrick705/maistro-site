/* contact.js */
(() => {
  const byId = (id) => document.getElementById(id);
  const form = byId("postcardForm");
  const shell = byId("postcardShell");
  const tilt = byId("postcardTilt");
  const front = byId("postcardFront");
  const flipToWrite = byId("flipToWrite");
  const flipToFront = byId("flipToFront");
  const sentCard = byId("sentCard");
  const writeAnother = byId("writeAnother");
  const message = byId("message");
  const messageCount = byId("messageCount");
  const toast = byId("toast");
  const deliveryOptions = [...document.querySelectorAll(".delivery-option")];
  const deliveryMethod = byId("deliveryMethod");
  const deliveryStatus = byId("deliveryStatus");
  const sendButtonLabel = byId("sendButtonLabel");
  const sendProgressLabel = byId("sendProgressLabel");
  const sentKicker = byId("sentKicker");
  const sentMessage = byId("sentMessage");
  const competitionEntered = byId("competitionEntered");
  const artworkInput = byId("postcardArtwork");
  const frontArtImage = byId("frontArtImage");
  const frontUploadLabel = byId("frontUploadLabel");
  const isPersonalised = byId("isPersonalised");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const defaultArtwork = frontArtImage.getAttribute("src");
  let toastTimer;
  let frontPreviewTimer;
  let artworkUrl;
  let selectedMethod = "email";
  let hasEnteredCompetition = false;

  byId("postcardDate").textContent = new Intl.DateTimeFormat("en-IE", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date()).toUpperCase();

  const updateCount = () => { messageCount.textContent = message.value.length; };
  message.addEventListener("input", updateCount);

  const setFlipped = (isFlipped, shouldFocus = true) => {
    shell.classList.toggle("is-flipped", isFlipped);
    front.setAttribute("aria-hidden", String(isFlipped));
    form.setAttribute("aria-hidden", String(!isFlipped));
    front.toggleAttribute("inert", isFlipped);
    form.toggleAttribute("inert", !isFlipped);
    flipToWrite.setAttribute("aria-expanded", String(isFlipped));
    if (shouldFocus) window.setTimeout(() => (isFlipped ? message : flipToWrite).focus(), reduceMotion.matches ? 10 : 650);
  };

  const clearFrontPreview = () => {
    window.clearTimeout(frontPreviewTimer);
    shell.classList.remove("is-previewing-front");
  };
  const setDeliveryStatus = (copy) => {
    deliveryStatus.innerHTML = `<span aria-hidden="true">✦</span> ${copy}`;
  };
  const updateCompetitionControls = () => {
    const postcardSelected = selectedMethod === "postcard";
    competitionEntered.value = String(hasEnteredCompetition && postcardSelected);
  };
  const postcardReadyStatus = () => hasEnteredCompetition
    ? "Funny image added — your postcard is entered in the €500 monthly competition."
    : "Postcard selected — use the button on the front to add a funny image and enter €500.";
  const previewFront = (returnAfterTwoSeconds = false) => {
    clearFrontPreview();
    shell.classList.add("is-previewing-front");
    setFlipped(false, false);
    if (!returnAfterTwoSeconds) return;
    frontPreviewTimer = window.setTimeout(() => {
      shell.classList.remove("is-previewing-front");
      setFlipped(true, false);
      setDeliveryStatus(postcardReadyStatus());
    }, 2000);
  };

  const selectDelivery = (method, revealFront = true) => {
    selectedMethod = method === "postcard" ? "postcard" : "email";
    deliveryMethod.value = selectedMethod;
    deliveryOptions.forEach((option) => {
      const selected = option.dataset.method === selectedMethod;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    updateCompetitionControls();
    sendButtonLabel.innerHTML = `${selectedMethod === "postcard" ? "Send postcard" : "Send email"} <i aria-hidden="true">→</i>`;
    sendProgressLabel.textContent = selectedMethod === "postcard" ? "Stamping…" : "Sending…";
    clearFrontPreview();
    if (selectedMethod === "postcard" && revealFront) {
      setDeliveryStatus("Postcard selected — previewing the front for two seconds.");
      previewFront(true);
      return;
    }
    setFlipped(true, false);
    setDeliveryStatus(selectedMethod === "postcard" ? postcardReadyStatus() : "Email selected — write your message on the postcard.");
  };
  deliveryOptions.forEach((option) => option.addEventListener("click", () => selectDelivery(option.dataset.method)));

  const updateEditedState = () => {
    const edited = Boolean(artworkUrl);
    isPersonalised.value = String(edited);
    front.classList.toggle("is-personalised", edited);
    frontUploadLabel.textContent = edited ? "Change funny image" : "Upload a funny image to enter €500";
  };
  const clearArtwork = () => {
    if (artworkUrl) URL.revokeObjectURL(artworkUrl);
    artworkUrl = undefined;
    artworkInput.value = "";
    frontArtImage.src = defaultArtwork;
    front.classList.remove("has-custom-art");
    hasEnteredCompetition = false;
    updateCompetitionControls();
    updateEditedState();
  };
  const resetDesign = () => {
    clearArtwork();
    updateEditedState();
  };

  artworkInput.addEventListener("change", async () => {
    const file = artworkInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      clearArtwork();
      setDeliveryStatus(file.size > 10 * 1024 * 1024 ? "Please choose an image smaller than 10 MB." : "Please choose a PNG, JPG or WebP image.");
      return;
    }
    try {
      const image = await createImageBitmap(file);
      const isLandscape = image.width > image.height;
      image.close();
      if (!isLandscape) {
        clearArtwork();
        setDeliveryStatus("Please choose a landscape image. Recommended dimensions: 1600 × 900 px.");
        return;
      }
    } catch {
      clearArtwork();
      setDeliveryStatus("We couldn’t read that image. Please try a landscape PNG, JPG or WebP.");
      return;
    }
    if (artworkUrl) URL.revokeObjectURL(artworkUrl);
    artworkUrl = URL.createObjectURL(file);
    frontArtImage.src = artworkUrl;
    front.classList.add("has-custom-art");
    hasEnteredCompetition = true;
    updateCompetitionControls();
    updateEditedState();
    selectDelivery("postcard", false);
    setDeliveryStatus("Funny image added — your postcard is entered in the €500 monthly competition.");
    previewFront(false);
  });

  flipToWrite.addEventListener("click", () => {
    clearFrontPreview();
    setFlipped(true);
    setDeliveryStatus(selectedMethod === "postcard" ? postcardReadyStatus() : "Email selected — write your message on the postcard.");
  });
  flipToFront.addEventListener("click", () => { clearFrontPreview(); setFlipped(false); });

  const showToast = () => {
    window.clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4600);
  };
  const animatePreviewSend = () => {
    form.classList.add("is-sending");
    window.setTimeout(() => {
      tilt.classList.add("is-flying");
      window.setTimeout(() => {
        sentCard.classList.add("is-visible");
        sentCard.setAttribute("aria-hidden", "false");
      }, reduceMotion.matches ? 20 : 700);
    }, reduceMotion.matches ? 20 : 760);
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.remove("is-invalid");
      void form.offsetWidth;
      form.classList.add("is-invalid");
      form.reportValidity();
      return;
    }
    sentKicker.textContent = selectedMethod === "postcard"
      ? hasEnteredCompetition ? "Competition entry ready." : "Postcard ready."
      : "Email ready.";
    sentMessage.textContent = selectedMethod === "postcard"
      ? hasEnteredCompetition
        ? "Your postcard is ready for the €500 monthly competition. Winner announced every month."
        : "Ready for print, postage and the road to Maistro HQ."
      : "One real inbox away from take-off.";
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: byId("name").value,
        email: byId("email").value,
        message: message.value,
        source: "say-hi",
        deliveryMethod: selectedMethod,
        enteredCompetition: hasEnteredCompetition,
      }),
    }).catch(() => {
      // Same rule as every other form on the site: a CMS hiccup never blocks
      // the visitor-facing "sent" animation below.
    });
    animatePreviewSend();
    showToast();
  });
  writeAnother.addEventListener("click", () => {
    sentCard.classList.remove("is-visible");
    sentCard.setAttribute("aria-hidden", "true");
    form.classList.remove("is-sending", "is-invalid");
    tilt.classList.remove("is-flying");
    form.reset();
    hasEnteredCompetition = false;
    resetDesign();
    deliveryMethod.value = selectedMethod;
    updateCompetitionControls();
    updateCount();
    byId("name").focus();
  });

  shell.addEventListener("pointermove", (event) => {
    if (reduceMotion.matches || event.pointerType === "touch" || form.classList.contains("is-sending")) return;
    const rect = shell.getBoundingClientRect();
    document.documentElement.style.setProperty("--postcard-y", `${(((event.clientX - rect.left) / rect.width - .5) * 4.5).toFixed(2)}deg`);
    document.documentElement.style.setProperty("--postcard-x", `${(((event.clientY - rect.top) / rect.height - .5) * -3.5).toFixed(2)}deg`);
  });
  shell.addEventListener("pointerleave", () => {
    document.documentElement.style.setProperty("--postcard-y", "0deg");
    document.documentElement.style.setProperty("--postcard-x", "0deg");
  });

  // Auto-flip between front and back every 5s while idle, pausing while the
  // visitor is actively filling in the form (name/email/message) or the
  // card is mid-send/already sent.
  let autoFlipTimer;
  const isEditingDetails = () => Boolean(document.activeElement && form.contains(document.activeElement));
  const scheduleAutoFlip = () => {
    window.clearTimeout(autoFlipTimer);
    if (reduceMotion.matches) return;
    autoFlipTimer = window.setTimeout(() => {
      if (isEditingDetails() || form.classList.contains("is-sending") || sentCard.classList.contains("is-visible")) return;
      setFlipped(!shell.classList.contains("is-flipped"), false);
      scheduleAutoFlip();
    }, 5000);
  };
  form.addEventListener("focusin", () => window.clearTimeout(autoFlipTimer));
  form.addEventListener("focusout", scheduleAutoFlip);
  flipToWrite.addEventListener("click", scheduleAutoFlip);
  flipToFront.addEventListener("click", scheduleAutoFlip);
  scheduleAutoFlip();

  const modelContext = document.modelContext;
  if (modelContext?.registerTool) {
    const lifecycle = new AbortController();
    const registerPostcardTool = modelContext.registerTool({
      name: "stage_contact_postcard",
      title: "Prepare a Maistro postcard",
      description: "Fill the visible Maistro contact postcard for the visitor to review before sending.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 },
          email: { type: "string", minLength: 3, maxLength: 254 },
          message: { type: "string", minLength: 1, maxLength: 560 },
          deliveryMethod: { type: "string", enum: ["email", "postcard"] }
        },
        required: ["name", "email", "message"],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input) {
        if (!input || typeof input !== "object") throw new TypeError("Postcard details are required.");
        const values = {
          name: String(input.name || "").trim(),
          email: String(input.email || "").trim(),
          message: String(input.message || "").trim()
        };
        if (!values.name || !values.email || !values.message || values.message.length > 560) {
          throw new TypeError("A name, email and message of up to 560 characters are required.");
        }
        byId("name").value = values.name;
        byId("email").value = values.email;
        message.value = values.message;
        selectDelivery(input.deliveryMethod, false);
        updateCount();
        tilt.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
        return { status: "ready_to_review", deliveryMethod: selectedMethod, messageLength: values.message.length };
      }
    }, { signal: lifecycle.signal });
    Promise.resolve(registerPostcardTool).catch(() => {});
  }

  resetDesign();
  selectDelivery("email", false);
})();
