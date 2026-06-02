import express from 'express'
import {
  fetchDashboardStats,
  fetchMonthlyDeliveryCosts,
} from '../controllers/statsController.js'

import { protect } from '../middleware/auth.js'

const router = express.Router()
router.use(protect)

// Routes pour les statistiques du dashboard
router.get('/dashboard', fetchDashboardStats)
router.get('/frais/monthly', fetchMonthlyDeliveryCosts)

export default router
