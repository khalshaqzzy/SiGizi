import express from 'express';
import { getInterventionDetailsInternal, updateShipmentDetails } from '../controllers/interventionController';
import { protectInternal } from '../middleware/internalAuth';

const router = express.Router();

router.get('/interventions/:requestId', protectInternal, getInterventionDetailsInternal);
router.post('/shipment-update', protectInternal, updateShipmentDetails);

export default router;