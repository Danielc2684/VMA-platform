'use client'

import { useState } from 'react'
import { MoreHorizontal, Trash2, ArrowRight } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConvertToClientDialog } from './ConvertToClientDialog'
import type { LeadStatus, Priority, LeadSource } from '@prisma/client'

export interface LeadCardData {
  id: string
  firstName: string
  lastName: string
  company: string | null
  email: string | null
  status: LeadStatus
  priority: Priority
  source: LeadSource
  estimatedValue: string | null
  createdAt: Date
}

interface LeadCardProps {
  lead: LeadCardData
}

export function LeadCard({ lead }: LeadCardProps): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const qc = useQueryClient()

  const { mutate: deleteLead } = useMutation({
    mutationFn: () =>
      fetch(`/api/leads/${lead.id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      toast.success('Lead deleted')
      void qc.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: () => toast.error('Failed to delete lead'),
  })

  const fullName = `${lead.firstName} ${lead.lastName}`

  return (
    <>
      <div className="group relative rounded-xl bg-vma-surface border border-vma-border p-3.5 cursor-grab active:cursor-grabbing hover:border-vma-violet/40 transition-colors">
        {/* Header: priority + menu */}
        <div className="flex items-start justify-between mb-2">
          <StatusBadge status={lead.priority} />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            className="p-1 rounded text-vma-text-dim hover:text-vma-text hover:bg-vma-surface-2 transition-colors"
            aria-label="Lead options"
          >
            <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Name + company */}
        <p className="font-display text-sm font-bold text-vma-text">{fullName}</p>
        {lead.company && (
          <p className="text-xs text-vma-text-muted mt-0.5">{lead.company}</p>
        )}

        {/* Source + value */}
        <div className="flex items-center justify-between mt-3">
          <StatusBadge status={lead.source} />
          {lead.estimatedValue && (
            <span className="font-mono text-xs font-bold text-vma-violet">
              ${Number(lead.estimatedValue).toLocaleString()}
            </span>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-[10px] text-vma-text-dim mt-2">
          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
        </p>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-2 top-8 z-30 rounded-lg bg-vma-surface-2 border border-vma-border shadow-xl py-1 min-w-36">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); setConvertOpen(true) }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-vma-text-muted hover:text-vma-text hover:bg-vma-surface transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              Convert to Client
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); deleteLead() }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-vma-red hover:bg-vma-surface transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete
            </button>
          </div>
        )}
      </div>

      <ConvertToClientDialog
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        leadId={lead.id}
        defaultOrgName={lead.company ?? ''}
      />
    </>
  )
}
