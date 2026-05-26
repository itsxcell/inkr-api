import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import './config/passport'
import passport from 'passport'
import authRoutes from './modules/auth/auth.routes'
import creditsRoutes from './modules/credits/credits.routes'
import generationsRoutes from './modules/generations/generations.routes'
import { globalLimiter, generationLimiter } from './middleware/rateLimiter'



const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(globalLimiter)


app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'inkr-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/credits', creditsRoutes)
app.use('/api/generations', generationLimiter, generationsRoutes)

app.listen(PORT, () => {
  console.log(`Inkr API running on port ${PORT}`)
})

export default app