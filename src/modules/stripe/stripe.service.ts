import { stripe } from '../../lib/stripe'
import { prisma } from '../../lib/prisma'
import { addCredits } from '../credits/credits.service'

const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter Pack', credits: 100, amount: 500 },
  { id: 'pro', name: 'Pro Pack', credits: 500, amount: 2000 },
  { id: 'enterprise', name: 'Enterprise Pack', credits: 1500, amount: 5000 },
]

export const getPackages = () => CREDIT_PACKAGES

export const createCheckoutSession = async (
  userId: string,
  packageId: string
) => {
  const package_ = CREDIT_PACKAGES.find((p) => p.id === packageId)
  if (!package_) throw new Error('Invalid package')

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (!user) throw new Error('User not found')

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: package_.amount,
          product_data: {
            name: package_.name,
            description: `${package_.credits} Inkr credits`,
          },
        },
      },
    ],
    metadata: {
      userId,
      credits: package_.credits.toString(),
      packageId,
    },
    success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/dashboard?payment=cancelled`,
  })

  return { url: session.url }
}

export const handleWebhook = async (
  payload: Buffer,
  signature: string
) => {
  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch {
    throw new Error('Invalid webhook signature')
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { userId, credits } = session.metadata!

    await addCredits(
      userId,
      parseInt(credits),
      'PURCHASE',
      `Purchased ${credits} credits via Stripe`
    )
  }

  return { received: true }
}