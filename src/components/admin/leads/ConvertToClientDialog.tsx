'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

const schema = z.object({
  orgName:  z.string().min(1, 'Organization name required'),
  website:  z.string().url().or(z.literal('')),
  industry: z.string().optional(),
  phone:    z.string().optional(),
  address:  z.string().optional(),
  city:     z.string().optional(),
  country:  z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ConvertToClientDialogProps {
  open: boolean
  onClose: () => void
  leadId: string
  defaultOrgName?: string
}

const FC = 'w-full px-3 py-2 rounded-lg bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors'
const LC = 'text-xs font-medium text-vma-text-muted'

export function ConvertToClientDialog({
  open,
  onClose,
  leadId,
  defaultOrgName = '',
}: ConvertToClientDialogProps): React.JSX.Element {
  const qc = useQueryClient()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { orgName: defaultOrgName, website: '' },
  })

  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      const res = await fetch(`/api/leads/${leadId}/convert`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })
      const json = (await res.json()) as { org?: { id: string }; error?: string }
      if (!res.ok) { toast.error(json.error ?? 'Conversion failed'); return }
      toast.success('Lead converted to client. Onboarding packet created.')
      void qc.invalidateQueries({ queryKey: ['leads'] })
      onClose()
      if (json.org) router.push(`/admin/clients/${json.org.id}`)
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-vma-surface border border-vma-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-vma-text">Convert to Client</DialogTitle>
          <p className="text-xs text-vma-text-muted mt-1">This creates an Organization and an onboarding packet with 9 default steps.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4 mt-2" noValidate>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={LC}>Organization Name *</label>
            <input {...register('orgName')} className={FC} placeholder="Acme Inc." />
            {errors.orgName && <span role="alert" className="text-xs text-vma-red">{errors.orgName.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LC}>Website</label>
            <input {...register('website')} type="url" className={FC} placeholder="https://acme.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LC}>Industry</label>
            <input {...register('industry')} className={FC} placeholder="SaaS, Retail, …" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LC}>Phone</label>
            <input {...register('phone')} type="tel" className={FC} placeholder="+1 555 0000" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LC}>City</label>
            <input {...register('city')} className={FC} placeholder="New York" />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={LC}>Country</label>
            <input {...register('country')} className={FC} placeholder="USA" />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-vma-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-vma-text-muted hover:text-vma-text transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              {isSubmitting ? 'Converting…' : 'Convert to Client →'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
