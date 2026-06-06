import { Button } from '@/components/ui/button'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-5xl opacity-50">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          onClick={(e) => {
            if (action.href) {
              window.location.href = action.href
            } else if (action.onClick) {
              action.onClick()
            }
          }}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
