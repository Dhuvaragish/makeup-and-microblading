/**
 * AURA PMU STUDIO - ADMIN DASHBOARD CONTROLLER
 */

const PMUAdminDashboard = (function() {
  function init() {
    renderAdminKPIs();
    renderAppointmentsTable();
    renderClientsTable();
    renderArtistsTable();
    renderServicesTable();
    renderEnquiriesTable();
    setupAdminForms();
  }

  function renderAdminKPIs() {
    const apts = PMUStorage.getAppointments();
    const confirmed = apts.filter(a => a.status === 'Confirmed').length;
    const completed = apts.filter(a => a.status === 'Completed').length;
    const totalRev = apts.reduce((sum, a) => sum + (a.totalPrice || 0), 0);

    const revEl = document.getElementById('admin-kpi-revenue');
    if (revEl) revEl.textContent = `$${totalRev.toLocaleString()}`;

    const totalAptEl = document.getElementById('admin-kpi-appointments');
    if (totalAptEl) totalAptEl.textContent = apts.length;

    const confirmedEl = document.getElementById('admin-kpi-confirmed');
    if (confirmedEl) confirmedEl.textContent = confirmed;

    const clientsEl = document.getElementById('admin-kpi-clients');
    if (clientsEl) clientsEl.textContent = 142 + apts.length;
  }

  function renderAppointmentsTable() {
    const tbody = document.getElementById('admin-appointments-tbody');
    if (!tbody) return;

    const filterStatus = document.getElementById('admin-filter-status') ? document.getElementById('admin-filter-status').value : 'all';
    const searchQuery = document.getElementById('admin-search-appointments') ? document.getElementById('admin-search-appointments').value.toLowerCase().trim() : '';

    let apts = PMUStorage.getAppointments();

    if (filterStatus !== 'all') {
      apts = apts.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery) {
      apts = apts.filter(a => 
        a.clientName.toLowerCase().includes(searchQuery) ||
        a.serviceName.toLowerCase().includes(searchQuery) ||
        a.id.toLowerCase().includes(searchQuery)
      );
    }

    if (!apts.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No appointments found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = apts.map(a => {
      let badgeClass = 'bg-secondary';
      if (a.status === 'Confirmed') badgeClass = 'pmu-badge-gold';
      else if (a.status === 'Completed') badgeClass = 'pmu-badge-success';
      else if (a.status === 'Cancelled') badgeClass = 'pmu-badge-rose';

      return `
        <tr>
          <td><span class="fw-bold">${a.id}</span></td>
          <td>
            <div class="fw-semibold">${a.clientName}</div>
            <small class="text-muted">${a.clientPhone || a.clientEmail}</small>
          </td>
          <td>${a.serviceName}</td>
          <td>${a.artistName}</td>
          <td>
            <div>${a.date}</div>
            <small class="text-muted">${a.time}</small>
          </td>
          <td>
            <span class="pmu-badge ${badgeClass}">${a.status}</span>
          </td>
          <td>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Actions
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" onclick="PMUAdminDashboard.setStatus('${a.id}', 'Confirmed'); return false;"><i class="fa-solid fa-check text-warning"></i> Set Confirmed</a></li>
                <li><a class="dropdown-item" href="#" onclick="PMUAdminDashboard.setStatus('${a.id}', 'Completed'); return false;"><i class="fa-solid fa-circle-check text-success"></i> Set Completed</a></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="PMUAdminDashboard.setStatus('${a.id}', 'Cancelled'); return false;"><i class="fa-solid fa-ban"></i> Set Cancelled</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="PMUAdminDashboard.deleteApt('${a.id}'); return false;"><i class="fa-solid fa-trash"></i> Delete</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function setStatus(id, newStatus) {
    PMUStorage.updateAppointmentStatus(id, newStatus);
    if (window.PMUNotifications) {
      window.PMUNotifications.success(`Appointment ${id} status updated to ${newStatus}.`);
    }
    renderAdminKPIs();
    renderAppointmentsTable();
  }

  function deleteApt(id) {
    if (confirm(`Permanently delete appointment ${id}?`)) {
      PMUStorage.deleteAppointment(id);
      if (window.PMUNotifications) {
        window.PMUNotifications.info(`Appointment ${id} deleted.`);
      }
      renderAdminKPIs();
      renderAppointmentsTable();
    }
  }

  function renderClientsTable() {
    const tbody = document.getElementById('admin-clients-tbody');
    if (!tbody) return;

    const apts = PMUStorage.getAppointments();
    const clientsMap = {};

    apts.forEach(a => {
      if (!clientsMap[a.clientEmail]) {
        clientsMap[a.clientEmail] = {
          name: a.clientName,
          email: a.clientEmail,
          phone: a.clientPhone || '+1 (555) 234-5678',
          sessions: 0,
          totalSpend: 0,
          lastVisit: a.date
        };
      }
      clientsMap[a.clientEmail].sessions++;
      clientsMap[a.clientEmail].totalSpend += (a.totalPrice || 0);
    });

    const list = Object.values(clientsMap);

    tbody.innerHTML = list.map(c => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="rounded-circle bg-gold text-dark d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; font-weight: 700;">
              ${c.name.charAt(0)}
            </div>
            <div>
              <div class="fw-semibold">${c.name}</div>
              <small class="text-muted">${c.email}</small>
            </div>
          </div>
        </td>
        <td>${c.phone}</td>
        <td><span class="badge bg-light text-dark">${c.sessions} Treatments</span></td>
        <td><strong class="text-gold">$${c.totalSpend}</strong></td>
        <td>${c.lastVisit}</td>
        <td>
          <button class="btn btn-sm btn-pmu-outline" onclick="alert('Viewing client clinical chart for: ${c.name}');">
            <i class="fa-regular fa-folder-open"></i> Clinical File
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderArtistsTable() {
    const tbody = document.getElementById('admin-artists-tbody');
    if (!tbody) return;

    const artists = PMUStorage.getArtists();
    tbody.innerHTML = artists.map(a => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${a.image}" alt="${a.name}" class="rounded-circle" style="width: 44px; height: 44px; object-fit: cover;">
            <div>
              <div class="fw-semibold">${a.name}</div>
              <small class="text-muted">${a.role}</small>
            </div>
          </div>
        </td>
        <td>${a.specialties.slice(0, 2).join(', ')}</td>
        <td><span class="pmu-stars small"><i class="fa-solid fa-star"></i> ${a.rating} (${a.reviewCount})</span></td>
        <td>${a.experience}</td>
        <td><span class="pmu-badge pmu-badge-success">Active & Bookable</span></td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" onclick="alert('Editing schedule for Master ${a.name}');">
            <i class="fa-solid fa-pen-to-square"></i> Schedule
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderServicesTable() {
    const tbody = document.getElementById('admin-services-tbody');
    if (!tbody) return;

    const services = PMUStorage.getServices();
    tbody.innerHTML = services.map(s => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${s.image}" alt="${s.name}" class="rounded" style="width: 44px; height: 44px; object-fit: cover;">
            <div>
              <div class="fw-semibold">${s.name}</div>
              <small class="text-muted">${s.category.toUpperCase()}</small>
            </div>
          </div>
        </td>
        <td><strong class="text-gold">$${s.price}</strong></td>
        <td>$${s.touchUpPrice}</td>
        <td>${s.duration}</td>
        <td>${s.retention}</td>
        <td><span class="pmu-badge pmu-badge-success">Live on Site</span></td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" onclick="alert('Edit service pricing dialog: ${s.name}');">
            <i class="fa-solid fa-sliders"></i> Edit
          </button>
        </td>
      </tr>
    `).join('');
  }

  function renderEnquiriesTable() {
    const tbody = document.getElementById('admin-enquiries-tbody');
    if (!tbody) return;

    const enqs = PMUStorage.getEnquiries();
    tbody.innerHTML = enqs.map(e => `
      <tr>
        <td><strong>${e.id}</strong></td>
        <td>
          <div class="fw-semibold">${e.name}</div>
          <small class="text-muted">${e.email} • ${e.phone}</small>
        </td>
        <td><span class="badge bg-light text-dark">${e.service}</span></td>
        <td><div class="text-truncate" style="max-width: 250px;">${e.message}</div></td>
        <td>${e.date}</td>
        <td><span class="pmu-badge ${e.status === 'Unread' ? 'pmu-badge-warning' : 'pmu-badge-success'}">${e.status}</span></td>
        <td>
          <button class="btn btn-sm btn-pmu-outline" onclick="PMUAdminDashboard.replyEnquiry('${e.id}')">
            <i class="fa-regular fa-paper-plane"></i> Reply
          </button>
        </td>
      </tr>
    `).join('');
  }

  function replyEnquiry(id) {
    const enq = PMUStorage.getEnquiries().find(e => e.id === id);
    if (!enq) return;
    const reply = prompt(`Reply to ${enq.name} (${enq.email}):\nMessage: "${enq.message}"`, "Dear " + enq.name + ", Thank you for reaching out to Aura Studio! Regarding your enquiry...");
    if (reply) {
      PMUStorage.updateEnquiryStatus(id, 'Replied');
      if (window.PMUNotifications) window.PMUNotifications.success(`Reply sent to ${enq.email}!`);
      renderEnquiriesTable();
    }
  }

  function setupAdminForms() {
    // Add appointment modal submit
    const addAptForm = document.getElementById('admin-add-apt-form');
    if (addAptForm) {
      addAptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const clientName = addAptForm.querySelector('#apt-client-name').value;
        const serviceName = addAptForm.querySelector('#apt-service').value;
        const artistName = addAptForm.querySelector('#apt-artist').value;
        const date = addAptForm.querySelector('#apt-date').value;
        const time = addAptForm.querySelector('#apt-time').value;

        PMUStorage.createAppointment({
          clientName,
          clientEmail: 'client@example.com',
          clientPhone: '+1 (555) 123-4567',
          serviceName,
          artistName,
          date,
          time,
          status: 'Confirmed',
          totalPrice: 550,
          depositPaid: 150
        });

        if (window.PMUNotifications) window.PMUNotifications.success('Appointment created successfully!');
        const modalEl = document.getElementById('modalAddAppointment');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) modal.hide();
        }
        renderAdminKPIs();
        renderAppointmentsTable();
      });
    }

    // Filter status listener
    const filterSelect = document.getElementById('admin-filter-status');
    if (filterSelect) {
      filterSelect.addEventListener('change', renderAppointmentsTable);
    }

    const searchInput = document.getElementById('admin-search-appointments');
    if (searchInput) {
      searchInput.addEventListener('input', renderAppointmentsTable);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, setStatus, deleteApt, replyEnquiry };
})();

window.PMUAdminDashboard = PMUAdminDashboard;
