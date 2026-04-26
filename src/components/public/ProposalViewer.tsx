'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { Proposal, Organization } from '@prisma/client'

type ProposalWithOrg = Proposal & {
  organization: Pick<Organization, 'name' | 'logoUrl'>
}

interface ProposalBlockData {
  id:      string
  type:    string
  title:   string
  content: string
}

interface ProposalViewerProps {
  proposal: ProposalWithOrg
}

const signSchema = z.object({
  signerName:  z.string().min(2, 'Full name required'),
  signerEmail: z.string().email('Valid email required'),
  agree:       z.literal(true, { error: 'You must agree to sign' }),
})

type SignFormValues = z.infer<typeof signSchema>

function parseBlocks(content: unknown): ProposalBlockData[] {
  if (typeof content !== 'object' || content === null) return []
  const c = content as Record<string, unknown>
  if (!Array.isArray(c['blocks'])) return []
  return c['blocks'] as ProposalBlockData[]
}

export function ProposalViewer({ proposal }: ProposalViewerProps): React.JSX.Element {
  const [status, setStatus] = useState(proposal.status)
  const blocks = parseBlocks(proposal.content)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignFormValues>({
    resolver: zodResolver(signSchema),
  })

  const handleAccept = async (values: SignFormValues): Promise<void> => {
    try {
      const res = await fetch(`/api/proposals/${proposal.publicToken}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerName: values.signerName, signerEmail: values.signerEmail }),
      })
      if (!res.ok) throw new Error('Failed to sign')
      toast.success('Proposal accepted!')
      setStatus('ACCEPTED')
    } catch {
      toast.error('Failed to accept proposal')
    }
  }

  const handleReject = async (): Promise<void> => {
    try {
      const res = await fetch(`/api/proposals/${proposal.publicToken}/sign`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to decline')
      toast.success('Proposal declined')
      setStatus('REJECTED')
    } catch {
      toast.error('Failed to decline proposal')
    }
  }

  const isExpired = proposal.validUntil && new Date(proposal.validUntil) < new Date()
  const canSign = status === 'SENT' || status === 'VIEWED'

  return (
    <div className="min-h-screen bg-[#0A0B0F] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-start gap-5 mb-6">
            {proposal.organization.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proposal.organization.logoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                {proposal.organization.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Proposal from {proposal.organization.name}</p>
              <h1 className="text-2xl font-bold text-white">{proposal.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap border-t border-white/10 pt-5">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Total Value</p>
              <p className="font-mono text-2xl font-bold text-purple-400">
                ${Number(proposal.totalValue).toLocaleString()}
              </p>
            </div>
            {proposal.validUntil && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Valid Until</p>
                <p className="text-sm text-white">
                  {new Date(proposal.validUntil).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </p>
              </div>
            )}
          </div>

          {isExpired && (
            <p className="mt-4 text-xs text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 inline-block">
              This proposal has expired.
            </p>
          )}
        </div>

        {/* Content blocks */}
        {blocks.map((block) => (
          <div key={block.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                {block.type}
              </span>
              {block.title && (
                <h2 className="text-lg font-semibold text-white">{block.title}</h2>
              )}
            </div>
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        ))}

        {/* Notes */}
        {proposal.notes && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Notes</p>
            <p className="text-sm text-gray-300">{proposal.notes}</p>
          </div>
        )}

        {/* Action section */}
        {status === 'ACCEPTED' ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 flex flex-col items-center gap-3">
            <CheckCircle2 className="h-12 w-12 text-green-400" aria-hidden="true" />
            <p className="text-xl font-semibold text-white">Proposal Accepted</p>
            <p className="text-sm text-gray-400 text-center">Thank you for accepting. We&apos;ll be in touch shortly.</p>
          </div>
        ) : status === 'REJECTED' ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 flex flex-col items-center gap-3">
            <XCircle className="h-12 w-12 text-red-400" aria-hidden="true" />
            <p className="text-xl font-semibold text-white">Proposal Declined</p>
            <p className="text-sm text-gray-400 text-center">We&apos;ve noted your response. Please reach out if you&apos;d like to discuss.</p>
          </div>
        ) : status === 'EXPIRED' || isExpired ? (
          <div className="rounded-2xl border border-gray-500/30 bg-gray-500/10 p-8 text-center">
            <p className="text-sm font-semibold text-gray-400">This proposal has expired and can no longer be signed.</p>
          </div>
        ) : canSign ? (
          <form
            onSubmit={(e) => { void handleSubmit(handleAccept)(e) }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-5"
          >
            <h2 className="text-lg font-semibold text-white">Accept this Proposal</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="proposal-signer-name" className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  id="proposal-signer-name"
                  {...register('signerName')}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.signerName && <p className="mt-1 text-xs text-red-400">{errors.signerName.message}</p>}
              </div>
              <div>
                <label htmlFor="proposal-signer-email" className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                  Email
                </label>
                <input
                  id="proposal-signer-email"
                  type="email"
                  {...register('signerEmail')}
                  placeholder="jane@company.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.signerEmail && <p className="mt-1 text-xs text-red-400">{errors.signerEmail.message}</p>}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" {...register('agree')} className="mt-0.5 accent-purple-500" />
              <span className="text-sm text-gray-400">
                I agree to accept this proposal and authorize the work described above. My typed name and email constitute my electronic signature.
              </span>
            </label>
            {errors.agree && <p className="text-xs text-red-400">{errors.agree.message}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
              >
                {isSubmitting ? 'Processing…' : 'Accept & Sign'}
              </button>
              <button
                type="button"
                onClick={() => void handleReject()}
                className="px-5 py-3.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 transition-colors"
              >
                Decline
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  )
}
