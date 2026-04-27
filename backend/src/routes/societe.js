import express from 'express'
import {
  getSociete,
  updateSociete,
} from '../controllers/societeController.js'

const router = express.Router()

// Routes pour les informations de la société
router.get('/', getSociete)
router.put('/', updateSociete)

export default router
