/**
 * VELOURA PMU & BROW STUDIO - LANGUAGE & RTL/LTR MANAGER
 */

const PMULanguage = (function() {
  const STORAGE_KEY = 'pmu_language';
  const html = document.documentElement;

  function init() {
    const savedLang = localStorage.getItem(STORAGE_KEY) || 'en';
    setLanguage(savedLang, false);
    bindToggles();
  }

  function setLanguage(lang, notify = true) {
    const isRtl = lang === 'ar';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    localStorage.setItem(STORAGE_KEY, lang);

    // Swap Bootstrap CSS link if present
    const bsLink = document.getElementById('bootstrap-css');
    if (bsLink) {
      if (isRtl) {
        bsLink.setAttribute('href', 'css/bootstrap.rtl.min.css');
      } else {
        bsLink.setAttribute('href', 'css/bootstrap.min.css');
      }
    }

    // Update UI indicators
    document.querySelectorAll('.lang-label').forEach(el => {
      el.textContent = isRtl ? 'العربية (RTL)' : 'EN (LTR)';
    });

    document.querySelectorAll('[data-action="toggle-language"]').forEach(btn => {
      btn.setAttribute('title', isRtl ? 'Switch to English (LTR layout)' : 'Switch to RTL Layout (العربية)');
      btn.setAttribute('aria-label', isRtl ? 'Switch to English (LTR layout)' : 'Switch to RTL Layout (العربية)');
      if (isRtl) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (notify && window.PMUNotifications) {
      window.PMUNotifications.gold(
        isRtl ? 'تم تفعيل الاتجاه من اليمين إلى اليسار (RTL)' : 'Switched to English (LTR layout)',
        2500
      );
    }
  }

  function toggle() {
    const current = html.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    setLanguage(next, true);
  }

  function bindToggles() {
    document.querySelectorAll('[data-action="toggle-language"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggle();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    setLanguage,
    toggle,
    isRtl: () => html.getAttribute('dir') === 'rtl',
    getLanguage: () => html.getAttribute('lang') || 'en'
  };
})();

window.PMULanguage = PMULanguage;
