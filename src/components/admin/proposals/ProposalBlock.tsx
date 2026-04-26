'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { TiptapEditor } from '@/components/admin/TiptapEditor'

export interface ProposalBlockData {
  id:      string
  type:    'text' | 'pricing' | 'timeline' | 'team'
  title:   string
  content: string
}

interface ProposalBlockProps {
  block:    ProposalBlockData
  onUpdate: (id: string, updates: Partial<ProposalBlockData>) => void
  onDelete: (id: string) => void
}

const BLOCK_TYPE_LABELS: Record<ProposalBlockData['type'], string> = {
  text:     'Text',
  pricing:  'Pricing',
  timeline: 'Timeline',
  team:     'Team',
}

export function ProposalBlock({ block, onUpdate, onDelete }: ProposalBlockProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-vma-border bg-vma-surface overflow-hidden"
    >
      {/* Block header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-vma-surface border-b border-vma-border">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="text-vma-text-dim hover:text-vma-text-muted cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-vma-violet px-1.5 py-0.5 rounded bg-vma-violet/10">
          {BLOCK_TYPE_LABELS[block.type]}
        </span>
        <input
          type="text"
          value={block.title}
          onChange={(e) => onUpdate(block.id, { title: e.target.value })}
          placeholder="Block title…"
          className="flex-1 bg-transparent text-sm font-semibold text-vma-text placeholder:text-vma-text-dim focus:outline-none"
          aria-label="Block title"
        />
        <button
          type="button"
          onClick={() => onDelete(block.id)}
          aria-label={`Delete ${block.title || 'block'}`}
          className="p-1 rounded text-vma-text-dim hover:text-vma-red hover:bg-vma-red/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Block content */}
      <div className="p-1">
        <TiptapEditor
          content={block.content}
          onChange={(html) => onUpdate(block.id, { content: html })}
          placeholder="Write block content…"
        />
      </div>
    </div>
  )
}
