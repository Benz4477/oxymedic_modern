import express from 'express'
import {
  fetchDashboardStats,
  fetchMonthlyDeliveryCosts,
} from '../controllers/statsController.js'

const router = express.Router()

// Routes pour les statistiques du dashboard
router.get('/dashboard', fetchDashboardStats)
router.get('/frais/monthly', fetchMonthlyDeliveryCosts)

export default router
