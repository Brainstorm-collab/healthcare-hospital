import { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ToastContext'

const STORAGE_KEY = 'healthcare_user'
const MAX_STORAGE_LENGTH = 4 * 1024 * 1024 // ~4MB safety buffer below browser limits

const isQuotaExceededError = (error) => {
  if (!error) return false
  return (
    error.name === 'QuotaExceededError' ||
    error.code === 22 ||
    error.code === 1014 ||
    error.number === -2147024882
  )
}

const normalizeUserData = (source = {}, defaults = {}) => ({
  _id: source._id ?? defaults._id ?? defaults.id ?? '',
  id: source._id ?? defaults.id ?? '',
  name: source.name ?? defaults.name ?? '',
  email: source.email ?? defaults.email ?? '',
  role: source.role ?? defaults.role ?? '',
  phone: source.phone ?? defaults.phone ?? '',
  address: source.address ?? defaults.address ?? '',
  profileImage: source.profileImage ?? defaults.profileImage ?? '',
  specialization: source.specialization ?? defaults.specialization ?? '',
  experience: source.experience ?? defaults.experience ?? '',
  consultationFee: source.consultationFee ?? defaults.consultationFee ?? 0,
  clinic: source.clinic ?? defaults.clinic ?? '',
  location: source.location ?? defaults.location ?? '',
  isAvailable: source.isAvailable ?? defaults.isAvailable ?? false,
  provider: source.provider ?? defaults.provider,
  providerId: source.providerId ?? defaults.providerId,
  createdAt: source.createdAt ?? defaults.createdAt,
  lastLoginAt: defaults.lastLoginAt ?? Date.now(),
})

const createLightweightUser = (userData) => {
  if (!userData) return userData
  const { profileImage, ...rest } = userData
  return {
    ...rest,
    profileImage: '',
    hasStoredProfileImage: Boolean(profileImage),
    needsProfileReload: Boolean(profileImage),
  }
}

const persistSessionUser = (sessionUser) => {
  if (!sessionUser) return

  const lightweightUser = createLightweightUser(sessionUser)
  let serialized = ''

  try {
    serialized = JSON.stringify(sessionUser)
  } catch (error) {
    console.error('Failed to serialize user for storage:', error)
    return
  }

  if (serialized.length > MAX_STORAGE_LENGTH) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightUser))
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.warn('LocalStorage quota exceeded. Persisting lightweight user profile.', error)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweightUser))
      } catch (storageError) {
        console.error('Failed to persist lightweight user session:', storageError)
      }
    } else {
      throw error
    }
  }
}

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  // Load user from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY)
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)

          if (parsedUser?.needsProfileReload && parsedUser?.id) {
            try {
              const freshUser = await apiClient.get(`/users/${parsedUser.id}`)
              const sessionUser = normalizeUserData(freshUser, {
                ...parsedUser,
                lastLoginAt: parsedUser.lastLoginAt,
              })
              setUser(sessionUser)
              persistSessionUser(sessionUser)
              return
            } catch (refreshError) {
              console.error('Failed to refresh stored user profile image:', refreshError)
            }
          }

          const { needsProfileReload, ...restStoredUser } = parsedUser
          setUser(restStoredUser)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Email/Password login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const userData = await apiClient.post('/auth/login', { email, password })

      // Create session user object (consistent structure)
      const sessionUser = normalizeUserData(userData, { lastLoginAt: Date.now() })

      // Store session user in localStorage
      persistSessionUser(sessionUser)
      setUser(sessionUser)
      
      // Show success toast
      toast.success('Login successful!', `Welcome back, ${sessionUser.name}!`)
      
      return { success: true, user: sessionUser }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed', error.message || 'Invalid email or password')
      return { success: false, error: error.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const logout = () => {
    const userName = user?.name || 'User'
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    toast.info('Logged out', `Goodbye, ${userName}!`)
    navigate('/login')
  }

  // Social login function (Google, Apple, etc.)
  const socialLogin = async (provider, userData) => {
    try {
      setIsLoading(true)

      const providerId = userData.providerId || userData.sub || userData.id || `social_${Date.now()}`
      const email = userData.email || `${provider}_${providerId}@${provider}.local`
      const name = userData.name || userData.given_name || 'User'
      const picture = userData.picture || userData.profileImage || ''

      const payload = {
        provider,
        providerId,
        email,
        name,
        picture,
      }

      if (userData.role) {
        payload.role = userData.role
      }

      const userDataFromDB = await apiClient.post('/auth/social-login', payload)

      const sessionUser = normalizeUserData(userDataFromDB, {
        name: userDataFromDB.name || name,
        profileImage: userDataFromDB.profileImage || picture,
        provider: userDataFromDB.provider || provider,
        providerId: userDataFromDB.providerId || providerId,
        lastLoginAt: Date.now(),
      })

      persistSessionUser(sessionUser)
      setUser(sessionUser)

      toast.success('Login successful!', `Welcome, ${sessionUser.name}!`)

      return { success: true, user: sessionUser }
    } catch (error) {
      console.error('Social login error:', error)
      const message = error.message || 'Social login failed'
      if (!message.includes('Role must be provided')) {
        toast.error('Login failed', message)
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // Email/Password registration function
  const register = async (userData) => {
    try {
      setIsLoading(true)
      
      // Register user
      const result = await apiClient.post('/auth/register', userData)

      if (!result?.success) {
        return { success: false, error: result?.error || 'Registration failed' }
      }

      // After registration, automatically login
      const loginResult = await login(userData.email, userData.password)
      return loginResult
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    persistSessionUser(updatedUser)
    return { success: true, user: updatedUser }
  }

  const deleteAccount = async () => {
    if (!user?._id) {
      return { success: false, error: 'No user session found' }
    }

    try {
      await apiClient.delete(`/users/${user._id}`)
      logout()
      toast.success('Account deleted', 'Your account has been permanently removed.')
      return { success: true }
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error('Deletion failed', error.message || 'Failed to delete account')
      return { success: false, error: error.message || 'Deletion failed' }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role)
  }

  // Memoize context value to prevent unnecessary re-renders
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    socialLogin,
    updateProfile,
    deleteAccount,
    hasRole,
    hasAnyRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

