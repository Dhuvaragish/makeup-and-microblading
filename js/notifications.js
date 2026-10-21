/**
 * VELOURA PMU & BROW STUDIO - NOTIFICATION & TOAST SYSTEM
 */

const PMUNotifications = (function() {
  let container = null;

  function ensureContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'pmu-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 380px;
        width: calc(100% - 40px);
      `;
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = 4000) {
    const parent = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `pmu-toast pmu-toast-${type}`;
    toast.style.cssText = `
      background: var(--pmu-bg-surface, #ffffff);
      color: var(--pmu-text-main, #1a1b1f);
      border: 1px solid var(--pmu-border, #e5e7eb);
      border-radius: 12px;
      padding: 14px 18px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.92rem;
      font-weight: 500;
      pointer-events: auto;
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    let iconClass = 'fa-circle-info text-info';
    let borderColor = 'var(--pmu-border)';

    if (type === 'success') {
      iconClass = 'fa-circle-check text-success';
      borderColor = 'rgba(16, 185, 129, 0.4)';
    } else if (type === 'error') {
      iconClass = 'fa-circle-exclamation text-danger';
      borderColor = 'rgba(239, 68, 68, 0.4)';
    } else if (type === 'warning') {
      iconClass = 'fa-triangle-exclamation text-warning';
      borderColor = 'rgba(245, 158, 11, 0.4)';
    } else if (type === 'gold') {
      iconClass = 'fa-gem text-gold';
      borderColor = 'rgba(197, 168, 128, 0.6)';
    }

    toast.style.borderColor = borderColor;

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size: 1.25rem;"></i>
      <div style="flex-grow: 1;">${message}</div>
      <button type="button" style="background: none; border: none; color: var(--pmu-text-muted); cursor: pointer; padding: 4px;">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => dismiss(toast));

    parent.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }
  }

  function dismiss(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  return {
    show,
    success: (msg, dur) => show(msg, 'success', dur),
    error: (msg, dur) => show(msg, 'error', dur),
    warning: (msg, dur) => show(msg, 'warning', dur),
    info: (msg, dur) => show(msg, 'info', dur),
    gold: (msg, dur) => show(msg, 'gold', dur)
  };
})();

window.PMUNotifications = PMUNotifications;
