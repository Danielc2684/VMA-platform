'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Trash2, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConvertToClientDialog } from './ConvertToClientDialog'
import { formatDistanceToNow } from 'date-fns'
import type { LeadCardData } from './LeadCard'
import type { LeadStatus } from '@prisma/client'

type SortKey = 'firstName' | 'company' | 'status' | 'priority' | 'estimatedValue' | 'createdAt'
type SortDir = 'asc' | 'desc'

interface LeadTableProps {
  leads: LeadCardData[]
  searchQuery: string
  statusFilter: LeadStatus[]
}

export function LeadTable({ leads, searchQuery, statusFilter }: LeadTableProps): React.JSX.Element {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [convertLead, setConvertLead] = useState<LeadCardData | null>(null)
  const qc = useQueryClient()

  const { mutate: deleteLead } = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/leads/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => { toast.success('Lead deleted'); void qc.invalidateQueries({ queryKey: ['leads'] }) },
    onError:   () => toast.error('Failed to delete lead'),
  })

  const toggleSort = (key: SortKey): void => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = leads
    .filter((l) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
        (l.company?.toLowerCase().includes(q) ?? false) ||
        (l.email?.toLowerCase().includes(q) ?? false)
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(l.status)
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let av: string | number = ''
      let bv: string | number = ''
      if (sortKey === 'firstName') { av = `${a.firstName} ${a.lastName}`; bv = `${b.firstName} ${b.lastName}` }
      else if (sortKey === 'company') { av = a.company ?? ''; bv = b.company ?? '' }
      else if (sortKey === 'status') { av = a.status; bv = b.status }
      else if (sortKey === 'priority') { av = a.priority; bv = b.priority }
      else if (sortKey === 'estimatedValue') { av = Number(a.estimatedValue ?? 0); bv = Number(b.estimatedValue ?? 0) }
      else if (sortKey === 'createdAt') { av = new Date(a.createdAt).getTime(); bv = new Date(b.createdAt).getTime() }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSelectAll = (): void => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((l) => l.id)))
  }

  const SortIcon = ({ col }: { col: SortKey }): React.JSX.Element => {
    if (sortKey !== col) return <ChevronUp className="h-3 w-3 opacity-30" aria-hidden="true" />
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3 text-vma-violet" aria-hidden="true" />
      : <ChevronDown className="h-3 w-3 text-vma-violet" aria-hidden="true" />
  }

  const thClass = 'text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim px-4 py-3 text-left select-none cursor-pointer hover:text-vma-text-muted transition-colors'

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-vma-violet-dim border border-vma-violet/30 mb-3">
          <span className="text-xs font-medium text-vma-violet">{selected.size} selected</span>
          <button
            type="button"
            onClick={() => { selected.forEach((id) => deleteLead(id)); setSelected(new Set()) }}
            className="text-xs text-vma-red hover:text-vma-red/80 transition-colors"
          >
            Delete all
          </button>
        </div>
      )}

      <div className="rounded-xl border border-vma-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-vma-surface border-b border-vma-border">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    aria-label="Select all leads"
                    className="accent-vma-violet"
                  />
                </th>
                <th className={thClass} onClick={() => toggleSort('firstName')}>
                  <span className="flex items-center gap-1">Contact <SortIcon col="firstName" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort('company')}>
                  <span className="flex items-center gap-1">Company <SortIcon col="company" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort('status')}>
                  <span className="flex items-center gap-1">Status <SortIcon col="status" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort('priority')}>
                  <span className="flex items-center gap-1">Priority <SortIcon col="priority" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort('estimatedValue')}>
                  <span className="flex items-center gap-1">Value <SortIcon col="estimatedValue" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort('createdAt')}>
                  <span className="flex items-center gap-1">Created <SortIcon col="createdAt" /></span>
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-vma-text-muted">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filtered.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-vma-border last:border-0 transition-colors hover:bg-vma-surface-2 ${
                      i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
                    } ${selected.has(lead.id) ? 'bg-vma-violet-dim/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(lead.id)}
                        onChange={() => setSelected((s) => {
                          const ns = new Set(s)
                          if (ns.has(lead.id)) ns.delete(lead.id); else ns.add(lead.id)
                          return ns
                        })}
                        aria-label={`Select ${lead.firstName} ${lead.lastName}`}
                        className="accent-vma-violet"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-vma-text">{lead.firstName} {lead.lastName}</p>
                      {lead.email && <p className="text-xs text-vma-text-muted">{lead.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-vma-text-muted text-xs">{lead.company ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={lead.priority} /></td>
                    <td className="px-4 py-3 font-mono text-xs font-bold text-vma-violet">
                      {lead.estimatedValue ? `$${Number(lead.estimatedValue).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-vma-text-muted">
                      {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setConvertLead(lead)}
                          className="p-1.5 rounded text-vma-text-dim hover:text-vma-violet hover:bg-vma-violet-dim transition-colors"
                          aria-label={`Convert ${lead.firstName} to client`}
                        >
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 rounded text-vma-text-dim hover:text-vma-red hover:bg-vma-red/10 transition-colors"
                          aria-label={`Delete ${lead.firstName} ${lead.lastName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {convertLead && (
        <ConvertToClientDialog
          open={true}
          onClose={() => setConvertLead(null)}
          leadId={convertLead.id}
          defaultOrgName={convertLead.company ?? ''}
        />
      )}
    </>
  )
}
