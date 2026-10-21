/**
 * VELOURA PMU & BROW STUDIO - THEME MANAGER (LIGHT & DARK MODE)
 */

const PMUTheme = (function() {
  const STORAGE_KEY = 'pmu_theme';
  const html = document.documentElement;

  function init() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to document attribute or light luxury mode
      const initialTheme = html.getAttribute('data-theme') || 'light';
      setTheme(initialTheme);
    }

    // Attach to toggle buttons
    bindToggles();
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcons(theme);
  }

  function toggle() {
    const current = html.getAttribute('data-theme') || 'light';
    const target = current === 'dark' ? 'light' : 'dark';
    setTheme(target);
    if (window.PMUNotifications) {
      window.PMUNotifications.info(`Switched to ${target === 'dark' ? 'Dark' : 'Light'} Mode`, 2000);
    }
  }

  function updateIcons(theme) {
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  }

  function bindToggles() {
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
      });
    });
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    setTheme,
    toggle,
    getTheme: () => html.getAttribute('data-theme') || 'light'
  };
})();

window.PMUTheme = PMUTheme;
