# SpendWise - AI-Powered Expense Tracker

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Stack-MERN-orange" alt="Stack">
</p>

> **SpendWise** is an AI-powered unified expense tracker built specifically for India. It aggregates financial transactions from multiple sources (UPI, cards, wallets) and translates cryptic bank narratives into plain, human-readable language.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend API](#backend-api)
- [Frontend](#frontend)
- [Design System](#design-system)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality
- **Unified Transaction Tracking** - Connect all your Indian financial accounts in one place
- **AI-Powered Translation** - AI transforms cryptic bank codes like `UPI/123@YBL/SWIGGY` into plain language like "Swiggy dinner order via PhonePe"
- **CSV Import** - Upload bank statements from 40+ Indian banks
- **Smart Analytics** - Monthly spending trends, category breakdowns, budget alerts

### Supported Sources
- UPI (Unified Payments Interface)
- Credit/Debit Cards
- Digital Wallets (PhonePe, Paytm, etc.)
- Bank Accounts

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Zustand | State Management |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Zod | Validation |
| Winston | Logging |

### Integrations
- **AI** - AI transaction translation
- **Cloudinary** - File storage for CSV statements
- **Google OAuth** - Social authentication

---

## Project Structure

```
Sem2Project/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── IMPLEMENTATION_PLAN.md
│   ├── SYSTEM_DESIGN.md
│   └── package.json
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Helper utilities
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client services
│   │   └── store/       # Zustand stores
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── DESIGN/                 # UI/UX design specifications
│   ├── dashboard_neobrutalist/
│   ├── landing_page_neobrutalist/
│   ├── login_page_neobrutalist/
│   ├── register_page_neobrutalist/
│   ├── settings_neobrutalist/
│   └── transaction_feed_neobrutalist/
│
├── docs/                   # Documentation
│   └── superpowers/
│
├── .opencode/              # OpenCode configuration
├── .playwright-mcp/        # Playwright test configs
├── prompts.md              # Design prompts for Figma
├── 01.features_checklist.md
├── 02.resource_list.md
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Configure your environment variables

# Start development server
npm run dev
```

The backend API runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on `http://localhost:5173`

---

## Backend API

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/google` | Google OAuth |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/:id` | Get transaction detail |
| PATCH | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| POST | `/api/transactions/upload-csv` | Bulk CSV import |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/spending-by-category` | Category breakdown |
| GET | `/api/analytics/monthly-trend` | Monthly spending trend |

---

## Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#F59E0B` | CTAs, highlights (Amber) |
| Accent | `#8B5CF6` | Secondary elements (Purple) |
| Background | `#0F172A` | App background (Slate-950) |
| Surface | `#1E293B` | Cards (Slate-900) |
| Border | `#334155` | Subtle borders |
| Text Heading | `#FFFFFF` | Headings |
| Text Body | `#CBD5E1` | Body text (Slate-300) |

### Typography

- **Font Family**: IBM Plex Sans
- **Icons**: Lucide / Heroicons (outline style, 2px stroke)

### Component Styling

- **Border Radius**: 12px for cards, 8px for buttons
- **Effects**: Subtle glow on primary elements, backdrop blur on nav

---

## Security

### Authentication
- JWT stored in httpOnly, Secure, SameSite=Strict cookies
- Password hashing with bcrypt (salt factor 12)
- Google OAuth integration

### Input Validation
- Zod schema-based validation
- mongo-sanitize for NoSQL injection prevention

### Infrastructure
- Helmet.js for security headers
- CORS configured for frontend domain
- express-rate-limit for brute force prevention
- Winston structured JSON logging

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

