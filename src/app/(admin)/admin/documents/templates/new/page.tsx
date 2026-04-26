import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TemplateEditorForm } from '@/components/admin/TemplateEditorForm'

export const metadata: Metadata = { title: 'New Template' }

export default function NewTemplatePage(): React.JSX.Element {
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
        <h1 className="font-display text-2xl font-bold text-vma-text">New Template</h1>
        <p className="text-vma-text-muted text-sm mt-0.5">Create a reusable document template</p>
      </div>

      <TemplateEditorForm />
    </div>
  )
}
