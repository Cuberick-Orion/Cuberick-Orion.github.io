(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const defaultHoldJitter = [
    { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "brightness(1)" },
    { opacity: 0.92, offset: 0.16, transform: "translate3d(1px, 0, 0)", filter: "brightness(1.18)" },
    { opacity: 1, offset: 0.18, transform: "translate3d(0, 0, 0)", filter: "brightness(1)" },
    { opacity: 0.84, offset: 0.42, transform: "translate3d(-1px, 1px, 0)", filter: "brightness(0.92)" },
    { opacity: 1, offset: 0.45, transform: "translate3d(0, 0, 0)", filter: "brightness(1.08)" },
    { opacity: 0.94, offset: 0.73, transform: "translate3d(1px, -1px, 0)", filter: "brightness(1.2)" },
    { opacity: 1, offset: 0.76, transform: "translate3d(0, 0, 0)", filter: "brightness(1)" },
    { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "brightness(1)" }
  ];

  const subtleHoldJitter = [
    { opacity: 1, filter: "brightness(1)" },
    { opacity: 0.94, offset: 0.22, filter: "brightness(1.08)" },
    { opacity: 1, offset: 0.25, filter: "brightness(1)" },
    { opacity: 0.9, offset: 0.66, filter: "brightness(0.95)" },
    { opacity: 1, offset: 0.7, filter: "brightness(1.05)" },
    { opacity: 1, filter: "brightness(1)" }
  ];

  const stripWipeOut = [
    { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "brightness(1) blur(0)" },
    { opacity: 1, offset: 0.1667, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 0 0 12%)", filter: "brightness(1.12) blur(0)" },
    { opacity: 1, offset: 0.3333, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 0 0 28%)", filter: "brightness(1.28) blur(0)" },
    { opacity: 0.88, offset: 0.5, transform: "translate3d(-1px, 0, 0)", clipPath: "inset(0 0 0 46%)", filter: "brightness(1.45) blur(0)" },
    { opacity: 0.64, offset: 0.6667, transform: "translate3d(2px, 0, 0)", clipPath: "inset(0 0 0 64%)", filter: "brightness(1.62) blur(1px)" },
    { opacity: 0.34, offset: 0.8333, transform: "translate3d(-1px, 0, 0)", clipPath: "inset(0 0 0 84%)", filter: "brightness(1.78) blur(1px)" },
    { opacity: 0, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 100%)", filter: "brightness(1.9) blur(1px)" }
  ];

  const fragmentCutOut = [
    { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "brightness(1) blur(0)" },
    { opacity: 1, offset: 0.1667, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 9% 0 0)", filter: "brightness(1.16) blur(0)" },
    { opacity: 0.94, offset: 0.3333, transform: "translate3d(-1px, 1px, 0)", clipPath: "inset(12% 0 4% 10%)", filter: "brightness(1.35) blur(0)" },
    { opacity: 0.76, offset: 0.5, transform: "translate3d(2px, 0, 0)", clipPath: "inset(24% 0 14% 22%)", filter: "brightness(1.58) blur(0)" },
    { opacity: 0.52, offset: 0.6667, transform: "translate3d(-2px, 1px, 0)", clipPath: "inset(0 0 44% 42%)", filter: "brightness(1.74) blur(1px)" },
    { opacity: 0.24, offset: 0.8333, transform: "translate3d(2px, 0, 0)", clipPath: "inset(0 0 70% 68%)", filter: "brightness(1.9) blur(1px)" },
    { opacity: 0, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 100% 100%)", filter: "brightness(2) blur(1px)" }
  ];

  const exposureCutOut = [
    { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "brightness(1) blur(0)" },
    { opacity: 1, offset: 0.2, transform: "translate3d(0, 0, 0)", filter: "brightness(1.45) blur(0)" },
    { opacity: 0.86, offset: 0.4, transform: "translate3d(0, 0, 0)", filter: "brightness(1.95) blur(1px)" },
    { opacity: 0.58, offset: 0.6, transform: "translate3d(0, 0, 0)", filter: "brightness(2.45) blur(1px)" },
    { opacity: 0.28, offset: 0.8, transform: "translate3d(0, 0, 0)", filter: "brightness(2.9) blur(2px)" },
    { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "brightness(3.2) blur(2px)" }
  ];

  const presets = {
    "project-glint": {
      total: 2200,
      enter: 170,
      hold: 1220,
      exit: 130,
      stagger: 24,
      easing: "steps(4, end)",
      outEasing: "steps(5, end)",
      holdJitter: subtleHoldJitter,
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "blur(3px) brightness(1.6)" },
        { opacity: 0.35, offset: 0.34, transform: "translate3d(2px, 0, 0)", filter: "blur(2px) brightness(1.9)" },
        { opacity: 0.15, offset: 0.38, transform: "translate3d(-1px, 0, 0)", filter: "blur(1px) brightness(1.2)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0) brightness(1)" }
      ],
      out: [
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0)" },
        { opacity: 0.88, offset: 0.2, transform: "translate3d(3px, 0, 0)", filter: "blur(1px) brightness(1.25)" },
        { opacity: 0.68, offset: 0.4, transform: "translate3d(7px, 0, 0)", filter: "blur(2px) brightness(1.55)" },
        { opacity: 0.42, offset: 0.6, transform: "translate3d(11px, 0, 0)", filter: "blur(3px) brightness(1.85)" },
        { opacity: 0.18, offset: 0.8, transform: "translate3d(15px, 0, 0)", filter: "blur(4px) brightness(2.05)" },
        { opacity: 0, transform: "translate3d(18px, 0, 0)", filter: "blur(5px) brightness(2.2)" }
      ],
      effect: [
        { opacity: 0, transform: "translateX(-70%) scaleX(.8)" },
        { opacity: 0.75, offset: 0.48, transform: "translateX(0%) scaleX(1.1)" },
        { opacity: 0.2, offset: 0.52, transform: "translateX(12%) scaleX(.7)" },
        { opacity: 0, transform: "translateX(70%) scaleX(1.4)" }
      ]
    },
    "letter-field": {
      total: 2400,
      enter: 210,
      hold: 1450,
      exit: 140,
      stagger: 42,
      easing: "steps(3, end)",
      outEasing: "steps(5, end)",
      holdJitter: subtleHoldJitter,
      selector: ".op-credit__letter",
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "blur(4px) brightness(1.8)" },
        { opacity: 0.55, offset: 0.45, transform: "translate3d(1px, 0, 0)", filter: "blur(2px) brightness(1.3)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0) brightness(1)" }
      ],
      out: [
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0)" },
        { opacity: 0.8, offset: 0.2, transform: "translate3d(4px, 0, 0)", filter: "blur(1px)" },
        { opacity: 0.56, offset: 0.4, transform: "translate3d(8px, 0, 0)", filter: "blur(2px)" },
        { opacity: 0.32, offset: 0.6, transform: "translate3d(13px, 0, 0)", filter: "blur(3px)" },
        { opacity: 0.14, offset: 0.8, transform: "translate3d(18px, 0, 0)", filter: "blur(4px)" },
        { opacity: 0, transform: "translate3d(22px, 0, 0)", filter: "blur(5px)" }
      ]
    },
    "title-wash": {
      total: 4500,
      enter: 460,
      hold: 2500,
      exit: 260,
      stagger: 54,
      easing: "steps(7, end)",
      outEasing: "steps(5, end)",
      holdJitter: subtleHoldJitter,
      selector: ".op-credit__title, .op-credit__roman, .op-credit__kana, .op-credit__caption",
      in: [
        { opacity: 0, transform: "translate3d(-3px, 0, 0)", clipPath: "inset(0 100% 0 0)", filter: "blur(7px) brightness(2.2)" },
        { opacity: 0.28, offset: 0.18, transform: "translate3d(3px, -1px, 0)", clipPath: "inset(0 72% 0 0)", filter: "blur(5px) brightness(2.4)" },
        { opacity: 0.08, offset: 0.22, transform: "translate3d(-2px, 1px, 0)", clipPath: "inset(0 45% 0 22%)", filter: "blur(3px) brightness(1.6)" },
        { opacity: 0.82, offset: 0.48, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 18% 0 0)", filter: "blur(1px) brightness(1.4)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "blur(0) brightness(1)" }
      ],
      out: [
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0) brightness(1)" },
        { opacity: 1, offset: 0.2, transform: "translate3d(0, 0, 0)", filter: "blur(1px) brightness(1.55)" },
        { opacity: 0.84, offset: 0.4, transform: "translate3d(0, 0, 0)", filter: "blur(2px) brightness(2.1)" },
        { opacity: 0.56, offset: 0.6, transform: "translate3d(0, 0, 0)", filter: "blur(3px) brightness(2.7)" },
        { opacity: 0.26, offset: 0.8, transform: "translate3d(0, 0, 0)", filter: "blur(5px) brightness(3.4)" },
        { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "blur(7px) brightness(4)" }
      ],
      effect: [
        { opacity: 0, transform: "scale(.55)" },
        { opacity: 0.78, offset: 0.38, transform: "scale(1.1)" },
        { opacity: 0.25, offset: 0.43, transform: "scale(.92)" },
        { opacity: 0, transform: "scale(1.45)" }
      ]
    },
    "bar-block": {
      total: 2550,
      enter: 190,
      hold: 1760,
      exit: 150,
      stagger: 34,
      easing: "steps(4, end)",
      outEasing: "steps(6, end)",
      holdJitter: defaultHoldJitter,
      selector: ".op-credit__role, .op-credit__name, .op-credit__plain-name, .op-credit__song-title",
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 100% 0 0)", filter: "brightness(1.8) blur(2px)" },
        { opacity: 1, offset: 0.25, transform: "translate3d(2px, -1px, 0)", clipPath: "inset(0 64% 0 0)", filter: "brightness(1.45) blur(1px)" },
        { opacity: 0.6, offset: 0.32, transform: "translate3d(-1px, 0, 0)", clipPath: "inset(0 48% 0 0)", filter: "brightness(0.95) blur(0)" },
        { opacity: 1, offset: 0.68, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 16% 0 0)", filter: "brightness(1.05) blur(0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "brightness(1) blur(0)" }
      ],
      out: stripWipeOut
    },
    "system-window": {
      total: 3300,
      enter: 210,
      hold: 2100,
      exit: 150,
      stagger: 42,
      easing: "steps(4, end)",
      outEasing: "steps(6, end)",
      holdJitter: defaultHoldJitter,
      containerIn: [
        { opacity: 0, filter: "blur(8px) brightness(2.4)" },
        { opacity: 0.55, offset: 0.35, filter: "blur(5px) brightness(1.9)" },
        { opacity: 1, filter: "blur(0) brightness(1)" }
      ],
      containerOut: [
        { opacity: 1, filter: "blur(0)" },
        { opacity: 0.35, offset: 0.55, filter: "blur(3px) brightness(1.8)" },
        { opacity: 0, filter: "blur(8px) brightness(2.6)" }
      ],
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 100% 0 0)", filter: "blur(2px)" },
        { opacity: 1, offset: 0.55, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 24% 0 0)", filter: "blur(0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "blur(0)" }
      ],
      out: stripWipeOut
    },
    "right-stack": {
      total: 2900,
      enter: 160,
      hold: 1980,
      exit: 140,
      stagger: 46,
      easing: "steps(3, end)",
      outEasing: "steps(6, end)",
      holdJitter: defaultHoldJitter,
      in: [
        { opacity: 0, transform: "translate3d(6px, 0, 0)", clipPath: "inset(0 0 0 100%)", filter: "blur(2px) brightness(1.7)" },
        { opacity: 1, offset: 0.48, transform: "translate3d(-2px, 0, 0)", clipPath: "inset(0 0 0 38%)", filter: "blur(0) brightness(1.2)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "blur(0) brightness(1)" }
      ],
      out: stripWipeOut
    },
    "hud-scan": {
      total: 2600,
      enter: 130,
      hold: 1800,
      exit: 120,
      stagger: 34,
      easing: "steps(2, end)",
      outEasing: "steps(6, end)",
      holdJitter: defaultHoldJitter,
      in: [
        { opacity: 0, transform: "translate3d(8px, -2px, 0) skewX(-4deg)", filter: "brightness(2) blur(3px)" },
        { opacity: 0.45, offset: 0.32, transform: "translate3d(-3px, 1px, 0) skewX(2deg)", filter: "brightness(1.7) blur(1px)" },
        { opacity: 0.18, offset: 0.48, transform: "translate3d(5px, 0, 0) skewX(-2deg)", filter: "brightness(1.1) blur(0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0) skewX(0)", filter: "brightness(1) blur(0)" }
      ],
      out: fragmentCutOut
    },
    "combat-stack": {
      total: 1450,
      enter: 70,
      hold: 930,
      exit: 90,
      stagger: 18,
      easing: "steps(2, end)",
      outEasing: "steps(5, end)",
      holdJitter: defaultHoldJitter,
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "brightness(2.6) blur(2px)" },
        { opacity: 1, offset: 0.5, transform: "translate3d(1px, 0, 0)", filter: "brightness(1.4) blur(0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "brightness(1) blur(0)" }
      ],
      out: exposureCutOut
    },
    "column-list": {
      total: 3700,
      enter: 180,
      hold: 2500,
      exit: 160,
      stagger: 32,
      easing: "steps(4, end)",
      outEasing: "steps(6, end)",
      holdJitter: subtleHoldJitter,
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 100% 0 0)", filter: "blur(2px) brightness(1.6)" },
        { opacity: 1, offset: 0.55, transform: "translate3d(1px, 0, 0)", clipPath: "inset(0 28% 0 0)", filter: "blur(0) brightness(1.15)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "blur(0) brightness(1)" }
      ],
      out: fragmentCutOut
    },
    "song-lockup": {
      total: 3400,
      enter: 140,
      hold: 2500,
      exit: 170,
      stagger: 38,
      easing: "steps(3, end)",
      outEasing: "steps(6, end)",
      holdJitter: subtleHoldJitter,
      selector: ".op-credit__role, .op-credit__song-title, .op-credit__song-meta",
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", clipPath: "inset(100% 0 0 0)", filter: "blur(2px) brightness(1.8)" },
        { opacity: 1, offset: 0.58, transform: "translate3d(1px, 0, 0)", clipPath: "inset(22% 0 0 0)", filter: "blur(0) brightness(1.2)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", clipPath: "inset(0 0 0 0)", filter: "blur(0) brightness(1)" }
      ],
      out: stripWipeOut
    },
    "bottom-caption": {
      total: 5200,
      enter: 240,
      hold: 4100,
      exit: 220,
      stagger: 70,
      easing: "steps(5, end)",
      outEasing: "steps(5, end)",
      holdJitter: subtleHoldJitter,
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "blur(3px) brightness(1.7)" },
        { opacity: 0.5, offset: 0.42, transform: "translate3d(1px, 0, 0)", filter: "blur(1px) brightness(1.2)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0) brightness(1)" }
      ],
      out: exposureCutOut
    },
    "final-dim-list": {
      total: 3900,
      enter: 320,
      hold: 2450,
      exit: 180,
      stagger: 54,
      easing: "steps(6, end)",
      outEasing: "steps(5, end)",
      holdJitter: subtleHoldJitter,
      selector: ".op-credit__plain-line",
      in: [
        { opacity: 0, transform: "translate3d(0, 0, 0)", filter: "blur(5px) brightness(1.7)" },
        { opacity: 0.42, offset: 0.45, transform: "translate3d(0, 0, 0)", filter: "blur(2px) brightness(1.2)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0) brightness(1)" }
      ],
      out: exposureCutOut
    }
  };

  function withoutOffset(frame) {
    const next = { ...frame };
    delete next.offset;
    return next;
  }

  function finalFrame(frames) {
    return withoutOffset(frames[frames.length - 1]);
  }

  function applyFrame(target, frame) {
    Object.entries(frame).forEach(([property, value]) => {
      if (property === "offset" || property === "easing" || value == null) return;
      target.style[property] = value;
    });
  }

  function commitAndCancelAt(owner, playId, animation, target, frame, delay) {
    window.setTimeout(() => {
      if (owner.dataset.opPlayId !== playId) return;
      applyFrame(target, frame);
      animation.cancel();
    }, delay);
  }

  function timingValue(element, override, config, key, fallback = 0) {
    const value = override[key] ?? element.dataset[key] ?? config[key] ?? fallback;
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function playbackSpeed(element, override = {}) {
    const value = override.speed ?? element.dataset.speed ?? 1;
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 1;
  }

  function scaleMs(value, speed) {
    return Math.max(0, Number(value || 0) / speed);
  }

  function applyPlaybackSpeed(element, speed) {
    element.style.setProperty("--op-plate-edge-duration", `${scaleMs(680, speed)}ms`);
    element.style.setProperty("--op-register-square-duration", `${scaleMs(820, speed)}ms`);
  }

  function selectedParts(element, config) {
    const selector = config.selector || ".op-credit__row";
    const directRows = [...element.querySelectorAll(selector)];
    if (directRows.length) return directRows;
    return [...element.children].filter((child) => !child.classList.contains("op-credit__effect"));
  }

  function resetAnimations(element) {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    element.classList.remove(
      "op-credit--playing",
      "op-credit--preview-phase",
      "op-credit--phase-enter",
      "op-credit--phase-deco-out",
      "op-credit--phase-hold",
      "op-credit--phase-details",
      "op-credit--phase-exit"
    );
    element.style.opacity = "0";
    element.style.transform = "";
    element.style.filter = "";
    element.style.clipPath = "";
    element.style.removeProperty("--op-plate-edge-duration");
    element.style.removeProperty("--op-register-square-duration");
    element.style.removeProperty("--op-register-square-fade-delay");
    element.style.removeProperty("--op-register-square-fade-duration");
    [...element.querySelectorAll("*")].forEach((part) => {
      part.style.opacity = "";
      part.style.transform = "";
      part.style.filter = "";
      part.style.clipPath = "";
    });
  }

  function applyEnteredState(element, parts, config, containerIn) {
    applyFrame(element, finalFrame(containerIn));
    parts.forEach((part) => applyFrame(part, finalFrame(config.in)));
  }

  function play(element, override = {}) {
    const presetName = override.preset || element.dataset.preset || "bar-block";
    if (!presets[presetName]) {
      throw new Error(`Unknown OP credit preset: ${presetName}`);
    }
    const config = { ...presets[presetName], ...override };

    resetAnimations(element);

    if (reduceMotion.matches) {
      element.style.opacity = "1";
      return [];
    }

    const animations = [];
    const playId = `${Date.now()}-${Math.random()}`;
    element.dataset.opPlayId = playId;
    element.classList.add("op-credit--playing");
    const speed = playbackSpeed(element, override);
    applyPlaybackSpeed(element, speed);
    const parts = selectedParts(element, config);
    const startDelay = scaleMs(timingValue(element, override, config, "delay", 0), speed);
    const enter = scaleMs(timingValue(element, override, config, "enter", config.enter), speed);
    const hold = scaleMs(timingValue(element, override, config, "hold", config.hold), speed);
    const exit = scaleMs(timingValue(element, override, config, "exit", config.exit), speed);
    const stagger = scaleMs(timingValue(element, override, config, "stagger", config.stagger), speed);
    const exitStagger = scaleMs(timingValue(element, override, config, "exitStagger", config.exitStagger || 0), speed);
    const outStart = startDelay + enter + hold;

    const containerIn = config.containerIn || [
      { opacity: 0 },
      { opacity: 1 }
    ];
    const containerOut = config.containerOut || [
      { opacity: 1 },
      { opacity: 0 }
    ];
    const rootExit = scaleMs(timingValue(element, override, config, "containerExit", config.containerExit || 24), speed);
    const exitDelayForPart = (index) => {
      const enterEnd = startDelay + index * stagger + enter;
      return Math.max(enterEnd, outStart + index * exitStagger);
    };
    const latestPartExitEnd = parts.reduce((latest, _part, index) => {
      return Math.max(latest, exitDelayForPart(index) + exit);
    }, outStart + exit);
    const sequenceDuration = latestPartExitEnd - startDelay + rootExit;
    const total = Math.max(scaleMs(timingValue(element, override, config, "total", config.total || 0), speed), sequenceDuration);

    const rootEnterAnimation = element.animate(containerIn, {
      duration: enter,
      delay: startDelay,
      easing: config.easing,
      fill: "both"
    });
    animations.push(rootEnterAnimation);
    commitAndCancelAt(element, playId, rootEnterAnimation, element, finalFrame(containerIn), startDelay + enter + 1);

    const rootExitAnimation = element.animate(containerOut, {
      duration: rootExit,
      delay: latestPartExitEnd,
      easing: config.outEasing || config.easing,
      fill: "forwards"
    });
    animations.push(rootExitAnimation);
    commitAndCancelAt(element, playId, rootExitAnimation, element, finalFrame(containerOut), latestPartExitEnd + rootExit + 1);

    parts.forEach((part, index) => {
      const partDelay = startDelay + index * stagger;
      const partExitDelay = exitDelayForPart(index);
      const partHold = Math.max(0, partExitDelay - (partDelay + enter));
      const enterAnimation = part.animate(config.in, {
        duration: enter,
        delay: partDelay,
        easing: config.easing,
        fill: "both"
      });
      animations.push(enterAnimation);
      commitAndCancelAt(element, playId, enterAnimation, part, finalFrame(config.in), partDelay + enter + 1);

      if (config.holdJitter !== false && partHold > scaleMs(240, speed)) {
        const jitterDuration = scaleMs(timingValue(element, override, config, "holdJitterDuration", config.holdJitterDuration || 360), speed);
        const jitterIterations = Math.max(1, Math.floor((partHold - scaleMs(40, speed)) / jitterDuration));
        animations.push(
          part.animate(config.holdJitter || defaultHoldJitter, {
            duration: jitterDuration,
            delay: partDelay + enter,
            iterations: jitterIterations,
            easing: "steps(1, end)",
            fill: "none"
          })
        );
      }

      const exitAnimation = part.animate(config.out, {
        duration: exit,
        delay: partExitDelay,
        easing: config.outEasing || config.easing,
        fill: "forwards"
      });
      animations.push(exitAnimation);
      commitAndCancelAt(element, playId, exitAnimation, part, finalFrame(config.out), partExitDelay + exit + 1);
    });

    const effect = element.querySelector(".op-credit__effect");
    if (effect && config.effect) {
      animations.push(
        effect.animate(config.effect, {
          duration: enter + exit + scaleMs(220, speed),
          delay: startDelay + Math.max(0, enter - scaleMs(220, speed)),
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "both"
        })
      );
    }

    window.setTimeout(() => {
      if (element.dataset.opPlayId === playId) {
        element.classList.remove("op-credit--playing");
      }
    }, startDelay + total + scaleMs(120, speed));

    return animations;
  }

  function playAll(root = document, override = {}) {
    const credits = [...root.querySelectorAll(".op-credit[data-preset]")];
    const animations = credits.flatMap((credit) => play(credit, override));
    return animations;
  }

  function previewPhase(element, phase = "full", override = {}) {
    if (phase === "full") return play(element, override);

    const presetName = override.preset || element.dataset.preset || "bar-block";
    if (!presets[presetName]) {
      throw new Error(`Unknown OP credit preset: ${presetName}`);
    }
    const config = { ...presets[presetName], ...override };
    const parts = selectedParts(element, config);
    const speed = playbackSpeed(element, override);
    const enter = scaleMs(timingValue(element, override, config, "enter", config.enter), speed);
    const exit = scaleMs(timingValue(element, override, config, "exit", config.exit), speed);
    const stagger = scaleMs(timingValue(element, override, config, "stagger", config.stagger), speed);
    const exitStagger = scaleMs(timingValue(element, override, config, "exitStagger", config.exitStagger || 0), speed);
    const previewDuration = scaleMs(timingValue(element, override, config, "previewDuration", 1600), speed);
    const containerIn = config.containerIn || [
      { opacity: 0 },
      { opacity: 1 }
    ];
    const containerOut = config.containerOut || [
      { opacity: 1 },
      { opacity: 0 }
    ];
    const animations = [];
    const playId = `${Date.now()}-${Math.random()}`;

    resetAnimations(element);
    element.dataset.opPlayId = playId;
    element.classList.add("op-credit--playing", "op-credit--preview-phase", `op-credit--phase-${phase}`);
    applyPlaybackSpeed(element, speed);

    if (reduceMotion.matches) {
      applyEnteredState(element, parts, config, containerIn);
      return animations;
    }

    if (phase === "enter") {
      const rootEnterAnimation = element.animate(containerIn, {
        duration: enter,
        easing: config.easing,
        fill: "both"
      });
      animations.push(rootEnterAnimation);
      commitAndCancelAt(element, playId, rootEnterAnimation, element, finalFrame(containerIn), enter + 1);

      parts.forEach((part, index) => {
        const enterAnimation = part.animate(config.in, {
          duration: enter,
          delay: index * stagger,
          easing: config.easing,
          fill: "both"
        });
        animations.push(enterAnimation);
        commitAndCancelAt(element, playId, enterAnimation, part, finalFrame(config.in), index * stagger + enter + 1);
      });

      window.setTimeout(() => {
        if (element.dataset.opPlayId === playId) element.classList.remove("op-credit--playing");
      }, enter + stagger * Math.max(0, parts.length - 1) + scaleMs(220, speed));
      return animations;
    }

    if (phase === "deco-out") {
      const latestEnterEnd = enter + stagger * Math.max(0, parts.length - 1);
      const markerFadeDelay = latestEnterEnd + scaleMs(120, speed);
      const markerFadeDuration = scaleMs(timingValue(element, override, config, "markerFadeDuration", 620), speed);
      element.style.setProperty("--op-register-square-fade-delay", `${markerFadeDelay}ms`);
      element.style.setProperty("--op-register-square-fade-duration", `${markerFadeDuration}ms`);

      const rootEnterAnimation = element.animate(containerIn, {
        duration: enter,
        easing: config.easing,
        fill: "both"
      });
      animations.push(rootEnterAnimation);
      commitAndCancelAt(element, playId, rootEnterAnimation, element, finalFrame(containerIn), enter + 1);

      parts.forEach((part, index) => {
        const enterAnimation = part.animate(config.in, {
          duration: enter,
          delay: index * stagger,
          easing: config.easing,
          fill: "both"
        });
        animations.push(enterAnimation);
        commitAndCancelAt(element, playId, enterAnimation, part, finalFrame(config.in), index * stagger + enter + 1);
      });

      window.setTimeout(() => {
        if (element.dataset.opPlayId === playId) element.classList.remove("op-credit--playing");
      }, markerFadeDelay + markerFadeDuration + scaleMs(260, speed));
      return animations;
    }

    applyEnteredState(element, parts, config, containerIn);

    if (phase === "hold") {
      parts.forEach((part, index) => {
        const jitterDuration = scaleMs(timingValue(element, override, config, "holdJitterDuration", config.holdJitterDuration || 360), speed);
        const iterations = Math.max(1, Math.ceil(previewDuration / jitterDuration));
        animations.push(
          part.animate(config.holdJitter || defaultHoldJitter, {
            duration: jitterDuration,
            delay: index * Math.min(stagger, scaleMs(40, speed)),
            iterations,
            easing: "steps(1, end)",
            fill: "none"
          })
        );
      });
    }

    if (phase === "exit") {
      parts.forEach((part, index) => {
        const exitAnimation = part.animate(config.out, {
          duration: exit,
          delay: index * exitStagger,
          easing: config.outEasing || config.easing,
          fill: "forwards"
        });
        animations.push(exitAnimation);
        commitAndCancelAt(element, playId, exitAnimation, part, finalFrame(config.out), index * exitStagger + exit + 1);
      });

      const latestPartExitEnd = exit + exitStagger * Math.max(0, parts.length - 1);
      const rootExit = scaleMs(timingValue(element, override, config, "containerExit", config.containerExit || 24), speed);
      const rootExitAnimation = element.animate(containerOut, {
        duration: rootExit,
        delay: latestPartExitEnd,
        easing: config.outEasing || config.easing,
        fill: "forwards"
      });
      animations.push(rootExitAnimation);
      commitAndCancelAt(element, playId, rootExitAnimation, element, finalFrame(containerOut), latestPartExitEnd + rootExit + 1);
    }

    window.setTimeout(() => {
      if (element.dataset.opPlayId === playId) element.classList.remove("op-credit--playing");
    }, phase === "exit"
      ? exit + exitStagger * Math.max(0, parts.length - 1) + scaleMs(260, speed)
      : previewDuration + scaleMs(120, speed));

    return animations;
  }

  function previewAll(phase = "full", root = document, override = {}) {
    const credits = [...root.querySelectorAll(".op-credit[data-preset]")];
    return credits.flatMap((credit) => previewPhase(credit, phase, override));
  }

  function splitLetters(text) {
    return [...text].map((letter) => `<span class="op-credit__letter">${letter}</span>`).join("");
  }

  window.SAOStaffCredits = {
    presets,
    play,
    playAll,
    previewPhase,
    previewAll,
    splitLetters
  };
})();
