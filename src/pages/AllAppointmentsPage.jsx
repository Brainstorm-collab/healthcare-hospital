import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import TopNavigation from '@/components/layout/TopNavigation'
import FooterSection from '@/components/sections/FooterSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Stethoscope, Filter, Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal'

const AllAppointmentsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const appointments = useQuery(
    api.appointments.getAppointmentsByUser,
    user?._id ? { userId: user._id, role: user.role } : 'skip'
  )

  const filteredAppointments = appointments?.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      (user.role === 'doctor' 
        ? apt.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patient?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        : apt.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.doctor?.specialization?.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  }) || []

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
      <main className="mx-auto max-w-7xl px-4 py-8 pt-32">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 border-[#DCE6F5] bg-white text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-[#102851]">All Appointments</h1>
          <p className="text-[#5C6169] mt-2">View and manage all your appointments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={
                      statusFilter === status
                        ? 'bg-[#2AA8FF] text-white hover:bg-[#1896f0]'
                        : 'border-[#DCE6F5] text-[#102851] hover:bg-[#F5F8FF] hover:text-[#102851]'
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#DCE6F5] bg-[#F5F8FF] text-sm text-[#102851] placeholder:text-[#8FA3C0] focus:outline-none focus:border-[#2AA8FF]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {appointments === undefined ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2AA8FF] border-t-transparent"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-16 w-16 text-[#ABB6C7]" />
              <p className="mt-4 text-lg font-medium text-[#102851]">No appointments found</p>
              <p className="mt-2 text-sm text-[#5C6169]">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : user.role === 'patient'
                  ? 'Book your first appointment'
                  : 'No appointments scheduled yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment._id} className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2AA8FF]/10">
                        <Calendar className="h-6 w-6 text-[#2AA8FF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[#102851]">
                          {user.role === 'doctor' 
                            ? appointment.patient?.name || 'Patient'
                            : appointment.doctor?.name || 'Doctor'}
                        </h3>
                        <p className="text-sm text-[#5C6169] mt-1">
                          {user.role === 'doctor'
                            ? appointment.patient?.email || 'Email not available'
                            : appointment.doctor?.specialization || 'Specialist'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-[#5C6169]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
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
                      <span className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusColor(appointment.status)}`}>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedAppointment && (
          <AppointmentDetailsModal
            appointmentId={selectedAppointment}
            open={!!selectedAppointment}
            onOpenChange={(open) => !open && setSelectedAppointment(null)}
          />
        )}
      </main>
      <FooterSection />
    </div>
  )
}

export default AllAppointmentsPage

