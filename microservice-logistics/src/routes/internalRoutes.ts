import express from 'express';
import { syncPosyandu } from '../controllers/posyanduController';
import { createShipmentRequest, confirmDelivery } from '../controllers/shipmentController';

const router = express.Router();

router.post('/posyandu-sync', syncPosyandu);
router.post('/requests', createShipmentRequest);
router.post('/delivery-confirm', confirmDelivery);

export default router;
