# SpendWise

A modern financial transaction management application for Indian users — track expenses, analyze spending patterns, and manage transactions with AI-powered insights.

---

## Design & Documentation

| Resource | Link | Description |
|----------|------|-------------|
| 🎨 **Figma Design** | [View Design](https://www.figma.com/design/xfkvF45PRX2rzIEUrrT7bC/Spendwise?node-id=0-1&t=gBMgPX4ixG5aSHdj-0) | Complete UI/UX design system with all screens and components |
| 📚 **API Docs** | [View Documentation](https://documenter.getpostman.com/view/50840641/2sBXqKof1J) | Postman API documentation with endpoints and examples |
| 🎥 **Demo Video** | [Watch on YouTube](https://www.youtube.com/watch?v=mqEuDUiEuwU) | Walkthrough of SpendWise features and functionality |

---

## Table of Contents

- [Design & Documentation](#design--documentation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [License](#license)

---

## Features

### Authentication & User Management
- **Secure Authentication** — JWT-based login and registration with httpOnly cookies
- **Google OAuth Integration** — One-click login with Google (optional)
- **Protected Routes** — Automatic redirect to login for unauthorized access
- **Persistent Sessions** — Stay logged in across browser sessions
- **Profile Management** — Update name, monthly budget, preferred language, avatar
- **Account Deletion** — Self-service account deletion with data cleanup

### Transaction Management
- **Add Transactions** — Manually add income or expense transactions
- **Edit & Delete** — Modify or remove existing transactions
- **Transaction Feed** — View all transactions with card-based layout
- **CSV Import** — Bulk upload transactions from 40+ Indian banks (HDFC, SBI, ICICI, Axis, Kotak)
- **Smart Categorization** — AI-powered transaction description translation and categorization via OpenAI
- **Filtering** — Filter transactions by type, category, source, date range, amount range
- **Search** — Full-text search across transaction descriptions
- **Pagination** — Navigate through transaction history efficiently
- **Recurring Transactions** — Mark transactions as recurring
- **Tags** — Add custom tags to transactions

### Analytics & Insights
- **Spending Pie Chart** — Visual breakdown of expenses by category
- **Monthly Trends** — Track spending patterns over time with line charts
- **Dashboard Summary** — Current month spend, income, savings rate, budget utilization
- **Source Breakdown** — Analyze spending by payment source (UPI, Card, NEFT, etc.)
- **Top Merchants** — Identify top spending destinations

### User Experience
- **Dark/Light Theme** — Toggle between themes with ThemeContext (system preference detection)
- **Responsive Design** — Works on desktop, tablet, and mobile devices
- **Loading States** — Skeleton loaders and Lottie animations for smooth UX
- **Toast Notifications** — Real-time feedback for user actions via Radix Toast
- **Error Boundary** — Graceful error handling with fallback UI and retry options
- **Form Validation** — Client-side validation with Zod schemas
- **Debounced Search** — Efficient search with useDebounce hook

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.2.2 | Type safety |
| Vite | 5.1.4 | Build tool & dev server |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Redux Toolkit | 2.2.1 | State management |
| React Router DOM | 6.22.1 | Client-side routing |
| Radix UI | Various | Accessible component primitives |
| Recharts | 2.12.2 | Data visualization |
| Framer Motion | 11.0.5 | Animations |
| Lottie React | 2.4.0 | Micro-interactions |
| Lucide React | 0.344.0 | Icon library |
| Formik | 2.4.5 | Form handling (some forms) |
| React Hook Form | 7.50.1 | Form handling (primary) |
| Zod | 3.22.4 | Schema validation |
| Axios | 1.6.7 | HTTP client |
| React Dropzone | 14.2.3 | File upload (CSV) |
| Tailwind Merge | 2.2.1 | Class merging utility |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >=18 | Runtime |
| Express | 5.2.1 | Web framework |
| TypeScript | 6.0.2 | Type safety |
| MongoDB | Latest | Database |
| Mongoose | 9.4.1 | ODM (Object Document Mapper) |
| JWT (jsonwebtoken) | 9.0.3 | Authentication tokens |
| bcryptjs | 3.0.3 | Password hashing (cost factor 12) |
| OpenAI SDK | 6.34.0 | AI transaction summarization |
| PapaParse | 5.5.3 | CSV parsing |
| Multer | 2.1.1 | File upload handling |
| Winston | 3.19.0 | Structured logging |
| Helmet | 8.1.0 | Security headers |
| CORS | 2.8.6 | Cross-origin resource sharing |
| express-mongo-sanitize | 2.2.0 | NoSQL injection prevention |
| Morgan | 1.10.1 | HTTP request logging |
| Cookie Parser | 1.4.7 | Cookie parsing |
| Zod | 4.3.6 | Schema validation |
| Vitest | 4.1.5 | Testing framework |
| Supertest | 7.2.2 | HTTP endpoint testing |
| MongoDB Memory Server | 11.0.1 | In-memory MongoDB for tests |

---

## Project Structure

```
SpendWise/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui base components
│   │   │   │   ├── badge.tsx             # Badge variants
│   │   │   │   ├── button.tsx            # Button with variants
│   │   │   │   ├── card.tsx              # Card surface
│   │   │   │   ├── dialog.tsx            # Modal dialogs
│   │   │   │   ├── input.tsx             # Input fields
│   │   │   │   ├── label.tsx             # Form labels
│   │   │   │   ├── skeleton.tsx          # Loading skeletons
│   │   │   │   ├── toaster.tsx          # Toast host
│   │   │   │   ├── toast.tsx            # Toast primitives
│   │   │   │   └── use-toast.ts         # Toast hook
│   │   │   ├── AddTransactionModal.tsx   # Add transaction form
│   │   │   ├── CSVUploader.tsx         # CSV drag-and-drop upload
│   │   │   ├── EditTransactionModal.tsx  # Edit transaction form
│   │   │   ├── ErrorBoundary.tsx       # Error fallback UI
│   │   │   ├── Layout.tsx              # App shell with sidebar
│   │   │   ├── LoadingAnimation.tsx    # Lottie animations
│   │   │   ├── MonthlyTrendChart.tsx    # Recharts line chart
│   │   │   ├── Pagination.tsx          # Page navigation
│   │   │   ├── ProtectedRoute.tsx      # Auth route guard
│   │   │   ├── SpendingPieChart.tsx    # Recharts pie chart
│   │   │   ├── TransactionCard.tsx     # Transaction display card
│   │   │   └── TransactionFilters.tsx  # Filter controls
│   │   ├── context/
│   │   │   └── ThemeContext.tsx        # Theme provider (light/dark/system)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # Authentication hook
│   │   │   └── useDebounce.ts         # Debounce hook
│   │   ├── lib/
│   │   │   └── utils.ts               # Utility functions (cn merge)
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx      # Analytics dashboard
│   │   │   ├── LandingPage.tsx       # Marketing homepage
│   │   │   ├── LoginPage.tsx         # Login form
│   │   │   ├── RegisterPage.tsx      # Registration form
│   │   │   ├── SettingsPage.tsx       # User preferences
│   │   │   └── TransactionFeedPage.tsx # Transaction list
│   │   ├── services/
│   │   │   └── api.ts                 # Axios instance & interceptors
│   │   ├── store/
│   │   │   ├── index.ts               # Redux store configuration
│   │   │   └── slices/
│   │   │       ├── authSlice.ts        # Auth state & actions
│   │   │       ├── transactionSlice.ts # Transaction state & CRUD
│   │   │       └── uiSlice.ts          # UI state (theme, sidebar)
│   │   ├── App.tsx                      # Main app with routing
│   │   ├── main.tsx                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── public/                          # Static assets
│   ├── index.html                       # HTML entry
│   ├── package.json                     # Dependencies & scripts
│   ├── vite.config.ts                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind theme
│   ├── tsconfig.json                    # TypeScript config
│   ├── postcss.config.js                # PostCSS config
│   ├── components.json                  # shadcn/ui config
│   └── Dockerfile                       # Multi-stage build
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analyticsController.ts   # Analytics endpoints handler
│   │   │   ├── authController.ts       # Auth endpoints handler
│   │   │   ├── importController.ts     # CSV import handler
│   │   │   └── transactionController.ts # Transaction CRUD handler
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts      # JWT authentication
│   │   │   ├── errorMiddleware.ts     # Centralized error handling
│   │   │   └── uploadMiddleware.ts   # Multer file upload
│   │   ├── models/
│   │   │   ├── PatternCache.ts        # OpenAI response cache
│   │   │   ├── Transaction.ts         # Transaction schema
│   │   │   └── User.ts               # User schema
│   │   ├── routes/
│   │   │   ├── analyticsRoutes.ts    # Analytics endpoints
│   │   │   ├── authRoutes.ts         # Auth endpoints
│   │   │   ├── healthRoutes.ts       # Health check
│   │   │   ├── importRoutes.ts       # CSV import endpoint
│   │   │   └── transactionRoutes.ts  # Transaction CRUD endpoints
│   │   ├── services/
│   │   │   ├── analyticsService.ts   # Analytics aggregation
│   │   │   ├── authService.ts        # Auth business logic
│   │   │   ├── importService.ts      # CSV parsing (HDFC, SBI, etc.)
│   │   │   ├── openaiService.ts      # OpenAI integration
│   │   │   └── transactionService.ts # Transaction CRUD logic
│   │   ├── utils/
│   │   │   ├── AppError.ts           # Custom error class
│   │   │   └── logger.ts             # Winston logger
│   │   ├── config/
│   │   │   └── env.ts                # Environment validation
│   │   ├── __tests__/
│   │   │   ├── auth.test.ts          # Auth endpoint tests
│   │   │   ├── transactions.test.ts  # Transaction tests
│   │   │   └── userCreation.test.ts # User creation tests
│   │   ├── app.ts                       # Express app setup
│   │   └── server.ts                    # Server entry point
│   ├── scripts/
│   │   └── seed.ts                      # Database seed script
│   ├── logs/                           # Runtime logs (gitignored)
│   ├── package.json                     # Dependencies & scripts
│   ├── tsconfig.json                    # TypeScript config
│   ├── test-startup.ts                  # Test startup utility
│   ├── .env.example                    # Environment template
│   └── Dockerfile                       # Multi-stage build
│
└── README.md                          # This file
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or pnpm
- OpenAI API key (optional, for AI features)

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

Backend runs at `http://localhost:5000`

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
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spendwise
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-openai-key (optional)
NODE_ENV=development
```

**Frontend (.env or .env.local)**

```env
VITE_API_URL=http://localhost:5000
```

### Build for Production

**Backend:**
```bash
cd backend
npm run build  # Compiles TypeScript
npm start        # Runs compiled JS
```

**Frontend:**
```bash
cd frontend
npm run build    # Builds to dist/
npm run preview  # Preview production build
```

### Docker Deployment

**Backend:**
```bash
cd backend
docker build -t spendwise-backend .
docker run -p 5000:5000 --env-file .env spendwise-backend
```

**Frontend:**
```bash
cd frontend
docker build -t spendwise-frontend .
docker run -p 80:80 spendwise-frontend
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login with credentials | No |
| POST | `/api/auth/google` | Google OAuth login | No |
| POST | `/api/auth/logout` | Logout (clear cookie) | Yes |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PATCH | `/api/auth/profile` | Update profile | Yes |
| DELETE | `/api/auth/me` | Delete account + data | Yes |

### Transaction Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/transactions` | List transactions (with filters & pagination) | Yes |
| POST | `/api/transactions` | Create new transaction | Yes |
| GET | `/api/transactions/:id` | Get single transaction | Yes |
| PATCH | `/api/transactions/:id` | Update transaction | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction | Yes |

**Query Parameters for GET /transactions:**
- `page` (default: 1) - Page number
- `limit` (default: 20, max: 100) - Items per page
- `startDate` - Filter by date range start
- `endDate` - Filter by date range end
- `category` - Filter by category (Food & Dining, Transport, etc.)
- `source` - Filter by source (UPI, CARD, NEFT, etc.)
- `type` - Filter by type (debit/credit)
- `minAmount` - Minimum amount filter
- `maxAmount` - Maximum amount filter
- `search` - Full-text search
- `tags` - Filter by tags (comma-separated)
- `isRecurring` - Filter recurring transactions
- `sortBy` (default: date) - Sort field
- `sortOrder` (default: desc) - Sort direction

### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/analytics/dashboard` | Dashboard summary (spend, income, savings rate) | Yes |
| GET | `/api/analytics/categories` | Spending by category | Yes |
| GET | `/api/analytics/monthly-trend` | Monthly spending trend | Yes |
| GET | `/api/analytics/sources` | Spending by payment source | Yes |
| GET | `/api/analytics/top-merchants` | Top merchants by spend | Yes |

**Query Parameters for Analytics:**
- `startDate` - Date range start
- `endDate` - Date range end
- `months` (default: 6, max: 24) - Months for trend
- `limit` (default: 10, max: 50) - Limit for top merchants

### Import Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/import/csv` | Bulk import CSV transactions | Yes |

**CSV Import Details:**
- Accepts multipart/form-data with field name `file`
- Supports 40+ Indian bank formats (HDFC, SBI, ICICI, Axis, Kotak)
- Auto-detects bank format from CSV headers
- Parses UPI IDs, bank references, merchant names
- Bulk inserts with error handling (returns created/failed counts)

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/health` | Health check endpoint | No |

---

## Usage Guide

### Authentication Flow

1. Navigate to the landing page at `/`
2. Click "Login" or "Register" to access auth pages
3. Fill in credentials (email, password) or use Google OAuth
4. After successful authentication, you'll be redirected to `/analytics`
5. JWT token is stored in httpOnly cookie for security

### Managing Transactions

**Adding a Transaction:**
1. Navigate to `/feed` (Transaction Feed)
2. Click "Add Transaction" button
3. Fill in transaction details:
   - Type (Debit/Credit)
   - Amount
   - Category (Food & Dining, Transport, etc.)
   - Description (auto-translated by AI if OpenAI enabled)
   - Source (UPI, Card, NEFT, etc.)
   - Date
   - Tags (optional)
   - Notes (optional)
4. Submit to save

**Editing a Transaction:**
1. Find the transaction in the feed
2. Click the edit icon on the transaction card
3. Modify details in the modal
4. Save changes

**Deleting a Transaction:**
1. Find the transaction in the feed
2. Click the delete icon
3. Confirm deletion (irreversible)

**Importing CSV:**
1. Navigate to the Transaction Feed or Settings page
2. Use the CSV Upload component
3. Drag and drop or click to select a CSV file
4. System auto-detects bank format (HDFC, SBI, ICICI, etc.)
5. Bulk imports all valid transactions
6. Shows success/failure counts

### Analytics Dashboard

Navigate to `/analytics` to view:

**Dashboard Summary:**
- Current month spending
- Current month income
- Last month spending (comparison)
- Total transactions this month
- Average daily spending
- Top spending category
- Budget utilization percentage
- Savings rate

**Charts:**
- **Spending Pie Chart** — Breakdown of expenses by category with percentages
- **Monthly Trend Chart** — Line chart showing debit/credit trends over time

**Additional Analytics:**
- **Source Breakdown** — Pie chart of spending by payment method
- **Top Merchants** — Bar list of top spending destinations

### Settings

Navigate to `/settings` to:

- **Theme Toggle** — Switch between Light/Dark/System themes
- **Profile Management** — Update name, monthly budget, preferred language (English/Hindi), avatar
- **CSV Import** — Bulk upload transactions
- **Account Deletion** — Permanently delete account and all associated data

### Theme Switching

Click the theme toggle in the layout header to switch between:
- ☀️ Light mode
- 🌙 Dark mode
- 🖥️ System preference (auto-detect)

### Transaction Categories

Available categories for transactions:
- Food & Dining
- Transport
- Shopping
- Utilities & Bills
- Entertainment
- Healthcare
- Travel
- Education
- Groceries
- Fuel
- EMI & Loans
- Insurance
- Investment
- Transfer
- Income
- Recharge & Subscriptions
- Other

### Transaction Sources

Supported payment sources:
- UPI (PhonePe, Google Pay, etc.)
- Card (Credit/Debit cards)
- NEFT (Bank transfers)
- IMPS (Instant transfers)
- RTGS (Large value transfers)
- Wallet (Paytm, PhonePe, etc.)
- NetBanking (Internet banking)
- Cash
- Other

---

## Architecture

### Frontend Data Flow

```
User Action → Component → Redux Slice (Thunk) → API Service (Axios) → Backend Endpoint
                ↓
            Redux State Update → Component Re-render
```

**Example: Adding a Transaction**
1. User clicks "Add Transaction" → `AddTransactionModal.tsx`
2. Form submit → dispatches `createTransaction(data)` from `transactionSlice.ts`
3. Thunk calls `api.post('/transactions', data)` in `api.ts`
4. Backend `transactionRoutes.ts` → `transactionController.ts` → `transactionService.ts`
5. Service creates transaction in MongoDB via `Transaction.ts` model
6. Response returns to frontend → Redux state updates → Feed re-renders

### Backend Architecture

```
HTTP Request → Middleware (Helmet, CORS, Mongo Sanitize) 
           ↓
    Auth Middleware (JWT verification) [for protected routes]
           ↓
    Route Handler → Controller → Service → Model (MongoDB)
           ↓
    Response (JSON) or Error Middleware
```

**Key Design Patterns:**
- **Controllers** — Handle HTTP requests/responses, input validation (Zod)
- **Services** — Business logic, database operations
- **Models** — Mongoose schemas, data validation
- **Middleware** — Auth, error handling, file uploads, security

### AI Integration (OpenAI)

**Transaction Description Translation:**
1. User adds transaction with raw description (e.g., "UPI/1234567890@okicici/SWIGGY")
2. Backend `transactionService.ts` calls `translateAndCategorize()`
3. `openaiService.ts` checks `PatternCache` first (MongoDB cache)
4. If not cached, calls OpenAI GPT-4o-mini with:
   - System prompt for Indian context translation
   - System prompt for category classification
5. Response cached in `PatternCache` for future use
6. Returns `plainLanguage` ("Swiggy dinner via PhonePe") and `category` ("Food & Dining")

### Authentication Flow

**Login:**
1. Frontend: User submits credentials → `authSlice.ts` → `api.ts` → `POST /api/auth/login`
2. Backend: `authController.ts` → `authService.ts` → `User.ts` model (bcrypt password check)
3. On success: JWT token generated → Set as httpOnly cookie → User returned
4. Frontend: `useAuth.ts` hook updates `authSlice` state → Redirect to `/analytics`

**Protected Routes:**
1. `ProtectedRoute.tsx` checks `authSlice.isAuthenticated`
2. If not authenticated → Redirect to `/login`
3. If authenticated → Render child routes with `Layout.tsx`

### CSV Import Flow

1. User drops CSV file → `CSVUploader.tsx` → `api.ts` → `POST /api/import/csv`
2. Backend: `importController.ts` → `uploadMiddleware.ts` (Multer) → `importService.ts`
3. `importService.ts`:
   - Detects bank format (HDFC/SBI/ICICI/Axis/Kotak/Generic)
   - Parses CSV with PapaParse
   - Extracts: amount, type (debit/credit), description, date, source
   - Calls `translateAndCategorize()` for each transaction
4. Bulk inserts valid transactions via `bulkCreateTransactions()`
5. Returns `{ created: N, failed: N, skipped: N, format: "HDFC" }`

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

**Test Files:**
- `__tests__/auth.test.ts` — Authentication endpoints (register, login, me, logout, profile update, delete)
- `__tests__/transactions.test.ts` — Transaction CRUD operations
- `__tests__/userCreation.test.ts` — User creation and validation

**Test Setup:**
- Uses Vitest as test runner
- Supertest for HTTP endpoint testing
- MongoDB Memory Server for isolated test database
- Tests run with `NODE_ENV=test` (disables mongo-sanitize middleware)

---

## License

MIT License - see LICENSE file for details.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Commit Convention:** Follow conventional commits (feat:, fix:, chore:, test:, docs:)

