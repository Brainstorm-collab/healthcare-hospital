import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { User, Stethoscope } from 'lucide-react'

const UserRoleBadge = ({ className = '' }) => {
  const { user } = useAuth()

  if (!user) return null

  const roleConfig = {
    patient: {
      label: 'Patient',
      icon: User,
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    doctor: {
      label: 'Doctor',
      icon: Stethoscope,
      className: 'bg-green-50 text-green-700 border-green-200',
    },
  }

  const config = roleConfig[user.role] || roleConfig.patient
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  )
}

export default UserRoleBadge

