# Healthcare & Hospital Management Platform

A modern patient and doctor portal built with React, Vite, Tailwind CSS, and Convex. The application offers frictionless appointment booking, medical record management, real-time notifications, and a fully responsive UI for both patients and healthcare providers.

![Application preview](./public/Screenshot%202025-11-09%20154203.png)

## Highlights

- 🩺 **Patient experience** – discover doctors, compare availability, book appointments, view medical records, and receive live updates.
- 🩻 **Doctor workspace** – manage schedules, review appointments, update consultation notes, and stay in sync with patients.
- 🔔 **Real-time notifications** – powered by Convex subscriptions to keep dashboards and alerts up to date without page refreshes.
- 🔐 **Authentication & social sign-in** – email/password plus Google OAuth with role-based routing.
- 📱 **Responsive design** – mobile-first layouts using Tailwind CSS and shadcn/ui.
- ⚡ **Performance-oriented UX** – paginated Convex queries, debounced filters, and toast-driven feedback for all major flows.

## Tech Stack

| Layer      | Tools & Libraries |
|-----------|-------------------|
| Frontend  | React 19, Vite, React Router |
| Styling   | Tailwind CSS, shadcn/ui, Lucide Icons |
| Backend   | Convex (data, auth, real-time functions) |
| Utilities | Sonner toasts, date-fns, modern React hooks |

## Quick Start

### Prerequisites

- Node.js **18+**
- A Convex account (free tier is enough)

### Installation

```bash
# Clone the repo
git clone <repository-url>
cd healthcare-hospital

# Install dependencies
npm install

# Authenticate with Convex (generates config & types)
npx convex login
npx convex dev
```

### Local Development

Use two terminals to run both the Convex backend and the Vite dev server:

```bash
# Terminal 1 - Convex backend with live reload
npm run convex:dev

# Terminal 2 - React/Vite frontend
npm run dev
```

Navigate to **http://localhost:5173** and start exploring.

## Project Structure

```
healthcare-hospital/
├── public/                     # Static assets (including README screenshots)
├── convex/                     # Convex backend functions & schema
│   ├── schema.js               # Database schema definitions
│   ├── auth.js                 # Authentication mutations/queries
│   ├── doctors.js              # Doctor list & detail queries
│   ├── appointments.js         # Appointment workflows & notifications
│   └── ...                     # Additional collections (medical records, notifications, etc.)
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
| `npm run convex:dev` | Run Convex backend locally |
| `npm run convex:deploy` | Deploy Convex functions |

## Environment Variables

Running `npx convex dev` generates a `.env.local` file with your project URL:

```env
VITE_CONVEX_URL=https://<your-project>.convex.cloud
```

Add any additional secrets (e.g., Google OAuth client ID) to this file.

## Additional Resources

- [Convex Documentation](https://docs.convex.dev)
- [React Documentation](https://react.dev)
- Tailwind & shadcn/ui docs for styling patterns

---

MIT © Surya Nursing Home demo application
