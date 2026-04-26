'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DocCategory } from '@prisma/client'
import { TiptapEditor } from './TiptapEditor'
import type { DocumentTemplate } from '@prisma/client'

const schema = z.object({
  name:     z.string().min(1, 'Name is required'),
  category: z.nativeEnum(DocCategory),
  content:  z.string().min(1, 'Content is required'),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface TemplateEditorFormProps {
  template?: DocumentTemplate
}

const CATEGORY_LABELS: Record<DocCategory, string> = {
  CONTRACT:  'Contract',
  PROPOSAL:  'Proposal',
  REPORT:    'Report',
  INVOICE:   'Invoice',
  STRATEGY:  'Strategy',
  CREATIVE:  'Creative',
  LEGAL:     'Legal',
  OTHER:     'Other',
}

export function TemplateEditorForm({ template }: TemplateEditorFormProps): React.JSX.Element {
  const router = useRouter()
  const isEdit = !!template

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:     template?.name ?? '',
      category: template?.category ?? DocCategory.CONTRACT,
      content:  template?.content ?? '',
      isActive: template?.isActive ?? true,
    },
  })

  const onSubmit = async (values: FormValues): Promise<void> => {
    try {
      const url  = isEdit ? `/api/documents/templates/${template.id}` : '/api/documents/templates'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Failed to save template')
      toast.success(isEdit ? 'Template updated' : 'Template created')
      router.push('/admin/documents/templates')
      router.refresh()
    } catch {
      toast.error('Failed to save template')
    }
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="space-y-5">
      {/* Name + Category row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tpl-name" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
            Name
          </label>
          <input
            id="tpl-name"
            {...register('name')}
            placeholder="e.g. Marketing Retainer Agreement"
            className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
          />
          {errors.name && <p className="mt-1 text-xs text-vma-red">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="tpl-category" className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
            Category
          </label>
          <select
            id="tpl-category"
            {...register('category')}
            className="w-full px-3 py-2 rounded-lg bg-vma-surface border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors"
          >
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-vma-red">{errors.category.message}</p>}
        </div>
      </div>

      {/* Content editor */}
      <div>
        <label className="block text-xs font-semibold text-vma-text-muted mb-1.5 uppercase tracking-widest">
          Content
        </label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Write your template content here…"
            />
          )}
        />
        {errors.content && <p className="mt-1 text-xs text-vma-red">{errors.content.message}</p>}
      </div>

      {/* Active toggle + submit */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="accent-vma-violet w-4 h-4"
                aria-label="Active"
              />
            )}
          />
          <span className="text-sm text-vma-text">Active (available when sending documents)</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
          style={{ background: 'var(--vma-gradient-brand)' }}
        >
          {isSubmitting ? 'Saving…' : isEdit ? 'Update Template' : 'Create Template'}
        </button>
      </div>
    </form>
  )
}
