/**
 * VELOURA PMU & BROW STUDIO - NAVIGATION & HEADER CONTROLLER
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
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollY > 15) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function setupActiveLinks() {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const path = rawPath.split('?')[0].split('#')[0] || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item, .sidebar-link');
    
    // Clear pre-existing active classes to ensure exact active matching
    navLinks.forEach(link => link.classList.remove('active'));

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const cleanHref = href.split('?')[0].split('#')[0];
        const isServicesMatch = cleanHref === 'services.html' && (path === 'services.html' || path === 'service-details.html' || path === 'consultation.html');
        const isDashboardMatch = (cleanHref === 'client-dashboard.html' || cleanHref === 'dashboard.html') && 
          (path === 'client-dashboard.html' || path === 'dashboard.html' || path === 'client-appointments.html' || path === 'client-treatment-history.html' || path === 'client-profile.html' || path === 'client-aftercare.html');
        if (cleanHref === path || (path === '' && cleanHref === 'index.html') || isServicesMatch || isDashboardMatch) {
          link.classList.add('active');
          // If inside dropdown, highlight parent nav-link too
          const parentDropdown = link.closest('.dropdown');
          if (parentDropdown) {
            const toggle = parentDropdown.querySelector('.nav-link');
            if (toggle) toggle.classList.add('active');
          }
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
