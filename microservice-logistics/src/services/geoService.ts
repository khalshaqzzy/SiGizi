import { Client } from '@googlemaps/google-maps-services-js';

const googleMapsClient = new Client({});

// Simple In-Memory Cache
const geocodeCache = new Map<string, { lat: number; lng: number; formattedAddress: string }>();

export const geocodeAddress = async (address: string) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn("GOOGLE_MAPS_API_KEY missing. Skipping Geocoding.");
    return null;
  }

  // Check Cache
  if (geocodeCache.has(address)) {
    console.log('Serving Geocode from Cache');
    return geocodeCache.get(address);
  }

  try {
    const response = await googleMapsClient.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.results.length > 0) {
      const result = response.data.results[0];
      
      // Strict Validation: Reject if it's too vague (e.g., just "Indonesia" or "Jakarta")
      const resultTypes = result.types as string[];
      const isPrecise = resultTypes.includes('street_address') || 
                        resultTypes.includes('route') || 
                        resultTypes.includes('premise') ||
                        resultTypes.includes('sublocality');

      if (!isPrecise) {
        console.warn(`Geocoding rejected: Address '${address}' returned vague result: ${result.formatted_address} (${result.types})`);
      }

      const data = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address
      };

      // Set Cache
      geocodeCache.set(address, data);
      return data;
    }
    return null;
  } catch (error: any) {
    console.error('Geocoding Error:', error.message);
    return null;
  }
};