import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Stethoscope, FileText, MapPin, Phone, Mail, X } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'

const AppointmentDetailsModal = ({ appointmentId, open, onOpenChange }) => {
  const { user } = useAuth()
  const toast = useToast()
  const appointment = useQuery(
    api.appointments.getAppointmentById,
    appointmentId ? { appointmentId } : 'skip'
  )
  const updateStatus = useMutation(api.appointments.updateAppointmentStatus)

  if (!appointment) {
    return null
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({
        appointmentId: appointment._id,
        status: newStatus,
      })
      toast.success('Status updated', `Appointment status changed to ${newStatus}`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Update failed', error.message || 'Failed to update appointment status')
    }
  }

  const canUpdateStatus = user?.role === 'doctor' && 
    (appointment.status === 'pending' || appointment.status === 'confirmed' || appointment.status === 'completed')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#102851]">Appointment Details</DialogTitle>
          <DialogDescription className="text-[#5C6169]">
            View and manage appointment information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
              appointment.status === 'confirmed'
                ? 'bg-[#10B981]/10 text-[#10B981]'
                : appointment.status === 'pending'
                ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                : appointment.status === 'completed'
                ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                : 'bg-[#EF4444]/10 text-[#EF4444]'
            }`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
            {user?.role === 'doctor' && (
              <div className="flex gap-2">
                {appointment.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate('confirmed')}
                    className="bg-[#10B981] text-white hover:bg-[#059669]"
                  >
                    Confirm
                  </Button>
                )}
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('completed')}
                    className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10"
                  >
                    Mark Complete
                  </Button>
                )}
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Appointment Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Date</p>
                  <p className="text-sm font-semibold text-[#102851]">
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Time</p>
                  <p className="text-sm font-semibold text-[#102851]">{appointment.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Stethoscope className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-[#5C6169]">Type</p>
                  <p className="text-sm font-semibold text-[#102851]">
                    {appointment.type === 'online' ? 'Online Consultation' : 'Offline Visit'}
                  </p>
                </div>
              </div>
            </div>

            {/* Patient/Doctor Info */}
            <div className="space-y-4">
              {user?.role === 'doctor' && appointment.patient && (
                <>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-[#5C6169]">Patient</p>
                      <p className="text-sm font-semibold text-[#102851]">{appointment.patient.name}</p>
                    </div>
                  </div>
                  {appointment.patient.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#5C6169]">Email</p>
                        <p className="text-sm font-semibold text-[#102851]">{appointment.patient.email}</p>
                      </div>
                    </div>
                  )}
                  {appointment.patient.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#5C6169]">Phone</p>
                        <p className="text-sm font-semibold text-[#102851]">{appointment.patient.phone}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {user?.role === 'patient' && appointment.doctor && (
                <>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-[#5C6169]">Doctor</p>
                      <p className="text-sm font-semibold text-[#102851]">{appointment.doctor.name}</p>
                    </div>
                  </div>
                  {appointment.doctor.specialization && (
                    <div className="flex items-start gap-3">
                      <Stethoscope className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#5C6169]">Specialization</p>
                        <p className="text-sm font-semibold text-[#102851]">{appointment.doctor.specialization}</p>
                      </div>
                    </div>
                  )}
                  {appointment.doctor.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-[#5C6169]">Location</p>
                        <p className="text-sm font-semibold text-[#102851]">{appointment.doctor.location}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="border-t border-[#E4EBF5] pt-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#5C6169] mb-2">Notes</p>
                  <p className="text-sm text-[#102851]">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Consultation Notes (for doctors) */}
          {user?.role === 'doctor' && appointment.consultationNotes && (
            <div className="border-t border-[#E4EBF5] pt-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#5C6169] mb-2">Consultation Notes</p>
                  <p className="text-sm text-[#102851]">{appointment.consultationNotes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prescription (for patients) */}
          {user?.role === 'patient' && appointment.prescription && (
            <div className="border-t border-[#E4EBF5] pt-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#2AA8FF] mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#5C6169] mb-2">Prescription</p>
                  <p className="text-sm text-[#102851]">{appointment.prescription}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentDetailsModal

