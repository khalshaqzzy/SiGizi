import express from 'express';
import { registerProvider, loginProvider } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerProvider);
router.post('/login', loginProvider);

export default router;
