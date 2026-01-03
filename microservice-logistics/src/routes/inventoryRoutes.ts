import express from 'express';
import { getInventory, updateInventory, deleteInventoryItem } from '../controllers/inventoryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getInventory);
router.post('/', protect, updateInventory);
router.delete('/:sku', protect, deleteInventoryItem);

export default router;
