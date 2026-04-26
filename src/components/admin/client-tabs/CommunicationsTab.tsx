import { MessageSquare, Calendar } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow, format } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface CommunicationsTabProps {
  org: OrgWithRelations
}

export function CommunicationsTab({ org }: CommunicationsTabProps): React.JSX.Element {
  const { requests, appointments } = org
  const isEmpty = requests.length === 0 && appointments.length === 0

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <MessageSquare className="h-8 w-8" />
        <p className="text-sm">No communications on record.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Client Requests */}
      {requests.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-vma-text mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-vma-text-dim" aria-hidden="true" />
            Client Requests
          </h3>
          <div className="rounded-xl border border-vma-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-vma-surface border-b border-vma-border">
                <tr>
                  {['Title', 'Status', 'Priority', 'Submitted By', 'Created'].map((h) => (
                    <th key={h} className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <tr
                    key={req.id}
                    className={`border-b border-vma-border last:border-0 hover:bg-vma-surface-2 transition-colors ${
                      i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-vma-text">{req.title}</p>
                      <p className="text-[11px] text-vma-text-muted mt-0.5 line-clamp-1">{req.description}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={req.priority} /></td>
                    <td className="px-4 py-3 text-xs text-vma-text-muted">
                      {req.submittedBy.fullName ?? req.submittedBy.email}
                    </td>
                    <td className="px-4 py-3 text-xs text-vma-text-muted">
                      {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Appointments */}
      {appointments.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-vma-text mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-vma-text-dim" aria-hidden="true" />
            Appointments
          </h3>
          <div className="space-y-2">
            {appointments.map((apt) => (
              <div key={apt.id} className="rounded-xl border border-vma-border bg-vma-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-vma-text">{apt.title}</p>
                    {apt.description && (
                      <p className="text-xs text-vma-text-muted mt-0.5">{apt.description}</p>
                    )}
                    <p className="text-xs text-vma-text-dim mt-1.5">
                      {format(new Date(apt.startTime), 'MMM d, yyyy · h:mm a')} — {format(new Date(apt.endTime), 'h:mm a')}
                    </p>
                    {apt.location && (
                      <p className="text-xs text-vma-text-muted mt-0.5">{apt.location}</p>
                    )}
                    {apt.meetingUrl && (
                      <a
                        href={apt.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-vma-violet hover:underline mt-0.5 inline-block"
                      >
                        Join meeting
                      </a>
                    )}
                  </div>
                  {apt.isConfirmed ? (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex-shrink-0">
                      Confirmed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex-shrink-0">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
