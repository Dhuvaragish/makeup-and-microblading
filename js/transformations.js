/**
 * AURA PMU STUDIO - 6-WEEK TRANSFORMATION CONTROLLER
 * Manages the 6-Week Healed Results section, independent comparison sliders,
 * and the larger comparison modal/lightbox.
 */

const PMUTransformations = (function() {
  const CASES = [
    {
      id: "case-1",
      treatment: "Signature Microblading",
      healedLabel: "6 Weeks Healed",
      title: "Sparse Brows to Defined Featherstrokes",
      description: "Clinical Demonstration Study: Client presented with naturally sparse arches and uneven tail density. Golden ratio mapping restored arch symmetry, followed by ultra-fine 3D microblading strokes for natural, long-lasting definition.",
      beforeImg: "assets/images/before-after/brow-sparse-before.jpg",
      afterImg: "assets/images/before-after/brow-sculpt-after.jpg",
      startingCondition: "Sparse natural arches with irregular tail hair density",
      technique: "Manual 3D Featherstroke (0.18mm Nano U-Blade)",
      pigment: "Tina Davies I Love Ink - Dark Brown & Ash Brown (70/30)",
      artist: "Elena Rostova (PhiBrows Master)",
      healingStage: "6 Weeks Fully Healed (Post 4-Week Touchup)"
    },
    {
      id: "case-2",
      treatment: "3D Featherstroke Microblading",
      healedLabel: "6 Weeks Healed",
      title: "Natural Brow Symmetry & Fullness",
      description: "Clinical Demonstration Study: Refined brow symmetry and density enhancement. Multi-directional microblading strokes seamlessly interweave with natural brow growth for effortless day-to-day fullness.",
      beforeImg: "assets/images/before-after/microblade-pair-before.jpg",
      afterImg: "assets/images/before-after/microblade-pair-after.jpg",
      startingCondition: "Moderate hair count with low, flat arch alignment",
      technique: "Multi-Directional 3D Hair Flow Mapping",
      pigment: "PhiBrows Brown 2 & Golden Brown Blend",
      artist: "Camilla Rossi",
      healingStage: "6 Weeks Fully Healed (True Color Bloom)"
    },
    {
      id: "case-3",
      treatment: "Ombré Powder Brows",
      healedLabel: "6 Weeks Healed",
      title: "Soft Mist Ombré Arch Definition",
      description: "Clinical Demonstration Study: Restored faint blonde arches lost to over-tweezing. Acoustic single-needle pixel shading creates a velvety gradient from airy bulb to crisp tail, healing 30% softer into an airy golden taupe.",
      beforeImg: "assets/images/before-after/annual-touchup-before.jpg",
      afterImg: "assets/images/before-after/annual-touchup-after.jpg",
      startingCondition: "Faint over-tweezed blonde arches lacking tail definition",
      technique: "Acoustic Single-Needle Pixel Shading",
      pigment: "Perma Blend Luxe Taupe & Honey Brown",
      artist: "Maya Lin",
      healingStage: "6 Weeks Fully Healed (Velvety Soft Finish)"
    },
    {
      id: "case-4",
      treatment: "Nano Combination Brows",
      healedLabel: "6 Weeks Healed",
      title: "Delicate Nano Strokes to Soft Arch",
      description: "Clinical Demonstration Study: Precision digital nano hair strokes at the bulb softly transition into feather-light powder shading through the arch and tail, creating dimension without harsh borders.",
      beforeImg: "assets/images/before-after/asian-brow-before.jpg",
      afterImg: "assets/images/before-after/asian-brow-after.jpg",
      startingCondition: "Naturally sparse, fine brow hairs with minimal tail density",
      technique: "Digital Nano Machine Strokes + Mist Stippling",
      pigment: "Tina Davies Ebony & Charcoal Mist Blend",
      artist: "Sofia Vance",
      healingStage: "6 Weeks Fully Healed (Soft Hybrid Bloom)"
    },
    {
      id: "case-5",
      treatment: "Rich Ombré Powder Brows",
      healedLabel: "6 Weeks Healed",
      title: "High-Definition Velvet Powder Brows",
      description: "Clinical Demonstration Study: Specialized ombre powder technique for melanin-rich skin. Warm undertone balancing and deep espresso-ebony pigment ensure long-lasting clarity, smooth healing, and a smudge-proof finish.",
      beforeImg: "assets/images/before-after/black-brow-before.jpg",
      afterImg: "assets/images/before-after/black-brow-after.jpg",
      startingCondition: "Thinning brow tails and uneven arch contours",
      technique: "Graduated Pixel Density Layering",
      pigment: "Perma Blend Luxe Deep Espresso & Warm Ebony Neutralizer",
      artist: "Elena Rostova",
      healingStage: "6 Weeks Fully Healed (Even Rich Pigment Retention)"
    },
    {
      id: "case-6",
      treatment: "Hybrid Combination Brows",
      healedLabel: "6 Weeks Healed",
      title: "Asymmetry Correction & Hybrid Lift",
      description: "Clinical Demonstration Study: Balanced uneven brow heights and sparse tails from past over-tweezing. Golden ratio arch re-alignment pairs crisp frontal hair-strokes with warm dark chocolate tail shading.",
      beforeImg: "assets/images/before-after/latina-brow-before.jpg",
      afterImg: "assets/images/before-after/latina-brow-after.jpg",
      startingCondition: "Noticeable height asymmetry and sparse outer tails",
      technique: "Golden Ratio Mapping + 3D Micro-Stroke Shading",
      pigment: "Swiss Color Dark Warm Chocolate & Bronze",
      artist: "Camilla Rossi",
      healingStage: "6 Weeks Fully Healed (Lifted Balanced Arches)"
    }
  ];

  let currentModalIndex = 0;
  let modalInstance = null;

  function init() {
    setupViewButtons();
    setupModal();
  }

  function setupViewButtons() {
    const buttons = document.querySelectorAll('.btn-view-transformation');
    buttons.forEach((btn) => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const idx = parseInt(this.dataset.transformationIdx, 10);
        openModal(isNaN(idx) ? 0 : idx);
      });
    });
  }

  function setupModal() {
    const modalEl = document.getElementById('transformationModal');
    if (!modalEl) return;

    if (window.bootstrap && window.bootstrap.Modal) {
      modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    }

    modalEl.addEventListener('shown.bs.modal', function() {
      const modalSlider = modalEl.querySelector('#modalSlider');
      if (modalSlider && window.PMUComparisonSlider) {
        window.PMUComparisonSlider.setupSlider(modalSlider);
        if (modalSlider._pmuSlider) {
          modalSlider._pmuSlider.syncImageWidth();
          modalSlider._pmuSlider.setPosition(50);
        }
      }
    });

    // Modal navigation buttons
    const prevBtn = modalEl.querySelector('.btn-modal-prev');
    const nextBtn = modalEl.querySelector('.btn-modal-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        changeModalCase(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        changeModalCase(1);
      });
    }

    // Modal mode switcher (Interactive, Before Only, Healed Only)
    const modeBtns = modalEl.querySelectorAll('.btn-modal-mode');
    modeBtns.forEach((btn) => {
      btn.addEventListener('click', function() {
        modeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const mode = this.dataset.mode;
        const modalSlider = modalEl.querySelector('#modalSlider');
        if (modalSlider && modalSlider._pmuSlider) {
          if (mode === 'before') {
            modalSlider._pmuSlider.setPosition(100);
          } else if (mode === 'after') {
            modalSlider._pmuSlider.setPosition(0);
          } else {
            modalSlider._pmuSlider.setPosition(50);
          }
        }
      });
    });

    // Keyboard support when modal is active
    document.addEventListener('keydown', (e) => {
      if (!modalEl.classList.contains('show')) return;
      if (e.target.classList.contains('comparison-handle')) return; // Let slider handle own arrows

      if (e.key === 'ArrowLeft') {
        changeModalCase(-1);
      } else if (e.key === 'ArrowRight') {
        changeModalCase(1);
      }
    });
  }

  function openModal(index) {
    currentModalIndex = (index + CASES.length) % CASES.length;
    renderModalCase(currentModalIndex);

    const modalEl = document.getElementById('transformationModal');
    if (!modalEl) return;

    if (modalInstance) {
      modalInstance.show();
    } else if (window.bootstrap && window.bootstrap.Modal) {
      modalInstance = new window.bootstrap.Modal(modalEl);
      modalInstance.show();
    } else {
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  function changeModalCase(direction) {
    currentModalIndex = (currentModalIndex + direction + CASES.length) % CASES.length;
    renderModalCase(currentModalIndex);
  }

  function renderModalCase(index) {
    const c = CASES[index];
    if (!c) return;

    const modalEl = document.getElementById('transformationModal');
    if (!modalEl) return;

    const titleEl = modalEl.querySelector('#transformationModalTitle');
    const treatBadge = modalEl.querySelector('#modalTreatmentBadge');
    const healedBadge = modalEl.querySelector('#modalHealedBadge');
    const headingEl = modalEl.querySelector('#modalCaseHeading');
    const descEl = modalEl.querySelector('#modalCaseDesc');
    const startEl = modalEl.querySelector('#modalSpecStarting');
    const techEl = modalEl.querySelector('#modalSpecTechnique');
    const pigEl = modalEl.querySelector('#modalSpecPigment');
    const healEl = modalEl.querySelector('#modalSpecHealing');
    const artistEl = modalEl.querySelector('#modalSpecArtist');
    const counterEl = modalEl.querySelector('#modalCaseCounter');

    const imgBefore = modalEl.querySelector('#modalImgBefore');
    const imgAfter = modalEl.querySelector('#modalImgAfter');

    if (titleEl) titleEl.textContent = `${c.treatment} — 6-Week Healed Case`;
    if (treatBadge) treatBadge.textContent = c.treatment;
    if (healedBadge) healedBadge.innerHTML = `<i class="fa-solid fa-check-circle me-1"></i>${c.healedLabel}`;
    if (headingEl) headingEl.textContent = c.title;
    if (descEl) descEl.textContent = c.description;
    if (startEl) startEl.textContent = c.startingCondition;
    if (techEl) techEl.textContent = c.technique;
    if (pigEl) pigEl.textContent = c.pigment;
    if (healEl) healEl.textContent = c.healingStage;
    if (artistEl) artistEl.textContent = c.artist;
    if (counterEl) counterEl.textContent = `Case ${index + 1} of ${CASES.length}`;

    if (imgBefore) {
      imgBefore.src = c.beforeImg;
      imgBefore.alt = `Before treatment - ${c.title}`;
    }
    if (imgAfter) {
      imgAfter.src = c.afterImg;
      imgAfter.alt = `Healed 6 weeks after - ${c.title}`;
    }

    // Reset mode buttons to slider mode
    const modeBtns = modalEl.querySelectorAll('.btn-modal-mode');
    modeBtns.forEach(btn => {
      if (btn.dataset.mode === 'slider') btn.classList.add('active');
      else btn.classList.remove('active');
    });

    const modalSlider = modalEl.querySelector('#modalSlider');
    if (modalSlider && modalSlider._pmuSlider) {
      modalSlider._pmuSlider.syncImageWidth();
      modalSlider._pmuSlider.setPosition(50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, openModal, getCases: () => CASES };
})();

window.PMUTransformations = PMUTransformations;
