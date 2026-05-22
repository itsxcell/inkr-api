# Inkr — Build Plan

**Tagline:** Write like you mean business  
**Target:** African professionals — proposals, emails, business docs

## Stack
- Runtime: Node.js
- Language: TypeScript
- Framework: Express.js
- ORM: Prisma
- Database: PostgreSQL (Supabase free tier)
- AI Provider: Groq API (free tier)
- Auth: JWT + Google OAuth
- Payments: Stripe (test mode)
- Deployment: Render

## Modules (Build Order)
1. Project setup + Prisma schema
2. Auth (JWT + Google OAuth)
3. Credits system
4. AI module (Groq wrapper + streaming)
5. Prompt history
6. Stripe integration
7. Rate limiting
8. Deployment

## Branding Notes
- Document architecture decisions in README as we build
- Each module = a talking point for clients