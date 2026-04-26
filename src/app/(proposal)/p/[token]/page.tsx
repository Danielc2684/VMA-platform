import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProposalViewer } from '@/components/public/ProposalViewer'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function PublicProposalPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { token } = await params

  const proposal = await prisma.proposal.findUnique({
    where: { publicToken: token },
    include: { organization: { select: { name: true, logoUrl: true } } },
  })

  if (!proposal) notFound()

  // Record first view
  if (!proposal.viewedAt && proposal.status === 'SENT') {
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: { viewedAt: new Date(), status: 'VIEWED' },
    })
  }

  return <ProposalViewer proposal={proposal} />
}
