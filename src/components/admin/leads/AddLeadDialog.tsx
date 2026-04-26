'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { LeadSource, LeadStatus, Priority } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const schema = z.object({
  firstName:      z.string().min(1, 'First name required'),
  lastName:       z.string().min(1, 'Last name required'),
  email:          z.string().email().or(z.literal('')),
  phone:          z.string().optional(),
  company:        z.string().optional(),
  jobTitle:       z.string().optional(),
  website:        z.string().url().or(z.literal('')),
  source:         z.nativeEnum(LeadSource),
  priority:       z.nativeEnum(Priority),
  estimatedValue: z.number().positive().optional().or(z.nan()),
  notes:          z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface AddLeadDialogProps {
  open: boolean
  onClose: () => void
}

const FIELD_CLASS = 'w-full px-3 py-2 rounded-lg bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors'
const LABEL_CLASS = 'text-xs font-medium text-vma-text-muted'

export function AddLeadDialog({ open, onClose }: AddLeadDialogProps): React.JSX.Element {
  const qc = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      source:   LeadSource.OTHER,
      priority: Priority.MEDIUM,
      email:    '',
      website:  '',
    },
  })

  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...data,
          estimatedValue: isNaN(data.estimatedValue as number) ? undefined : data.estimatedValue,
        }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) { toast.error(json.error ?? 'Failed to create lead'); return }
      toast.success('Lead created')
      void qc.invalidateQueries({ queryKey: ['leads'] })
      reset()
      onClose()
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-vma-surface border border-vma-border max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-vma-text">Add Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4 mt-2" noValidate>
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>First Name *</label>
            <input {...register('firstName')} className={FIELD_CLASS} placeholder="Jane" />
            {errors.firstName && <span role="alert" className="text-xs text-vma-red">{errors.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Last Name *</label>
            <input {...register('lastName')} className={FIELD_CLASS} placeholder="Smith" />
            {errors.lastName && <span role="alert" className="text-xs text-vma-red">{errors.lastName.message}</span>}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Email</label>
            <input {...register('email')} type="email" className={FIELD_CLASS} placeholder="jane@co.com" />
            {errors.email && <span role="alert" className="text-xs text-vma-red">{errors.email.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Phone</label>
            <input {...register('phone')} type="tel" className={FIELD_CLASS} placeholder="+1 555 0000" />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Company</label>
            <input {...register('company')} className={FIELD_CLASS} placeholder="Acme Inc." />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Job Title</label>
            <input {...register('jobTitle')} className={FIELD_CLASS} placeholder="CEO" />
          </div>

          {/* Website + Value */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Website</label>
            <input {...register('website')} type="url" className={FIELD_CLASS} placeholder="https://acme.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Est. Value ($)</label>
            <input
              {...register('estimatedValue', { valueAsNumber: true })}
              type="number"
              min="0"
              className={FIELD_CLASS}
              placeholder="5000"
            />
          </div>

          {/* Source + Priority */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Source</label>
            <select {...register('source')} className={FIELD_CLASS + ' appearance-none'}>
              {Object.values(LeadSource).map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Priority</label>
            <select {...register('priority')} className={FIELD_CLASS + ' appearance-none'}>
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={LABEL_CLASS}>Notes</label>
            <textarea {...register('notes')} rows={3} className={FIELD_CLASS + ' resize-y'} placeholder="Any context about this lead..." />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-vma-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-vma-text-muted hover:text-vma-text transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              {isSubmitting ? 'Creating…' : 'Create Lead'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
