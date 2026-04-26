import { formatDistanceToNow } from 'date-fns'

interface AuditEntry {
  id: string
  action: string
  entityType: string
  entityId: string | null
  createdAt: Date
  actor: { fullName: string | null; email: string } | null
}

interface ActivityFeedProps {
  entries: AuditEntry[]
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function ActivityFeed({ entries }: ActivityFeedProps): React.JSX.Element {
  return (
    <div className="rounded-xl bg-vma-surface border border-vma-border p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-vma-text">Recent Activity</h3>

      {entries.length === 0 ? (
        <p className="text-xs text-vma-text-muted py-4 text-center">No activity yet</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {entries.map((entry) => {
            const actorName = entry.actor?.fullName ?? entry.actor?.email ?? 'System'
            const initials = actorName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

            return (
              <div key={entry.id} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full bg-vma-violet-dim border border-vma-violet/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-vma-violet"
                  aria-hidden="true"
                >
                  {initials || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-vma-text leading-snug">
                    <span className="font-medium">{actorName}</span>{' '}
                    <span className="text-vma-text-muted">{formatAction(entry.action)}</span>{' '}
                    <span className="text-vma-text-muted text-[10px] capitalize">{entry.entityType.toLowerCase()}</span>
                  </p>
                  <p className="text-[10px] text-vma-text-dim mt-0.5">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
