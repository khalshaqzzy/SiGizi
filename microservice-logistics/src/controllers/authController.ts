import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import LogisticsProvider, { ILogisticsProvider } from '../models/LogisticsProvider';
import { reassignAllPosyandus } from '../services/assignmentService';
import { geocodeAddress } from '../services/geoService';

export const registerProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    let { username, password, name, address, lat, lng } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Jika lat/lng tidak ada tapi address ada, coba cari via Geocoding
    if ((!lat || !lng) && address) {
      const geoResult = await geocodeAddress(address);
      if (geoResult) {
        lat = geoResult.lat;
        lng = geoResult.lng;
      }
    }

    if (!lat || !lng) {
      res.status(400).json({ message: 'Location (Lat/Lng) or valid Address is required' });
      return;
    }

    const existingUser = await LogisticsProvider.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newProvider = new LogisticsProvider({
      username,
      password_hash,
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // MongoDB expects [lng, lat]
      }
    });

    await newProvider.save();

    // Trigger Assignment Logic to see if this new provider is better for anyone
    reassignAllPosyandus();

    res.status(201).json({ message: 'Logistics Provider registered successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await LogisticsProvider.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: 'LOGISTICS_ADMIN' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, location: user.location } });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

interface AuthRequest extends Request {
  user?: any;
}

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, address, phone } = req.body;
    let { lat, lng } = req.body;

    const user = await LogisticsProvider.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    
    // If address changed, try to geocode if lat/lng missing
    if (address && address !== user.address) {
      user.address = address;
      if (!lat || !lng) {
        const geoResult = await geocodeAddress(address);
        if (geoResult) {
          lat = geoResult.lat;
          lng = geoResult.lng;
        }
      }
    }

    if (lat && lng) {
      user.location = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }

    await user.save();

    // Trigger re-assignment if location changed
    if (lat && lng) {
       reassignAllPosyandus();
    }

    res.json({ 
      message: 'Profile updated', 
      user: { id: user._id, name: user.name, address: user.address, location: user.location } 
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
