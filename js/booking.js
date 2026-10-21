/**
 * VELOURA PMU & BROW STUDIO - LUXURY APPOINTMENT BOOKING ENGINE
 * 4-Step Interactive Scheduler with Real-Time Pricing & Reservation Flow
 */

const PMUBooking = (function() {
  let currentStep = 1;
  let servicesData = [];
  let artistsData = [];

  const bookingData = {
    serviceId: 'srv-microblading',
    serviceName: 'Signature Microblading',
    servicePrice: 550,
    serviceDuration: '120 mins',
    serviceCategory: 'brows',
    artistId: 'first-available',
    artistName: 'First Available Master Artist',
    date: '',
    time: '11:00 AM',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    emergencyPhone: '',
    clientNotes: '',
    contraindicationsClear: true
  };

  function init() {
    loadData().then(() => {
      populateServicesDropdown();
      populateArtistsDropdown();
      setupEventListeners();
      setupDateAndTime();
      setupAuthUserPrefill();
      setupUrlPreselect();
      updateStepUI();
      updatePricingSummary();
    });
  }

  async function loadData() {
    // 1. Load Services
    if (window.PMUStorage && typeof PMUStorage.getServices === 'function') {
      servicesData = PMUStorage.getServices();
    }
    if (!servicesData || !servicesData.length) {
      try {
        const res = await fetch('data/services.json');
        if (res.ok) servicesData = await res.json();
      } catch (e) {
        console.warn('Could not fetch services.json, using defaults', e);
      }
    }

    // Fallback default services if needed
    if (!servicesData || !servicesData.length) {
      servicesData = [
        { id: 'srv-microblading', name: 'Signature Microblading', price: 550, duration: '120 mins', category: 'brows' },
        { id: 'srv-powder-brows', name: 'Ombré Powder Brows', price: 580, duration: '150 mins', category: 'brows' },
        { id: 'srv-combo-brows', name: 'Combination Hybrid Brows', price: 650, duration: '150 mins', category: 'brows' },
        { id: 'srv-nano-brows', name: 'Digital Nano Hairstrokes', price: 720, duration: '150 mins', category: 'brows' },
        { id: 'srv-lip-blush', name: 'Velvet Lip Blush & Tint', price: 600, duration: '150 mins', category: 'lips' },
        { id: 'srv-annual-touchup', name: 'Annual Color Boost & Touch-Up', price: 280, duration: '90 mins', category: 'touchup' }
      ];
    }

    // 2. Load Artists
    if (window.PMUStorage && typeof PMUStorage.getArtists === 'function') {
      artistsData = PMUStorage.getArtists();
    }
    if (!artistsData || !artistsData.length) {
      try {
        const res = await fetch('data/artists.json');
        if (res.ok) artistsData = await res.json();
      } catch (e) {
        console.warn('Could not fetch artists.json, using defaults', e);
      }
    }

    if (!artistsData || !artistsData.length) {
      artistsData = [
        { id: 'art-elena', name: 'Elena Rostova', role: 'Founder & Master PMU Educator' },
        { id: 'art-sofia', name: 'Sofia Vance', role: 'Senior Lip Blush & Pigment Specialist' },
        { id: 'art-maya', name: 'Maya Lin', role: 'Digital Nano & Powder Brow Master' },
        { id: 'art-camilla', name: 'Camilla Rossi', role: 'Aesthetic PMU Artist & Symmetry Stylist' }
      ];
    }
  }

  function populateServicesDropdown() {
    const select = document.getElementById('booking-service-select');
    if (!select) return;

    select.innerHTML = servicesData.map(s => `
      <option value="${s.id}" data-price="${s.price}" data-duration="${s.duration}" data-category="${s.category || 'brows'}">
        ${s.name} ($${s.price}) — ${s.duration}
      </option>
    `).join('');

    // Default to Signature Microblading ($550)
    const microblading = servicesData.find(s => s.id === 'srv-microblading' || s.name.toLowerCase().includes('microblading'));
    if (microblading) {
      select.value = microblading.id;
      applySelectedService(microblading);
    } else if (servicesData.length > 0) {
      select.value = servicesData[0].id;
      applySelectedService(servicesData[0]);
    }

    select.addEventListener('change', function() {
      const selectedId = this.value;
      const srv = servicesData.find(s => s.id === selectedId);
      if (srv) {
        applySelectedService(srv);
      }
    });
  }

  function applySelectedService(srv) {
    bookingData.serviceId = srv.id;
    bookingData.serviceName = srv.name;
    bookingData.servicePrice = parseFloat(srv.price) || 550;
    bookingData.serviceDuration = srv.duration || '120 mins';
    bookingData.serviceCategory = srv.category || 'brows';

    // Update feature pills
    const featDuration = document.getElementById('feat-duration');
    const featPain = document.getElementById('feat-pain');
    const featRetention = document.getElementById('feat-retention');

    if (featDuration) featDuration.innerHTML = `<i class="fa-regular fa-clock text-gold"></i> ${srv.duration || '120 mins'}`;
    if (featPain) featPain.innerHTML = `<i class="fa-solid fa-hand-holding-heart text-gold"></i> ${srv.painLevel || 'Minimal (Topical Numbing)'}`;
    if (featRetention) featRetention.innerHTML = `<i class="fa-solid fa-sparkles text-gold"></i> ${srv.retention || '12-18 Months Retention'}`;

    // Update popular badge
    const badgePop = document.getElementById('treatment-badge-popular');
    if (badgePop) {
      badgePop.textContent = srv.popular ? 'Most Popular' : 'Signature Service';
    }

    updatePricingSummary();
  }

  function populateArtistsDropdown() {
    const select = document.getElementById('booking-artist-select');
    if (!select) return;

    let html = `
      <option value="first-available" selected>
        First Available Master Artist (Fastest Scheduling)
      </option>
    `;

    html += artistsData.map(a => `
      <option value="${a.id}">
        ${a.name} — ${a.role || 'Certified PMU Artist'}
      </option>
    `).join('');

    select.innerHTML = html;

    select.addEventListener('change', function() {
      const selectedId = this.value;
      if (selectedId === 'first-available') {
        bookingData.artistId = 'first-available';
        bookingData.artistName = 'First Available Master Artist';
      } else {
        const artist = artistsData.find(a => a.id === selectedId);
        if (artist) {
          bookingData.artistId = artist.id;
          bookingData.artistName = artist.name;
        }
      }
      updateStepUI();
    });
  }

  function updatePricingSummary() {
    const price = bookingData.servicePrice;
    const deposit = Math.round(price * 0.25);
    const balance = price - deposit;

    const totalEl = document.getElementById('price-total-display');
    const depositEl = document.getElementById('price-deposit-display');
    const balanceEl = document.getElementById('price-balance-display');
    const touchupBadge = document.getElementById('touchup-included-badge');

    if (totalEl) totalEl.textContent = `$${price}`;
    if (depositEl) depositEl.textContent = `$${deposit}`;
    if (balanceEl) balanceEl.textContent = `$${balance}`;

    // Touchup information: brow and lip PMU services include 6-week perfection touch-up
    if (touchupBadge) {
      const isTouchupAlready = bookingData.serviceId.includes('touchup') || bookingData.serviceCategory === 'touchup';
      if (isTouchupAlready) {
        touchupBadge.innerHTML = `
          <i class="fa-solid fa-circle-check text-gold fs-6"></i>
          <span class="small fw-semibold touchup-badge-text">Color Refresh &amp; Shape Perfection Session</span>
        `;
      } else {
        touchupBadge.innerHTML = `
          <i class="fa-solid fa-circle-check text-gold fs-6"></i>
          <span class="small fw-semibold touchup-badge-text">Complimentary 6-Week Perfection Touch-Up Included</span>
        `;
      }
    }
  }

  function setupDateAndTime() {
    const dateInput = document.getElementById('booking-date-input');
    if (!dateInput) return;

    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minIso = tomorrow.toISOString().split('T')[0];
    dateInput.min = minIso;
    dateInput.value = minIso;
    bookingData.date = minIso;

    dateInput.addEventListener('change', function() {
      bookingData.date = this.value;
      document.querySelectorAll('.date-shortcut-btn').forEach(btn => btn.classList.remove('active'));
      updateSlotPreview();
    });

    // Date Shortcuts
    document.querySelectorAll('.date-shortcut-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.date-shortcut-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const offset = parseInt(this.dataset.offset) || 1;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + offset);
        const iso = targetDate.toISOString().split('T')[0];

        dateInput.value = iso;
        bookingData.date = iso;
        updateSlotPreview();
      });
    });

    // Time Slots
    document.querySelectorAll('.time-slot-modern-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.time-slot-modern-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        bookingData.time = this.dataset.time;
        updateSlotPreview();
      });
    });

    updateSlotPreview();
  }

  function updateSlotPreview() {
    const previewEl = document.getElementById('selected-slot-preview-text');
    if (!previewEl) return;

    let formattedDate = bookingData.date;
    try {
      const parts = bookingData.date.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {}

    previewEl.textContent = `${formattedDate} at ${bookingData.time} with ${bookingData.artistName}`;
  }

  function setupEventListeners() {
    // Step 1 -> Step 2
    const step1Next = document.getElementById('booking-btn-step1-next');
    if (step1Next) {
      step1Next.addEventListener('click', () => {
        if (!bookingData.serviceId) {
          if (window.PMUNotifications) window.PMUNotifications.warning('Please select a treatment service.');
          return;
        }
        goToStep(2);
      });
    }

    // Step 2 Change Service link
    const step2Change = document.getElementById('step2-change-service-btn');
    if (step2Change) {
      step2Change.addEventListener('click', () => goToStep(1));
    }

    // Step 2 -> Step 1
    const step2Prev = document.getElementById('booking-btn-step2-prev');
    if (step2Prev) {
      step2Prev.addEventListener('click', () => goToStep(1));
    }

    // Step 2 -> Step 3
    const step2Next = document.getElementById('booking-btn-step2-next');
    if (step2Next) {
      step2Next.addEventListener('click', () => {
        if (!bookingData.date || !bookingData.time) {
          if (window.PMUNotifications) window.PMUNotifications.warning('Please select your preferred appointment date and time slot.');
          return;
        }
        goToStep(3);
      });
    }

    // Step 3 -> Step 2
    const step3Prev = document.getElementById('booking-btn-step3-prev');
    if (step3Prev) {
      step3Prev.addEventListener('click', () => goToStep(2));
    }

    // Step 3 -> Step 4
    const step3Next = document.getElementById('booking-btn-step3-next');
    if (step3Next) {
      step3Next.addEventListener('click', () => {
        if (!validateStep3()) return;
        goToStep(4);
      });
    }

    // Step 4 -> Step 3
    const step4Prev = document.getElementById('booking-btn-step4-prev');
    if (step4Prev) {
      step4Prev.addEventListener('click', () => goToStep(3));
    }

    // Step 4 Final Confirm
    const confirmBtn = document.getElementById('booking-btn-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        finalizeBooking();
      });
    }

    // Stepper direct clicks
    document.querySelectorAll('.stepper-step').forEach(stepItem => {
      stepItem.addEventListener('click', function() {
        const target = parseInt(this.dataset.step);
        if (target < currentStep) {
          goToStep(target);
        }
      });
    });

    // Reset button on success screen
    const resetBtn = document.getElementById('booking-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.getElementById('booking-success-screen').classList.add('d-none');
        document.querySelectorAll('.booking-step-content').forEach(p => p.classList.add('d-none'));
        document.getElementById('booking-step-1').classList.remove('d-none');
        goToStep(1);
      });
    }
  }

  function validateStep3() {
    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const phoneInput = document.getElementById('client-phone');
    const emergInput = document.getElementById('client-emerg-phone');
    const notesInput = document.getElementById('client-notes');
    const contraCheckbox = document.getElementById('client-contraindications-check');

    if (!nameInput || !emailInput || !phoneInput) return true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !email || !phone) {
      if (window.PMUNotifications) {
        window.PMUNotifications.warning('Please complete all required contact fields (*).');
      }
      if (!name) nameInput.focus();
      else if (!email) emailInput.focus();
      else if (!phone) phoneInput.focus();
      return false;
    }

    if (window.PMUValidation) {
      if (!PMUValidation.validateName(name)) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please enter a valid legal full name (letters only).');
        nameInput.focus();
        return false;
      }
      if (!PMUValidation.validateEmail(email)) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please enter a valid email address (e.g., name@domain.com).');
        emailInput.focus();
        return false;
      }
      if (!PMUValidation.validatePhone(phone)) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please enter a valid telephone number.');
        phoneInput.focus();
        return false;
      }
    }

    if (contraCheckbox && !contraCheckbox.checked) {
      if (window.PMUNotifications) {
        window.PMUNotifications.warning('Please confirm the health declaration & 48-hour cancellation policy agreement.');
      }
      contraCheckbox.focus();
      return false;
    }

    bookingData.clientName = name;
    bookingData.clientEmail = email;
    bookingData.clientPhone = phone;
    bookingData.emergencyPhone = emergInput ? emergInput.value.trim() : '';
    bookingData.clientNotes = notesInput ? notesInput.value.trim() : '';

    return true;
  }

  function goToStep(step) {
    currentStep = step;

    // Toggle step panes
    for (let i = 1; i <= 4; i++) {
      const pane = document.getElementById(`booking-step-${i}`);
      if (pane) {
        pane.classList.toggle('d-none', i !== currentStep);
      }
    }

    // Update stepper classes
    document.querySelectorAll('.stepper-step').forEach(stepItem => {
      const s = parseInt(stepItem.dataset.step);
      stepItem.classList.remove('active', 'completed');
      const numEl = stepItem.querySelector('.stepper-num');

      if (s === currentStep) {
        stepItem.classList.add('active');
        if (numEl) numEl.innerHTML = s;
      } else if (s < currentStep) {
        stepItem.classList.add('completed');
        if (numEl) numEl.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        if (numEl) numEl.innerHTML = s;
      }
    });

    // Update divider lines
    for (let i = 1; i <= 3; i++) {
      const div = document.getElementById(`step-divider-${i}`);
      if (div) {
        div.classList.toggle('completed', i < currentStep);
      }
    }

    // Update Subtitles
    const subtitle = document.getElementById('booking-step-subtitle');
    if (subtitle) {
      if (currentStep === 1) subtitle.textContent = 'Choose your treatment and specialist to continue.';
      else if (currentStep === 2) subtitle.textContent = 'Select your preferred appointment date and time slot.';
      else if (currentStep === 3) subtitle.textContent = 'Provide your contact information and health verification.';
      else if (currentStep === 4) subtitle.textContent = 'Review your treatment reservation details before confirming.';
    }

    // Step 2 summaries
    if (currentStep === 2) {
      const srvEl = document.getElementById('step2-summary-service');
      const artEl = document.getElementById('step2-summary-artist');
      if (srvEl) srvEl.textContent = `${bookingData.serviceName} ($${bookingData.servicePrice})`;
      if (artEl) artEl.textContent = bookingData.artistName;
      updateSlotPreview();
    }

    // Step 4 Review Pane
    if (currentStep === 4) {
      renderStep4Review();
    }

    // Scroll to card top smoothly
    const card = document.getElementById('booking-card-container');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderStep4Review() {
    const container = document.getElementById('booking-step4-review-container');
    if (!container) return;

    const deposit = Math.round(bookingData.servicePrice * 0.25);
    const balance = bookingData.servicePrice - deposit;

    let formattedDate = bookingData.date;
    try {
      const parts = bookingData.date.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {}

    container.innerHTML = `
      <div class="p-4 rounded-4 mb-3" style="background: #FAF8F4; border: 1.5px solid #E8E0D5;">
        <div class="row g-3">
          <div class="col-md-6 border-bottom border-md-bottom-0 pb-3 pb-md-0">
            <span class="text-muted small text-uppercase fw-bold letter-spacing-1 d-block mb-1" style="font-size: 0.72rem;">Treatment &amp; Specialist</span>
            <h5 class="font-serif fw-bold text-main mb-1">${bookingData.serviceName}</h5>
            <p class="text-muted small mb-2"><i class="fa-regular fa-clock text-gold me-1"></i> ${bookingData.serviceDuration} • Practitioner: <strong>${bookingData.artistName}</strong></p>
            <span class="badge bg-gold-subtle text-gold-dark small"><i class="fa-solid fa-check me-1"></i> Complimentary 6-Week Touch-Up Included</span>
          </div>

          <div class="col-md-6">
            <span class="text-muted small text-uppercase fw-bold letter-spacing-1 d-block mb-1" style="font-size: 0.72rem;">Scheduled Appointment</span>
            <h5 class="font-serif fw-bold text-main mb-1">${bookingData.time}</h5>
            <p class="text-muted small mb-2"><i class="fa-regular fa-calendar text-gold me-1"></i> ${formattedDate}</p>
            <span class="small text-muted"><i class="fa-solid fa-location-dot text-gold me-1"></i> 740 Madison Avenue, 4th Fl, Manhattan</span>
          </div>
        </div>

        <hr class="my-3" style="border-color: #E8E0D5;">

        <div class="row g-2 small">
          <div class="col-sm-6">
            <span class="text-muted">Client:</span> <strong class="text-main">${bookingData.clientName}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-muted">Email:</span> <strong class="text-main">${bookingData.clientEmail}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-muted">Phone:</span> <strong class="text-main">${bookingData.clientPhone}</strong>
          </div>
          ${bookingData.clientNotes ? `
          <div class="col-12 mt-1">
            <span class="text-muted">Client Notes:</span> <em>"${bookingData.clientNotes}"</em>
          </div>` : ''}
        </div>
      </div>

      <!-- Financial Ledger -->
      <div class="booking-pricing-summary-card mb-0">
        <div class="d-flex justify-content-between mb-2">
          <span class="text-muted">Total Session Investment:</span>
          <strong class="text-main fs-5 font-serif">$${bookingData.servicePrice}</strong>
        </div>
        <div class="d-flex justify-content-between mb-2 text-gold-dark">
          <span class="fw-semibold">Deposit Due Today (25%):</span>
          <strong class="fs-5 font-serif">$${deposit}</strong>
        </div>
        <div class="d-flex justify-content-between text-muted small pt-2 border-top" style="border-color: rgba(214, 188, 145, 0.3) !important;">
          <span>Remaining Balance at Studio:</span>
          <strong class="text-main">$${balance} (Payable on visit day)</strong>
        </div>
      </div>
    `;
  }

  function finalizeBooking() {
    const deposit = Math.round(bookingData.servicePrice * 0.25);
    const balance = bookingData.servicePrice - deposit;

    const newAppointment = {
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      emergencyPhone: bookingData.emergencyPhone,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      artistId: bookingData.artistId,
      artistName: bookingData.artistName,
      date: bookingData.date,
      time: bookingData.time,
      status: "Confirmed",
      depositPaid: deposit,
      balanceDue: balance,
      totalPrice: bookingData.servicePrice,
      healingDay: null,
      notes: bookingData.clientNotes || "Online self-service reservation"
    };

    let saved = null;
    if (window.PMUStorage && typeof PMUStorage.createAppointment === 'function') {
      saved = PMUStorage.createAppointment(newAppointment);
    } else {
      saved = Object.assign({ id: "APT-" + Math.floor(1000 + Math.random() * 9000) }, newAppointment);
    }

    // Hide steps, show success screen
    document.querySelectorAll('.booking-step-content').forEach(p => p.classList.add('d-none'));
    const successScreen = document.getElementById('booking-success-screen');
    if (successScreen) {
      successScreen.classList.remove('d-none');

      const refEl = document.getElementById('booking-success-ref');
      if (refEl) refEl.textContent = saved.id;

      const srvEl = document.getElementById('booking-success-service');
      if (srvEl) srvEl.textContent = saved.serviceName;

      const artEl = document.getElementById('booking-success-artist');
      if (artEl) artEl.textContent = saved.artistName;

      const dateEl = document.getElementById('booking-success-date');
      if (dateEl) dateEl.textContent = `${saved.date} at ${saved.time}`;

      const depEl = document.getElementById('booking-success-deposit');
      if (depEl) depEl.textContent = `$${deposit} Paid ($${balance} Remaining at Studio)`;

      if (window.PMUNotifications) {
        window.PMUNotifications.success(`Reservation ${saved.id} confirmed! Confirmation email dispatched.`, 5000);
      }

      successScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function setupAuthUserPrefill() {
    if (window.PMUStorage && typeof PMUStorage.getCurrentUser === 'function') {
      const user = PMUStorage.getCurrentUser();
      if (user) {
        const nameInput = document.getElementById('client-name');
        const emailInput = document.getElementById('client-email');
        const phoneInput = document.getElementById('client-phone');
        if (nameInput && !nameInput.value) nameInput.value = user.name || '';
        if (emailInput && !emailInput.value) emailInput.value = user.email || '';
        if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
      }
    }
  }

  function setupUrlPreselect() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const artistParam = urlParams.get('artist');

    if (serviceParam) {
      setTimeout(() => {
        const select = document.getElementById('booking-service-select');
        if (select) {
          let option = Array.from(select.options).find(opt => 
            opt.value === serviceParam || opt.value === `srv-${serviceParam}`
          );
          if (option) {
            select.value = option.value;
            select.dispatchEvent(new Event('change'));
          }
        }
      }, 100);
    }

    if (artistParam) {
      setTimeout(() => {
        const select = document.getElementById('booking-artist-select');
        if (select) {
          let option = Array.from(select.options).find(opt => 
            opt.value === artistParam || opt.value === `art-${artistParam}`
          );
          if (option) {
            select.value = option.value;
            select.dispatchEvent(new Event('change'));
          }
        }
      }, 100);
    }
  }

  function updateStepUI() {
    // Keep initial UI synchronized
    updatePricingSummary();
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    bookingData,
    goToStep
  };
})();

window.PMUBooking = PMUBooking;
