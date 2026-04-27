import express from 'express'
import { protect, authorizeModule } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/livreurs
// @desc    Récupérer tous les livreurs
// @access  Private
router.get('/', protect, authorizeModule('livreurs'), async (req, res) => {
  try {
    // Simulation de données pour le test
    const livreurs = [
      {
        id: 1,
        nom: 'Ahmed Benali',
        tel: '0612345678',
        statut: 'actif'
      }
    ]
    
    res.json({
      success: true,
      data: livreurs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des livreurs'
    })
  }
})

export default router
