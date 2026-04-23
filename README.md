# SpendWise

AI-powered expense tracker for India — aggregates transactions from UPI, cards, and wallets with intelligent categorization.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Security](#security)
- [License](#license)

---

## Features

- **Unified Tracking** — Connect all Indian financial accounts in one dashboard
- **AI Summarization** — Translates cryptic bank codes into plain descriptions (e.g., `UPI/123@YBL/SWIGGY` becomes "Swiggy dinner via PhonePe")
- **CSV Import** — Bulk upload bank statements from 40+ Indian banks
- **Analytics** — Monthly trends, category breakdowns, spending insights
- **Multi-source Support** — UPI, credit/debit cards, digital wallets, bank accounts

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Redux Toolkit | State management |
| TanStack Query | Server state |
| React Router | Navigation |
| Radix UI | Accessible components |
| Recharts | Data visualization |
| Framer Motion | Animations |
| Lottie | Micro-interactions |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| Zod | Schema validation |
| Winston | Structured logging |

### Integrations

- Google OAuth
- Cloudinary (file storage)

---

## Project Structure

```
SpendWise/
|-- backend/
|   |-- src/
|   |   |-- config/         # Environment & app configuration
|   |   |-- controllers/    # Request handlers
|   |   |-- middleware/     # Auth, validation, rate limiting
|   |   |-- models/         # Mongoose schemas (User, Transaction)
|   |   |-- routes/         # API route definitions
|   |   |-- services/       # Business logic (AI, CSV parsing)
|   |   |-- utils/          # Helpers (logger, validators)
|   |   |-- types/          # TypeScript type definitions
|   |   |-- server.ts       # Application entry point
|   |   |-- app.ts          # Express app setup
|   |-- package.json
|   |-- tsconfig.json
|
|-- frontend/
|   |-- src/
|   |   |-- components/      # Reusable UI components
|   |   |   |-- ui/         # Base components (Button, Card, Input)
|   |   |   |-- forms/      # Form components (LoginForm, TransactionForm)
|   |   |   |-- charts/     # Visualization components
|   |   |-- pages/          # Route page components
|   |   |-- store/          # Redux store & slices
|   |   |-- services/       # API client (axios)
|   |   |-- hooks/          # Custom React hooks
|   |   |-- lib/            # Utilities (cn, formatters)
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |-- index.html
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js
|
|-- DESIGN/                 # UI/UX mockups (Figma exports)
|   |-- dashboard_neobrutalist/
|   |-- landing_page_neobrutalist/
|   |-- transaction_feed_neobrutalist/
|
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or pnpm

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, OpenAI key, etc.

# Start development server
npm run dev
```

Backend runs at `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

### Environment Variables

**Backend (.env)**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/spendwise
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Get current user |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List user transactions |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/:id` | Get transaction details |
| PATCH | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| POST | `/api/transactions/upload-csv` | Bulk import from CSV |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/spending-by-category` | Spending breakdown by category |
| GET | `/api/analytics/monthly-trend` | Monthly spending trend |

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#F59E0B` | CTAs, highlights (Amber) |
| Accent | `#8B5CF6` | Secondary actions (Violet) |
| Background | `#0F172A` | App background (Slate-950) |
| Surface | `#1E293B` | Cards, panels (Slate-800) |
| Border | `#334155` | Dividers, outlines (Slate-700) |
| Text Primary | `#FFFFFF` | Headings |
| Text Secondary | `#CBD5E1` | Body text (Slate-300) |

### Typography

- **Font**: IBM Plex Sans
- **Weights**: 400 (body), 500 (medium), 600 (semibold), 700 (headings)
- **Icons**: Lucide React (2px stroke, outline style)

### Components

- **Border Radius**: 12px (cards), 8px (buttons), 6px (inputs)
- **Shadows**: Subtle glow on primary elements
- **Backdrop**: Blur effect on navigation

---

## Security

| Layer | Implementation |
|-------|----------------|
| Auth | JWT in httpOnly cookies, bcrypt password hashing (cost factor 12) |
| Input | Zod validation, mongo-sanitize for NoSQL injection prevention |
| Headers | Helmet.js security headers |
| CORS | Configured for frontend origin only |
| Rate Limiting | express-rate-limit on auth endpoints |
| Logging | Winston structured JSON logs |

---

## License

MIT License - see [LICENSE](LICENSE) file for details.
