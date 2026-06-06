import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './StatusBadge'

export function ProjectCard({
  title,
  description,
  status,
  owner,
  skills = [],
  onClick,
}: {
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  owner: string
  skills?: string[] | string
  onClick: () => void
}) {
  const skillList = Array.isArray(skills)
    ? skills
    : skills
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : []

  return (
    <Card className="flex flex-col gap-4 p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex-grow">
        {skillList.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {skillList.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-block rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent-foreground"
              >
                {skill}
              </span>
            ))}
            {skillList.length > 3 && (
              <span className="inline-block rounded-full bg-accent/10 px-2 py-1 text-xs text-muted-foreground">
                +{skillList.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">by {owner}</span>
        <Button size="sm" onClick={onClick}>
          View
        </Button>
      </div>
    </Card>
  )
}
