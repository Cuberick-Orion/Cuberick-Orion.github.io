document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const buttons = document.querySelectorAll('[data-collapse-target]');

  buttons.forEach((button) => {
    const targetId = button.getAttribute('data-collapse-target');
    if (!targetId) {
      return;
    }

    const content = document.getElementById(targetId);
    const label = button.querySelector('.label');

    if (!content || !label) {
      console.error(`Collapse script: Required elements not found for target "${targetId}".`);
      return;
    }

    const expandLabel = button.getAttribute('data-expand-label') ?? 'See more';
    const collapseLabel = button.getAttribute('data-collapse-label') ?? 'See fewer';

    const updateButtonState = (isOpen) => {
      label.textContent = isOpen ? collapseLabel : expandLabel;
      button.setAttribute('aria-expanded', String(isOpen));
    };

    updateButtonState(content.classList.contains('open'));

    button.addEventListener('click', () => {
      content.classList.toggle('open');
      updateButtonState(content.classList.contains('open'));
    });
  });

  const backToTopButton = document.getElementById('back-to-top');
  const newsSection = document.getElementById('news');

  if (backToTopButton && newsSection) {
    // Keep the floating button out of transformed layout wrappers.
    if (backToTopButton.parentElement !== document.body) {
      document.body.appendChild(backToTopButton);
    }

    const newsHeading = newsSection.querySelector('h1, h2, h3, h4, h5, h6');
    let showThreshold = 0;

    const calculateThreshold = () => {
      const anchor = newsHeading ?? newsSection;
      const rect = anchor.getBoundingClientRect();
      showThreshold = window.scrollY + rect.top + anchor.clientHeight;
    };

    const updateBackToTop = () => {
      const shouldShow = window.scrollY > showThreshold;
      backToTopButton.classList.toggle('is-visible', shouldShow);
      backToTopButton.setAttribute('aria-hidden', String(!shouldShow));
      backToTopButton.hidden = !shouldShow;
    };

    calculateThreshold();
    updateBackToTop();

    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', () => {
      calculateThreshold();
      updateBackToTop();
    });
    window.addEventListener('load', () => {
      calculateThreshold();
      updateBackToTop();
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const detailsElements = document.querySelectorAll('article.heti details');

  detailsElements.forEach((details) => {
    const summary = details.querySelector('summary');
    if (!summary || details.dataset.animatedDetails === 'true') {
      return;
    }
    details.dataset.animatedDetails = 'true';

    let isAnimating = false;

    const finish = (shouldOpen) => {
      details.open = shouldOpen;
      details.classList.remove('details-animating');
      details.style.height = '';
      details.style.overflow = '';
      isAnimating = false;
    };

    const animate = (startHeight, endHeight, shouldOpen) => {
      details.classList.add('details-animating');
      details.style.overflow = 'hidden';
      details.style.height = `${startHeight}px`;

      requestAnimationFrame(() => {
        details.style.height = `${endHeight}px`;
      });

      const handleEnd = (event) => {
        if (event.propertyName !== 'height') {
          return;
        }
        details.removeEventListener('transitionend', handleEnd);
        finish(shouldOpen);
      };

      details.addEventListener('transitionend', handleEnd);
    };

    const expand = () => {
      const startHeight = details.offsetHeight;
      details.open = true;
      const endHeight = details.scrollHeight;
      animate(startHeight, endHeight, true);
    };

    const collapse = () => {
      const startHeight = details.offsetHeight;
      const endHeight = summary.offsetHeight;
      animate(startHeight, endHeight, false);
    };

    summary.addEventListener('click', (event) => {
      if (isAnimating) {
        event.preventDefault();
        return;
      }

      if (reduceMotion) {
        return;
      }

      event.preventDefault();
      isAnimating = true;

      if (details.open) {
        collapse();
      } else {
        expand();
      }
    });
  });

  const clipboardIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="8" y="7" width="10" height="13" rx="2" ry="2"></rect>
      <path d="M9 5h6"></path>
      <path d="M6 10V6a2 2 0 0 1 2-2h7"></path>
    </svg>
  `;

  const checkIcon = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 13l4 4L19 7"></path>
    </svg>
  `;

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const bibCodeBlocks = document.querySelectorAll('article.heti details pre');

  bibCodeBlocks.forEach((pre) => {
    if (pre.classList.contains('bib-copy-target')) {
      return;
    }

    const code = pre.querySelector('code');
    if (!code) {
      return;
    }

    pre.classList.add('bib-copy-target');

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'bib-copy-button';
    copyButton.setAttribute('aria-label', 'Copy BibTeX');
    copyButton.innerHTML = clipboardIcon;

    let resetTimer = null;

    copyButton.addEventListener('click', async () => {
      const text = (code.textContent ?? '').replace(/^\n+|\n+$/g, '');
      if (!text) {
        return;
      }

      try {
        await copyToClipboard(text);
        copyButton.classList.add('copied');
        copyButton.innerHTML = checkIcon;

        if (resetTimer) {
          window.clearTimeout(resetTimer);
        }

        resetTimer = window.setTimeout(() => {
          copyButton.classList.remove('copied');
          copyButton.innerHTML = clipboardIcon;
          resetTimer = null;
        }, 1800);
      } catch (error) {
        console.error('Failed to copy BibTeX:', error);
      }
    });

    pre.appendChild(copyButton);
  });
});
