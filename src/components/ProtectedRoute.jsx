import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E7F0FF] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2AA8FF] border-t-transparent mx-auto"></div>
          <p className="text-[#102851] mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />
    } else if (user.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

