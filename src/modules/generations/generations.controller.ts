import { Response } from 'express'
import { AuthRequest } from '../../middleware/authenticate'
import {
  createGeneration,
  getGenerations,
  getGeneration,
} from './generations.service'

export const generate = async (req: AuthRequest, res: Response) => {
  const { prompt, systemPrompt } = req.body

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    res.status(400).json({ error: 'Prompt is required' })
    return
  }

  try {
    const data = await createGeneration(req.userId!, prompt, systemPrompt)
    res.status(201).json(data)
  } catch (error: any) {
    if (error.message === 'Insufficient credits') {
      res.status(402).json({ error: error.message })
      return
    }
    res.status(500).json({ error: error.message })
  }
}

export const list = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getGenerations(req.userId!)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const single = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getGeneration(req.userId!, req.params.id as string)
    res.status(200).json(data)
  } catch (error: any) {
    res.status(404).json({ error: error.message })
  }
}