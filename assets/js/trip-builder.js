/**
 * Sadhya Devbhoomi Tours - Interactive Custom Trip Builder
 */

const TripBuilder = {
  init() {
    const form = document.getElementById('custom-trip-form');
    if (!form) return;

    this.prefillFromUrl();
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  prefillFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const tourParam = urlParams.get('tour');
    const destParam = urlParams.get('destination');

    if (tourParam) {
      const tourField = document.getElementById('preferred-destinations');
      const tripTypeField = document.getElementById('trip-type');
      if (tourField) tourField.value = `Interested in Tour: ${tourParam}`;
    }

    if (destParam) {
      const destField = document.getElementById('preferred-destinations');
      if (destField) destField.value = `Focus on: ${destParam}`;
    }
  },

  handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const name = form['full-name'].value.trim();
    const phone = form['phone-number'].value.trim();
    const email = form['email-address'].value.trim();
    const country = form['country'].value.trim() || 'India';
    const travelDate = form['travel-date'].value;
    const adults = form['adults'].value;
    const children = form['children'].value || '0';
    const startingCity = form['starting-city'].value.trim();
    const endingCity = form['ending-city'].value.trim();
    const preferredDistrict = form['preferred-district'].value;
    const preferredDestinations = form['preferred-destinations'].value.trim();
    const tripType = form['trip-type'].value;
    const duration = form['trip-duration'].value;
    const budget = form['budget-preference'].value;
    const accommodation = form['accommodation-tier'].value;
    const transport = form['transport-mode'].value;
    const specialRequirements = form['special-requirements'].value.trim();
    const message = form['additional-message'].value.trim();

    if (!name || !phone) {
      alert("Please provide at least your Name and Phone / WhatsApp number so our travel experts can reach you.");
      return;
    }

    const inquiry = {
      id: "INQ-" + Date.now(),
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      country,
      travelDate,
      adults,
      children,
      startingCity,
      endingCity,
      preferredDistrict,
      preferredDestinations,
      tripType,
      duration,
      budget,
      accommodation,
      transport,
      specialRequirements,
      message,
      status: "New"
    };

    // Store in localStorage for Admin CMS viewing
    try {
      const existing = JSON.parse(localStorage.getItem('sadhya_inquiries') || '[]');
      existing.unshift(inquiry);
      localStorage.setItem('sadhya_inquiries', JSON.stringify(existing));
    } catch (err) {
      console.error("Failed to store inquiry locally:", err);
    }

    // Format WhatsApp message
    const waText = 
`*NEW TRIP INQUIRY - SADHYA DEVBHOOMI TOURS*
---------------------------------------
*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email || 'Not provided'}
*Country:* ${country}

*TRAVEL DETAILS:*
*Dates:* ${travelDate || 'Flexible'}
*Duration:* ${duration}
*Travelers:* ${adults} Adults, ${children} Children
*Route:* ${startingCity || 'Kathgodam/Delhi'} -> ${endingCity || 'Return'}
*Preferred District:* ${preferredDistrict}
*Destinations:* ${preferredDestinations || 'Recommended Itinerary'}
*Trip Style:* ${tripType}

*PREFERENCES:*
*Accommodation:* ${accommodation}
*Transport:* ${transport}
*Budget Range:* ${budget}
*Special Needs:* ${specialRequirements || 'None'}
*Note:* ${message || 'Please prepare a custom itinerary & quotation.'}
---------------------------------------
_Sent via tour.sadhyawellness.com_`;

    const waUrl = `https://wa.me/919756805476?text=${encodeURIComponent(waText)}`;

    // Show Confirmation Modal or redirect to WhatsApp
    const resultBox = document.getElementById('inquiry-result-box');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl text-center space-y-4 shadow-xl">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
          <h3 class="font-serif text-2xl font-bold text-emerald-950">Thank You, ${name}!</h3>
          <p class="text-emerald-900 text-sm max-w-md mx-auto">
            Your customized Devbhoomi journey plan has been recorded. To receive your immediate day-wise itinerary and quote, connect directly with our Himalayan tour specialist on WhatsApp.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <a href="${waUrl}" target="_blank" class="btn-whatsapp py-3 px-6 text-base justify-center">
              <span>Chat on WhatsApp (+91 97568 05476)</span>
            </a>
            <a href="mailto:info@sadhyawellness.com?cc=hariom.hsb@gmail.com&subject=Custom%20Devbhoomi%20Tour%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(waText)}" class="btn-secondary bg-slate-800 text-white py-3 px-6 text-base justify-center">
              <span>Send by Email</span>
            </a>
          </div>
        </div>
      `;
      resultBox.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(waUrl, '_blank');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => TripBuilder.init());
