import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  accentColor?: 'violet' | 'green' | 'red' | 'magenta'
}

const ACCENT_CLASSES: Record<NonNullable<StatsCardProps['accentColor']>, string> = {
  violet:  'border-vma-violet text-vma-violet',
  green:   'border-vma-green text-vma-green',
  red:     'border-vma-red text-vma-red',
  magenta: 'border-vma-magenta text-vma-magenta',
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  accentColor = 'violet',
}: StatsCardProps): React.JSX.Element {
  const accentClass = ACCENT_CLASSES[accentColor]

  return (
    <div className={`relative rounded-xl bg-vma-surface border-l-4 border border-vma-border p-5 flex flex-col gap-3 ${accentClass.split(' ')[0]}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-vma-text-muted">
          {label}
        </p>
        <div className={`p-1.5 rounded-lg bg-vma-surface-2 ${accentClass.split(' ')[1]}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <p className="font-mono text-2xl font-bold text-vma-text">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {trend && (
        <p className={`text-xs font-medium ${trendUp ? 'text-vma-green' : 'text-vma-red'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  )
}
