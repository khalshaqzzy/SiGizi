import express from 'express';
import { createPatient, addMeasurement, getPatients } from '../controllers/patientController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createPatient);
router.get('/', protect, getPatients);
router.post('/:patientId/measurements', protect, addMeasurement);

export default router;
