/**
 * Sadhya Devbhoomi Tours - Main Client Application Logic
 */

const App = {
  phone: "9756805476",
  email: "info@sadhyawellness.com",
  brandName: "Sadhya Devbhoomi Tours",

  init() {
    this.setupNavigation();
    this.setupHeaderScroll();
    this.bindWhatsAppButtons();
    this.setupModalHandlers();
    console.log("Sadhya Devbhoomi Tours Initialized.");
  },

  setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    if (closeMobileMenuBtn && mobileMenu) {
      closeMobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    }
  },

  setupHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('shadow-lg', 'bg-opacity-95');
      } else {
        header.classList.remove('shadow-lg', 'bg-opacity-95');
      }
    });
  },

  getWhatsAppUrl(message) {
    const cleanPhone = "919756805476";
    const encoded = encodeURIComponent(message || "Hello, I would like to plan a Uttarakhand trip with Sadhya Devbhoomi Tours. Please help me create an itinerary.");
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  },

  openWhatsApp(customMessage) {
    window.open(this.getWhatsAppUrl(customMessage), '_blank');
  },

  openTourWhatsApp(tourName) {
    const message = `Hello, I am interested in ${tourName}. Please share itinerary, availability and pricing.`;
    window.open(this.getWhatsAppUrl(message), '_blank');
  },

  bindWhatsAppButtons() {
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tourName = btn.getAttribute('data-tour-name');
        if (tourName) {
          this.openTourWhatsApp(tourName);
        } else {
          this.openWhatsApp();
        }
      });
    });
  },

  setupModalHandlers() {
    const modal = document.getElementById('detail-modal');
    const modalContent = document.getElementById('modal-body-content');
    const modalClose = document.getElementById('modal-close-btn');

    if (!modal) return;

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  },

  openDetailModal(title, htmlContent) {
    const modal = document.getElementById('detail-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body-content');

    if (modal && modalTitle && modalBody) {
      modalTitle.innerText = title;
      modalBody.innerHTML = htmlContent;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  async showTourDetail(tourId) {
    const tour = await DataLoader.getTourById(tourId);
    if (!tour) return;

    const html = `
      <div class="space-y-6">
        <div class="relative h-64 rounded-xl overflow-hidden shadow-inner">
          <img src="${tour.heroImage}" alt="${tour.title}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div>
              <span class="badge-gold bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-3 py-1 rounded-full uppercase font-semibold">${tour.region} • ${tour.duration}</span>
              <h3 class="text-2xl font-serif text-white mt-2 font-bold">${tour.title}</h3>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">Duration</span>
            <span class="text-sm font-bold text-slate-800">${tour.duration}</span>
          </div>
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">Altitude</span>
            <span class="text-sm font-bold text-slate-800">${tour.altitudeMax}</span>
          </div>
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">Difficulty</span>
            <span class="text-sm font-bold text-slate-800">${tour.difficulty}</span>
          </div>
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">Best Season</span>
            <span class="text-xs font-bold text-slate-800">${tour.bestSeason}</span>
          </div>
        </div>

        <div>
          <h4 class="font-serif text-xl font-bold text-slate-900 border-b border-amber-200/60 pb-2 mb-3">Key Highlights</h4>
          <ul class="space-y-2 text-slate-700 text-sm">
            ${tour.highlights.map(h => `<li class="flex items-start gap-2"><span class="text-amber-700 font-bold">✓</span> <span>${h}</span></li>`).join('')}
          </ul>
        </div>

        <div>
          <h4 class="font-serif text-xl font-bold text-slate-900 border-b border-amber-200/60 pb-2 mb-3">Day-Wise Itinerary</h4>
          <div class="space-y-4">
            ${tour.itinerary.map(item => `
              <div class="border-l-2 border-amber-600/40 pl-4 py-1">
                <span class="text-xs font-bold uppercase tracking-wider text-amber-800">Day ${item.day}</span>
                <h5 class="font-bold text-slate-900 text-base">${item.title}</h5>
                <p class="text-slate-600 text-sm mt-1 leading-relaxed">${item.description}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <h5 class="font-bold text-emerald-800 text-sm mb-2 flex items-center gap-1"><span>✦</span> Inclusions</h5>
            <ul class="text-xs text-slate-600 space-y-1">
              ${tour.inclusions.map(inc => `<li>• ${inc}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h5 class="font-bold text-rose-800 text-sm mb-2 flex items-center gap-1"><span>✕</span> Exclusions</h5>
            <ul class="text-xs text-slate-600 space-y-1">
              ${tour.exclusions.map(exc => `<li>• ${exc}</li>`).join('')}
            </ul>
          </div>
        </div>

        ${tour.importantNotes ? `
          <div class="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900">
            <strong>Important Notice:</strong> ${tour.importantNotes}
          </div>
        ` : ''}

        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <button onclick="App.openTourWhatsApp('${tour.title}')" class="btn-whatsapp flex-1 justify-center py-3">
            <span>Enquire on WhatsApp</span>
          </button>
          <a href="tel:+919756805476" class="btn-secondary bg-slate-800 hover:bg-slate-700 text-white flex-1 justify-center py-3">
            <span>Call +91 97568 05476</span>
          </a>
          <a href="custom-trip.html?tour=${encodeURIComponent(tour.title)}" class="btn-primary flex-1 justify-center py-3">
            <span>Customize This Trip</span>
          </a>
        </div>
      </div>
    `;

    this.openDetailModal(tour.title, html);
  },

  async showDestinationDetail(destId) {
    const dest = await DataLoader.getDestinationById(destId);
    if (!dest) return;

    const html = `
      <div class="space-y-6">
        <div class="relative h-64 rounded-xl overflow-hidden shadow-inner">
          <img src="${dest.heroImage}" alt="${dest.name}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div>
              <span class="badge-gold bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-3 py-1 rounded-full uppercase font-semibold">${dest.division} Division • ${dest.category}</span>
              <h3 class="text-2xl font-serif text-white mt-2 font-bold">${dest.name}</h3>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">Altitude</span>
            <span class="text-sm font-bold text-slate-800">${dest.altitude}</span>
          </div>
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">Best Time</span>
            <span class="text-xs font-bold text-slate-800">${dest.bestTime}</span>
          </div>
          <div class="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50">
            <span class="text-xs text-slate-500 uppercase font-semibold block">District</span>
            <span class="text-sm font-bold text-slate-800 capitalize">${dest.district}</span>
          </div>
        </div>

        <div>
          <h4 class="font-serif text-xl font-bold text-slate-900 border-b border-amber-200/60 pb-2 mb-2">Overview</h4>
          <p class="text-slate-700 text-sm leading-relaxed">${dest.overview}</p>
        </div>

        <div>
          <h4 class="font-serif text-xl font-bold text-slate-900 border-b border-amber-200/60 pb-2 mb-2">Why Visit</h4>
          <p class="text-slate-700 text-sm leading-relaxed">${dest.whyVisit}</p>
        </div>

        <div>
          <h4 class="font-serif text-xl font-bold text-slate-900 border-b border-amber-200/60 pb-2 mb-3">Top Attractions</h4>
          <div class="flex flex-wrap gap-2">
            ${dest.attractions.map(a => `<span class="bg-slate-100 text-slate-800 text-xs px-3 py-1.5 rounded-full border border-slate-200 font-medium">${a}</span>`).join('')}
          </div>
        </div>

        <div class="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 space-y-2 text-xs text-slate-700">
          <p><strong>How to Reach:</strong> ${dest.howToReach}</p>
          <p><strong>Where to Stay:</strong> ${dest.whereToStay}</p>
          <p><strong>Travel Tips:</strong> ${dest.travelTips}</p>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <button onclick="App.openTourWhatsApp('Destination: ${dest.name}')" class="btn-whatsapp flex-1 justify-center py-3">
            <span>Enquire on WhatsApp</span>
          </button>
          <a href="custom-trip.html?destination=${encodeURIComponent(dest.name)}" class="btn-primary flex-1 justify-center py-3">
            <span>Plan Tour to ${dest.name}</span>
          </a>
        </div>
      </div>
    `;

    this.openDetailModal(dest.name, html);
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());
