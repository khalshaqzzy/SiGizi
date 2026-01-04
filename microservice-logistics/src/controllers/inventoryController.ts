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
    const { sku, name, quantity, unit, min_stock } = req.body;
    
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
      if (min_stock !== undefined) provider.inventory[itemIndex].min_stock = min_stock;
      provider.inventory[itemIndex].updated_at = new Date();
    } else {
      // Add new
      provider.inventory.push({ 
        sku, 
        name, 
        quantity, 
        unit, 
        min_stock: min_stock || 10,
        created_at: new Date(),
        updated_at: new Date()
      } as any);
    }

    await provider.save();
    res.json(provider.inventory);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteInventoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sku } = req.params;
    
    const provider = await LogisticsProvider.findById(req.user?.id);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    provider.inventory = provider.inventory.filter(item => item.sku !== sku);
    
    await provider.save();
    res.json({ message: 'Item removed', inventory: provider.inventory });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
