import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const GoogleLoginButton = ({ disabled = false, onSuccess }) => {
  const { socialLogin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [googleButtonWidth, setGoogleButtonWidth] = useState(0)

  // Google Client ID - from environment variable or fallback
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
    '627920922113-cd13khcn0gg62nssa692gh35451os3hi.apps.googleusercontent.com'

  // Check if Google Client ID is configured
  useEffect(() => {
    if (!googleClientId) {
      console.error('[GoogleLoginButton] Missing VITE_GOOGLE_CLIENT_ID. Set it in .env.local')
    }
    // Removed console.log in production to reduce noise
    // if (import.meta.env.DEV) {
    //   console.log('[GoogleLoginButton] Using Google clientId:', googleClientId)
    // }
  }, [googleClientId])

  // Calculate button width (Google requires 120-400px)
  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return
      const containerWidth = Math.floor(containerRef.current.offsetWidth || 0)
      const clamped = Math.max(120, Math.min(400, containerWidth))
      setGoogleButtonWidth(clamped)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Handle Google Login Success
  const handleGoogleSuccess = async (response) => {
    try {
      // Decode the JWT token to extract user data
      let userData
      if (response.credential) {
        // Decode the JWT token from Google
        userData = jwtDecode(response.credential)
      } else {
        // Fallback to response data if no credential
        userData = response.userData || response
      }

      // Call socialLogin from AuthContext
      const result = await socialLogin('google', userData)

      if (result.success) {
        // Navigate based on user role
        const userRole = result.user?.role
        if (userRole === 'doctor') {
          navigate('/doctor/dashboard')
        } else if (userRole === 'patient') {
          navigate('/patient/dashboard')
        } else {
          navigate('/') // Default redirect
        }
        onSuccess?.()
      } else {
        toast.error('Google login failed', result.error || 'Please try again')
      }
    } catch (err) {
      console.error('Google login error:', err)
      toast.error('Google login failed', 'Please try again')
    }
  }

  // Handle Google Login Error
  const handleGoogleError = () => {
    console.error('Google login was cancelled or failed')
  }

  return (
    <div className="space-y-3">
      {/* Custom styling for Google button */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .google-button-container * {
            border-radius: 8px !important;
          }
          .google-button-container > div {
            border-radius: 8px !important;
          }
          .google-button-container > div > div {
            border-radius: 8px !important;
          }
          .google-button-container > div > div > div {
            border-radius: 8px !important;
          }
        `
      }} />

      {/* Google OAuth Provider - wraps the GoogleLogin component */}
      <GoogleOAuthProvider clientId={googleClientId}>
        <div 
          className="google-button-container"
          style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
          ref={containerRef}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width={googleButtonWidth || undefined}
            text="signin_with"
            shape="rectangular"
            useOneTap={false}
            auto_select={false}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  )
}

export default GoogleLoginButton

