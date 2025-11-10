import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Pill, 
  Activity, 
  Plus,
  Search,
  Filter,
  LogOut,
  Settings,
  Bell
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import TopNavigation from '@/components/layout/TopNavigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import UserRoleBadge from '@/components/UserRoleBadge'
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal'
import { apiClient } from '@/lib/api'

/**
 * PatientDashboard
 * ----------------
 * Patient-centric view showing appointments, medical records, and quick links.
 * Mirrors the doctor dashboard structure but focused on patient-specific actions.
 */
const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const [appointments, setAppointments] = useState([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  // Fetch patient's appointments
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
          role: 'patient',
        })
        if (!cancelled) {
          setAppointments(response ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch appointments:', error)
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
  }, [user?._id])

  // Fetch patient's medical records
  useEffect(() => {
    let cancelled = false

    const loadMedicalRecords = async () => {
      if (!user?._id) {
        setMedicalRecords([])
        return
      }

      try {
        setRecordsLoading(true)
        const response = await apiClient.get('/medical-records', { patientId: user._id })
        if (!cancelled) {
          setMedicalRecords(response ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch medical records:', error)
        }
      } finally {
        if (!cancelled) {
          setRecordsLoading(false)
        }
      }
    }

    loadMedicalRecords()

    return () => {
      cancelled = true
    }
  }, [user?._id])

  // Summaries for the KPI cards
  const stats = {
    totalAppointments: appointments?.length || 0,
    upcomingAppointments: appointments?.filter(apt => 
      apt.status === 'confirmed' || apt.status === 'pending'
    ).length || 0,
    completedAppointments: appointments?.filter(apt => 
      apt.status === 'completed'
    ).length || 0,
    totalRecords: medicalRecords?.length || 0,
  }

  const upcomingAppointments = appointments?.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  ).slice(0, 5) || []

  const recentRecords = medicalRecords?.slice(0, 3) || []

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7F0FF] via-white to-white">
      <TopNavigation />
      
      <div className="mx-auto max-w-7xl px-4 py-6 pt-32">
        {/* --- Header --- */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#102851]">
              Welcome back, {user?.name?.split(' ')[0] || 'Patient'}!
            </h1>
            <p className="mt-1 text-[#5C6169]">Manage your health and appointments</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <UserRoleBadge />
            <Link to="/profile">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-[#E4EBF5] cursor-pointer hover:border-[#2AA8FF] transition">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="bg-[#2AA8FF]/10 text-[#2AA8FF] font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
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
              className="border-[#DCE6F5] bg-white hover:bg-[#F5F8FF]"
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

        {/* --- Stats Cards --- */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5C6169]">Total Appointments</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.totalAppointments}</p>
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
                  <p className="text-sm font-medium text-[#5C6169]">Upcoming</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.upcomingAppointments}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/10">
                  <Clock className="h-6 w-6 text-[#10B981]" />
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6]/10">
                  <Activity className="h-6 w-6 text-[#3B82F6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5C6169]">Medical Records</p>
                  <p className="mt-2 text-3xl font-bold text-[#102851]">{stats.totalRecords}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]/10">
                  <FileText className="h-6 w-6 text-[#8B5CF6]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Main Content --- */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#102851]">Upcoming Appointments</CardTitle>
                  <CardDescription className="text-[#5C6169]">
                    Your scheduled appointments
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate('/find-doctors')}
                  className="bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#2AA8FF] border-t-transparent"></div>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-[#ABB6C7]" />
                    <p className="mt-4 text-[#5C6169]">No upcoming appointments</p>
                    <Button
                      onClick={() => navigate('/find-doctors')}
                      className="mt-4 bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
                    >
                      Book Your First Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between rounded-lg border border-[#E4EBF5] bg-[#F5F8FF] p-4 transition hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10">
                            <Calendar className="h-6 w-6 text-[#2AA8FF]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#102851]">
                              {appointment.doctor?.name || 'Doctor'}
                            </p>
                            <p className="text-sm text-[#5C6169]">
                              {appointment.doctor?.specialization || 'Specialist'}
                            </p>
                            <div className="mt-1 flex items-center gap-4 text-xs text-[#5C6169]">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              appointment.status === 'confirmed'
                                ? 'bg-[#10B981]/10 text-[#10B981]'
                                : appointment.status === 'pending'
                                ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}
                          >
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
          </div>

          {/* Quick Actions & Recent Records */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#102851]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/find-doctors')}
                  className="w-full justify-start bg-[#2AA8FF] text-white hover:bg-[#1896f0]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/medical-records')}
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Medical Records
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/medical-records')}
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <Pill className="mr-2 h-4 w-4" />
                  View Prescriptions
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  variant="outline"
                  className="w-full justify-start border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                >
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Medical Records */}
            <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#102851]">Recent Records</CardTitle>
                <CardDescription className="text-[#5C6169]">Latest medical records</CardDescription>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-[#2AA8FF] border-t-transparent"></div>
                  </div>
                ) : recentRecords.length === 0 ? (
                  <div className="py-8 text-center">
                    <FileText className="mx-auto h-8 w-8 text-[#ABB6C7]" />
                    <p className="mt-2 text-sm text-[#5C6169]">No medical records yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentRecords.map((record) => (
                      <div
                        key={record._id}
                        className="rounded-lg border border-[#E4EBF5] bg-[#F5F8FF] p-3"
                      >
                        <p className="font-semibold text-sm text-[#102851]">{record.diagnosis}</p>
                        <p className="mt-1 text-xs text-[#5C6169]">
                          {record.doctor?.name || 'Doctor'} • {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => navigate('/medical-records')}
                      className="w-full border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
                    >
                      View All Records
                    </Button>
                  </div>
                )}
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

export default PatientDashboard

