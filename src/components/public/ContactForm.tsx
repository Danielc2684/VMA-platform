'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  website: z.string().url('Enter a valid URL').or(z.literal('')),
  budget: z.enum([
    'Under $1k',
    '$1–3k',
    '$3–7k',
    '$7–15k',
    '$15k+',
  ], { error: 'Please select a budget range' }),
  challenge: z.enum([
    'Not enough leads',
    'Low conversion',
    'Need rebrand',
    'Scaling growth',
    'Other',
  ], { error: 'Please select your primary challenge' }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0),
})

type ContactFormValues = z.infer<typeof schema>

export function ContactForm(): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { honeypot: '' },
  })

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    try {
      const res = await fetch('/api/contact', {
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
          className="flex flex-col items-center gap-4 py-12 text-center"
        >
          <CheckCircle className="h-14 w-14 text-vma-green" aria-hidden="true" />
          <h3 className="font-display text-2xl font-bold text-vma-text">
            Message Received
          </h3>
          <p className="text-vma-text-muted max-w-sm">
            Thank you for reaching out. Our team will review your project and get back to you within 1 business day.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit(onSubmit)}
          className="grid sm:grid-cols-2 gap-4"
          aria-label="Contact form"
          noValidate
        >
          {/* Honeypot */}
          <input
            {...register('honeypot')}
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
            autoComplete="off"
          />

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className="text-xs font-medium text-vma-text-muted">
              Full Name <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <input
              {...register('fullName')}
              id="contact-name"
              type="text"
              autoComplete="name"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="Jane Smith"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'contact-name-err' : undefined}
            />
            {errors.fullName && (
              <span id="contact-name-err" role="alert" className="text-xs text-vma-red">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className="text-xs font-medium text-vma-text-muted">
              Business Email <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <input
              {...register('email')}
              id="contact-email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="jane@company.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'contact-email-err' : undefined}
            />
            {errors.email && (
              <span id="contact-email-err" role="alert" className="text-xs text-vma-red">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-phone" className="text-xs font-medium text-vma-text-muted">
              Phone
            </label>
            <input
              {...register('phone')}
              id="contact-phone"
              type="tel"
              autoComplete="tel"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Business Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-business" className="text-xs font-medium text-vma-text-muted">
              Business Name <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <input
              {...register('businessName')}
              id="contact-business"
              type="text"
              autoComplete="organization"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="Acme Inc."
              aria-invalid={!!errors.businessName}
              aria-describedby={errors.businessName ? 'contact-business-err' : undefined}
            />
            {errors.businessName && (
              <span id="contact-business-err" role="alert" className="text-xs text-vma-red">
                {errors.businessName.message}
              </span>
            )}
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-website" className="text-xs font-medium text-vma-text-muted">
              Website URL
            </label>
            <input
              {...register('website')}
              id="contact-website"
              type="url"
              autoComplete="url"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors"
              placeholder="https://yourcompany.com"
              aria-invalid={!!errors.website}
              aria-describedby={errors.website ? 'contact-website-err' : undefined}
            />
            {errors.website && (
              <span id="contact-website-err" role="alert" className="text-xs text-vma-red">
                {errors.website.message}
              </span>
            )}
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-budget" className="text-xs font-medium text-vma-text-muted">
              Monthly Marketing Budget <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <select
              {...register('budget')}
              id="contact-budget"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors appearance-none"
              aria-invalid={!!errors.budget}
              aria-describedby={errors.budget ? 'contact-budget-err' : undefined}
            >
              <option value="" disabled>Select budget range</option>
              <option>Under $1k</option>
              <option>$1–3k</option>
              <option>$3–7k</option>
              <option>$7–15k</option>
              <option>$15k+</option>
            </select>
            {errors.budget && (
              <span id="contact-budget-err" role="alert" className="text-xs text-vma-red">
                {errors.budget.message}
              </span>
            )}
          </div>

          {/* Challenge */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="contact-challenge" className="text-xs font-medium text-vma-text-muted">
              Primary Challenge <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <select
              {...register('challenge')}
              id="contact-challenge"
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm focus:outline-none focus:border-vma-violet transition-colors appearance-none"
              aria-invalid={!!errors.challenge}
              aria-describedby={errors.challenge ? 'contact-challenge-err' : undefined}
            >
              <option value="" disabled>Select your challenge</option>
              <option>Not enough leads</option>
              <option>Low conversion</option>
              <option>Need rebrand</option>
              <option>Scaling growth</option>
              <option>Other</option>
            </select>
            {errors.challenge && (
              <span id="contact-challenge-err" role="alert" className="text-xs text-vma-red">
                {errors.challenge.message}
              </span>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="contact-message" className="text-xs font-medium text-vma-text-muted">
              Tell us about your project <span aria-hidden="true" className="text-vma-red">*</span>
            </label>
            <textarea
              {...register('message')}
              id="contact-message"
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl bg-vma-surface-2 border border-vma-border text-vma-text text-sm placeholder:text-vma-text-dim focus:outline-none focus:border-vma-violet transition-colors resize-y"
              placeholder="What are your current challenges and goals? What have you tried before?"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-err' : undefined}
            />
            {errors.message && (
              <span id="contact-message-err" role="alert" className="text-xs text-vma-red">
                {errors.message.message}
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
              {isSubmitting ? 'Sending…' : 'Send Message →'}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
