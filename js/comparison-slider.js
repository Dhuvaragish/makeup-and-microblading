/**
 * AURA PMU STUDIO - BEFORE & AFTER COMPARISON SLIDER
 * Supports pointer events (mouse, touch, pen), drag, click, keyboard accessibility, and dynamic resizing
 * Guarantees 100% independence across multiple slider instances
 */

const PMUComparisonSlider = (function() {
  function init() {
    const sliders = document.querySelectorAll('.comparison-slider');
    sliders.forEach(slider => setupSlider(slider));
  }

  function setupSlider(slider) {
    if (slider.dataset.sliderInitialized) return;
    slider.dataset.sliderInitialized = 'true';

    const beforeWrapper = slider.querySelector('.img-before-wrapper');
    const handle = slider.querySelector('.comparison-handle');
    if (!beforeWrapper || !handle) return;

    const beforeImg = beforeWrapper.querySelector('img');
    const labelBefore = slider.querySelector('.slider-label-before');
    const labelAfter = slider.querySelector('.slider-label-after');

    let isDragging = false;

    // Keep before image width exactly synchronized with the slider container width
    function syncImageWidth() {
      if (beforeImg) {
        const w = slider.getBoundingClientRect().width;
        if (w > 0) {
          beforeImg.style.width = w + 'px';
          beforeImg.style.minWidth = w + 'px';
          beforeImg.style.maxWidth = 'none';
          beforeImg.style.height = '100%';
          beforeImg.style.objectFit = 'cover';
        }
      }
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => syncImageWidth());
      ro.observe(slider);
    }
    window.addEventListener('resize', syncImageWidth);
    if (beforeImg) {
      if (beforeImg.complete) {
        syncImageWidth();
      } else {
        beforeImg.addEventListener('load', syncImageWidth);
      }
    }

    function getPercentage(e) {
      const rect = slider.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      let pos = clientX - rect.left;
      let percent = (pos / rect.width) * 100;

      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      return percent;
    }

    function setPosition(percent) {
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      // Ensure boundary and handle stay 100% physically synchronized
      beforeWrapper.style.width = percent + '%';
      handle.style.left = percent + '%';

      handle.setAttribute('aria-valuenow', Math.round(percent));

      // Dynamic label synchronization: gracefully adjust opacity near edges so labels don't clash with handle
      if (labelBefore) {
        if (percent < 18) {
          labelBefore.style.opacity = (percent / 18).toFixed(2);
        } else {
          labelBefore.style.opacity = '1';
        }
      }

      if (labelAfter) {
        if (percent > 80) {
          labelAfter.style.opacity = ((100 - percent) / 20).toFixed(2);
        } else {
          labelAfter.style.opacity = '1';
        }
      }

      syncImageWidth();
    }

    // Default 50%
    setPosition(50);

    // Modern Pointer Events (Unified Mouse, Touch, Stylus with Pointer Capture)
    if (window.PointerEvent) {
      slider.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        isDragging = true;
        try {
          slider.setPointerCapture(e.pointerId);
        } catch (err) {}
        setPosition(getPercentage(e));
        slider.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
      });

      slider.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        setPosition(getPercentage(e));
      });

      const onPointerEnd = (e) => {
        if (isDragging) {
          isDragging = false;
          try {
            if (slider.hasPointerCapture(e.pointerId)) {
              slider.releasePointerCapture(e.pointerId);
            }
          } catch (err) {}
          slider.style.cursor = '';
          document.body.style.userSelect = '';
        }
      };

      slider.addEventListener('pointerup', onPointerEnd);
      slider.addEventListener('pointercancel', onPointerEnd);
    } else {
      // Fallback Mouse events
      slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        setPosition(getPercentage(e));
        slider.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setPosition(getPercentage(e));
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          slider.style.cursor = '';
          document.body.style.userSelect = '';
        }
      });

      // Fallback Touch events
      slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        setPosition(getPercentage(e));
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        setPosition(getPercentage(e));
      }, { passive: true });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });

      window.addEventListener('touchcancel', () => {
        isDragging = false;
      });
    }

    // Keyboard accessibility on handle
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    if (!handle.getAttribute('aria-label')) {
      handle.setAttribute('aria-label', 'Before and healed after comparison slider');
    }
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', '50');

    handle.addEventListener('keydown', (e) => {
      const currentPercent = parseFloat(beforeWrapper.style.width) || 50;
      if (e.key === 'ArrowLeft') {
        setPosition(Math.max(0, currentPercent - 5));
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        setPosition(Math.min(100, currentPercent + 5));
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPosition(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPosition(100);
        e.preventDefault();
      }
    });

    // Attach instance methods to element for external controllers
    slider._pmuSlider = {
      setPosition,
      syncImageWidth
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, setupSlider };
})();

window.PMUComparisonSlider = PMUComparisonSlider;
