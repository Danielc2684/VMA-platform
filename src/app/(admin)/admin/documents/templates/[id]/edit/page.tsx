import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { TemplateEditorForm } from '@/components/admin/TemplateEditorForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const tpl = await prisma.documentTemplate.findUnique({ where: { id }, select: { name: true } })
  return { title: tpl ? `Edit "${tpl.name}"` : 'Edit Template' }
}

export default async function EditTemplatePage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const template = await prisma.documentTemplate.findUnique({ where: { id } })
  if (!template) notFound()

  return (
    <div className="space-y-5 max-w-4xl">
      <Link
        href="/admin/documents/templates"
        className="inline-flex items-center gap-1.5 text-xs text-vma-text-muted hover:text-vma-text transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Templates
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-vma-text">Edit Template</h1>
        <p className="text-vma-text-muted text-sm mt-0.5">{template.name}</p>
      </div>

      <TemplateEditorForm template={template} />
    </div>
  )
}
