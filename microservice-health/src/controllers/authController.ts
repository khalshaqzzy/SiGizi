import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { syncPosyanduToLogistics } from '../services/syncService';

export const registerPosyandu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name, address, lat, lng } = req.body;

    if (!username || !password || !lat || !lng) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password_hash,
      posyandu_details: {
        name,
        address,
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    });

    await newUser.save();

    // Trigger Sync to Logistics Service
    // Fire and forget (don't await to block response, or await if critical)
    syncPosyanduToLogistics(newUser);

    res.status(201).json({ message: 'Posyandu registered successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginPosyandu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
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
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.posyandu_details.name } });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
