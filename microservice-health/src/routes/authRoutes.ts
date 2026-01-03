import express from 'express';
import { registerPosyandu, loginPosyandu } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerPosyandu);
router.post('/login', loginPosyandu);

export default router;
