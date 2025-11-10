# Healthcare & Hospital Management Platform

A modern patient and doctor portal built with React, Vite, Tailwind CSS, and an Express/Prisma/PostgreSQL backend. The application offers frictionless appointment booking, medical record management, notifications, and a fully responsive UI for both patients and healthcare providers.

![Application preview](./public/Screenshot%202025-11-09%20154203.png)

## Highlights

- 🩺 **Patient experience** – discover doctors, compare availability, book appointments, view medical records, and receive live updates.
- 🩻 **Doctor workspace** – manage schedules, review appointments, update consultation notes, and stay in sync with patients.
- 🔔 **Real-time notifications** – delivered through the Express API so dashboards stay in sync without page refreshes.
- 🔐 **Authentication & social sign-in** – email/password plus Google OAuth with role-based routing.
- 📱 **Responsive design** – mobile-first layouts using Tailwind CSS and shadcn/ui.
- ⚡ **Performance-oriented UX** – paginated API responses, debounced filters, and toast-driven feedback for all major flows.

## Tech Stack

| Layer      | Tools & Libraries |
|-----------|-------------------|
| Frontend  | React 19, Vite, React Router |
| Styling   | Tailwind CSS, shadcn/ui, Lucide Icons |
| Backend   | Express, Prisma ORM, PostgreSQL |
| Utilities | Sonner toasts, date-fns, modern React hooks |

## Quick Start

### Prerequisites

- Node.js **18+**
- PostgreSQL database (local or hosted)

### Installation

```bash
# Clone the repo
git clone <repository-url>
cd healthcare-hospital

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Generate Prisma client
npx prisma generate

# Back to project root when ready to run the frontend
cd ..
```

Create a `.env` file inside `backend/` by copying `env.sample`, and set `DATABASE_URL` to your PostgreSQL connection string.

### Local Development

Use two terminals to run both the Express backend and the Vite dev server:

```bash
# Terminal 1 - Express + Prisma backend
cd backend
npm run dev

# Terminal 2 - React/Vite frontend
cd ..
npm run dev
```

Navigate to **http://localhost:5173** and start exploring.

## Project Structure

```
healthcare-hospital/
├── public/                     # Static assets (including README screenshots)
├── backend/                    # Express + Prisma backend
│   ├── src/                    # Controllers, routes, services
│   ├── prisma/                 # Prisma schema & migrations
│   └── env.sample              # Backend environment template
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route-level components
│   ├── contexts/               # Auth, toast, cart providers
│   ├── data/                   # Static configuration
│   └── main.jsx                # App bootstrap
└── README.md
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production bundle |

## Environment Variables

Set the backend `.env` with your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME
PORT=8000
```

The frontend can optionally use a `.env.local` file. If `VITE_API_URL` is not provided it defaults to `http://localhost:8000/api`.

## Additional Resources

- [Express Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- Tailwind & shadcn/ui docs for styling patterns

---

MIT © Surya Nursing Home demo application
