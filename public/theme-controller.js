(() => {
  const storageKey = 'zheyuan-color-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  let transitionTimer = 0;

  const readStoredTheme = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  };

  const systemThemeValue = () => systemTheme.matches ? 'dark' : 'light';

  const syncThemeImages = (theme) => {
    document.querySelectorAll('img[data-theme-image]').forEach((image) => {
      if (!(image instanceof HTMLImageElement)) {
        return;
      }

      const nextSource = theme === 'dark'
        ? image.dataset.themeSrcDark
        : image.dataset.themeSrcLight;

      if (nextSource && image.getAttribute('src') !== nextSource) {
        image.setAttribute('src', nextSource);
      }
    });
  };

  const syncThemeControls = (theme) => {
    const dark = theme === 'dark';
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';

    document.querySelectorAll('[data-theme-toggle]').forEach((control) => {
      if (!(control instanceof HTMLButtonElement)) {
        return;
      }

      control.setAttribute('aria-pressed', String(dark));
      control.setAttribute('aria-label', label);
      control.setAttribute('title', label);
      control.setAttribute('data-tippy-content', label);
      control._tippy?.setContent(label);
    });
  };

  const syncThemeColor = (theme) => {
    const themeColor = document.querySelector('meta[data-theme-color]');
    themeColor?.setAttribute('content', theme === 'dark' ? '#101318' : '#ffffff');
  };

  const applyTheme = (theme, preference = 'system') => {
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    syncThemeColor(theme);
    syncThemeControls(theme);
    syncThemeImages(theme);
    window.dispatchEvent(new CustomEvent('site-theme-change', {
      detail: { theme, preference },
    }));
  };

  const beginThemeTransition = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    window.clearTimeout(transitionTimer);
    root.classList.add('theme-transitioning');
    transitionTimer = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 220);
  };

  const persistTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }
  };

  const bindThemeControls = () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((control) => {
      if (!(control instanceof HTMLButtonElement) || control.dataset.themeBound === 'true') {
        return;
      }

      control.dataset.themeBound = 'true';
      control.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        beginThemeTransition();
        persistTheme(nextTheme);
        applyTheme(nextTheme, 'user');
      });
    });
  };

  const initializeTheme = () => {
    const storedTheme = readStoredTheme();
    applyTheme(storedTheme ?? systemThemeValue(), storedTheme ? 'user' : 'system');
    bindThemeControls();
  };

  const handleSystemThemeChange = () => {
    if (!readStoredTheme()) {
      applyTheme(systemThemeValue(), 'system');
    }
  };

  if (typeof systemTheme.addEventListener === 'function') {
    systemTheme.addEventListener('change', handleSystemThemeChange);
  } else if (typeof systemTheme.addListener === 'function') {
    systemTheme.addListener(handleSystemThemeChange);
  }

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) {
      const storedTheme = readStoredTheme();
      applyTheme(storedTheme ?? systemThemeValue(), storedTheme ? 'user' : 'system');
    }
  });

  window.addEventListener('pageshow', initializeTheme);
  initializeTheme();
})();
