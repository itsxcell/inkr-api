import type { Request, Response } from 'express'
import { registerSchema, loginSchema } from './auth.schema'
import { registerUser, loginUser,getMe } from './auth.service'
import type { AuthRequest } from '../../middleware/authenticate'

export const register = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      error: result.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const data = await registerUser(result.data)
    res.status(201).json(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      error: result.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const data = await loginUser(result.data)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getMe(req.userId!)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
}