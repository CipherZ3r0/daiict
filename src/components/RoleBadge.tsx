// src/components/RoleBadge.tsx - Role indicator badge component
import { Badge } from '@/components/ui/badge'
import { Leaf, Building, ShieldCheck } from 'lucide-react'

interface RoleBadgeProps {
  role: 'Producer' | 'Government' | 'Auditor'
  size?: 'sm' | 'md' | 'lg'
}

export default function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const getRoleConfig = () => {
    switch (role) {
      case 'Producer':
        return {
          label: 'Producer',
          icon: Leaf,
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'Government':
        return {
          label: 'Government',
          icon: Building,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        }
      case 'Auditor':
        return {
          label: 'Auditor',
          icon: ShieldCheck,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        }
      default:
        return {
          label: 'Unknown',
          icon: ShieldCheck,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getRoleConfig()
  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1 font-medium`}
    >
      <IconComponent className={iconSizes[size]} />
      {config.label}
    </Badge>
  )
}