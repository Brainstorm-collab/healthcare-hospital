import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShieldCheck, Mail, Lock, User, Phone, MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

/**
 * RegisterPage
 * ------------
 * Full registration flow with role selection (patient/doctor), validation,
 * conditional doctor fields, and social login options.
 */
const RegisterPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { register, isAuthenticated, user, isLoading } = useAuth()

  // All hooks must be declared before any conditional returns
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    consultationFee: '',
    clinic: '',
    location: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
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

  // Don't render register form if already authenticated
  if (isAuthenticated) {
    return null
  }

  // Keep form state in sync and clear inline errors when the user edits a field.
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Shared validation covering both roles.
  const validate = () => {
    const next = {}
    let isValid = true

    if (!formData.name.trim()) {
      next.name = 'Name is required'
      isValid = false
    }

    if (!formData.email.trim()) {
      next.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Enter a valid email'
      isValid = false
    }

    if (!formData.password) {
      next.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      next.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    if (formData.role === 'doctor') {
      if (!formData.specialization) {
        next.specialization = 'Specialization is required for doctors'
        isValid = false
      }
    }

    setErrors(next)
    return isValid
  }

  // Submit to the auth context and route by role on success.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        specialization: formData.specialization || undefined,
        experience: formData.experience || undefined,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
        clinic: formData.clinic || undefined,
        location: formData.location || undefined,
      }

      const result = await register(registrationData)
      
      if (result.success) {
        toast.success('Registration successful!', `Welcome, ${result.user.name}!`)
        // Navigate based on user role
        if (result.user.role === 'doctor') {
          navigate('/doctor/dashboard')
        } else {
          navigate('/patient/dashboard')
        }
      } else {
        toast.error('Registration failed', result.error || 'Please try again.')
        setErrors({ general: result.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      toast.error('Registration failed', 'An error occurred. Please try again.')
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: 'linear-gradient(81deg, #E7F0FF 9.01%, rgba(232, 241, 255, 0.47) 89.11%)' 
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#2AA8FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2AA8FF]/5 rounded-full blur-3xl" />
      </div>

      {/* Centered Card */}
      <Card className="relative z-10 w-full max-w-2xl border-[#E4EBF5] bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgba(16,40,81,0.15)] max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2AA8FF]/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-[#2AA8FF]" />
          </div>
          <CardTitle className="text-3xl font-bold text-[#102851]">Create Account</CardTitle>
          <CardDescription className="text-[#5C6169]">
            Sign up to start managing your healthcare needs
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errors.general && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#102851]">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {['patient', 'doctor'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, role }))
                      setErrors(prev => ({ ...prev, role: '' }))
                    }}
                    className={`h-12 rounded-lg border-2 font-medium transition ${
                      formData.role === role
                        ? 'border-[#2AA8FF] bg-[#2AA8FF]/10 text-[#2AA8FF]'
                        : 'border-[#DCE6F5] bg-white text-[#5C6169] hover:border-[#2AA8FF]/50'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#102851]" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#102851]" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#102851]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-12 pl-10 pr-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] ${
                    errors.password ? 'border-red-300' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5C6169]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#102851]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`h-12 pl-10 pr-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] ${
                    errors.confirmPassword ? 'border-red-300' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#5C6169]"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Doctor-specific fields */}
            {formData.role === 'doctor' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#102851]" htmlFor="specialization">
                    Specialization *
                  </label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={`h-12 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] ${
                      errors.specialization ? 'border-red-300' : ''
                    }`}
                    placeholder="e.g., Cardiology, Neurology"
                  />
                  {errors.specialization && (
                    <p className="text-xs text-[#EF4444]">{errors.specialization}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#102851]" htmlFor="experience">
                      Experience
                    </label>
                    <Input
                      id="experience"
                      name="experience"
                      type="text"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="h-12 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF]"
                      placeholder="e.g., 10 years"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#102851]" htmlFor="consultationFee">
                      Consultation Fee (₹)
                    </label>
                    <Input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      className="h-12 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF]"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#102851]" htmlFor="clinic">
                    Clinic/Hospital Name
                  </label>
                  <Input
                    id="clinic"
                    name="clinic"
                    type="text"
                    value={formData.clinic}
                    onChange={handleInputChange}
                    className="h-12 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF]"
                    placeholder="ABC Hospital"
                  />
                </div>
              </>
            )}

            {/* Phone and Address (optional) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#102851]" htmlFor="phone">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF]"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#102851]" htmlFor="location">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF]"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-[#2AA8FF] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E6ECF5]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/95 px-3 text-xs font-medium text-[#5C6169]">
                  or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <GoogleLoginButton disabled={isSubmitting} />
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-[#DCE6F5] bg-white text-[#102851] hover:border-[#2AA8FF] hover:bg-[#F5F8FF] hover:text-[#102851]"
                disabled={isSubmitting}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05 1.16-3.08 1.16-1.15 0-2.17-.39-3.06-1.16-1.01-.95-1.56-2.3-1.56-3.99 0-1.69.55-3.04 1.56-3.99.89-.77 1.91-1.16 3.06-1.16 1.03 0 2.1.21 3.08 1.16.98.95 1.52 2.3 1.52 3.99 0 1.69-.54 3.04-1.52 3.99zm-3.08-9.28c-.5 0-.95.17-1.33.51-.38.34-.58.81-.58 1.32 0 .51.2.98.58 1.32.38.34.83.51 1.33.51.5 0 .95-.17 1.33-.51.38-.34.58-.81.58-1.32 0-.51-.2-.98-.58-1.32-.38-.34-.83-.51-1.33-.51zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
                Apple (Coming Soon)
              </Button>
            </div>

            <p className="text-center text-sm text-[#5C6169] pt-2">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#2AA8FF] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage

