'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { toast } from 'sonner'
import { Plus, Send, Save } from 'lucide-react'
import { ProposalBlock, type ProposalBlockData } from './ProposalBlock'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { Proposal } from '@prisma/client'

interface ProposalBuilderProps {
  proposal: Proposal & { organization: { id: string; name: string } }
}

type BlockType = ProposalBlockData['type']

const BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: 'text',     label: 'Text Block' },
  { type: 'pricing',  label: 'Pricing' },
  { type: 'timeline', label: 'Timeline' },
  { type: 'team',     label: 'Team' },
]

function parseBlocks(content: unknown): ProposalBlockData[] {
  if (typeof content !== 'object' || content === null) return []
  const c = content as Record<string, unknown>
  if (!Array.isArray(c['blocks'])) return []
  return c['blocks'] as ProposalBlockData[]
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function ProposalBuilder({ proposal }: ProposalBuilderProps): React.JSX.Element {
  const router = useRouter()
  const [blocks, setBlocks] = useState<ProposalBlockData[]>(() => parseBlocks(proposal.content))
  const [title, setTitle] = useState(proposal.title)
  const [totalValue, setTotalValue] = useState(String(Number(proposal.totalValue)))
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const activeBlock = blocks.find((b) => b.id === activeId) ?? null

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(e.active.id as string)
  }, [])

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    setBlocks((prev) => {
      const oldIdx = prev.findIndex((b) => b.id === active.id)
      const newIdx = prev.findIndex((b) => b.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }, [])

  const addBlock = (type: BlockType): void => {
    setBlocks((prev) => [
      ...prev,
      { id: generateId(), type, title: '', content: '' },
    ])
  }

  const updateBlock = useCallback((id: string, updates: Partial<ProposalBlockData>): void => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }, [])

  const deleteBlock = useCallback((id: string): void => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const save = async (sendAfter = false): Promise<void> => {
    sendAfter ? setIsSending(true) : setIsSaving(true)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          totalValue: parseFloat(totalValue) || 0,
          content: { blocks },
          ...(sendAfter && { status: 'SENT' }),
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success(sendAfter ? 'Proposal sent' : 'Proposal saved')
      router.refresh()
    } catch {
      toast.error('Failed to save proposal')
    } finally {
      setIsSaving(false)
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header controls */}
      <div className="rounded-xl border border-vma-border bg-vma-surface p-5 space-y-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <label htmlFor="proposal-title" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
              Proposal Title
            </label>
            <input
              id="proposal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-vma-surface-2 border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors"
            />
          </div>
          <div className="w-40">
            <label htmlFor="proposal-value" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
              Total Value ($)
            </label>
            <input
              id="proposal-value"
              type="number"
              min={0}
              step={100}
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-vma-surface-2 border border-vma-border text-vma-text text-sm font-mono focus:outline-none focus:border-vma-violet transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-vma-text-muted">For:</span>
            <span className="text-xs font-medium text-vma-text">{proposal.organization.name}</span>
            <StatusBadge status={proposal.status} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void save(false)}
              disabled={isSaving || isSending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-vma-border text-vma-text-muted hover:text-vma-text transition-colors disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              {isSaving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => void save(true)}
              disabled={isSaving || isSending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {isSending ? 'Sending…' : 'Send to Client'}
            </button>
          </div>
        </div>
      </div>

      {/* Block canvas */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {blocks.length === 0 && (
              <div className="rounded-xl border border-dashed border-vma-border bg-vma-surface/40 py-16 flex flex-col items-center gap-3 text-vma-text-dim">
                <Plus className="h-6 w-6" aria-hidden="true" />
                <p className="text-sm">Add a block below to get started</p>
              </div>
            )}
            {blocks.map((block) => (
              <ProposalBlock
                key={block.id}
                block={block}
                onUpdate={updateBlock}
                onDelete={deleteBlock}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeBlock ? (
            <div className="rotate-1 opacity-90 shadow-2xl">
              <div className="rounded-xl border border-vma-violet bg-vma-surface px-4 py-3">
                <p className="text-sm font-semibold text-vma-text">{activeBlock.title || 'Untitled block'}</p>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add block buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-vma-text-dim">Add block:</span>
        {BLOCK_TYPES.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-vma-border text-vma-text-muted hover:text-vma-violet hover:border-vma-violet transition-colors"
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
