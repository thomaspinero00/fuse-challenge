import axios from 'axios';

const vendorApiKey = 'nSbPbFJfe95BFZufiDwF32UhqZLEVQ5K4wdtJI2e';
const vendorBaseUrl = 'https://api.challenge.fusefinance.com';

export const vendorApiClient = axios.create({
  baseURL: vendorBaseUrl,
  headers: {
    'x-api-key': vendorApiKey,
  },
});