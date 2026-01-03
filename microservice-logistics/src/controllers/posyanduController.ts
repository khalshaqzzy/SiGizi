import { Request, Response } from 'express';
import PosyanduRegistry from '../models/PosyanduRegistry';
import { assignNearestHub } from '../services/assignmentService';
import { geocodeAddress } from '../services/geoService';

export const syncPosyandu = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate API Key
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.HEALTH_SERVICE_SECRET) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    let { health_posyandu_id, name, address, location } = req.body;

    // Fallback Geocoding Logic
    if ((!location || !location.lat || !location.lng) && address) {
      const geoResult = await geocodeAddress(address);
      if (geoResult) {
        location = { lat: geoResult.lat, lng: geoResult.lng };
      }
    }

    if (!health_posyandu_id || !location || !location.lat || !location.lng) {
      res.status(400).json({ message: 'Invalid payload: Location missing and address geocoding failed.' });
      return;
    }

    // Upsert the shadow record
    const record = await PosyanduRegistry.findOneAndUpdate(
      { health_posyandu_id },
      {
        name,
        address,
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        last_synced_at: new Date()
      },
      { new: true, upsert: true }
    );

    // Trigger Assignment Logic
    assignNearestHub(record._id.toString());

    res.status(200).json({ message: 'Posyandu Synced', data: record });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
