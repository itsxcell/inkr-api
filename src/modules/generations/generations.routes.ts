import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { generate, list, single } from './generations.controller'

const router = Router()

router.use(authenticate)

router.post('/', generate)
router.get('/', list)
router.get('/:id', single)

export default router