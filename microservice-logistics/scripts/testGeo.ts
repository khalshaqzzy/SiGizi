
import dotenv from 'dotenv';
import { Client } from '@googlemaps/google-maps-services-js';

dotenv.config();

const client = new Client({});

async function testMaps() {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    console.log(`🔑 Testing API Key: ${key ? key.substring(0, 10) + '...' : 'UNDEFINED'}`);

    if (!key) {
        console.error('❌ No API Key found.');
        return;
    }

    try {
        console.log('📡 Sending Geocoding Request for "Monas, Jakarta"...');
        const response = await client.geocode({
            params: {
                address: 'Monas, Jakarta',
                key: key
            }
        });

        if (response.data.results.length > 0) {
            console.log('✅ Geocoding SUCCESS!');
            console.log('   Result:', response.data.results[0].formatted_address);
            console.log('   Coords:', response.data.results[0].geometry.location);
        } else {
            console.warn('wm_WARNING: API returned no results (but connected).');
        }

    } catch (error: any) {
        console.error('❌ Google Maps API Failed:', error.response?.data?.error_message || error.message);
    }
}

testMaps();
