import { History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { AuditLogEntry } from './ClientProfileTabs'

interface HistoryTabProps {
  auditLogs: AuditLogEntry[]
}

export function HistoryTab({ auditLogs }: HistoryTabProps): React.JSX.Element {
  if (auditLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <History className="h-8 w-8" />
        <p className="text-sm">No activity logged yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {auditLogs.map((log) => {
        const actor = log.actor
        const initials = actor
          ? (actor.fullName ?? actor.email).charAt(0).toUpperCase()
          : '?'

        return (
          <div key={log.id} className="flex items-start gap-3 p-4 rounded-xl border border-vma-border bg-vma-surface hover:bg-vma-surface-2 transition-colors">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
              style={{ background: 'var(--vma-gradient-brand)' }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-vma-text">
                  {actor?.fullName ?? actor?.email ?? 'System'}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-vma-violet/10 text-vma-violet">
                  {log.action}
                </span>
                <span className="text-[10px] text-vma-text-dim">{log.entityType}</span>
              </div>
              <p className="text-[11px] text-vma-text-muted mt-1">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
