import express from 'express';
import { createIntervention, confirmReceipt, getInterventions, getInterventionDetailsPublic } from '../controllers/interventionController';
import { protect } from '../middleware/authMiddleware';
import { protectLogistics } from '../middleware/logisticsAuth';

const router = express.Router();

router.post('/', protect, createIntervention);
router.get('/', protect, getInterventions);
router.post('/confirm', protect, confirmReceipt);

// Public route for Logistics Client (Stateless Auth)
router.get('/public/:requestId', protectLogistics, getInterventionDetailsPublic);

export default router;
