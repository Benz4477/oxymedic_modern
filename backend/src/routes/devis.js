import express from 'express'
import { protect, authorizeModule } from '../middleware/auth.js'
import {
  getAllDevis,
  getDevisById,
  createDevis,
  updateDevis,
  deleteDevis,
  sendDevis,
  acceptDevis,
  convertDevis,
  getDevisStats
} from '../controllers/devisController.js'

const router = express.Router()

// @route   GET /api/devis
// @desc    Récupérer tous les devis
// @access  Private
router.get('/', protect, authorizeModule('devis'), getAllDevis)

// @route   GET /api/devis/stats
// @desc    Obtenir les statistiques des devis
// @access  Private
router.get('/stats', protect, authorizeModule('devis'), getDevisStats)

// @route   GET /api/devis/:id
// @desc    Récupérer un devis par son ID
// @access  Private
router.get('/:id', protect, authorizeModule('devis'), getDevisById)

// @route   POST /api/devis
// @desc    Créer un nouveau devis
// @access  Private
router.post('/', protect, authorizeModule('devis'), createDevis)

// @route   PUT /api/devis/:id
// @desc    Mettre à jour un devis
// @access  Private
router.put('/:id', protect, authorizeModule('devis'), updateDevis)

// @route   DELETE /api/devis/:id
// @desc    Supprimer un devis
// @access  Private
router.delete('/:id', protect, authorizeModule('devis'), deleteDevis)

// @route   PUT /api/devis/:id/send
// @desc    Envoyer un devis
// @access  Private
router.put('/:id/send', protect, authorizeModule('devis'), sendDevis)

// @route   PUT /api/devis/:id/accept
// @desc    Accepter un devis
// @access  Private
router.put('/:id/accept', protect, authorizeModule('devis'), acceptDevis)

// @route   POST /api/devis/:id/convert
// @desc    Convertir un devis en commande
// @access  Private
router.post('/:id/convert', protect, authorizeModule('devis'), convertDevis)

export default router
