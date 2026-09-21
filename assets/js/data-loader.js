/**
 * Sadhya Devbhoomi Tours - Centralized Data Loader
 */
const DataLoader = {
  cache: {},

  async fetchJson(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }
    try {
      const response = await fetch(`data/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load data/${filename}: ${response.statusText}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (error) {
      console.error(`DataLoader Error:`, error);
      return null;
    }
  },

  async getSiteSettings() {
    return await this.fetchJson('site_settings.json');
  },

  async getDistricts() {
    return await this.fetchJson('districts.json');
  },

  async getDestinations() {
    return await this.fetchJson('destinations.json');
  },

  async getTours() {
    return await this.fetchJson('tours.json');
  },

  async getBlogs() {
    return await this.fetchJson('blogs.json');
  },

  async getTestimonials() {
    return await this.fetchJson('testimonials.json');
  },

  async getDestinationById(id) {
    const destinations = await this.getDestinations();
    return destinations ? destinations.find(d => d.id === id) : null;
  },

  async getTourById(id) {
    const tours = await this.getTours();
    return tours ? tours.find(t => t.id === id) : null;
  }
};

window.DataLoader = DataLoader;
