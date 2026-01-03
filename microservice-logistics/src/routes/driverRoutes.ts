import express from 'express';
import { createDriver, getDrivers } from '../controllers/driverController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createDriver);
router.get('/', protect, getDrivers);

export default router;
