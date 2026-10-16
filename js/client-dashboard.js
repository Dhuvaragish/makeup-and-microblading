/**
 * AURA PMU STUDIO - CLIENT DASHBOARD CONTROLLER
 */

const PMUClientDashboard = (function() {
  function init() {
    renderClientOverview();
    renderClientAppointments();
    renderTreatmentHistory();
    setupHealingChecklist();
  }

  function renderClientOverview() {
    const apts = PMUStorage.getAppointments();
    const confirmedCount = apts.filter(a => a.status === 'Confirmed').length;
    const completedCount = apts.filter(a => a.status === 'Completed').length;

    const confirmedEl = document.getElementById('client-metric-confirmed');
    if (confirmedEl) confirmedEl.textContent = confirmedCount;

    const completedEl = document.getElementById('client-metric-completed');
    if (completedEl) completedEl.textContent = completedCount;

    // Upcoming appointment banner
    const nextApt = apts.find(a => a.status === 'Confirmed');
    const nextBanner = document.getElementById('client-next-appointment-banner');
    if (nextBanner) {
      if (nextApt) {
        nextBanner.innerHTML = `
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span class="pmu-badge pmu-badge-gold mb-2">Upcoming Session</span>
              <h4 class="font-serif mb-1">${nextApt.serviceName}</h4>
              <p class="text-muted small mb-0">
                <i class="fa-regular fa-calendar text-gold me-1"></i> ${nextApt.date} at ${nextApt.time} &nbsp;|&nbsp; 
                <i class="fa-regular fa-user text-gold me-1"></i> Artist: ${nextApt.artistName}
              </p>
            </div>
            <div class="d-flex gap-2">
              <a href="client-appointments.html" class="btn btn-sm btn-pmu-outline">Manage Booking</a>
              <a href="aftercare.html" class="btn btn-sm btn-pmu-gold">Pre-Care Instructions</a>
            </div>
          </div>
        `;
      } else {
        nextBanner.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5 class="font-serif mb-1">No Upcoming Appointments</h5>
              <p class="text-muted small mb-0">Ready for a fresh set or your annual color touch-up?</p>
            </div>
            <a href="booking.html" class="btn btn-pmu-gold btn-sm">Book New Treatment</a>
          </div>
        `;
      }
    }
  }

  function renderClientAppointments() {
    const tableBody = document.getElementById('client-appointments-table-body');
    if (!tableBody) return;

    const apts = PMUStorage.getAppointments();
    if (!apts.length) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No appointments found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = apts.map(a => {
      let badgeClass = 'bg-secondary';
      if (a.status === 'Confirmed') badgeClass = 'pmu-badge-gold';
      else if (a.status === 'Completed') badgeClass = 'pmu-badge-success';
      else if (a.status === 'Cancelled') badgeClass = 'pmu-badge-rose';

      return `
        <tr>
          <td><strong>${a.id}</strong></td>
          <td>
            <div class="fw-semibold">${a.serviceName}</div>
            <small class="text-muted">Total: $${a.totalPrice} (Deposit: $${a.depositPaid || 0})</small>
          </td>
          <td>${a.artistName}</td>
          <td>
            <div>${a.date}</div>
            <small class="text-muted">${a.time}</small>
          </td>
          <td><span class="pmu-badge ${badgeClass}">${a.status}</span></td>
          <td>
            <div class="d-flex gap-2">
              ${a.status === 'Confirmed' ? `
                <button class="btn btn-sm btn-outline-danger" onclick="PMUClientDashboard.cancelBooking('${a.id}')" title="Cancel Appointment">
                  <i class="fa-solid fa-ban"></i>
                </button>
              ` : ''}
              <button class="btn btn-sm btn-outline-secondary" onclick="PMUClientDashboard.viewSlip('${a.id}')" title="View Booking Slip">
                <i class="fa-solid fa-receipt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderTreatmentHistory() {
    const container = document.getElementById('client-treatment-history-list');
    if (!container) return;

    const apts = PMUStorage.getAppointments().filter(a => a.status === 'Completed' || a.pigmentRecord);
    if (!apts.length) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No clinical records found.</div>`;
      return;
    }

    container.innerHTML = apts.map(a => `
      <div class="pmu-card mb-4 p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <span class="pmu-badge pmu-badge-gold mb-2">Record ID: ${a.id}</span>
            <h5 class="font-serif mb-1">${a.serviceName}</h5>
            <small class="text-muted">Administered on ${a.date} by Master ${a.artistName}</small>
          </div>
          <span class="pmu-badge pmu-badge-success"><i class="fa-solid fa-check"></i> Verified Clinical Log</span>
        </div>
        <div class="row g-3 bg-subtle p-3 rounded-3 mb-3">
          <div class="col-md-6">
            <small class="text-muted d-block">Pigment Formulation & Brand</small>
            <strong class="text-main">${a.pigmentRecord || 'Custom Organic Blend'}</strong>
          </div>
          <div class="col-md-6">
            <small class="text-muted d-block">Needle Cartridge & Depth</small>
            <strong class="text-main">${a.needleType || 'Nano 0.18mm Single Cartridge (Depth 0.3mm)'}</strong>
          </div>
          <div class="col-12">
            <small class="text-muted d-block">Artist Clinical Notes</small>
            <p class="text-muted small mb-0">${a.notes || 'Normal skin retention. Symmetrical arch contours achieved.'}</p>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="small text-muted"><i class="fa-solid fa-shield-halved text-gold"></i> HIPAA & Studio Privacy Protected</span>
          <a href="aftercare.html" class="btn btn-sm btn-pmu-outline">View Healing Protocol</a>
        </div>
      </div>
    `).join('');
  }

  function cancelBooking(id) {
    if (confirm(`Are you sure you want to cancel appointment ${id}? Free cancellation applies up to 48h prior to session.`)) {
      PMUStorage.updateAppointmentStatus(id, 'Cancelled');
      if (window.PMUNotifications) {
        window.PMUNotifications.info(`Appointment ${id} has been cancelled.`);
      }
      renderClientOverview();
      renderClientAppointments();
    }
  }

  function viewSlip(id) {
    const apt = PMUStorage.getAppointmentById(id);
    if (!apt) return;
    alert(`AURA PMU STUDIO BOOKING SLIP\n------------------------------\nRef: ${apt.id}\nClient: ${apt.clientName}\nService: ${apt.serviceName}\nArtist: ${apt.artistName}\nDate: ${apt.date} at ${apt.time}\nDeposit Paid: $${apt.depositPaid || 0}\nStatus: ${apt.status}\n------------------------------\nPlease bring a government photo ID.`);
  }

  function setupHealingChecklist() {
    const checkboxes = document.querySelectorAll('.healing-task-check');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(checkboxes).filter(c => c.checked).length;
        const total = checkboxes.length;
        const progressEl = document.getElementById('daily-care-progress');
        if (progressEl) {
          const percent = Math.round((checked / total) * 100);
          progressEl.style.width = percent + '%';
          progressEl.textContent = percent + '%';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, cancelBooking, viewSlip };
})();

window.PMUClientDashboard = PMUClientDashboard;
