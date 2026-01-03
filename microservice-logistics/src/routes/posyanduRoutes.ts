import express from 'express';
import { getAssignedPosyandus } from '../controllers/posyanduController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAssignedPosyandus);

export default router;