import { Request, Response } from 'express';
import Shipment from '../models/Shipment';
import PosyanduRegistry from '../models/PosyanduRegistry';
import LogisticsProvider from '../models/LogisticsProvider';
import Driver from '../models/Driver';
import { assignNearestHub } from '../services/assignmentService';

interface AuthRequest extends Request {
  user?: any;
}

// Internal: Receive Request from Health Service
export const createShipmentRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.HEALTH_SERVICE_SECRET) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const { health_request_id, posyandu_id, patient_initials, age_months, urgency } = req.body;

    // Find the shadow posyandu record
    let posyandu = await PosyanduRegistry.findOne({ health_posyandu_id: posyandu_id });
    if (!posyandu) {
      res.status(404).json({ message: 'Posyandu not found in shadow registry' });
      return;
    }

    // Re-check assignment to ensure picking the BEST provider available right now
    await assignNearestHub(posyandu._id.toString());
    
    // Refresh document after update
    posyandu = await PosyanduRegistry.findOne({ health_posyandu_id: posyandu_id });

    if (!posyandu || !posyandu.assigned_hub_id) {
        res.status(400).json({ message: 'Posyandu not yet assigned to a Logistics Hub' });
        return;
    }

    const newShipment = new Shipment({
      health_request_id,
      posyandu_id: posyandu._id,
      hub_id: posyandu.assigned_hub_id,
      patient_details: {
        initials: patient_initials,
        age_months,
        urgency
      },
      status: 'PENDING'
    });

    await newShipment.save();
    res.status(201).json({ message: 'Shipment Request Created', data: newShipment });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Provider: Get their requests
export const getProviderRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await Shipment.find({ hub_id: req.user.id })
                                   .populate('posyandu_id')
                                   .sort({ created_at: -1 });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Provider: Assign Driver & Dispatch
export const assignDriver = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { driver_id, items, eta } = req.body;
    const shipmentId = req.params.id;

    // 1. Fetch Shipment
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      res.status(404).json({ message: 'Shipment not found' });
      return;
    }

    if (shipment.hub_id.toString() !== req.user.id) {
      res.status(403).json({ message: 'Not authorized for this shipment' });
      return;
    }

    if (shipment.status !== 'PENDING') {
      res.status(400).json({ message: 'Shipment is already processed' });
      return;
    }

    // 2. Validate Driver Availability
    const driver = await Driver.findById(driver_id);
    if (!driver) {
        res.status(404).json({ message: 'Driver not found' });
        return;
    }
    if (driver.status === 'ON_DELIVERY') {
        res.status(400).json({ message: `Driver ${driver.name} is currently ON_DELIVERY` });
        return;
    }

    // 3. Validate & Deduct Inventory Atomically
    const provider = await LogisticsProvider.findById(req.user.id);
    if (!provider) {
        res.status(404).json({ message: 'Provider not found' });
        return;
    }

    for (const requestedItem of items) {
        const stockItem = provider.inventory.find(i => i.sku === requestedItem.sku);
        if (!stockItem) {
            res.status(400).json({ message: `Item SKU ${requestedItem.sku} not found` });
            return;
        }
        if (stockItem.quantity < requestedItem.qty) {
            res.status(400).json({ message: `Insufficient stock for SKU ${requestedItem.sku}` });
            return;
        }
    }

    for (const requestedItem of items) {
        const result = await LogisticsProvider.updateOne(
            { 
                _id: req.user.id, 
                "inventory": { 
                    $elemMatch: { 
                        sku: requestedItem.sku, 
                        quantity: { $gte: requestedItem.qty } 
                    } 
                } 
            },
            { $inc: { "inventory.$.quantity": -requestedItem.qty } }
        );

        if (result.modifiedCount === 0) {
            res.status(409).json({ message: `Concurrency Error: Stock for SKU ${requestedItem.sku} changed.` });
            return;
        }
    }

    // 4. Update Driver Status to ON_DELIVERY
    driver.status = 'ON_DELIVERY';
    driver.current_shipment_id = shipment._id as any;
    await driver.save();

    // 5. Update Shipment
    shipment.driver = { name: driver.name, phone: driver.phone }; // Store snapshot
    shipment.items = items; 
    shipment.eta = eta;
    shipment.status = 'ON_THE_WAY'; 
    shipment.updated_at = new Date();

    await shipment.save();

    res.json(shipment);
  } catch (error: any) {
    console.error("Assign Driver Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Internal: Confirm Delivery (Close Loop)
export const confirmDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== process.env.HEALTH_SERVICE_SECRET) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }
  
      const { health_request_id } = req.body;
  
      const shipment = await Shipment.findOne({ health_request_id });
      if (!shipment) {
        res.status(404).json({ message: 'Shipment not found' });
        return;
      }
  
      shipment.status = 'DELIVERED';
      shipment.updated_at = new Date();
      await shipment.save();

      // Free up Driver
      await Driver.findOneAndUpdate(
          { current_shipment_id: shipment._id },
          { 
              status: 'AVAILABLE',
              current_shipment_id: null
          }
      );
  
      res.json({ message: 'Shipment Completed' });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
