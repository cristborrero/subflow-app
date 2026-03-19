<div align="center">
  <br />
  <h1>🌊 SubFlow</h1>
  <p align="center">
    <strong>Financial control, simplified.</strong>
    <br />
    A modern SaaS platform for tracking, managing, and analyzing your software subscriptions.
  </p>
</div>

---

## ✨ Features

- **Centralized Tracking:** See all your active, paused, and cancelled subscriptions in one unified dashboard.
- **Premium UI/UX:** Built with a world-class, Stripe-inspired aesthetic featuring glassmorphism, soft gradients, and fluid interactions using `framer-motion`.
- **Smart Reminders:** Get notified before your card is charged so you never pay for an unwanted renewal, orchestrated automatically via Supabase Edge Functions.
- **Expense Analytics:** Visualize your monthly and yearly spending habits through beautifully animated charts.
- **Secure Authentication:** Complete identity management with robust Row Level Security (RLS) enforcing strict tenant isolation.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI (shadcn/ui structure)
- **Animations:** Framer Motion
- **State Management:** Zustand (Client state), TanStack React Query (Server state caching)
- **Icons:** Lucide React

### Backend (BaaS)
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Serverless:** Supabase Edge Functions (Deno)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- A free [Supabase](https://supabase.com/) account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/subflow.git
   cd subflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database:**
   Go to your Supabase project's SQL Editor and copy-paste the contents of `supabase/migrations/0000_initial_schema.sql`. This will initialize the tables, ENUM types, triggers, and Row Level Security policies.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```text
├── src/
│   ├── components/      # UI components, layout wrappers, and feature blocks
│   ├── lib/             # Supabase client, unified design tokens, utils
│   ├── pages/           # High-level route views (Dashboard, Auth, Settings)
│   ├── routes/          # Navigation logic & Protected routes guard
│   ├── store/           # Zustand global stores (e.g., useAuthStore)
│   ├── styles/          # Base CSS and theme variables
│   └── types/           # Global TypeScript definitions
│
├── supabase/
│   ├── functions/       # Serverless Edge Functions (CRON jobs)
│   └── migrations/      # SQL schema configurations
│
└── .github/             # CI/CD Workflows (Vitest, Cloudflare Pages Deployment)
```

## 🔒 Security

All database data is shielded by **Row Level Security (RLS)**. No backend endpoint or generic database call can read or modify data that doesn't explicitly belong to the currently authenticated `auth.uid()`, assuring enterprise-grade data privacy.

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for your own personal or commercial projects.
