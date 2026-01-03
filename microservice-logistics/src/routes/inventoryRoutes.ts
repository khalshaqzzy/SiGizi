import express from 'express';
import { getInventory, updateInventory } from '../controllers/inventoryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getInventory);
router.post('/', protect, updateInventory);

export default router;
