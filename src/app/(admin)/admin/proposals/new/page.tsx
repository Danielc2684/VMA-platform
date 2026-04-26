'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  organizationId: z.string().uuid('Select a client'),
  title:          z.string().min(1, 'Title is required'),
  totalValue:     z.number().min(0),
  validUntil:     z.string().optional(),
  notes:          z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface OrgOption { id: string; name: string }

export default function NewProposalPage(): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultOrgId = searchParams.get('org') ?? ''

  const [orgs, setOrgs] = useState<OrgOption[]>([])

  useEffect(() => {
    void fetch('/api/organizations').then((r) => r.json()).then((d: { organizations: OrgOption[] }) => {
      setOrgs(d.organizations)
    }).catch(() => { /* non-fatal */ })
  }, [])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizationId: defaultOrgId,
      totalValue: 0,
    },
  })

  const onSubmit = async (values: FormValues): Promise<void> => {
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, validUntil: values.validUntil ?? undefined }),
      })
      if (!res.ok) throw new Error('Failed to create')
      const data = (await res.json()) as { proposal: { id: string } }
      toast.success('Proposal created')
      router.push(`/admin/proposals/${data.proposal.id}/edit`)
    } catch {
      toast.error('Failed to create proposal')
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <Link
        href="/admin/proposals"
        className="inline-flex items-center gap-1.5 text-xs text-vma-text-muted hover:text-vma-text transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Proposals
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-vma-text">New Proposal</h1>
        <p className="text-vma-text-muted text-sm mt-0.5">Set up the basics, then build your proposal</p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="rounded-xl border border-vma-border bg-vma-surface p-6 space-y-4">
        <div>
          <label htmlFor="prop-org" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
            Client
          </label>
          <select
            id="prop-org"
            {...register('organizationId')}
            className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors"
          >
            <option value="">Select a client…</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          {errors.organizationId && <p className="mt-1 text-xs text-vma-red">{errors.organizationId.message}</p>}
        </div>

        <div>
          <label htmlFor="prop-title" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
            Proposal Title
          </label>
          <input
            id="prop-title"
            {...register('title')}
            placeholder="e.g. Q3 Marketing Package"
            className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
          />
          {errors.title && <p className="mt-1 text-xs text-vma-red">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="prop-value" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
              Total Value ($)
            </label>
            <input
              id="prop-value"
              type="number"
              min={0}
              step={100}
              {...register('totalValue', { valueAsNumber: true })}
              className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm font-mono focus:outline-none focus:border-vma-violet transition-colors"
            />
          </div>
          <div>
            <label htmlFor="prop-valid" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
              Valid Until
            </label>
            <input
              id="prop-valid"
              type="date"
              {...register('validUntil')}
              className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="prop-notes" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
            Notes (internal)
          </label>
          <textarea
            id="prop-notes"
            {...register('notes')}
            rows={3}
            placeholder="Internal notes about this proposal…"
            className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'var(--vma-gradient-brand)' }}
          >
            {isSubmitting ? 'Creating…' : 'Create & Open Builder'}
          </button>
        </div>
      </form>
    </div>
  )
}
