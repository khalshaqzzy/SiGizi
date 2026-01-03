import express from 'express';
import { registerProvider, loginProvider, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerProvider);
router.post('/login', loginProvider);
router.put('/profile', protect, updateProfile);

export default router;
