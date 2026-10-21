/**
 * VELOURA PMU & BROW STUDIO - SHARED FOOTER CONTROLLER
 * Standardizes footer behavior, newsletter validation, back-to-top & legal modals
 */

const PMUFooter = (function() {
  function init() {
    setupNewsletterForms();
    setupLegalModals();
    setupBackToTop();
  }

  /**
   * 1. Newsletter Form Validation & Handling
   * Complies with requirement: Do not claim an email subscription succeeded
   * unless a real backend or email service confirms it.
   */
  function setupNewsletterForms() {
    const forms = document.querySelectorAll('.footer-newsletter-form, .pmu-newsletter-box form');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    forms.forEach(form => {
      // Prevent duplicate listener attachment
      if (form.dataset.footerInit) return;
      form.dataset.footerInit = 'true';

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        let feedback = form.parentElement.querySelector('.footer-newsletter-feedback');

        if (!feedback) {
          feedback = document.createElement('div');
          feedback.className = 'footer-newsletter-feedback small mt-2';
          form.parentElement.appendChild(feedback);
        }

        if (!input) return;
        const email = input.value.trim();

        // 1. Validation check
        if (!email) {
          showFeedback(feedback, 'Please enter an email address to request beauty updates.', 'danger');
          input.focus();
          return;
        }

        if (!emailRegex.test(email)) {
          showFeedback(feedback, 'Please enter a valid email address (e.g., name@domain.com).', 'danger');
          input.focus();
          return;
        }

        // 2. Store subscription request locally
        try {
          const stored = JSON.parse(localStorage.getItem('pmu_newsletter_requests') || '[]');
          if (!stored.includes(email)) {
            stored.push(email);
            localStorage.setItem('pmu_newsletter_requests', JSON.stringify(stored));
          }
        } catch (err) {
          console.warn('LocalStorage unavailable for newsletter request', err);
        }

        // 3. Realistic feedback - no false claims of active backend email dispatch
        const msg = 'Subscription request recorded. Note: Email service is currently in demonstration mode. For immediate VIP booking assistance, contact concierge@velourastudio.com.';
        showFeedback(feedback, msg, 'gold');

        if (window.PMUNotifications) {
          window.PMUNotifications.gold(msg, 5000);
        }

        input.value = '';
      });
    });
  }

  function showFeedback(el, message, type) {
    el.style.display = 'block';
    if (type === 'danger') {
      el.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-exclamation me-1"></i> ${escapeHTML(message)}</span>`;
    } else {
      el.innerHTML = `<span class="text-gold"><i class="fa-solid fa-circle-check me-1"></i> ${escapeHTML(message)}</span>`;
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * 2. Back to Top Button Functionality
   */
  function setupBackToTop() {
    let btn = document.querySelector('.btn-back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-back-to-top';
      btn.setAttribute('aria-label', 'Back to Top');
      btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }, { passive: true });

    btn.onclick = function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  /**
   * 3. Shared Privacy Policy & Terms Modals (Auto-injected if missing)
   */
  function setupLegalModals() {
    if (!document.getElementById('modalPrivacyPolicy')) {
      const privacyModalHTML = `
      <div class="modal fade" id="modalPrivacyPolicy" tabindex="-1" aria-labelledby="modalPrivacyPolicyLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border">
            <div class="modal-header border-bottom">
              <h5 class="modal-title font-serif" id="modalPrivacyPolicyLabel"><i class="fa-solid fa-shield-halved text-gold me-2"></i>VELOURA Studio Privacy Policy</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body small text-muted lh-base">
              <h6 class="font-serif text-main fw-bold mb-2">1. Client Confidentiality &amp; Health Records</h6>
              <p>At VELOURA Permanent Makeup &amp; Brow Studio, we safeguard client medical history, allergy disclosures, and skin evaluation records with strict medical-grade encryption. Information submitted via our booking and consultation forms is strictly used for treatment qualification and artist preparation.</p>
              
              <h6 class="font-serif text-main fw-bold mb-2">2. Photographic Documentation &amp; Consent</h6>
              <p>Before-and-after procedural photographs are taken for clinical documentation. Images are only published or featured in our portfolio gallery with explicit, written client consent.</p>

              <h6 class="font-serif text-main fw-bold mb-2">3. Communications &amp; Data Rights</h6>
              <p>We do not sell, rent, or trade your contact information to third parties. You may request data deletion or update your communication preferences at any time by contacting <a href="mailto:concierge@velourastudio.com" class="text-gold">concierge@velourastudio.com</a>.</p>
            </div>
            <div class="modal-footer border-top py-2">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', privacyModalHTML);
    }

    if (!document.getElementById('modalTermsTreatment')) {
      const termsModalHTML = `
      <div class="modal fade" id="modalTermsTreatment" tabindex="-1" aria-labelledby="modalTermsTreatmentLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border">
            <div class="modal-header border-bottom">
              <h5 class="modal-title font-serif" id="modalTermsTreatmentLabel"><i class="fa-solid fa-file-contract text-gold me-2"></i>VELOURA Studio Terms of Treatment</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body small text-muted lh-base">
              <h6 class="font-serif text-main fw-bold mb-2">1. Appointment Booking &amp; Cancellation Policy</h6>
              <p>A non-refundable retainer is required to reserve all procedural sessions. We require at least 48 hours notice for appointment rescheduling. Cancellations within 48 hours will forfeit the retainer.</p>

              <h6 class="font-serif text-main fw-bold mb-2">2. Touch-Up &amp; Healing Window</h6>
              <p>Initial microblading and cosmetic tattoo treatments are a two-step process. A complimentary or standard perfecting touch-up session must be scheduled within 6 to 8 weeks after the primary procedure.</p>

              <h6 class="font-serif text-main fw-bold mb-2">3. Contraindications &amp; Age Eligibility</h6>
              <p>Clients must be at least 18 years of age. Permanent cosmetic procedures cannot be performed on clients who are pregnant, nursing, currently taking Accutane, or undergoing active chemotherapy.</p>
            </div>
            <div class="modal-footer border-top py-2">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML('beforeend', termsModalHTML);
    }
  }

  /**
   * 4. Helper to return the standardized footer markup string
   */
  function getStandardFooterHTML() {
    return `
  <footer class="pmu-footer">
    <div class="container pmu-footer-top">
      <div class="row g-5">
        <!-- Col 1: Brand & Atelier Story -->
        <div class="col-12 col-md-6 col-lg-4">
          <a class="pmu-brand mb-3 text-decoration-none" href="index.html" aria-label="VELOURA Permanent Makeup Studio">
            <div class="pmu-brand-logo">
              <img src="assets/icons/logo.svg" alt="VELOURA Logo" width="44" height="44">
            </div>
            <div class="pmu-brand-text">
              <span class="pmu-brand-name text-white">VELOURA</span>
              <span class="pmu-brand-tagline">PERMANENT MAKEUP &amp; BROW STUDIO</span>
            </div>
          </a>
          <p class="text-white-50 small mb-4">
            Manhattan's premier destination for bespoke semi-permanent cosmetic tattooing. Emphasizing subtle enhancement, clinical precision, and golden ratio harmony.
          </p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="footer-badge-item"><i class="fa-solid fa-award"></i> PhiAcademy Grand Master</span>
            <span class="footer-badge-item"><i class="fa-solid fa-shield-virus"></i> OSHA Certified</span>
          </div>
          <div class="pmu-footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Instagram" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="TikTok" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Facebook" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="Pinterest" aria-label="Pinterest"><i class="fa-brands fa-pinterest-p"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="YouTube" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="https://wa.me/15552347890" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="WhatsApp" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <!-- Col 2: Treatments -->
        <div class="col-6 col-md-6 col-lg-2">
          <h5 class="pmu-footer-title">Treatments</h5>
          <ul class="pmu-footer-links">
            <li><a href="service-details.html?service=microblading">Microblading</a></li>
            <li><a href="service-details.html?service=powder-brows">Ombré Powder Brows</a></li>
            <li><a href="service-details.html?service=combo-brows">Combination Brows</a></li>
            <li><a href="service-details.html?service=nano-brows">Digital Nano Brows</a></li>
            <li><a href="service-details.html?service=lip-blush">Velvet Lip Blush</a></li>
            <li><a href="service-details.html?service=annual-touchup">Annual Touch-Up</a></li>
          </ul>
        </div>

        <!-- Col 3: Studio -->
        <div class="col-6 col-md-6 col-lg-2">
          <h5 class="pmu-footer-title">Studio</h5>
          <ul class="pmu-footer-links">
            <li><a href="about.html">About Studio</a></li>
            <li><a href="artists.html">Master Artists</a></li>
            <li><a href="gallery.html">Before &amp; Afters</a></li>
            <li><a href="aftercare.html">Aftercare Guide</a></li>
            <li><a href="consultation.html">Consultation</a></li>
            <li><a href="contact.html">Studio Location</a></li>
          </ul>
        </div>

        <!-- Col 4: Studio Concierge -->
        <div class="col-12 col-md-6 col-lg-4">
          <h5 class="pmu-footer-title">Studio Concierge</h5>
          <div class="pmu-footer-contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>740 Madison Avenue, 4th Floor, New York, NY 10065</span>
          </div>
          <div class="pmu-footer-contact-item">
            <i class="fa-solid fa-phone"></i>
            <span><a href="tel:+15552347890" class="text-white-50 text-decoration-none">+1 (555) 234-7890</a></span>
          </div>
          <div class="pmu-footer-contact-item">
            <i class="fa-solid fa-envelope"></i>
            <span><a href="mailto:concierge@velourastudio.com" class="text-white-50 text-decoration-none">concierge@velourastudio.com</a></span>
          </div>

          <div class="pmu-newsletter-box">
            <form class="w-100 d-flex position-relative footer-newsletter-form" novalidate>
              <input type="email" class="form-control footer-newsletter-input" placeholder="VIP beauty updates &amp; discounts..." required aria-label="VIP beauty updates &amp; discounts email">
              <button type="submit" aria-label="Subscribe to newsletter"><i class="fa-solid fa-paper-plane"></i></button>
            </form>
            <div class="footer-newsletter-feedback small mt-2" style="display: none;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="pmu-footer-bottom">
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div class="text-white-50 small">
          &copy; 2026 VELOURA Permanent Makeup &amp; Brow Studio. All Rights Reserved.
        </div>
        <div class="d-flex flex-wrap gap-3 small align-items-center">
          <a href="#" class="text-white-50 text-decoration-none footer-legal-link" data-bs-toggle="modal" data-bs-target="#modalPrivacyPolicy">Privacy Policy</a>
          <a href="#" class="text-white-50 text-decoration-none footer-legal-link" data-bs-toggle="modal" data-bs-target="#modalTermsTreatment">Terms of Treatment</a>
          <a href="client-dashboard.html" class="text-gold text-decoration-none">Client Lounge</a>
          <button class="border-0 bg-transparent text-white-50 p-0 text-decoration-none footer-legal-link d-inline-flex align-items-center gap-1" data-action="toggle-language" title="Toggle RTL / LTR Language" aria-label="Toggle RTL / LTR">
            <i class="fa-solid fa-globe text-gold"></i><span class="lang-label">EN</span>
          </button>
        </div>
      </div>
    </div>
  </footer>`;
  }


  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    getHTML: getStandardFooterHTML
  };
})();

window.PMUFooter = PMUFooter;
