import { Response } from 'express'
import { AuthRequest } from '../../middleware/authenticate'
import {
  getBalance,
  addCredits,
  getTransactions,
} from './credits.service'

export const balance = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getBalance(req.userId!)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
}

export const topUp = async (req: AuthRequest, res: Response) => {
  const { amount, description } = req.body

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Invalid amount' })
    return
  }

  try {
    const data = await addCredits(
      req.userId!,
      amount,
      'PURCHASE',
      description || `Purchased ${amount} credits`
    )
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const transactions = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getTransactions(req.userId!)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}