import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProposalBuilder } from '@/components/admin/proposals/ProposalBuilder'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const p = await prisma.proposal.findUnique({ where: { id }, select: { title: true } })
  return { title: p ? `Edit "${p.title}"` : 'Edit Proposal' }
}

export default async function ProposalEditPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { organization: { select: { id: true, name: true } } },
  })

  if (!proposal) notFound()

  return (
    <div className="space-y-5 max-w-5xl">
      <Link
        href="/admin/proposals"
        className="inline-flex items-center gap-1.5 text-xs text-vma-text-muted hover:text-vma-text transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Proposals
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-vma-text">Proposal Builder</h1>
        <p className="text-vma-text-muted text-sm mt-0.5">{proposal.organization.name}</p>
      </div>

      <ProposalBuilder proposal={proposal} />
    </div>
  )
}
