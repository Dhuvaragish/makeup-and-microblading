/**
 * AURA PMU STUDIO - MAIN APPLICATION CONTROLLER
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Initialize Bootstrap Tooltips if available
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(el) {
      return new bootstrap.Tooltip(el);
    });
  }

  // 2. Animate Stat Numbers on Scroll
  const statNumbers = document.querySelectorAll('.pmu-stat-number');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target || el.textContent.replace(/[^\d]/g, ''));
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          if (target) {
            animateNumber(el, target, prefix, suffix);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  }

  function animateNumber(el, target, prefix, suffix) {
    let start = 0;
    const duration = 1600;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `${prefix}${Math.floor(start).toLocaleString()}${suffix}`;
      }
    }, stepTime);
  }

  // 3. Global Newsletter Form Handling
  if (window.PMUFooter && typeof window.PMUFooter.init === 'function') {
    window.PMUFooter.init();
  }


  // 4. Contact & Consultation Form Handling
  const contactForm = document.getElementById('contact-page-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.PMUValidation && PMUValidation.validateForm(contactForm)) {
        const name = contactForm.querySelector('#contact-name').value;
        const email = contactForm.querySelector('#contact-email').value;
        const phone = contactForm.querySelector('#contact-phone') ? contactForm.querySelector('#contact-phone').value : '';
        const service = contactForm.querySelector('#contact-service') ? contactForm.querySelector('#contact-service').value : 'General Enquiry';
        const message = contactForm.querySelector('#contact-message').value;

        if (window.PMUStorage) {
          PMUStorage.createEnquiry({ name, email, phone, service, message });
        }

        if (window.PMUNotifications) {
          window.PMUNotifications.success('Your message has been received! Master artist concierge will reply within 4 business hours.', 5000);
        }

        contactForm.reset();
      }
    });
  }

  // 5. Lip Shade Swatch Selector (For Home-3 / Lips Page)
  const swatches = document.querySelectorAll('.lip-swatch-btn');
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const shadeName = btn.dataset.shade;
      const shadeDesc = btn.dataset.desc;
      const previewTitle = document.getElementById('selected-swatch-name');
      const previewDesc = document.getElementById('selected-swatch-desc');
      if (previewTitle) previewTitle.textContent = shadeName;
      if (previewDesc) previewDesc.textContent = shadeDesc;
    });
  });

  // 6. Eyebrow Shape / Face Harmony Selector (For Home-2)
  const faceShapes = document.querySelectorAll('.brow-shape-card');
  faceShapes.forEach(card => {
    card.addEventListener('click', () => {
      faceShapes.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const archType = card.dataset.arch;
      const desc = card.dataset.desc;
      const archTitle = document.getElementById('recommended-arch-title');
      const archDesc = document.getElementById('recommended-arch-desc');
      if (archTitle) archTitle.textContent = archType;
      if (archDesc) archDesc.textContent = desc;
    });
  });
});
