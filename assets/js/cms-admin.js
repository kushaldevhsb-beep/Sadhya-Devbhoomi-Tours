/**
 * Sadhya Devbhoomi Tours - Interactive CMS Admin Controller
 */

const CMSAdmin = {
  activeTab: 'inquiries',

  async init() {
    this.renderInquiries();
    this.bindTabs();
    this.renderToursList();
    this.renderDestinationsList();
    this.renderTravelAlerts();
  },

  bindTabs() {
    document.querySelectorAll('[data-cms-tab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = tabBtn.getAttribute('data-cms-tab');
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('[data-cms-tab]').forEach(btn => {
      if (btn.getAttribute('data-cms-tab') === tabId) {
        btn.classList.add('bg-amber-800', 'text-white');
        btn.classList.remove('text-slate-600', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-amber-800', 'text-white');
        btn.classList.add('text-slate-600', 'hover:bg-slate-100');
      }
    });

    document.querySelectorAll('.cms-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
    }
  },

  renderInquiries() {
    const container = document.getElementById('inquiries-table-body');
    if (!container) return;

    const inquiries = JSON.parse(localStorage.getItem('sadhya_inquiries') || '[]');

    if (inquiries.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-8 text-slate-500 italic text-sm">
            No inquiries recorded yet. Any submissions from the Custom Trip Builder or Contact forms will appear here.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = inquiries.map(inq => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-sm">
        <td class="py-3 px-4 font-mono text-xs text-slate-500">${new Date(inq.createdAt).toLocaleDateString()}</td>
        <td class="py-3 px-4 font-bold text-slate-900">${inq.name}</td>
        <td class="py-3 px-4 text-slate-700">
          <a href="tel:${inq.phone}" class="text-emerald-700 font-semibold hover:underline block">${inq.phone}</a>
          <span class="text-xs text-slate-500">${inq.email || ''}</span>
        </td>
        <td class="py-3 px-4 text-slate-700">
          <span class="badge-gold">${inq.tripType}</span>
          <div class="text-xs text-slate-500 mt-1">${inq.duration} • ${inq.adults}A, ${inq.children}C</div>
        </td>
        <td class="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">${inq.preferredDestinations || inq.preferredDistrict}</td>
        <td class="py-3 px-4">
          <button onclick="CMSAdmin.openInquiryWhatsApp('${inq.phone}', '${inq.name}')" class="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold hover:bg-emerald-700">
            WhatsApp
          </button>
        </td>
      </tr>
    `).join('');
  },

  openInquiryWhatsApp(phone, name) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `Namaste ${name}, this is Hari Mohan from Sadhya Devbhoomi Tours. We received your Uttarakhand trip inquiry and have customized an itinerary for you.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  },

  async renderToursList() {
    const container = document.getElementById('tours-cms-list');
    if (!container) return;

    const tours = await DataLoader.getTours();
    if (!tours) return;

    container.innerHTML = tours.map(t => `
      <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">${t.region}</span>
            <span class="text-xs text-slate-500">${t.duration}</span>
            <span class="text-xs text-slate-500">• ${t.difficulty}</span>
          </div>
          <h4 class="font-serif text-lg font-bold text-slate-900 mt-1">${t.title}</h4>
          <p class="text-xs text-slate-600 mt-0.5">Starting point: ${t.startingPoint} | Max Alt: ${t.altitudeMax}</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="App.showTourDetail('${t.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md font-medium">Preview</button>
          <button onclick="CMSAdmin.editTourPrompt('${t.id}')" class="text-xs bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-md font-medium">Update Pricing / Season</button>
        </div>
      </div>
    `).join('');
  },

  async renderDestinationsList() {
    const container = document.getElementById('destinations-cms-list');
    if (!container) return;

    const destinations = await DataLoader.getDestinations();
    if (!destinations) return;

    container.innerHTML = destinations.map(d => `
      <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center gap-3">
        <div>
          <span class="text-xs font-bold uppercase text-emerald-800">${d.division} Division • ${d.district}</span>
          <h4 class="font-serif text-base font-bold text-slate-900">${d.name}</h4>
          <p class="text-xs text-slate-500">${d.altitude} • Best: ${d.bestTime}</p>
        </div>
        <button onclick="App.showDestinationDetail('${d.id}')" class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md font-medium">View</button>
      </div>
    `).join('');
  },

  renderTravelAlerts() {
    const container = document.getElementById('travel-alerts-container');
    if (!container) return;

    const alerts = JSON.parse(localStorage.getItem('sadhya_travel_alerts') || JSON.stringify([
      { title: "Char Dham Yatra Registration", type: "info", text: "Biometric registration mandatory on official portal. Sadhya team assists all registered guests." },
      { title: "Adi Kailash Road Status", type: "success", text: "Tawaghat-Gunji-Jolingkong 4x4 sector is operational. Inner line permits issued at Dharchula." },
      { title: "Kainchi Dham Weekend Advisory", type: "notice", text: "Heavy pilgrim rush on Tuesdays & weekends. Early morning visits between 7:00 AM - 9:00 AM recommended." }
    ]));

    container.innerHTML = alerts.map(a => `
      <div class="p-4 rounded-xl border ${a.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-900' : a.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'} space-y-1">
        <h5 class="font-bold text-sm">${a.title}</h5>
        <p class="text-xs">${a.text}</p>
      </div>
    `).join('');
  },

  editTourPrompt(tourId) {
    const newPrice = prompt("Enter updated starting price / pricing guidance for this tour:", "Custom Quote on Request");
    if (newPrice !== null) {
      alert(`Updated tour ${tourId} pricing note to: ${newPrice}. (Changes saved to session view).`);
    }
  },

  exportDataJson() {
    const data = {
      inquiries: JSON.parse(localStorage.getItem('sadhya_inquiries') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sadhya_cms_export_${Date.now()}.json`;
    a.click();
  }
};

window.CMSAdmin = CMSAdmin;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cms-admin-root')) {
    CMSAdmin.init();
  }
});
