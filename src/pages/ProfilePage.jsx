import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import TopNavigation from '@/components/layout/TopNavigation'
import FooterSection from '@/components/sections/FooterSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProfilePictureUpload from '@/components/ProfilePictureUpload'
import { User, Mail, Phone, MapPin, Stethoscope, Briefcase, DollarSign, Hospital, Save, ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/contexts/ToastContext'
import { apiClient } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const ProfilePage = () => {
  const { user, updateProfile, deleteAccount, isLoading: authLoading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const theme = useTheme()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    consultationFee: '',
    clinic: '',
    location: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        consultationFee: user.consultationFee?.toString() || '',
        clinic: user.clinic || '',
        location: user.location || '',
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    if (user?.role === 'doctor') {
      if (!formData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required'
        isValid = false
      }
      if (!formData.experience.trim()) {
        newErrors.experience = 'Experience is required'
        isValid = false
      }
      if (!formData.consultationFee || isNaN(formData.consultationFee)) {
        newErrors.consultationFee = 'Consultation fee is required and must be a number'
        isValid = false
      }
      if (!formData.clinic.trim()) {
        newErrors.clinic = 'Clinic name is required'
        isValid = false
      }
      if (!formData.location.trim()) {
        newErrors.location = 'Location is required'
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      const updates = {
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        ...(user.role === 'doctor' && {
          specialization: formData.specialization,
          experience: formData.experience,
          consultationFee: parseFloat(formData.consultationFee),
          clinic: formData.clinic,
          location: formData.location,
        }),
      }

      await apiClient.patch(`/users/${user._id}`, updates)
      await updateProfile(updates)

      toast.success('Profile updated', 'Your profile has been updated successfully')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Update failed', error.message || 'Failed to update profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePictureUploadComplete = () => {
    // Profile picture is already updated in ProfilePictureUpload component
    // Toast is shown in ProfilePictureUpload component
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setIsDeletingAccount(true)
    setDeleteError('')

    const result = await deleteAccount()

    if (!result.success) {
      setDeleteError(result.error || 'Failed to delete account. Please try again.')
      setIsDeletingAccount(false)
      return
    }

    setIsDeletingAccount(false)
    setIsDeleteDialogOpen(false)
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.colors.backgroundGradient }}>
        <Loader2 className="h-10 w-10 animate-spin text-[#2AA8FF]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.colors.backgroundGradient }}>
      <TopNavigation />
      <main className="flex-1 mx-auto max-w-4xl px-6 pb-24 pt-36">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-[#102851]">Profile Settings</h1>
          <p className="text-[#5C6169] mt-2">Manage your profile information</p>
        </div>


        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Picture */}
          <Card className="lg:col-span-1 bg-white shadow-soft border border-[#E4EBF5]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#102851]">Profile Picture</CardTitle>
              <CardDescription className="text-[#5C6169]">
                Upload a photo to help others recognize you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePictureUpload
                userId={user._id}
                currentImage={user.profileImage}
                onUploadComplete={handlePictureUploadComplete}
              />
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="lg:col-span-2 bg-white shadow-soft border border-[#E4EBF5]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#102851]">Profile Information</CardTitle>
              <CardDescription className="text-[#5C6169]">
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email (read-only) */}
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
                      className="h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] cursor-not-allowed opacity-60"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-[#5C6169]">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#102851]" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF]"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#102851]" htmlFor="address">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF]"
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                </div>

                {/* Doctor-specific fields */}
                {user.role === 'doctor' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#102851]" htmlFor="specialization">
                          Specialization
                        </label>
                        <div className="relative">
                          <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                          <Input
                            id="specialization"
                            name="specialization"
                            type="text"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                              errors.specialization ? 'border-red-300' : ''
                            }`}
                            placeholder="Cardiology, Pediatrics, etc."
                            required
                          />
                        </div>
                        {errors.specialization && <p className="text-xs text-red-500">{errors.specialization}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#102851]" htmlFor="experience">
                          Experience
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                          <Input
                            id="experience"
                            name="experience"
                            type="text"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                              errors.experience ? 'border-red-300' : ''
                            }`}
                            placeholder="10 years experience overall"
                            required
                          />
                        </div>
                        {errors.experience && <p className="text-xs text-red-500">{errors.experience}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#102851]" htmlFor="consultationFee">
                          Consultation Fee (₹)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                          <Input
                            id="consultationFee"
                            name="consultationFee"
                            type="number"
                            value={formData.consultationFee}
                            onChange={handleInputChange}
                            className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                              errors.consultationFee ? 'border-red-300' : ''
                            }`}
                            placeholder="500"
                            required
                          />
                        </div>
                        {errors.consultationFee && <p className="text-xs text-red-500">{errors.consultationFee}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#102851]" htmlFor="clinic">
                          Clinic Name
                        </label>
                        <div className="relative">
                          <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                          <Input
                            id="clinic"
                            name="clinic"
                            type="text"
                            value={formData.clinic}
                            onChange={handleInputChange}
                            className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                              errors.clinic ? 'border-red-300' : ''
                            }`}
                            placeholder="ABC Hospital"
                            required
                          />
                        </div>
                        {errors.clinic && <p className="text-xs text-red-500">{errors.clinic}</p>}
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
                          className={`h-12 pl-10 rounded-lg border-[#DCE6F5] bg-[#F5F8FF] text-[#102851] placeholder:text-[#8FA3C0] focus:border-[#2AA8FF] focus:ring-[#2AA8FF] ${
                            errors.location ? 'border-red-300' : ''
                          }`}
                          placeholder="Andheri West, Mumbai"
                          required
                        />
                      </div>
                      {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-lg bg-[#2AA8FF] text-sm font-semibold text-white shadow-[0_8px_20px_rgba(42,168,255,0.3)] transition hover:bg-[#1896f0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 border border-red-200 bg-white shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-600">Danger Zone</CardTitle>
            <CardDescription className="text-[#5C6169]">
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#5C6169]">
                Deleting your account will remove your profile, appointments, notifications, and medical records.
              </p>
              <p className="text-sm text-[#5C6169]">
                You will need to create a new account to use the platform again.
              </p>
            </div>
            <Button
              onClick={() => {
                setDeleteError('')
                setIsDeleteDialogOpen(true)
              }}
              className="inline-flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            if (!open && !isDeletingAccount) {
              setIsDeleteDialogOpen(false)
              setDeleteError('')
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm text-[#5C6169]">
              <p>
                All of your appointments, notifications, and medical records will be deleted permanently.
              </p>
              {deleteError && <p className="text-red-600">{deleteError}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isDeletingAccount}
                onClick={() => {
                  if (isDeletingAccount) return
                  setIsDeleteDialogOpen(false)
                  setDeleteError('')
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isDeletingAccount}
                onClick={handleDeleteAccount}
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, delete my account'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <FooterSection />
    </div>
  )
}

export default ProfilePage

