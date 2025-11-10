import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const GoogleLoginButton = ({ disabled = false, onSuccess }) => {
  const { socialLogin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [googleButtonWidth, setGoogleButtonWidth] = useState(0)
  const [pendingUserData, setPendingUserData] = useState(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isProcessingRole, setIsProcessingRole] = useState(false)
  const [roleError, setRoleError] = useState('')

  // Google Client ID - from environment variable or fallback
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '627920922113-8g6l4p09381cj3cv6hbcsmd3pse2p5u9.apps.googleusercontent.com'

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
      let userData
      if (response.credential) {
        userData = jwtDecode(response.credential)
      } else {
        userData = response.userData || response
      }

      const basePayload = {
        provider: 'google',
        providerId: userData.sub || userData.id || `social_${Date.now()}`,
        email: userData.email || '',
        name: userData.name || userData.given_name || 'User',
        picture: userData.picture || userData.profileImage || '',
      }

      const result = await socialLogin('google', basePayload)

      if (result.success) {
        const userRole = result.user?.role
        if (userRole === 'doctor') {
          navigate('/doctor/dashboard')
        } else if (userRole === 'patient') {
          navigate('/patient/dashboard')
        } else {
          navigate('/')
        }
        onSuccess?.()
        return
      }

      if (result.error && result.error.includes('Role must be provided')) {
        setPendingUserData(basePayload)
        setRoleError('')
        setIsRoleDialogOpen(true)
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

  const handleRoleSelection = async (role) => {
    if (!pendingUserData) return

    try {
      setIsProcessingRole(true)
      setRoleError('')

      const result = await socialLogin('google', { ...pendingUserData, role })

      if (result.success) {
        const userRole = result.user?.role
        if (userRole === 'doctor') {
          navigate('/doctor/dashboard')
        } else if (userRole === 'patient') {
          navigate('/patient/dashboard')
        } else {
          navigate('/')
        }
        onSuccess?.()
        setIsRoleDialogOpen(false)
        setPendingUserData(null)
      } else {
        setRoleError(result.error || 'Failed to complete social login. Please try again.')
      }
    } catch (err) {
      console.error('Role selection error:', err)
      setRoleError(err.message || 'Failed to complete social login. Please try again.')
    } finally {
      setIsProcessingRole(false)
    }
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

      <Dialog open={isRoleDialogOpen} onOpenChange={(open) => {
        if (!open && !isProcessingRole) {
          setIsRoleDialogOpen(false)
          setPendingUserData(null)
          setRoleError('')
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select account type</DialogTitle>
            <DialogDescription>
              Choose whether you want to continue as a patient or a doctor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3">
              <Button
                disabled={isProcessingRole}
                onClick={() => handleRoleSelection('patient')}
                className="w-full bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
              >
                Continue as Patient
              </Button>
              <Button
                disabled={isProcessingRole}
                onClick={() => handleRoleSelection('doctor')}
                variant="outline"
                className="w-full border-[#2AA8FF] text-[#2AA8FF] hover:bg-[#E6F4FF]"
              >
                Continue as Doctor
              </Button>
            </div>
            {roleError && (
              <p className="text-sm text-red-600 text-center">{roleError}</p>
            )}
            <Button
              variant="ghost"
              disabled={isProcessingRole}
              onClick={() => {
                if (isProcessingRole) return
                setIsRoleDialogOpen(false)
                setPendingUserData(null)
                setRoleError('')
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GoogleLoginButton

