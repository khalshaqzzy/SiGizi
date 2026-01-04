import express from 'express';
import { getProviderRequests, assignDriver } from '../controllers/shipmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getProviderRequests);
router.put('/:id/assign', protect, assignDriver);

export default router;
