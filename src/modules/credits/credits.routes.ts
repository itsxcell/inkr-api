import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { balance, topUp, transactions } from './credits.controller'

const router = Router()

router.use(authenticate)

router.get('/balance', balance)
router.post('/topup', topUp)
router.get('/transactions', transactions)

export default router