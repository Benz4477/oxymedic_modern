import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAllLivreurs, getLivreurById, createLivreur, updateLivreur, deleteLivreur } from '../controllers/livreurController.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('superadmin', 'admin', 'employe', 'livreur'), getAllLivreurs);
router.get('/:id', authorize('superadmin', 'admin', 'employe', 'livreur'), getLivreurById);
router.post('/', authorize('superadmin', 'admin'), createLivreur);
router.put('/:id', authorize('superadmin', 'admin'), updateLivreur);
router.delete('/:id', authorize('superadmin', 'admin'), deleteLivreur);

export default router;
