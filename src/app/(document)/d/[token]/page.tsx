import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DocumentViewer } from '@/components/public/DocumentViewer'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function PublicDocumentPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { token } = await params

  const document = await prisma.document.findUnique({
    where: { publicToken: token },
    include: { organization: { select: { name: true, logoUrl: true } } },
  })

  if (!document) notFound()

  // Record first view
  if (!document.viewedAt) {
    await prisma.document.update({
      where: { id: document.id },
      data: { viewedAt: new Date() },
    })
  }

  return <DocumentViewer document={document} />
}
