import express from 'express'
import { protect, authorizeModule } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/devis
// @desc    Récupérer tous les devis
// @access  Private
router.get('/', protect, authorizeModule('devis'), async (req, res) => {
  try {
    // Simulation de données pour le test
    const devis = [
      {
        id: 1,
        reference: 'DEV-2024-001',
        client: 'Mohammed Alaoui',
        montant: 8500,
        statut: 'envoye'
      }
    ]
    
    res.json({
      success: true,
      data: devis
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des devis'
    })
  }
})

export default router
