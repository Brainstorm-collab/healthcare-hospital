import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import FindDoctorsPage from '@/pages/FindDoctorsPage'
import HospitalsPage from '@/pages/HospitalsPage'
import MedicinesPage from '@/pages/MedicinesPage'
import SurgeriesPage from '@/pages/SurgeriesPage'
import SoftwareForProviderPage from '@/pages/SoftwareForProviderPage'
import FacilitiesPage from '@/pages/FacilitiesPage'
import ScrollToTop from '@/components/ScrollToTop'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import PatientDashboard from '@/pages/PatientDashboard'
import DoctorDashboard from '@/pages/DoctorDashboard'
import ProfilePage from '@/pages/ProfilePage'
import MedicalRecordsPage from '@/pages/MedicalRecordsPage'
import AllAppointmentsPage from '@/pages/AllAppointmentsPage'
import PatientListPage from '@/pages/PatientListPage'
import NotificationsPage from '@/pages/NotificationsPage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/find-doctors" element={<FindDoctorsPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/surgeries" element={<SurgeriesPage />} />
        <Route path="/software" element={<SoftwareForProviderPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes - Patient */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Doctor */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Medical Records */}
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <MedicalRecordsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - All Appointments */}
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <AllAppointmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Patient List (Doctor only) */}
        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientListPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
