# 🎉 Semana Maior — PWA Event App

A premium Progressive Web App (PWA) for the school event "Semana Maior" — built with Next.js 14, TypeScript, TailwindCSS, Framer Motion, Prisma, and MySQL.

---

## ✨ Features

- **PWA-First**: Install prompt on first visit, offline support, home screen icon
- **Home Page**: Hero section, countdown timer, quick access cards, today's highlights
- **Interactive Schedule**: Timeline view with day-based navigation, event types & statuses
- **Tournament System**: Group stage tables, match results, knockout bracket UI
- **Live Leaderboard**: Animated rankings with podium display and progress bars
- **Talents Page**: Bands, DJs, dance groups with featured highlight card
- **Photo Gallery**: Masonry-style grid gallery
- **Admin Panel**: Full CRUD for schedule, teams, matches, leaderboard, talents, gallery
- **NextAuth**: JWT-based admin authentication with credentials provider
- **Bottom Navigation**: Native app-like tab bar with active state animations

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| Database ORM | Prisma |
| Database | MySQL |
| Auth | NextAuth.js |
| PWA | next-pwa |
| UI Components | Radix UI / Shadcn |
| Icons | Lucide React |

---

## 🔧 Local Setup

### 1. Prerequisites

```bash
# Node.js 18+ required
node --version

# MySQL running locally (or use PlanetScale / Railway)
mysql --version
```

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd semana-maior
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# MySQL connection string
DATABASE_URL="mysql://root:password@localhost:3306/semana_maior"

# NextAuth (generate a random secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Database Setup

```bash
# Create the database in MySQL
mysql -u root -p -e "CREATE DATABASE semana_maior;"

# Push Prisma schema to the database
npm run db:push

# Seed with initial data
npm run db:seed
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Access

After seeding, you can access the admin panel:

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email**: `admin@semanamairor.edu`
- **Password**: `admin123`

> ⚠️ Change these credentials in `prisma/seed.ts` before deploying to production!

---

## 📱 PWA Installation

### Android / Chrome
1. Open the site in Chrome
2. The install prompt will appear automatically after 2 seconds
3. Tap "Instalar App Gratuito"

### iOS / Safari
1. Open the site in Safari
2. The iOS install instructions will appear
3. Tap the Share icon → "Adicionar à Tela Inicial"

### Features when installed:
- ✅ Full-screen app experience
- ✅ Bottom navigation bar
- ✅ Offline caching of pages
- ✅ Home screen icon
- ✅ Splash screen

---

## 🗂️ Project Structure

```
semana-maior/
├── app/
│   ├── layout.tsx              # Root layout with PWA meta tags
│   ├── page.tsx                # Home page
│   ├── schedule/page.tsx       # Schedule timeline
│   ├── tournament/page.tsx     # Tournament brackets
│   ├── leaderboard/page.tsx    # Live leaderboard
│   ├── talents/page.tsx        # Bands & performers
│   ├── gallery/page.tsx        # Photo gallery
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout (auth protected)
│   │   ├── login/page.tsx      # Admin login
│   │   ├── dashboard/page.tsx  # Admin dashboard
│   │   ├── schedule/page.tsx   # Manage schedule
│   │   ├── teams/page.tsx      # Manage teams
│   │   ├── matches/page.tsx    # Manage matches
│   │   ├── leaderboard/page.tsx # Manage rankings
│   │   ├── talents/page.tsx    # Manage talents
│   │   └── gallery/page.tsx    # Manage gallery
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth API
│       ├── schedule/           # Schedule CRUD
│       ├── teams/              # Teams CRUD
│       ├── matches/            # Matches CRUD
│       ├── leaderboard/        # Leaderboard CRUD
│       ├── talents/            # Talents CRUD
│       └── gallery/            # Gallery CRUD
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx       # iOS-style bottom navigation
│   │   ├── HeroSection.tsx     # Home hero with gradient
│   │   ├── CountdownTimer.tsx  # Animated countdown
│   │   ├── QuickAccessCards.tsx # Home quick access grid
│   │   ├── TodayHighlights.tsx # Today's events widget
│   │   ├── PageHeader.tsx      # Shared page header
│   │   └── Providers.tsx       # Session provider
│   ├── admin/
│   │   └── AdminSidebar.tsx    # Admin navigation sidebar
│   └── pwa/
│       └── PWAInstallPrompt.tsx # PWA install bottom sheet
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   └── prisma.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma           # Database models
│   └── seed.ts                 # Initial data seed
├── public/
│   ├── manifest.json           # Web app manifest
│   ├── sw-custom.js            # Custom service worker
│   └── icons/                  # App icons (see below)
├── next.config.js              # Next.js + PWA config
├── tailwind.config.ts          # Tailwind + custom tokens
└── .env.example                # Environment variables template
```

---

## 🎨 Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Brand Red | `#bc2a24` | Primary actions, accents |
| Brand Light | `#f1f0f0` | Background, secondary |
| Dark | `#0d0d0d` | Hero, dark cards |
| White | `#ffffff` | Cards, surfaces |

### Typography
- **Display**: Playfair Display (headings, hero text)
- **Body**: DM Sans (UI text, labels)

### Effects
- Glassmorphism (`.glass`, `.glass-dark`, `.glass-red`)
- Gradient backgrounds
- Live pulse animations
- Hover lift cards
- Smooth page transitions via Framer Motion

---

## 🖼️ App Icons

You need to generate icons for the PWA. Use a tool like [PWA Builder](https://www.pwabuilder.com/imageGenerator) or [Real Favicon Generator](https://realfavicongenerator.net/).

Required sizes: 72, 96, 128, 144, 152, 192, 384, 512px

Place them in `public/icons/` as:
```
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png
icon-192x192.png
icon-384x384.png
icon-512x512.png
```

---

## 🌐 Production Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL` (use PlanetScale or Railway for MySQL)
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET` (secure random string)

### Database (Production)

Options:
- **PlanetScale** (serverless MySQL) — free tier available
- **Railway** — easy MySQL hosting
- **AWS RDS** — for scale

```bash
# After connecting production DB
npm run db:push
npm run db:seed
```

---

## 📊 Database Models

| Model | Description |
|-------|-------------|
| `User` | Admin users with role |
| `Team` | Tournament teams |
| `Player` | Team members |
| `Tournament` | Tournament containers |
| `Group` | Tournament groups |
| `Match` | Individual matches |
| `ScheduleEvent` | Event agenda items |
| `LeaderboardEntry` | Overall rankings |
| `Talent` | Bands & performers |
| `GalleryImage` | Photo gallery |

---

## 🔮 Future Enhancements

- [ ] Push notifications for match updates
- [ ] Real-time updates with WebSockets / Server-Sent Events
- [ ] QR code check-in for students
- [ ] Photo upload from mobile
- [ ] Voting system for best team
- [ ] Live score ticker
- [ ] Student profiles / social features

---

## 📝 License

MIT — Escola SENAI / Instituto Federal
