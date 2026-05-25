import { prisma } from '../../lib/prisma'
import { TransactionType } from '@prisma/client'

export const getBalance = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditBalance: true },
  })

  if (!user) throw new Error('User not found')

  return { creditBalance: user.creditBalance }
}

export const addCredits = async (
  userId: string,
  amount: number,
  type: TransactionType,
  description: string
) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { creditBalance: { increment: amount } },
      select: { creditBalance: true },
    })

    await tx.creditTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
      },
    })

    return user
  })

  return result
}

export const deductCredits = async (
  userId: string,
  amount: number,
  description: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditBalance: true },
  })

  if (!user) throw new Error('User not found')
  if (user.creditBalance < amount) throw new Error('Insufficient credits')

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { creditBalance: { decrement: amount } },
      select: { creditBalance: true },
    })

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,
        type: 'USAGE',
        description,
      },
    })

    return updated
  })

  return result
}

export const getTransactions = async (userId: string) => {
  const transactions = await prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return transactions
}