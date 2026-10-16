/**
 * AURA PMU STUDIO - GALLERY & LIGHTBOX CONTROLLER
 */

const PMUGallery = (function() {
  let galleryData = [];
  let currentIndex = 0;
  let activeFilter = 'all';

  function init() {
    setupLightbox();
    setupFilters();
  }

  function setupFilters() {
    const filterBtns = document.querySelectorAll('[data-gallery-filter]');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.galleryFilter;
        filterGalleryItems(activeFilter);
      });
    });

    const searchInput = document.getElementById('gallery-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchGalleryItems(query);
      });
    }
  }

  function filterGalleryItems(category) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      const itemCat = item.dataset.category || 'all';
      if (category === 'all' || itemCat === category) {
        item.style.display = 'block';
        item.style.opacity = '1';
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });
  }

  function searchGalleryItems(query) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  function setupLightbox() {
    let lightbox = document.querySelector('.pmu-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'pmu-lightbox';
      lightbox.innerHTML = `
        <button class="pmu-lightbox-close" aria-label="Close Lightbox">&times;</button>
        <button class="pmu-lightbox-nav pmu-lightbox-prev" aria-label="Previous Image"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="pmu-lightbox-nav pmu-lightbox-next" aria-label="Next Image"><i class="fa-solid fa-chevron-right"></i></button>
        <div class="pmu-lightbox-content">
          <img class="pmu-lightbox-img" src="" alt="Gallery Image">
          <div class="pmu-lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const closeBtn = lightbox.querySelector('.pmu-lightbox-close');
    const prevBtn = lightbox.querySelector('.pmu-lightbox-prev');
    const nextBtn = lightbox.querySelector('.pmu-lightbox-next');

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', () => changeImage(-1));
    nextBtn.addEventListener('click', () => changeImage(1));

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') changeImage(-1);
      if (e.key === 'ArrowRight') changeImage(1);
    });

    // Attach click to items
    bindLightboxTriggers();
  }

  function bindLightboxTriggers() {
    const triggers = document.querySelectorAll('[data-lightbox-img]');
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(trigger, index);
      });
    });
  }

  function openLightbox(element, index) {
    const lightbox = document.querySelector('.pmu-lightbox');
    if (!lightbox) return;

    const imgUrl = element.dataset.lightboxImg || element.getAttribute('src');
    const title = element.dataset.lightboxTitle || 'Permanent Makeup Transformation';
    const sub = element.dataset.lightboxSubtitle || '';

    const img = lightbox.querySelector('.pmu-lightbox-img');
    const caption = lightbox.querySelector('.pmu-lightbox-caption');

    img.src = imgUrl;
    caption.innerHTML = `<strong>${title}</strong>${sub ? `<br><small class="text-gold">${sub}</small>` : ''}`;

    currentIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.querySelector('.pmu-lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function changeImage(direction) {
    const triggers = Array.from(document.querySelectorAll('[data-lightbox-img]:not([style*="display: none"])'));
    if (!triggers.length) return;

    currentIndex = (currentIndex + direction + triggers.length) % triggers.length;
    const target = triggers[currentIndex];
    if (target) {
      openLightbox(target, currentIndex);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, bindLightboxTriggers, openLightbox, closeLightbox };
})();

window.PMUGallery = PMUGallery;
