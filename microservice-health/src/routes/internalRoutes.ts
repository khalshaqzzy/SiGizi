import express from 'express';
import { getInterventionDetailsInternal } from '../controllers/interventionController';
import { protectInternal } from '../middleware/internalAuth';

const router = express.Router();

router.get('/interventions/:requestId', protectInternal, getInterventionDetailsInternal);

export default router;