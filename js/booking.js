/**
 * AURA PMU STUDIO - MULTI-STEP BOOKING WIZARD ENGINE
 */

const PMUBooking = (function() {
  let currentStep = 1;
  const bookingData = {
    serviceId: null,
    serviceName: '',
    servicePrice: 0,
    serviceDuration: '',
    artistId: 'any',
    artistName: 'First Available Master Artist',
    date: '',
    time: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    medicalNotes: '',
    contraindicationsClear: false
  };

  function init() {
    renderServicesStep();
    renderArtistsStep();
    setupDatePicker();
    setupTimeSlots();
    setupStepNavigation();
    setupUrlPreselect();
  }

  function setupUrlPreselect() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const artistParam = urlParams.get('artist');

    if (serviceParam) {
      setTimeout(() => {
        const card = document.querySelector(`[data-service-id="${serviceParam}"]`);
        if (card) card.click();
      }, 200);
    }

    if (artistParam) {
      setTimeout(() => {
        const card = document.querySelector(`[data-artist-id="${artistParam}"]`);
        if (card) card.click();
      }, 200);
    }
  }

  function renderServicesStep() {
    const container = document.getElementById('booking-services-list');
    if (!container) return;

    const services = PMUStorage.getServices();
    if (!services.length) return;

    container.innerHTML = services.map(s => `
      <div class="col-md-6 mb-3">
        <div class="selectable-card h-100" data-service-id="${s.id}" data-service-name="${s.name}" data-service-price="${s.price}" data-service-duration="${s.duration}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0 text-main font-serif">${s.name}</h5>
            <span class="pmu-badge pmu-badge-gold">$${s.price}</span>
          </div>
          <p class="text-muted small mb-2">${s.shortDescription}</p>
          <div class="d-flex align-items-center gap-3 small text-muted">
            <span><i class="fa-regular fa-clock text-gold"></i> ${s.duration}</span>
            <span><i class="fa-solid fa-sparkles text-gold"></i> ${s.retention}</span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.selectable-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        bookingData.serviceId = card.dataset.serviceId;
        bookingData.serviceName = card.dataset.serviceName;
        bookingData.servicePrice = parseFloat(card.dataset.servicePrice);
        bookingData.serviceDuration = card.dataset.serviceDuration;
        updateSummaryUI();
      });
    });
  }

  function renderArtistsStep() {
    const container = document.getElementById('booking-artists-list');
    if (!container) return;

    const artists = PMUStorage.getArtists();
    let html = `
      <div class="col-md-6 mb-3">
        <div class="selectable-card selected h-100" data-artist-id="any" data-artist-name="First Available Master Artist">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-circle bg-gold text-dark d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; font-size: 1.25rem;">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <h6 class="mb-1 font-serif">First Available Master</h6>
              <p class="text-muted small mb-0">Fastest appointment booking with any certified specialist</p>
            </div>
          </div>
        </div>
      </div>
    `;

    html += artists.map(a => `
      <div class="col-md-6 mb-3">
        <div class="selectable-card h-100" data-artist-id="${a.id}" data-artist-name="${a.name}">
          <div class="d-flex align-items-center gap-3">
            <img src="${a.image}" alt="${a.name}" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
            <div>
              <h6 class="mb-1 font-serif">${a.name}</h6>
              <p class="text-muted small mb-1">${a.role}</p>
              <div class="pmu-stars small"><i class="fa-solid fa-star"></i> 5.0 (${a.reviewCount} reviews)</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;

    container.querySelectorAll('.selectable-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        bookingData.artistId = card.dataset.artistId;
        bookingData.artistName = card.dataset.artistName;
        updateSummaryUI();
      });
    });
  }

  function setupDatePicker() {
    const dateInput = document.getElementById('booking-date-input');
    if (!dateInput) return;

    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minStr = tomorrow.toISOString().split('T')[0];
    dateInput.min = minStr;
    dateInput.value = minStr;
    bookingData.date = minStr;

    dateInput.addEventListener('change', (e) => {
      bookingData.date = e.target.value;
      updateSummaryUI();
    });
  }

  function setupTimeSlots() {
    const container = document.getElementById('booking-time-slots');
    if (!container) return;

    const slots = [
      "09:30 AM", "11:00 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"
    ];

    container.innerHTML = slots.map((time, idx) => `
      <div class="time-slot-btn ${idx === 1 ? 'selected' : ''}" data-time="${time}">
        ${time}
      </div>
    `).join('');

    bookingData.time = slots[1];

    container.querySelectorAll('.time-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        bookingData.time = btn.dataset.time;
        updateSummaryUI();
      });
    });
  }

  function setupStepNavigation() {
    const nextBtn = document.getElementById('booking-next-btn');
    const prevBtn = document.getElementById('booking-prev-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          if (currentStep < 5) {
            goToStep(currentStep + 1);
          } else {
            finalizeBooking();
          }
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          goToStep(currentStep - 1);
        }
      });
    }

    // Step item direct clicks (if completed)
    document.querySelectorAll('.wizard-step-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetStep = parseInt(item.dataset.step);
        if (targetStep < currentStep) {
          goToStep(targetStep);
        }
      });
    });
  }

  function validateStep(step) {
    if (step === 1) {
      if (!bookingData.serviceId) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please select a treatment service to continue.');
        return false;
      }
    } else if (step === 2) {
      // Artist defaults to any
      return true;
    } else if (step === 3) {
      if (!bookingData.date || !bookingData.time) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please select appointment date and time slot.');
        return false;
      }
    } else if (step === 4) {
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const phoneInput = document.getElementById('client-phone');
      const contraCheckbox = document.getElementById('client-contraindications-check');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please fill in your name, email and phone number.');
        return false;
      }

      if (contraCheckbox && !contraCheckbox.checked) {
        if (window.PMUNotifications) window.PMUNotifications.warning('Please confirm the health & contraindications declaration.');
        return false;
      }

      bookingData.clientName = nameInput.value.trim();
      bookingData.clientEmail = emailInput.value.trim();
      bookingData.clientPhone = phoneInput.value.trim();
      const notes = document.getElementById('client-notes');
      bookingData.medicalNotes = notes ? notes.value.trim() : '';
    }

    return true;
  }

  function goToStep(step) {
    currentStep = step;

    // Update wizard indicators
    document.querySelectorAll('.wizard-step-item').forEach(item => {
      const s = parseInt(item.dataset.step);
      item.classList.remove('active', 'completed');
      if (s === currentStep) item.classList.add('active');
      else if (s < currentStep) item.classList.add('completed');
    });

    // Toggle step panes
    document.querySelectorAll('.booking-step-pane').forEach(pane => {
      const pStep = parseInt(pane.dataset.step);
      pane.classList.toggle('d-none', pStep !== currentStep);
    });

    // Update buttons
    const prevBtn = document.getElementById('booking-prev-btn');
    const nextBtn = document.getElementById('booking-next-btn');

    if (prevBtn) prevBtn.classList.toggle('d-none', currentStep === 1);
    if (nextBtn) {
      if (currentStep === 5) {
        nextBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Confirm & Pay Deposit';
        nextBtn.className = 'btn-pmu-gold btn-pmu-lg';
      } else {
        nextBtn.innerHTML = 'Continue <i class="fa-solid fa-arrow-right"></i>';
        nextBtn.className = 'btn-pmu-gold';
      }
    }

    updateSummaryUI();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  function updateSummaryUI() {
    const summaryCard = document.getElementById('booking-summary-box');
    if (!summaryCard) return;

    const deposit = Math.round(bookingData.servicePrice * 0.25);
    const balance = bookingData.servicePrice - deposit;

    summaryCard.innerHTML = `
      <div class="pmu-card p-4">
        <h5 class="font-serif border-bottom pb-3 mb-3">Booking Summary</h5>
        <div class="mb-3">
          <small class="text-muted d-block">Treatment</small>
          <strong class="text-main">${bookingData.serviceName || 'Not Selected Yet'}</strong>
          ${bookingData.serviceDuration ? `<span class="badge bg-light text-muted ms-1">${bookingData.serviceDuration}</span>` : ''}
        </div>
        <div class="mb-3">
          <small class="text-muted d-block">Master Artist</small>
          <strong class="text-main">${bookingData.artistName}</strong>
        </div>
        <div class="mb-3">
          <small class="text-muted d-block">Date & Time</small>
          <strong class="text-main">${bookingData.date || 'Pick date'} at ${bookingData.time || 'Pick time'}</strong>
        </div>
        <hr class="my-3">
        <div class="d-flex justify-content-between mb-2">
          <span>Treatment Total:</span>
          <strong>$${bookingData.servicePrice || 0}</strong>
        </div>
        <div class="d-flex justify-content-between mb-2 text-gold">
          <span>Deposit Due Today (25%):</span>
          <strong>$${deposit || 0}</strong>
        </div>
        <div class="d-flex justify-content-between text-muted small">
          <span>Remaining at Studio:</span>
          <span>$${balance || 0}</span>
        </div>
      </div>
    `;

    // Also update Step 5 review pane if active
    const reviewBox = document.getElementById('booking-step5-review');
    if (reviewBox) {
      reviewBox.innerHTML = `
        <div class="row g-4">
          <div class="col-md-6">
            <div class="p-3 bg-subtle rounded-3">
              <small class="text-muted">Selected Treatment</small>
              <h5 class="font-serif mb-1">${bookingData.serviceName}</h5>
              <p class="text-muted small mb-0">Duration: ${bookingData.serviceDuration}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-3 bg-subtle rounded-3">
              <small class="text-muted">Specialist</small>
              <h5 class="font-serif mb-1">${bookingData.artistName}</h5>
              <p class="text-muted small mb-0">${bookingData.date} • ${bookingData.time}</p>
            </div>
          </div>
          <div class="col-12">
            <div class="p-3 bg-subtle rounded-3">
              <small class="text-muted">Client Details</small>
              <h6 class="mb-1">${bookingData.clientName} (${bookingData.clientEmail})</h6>
              <p class="text-muted small mb-0">Phone: ${bookingData.clientPhone}</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  function finalizeBooking() {
    const deposit = Math.round(bookingData.servicePrice * 0.25);
    const newAppointment = {
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      clientPhone: bookingData.clientPhone,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      artistId: bookingData.artistId,
      artistName: bookingData.artistName,
      date: bookingData.date,
      time: bookingData.time,
      status: "Confirmed",
      depositPaid: deposit,
      totalPrice: bookingData.servicePrice,
      healingDay: null,
      notes: bookingData.medicalNotes || "Online client self-booking"
    };

    const saved = PMUStorage.createAppointment(newAppointment);

    // Show confirmation modal or success screen
    const wizardWrap = document.getElementById('booking-wizard-wrapper');
    const successScreen = document.getElementById('booking-success-screen');

    if (wizardWrap && successScreen) {
      wizardWrap.classList.add('d-none');
      successScreen.classList.remove('d-none');

      const refEl = document.getElementById('booking-success-ref');
      if (refEl) refEl.textContent = saved.id;

      const dateEl = document.getElementById('booking-success-date');
      if (dateEl) dateEl.textContent = `${saved.date} at ${saved.time}`;

      const srvEl = document.getElementById('booking-success-service');
      if (srvEl) srvEl.textContent = saved.serviceName;

      if (window.PMUNotifications) {
        window.PMUNotifications.success(`Appointment ${saved.id} confirmed! We have emailed you pre-treatment guidelines.`, 5000);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, bookingData, goToStep };
})();

window.PMUBooking = PMUBooking;
