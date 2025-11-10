import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import TopNavigation from '@/components/layout/TopNavigation'
import FooterSection from '@/components/sections/FooterSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Calendar, Download, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api'

const MedicalRecordsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [medicalRecords, setMedicalRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadRecords = async () => {
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

    loadRecords()

    return () => {
      cancelled = true
    }
  }, [user?._id])

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
          <h1 className="text-3xl font-bold text-[#102851]">Medical Records</h1>
          <p className="text-[#5C6169] mt-2">View all your medical records and prescriptions</p>
        </div>

        {recordsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2AA8FF] border-t-transparent"></div>
          </div>
        ) : medicalRecords.length === 0 ? (
          <Card className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-16 w-16 text-[#ABB6C7]" />
              <p className="mt-4 text-lg font-medium text-[#102851]">No medical records found</p>
              <p className="mt-2 text-sm text-[#5C6169]">Your medical records will appear here after appointments</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <Card key={record._id} className="border-[#E4EBF5] bg-white shadow-[0_10px_25px_rgba(18,42,76,0.08)]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-[#102851]">{record.diagnosis}</CardTitle>
                      <CardDescription className="text-[#5C6169] mt-1">
                        {record.doctor?.name || 'Doctor'} • {record.doctor?.specialization || 'Specialist'}
                      </CardDescription>
                    </div>
                    <span className="rounded-full bg-[#2AA8FF]/10 px-3 py-1 text-xs font-semibold text-[#2AA8FF]">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {record.notes && (
                    <div>
                      <p className="text-xs font-medium text-[#5C6169] mb-1">Notes</p>
                      <p className="text-sm text-[#102851]">{record.notes}</p>
                    </div>
                  )}
                  {record.prescription && (
                    <div>
                      <p className="text-xs font-medium text-[#5C6169] mb-1">Prescription</p>
                      <p className="text-sm text-[#102851]">{record.prescription}</p>
                    </div>
                  )}
                  {record.reports && record.reports.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-[#5C6169] mb-2">Reports</p>
                      <div className="flex flex-wrap gap-2">
                        {record.reports.map((report, index) => (
                          <a
                            key={index}
                            href={report}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-[#DCE6F5] bg-[#F5F8FF] px-3 py-2 text-sm text-[#102851] hover:bg-[#E7F0FF] transition"
                          >
                            <Download className="h-4 w-4" />
                            Report {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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

export default MedicalRecordsPage

