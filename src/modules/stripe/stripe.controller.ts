import { Request, Response } from 'express'
import { AuthRequest } from '../../middleware/authenticate'
import {
  getPackages,
  createCheckoutSession,
  handleWebhook,
} from './stripe.service'

export const packages = async (req: AuthRequest, res: Response) => {
  res.status(200).json(getPackages())
}

export const checkout = async (req: AuthRequest, res: Response) => {
  const { packageId } = req.body

  if (!packageId) {
    res.status(400).json({ error: 'Package ID is required' })
    return
  }

  try {
    const data = await createCheckoutSession(req.userId!, packageId)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const webhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string

  if (!signature) {
    res.status(400).json({ error: 'No signature' })
    return
  }

  try {
    const data = await handleWebhook(req.body, signature)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}