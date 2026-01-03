import express from 'express';
import { createDriver, getDrivers, updateDriverStatus, deleteDriver } from '../controllers/driverController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createDriver);
router.get('/', protect, getDrivers);
router.put('/:id/status', protect, updateDriverStatus);
router.delete('/:id', protect, deleteDriver);

export default router;
