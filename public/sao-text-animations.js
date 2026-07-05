(function () {
  const modes = Object.freeze(["full", "enter", "deco-out", "hold", "details", "exit"]);
  const selector = "[data-op-animate], .op-credit[data-preset]";
  const defaultPreset = "bar-block";
  let globalSpeed = 1;

  function runtime() {
    return window.SAOStaffCredits || null;
  }

  function validMode(mode) {
    return modes.includes(mode) ? mode : "full";
  }

  function positiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function presetFor(element, options = {}) {
    const attrPreset =
      element.dataset.opPreset ||
      element.dataset.preset ||
      (element.dataset.opAnimate && element.dataset.opAnimate !== "true"
        ? element.dataset.opAnimate
        : "");
    return options.preset || attrPreset || defaultPreset;
  }

  function modeFor(element, options = {}) {
    return validMode(options.mode || element.dataset.opMode || element.dataset.phase || "full");
  }

  function speedFor(element, options = {}) {
    return positiveNumber(options.speed ?? element.dataset.opSpeed, globalSpeed);
  }

  function hasCreditParts(element) {
    return Boolean(
      element.querySelector(
        ".op-credit__row, .op-credit__role, .op-credit__name, .op-credit__plain-line, .op-credit__letter, .op-credit__title"
      )
    );
  }

  function moveChildrenInto(element, wrapper) {
    while (element.firstChild) {
      wrapper.appendChild(element.firstChild);
    }
  }

  function splitLetters(element, text) {
    const api = runtime();
    const letters = document.createElement("span");
    letters.className = "op-credit__letters";
    letters.setAttribute("aria-label", text);
    letters.innerHTML = api && api.splitLetters
      ? api.splitLetters(text)
      : [...text].map((letter) => `<span class="op-credit__letter">${letter}</span>`).join("");
    element.replaceChildren(letters);
  }

  function wrapPlainElement(element, preset) {
    if (hasCreditParts(element)) {
      return;
    }

    if (preset === "letter-field" || element.dataset.opSplit === "letters") {
      splitLetters(element, (element.textContent || "").trim());
      return;
    }

    if (preset === "title-wash") {
      const title = document.createElement("span");
      title.className = "op-credit__title op-credit__title--flow";
      moveChildrenInto(element, title);
      element.appendChild(title);
      return;
    }

    if (preset === "final-dim-list") {
      const line = document.createElement("span");
      line.className = "op-credit__plain-line";
      moveChildrenInto(element, line);
      element.appendChild(line);
      return;
    }

    const row = document.createElement("span");
    row.className = "op-credit__row";

    if (element.dataset.opRole) {
      const role = document.createElement("span");
      role.className = "op-credit__role";
      role.textContent = element.dataset.opRole;
      row.appendChild(role);
    }

    const name = document.createElement("span");
    name.className = "op-credit__name op-credit__name--flow";
    moveChildrenInto(element, name);
    row.appendChild(name);
    element.appendChild(row);
  }

  function enhance(element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      return null;
    }

    const preset = presetFor(element, options);
    element.dataset.preset = preset;

    if (!element.classList.contains("op-credit")) {
      const display = window.getComputedStyle(element).display;
      const flow = element.dataset.opFlow || (display.startsWith("inline") ? "inline" : "block");
      element.dataset.opFlow = flow;
      element.classList.add("op-credit", "op-credit--flow", "op-credit--plain-text");
      wrapPlainElement(element, preset);
    }

    return element;
  }

  function play(target, options = {}) {
    const api = runtime();
    if (!api) {
      return [];
    }

    const element = typeof target === "string" ? document.querySelector(target) : target;
    const credit = enhance(element, options);
    if (!credit) {
      return [];
    }

    return api.previewPhase(credit, modeFor(credit, options), {
      preset: presetFor(credit, options),
      speed: speedFor(credit, options),
      previewDuration: positiveNumber(options.previewDuration ?? credit.dataset.opPreviewDuration, 1600),
    });
  }

  function playAll(root = document, options = {}) {
    return [...root.querySelectorAll(selector)].flatMap((element) => play(element, options));
  }

  function activateOne(element, options = {}) {
    const trigger = element.dataset.opTrigger || options.trigger || "visible";
    if (trigger === "manual" || element.dataset.opActivated === "true") {
      enhance(element, options);
      return;
    }

    element.dataset.opActivated = "true";
    const run = () => play(element, options);

    if (trigger === "load" || !("IntersectionObserver" in window)) {
      run();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.unobserve(entry.target);
        run();
      });
    }, { threshold: positiveNumber(element.dataset.opThreshold, 0.35) });

    observer.observe(element);
  }

  function activate(root = document, options = {}) {
    [...root.querySelectorAll(selector)].forEach((element) => activateOne(element, options));
  }

  function setSpeed(speed) {
    globalSpeed = positiveNumber(speed, 1);
    return globalSpeed;
  }

  function ready() {
    const api = runtime();
    if (!api) {
      return;
    }
    api.modes = modes;
    document.documentElement.dataset.opTextAnimations = "ready";
    document.documentElement.dataset.opTextAnimationModes = modes.join(" ");
    document.documentElement.dataset.opTextAnimationPresets = Object.keys(api.presets).join(" ");
    activate(document);
  }

  window.SAOTextAnimations = {
    modes,
    enhance,
    activate,
    play,
    playAll,
    setSpeed,
    get speed() {
      return globalSpeed;
    },
    get presets() {
      const api = runtime();
      return api ? Object.keys(api.presets) : [];
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }

  document.addEventListener("astro:page-load", ready);
})();
