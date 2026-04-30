# SpendWise

A modern financial transaction management application — track expenses, analyze spending patterns, and manage transactions with ease.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [License](#license)

---

## Features

### Authentication & User Management
- **Secure Authentication** — Login and registration with JWT-based auth
- **Protected Routes** — Automatic redirect to login for unauthorized access
- **Persistent Sessions** — Stay logged in across browser sessions

### Transaction Management
- **Add Transactions** — Manually add income or expense transactions
- **Edit & Delete** — Modify or remove existing transactions
- **Transaction Feed** — View all transactions with card-based layout
- **CSV Import** — Bulk upload transactions from CSV files
- **Filtering** — Filter transactions by type, category, or date
- **Pagination** — Navigate through transaction history efficiently

### Analytics & Insights
- **Spending Pie Chart** — Visual breakdown of expenses by category
- **Monthly Trends** — Track spending patterns over time
- **Dashboard** — Centralized view of financial analytics

### User Experience
- **Dark/Light Theme** — Toggle between themes with ThemeContext
- **Responsive Design** — Works on desktop and mobile devices
- **Loading States** — Skeleton loaders and animations for smooth UX
- **Toast Notifications** — Real-time feedback for user actions
- **Error Boundary** — Graceful error handling with fallback UI

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Redux Toolkit | State management |
| React Router DOM | Client-side routing |
| Radix UI | Accessible component primitives |
| Recharts | Data visualization |
| Framer Motion | Animations |
| Lottie React | Micro-interactions |
| Lucide React | Icon library |
| Formik / React Hook Form | Form handling |
| Yup / Zod | Form validation |
| Axios | HTTP client |

---

## Project Structure

```
SpendWise/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui base components
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   └── toast.tsx
│   │   │   ├── AddTransactionModal.tsx
│   │   │   ├── CSVUploader.tsx
│   │   │   ├── EditTransactionModal.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LoadingAnimation.tsx
│   │   │   ├── MonthlyTrendChart.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── SpendingPieChart.tsx
│   │   │   ├── TransactionCard.tsx
│   │   │   └── TransactionFilters.tsx
│   │   ├── context/
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useDebounce.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── TransactionFeedPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── transactionSlice.ts
│   │   │       └── uiSlice.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── Dockerfile
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- npm or pnpm
- Backend API running (for full functionality)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

### Build for Production

```bash
cd frontend

# Build the application
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
cd frontend

# Build Docker image
docker build -t spendwise-frontend .

# Run container
docker run -p 80:80 spendwise-frontend
```

---

## Usage Guide

### Authentication

1. Navigate to the landing page at `/`
2. Click "Login" or "Register" to access the auth pages
3. After successful authentication, you'll be redirected to the dashboard

### Managing Transactions

**Adding a Transaction:**
1. Navigate to `/feed` (Transaction Feed)
2. Click "Add Transaction" button
3. Fill in the transaction details (type, amount, category, description)
4. Submit to save

**Editing a Transaction:**
1. Find the transaction in the feed
2. Click the edit icon on the transaction card
3. Modify the details in the modal
4. Save changes

**Deleting a Transaction:**
1. Find the transaction in the feed
2. Click the delete icon
3. Confirm the deletion

**Importing CSV:**
1. Navigate to the Transaction Feed
2. Use the CSV Upload component
3. Select a CSV file with transaction data
4. The system will bulk import all valid transactions

### Analytics Dashboard

Navigate to `/analytics` to view:
- **Spending Pie Chart** — Breakdown of expenses by category
- **Monthly Trend Chart** — Spending patterns over time

### Settings

Navigate to `/settings` to:
- Toggle between dark and light theme
- Manage account preferences
- View account information

### Theme Switching

Click the theme toggle in the layout header to switch between:
- ☀️ Light mode
- 🌙 Dark mode

---

## License

MIT License - see LICENSE file for details.
