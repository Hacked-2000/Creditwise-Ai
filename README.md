# CreditWise AI

An AI-powered credit health platform built with Next.js 16, MongoDB, and Groq AI (LLaMA 3.1).

## What it does

- Track your credit score and all contributing factors (payment history, utilization, credit age, mix, inquiries)
- Manage financial accounts (credit cards, loans, savings, checking)
- Set credit score improvement goals with deadlines and priority levels
- Get personalized AI recommendations powered by Groq (LLaMA 3.1)

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database**: MongoDB via Prisma ORM
- **Auth**: NextAuth v5 (JWT sessions, bcrypt password hashing)
- **AI**: Groq API (llama-3.1-8b-instant) via AI SDK
- **Styling**: Tailwind CSS v4

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. Generate the Prisma client:
   ```bash
   npm run db:generate
   ```

4. Push the schema to your MongoDB database:
   ```bash
   npm run db:push
   ```

5. Run the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string (include database name, e.g. `.../creditwise?...`) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` in dev) |
| `GROQ_API_KEY` | Free API key from [console.groq.com](https://console.groq.com) |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & register pages
│   ├── (dashboard)/     # Protected dashboard pages
│   └── api/             # REST API routes
├── components/
│   ├── accounts/        # Financial account CRUD components
│   ├── credit-profile/  # Credit profile form
│   ├── dashboard/       # Dashboard widgets
│   ├── goals/           # Goal management components
│   ├── insights/        # AI insights display
│   └── layout/          # Sidebar, topbar
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── prisma.ts        # Prisma client singleton
│   ├── utils.ts         # Helper functions
│   └── validations.ts   # Zod schemas
└── types/               # Shared TypeScript types
```

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| GET/POST/PUT | `/api/credit-profile` | Manage credit profile |
| GET/POST | `/api/accounts` | List / add accounts |
| PUT/DELETE | `/api/accounts/:id` | Update / remove account |
| GET/POST | `/api/goals` | List / create goals |
| PUT/DELETE | `/api/goals/:id` | Update / delete goal |
| POST | `/api/ai/analyze` | Run Groq AI analysis |
| GET/PATCH | `/api/ai/insights` | Fetch / mark insights read |

## Deployment

Deploy to Vercel — connect your GitHub repo, add the environment variables in the Vercel dashboard, and it works out of the box.

---

Built by [Nishant Vashisth](https://github.com/Hacked-2000/Creditwise-Ai) · [LinkedIn](https://www.linkedin.com/in/nishant-vashisth-66445120b/)
