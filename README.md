# Healthcare & Hospital Management Web Application

A comprehensive healthcare management platform built with React, Vite, and Convex.

## Features

- **Patient Module**: Browse doctors, book appointments, manage medical records
- **Doctor Module**: Manage availability, view appointments, update consultation notes
- **Admin Module**: Manage users, departments, appointments, and content
- **Real-time Updates**: Live appointment status and availability updates
- **Authentication**: Secure user registration and login
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Convex (Backend-as-a-Service)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Convex account (free tier available)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd healthcare-hospital
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Convex**:
   ```bash
   npx convex login
   npx convex dev
   ```
   
   This will:
   - Create/link your Convex project
   - Generate type definitions
   - Set up environment variables

4. **Start development servers**:

   Terminal 1 (Convex):
   ```bash
   npm run convex:dev
   ```

   Terminal 2 (Vite):
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:5173`

## Project Structure

```
healthcare-hospital/
├── convex/              # Convex backend functions
│   ├── schema.js       # Database schema
│   ├── auth.js         # Authentication
│   ├── users.js        # User management
│   ├── doctors.js      # Doctor queries
│   ├── appointments.js # Appointment CRUD
│   ├── medicalRecords.js # Medical records
│   ├── departments.js  # Departments
│   ├── admin.js        # Admin functions
│   └── ...
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── data/           # Static data
│   └── ...
└── ...
```

## Convex Backend

This project uses [Convex](https://convex.dev) as the backend. See [CONVEX_SETUP.md](./CONVEX_SETUP.md) for detailed setup instructions.

### Available Functions

- **Authentication**: `auth.register`, `auth.login`
- **Doctors**: `doctors.listDoctors`, `doctors.getDoctorById`
- **Appointments**: `appointments.createAppointment`, `appointments.getAppointmentsByUser`
- **Medical Records**: `medicalRecords.getRecordsByPatient`, `medicalRecords.addMedicalRecord`
- **Admin**: `admin.getAdminStats`

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run convex:dev` - Start Convex development server
- `npm run convex:deploy` - Deploy Convex functions

## Environment Variables

After running `npx convex dev`, a `.env.local` file will be created with:
```
VITE_CONVEX_URL=https://your-project.convex.cloud
```

## Documentation

- [Convex Setup Guide](./CONVEX_SETUP.md) - Detailed Convex backend setup
- [Convex Documentation](https://docs.convex.dev)
- [React Documentation](https://react.dev)

## License

MIT
