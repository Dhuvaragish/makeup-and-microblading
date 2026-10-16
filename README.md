# AURA – Luxury Permanent Makeup & Microblading Studio HTML Template

[![Template Version](https://img.shields.io/badge/version-1.0.0-gold.svg)](#)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Utilities-38bdf8.svg)](#)
[![RTL & LTR](https://img.shields.io/badge/RTL%20%26%20LTR-Supported-success.svg)](#)
[![Dark Mode](https://img.shields.io/badge/Dark%20Mode-Supported-black.svg)](#)

A luxury, multipurpose HTML5 template designed for Permanent Makeup (PMU), Microblading, Ombré Powder Brows, Digital Nano Brows, Velvet Lip Blush, and Aesthetic Cosmetic Tattooing Studios. Perfect for selling on ThemeForest, TemplateMonster, or deploying for high-end beauty aesthetics clients.

---

## 🌟 Key Features

### 1. 24 Distinct Fully Crafted HTML Pages
- **3 Unique Home Page Variations**:
  - `index.html` – Modern Luxury Beauty Studio Landing Page (editorial luxury aesthetic, split hero, trust badges, feature pillars, before-after slider).
  - `home-2.html` – Microblading & Eyebrow Transformation Landing Page (interactive face shape harmony selector, 3D stroke comparisons, technique matrix).
  - `home-3.html` – Velvet Lip Blush & Permanent Makeup Landing Page (interactive lip pigment shade swatch selector, 30-day lip healing timeline, dark lip neutralization).
- **Core Studio Pages**:
  - `about.html` – Founder story, hospital-grade sterilization & autoclave protocols, certifications, clinic photography tour.
  - `services.html` – Filterable service catalog with pricing cards and FAQ accordions.
  - `service-details.html` – Deep treatment procedure breakdown, benefits, pre-care checklist, step-by-step roadmap, and dynamic booking card.
  - `artists.html` – Master artists team catalog, credentials, specialties, and ratings.
  - `artist-details.html` – Individual artist dossier, philosophy, schedule, and portfolio.
  - `gallery.html` – Filterable before-and-after transformation gallery with interactive comparison sliders and lightbox modal.
  - `booking.html` – Interactive 5-step appointment booking engine (Service &rarr; Artist &rarr; Date/Time &rarr; Health contraindications &rarr; Confirmation with printable slip).
  - `consultation.html` – Virtual photo consultation intake with skin profile analysis and photo upload guidelines.
  - `aftercare.html` – Day-by-day healing roadmap for brows & lips, dos/don'ts, and interactive touch-up window calculator.
  - `contact.html` – Studio location, subway/parking transit guide, opening hours, contact form with persistence, and WhatsApp button.
- **Authentication Pages**:
  - `login.html` – Client & Admin login with instant one-click demo presets.
  - `register.html` – New client registration with Fitzpatrick skin type declaration.
  - `forgot-password.html` – Simulated password recovery with OTP feedback.
- **Client Lounge / Dashboard (5 Pages)**:
  - `client-dashboard.html` – Overview, upcoming appointment countdown, healing stage tracker widget, recent bookings.
  - `client-appointments.html` – Appointment management, reschedule / cancellation actions, booking slip viewer.
  - `client-treatment-history.html` – Private clinical chart: pigment brand & formula, needle depth, artist clinical notes.
  - `client-aftercare.html` – Daily aftercare checklist with interactive completion percentage.
  - `client-profile.html` – Personal info, skin type, notification preferences, password updates.
- **Studio Admin Dashboard (8 Pages)**:
  - `admin-dashboard.html` – Studio executive overview: monthly revenue, total bookings, confirmed count, schedule agenda, artist utilization metrics.
  - `admin-appointments.html` – Master appointment table with search, status filtering, and Add Appointment modal.
  - `admin-clients.html` – Client directory with lifetime spend, visit frequency, and clinical chart viewer.
  - `admin-artists.html` – Artist roster, schedules, and active days editor.
  - `admin-services.html` – Services & pricing manager with live editing triggers.
  - `admin-gallery.html` – Portfolio manager for uploading and featuring case studies.
  - `admin-enquiries.html` – Inquiries & consultation requests inbox with interactive reply simulator.
  - `admin-settings.html` – Business configuration: hours, deposit percentages, cancellation windows, and automated notifications.

---

### 2. Premium UX & Design Elements
- **Interactive Before-and-After Comparison Sliders**: Custom touch, drag, and keyboard-accessible split sliders.
- **Full RTL and LTR Language Support**: Smooth toggling of `dir="rtl"` / `dir="ltr"` and auto-switching between standard and RTL Bootstrap stylesheets.
- **Light & Dark Mode**: Persistent theme preference with luxury champagne gold and deep obsidian palettes.
- **Working Data Layer & LocalStorage Persistence**: Initialized from `data/*.json`, allowing dynamic mutations (booking appointments, updating statuses in admin, adding inquiries) without requiring an immediate backend server.
- **Real-Time Toast Notifications**: Floating toast banners for user feedback (`PMUNotifications`).

---

## 📁 Folder Structure

```text
pmu-studio/
│
├── index.html
├── home-2.html
├── home-3.html
│
├── about.html
├── services.html
├── service-details.html
├── artists.html
├── artist-details.html
├── gallery.html
├── booking.html
├── consultation.html
├── aftercare.html
├── contact.html
│
├── login.html
├── register.html
├── forgot-password.html
│
├── client-dashboard.html
├── client-appointments.html
├── client-treatment-history.html
├── client-aftercare.html
├── client-profile.html
│
├── admin-dashboard.html
├── admin-appointments.html
├── admin-clients.html
├── admin-artists.html
├── admin-services.html
├── admin-gallery.html
├── admin-enquiries.html
├── admin-settings.html
│
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── brows/
│   │   ├── lips/
│   │   ├── before-after/
│   │   ├── artists/
│   │   ├── studio/
│   │   └── testimonials/
│   ├── icons/
│   └── fonts/
│
├── css/
│   ├── bootstrap.min.css
│   ├── bootstrap.rtl.min.css
│   ├── tailwind.css
│   ├── variables.css
│   ├── global.css
│   ├── components.css
│   ├── header-footer.css
│   ├── responsive.css
│   ├── themes.css
│   ├── rtl.css
│   ├── forms.css
│   ├── gallery.css
│   └── dashboard.css
│
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── theme.js
│   ├── language.js
│   ├── gallery.js
│   ├── comparison-slider.js
│   ├── booking.js
│   ├── validation.js
│   ├── auth.js
│   ├── client-dashboard.js
│   ├── admin-dashboard.js
│   ├── notifications.js
│   └── storage.js
│
├── data/
│   ├── services.json
│   ├── artists.json
│   ├── gallery.json
│   └── demo-appointments.json
│
├── README.md
└── LICENSE.txt
```

---

## 🚀 Quick Start Guide

### Option 1: Direct File Opening
Double-click `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 8000
```
Or using Node.js `npx serve`:
```bash
npx serve .
```
Then navigate to `http://localhost:8000`.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Destination |
| :--- | :--- | :--- | :--- |
| **Client** | `client@aurapmu.com` | `password123` | `client-dashboard.html` |
| **Admin** | `admin@aurapmu.com` | `admin123` | `admin-dashboard.html` |

*(Note: One-click demo login buttons are provided on `login.html` for instant access!)*

---

## 🛠 Technology Stack
- **HTML5** (Semantic markup, ARIA accessibility)
- **CSS3** (Custom Properties, Flexbox, CSS Grid)
- **Bootstrap 5.3.3** (Standard & RTL minified bundles)
- **Tailwind CSS** (Utility extensions)
- **Vanilla JavaScript** (ES6+, modular architecture, no framework dependencies)
- **Font Awesome 6.5.1** (Included with local offline webfonts)

---

## 📄 License
This template is licensed under the MIT License. See [LICENSE.txt](LICENSE.txt) for details.
