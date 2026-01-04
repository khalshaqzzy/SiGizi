import express from 'express';
import { getAssignedPosyandus, getMyHub } from '../controllers/posyanduController';
import { protect } from '../middleware/authMiddleware';
import { protectPosyandu } from '../middleware/posyanduAuth';

const router = express.Router();

router.get('/', protect, getAssignedPosyandus);
router.get('/my-hub', protectPosyandu, getMyHub);

export default router;