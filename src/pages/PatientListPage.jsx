import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import TopNavigation from '@/components/layout/TopNavigation'
import FooterSection from '@/components/sections/FooterSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { User, Mail, Phone, Calendar, Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api'

const PatientListPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

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

  const uniquePatients = useMemo(() => {
    const acc = []
    appointments.forEach((apt) => {
      if (apt.patient && !acc.find((p) => p._id === apt.patientId)) {
        acc.push({
          _id: apt.patientId,
          name: apt.patient.name,
          email: apt.patient.email,
          phone: apt.patient.phone,
          lastAppointment: apt.date,
          totalAppointments: appointments.filter((a) => a.patientId === apt.patientId).length,
        })
      }
    })
    return acc
  }, [appointments])

  const filteredPatients = uniquePatients.filter(patient =>
    searchQuery === '' ||
    patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold text-[#102851]">Patient List</h1>
          <p className="text-[#5C6169] mt-2">View all your patients</p>
        </div>

        {/* Search */}
        <Card className="mb-6 border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#DCE6F5] bg-[#F5F8FF] text-sm text-[#102851] placeholder:text-[#8FA3C0] focus:outline-none focus:border-[#2AA8FF]"
              />
            </div>
          </CardContent>
        </Card>

        {appointmentsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2AA8FF] border-t-transparent"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="py-12 text-center">
              <User className="mx-auto h-16 w-16 text-[#ABB6C7]" />
              <p className="mt-4 text-lg font-medium text-[#102851]">No patients found</p>
              <p className="mt-2 text-sm text-[#5C6169]">
                {searchQuery ? 'Try adjusting your search' : 'Your patients will appear here after appointments'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((patient) => (
              <Card key={patient._id} className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-[#E4EBF5]">
                      <AvatarImage src={patient.profileImage} alt={patient.name} />
                      <AvatarFallback className="bg-[#2AA8FF]/10 text-[#2AA8FF] font-semibold">
                        {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#102851]">{patient.name}</h3>
                      <div className="mt-2 space-y-1 text-xs text-[#5C6169]">
                        {patient.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{patient.email}</span>
                          </div>
                        )}
                        {patient.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{patient.totalAppointments} appointment{patient.totalAppointments !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <FooterSection />
    </div>
  )
}

export default PatientListPage

