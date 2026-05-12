import express from 'express'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/serials
// @desc    Récupérer tous les numéros de série
// @access  Private
router.get('/', protect, authorize('admin', 'commercial', 'technicien'), async (req, res) => {
  try {
    // Simulation de données pour le test
    const serials = [
      {
        id: 1,
        equipement: 'Fauteuil roulant électrique',
        numeroSerie: 'FR2024001',
        statut: 'disponible'
      }
    ]
    
    res.json({
      success: true,
      data: serials
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des numéros de série'
    })
  }
})

export default router
