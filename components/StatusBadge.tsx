import { Badge } from '@/components/ui/badge'

type BadgeType =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'CLOSED'
  | 'STUDENT'
  | 'MENTOR'
  | 'ADMIN'
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'

const badgeConfig: Record<BadgeType, { variant: any; label: string }> = {
  OPEN: { variant: 'default', label: 'Open' },
  IN_PROGRESS: { variant: 'secondary', label: 'In Progress' },
  CLOSED: { variant: 'destructive', label: 'Closed' },
  STUDENT: { variant: 'default', label: 'Student' },
  MENTOR: { variant: 'default', label: 'Mentor' },
  ADMIN: { variant: 'destructive', label: 'Admin' },
  BEGINNER: { variant: 'default', label: 'Beginner' },
  INTERMEDIATE: { variant: 'secondary', label: 'Intermediate' },
  ADVANCED: { variant: 'destructive', label: 'Advanced' },
}

export function StatusBadge({ status }: { status: BadgeType }) {
  const config = badgeConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
