import express from 'express'
import { protect, authorizeModule } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/factures
// @desc    Récupérer toutes les factures
// @access  Private
router.get('/', protect, authorizeModule('facturation'), async (req, res) => {
  try {
    // Simulation de données pour le test
    const factures = [
      {
        id: 1,
        reference: 'FAC-2024-001',
        client: 'Mohammed Alaoui',
        montant: 8500,
        statut: 'payee'
      }
    ]
    
    res.json({
      success: true,
      data: factures
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des factures'
    })
  }
})

export default router
