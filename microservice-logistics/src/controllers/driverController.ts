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

export const updateDriverStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const driver = await Driver.findOne({ _id: id, provider_id: req.user.id });
    if (!driver) {
      res.status(404).json({ message: 'Driver not found' });
      return;
    }

    // Only allow manual toggle between AVAILABLE and OFF_DUTY.
    // ON_DELIVERY is system-managed (locked by shipment).
    if (status === 'ON_DELIVERY' && driver.status !== 'ON_DELIVERY') {
       res.status(400).json({ message: 'Cannot manually set status to ON_DELIVERY. Assign a shipment instead.' });
       return;
    }

    if (driver.status === 'ON_DELIVERY' && status !== 'ON_DELIVERY') {
       // Optional: Allow force override if needed, but warn
       // For now, let's allow it but log it
       console.warn(`Driver ${driver.name} forced out of ON_DELIVERY state manually.`);
       driver.current_shipment_id = undefined;
    }

    driver.status = status;
    await driver.save();

    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDriver = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findOne({ _id: id, provider_id: req.user.id });
    if (!driver) {
      res.status(404).json({ message: 'Driver not found' });
      return;
    }

    if (driver.status === 'ON_DELIVERY') {
      res.status(400).json({ message: 'Cannot delete driver who is currently ON_DELIVERY' });
      return;
    }

    await driver.deleteOne();
    res.json({ message: 'Driver removed' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
