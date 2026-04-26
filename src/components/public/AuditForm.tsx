'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  website: z.string().url('Enter a valid website URL').or(z.literal('')),
  challenge: z.enum([
    'Not enough leads',
    'Low conversion',
    'Need rebrand',
    'Scaling growth',
    'Other',
  ], { error: 'Please select a challenge' }),
  honeypot: z.string().max(0),
})

type AuditFormValues = z.infer<typeof schema>

export function AuditForm(): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: '' },
  })

  const onSubmit = async (data: AuditFormValues): Promise<void> => {
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json()) as { success?: boolean; error?: string }

      if (!res.ok) {
        toast.error(json.error ?? 'Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      toast.error('Network error. Please check your connection and try again.')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4 py-8 text-center"
        >
          <CheckCircle className="h-14 w-14 text-vma-green" aria-hidden="true" />
          <h3 className="font-display text-2xl font-bold text-vma-text">
            Audit Request Received
          </h3>
          <p className="text-vma-text-muted max-w-sm">
            We&apos;ll analyze your digital presence and send your personalized roadmap within 24 hours.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="grid sm:grid-cols-2 gap-4"
          aria-label="Free digital audit request form"
          noValidate
        >
          {/* Honeypot — hidden from real users */}
          <input
            {...register('honeypot')}
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            autoComplete="off"
          />

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="audit-name" className="text-xs font-medium text-vma-text-muted">
              Full Name <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <input
              {...register('name')}
              id="audit-name"
              type="text"
              autoComplete="name"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="Jane Smith"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'audit-name-err' : undefined}
            />
            {errors.name && (
              <span id="audit-name-err" role="alert" className="text-xs text-vma-red">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="audit-email" className="text-xs font-medium text-vma-text-muted">
              Business Email <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <input
              {...register('email')}
              id="audit-email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="jane@company.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'audit-email-err' : undefined}
            />
            {errors.email && (
              <span id="audit-email-err" role="alert" className="text-xs text-vma-red">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="audit-website" className="text-xs font-medium text-vma-text-muted">
              Website URL
            </label>
            <input
              {...register('website')}
              id="audit-website"
              type="url"
              autoComplete="url"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="https://yourcompany.com"
              aria-invalid={!!errors.website}
              aria-describedby={errors.website ? 'audit-website-err' : undefined}
            />
            {errors.website && (
              <span id="audit-website-err" role="alert" className="text-xs text-vma-red">
                {errors.website.message}
              </span>
            )}
          </div>

          {/* Challenge */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="audit-challenge" className="text-xs font-medium text-vma-text-muted">
              Primary Challenge <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <select
              {...register('challenge')}
              id="audit-challenge"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors appearance-none"
              aria-invalid={!!errors.challenge}
              aria-describedby={errors.challenge ? 'audit-challenge-err' : undefined}
            >
              <option value="" disabled>Select your challenge</option>
              <option>Not enough leads</option>
              <option>Low conversion</option>
              <option>Need rebrand</option>
              <option>Scaling growth</option>
              <option>Other</option>
            </select>
            {errors.challenge && (
              <span id="audit-challenge-err" role="alert" className="text-xs text-vma-red">
                {errors.challenge.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white rounded-xl glow-violet transition-opacity disabled:opacity-60"
              style={{ background: 'var(--vma-gradient-brand)' }}
            >
              {isSubmitting ? 'Sending…' : 'Request My Free Audit →'}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
