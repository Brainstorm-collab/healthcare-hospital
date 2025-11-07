import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ToastContext'

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
        const storedUser = localStorage.getItem('healthcare_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('healthcare_user')
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const loginMutation = useMutation(api.auth.login)

  // Email/Password login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const userData = await loginMutation({ email, password })
      
      // Create session user object (consistent structure)
      const sessionUser = {
        _id: userData._id,
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || '',
        address: userData.address || '',
        profileImage: userData.profileImage || '',
        specialization: userData.specialization || '',
        experience: userData.experience || '',
        consultationFee: userData.consultationFee || 0,
        clinic: userData.clinic || '',
        location: userData.location || '',
        isAvailable: userData.isAvailable || false,
        createdAt: userData.createdAt,
        lastLoginAt: Date.now(),
      }

      // Store session user in localStorage
      localStorage.setItem('healthcare_user', JSON.stringify(sessionUser))
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
    localStorage.removeItem('healthcare_user')
    toast.info('Logged out', `Goodbye, ${userName}!`)
    navigate('/login')
  }

  const registerMutation = useMutation(api.auth.register)
  const socialLoginMutation = useMutation(api.auth.socialLogin)

  // Social login function (Google, Apple, etc.)
  const socialLogin = async (provider, userData) => {
    try {
      setIsLoading(true)
      
      // Extract user data from Google JWT or other provider
      const providerId = userData.sub || userData.id || `social_${Date.now()}`
      const email = userData.email || `${provider}_${providerId}@${provider}.local`
      const name = userData.name || userData.given_name || 'User'
      const picture = userData.picture || userData.profileImage || ''
      
      // Call Convex social login mutation
      const userDataFromDB = await socialLoginMutation({
        provider: provider,
        providerId: providerId,
        email: email,
        name: name,
        picture: picture,
        role: userData.role || 'patient', // Default to patient
      })
      
      // Create session user object (consistent structure)
      const sessionUser = {
        _id: userDataFromDB._id,
        id: userDataFromDB._id,
        name: userDataFromDB.name,
        email: userDataFromDB.email,
        role: userDataFromDB.role,
        phone: userDataFromDB.phone || '',
        address: userDataFromDB.address || '',
        profileImage: userDataFromDB.profileImage || picture,
        specialization: userDataFromDB.specialization || '',
        experience: userDataFromDB.experience || '',
        consultationFee: userDataFromDB.consultationFee || 0,
        clinic: userDataFromDB.clinic || '',
        location: userDataFromDB.location || '',
        isAvailable: userDataFromDB.isAvailable || false,
        provider: userDataFromDB.provider,
        providerId: userDataFromDB.providerId,
        createdAt: userDataFromDB.createdAt,
        lastLoginAt: Date.now(),
      }

      // Store session user in localStorage
      localStorage.setItem('healthcare_user', JSON.stringify(sessionUser))
      setUser(sessionUser)
      
      // Show success toast
      toast.success('Login successful!', `Welcome, ${sessionUser.name}!`)
      
      return { success: true, user: sessionUser }
    } catch (error) {
      console.error('Social login error:', error)
      toast.error('Login failed', error.message || 'Social login failed')
      return { success: false, error: error.message || 'Social login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  // Email/Password registration function
  const register = async (userData) => {
    try {
      setIsLoading(true)
      
      // Register user
      const result = await registerMutation(userData)
      
      if (!result.success) {
        return { success: false, error: 'Registration failed' }
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
    try {
      // This would call a Convex mutation to update the profile
      // For now, update local state
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('healthcare_user', JSON.stringify(updatedUser))
      toast.success('Profile updated', 'Your profile has been updated successfully')
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Update failed', error.message || 'Failed to update profile')
      return { success: false, error: error.message || 'Update failed' }
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
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      register,
      socialLogin,
      updateProfile,
      hasRole,
      hasAnyRole,
    }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

