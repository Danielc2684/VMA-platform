'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, LayoutGrid, Table } from 'lucide-react'
import { KanbanBoard } from '@/components/admin/leads/KanbanBoard'
import { LeadTable } from '@/components/admin/leads/LeadTable'
import { AddLeadDialog } from '@/components/admin/leads/AddLeadDialog'
import type { LeadCardData } from '@/components/admin/leads/LeadCard'
import type { LeadStatus } from '@prisma/client'

interface LeadsResponse {
  leads: (LeadCardData & { estimatedValue: string | null })[]
}

async function fetchLeads(): Promise<LeadCardData[]> {
  const res = await fetch('/api/leads')
  if (!res.ok) throw new Error('Failed to fetch leads')
  const data = (await res.json()) as LeadsResponse
  return data.leads
}

type ViewMode = 'kanban' | 'table'

function getStoredView(): ViewMode {
  if (typeof window === 'undefined') return 'kanban'
  return (localStorage.getItem('leads-view') as ViewMode | null) ?? 'kanban'
}

export default function LeadsPage(): React.JSX.Element {
  const [view, setView] = useState<ViewMode>(getStoredView)
  const [addOpen, setAddOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter] = useState<LeadStatus[]>([])

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
  })

  const switchView = (v: ViewMode): void => {
    setView(v)
    localStorage.setItem('leads-view', v)
  }

  return (
    <div className="space-y-5 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-vma-text">Leads</h1>
          <p className="text-vma-text-muted text-sm mt-0.5">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} in pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-vma-border bg-vma-surface overflow-hidden">
            <button
              type="button"
              onClick={() => switchView('kanban')}
              aria-pressed={view === 'kanban'}
              className={`p-2 transition-colors ${view === 'kanban' ? 'bg-vma-violet text-white' : 'text-vma-text-muted hover:text-vma-text'}`}
              aria-label="Kanban view"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => switchView('table')}
              aria-pressed={view === 'table'}
              className={`p-2 transition-colors ${view === 'table' ? 'bg-vma-violet text-white' : 'text-vma-text-muted hover:text-vma-text'}`}
              aria-label="Table view"
            >
              <Table className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--vma-gradient-brand)' }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Table search bar (table view only) */}
      {view === 'table' && (
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email…"
            className="flex-1 max-w-sm px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
            aria-label="Search leads"
          />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-vma-surface border border-vma-border animate-pulse" />
          ))}
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard leads={leads} />
      ) : (
        <LeadTable leads={leads} searchQuery={search} statusFilter={statusFilter} />
      )}

      <AddLeadDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
