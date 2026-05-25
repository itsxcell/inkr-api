import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import type { RegisterInput, LoginInput } from './auth.schema'

const JWT_SECRET = process.env.JWT_SECRET as string

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existing) {
    throw new Error('Email already in use')
  }

  const hashedPassword = await bcrypt.hash(input.password, 12)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      subscription: {
        create: {
          plan: 'FREE',
          status: 'ACTIVE',
        },
      },
    },
  })

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
  })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      creditBalance: user.creditBalance,
    },
  }
}

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user || !user.password) {
    throw new Error('Invalid credentials')
  }

  const isValid = await bcrypt.compare(input.password, user.password)

  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '7d',
  })

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      creditBalance: user.creditBalance,
    },
  }
}