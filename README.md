# Really Brave Hearts (RBH)

> A gamified English learning platform for children aged 6-12 years

## Project Overview

**Really Brave Hearts** is an interactive learning platform designed to make English learning fun and engaging for children. The platform features:

- **4 Difficulty Levels**: Tailored content for different age groups (6-7, 7-8, 8-10, 10-12 years)
- **6 Question Types**: fix, open, multiple_choice, matching, spelling, audio
- **Gamification**: Points, levels, achievements, and streak tracking
- **AI-Powered**: Content generation using Zhipu AI GLM-5

## Migration Status

This is a **rewrite project** migrating from Vue 3 + Django (separate codebases) to a unified Next.js 15 full-stack architecture.

### Previous Architecture
```
┌─────────────┐        HTTP API        ┌─────────────┐
│  Vue 3 SPA  │ ◄─────────────────────► │   Django    │
│  (前端)      │                          │  (后端)     │
└─────────────┘                          └─────────────┘
```

### Current Architecture
```
┌────────────────────────────────────────────────┐
│                Next.js 15 App                  │
│  ┌─────────────────────────────────────────┐   │
│  │        Frontend (React + Tailwind)      │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │       API Routes + Server Actions       │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │   Prisma ORM + PostgreSQL (Supabase)    │   │
│  └─────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) with App Router |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Authentication | [NextAuth.js v5](https://authjs.dev/) |
| Database | [Prisma ORM](https://www.prisma.io/) + [Supabase](https://supabase.com/) |
| Deployment | [Vercel](https://vercel.com/) with auto-deploy on push |
| AI Integration | [Zhipu AI GLM-5](https://open.bigmodel.cn/) |

## Project Structure

```
really-brave-hearts/
├── core/                   # Main Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utility functions
│   │   └── styles/        # Global styles
│   ├── prisma/            # Database schema
│   └── public/            # Static assets
├── docs/                  # Project documentation
│   ├── execution-log.md   # Development execution log
│   └── MIGRATION_PLAN.md  # Migration roadmap
└── .internal/             # Internal documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or Vercel Postgres)
- GitHub account (for deployment)

### Installation

```bash
# Clone the repository
git clone git@github.com:harryhmx/really-brave-hearts.git

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

This project uses an agile development approach with continuous deployment:

1. **Feature Development**: Declare features in commit messages
2. **Auto-Deploy**: Push to main → Vercel auto-deploys
3. **Production Update**: Changes go live immediately after successful deploy

```bash
# Check status
git status

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin main
```

## License

MIT

---

Built with ❤️ for young learners
