import { Router } from 'express'
import express from 'express'
import { authenticate } from '../../middleware/authenticate'
import { packages, checkout, webhook } from './stripe.controller'

const router = Router()

router.post('/webhook', express.raw({ type: 'application/json' }), webhook)

router.use(authenticate)
router.get('/packages', packages)
router.post('/checkout', checkout)

export default router