// backend/src/routes/factures.js
import express from 'express'
import { protect, authorizeModule } from '../middleware/auth.js'
import {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
  markAsPaid,
  archiveFacture,
  getNextNumero,
  getFactureStats
} from '../controllers/factureController.js'

const router = express.Router()

// @route   GET /api/factures
// @desc    Récupérer toutes les factures
// @access  Private
router.get('/', protect, authorizeModule('facturation'), getAllFactures)

// @route   GET /api/factures/stats
// @desc    Obtenir les statistiques des factures
// @access  Private
router.get('/stats', protect, authorizeModule('facturation'), getFactureStats)

// @route   GET /api/factures/next-number/:type
// @desc    Obtenir le prochain numéro de facture
// @access  Private
router.get('/next-number/:type', protect, authorizeModule('facturation'), getNextNumero)

// @route   GET /api/factures/:id
// @desc    Récupérer une facture par son ID
// @access  Private
router.get('/:id', protect, authorizeModule('facturation'), getFactureById)

// @route   POST /api/factures
// @desc    Créer une nouvelle facture
// @access  Private
router.post('/', protect, authorizeModule('facturation'), createFacture)

// @route   PUT /api/factures/:id
// @desc    Mettre à jour une facture
// @access  Private
router.put('/:id', protect, authorizeModule('facturation'), updateFacture)

// @route   DELETE /api/factures/:id
// @desc    Supprimer une facture
// @access  Private
router.delete('/:id', protect, authorizeModule('facturation'), deleteFacture)

// @route   POST /api/factures/:id/pay
// @desc    Marquer une facture comme payée
// @access  Private
router.post('/:id/pay', protect, authorizeModule('facturation'), markAsPaid)

// @route   POST /api/factures/:id/archive
// @desc    Archiver une facture
// @access  Private
router.post('/:id/archive', protect, authorizeModule('facturation'), archiveFacture)

export default router
