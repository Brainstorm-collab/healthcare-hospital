import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Activity, 
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  LogOut,
  Settings,
  Bell,
  Stethoscope,
  TrendingUp,
  UserCheck
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import TopNavigation from '@/components/layout/TopNavigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import UserRoleBadge from '@/components/UserRoleBadge'
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal'
import { useToast } from '@/contexts/ToastContext'
import { apiClient } from '@/lib/api'

const DoctorDashboard = () => {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const [appointments, setAppointments] = useState([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadAppointments = async () => {
      if (!user?._id) {
        setAppointments([])
        return
      }

      try {
        setAppointmentsLoading(true)
        const response = await apiClient.get('/appointments', {
          userId: user._id,
          role: 'doctor',
        })
        if (!cancelled) {
          setAppointments(response ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch appointments:', error)
          toast.error('Failed to load appointments', error.message || 'Please try again.')
        }
      } finally {
        if (!cancelled) {
          setAppointmentsLoading(false)
        }
      }
    }

    loadAppointments()

    return () => {
      cancelled = true
    }
  }, [toast, user?._id])

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0]
  
  // Filter today's appointments
  let todayAppointments = appointments?.filter(apt => apt.date === today) || []
  // Additional filtering (status or search) can be added here if needed
  
  const upcomingAppointments = appointments?.filter(apt => 
    (apt.status === 'confirmed' || apt.status === 'pending') && apt.date >= today
  ).slice(0, 5) || []

  const stats = {
    todayAppointments: todayAppointments.length,
    totalAppointments: appointments?.length || 0,
    pendingAppointments: appointments?.filter(apt => apt.status === 'pending').length || 0,
    completedAppointments: appointments?.filter(apt => apt.status === 'completed').length || 0,
  }

  const handleToggleAvailability = async () => {
    try {
      const nextAvailability = !isAvailable
      await apiClient.patch(`/users/${user._id}/availability`, {
        isAvailable: nextAvailability,
      })
      setIsAvailable(nextAvailability)
      await updateProfile({ isAvailable: nextAvailability })
      toast.success(
        'Availability updated',
        nextAvailability ? 'You are now available for new appointments.' : 'You are now unavailable.'
      )
    } catch (error) {
      console.error('Error updating availability:', error)
      toast.error('Failed to update availability', error.message || 'Please try again.')
    }
  }

  const handleLogout = () => {
    logout()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#10B981]/10 text-[#10B981]'
      case 'pending':
        return 'bg-[#F59E0B]/10 text-[#F59E0B]'
      case 'completed':
        return 'bg-[#3B82F6]/10 text-[#3B82F6]'
      case 'cancelled':
        return 'bg-[#EF4444]/10 text-[#EF4444]'
      default:
        return 'bg-[#5C6169]/10 text-[#5C6169]'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F0FF] via-white to-white">
      <TopNavigation />
      
      <div className="mx-auto max-w-7xl px-4 py-6 pt-32">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#102851]">
              Dr. {user?.name || 'Doctor'}
            </h1>
            <p className="mt-1 text-[#5C6169]">
              {user?.specialization || 'Specialist'} • {user?.experience || 'Experienced'}
            </p>
            <p className="mt-1 text-sm text-[#5C6169]">{user?.clinic || 'Clinic'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <UserRoleBadge />
            <Link to="/profile">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-[#E4EBF5] cursor-pointer hover:border-[#2AA8FF] transition">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="bg-[#2AA8FF]/10 text-[#2AA8FF] font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'D'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-[#DCE6F5] bg-white px-3 py-1.5">
              <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
              <span className="text-sm font-medium text-[#102851]">
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <Button
              onClick={handleToggleAvailability}
              variant="outline"
              size="sm"
              className={`border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] ${
                isAvailable ? 'hover:border-red-300 hover:text-red-600' : 'hover:border-green-300 hover:text-green-600'
              }`}
            >
              {isAvailable ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Set Unavailable</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Set Available</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/notifications')}
              className="border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
            >
              <Bell className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Notifications</span>
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              size="sm"
              className="border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Settings</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-[#DCE6F5] bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5C6169]">Today's Appointments</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.todayAppointments}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10">
                  <Calendar className="h-6 w-6 text-[#2AA8FF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5C6169]">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.pendingAppointments}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F59E0B]/10">
                  <Clock className="h-6 w-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5C6169]">Completed</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.completedAppointments}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
                  <CheckCircle2 className="h-6 w-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5C6169]">Total Patients</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.totalAppointments}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]/10">
                  <Users className="h-6 w-6 text-[#8B5CF6]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#102851]">Today's Schedule</CardTitle>
                  <CardDescription className="text-[#5C6169]">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilter(!showFilter)}
                    className={`border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851] ${showFilter ? 'bg-[#F5F8FF] border-[#2AA8FF]' : ''}`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSearch(!showSearch)}
                    className={`border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851] ${showSearch ? 'bg-[#F5F8FF] border-[#2AA8FF]' : ''}`}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#2AA8FF] border-t-transparent"></div>
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-[#ABB6C7]" />
                    <p className="mt-4 text-[#5C6169]">No appointments scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between rounded-lg border border-[#E4EBF5] bg-[#F5F8FF] p-4 transition hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10">
                            <UserCheck className="h-6 w-6 text-[#2AA8FF]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#102851]">
                              {appointment.patient?.name || 'Patient'}
                            </p>
                            <p className="text-sm text-[#5C6169]">
                              {appointment.patient?.email || 'Email not available'}
                            </p>
                            <div className="mt-1 flex items-center gap-4 text-xs text-[#5C6169]">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                {appointment.type === 'online' ? 'Online' : 'Offline'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment._id)}
                            className="border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="mt-6 border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#102851]">Upcoming Appointments</CardTitle>
                <CardDescription className="text-[#5C6169]">
                  Your scheduled appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto h-10 w-10 text-[#ABB6C7]" />
                    <p className="mt-2 text-sm text-[#5C6169]">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between rounded-lg border border-[#E4EBF5] bg-[#F5F8FF] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2AA8FF]/10">
                            <Calendar className="h-5 w-5 text-[#2AA8FF]" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-[#102851]">
                              {appointment.patient?.name || 'Patient'}
                            </p>
                            <p className="text-xs text-[#5C6169]">
                              {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                            </p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Profile Info */}
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#102851]">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Specialization</p>
                  <p className="mt-1 text-sm font-semibold text-[#102851]">
                    {user?.specialization || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Experience</p>
                  <p className="mt-1 text-sm font-semibold text-[#102851]">
                    {user?.experience || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Consultation Fee</p>
                  <p className="mt-1 text-sm font-semibold text-[#102851]">
                    ₹{user?.consultationFee || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Location</p>
                  <p className="mt-1 text-sm font-semibold text-[#102851]">
                    {user?.location || 'Not set'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="w-full border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#102851]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/appointments')}
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View All Appointments
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/patients')}
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Patient List
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Analytics can show stats in a modal or separate page
                    toast.info('Analytics', 'Analytics feature coming soon')
                  }}
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Availability Status */}
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#102851]">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-[#E4EBF5] bg-[#F5F8FF] p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${isAvailable ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#102851]">
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </p>
                      <p className="text-xs text-[#5C6169]">
                        {isAvailable ? 'Patients can book appointments' : 'Not accepting new appointments'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <AppointmentDetailsModal
            appointmentId={selectedAppointment}
            open={!!selectedAppointment}
            onOpenChange={(open) => !open && setSelectedAppointment(null)}
          />
        )}
      </div>
    </div>
  )
}

export default DoctorDashboard

