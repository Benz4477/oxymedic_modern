// backend/routes/caution.js
import express from 'express';
const router = express.Router();
import * as ctrl from '../controllers/cautionController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { requirePermission } from "../middleware/permissionGuard.js";

router.use(protect);

router.get('/stats', ctrl.getStats);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

router.patch('/:id/return', ctrl.returnCaution);
router.patch('/:id/deduct', ctrl.deductCaution);
router.patch('/:id/cancel', ctrl.cancel);

router.delete('/:id', adminOnly, ctrl.remove);

export default router;