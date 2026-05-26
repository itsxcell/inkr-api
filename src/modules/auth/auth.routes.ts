import { Router } from 'express'
import { register, login, me } from './auth.controller'
import { authenticate } from '../../middleware/authenticate'
import passport from 'passport'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, me)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'], session: false })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failed' }),
  async (req, res) => {
    const user = req.user as any
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, creditBalance: user.creditBalance } })
  }
)

router.get('/google/failed', (req, res) => {
  res.status(401).json({ error: 'Google authentication failed' })
})
export default router