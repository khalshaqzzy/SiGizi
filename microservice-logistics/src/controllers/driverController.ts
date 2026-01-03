import { Request, Response } from 'express';
import Driver from '../models/Driver';

interface AuthRequest extends Request {
  user?: any;
}

export const createDriver = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, vehicle_number } = req.body;

    const newDriver = new Driver({
      provider_id: req.user.id,
      name,
      phone,
      vehicle_number
    });

    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDrivers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = { provider_id: req.user.id };
    
    if (status) query.status = status;

    const drivers = await Driver.find(query);
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
