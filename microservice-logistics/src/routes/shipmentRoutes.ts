import express from 'express';
import { getProviderRequests, assignDriver, getShipmentHealthData } from '../controllers/shipmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getProviderRequests);
router.put('/:id/assign', protect, assignDriver);
router.get('/:id/health-data', protect, getShipmentHealthData);

export default router;
