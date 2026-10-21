/**
 * VELOURA PMU & BROW STUDIO - STORAGE MANAGER
 * Handles localStorage persistence and data layer initialization
 */

const PMUStorage = (function() {
  const KEYS = {
    SERVICES: 'pmu_services',
    ARTISTS: 'pmu_artists',
    GALLERY: 'pmu_gallery',
    APPOINTMENTS: 'pmu_appointments',
    ENQUIRIES: 'pmu_enquiries',
    SETTINGS: 'pmu_settings',
    AUTH_USER: 'pmu_auth_user'
  };
  const DATA_VERSION = 'v2.0-veloura';

  const DEFAULT_SERVICES = [
    {
      id: "srv-microblading",
      slug: "microblading",
      name: "Signature Microblading",
      category: "brows",
      price: 550,
      touchUpPrice: 150,
      duration: "120 mins",
      painLevel: "Minimal (1/5 with topical numbing)",
      healingTime: "10-14 days (Full color 4-6 weeks)",
      retention: "12-18 months",
      shortDescription: "Hyper-realistic, hand-drawn hair strokes designed to mimic natural eyebrow hairs for fuller, seamless arches.",
      benefits: ["Natural 3D hair-like stroke effect", "Custom Golden Ratio brow mapping", "Ideal for normal to dry skin types"],
      image: "assets/images/brows/microblading.jpg",
      popular: true
    },
    {
      id: "srv-powder-brows",
      slug: "powder-brows",
      name: "Ombré Powder Brows",
      category: "brows",
      price: 580,
      touchUpPrice: 160,
      duration: "150 mins",
      painLevel: "Minimal (1/5)",
      healingTime: "7-10 days",
      retention: "2-3 years",
      shortDescription: "Soft powdery makeup finish featuring lighter ombre bulb fronts fading into defined, velvety tails.",
      benefits: ["Soft misty powdered finish", "Superior retention for oily or large-pore skin", "Lasts up to 3 years"],
      image: "assets/images/brows/powder-brows.jpg",
      popular: true
    },
    {
      id: "srv-combo-brows",
      slug: "combo-brows",
      name: "Combination Hybrid Brows",
      category: "brows",
      price: 650,
      touchUpPrice: 180,
      duration: "165 mins",
      painLevel: "Minimal (1-2/5)",
      healingTime: "10-14 days",
      retention: "18-24 months",
      shortDescription: "The ultimate transformation combining hair strokes at the head with soft powder shading through the tail.",
      benefits: ["Combines realistic hair strokes + 3D depth", "Great for sparse or patchy brows", "Suitable for all skin types"],
      image: "assets/images/brows/combo-brows.jpg",
      popular: true
    },
    {
      id: "srv-nano-brows",
      slug: "nano-brows",
      name: "Digital Nano Hairstrokes",
      category: "brows",
      price: 720,
      touchUpPrice: 200,
      duration: "180 mins",
      painLevel: "Ultra Low (0.5/5)",
      healingTime: "7-10 days",
      retention: "2-3 years",
      shortDescription: "High-precision single acupuncture needle hair strokes made with medical digital device. Zero skin slicing.",
      benefits: ["Non-cutting digital technique", "Exceptional on oily/mature skin", "Zero scar tissue risk"],
      image: "assets/images/brows/nano-brows.jpg",
      popular: false
    },
    {
      id: "srv-lip-blush",
      slug: "lip-blush",
      name: "Velvet Lip Blush & Tint",
      category: "lips",
      price: 600,
      touchUpPrice: 175,
      duration: "150 mins",
      painLevel: "Low-Moderate (2/5)",
      healingTime: "5-7 days",
      retention: "2-4 years",
      shortDescription: "Translucent mineral wash that restores natural borders, balances lip symmetry, and provides a healthy flush.",
      benefits: ["Restores natural lip shape", "Enhances symmetry & volume illusion", "Custom shade range"],
      image: "assets/images/lips/lip-blush-1.jpg",
      popular: true
    },
    {
      id: "srv-lip-neutralization",
      slug: "lip-neutralization",
      name: "Dark Lip Color Neutralization",
      category: "lips",
      price: 650,
      touchUpPrice: 180,
      duration: "150 mins",
      painLevel: "Low-Moderate (2/5)",
      healingTime: "5-7 days",
      retention: "2-3 years",
      shortDescription: "Specialized color corrective treatment neutralizing cool, dark, or hyper-pigmented tones before depositing target color.",
      benefits: ["Engineered for melanin-rich lips", "Cancels cool blue/purple undertones", "Even, warm balanced tone"],
      image: "assets/images/lips/lip-neutralize.jpg",
      popular: false
    },
    {
      id: "srv-brow-correction",
      slug: "brow-correction",
      name: "Old PMU Brow Color Correction",
      category: ["brows", "touch-up"],
      price: 500,
      touchUpPrice: 150,
      duration: "120 mins",
      painLevel: "Minimal (1/5)",
      healingTime: "10-14 days",
      retention: "18-24 months",
      shortDescription: "Color shift neutralization for outdated tattoo brows that have turned blue, red, pink, or gray over time.",
      benefits: ["Neutralizes orange/grey/blue hues", "Re-establishes clean symmetry", "Safe organic pigments"],
      image: "assets/images/brows/brow-correction.jpg",
      popular: false
    },
    {
      id: "srv-annual-touchup",
      slug: "annual-touchup",
      name: "Annual Color Boost & Touch-Up",
      category: "touch-up",
      price: 280,
      touchUpPrice: 120,
      duration: "90 mins",
      painLevel: "Minimal (1/5)",
      healingTime: "5-7 days",
      retention: "12-18 months",
      shortDescription: "Recommended 12-18 month color boost for existing studio clients to refresh pigment vibrancy and crisp outlines.",
      benefits: ["Maintains flawless pigment intensity", "Refines shape changes", "Cost-effective maintenance"],
      image: "assets/images/brows/annual-touchup.jpg",
      popular: true
    },
    {
      id: "srv-duo-package",
      slug: "duo-package",
      name: "Signature Brow & Lip Atelier Duo",
      category: ["brows", "lips", "touch-up"],
      price: 1050,
      touchUpPrice: 280,
      duration: "240 mins",
      painLevel: "Minimal (1-2/5)",
      healingTime: "7-10 days",
      retention: "2-4 years",
      shortDescription: "The ultimate harmonized transformation pairing our Signature Brows with a lush Velvet Lip Blush for total facial balance.",
      benefits: ["Complete brow & lip harmony", "Exclusive $150 package savings", "Golden Ratio symmetry mapping"],
      image: "assets/images/brows/duo-package.jpg",
      popular: true
    }
  ];

  // Seed default data if empty or updated
  async function init() {
    try {
      if (localStorage.getItem('pmu_data_version') !== DATA_VERSION) {
        localStorage.removeItem(KEYS.SERVICES);
        localStorage.removeItem(KEYS.ARTISTS);
        localStorage.removeItem(KEYS.GALLERY);
        localStorage.removeItem(KEYS.SETTINGS);
        localStorage.setItem('pmu_data_version', DATA_VERSION);
      }

      if (!localStorage.getItem(KEYS.SERVICES)) {
        try {
          const res = await fetch('data/services.json');
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem(KEYS.SERVICES, JSON.stringify(data));
          } else {
            localStorage.setItem(KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
          }
        } catch (e) {
          localStorage.setItem(KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
        }
      }

      if (!localStorage.getItem(KEYS.ARTISTS)) {
        const res = await fetch('data/artists.json');
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(KEYS.ARTISTS, JSON.stringify(data));
        }
      }

      if (!localStorage.getItem(KEYS.GALLERY)) {
        const res = await fetch('data/gallery.json');
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(KEYS.GALLERY, JSON.stringify(data));
        }
      }

      if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
        const res = await fetch('data/demo-appointments.json');
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(data));
        }
      }

      if (!localStorage.getItem(KEYS.SETTINGS)) {
        const defaultSettings = {
          studioName: "VELOURA Permanent Makeup & Brow Studio",
          phone: "+1 (555) 234-7890",
          email: "concierge@velourastudio.com",
          address: "740 Madison Avenue, 4th Floor, New York, NY 10065",
          currency: "$",
          depositPercentage: 25,
          openingHours: "Mon-Sat: 9:00 AM - 7:00 PM | Sun: 10:00 AM - 5:00 PM",
          allowWeekendBookings: true
        };
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
      }

      if (!localStorage.getItem(KEYS.ENQUIRIES)) {
        const demoEnquiries = [
          {
            id: "ENQ-101",
            name: "Genevieve Ross",
            email: "genevieve@example.com",
            phone: "+1 (555) 890-1234",
            service: "Signature Microblading",
            message: "I had microblading done 4 years ago elsewhere and it's quite faint now. Can I book directly or do I need a consultation?",
            date: "2026-10-10",
            status: "Unread"
          },
          {
            id: "ENQ-102",
            name: "Marcus Vance",
            email: "m.vance@example.com",
            phone: "+1 (555) 678-4321",
            service: "Velvet Lip Blush",
            message: "Looking to buy a gift consultation package for my fiancé's birthday. How does voucher delivery work?",
            date: "2026-10-09",
            status: "Replied"
          }
        ];
        localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(demoEnquiries));
      }
    } catch (e) {
      console.warn("Storage init fetch fallback:", e);
    }
  }

  // Auto initialize on load
  init();

  return {
    init,
    // Services
    getServices: function() {
      const data = localStorage.getItem(KEYS.SERVICES);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
      return DEFAULT_SERVICES;
    },
    getServiceById: function(id) {
      return this.getServices().find(s => s.id === id || s.slug === id);
    },
    saveServices: function(services) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
    },

    // Artists
    getArtists: function() {
      const data = localStorage.getItem(KEYS.ARTISTS);
      return data ? JSON.parse(data) : [];
    },
    getArtistById: function(id) {
      return this.getArtists().find(a => a.id === id);
    },
    saveArtists: function(artists) {
      localStorage.setItem(KEYS.ARTISTS, JSON.stringify(artists));
    },

    // Gallery
    getGallery: function() {
      const data = localStorage.getItem(KEYS.GALLERY);
      return data ? JSON.parse(data) : [];
    },
    addGalleryItem: function(item) {
      const items = this.getGallery();
      item.id = "gal-" + (items.length + 1);
      items.unshift(item);
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
      return item;
    },

    // Appointments
    getAppointments: function() {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    },
    getAppointmentById: function(id) {
      return this.getAppointments().find(a => a.id === id);
    },
    createAppointment: function(apt) {
      const list = this.getAppointments();
      if (!apt.id) {
        apt.id = "APT-" + Math.floor(1000 + Math.random() * 9000);
      }
      list.unshift(apt);
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
      return apt;
    },
    updateAppointmentStatus: function(id, newStatus) {
      const list = this.getAppointments();
      const index = list.findIndex(a => a.id === id);
      if (index !== -1) {
        list[index].status = newStatus;
        localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
        return list[index];
      }
      return null;
    },
    deleteAppointment: function(id) {
      const list = this.getAppointments().filter(a => a.id !== id);
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
    },

    // Enquiries
    getEnquiries: function() {
      const data = localStorage.getItem(KEYS.ENQUIRIES);
      return data ? JSON.parse(data) : [];
    },
    createEnquiry: function(enq) {
      const list = this.getEnquiries();
      enq.id = "ENQ-" + Math.floor(100 + Math.random() * 900);
      enq.date = new Date().toISOString().split('T')[0];
      enq.status = "Unread";
      list.unshift(enq);
      localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(list));
      return enq;
    },
    updateEnquiryStatus: function(id, status) {
      const list = this.getEnquiries();
      const index = list.findIndex(e => e.id === id);
      if (index !== -1) {
        list[index].status = status;
        localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(list));
        return list[index];
      }
      return null;
    },

    // Settings
    getSettings: function() {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    },
    saveSettings: function(settings) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    },

    // Auth state
    getCurrentUser: function() {
      const data = localStorage.getItem(KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    },
    setCurrentUser: function(user) {
      if (user) {
        localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(KEYS.AUTH_USER);
      }
    }
  };
})();

// Export globally
window.PMUStorage = PMUStorage;
