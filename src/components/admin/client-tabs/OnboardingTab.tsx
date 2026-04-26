'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, Circle, ClipboardList } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface OnboardingTabProps {
  org: OrgWithRelations
}

export function OnboardingTab({ org }: OnboardingTabProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const packet = org.onboarding

  const toggleStep = async (stepId: string, completedAt: string | null): Promise<void> => {
    setIsPending(true)
    try {
      const res = await fetch(`/api/onboarding/steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedAt }),
      })
      if (!res.ok) throw new Error('Failed to update step')
      toast.success('Step updated')
      router.refresh()
    } catch {
      toast.error('Failed to update step')
    } finally {
      setIsPending(false)
    }
  }

  if (!packet) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vma-text-dim gap-3">
        <ClipboardList className="h-8 w-8" />
        <p className="text-sm">No onboarding packet for this client.</p>
      </div>
    )
  }

  const steps = [...packet.steps].sort((a, b) => a.order - b.order)
  const completedCount = steps.filter((s) => s.completedAt).length
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-xl border border-vma-border bg-vma-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-vma-text-muted uppercase tracking-widest mb-1">Onboarding Status</p>
            <StatusBadge status={packet.status} />
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-vma-violet">{progress}%</p>
            <p className="text-xs text-vma-text-muted">{completedCount} / {steps.length} steps</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-vma-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-vma-violet transition-all duration-500"
            style={{ width: `${progress}%` }}
            aria-label={`${progress}% complete`}
          />
        </div>
        {packet.dueDate && (
          <p className="text-xs text-vma-text-muted mt-2">
            Due {formatDistanceToNow(new Date(packet.dueDate), { addSuffix: true })}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="rounded-xl border border-vma-border overflow-hidden">
        {steps.map((step, i) => {
          const done = !!step.completedAt
          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 px-5 py-4 border-b border-vma-border last:border-0 transition-colors ${
                done ? 'bg-vma-surface/60' : i % 2 === 0 ? 'bg-vma-surface' : 'bg-vma-surface/60'
              }`}
            >
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  void toggleStep(step.id, done ? null : new Date().toISOString())
                }
                aria-label={done ? `Mark "${step.title}" incomplete` : `Mark "${step.title}" complete`}
                className="mt-0.5 flex-shrink-0 text-vma-text-dim hover:text-vma-violet transition-colors disabled:opacity-50"
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-vma-violet" aria-hidden="true" />
                ) : (
                  <Circle className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${done ? 'line-through text-vma-text-muted' : 'text-vma-text'}`}>
                    {step.title}
                  </p>
                  {step.isRequired && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-vma-red/70 bg-vma-red/10 px-1.5 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-xs text-vma-text-muted mt-0.5">{step.description}</p>
                )}
                {done && step.completedAt && (
                  <p className="text-[11px] text-vma-violet mt-1">
                    Completed {formatDistanceToNow(new Date(step.completedAt), { addSuffix: true })}
                  </p>
                )}
              </div>

              <span className="text-[10px] font-mono text-vma-text-dim flex-shrink-0 mt-1">#{step.order}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
