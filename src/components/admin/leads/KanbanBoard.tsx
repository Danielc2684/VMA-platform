'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { LeadStatus } from '@prisma/client'
import { KanbanColumn } from './KanbanColumn'
import { LeadCard, type LeadCardData } from './LeadCard'

interface KanbanBoardProps {
  leads: LeadCardData[]
}

const COLUMNS: { status: LeadStatus; label: string }[] = [
  { status: LeadStatus.NEW,           label: 'New' },
  { status: LeadStatus.CONTACTED,     label: 'Contacted' },
  { status: LeadStatus.QUALIFIED,     label: 'Qualified' },
  { status: LeadStatus.PROPOSAL_SENT, label: 'Proposal Sent' },
  { status: LeadStatus.NEGOTIATING,   label: 'Negotiating' },
  { status: LeadStatus.WON,           label: 'Won' },
  { status: LeadStatus.LOST,          label: 'Lost' },
  { status: LeadStatus.UNQUALIFIED,   label: 'Unqualified' },
]

export function KanbanBoard({ leads }: KanbanBoardProps): React.JSX.Element {
  const [activeId, setActiveId] = useState<string | null>(null)
  const qc = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      fetch(`/api/leads/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      }).then((r) => r.json()),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['leads'] }),
    onError:   () => toast.error('Failed to update lead status'),
  })

  const activeLead = leads.find((l) => l.id === activeId) ?? null

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over) return
      const newStatus = over.id as LeadStatus
      const lead = leads.find((l) => l.id === (active.id as string))
      if (!lead || lead.status === newStatus) return
      updateStatus({ id: lead.id, status: newStatus })
    },
    [leads, updateStatus],
  )

  const leadsByStatus = Object.fromEntries(
    COLUMNS.map((col) => [
      col.status,
      leads.filter((l) => l.status === col.status),
    ]),
  ) as Record<LeadStatus, LeadCardData[]>

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4" role="list" aria-label="Lead pipeline kanban board">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            leads={leadsByStatus[col.status] ?? []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="rotate-2 opacity-90 shadow-2xl">
            <LeadCard lead={activeLead} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
