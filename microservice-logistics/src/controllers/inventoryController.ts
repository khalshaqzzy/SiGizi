import { Request, Response } from 'express';
import LogisticsProvider from '../models/LogisticsProvider';

// Middleware should populate req.user (from authMiddleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await LogisticsProvider.findById(req.user?.id);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }
    res.json(provider.inventory);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sku, name, quantity, unit } = req.body;
    
    // Check if item exists
    const provider = await LogisticsProvider.findById(req.user?.id);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    const itemIndex = provider.inventory.findIndex(item => item.sku === sku);

    if (itemIndex > -1) {
      // Update existing
      provider.inventory[itemIndex].quantity = quantity;
      if (name) provider.inventory[itemIndex].name = name;
      if (unit) provider.inventory[itemIndex].unit = unit;
    } else {
      // Add new
      provider.inventory.push({ sku, name, quantity, unit });
    }

    await provider.save();
    res.json(provider.inventory);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
