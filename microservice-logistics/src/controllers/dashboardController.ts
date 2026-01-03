import { Request, Response } from 'express';
import Shipment from '../models/Shipment';
import Driver from '../models/Driver';
import LogisticsProvider from '../models/LogisticsProvider';

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hubId = req.user.id;

    // 1. Active Shipments (Pending, Assigned, On The Way)
    const active_shipments = await Shipment.countDocuments({
      hub_id: hubId,
      status: { $in: ['PENDING', 'ASSIGNED', 'ON_THE_WAY'] }
    });

    // 2. Pending Requests
    const pending_requests = await Shipment.countDocuments({
      hub_id: hubId,
      status: 'PENDING'
    });

    // 3. Completed Today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const completed_today = await Shipment.countDocuments({
      hub_id: hubId,
      status: 'CONFIRMED',
      updated_at: { $gte: startOfDay }
    });

    // 4. Driver Availability
    const drivers = await Driver.find({ provider_id: hubId });
    const totalDrivers = drivers.length;
    const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE').length;
    
    const driver_availability = totalDrivers > 0 
      ? Math.round((availableDrivers / totalDrivers) * 100) 
      : 0;

    // 5. Low Stock Items
    const provider = await LogisticsProvider.findById(hubId);
    let low_stock_items = 0;
    if (provider) {
        low_stock_items = provider.inventory.filter(i => i.quantity <= i.min_stock).length;
    }

    res.json({
      active_shipments,
      pending_requests,
      completed_today,
      driver_availability,
      low_stock_items
    });

  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
