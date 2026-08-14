# Anonymous Feedback

A full-stack anonymous messaging platform built with Next.js 16, where users can receive honest, identity-free feedback from anyone — powered by AI-suggested messages, real-time form validation, and a production-grade auth system.

**Live Demo:** [anonymousfeedback.site](https://anonymousfeedback.site) &nbsp;|&nbsp; **Author:** [Zohaib](https://github.com/M-Zohaib-Saeed)

---

## What It Does

Every registered user gets a public profile link (`/u/username`). Anyone visiting that link can send them an anonymous message — no account required. The sender can use AI-generated message suggestions (powered by Groq's Llama 3) or write their own. The recipient sees all messages on their private dashboard and can toggle whether they accept new messages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth v4 (Credentials Provider) |
| Email | Resend + React Email |
| AI | Groq API (`llama-3.1-8b-instant`) via Vercel AI SDK |
| Validation | Zod + React Hook Form |
| UI | shadcn/ui + Tailwind CSS |
| Deployment | Vercel |

---

## Features

- **Anonymous messaging** — anyone can send a message to a registered user's public link with no account required
- **AI message suggestions** — Groq's Llama model suggests creative open-ended questions, streamed in real time via `useCompletion`
- **Email verification** — OTP-based signup flow using Resend and a custom React Email template
- **Real-time username availability** — debounced Zod validation checks username uniqueness against the DB as you type
- **Accept/reject messages toggle** — users can turn off incoming messages at any time from their dashboard
- **Session-protected dashboard** — NextAuth Credentials session gates all private routes and API endpoints
- **One-click link copying** — profile URL copied to clipboard with visual feedback
- **Message deletion** — users can delete individual messages with an AlertDialog confirmation

---

## Architecture Highlights

**API Routes (Next.js App Router)**
- `POST /api/sign-up` — user registration with bcrypt password hashing, duplicate detection, OTP generation, and Resend email dispatch
- `GET /api/check-username-unique` — debounced real-time username availability check
- `POST /api/verify-code` — OTP verification with expiry check, flips `isVerified` flag on success
- `GET /api/get-messages` — MongoDB aggregation pipeline (`$match` → `$unwind` → `$sort` → `$group`) to return messages sorted newest-first
- `POST /api/accept-messages` + `GET /api/accept-messages` — read/write the user's `isAcceptingMessages` flag
- `DELETE /api/delete-message/[messageid]` — uses MongoDB `$pull` to remove a single embedded message document
- `POST /api/send-message` — validates recipient accepts messages before saving
- `POST /api/suggest-messages` — streams Groq AI completions via `streamText().toTextStreamResponse()`

**Auth**
NextAuth Credentials Provider validates against hashed passwords in MongoDB, enforces `isVerified` before allowing sign-in, and extends the JWT/session to include `_id`, `username`, and `isAcceptingMessages`. A custom `middleware.ts` (proxy) protects `/dashboard` and `/u/*` routes based on session state.

**Data Model**
Messages are stored as embedded subdocuments on the User document (`messages: Message[]`), avoiding a separate collection and making dashboard reads a single query. `verifyCode` and `verifyCodeExpiry` live on the User document too, cleaned up on successful verification.

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas cluster
- Resend account with a verified domain
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
git clone https://github.com/M-Zohaib-Saeed/anonymous-feedback.git
cd anonymous-feedback
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/anonymous_feedback

NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxx
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated app routes
│   │   ├── dashboard/      # User dashboard
│   │   └── layout.tsx      # Navbar wrapper
│   ├── (auth)/             # Public auth routes
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── verify/[username]/
│   ├── api/                # API route handlers
│   │   ├── auth/[...nextauth]/
│   │   ├── sign-up/
│   │   ├── verify-code/
│   │   ├── check-username-unique/
│   │   ├── accept-messages/
│   │   ├── get-messages/
│   │   ├── send-message/
│   │   ├── delete-message/[messageid]/
│   │   └── suggest-messages/
│   └── u/[username]/       # Public profile page (send anonymous message)
├── components/
│   ├── ui/                 # shadcn UI primitives
│   └── MessageCard.tsx     # Message display + delete confirmation
├── helpers/
│   └── sendVerificationEmail.ts
├── lib/
│   ├── dbConnect.ts        # Mongoose singleton connection
│   └── resend.ts
├── model/
│   └── User.ts             # Mongoose schema + TypeScript types
├── schemas/                # Zod validation schemas
└── types/
    └── ApiResponse.ts
```

---

## Deployment

Deployed on Vercel with MongoDB Atlas and Resend in production.

For production deployment:

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Set `NEXTAUTH_URL` to your Vercel domain
5. In MongoDB Atlas → Network Access → allow `0.0.0.0/0` (required for Vercel's dynamic IPs)
6. Ensure your Resend domain is verified and your `from` address matches

---

## What I Learned / Why I Built This

This project was intentionally scoped to cover the full production stack in one codebase — not just CRUD, but auth flows, email delivery, AI streaming, debounced validation, session-protected APIs, and embedded document modeling. The goal was to produce something I could walk through in a technical interview and explain every layer of, from the MongoDB aggregation pipeline to the NextAuth JWT callback to the Groq stream protocol mismatch I debugged between `toTextStreamResponse()` and `useCompletion`'s expected data-stream format.

It's part of a broader portfolio strategy targeting remote US/EU startup roles, where demonstrating breadth across the stack (plus the ability to debug production issues end-to-end) matters more than depth in any single tool.

---

## License

MIT