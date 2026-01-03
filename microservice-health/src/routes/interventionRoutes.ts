import express from 'express';
import { createIntervention, confirmReceipt, getInterventions } from '../controllers/interventionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createIntervention);
router.get('/', protect, getInterventions);
router.post('/confirm', protect, confirmReceipt);

export default router;
