import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

/**
 * LoginPage
 * ---------
 * Handles credential entry, client-side validation, role-based redirect, and offers Google login fallback.
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { login, isAuthenticated, user, isLoading } = useAuth()

  // All hooks must be declared before any conditional returns
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', general: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true })
      } else if (user.role === 'patient') {
        navigate('/patient/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, user, isLoading, navigate])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2AA8FF] border-t-transparent"></div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null
  }

  // Minimal synchronous validation before hitting the API.
  const validate = () => {
    const next = { email: '', password: '', general: '' }
    let isValid = true

    if (!email.trim()) {
      next.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email'
      isValid = false
    }

    if (!password) {
      next.password = 'Password is required'
      isValid = false
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(next)
    return isValid
  }

  // POST credentials using the auth context and route the user by role.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', password: '', general: '' })

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Navigate based on user role
        if (result.user.role === 'doctor') {
          navigate('/doctor/dashboard')
        } else {
          navigate('/patient/dashboard')
        }
      } else {
        toast.error('Login failed', result.error || 'Invalid email or password')
        setErrors({ ...errors, general: result.error || 'Login failed. Please try again.' })
      }
    } catch (error) {
      toast.error('Login failed', 'An error occurred. Please try again.')
      setErrors({ ...errors, general: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex items-center justify-center p-4">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)' 
        }}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#2AA8FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2AA8FF]/5 rounded-full blur-3xl" />
      </div>

      {/* Centered Card */}
      <Card className="relative z-10 w-full max-w-md border-[#E4EBF5] bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgba(16,40,81,0.15)]">
        <CardHeader className="text-center space-y-1 pb-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10 mb-2">
            <ShieldCheck className="h-6 w-6 text-[#2AA8FF]" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#102851]">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-[#5C6169]">
            Login to continue booking appointments
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          {errors.general && (
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#102851]" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-10 pl-9 text-sm rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#102851]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-10 pl-9 text-sm rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-1.5 text-xs text-[#5C6169] cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-[#DCE6F5] text-[#2AA8FF] focus:ring-[#2AA8FF] cursor-pointer"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#2AA8FF] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Primary action */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg bg-[#2AA8FF] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative py-1.5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E6ECF5]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/95 px-2 text-xs font-medium text-[#5C6169]">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social logins (Google live, Apple placeholder) */}
            <div className="space-y-2">
              <GoogleLoginButton disabled={isSubmitting} />
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full border-[#DCE6F5] bg-white text-[#102851] hover:border-[#2AA8FF] hover:bg-[#F5F8FF] hover:text-[#102851] text-xs"
                disabled={isSubmitting}
              >
                <svg className="mr-2 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05 1.16-3.08 1.16-1.15 0-2.17-.39-3.06-1.16-1.01-.95-1.56-2.3-1.56-3.99 0-1.69.55-3.04 1.56-3.99.89-.77 1.91-1.16 3.06-1.16 1.03 0 2.1.21 3.08 1.16.98.95 1.52 2.3 1.52 3.99 0 1.69-.54 3.04-1.52 3.99zm-3.08-9.28c-.5 0-.95.17-1.33.51-.38.34-.58.81-.58 1.32 0 .51.2.98.58 1.32.38.34.83.51 1.33.51.5 0 .95-.17 1.33-.51.38-.34.58-.81.58-1.32 0-.51-.2-.98-.58-1.32-.38-.34-.83-.51-1.33-.51zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
                Apple (Coming Soon)
              </Button>
            </div>

            <p className="text-center text-xs text-[#5C6169] pt-1">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#2AA8FF] hover:underline">
                Sign up here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
