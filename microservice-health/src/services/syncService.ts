import axios from 'axios';

// URL of the Logistics Microservice
const LOGISTICS_URL = process.env.LOGISTICS_URL || 'http://localhost:5002';
const SHARED_SECRET = process.env.SHARED_SECRET || 'internal_secret_123';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const syncPosyanduToLogistics = async (posyanduData: any) => {
  const payload = {
    health_posyandu_id: posyanduData._id,
    name: posyanduData.posyandu_details.name,
    address: posyanduData.posyandu_details.address,
    location: {
      lat: posyanduData.posyandu_details.location.coordinates[1],
      lng: posyanduData.posyandu_details.location.coordinates[0]
    }
  };

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await axios.post(`${LOGISTICS_URL}/api/internal/posyandu-sync`, payload, {
        headers: {
          'x-api-key': SHARED_SECRET
        }
      });
      console.log(`Synced Posyandu ${posyanduData.posyandu_details.name} to Logistics.`);
      return; // Success
    } catch (error: any) {
      attempt++;
      console.error(`Sync attempt ${attempt} failed:`, error.message);
      
      if (attempt >= MAX_RETRIES) {
        console.error(`Failed to sync Posyandu ${posyanduData.posyandu_details.name} after ${MAX_RETRIES} attempts. Data may be inconsistent.`);
      } else {
        const delay = BASE_DELAY * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }
  }
};
