import rateLimit from 'express-rate-limit'

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Generation limit reached, please try again in an hour' },
  standardHeaders: true,
  legacyHeaders: false,
})