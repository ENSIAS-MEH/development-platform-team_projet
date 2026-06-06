import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'

export function FormationCard({
  title,
  mentor,
  price,
  level,
  duration,
  onClick,
}: {
  title: string
  mentor: string
  price: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: string
  onClick: () => void
}) {
  return (
    <Card className="flex flex-col gap-4 p-6 hover:shadow-lg transition-shadow">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
          <StatusBadge status={level} />
        </div>
        <p className="text-xs text-muted-foreground">by {mentor}</p>
      </div>

      <div className="flex items-center gap-4 border-t pt-4">
        <div className="text-sm">
          <p className="font-semibold text-primary">
            {price === 0 ? 'Free' : `$${price}`}
          </p>
          <p className="text-xs text-muted-foreground">{duration}</p>
        </div>
        <Button size="sm" onClick={onClick} className="ml-auto">
          View
        </Button>
      </div>
    </Card>
  )
}
