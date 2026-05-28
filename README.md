# Inkr API

> AI writing assistant API for African professionals — built for speed, designed for scale.

Live URL: `https://inkr-api.onrender.com`

---

## What is Inkr?

Inkr is a backend API powering an AI writing assistant targeted at African professionals. Users can generate business documents — proposals, emails, pitch decks — using large language models, with a credit-based billing system and Stripe payment integration.

This project was built to demonstrate production-grade backend architecture using modern Node.js tooling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| AI Provider | Groq (llama-3.3-70b-versatile) |
| Auth | JWT + Google OAuth 2.0 |
| Payments | Stripe |
| Deployment | Render |

---

## Architecture

```
src/
├── config/          # Passport OAuth strategy
├── lib/             # Shared infrastructure (Prisma, Groq, Stripe clients)
├── middleware/      # JWT authentication, rate limiting
└── modules/
    ├── auth/        # Register, login, Google OAuth, /me
    ├── credits/     # Balance, top-up, transaction history
    ├── generations/ # AI generation, history
    └── stripe/      # Checkout sessions, webhook handler
```

---

## Key Design Decisions

**PostgreSQL over MongoDB** — relational data fits the billing and credits model. ACID guarantees matter when money is involved.

**Abstracted AI provider** — Groq is isolated in `src/lib/groq.ts`. Swapping to OpenAI or Gemini requires changing one file.

**Atomic credit operations** — every credit change runs inside a Prisma transaction. Balance update and transaction log always succeed or fail together.

**Immutable transaction log** — `CreditTransaction` records have no `updatedAt`. An audit trail you can edit is not an audit trail.

**Webhook-driven payments** — credit top-up is triggered by Stripe's webhook, never by the client. Prevents payment spoofing.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Credits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/credits/balance` | Get credit balance |
| GET | `/api/credits/transactions` | Get transaction history |
| POST | `/api/credits/topup` | Manual top-up (admin/test) |

### Generations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/generations` | Create AI generation (costs 10 credits) |
| GET | `/api/generations` | List generation history |
| GET | `/api/generations/:id` | Get single generation |

### Stripe
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stripe/packages` | List credit packages |
| POST | `/api/stripe/checkout` | Create Stripe checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook handler |

---

## Running Locally

```bash
git clone https://github.com/itsxcell/inkr-api.git
cd inkr-api
npm install
npx prisma generate
npm run dev
```

Required `.env` variables:

```
DATABASE_URL=
JWT_SECRET=
GROQ_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLIENT_URL=
```

---

## Author

**Excel Afonime** — Backend Developer  
[github.com/itsxcell](https://github.com/itsxcell) · excelafonime@gmail.com