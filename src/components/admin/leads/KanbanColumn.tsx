'use client'

import { useDroppable } from '@dnd-kit/core'
import type { LeadStatus } from '@prisma/client'
import { LeadCard, type LeadCardData } from './LeadCard'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface KanbanColumnProps {
  status: LeadStatus
  label: string
  leads: LeadCardData[]
}

export function KanbanColumn({ status, label, leads }: KanbanColumnProps): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      role="listitem"
      aria-label={`${label} column, ${leads.length} leads`}
      className={`flex-shrink-0 w-64 flex flex-col rounded-xl border transition-colors ${
        isOver ? 'border-vma-violet bg-vma-violet-dim' : 'border-vma-border bg-vma-surface/50'
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-vma-border">
        <span className="text-xs font-semibold text-vma-text-muted uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs font-mono font-bold text-vma-text-dim">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5 p-2.5 flex-1 min-h-[120px]">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
          {leads.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-vma-text-dim">Drop here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
