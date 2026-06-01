import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAllLivraisons, getLivraisonById, createLivraison, updateLivraison, deleteLivraison } from '../controllers/livraisonController.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('superadmin', 'admin', 'employe', 'livreur'), getAllLivraisons);
router.get('/:id', authorize('superadmin', 'admin', 'employe', 'livreur'), getLivraisonById);
router.post('/', authorize('superadmin', 'admin', 'employe'), createLivraison);
router.put('/:id', authorize('superadmin', 'admin', 'employe'), updateLivraison);
router.delete('/:id', authorize('superadmin', 'admin'), deleteLivraison);

export default router;
