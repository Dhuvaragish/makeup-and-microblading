/**
 * AURA PMU STUDIO - NAVIGATION & HEADER CONTROLLER
 */

const PMUNavigation = (function() {
  function init() {
    setupStickyHeader();
    setupActiveLinks();
    setupMobileMenu();
    setupBackToTop();
  }

  function setupStickyHeader() {
    const header = document.querySelector('.pmu-header, .pmu-header-simple, .pmu-portal-auth-page > header, header.sticky-top');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function setupActiveLinks() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item, .sidebar-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === path || (path === '' && href === 'index.html'))) {
        link.classList.add('active');
        // If inside dropdown, highlight parent nav-link too
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const toggle = parentDropdown.querySelector('.nav-link');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  function setupMobileMenu() {
    // If mobile menu toggle exists
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    if (toggler && collapse) {
      document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
          if (collapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapse);
            if (bsCollapse) bsCollapse.hide();
          }
        });
      });
    }
  }

  function setupBackToTop() {
    const btn = document.querySelector('.btn-back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
})();

window.PMUNavigation = PMUNavigation;
