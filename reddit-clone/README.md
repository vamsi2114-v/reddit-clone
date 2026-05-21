# Reddit Clone — Full Stack MVP

Next.js 14 · Prisma · PostgreSQL · NextAuth.js · Tailwind CSS

---

## 🚀 Quick Start (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in:
- `DATABASE_URL` — get from [Railway](https://railway.app) or [Supabase](https://supabase.com)
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` to generate one
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

### 3. Set up the database
```bash
npm run db:generate    # generate Prisma client
npm run db:push        # push schema to your database
npm run db:seed        # optional: add sample data
```

### 4. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Done — test it out
- Register at `/register`
- Create a community at `/r/create`
- Submit a post at `/submit`
- Vote and comment on posts

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home feed
│   ├── layout.tsx                # Root layout + Navbar
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Sign up page
│   ├── submit/page.tsx           # Create post
│   ├── post/[id]/page.tsx        # Post detail + comments
│   ├── r/
│   │   ├── [slug]/page.tsx       # Community page
│   │   └── create/page.tsx       # Create community
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/    # NextAuth handler
│       │   └── register/         # Register endpoint
│       ├── communities/          # GET list, POST create
│       ├── posts/                # GET feed, POST create
│       ├── votes/                # POST vote (up/down/toggle)
│       └── comments/             # POST comment
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Providers.tsx
│   ├── post/
│   │   ├── PostCard.tsx          # The core post component
│   │   ├── VoteButtons.tsx       # Optimistic voting UI
│   │   └── SortTabs.tsx          # New / Top toggle
│   ├── community/
│   │   └── CommunitySidebar.tsx
│   └── comment/
│       └── CommentSection.tsx
├── lib/
│   ├── prisma.ts                 # Singleton Prisma client
│   ├── auth.ts                   # NextAuth options
│   └── utils.ts                  # cn(), timeAgo(), voteCount()
└── types/
    └── next-auth.d.ts            # Session type extensions
```

---

## 🗄️ Database (Prisma Schema)

Models: **User → Post → Vote**, **Community → Post**, **Post → Comment**

```
User ──< Post ──< Vote
     ──< Comment
Community ──< Post
```

Key design decisions:
- `Vote` has a `@@unique([userId, postId])` — one vote per user per post
- `VoteType` enum: `UP | DOWN`
- `PostType` enum: `TEXT | IMAGE | LINK`
- All cascades on delete so no orphan records

---

## 🔑 Auth Flow

1. User registers → password hashed with bcrypt (10 rounds)
2. Login via NextAuth `CredentialsProvider`
3. JWT stored in cookie, session available server-side via `getServerSession()`
4. Protected API routes check `getServerSession()` and return 401 if not logged in

---

## ⚡ Features

| Feature | Implementation |
|---|---|
| Auth | NextAuth.js CredentialsProvider + bcrypt |
| Communities | CRUD via Prisma, unique slug routing |
| Posts | Text / Image (URL) / Link types |
| Voting | Optimistic UI, toggle/switch, `@@unique` constraint |
| Comments | Server-rendered, client-posted, `router.refresh()` |
| Sorting | `?sort=new` (createdAt desc) or `?sort=top` (votes count desc) |
| Skeleton loaders | Tailwind `animate-pulse` on loading states |
| Mobile responsive | Sidebar hidden on mobile, single-column layout |

---

## 🚢 Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/reddit-clone.git
git push -u origin main
```

### 2. Create a Vercel project
- Go to [vercel.com](https://vercel.com) → Import your repo
- Add environment variables in the Vercel dashboard:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` → set to your Vercel deployment URL (e.g. `https://your-app.vercel.app`)

### 3. Set up production database
- **Option A (Railway)**: Create a PostgreSQL service → copy `DATABASE_URL`
- **Option B (Supabase)**: Create a project → Settings → Database → copy connection string

### 4. Run migrations on production
In Vercel dashboard → Settings → Build & Development Settings:
```
Build Command: npm run db:generate && next build
```
Or run manually: `DATABASE_URL=<your-prod-url> npx prisma db push`

---

## 🛠 Common Issues

**`PrismaClientInitializationError`**: DATABASE_URL is wrong or DB is unreachable  
**`[next-auth] No secret`**: NEXTAUTH_SECRET is not set in .env  
**`Cannot find module '@prisma/client'`**: Run `npm run db:generate` first  
**Votes not persisting**: Check the `@@unique([userId, postId])` migration was applied  

---

## 📦 Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Passwords | bcryptjs |
| Toasts | react-hot-toast |
| Icons | lucide-react |
| Deployment | Vercel + Railway/Supabase |
