import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { prisma } from '../lib/prisma'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value

        if (!email) {
          return done(new Error('No email from Google'))
        }

        let user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0].value,
              isVerified: true,
              subscription: {
                create: {
                  plan: 'FREE',
                  status: 'ACTIVE',
                },
              },
            },
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export default passport