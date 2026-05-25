import { prisma } from '../../lib/prisma'
import { generate } from '../../lib/groq'
import { deductCredits } from '../credits/credits.service'

const CREDITS_PER_GENERATION = 10

export const createGeneration = async (
  userId: string,
  prompt: string,
  systemPrompt?: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditBalance: true },
  })

  if (!user) throw new Error('User not found')
  if (user.creditBalance < CREDITS_PER_GENERATION) {
    throw new Error('Insufficient credits')
  }

  const result = await generate(prompt, systemPrompt)

  await deductCredits(
    userId,
    CREDITS_PER_GENERATION,
    `Generated: ${prompt.slice(0, 60)}`
  )

  const generation = await prisma.generation.create({
    data: {
      userId,
      title: prompt.slice(0, 60),
      prompt,
      response: result.content,
      model: result.model,
      creditsUsed: CREDITS_PER_GENERATION,
    },
  })

  return {
    generation,
    creditsUsed: CREDITS_PER_GENERATION,
    remainingBalance: user.creditBalance - CREDITS_PER_GENERATION,
  }
}

export const getGenerations = async (userId: string) => {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      model: true,
      creditsUsed: true,
      createdAt: true,
    },
  })
}

export const getGeneration = async (userId: string, generationId: string) => {
  const generation = await prisma.generation.findFirst({
    where: {
      id: generationId,
      userId,
    },
  })

  if (!generation) throw new Error('Generation not found')

  return generation
}