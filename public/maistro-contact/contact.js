(() => {
  const form = document.getElementById("postcardForm");
  const shell = document.getElementById("postcardShell");
  const tilt = document.getElementById("postcardTilt");
  const front = document.getElementById("postcardFront");
  const flipToWrite = document.getElementById("flipToWrite");
  const flipToFront = document.getElementById("flipToFront");
  const sentCard = document.getElementById("sentCard");
  const writeAnother = document.getElementById("writeAnother");
  const message = document.getElementById("message");
  const messageCount = document.getElementById("messageCount");
  const date = document.getElementById("postcardDate");
  const toast = document.getElementById("toast");
  const deliveryOptions = [...document.querySelectorAll(".delivery-option")];
  const deliveryMethod = document.getElementById("deliveryMethod");
  const deliveryStatus = document.getElementById("deliveryStatus");
  const sendButtonLabel = document.getElementById("sendButtonLabel");
  const sendProgressLabel = document.getElementById("sendProgressLabel");
  const sentKicker = document.getElementById("sentKicker");
  const sentMessage = document.getElementById("sentMessage");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let toastTimer;
  let frontPreviewTimer;
  let selectedMethod = "email";

  date.textContent = new Intl.DateTimeFormat("en-IE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date()).toUpperCase();

  const updateCount = () => {
    messageCount.textContent = message.value.length;
  };
  message.addEventListener("input", updateCount);

  const setFlipped = (isFlipped, shouldFocus = true) => {
    shell.classList.toggle("is-flipped", isFlipped);
    front.setAttribute("aria-hidden", String(isFlipped));
    form.setAttribute("aria-hidden", String(!isFlipped));
    front.toggleAttribute("inert", isFlipped);
    form.toggleAttribute("inert", !isFlipped);
    flipToWrite.setAttribute("aria-expanded", String(isFlipped));

    if (shouldFocus) {
      window.setTimeout(() => {
        (isFlipped ? message : flipToWrite).focus();
      }, reduceMotion.matches ? 10 : 650);
    }
  };

  const clearFrontPreview = () => {
    window.clearTimeout(frontPreviewTimer);
    shell.classList.remove("is-previewing-front");
  };

  const setDeliveryStatus = (copy) => {
    deliveryStatus.innerHTML = `<span aria-hidden="true">✦</span> ${copy}`;
  };

  const selectDelivery = (method, revealFront = true) => {
    selectedMethod = method === "postcard" ? "postcard" : "email";
    deliveryMethod.value = selectedMethod;
    deliveryOptions.forEach((option) => {
      const isSelected = option.dataset.method === selectedMethod;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });

    sendButtonLabel.innerHTML = `${selectedMethod === "postcard" ? "Send postcard" : "Send email"} <i aria-hidden="true">→</i>`;
    sendProgressLabel.textContent = selectedMethod === "postcard" ? "Stamping…" : "Sending…";
    clearFrontPreview();

    if (selectedMethod === "postcard" && revealFront) {
      setDeliveryStatus("Postcard selected — here’s the front. Your form will return in two seconds.");
      shell.classList.add("is-previewing-front");
      setFlipped(false, false);
      frontPreviewTimer = window.setTimeout(() => {
        shell.classList.remove("is-previewing-front");
        setFlipped(true, false);
        setDeliveryStatus("Postcard selected — write it here and we’ll send the physical card.");
      }, reduceMotion.matches ? 2000 : 2900);
      return;
    }

    setFlipped(true, false);
    setDeliveryStatus("Email selected — write your message on the postcard.");
  };

  deliveryOptions.forEach((option) => {
    option.addEventListener("click", () => selectDelivery(option.dataset.method));
  });

  flipToWrite.addEventListener("click", () => {
    clearFrontPreview();
    setFlipped(true);
    setDeliveryStatus(selectedMethod === "postcard"
      ? "Postcard selected — write it here and we’ll send the physical card."
      : "Email selected — write your message on the postcard.");
  });
  flipToFront.addEventListener("click", () => {
    clearFrontPreview();
    setFlipped(false);
  });

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
    sentKicker.textContent = selectedMethod === "postcard" ? "Postcard ready." : "Email ready.";
    sentMessage.textContent = selectedMethod === "postcard"
      ? "Ready for print, postage and the road to Maistro HQ."
      : "One real inbox away from take-off.";
    animatePreviewSend();
    showToast();
  });

  writeAnother.addEventListener("click", () => {
    sentCard.classList.remove("is-visible");
    sentCard.setAttribute("aria-hidden", "true");
    form.classList.remove("is-sending", "is-invalid");
    tilt.classList.remove("is-flying");
    form.reset();
    deliveryMethod.value = selectedMethod;
    updateCount();
    document.getElementById("name").focus();
  });

  shell.addEventListener("pointermove", (event) => {
    if (reduceMotion.matches || event.pointerType === "touch" || form.classList.contains("is-sending")) return;
    const rect = shell.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    document.documentElement.style.setProperty("--postcard-y", `${(x * 4.5).toFixed(2)}deg`);
    document.documentElement.style.setProperty("--postcard-x", `${(y * -3.5).toFixed(2)}deg`);
  });

  shell.addEventListener("pointerleave", () => {
    document.documentElement.style.setProperty("--postcard-y", "0deg");
    document.documentElement.style.setProperty("--postcard-x", "0deg");
  });

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
        document.getElementById("name").value = values.name;
        document.getElementById("email").value = values.email;
        message.value = values.message;
        selectDelivery(input.deliveryMethod, false);
        updateCount();
        tilt.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
        return { status: "ready_to_review", deliveryMethod: selectedMethod, messageLength: values.message.length };
      }
    }, { signal: lifecycle.signal });
    Promise.resolve(registerPostcardTool).catch(() => {});
  }

  selectDelivery("email", false);
})();
