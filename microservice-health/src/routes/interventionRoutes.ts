import express from 'express';
import { createIntervention, confirmReceipt, getInterventions, getInterventionDetailsPublic, cancelIntervention } from '../controllers/interventionController';
import { protect } from '../middleware/authMiddleware';
import { protectLogistics } from '../middleware/logisticsAuth';

const router = express.Router();

router.post('/', protect, createIntervention);
router.get('/', protect, getInterventions);
router.delete('/:id', protect, cancelIntervention);
router.post('/confirm', protect, confirmReceipt);

// Public route for Logistics Client (Stateless Auth)
router.get('/public/:requestId', protectLogistics, getInterventionDetailsPublic);

export default router;