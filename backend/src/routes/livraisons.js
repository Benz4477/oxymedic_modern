import express from 'express'
import { protect, authorizeModule } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/livraisons
// @desc    Récupérer toutes les livraisons
// @access  Private
router.get('/', protect, authorizeModule('livraisons'), async (req, res) => {
  try {
    // Simulation de données pour le test
    const livraisons = [
      {
        id: 1,
        commande: 'CMD-2024-001',
        client: 'Mohammed Alaoui',
        statut: 'en_cours'
      }
    ]
    
    res.json({
      success: true,
      data: livraisons
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des livraisons'
    })
  }
})

export default router
