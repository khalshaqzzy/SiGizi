import LogisticsProvider from '../models/LogisticsProvider';
import PosyanduRegistry from '../models/PosyanduRegistry';
import { Client } from '@googlemaps/google-maps-services-js';

const googleMapsClient = new Client({});

// Simple Cache for Distance: Key="lat1,lng1-lat2,lng2", Value=seconds
const distanceCache = new Map<string, number>();

// Helper: Calculate mock distance if API fails or key missing
const calculateMockTime = (origin: number[], dest: number[]) => {
    // Euclidean distance approximation
    const dist = Math.sqrt(
        Math.pow(origin[0] - dest[0], 2) + Math.pow(origin[1] - dest[1], 2)
    );
    // Rough estimate: 1 degree ~ 111km. Speed ~ 40km/h.
    return Math.floor(dist * 10000); 
};

const getTravelTime = async (origin: number[], dest: number[]): Promise<number> => {
    // origin/dest are [lng, lat] from MongoDB
    
    // Create Cache Key (Normalize precision to avoid cache misses on tiny float diffs)
    const key = `${origin[1].toFixed(4)},${origin[0].toFixed(4)}-${dest[1].toFixed(4)},${dest[0].toFixed(4)}`;
    
    if (distanceCache.has(key)) {
        return distanceCache.get(key)!;
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.warn('GOOGLE_MAPS_API_KEY not found. Using mock distance.');
        return calculateMockTime(origin, dest);
    }

    try {
        const response = await googleMapsClient.distancematrix({
            params: {
                origins: [{ lat: origin[1], lng: origin[0] }],
                destinations: [{ lat: dest[1], lng: dest[0] }],
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.rows[0].elements[0].status === 'OK') {
            const duration = response.data.rows[0].elements[0].duration.value;
            distanceCache.set(key, duration); // Cache result
            return duration;
        } else {
            console.warn('Google Maps API returned non-OK status:', response.data.rows[0].elements[0].status);
            return calculateMockTime(origin, dest);
        }
    } catch (error: any) {
        console.error('Google Maps API Error:', error.message);
        return calculateMockTime(origin, dest);
    }
};

export const assignNearestHub = async (posyanduId: string) => {
    try {
        const posyandu = await PosyanduRegistry.findById(posyanduId);
        if (!posyandu) return;

        const [lng, lat] = posyandu.location.coordinates;

        // Step 1: Find 3 nearest providers using geospatial index (MongoDB $near)
        const nearestProviders = await LogisticsProvider.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] }
                }
            }
        }).limit(3);

        if (nearestProviders.length === 0) {
            console.log(`No logistics providers found near Posyandu ${posyandu.name}`);
            return;
        }

        // Step 2: Calculate Real "Drive Time" using Google Maps
        let bestProvider = null;
        let minTime = Infinity;

        for (const provider of nearestProviders) {
            const time = await getTravelTime(
                posyandu.location.coordinates,
                provider.location.coordinates
            );
            
            if (time < minTime) {
                minTime = time;
                bestProvider = provider;
            }
        }

        // Step 3: Update Assignment
        if (bestProvider) {
            if (String(posyandu.assigned_hub_id) !== String(bestProvider._id)) {
                posyandu.assigned_hub_id = bestProvider._id as any;
                await posyandu.save();
                console.log(`Assigned Hub ${bestProvider.name} to Posyandu ${posyandu.name} (Duration: ${minTime}s)`);
            }
        }

    } catch (error) {
        console.error("Assignment Error:", error);
    }
};

export const reassignAllPosyandus = async () => {
    console.log('Starting Global Reassignment...');
    const allPosyandus = await PosyanduRegistry.find({});
    for (const p of allPosyandus) {
        await assignNearestHub(p._id.toString());
    }
    console.log('Global Reassignment Complete.');
};