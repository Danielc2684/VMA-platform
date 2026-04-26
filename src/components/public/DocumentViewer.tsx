'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2, FileText } from 'lucide-react'
import type { Document, Organization } from '@prisma/client'

type DocumentWithOrg = Document & {
  organization: Pick<Organization, 'name' | 'logoUrl'> | null
}

interface DocumentViewerProps {
  document: DocumentWithOrg
}

const signSchema = z.object({
  signerName:  z.string().min(2, 'Full name required'),
  signerEmail: z.string().email('Valid email required'),
  agree:       z.literal(true, { error: 'You must agree to sign' }),
})

type SignFormValues = z.infer<typeof signSchema>

const SIGNED_STATUSES = new Set(['SIGNED', 'COUNTERSIGNED', 'AWAITING_COUNTERSIGN', 'VOIDED'])

export function DocumentViewer({ document: doc }: DocumentViewerProps): React.JSX.Element {
  const [signed, setSigned] = useState(SIGNED_STATUSES.has(doc.status))

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignFormValues>({
    resolver: zodResolver(signSchema),
  })

  const onSign = async (values: SignFormValues): Promise<void> => {
    try {
      const res = await fetch(`/api/documents/${doc.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerName: values.signerName, signerEmail: values.signerEmail }),
      })
      if (!res.ok) throw new Error('Failed to sign')
      toast.success('Document signed successfully')
      setSigned(true)
    } catch {
      toast.error('Failed to sign document')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start gap-4">
            {doc.organization?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.organization.logoUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                {doc.organization?.name.charAt(0) ?? 'V'}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Document for review & signature</p>
              <h1 className="text-xl font-bold text-white">{doc.title}</h1>
              {doc.organization && (
                <p className="text-sm text-gray-400 mt-0.5">{doc.organization.name}</p>
              )}
            </div>
          </div>

          {doc.expiresAt && (
            <p className="mt-4 text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 inline-block">
              Expires {new Date(doc.expiresAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </p>
          )}
        </div>

        {/* Document content */}
        {doc.content && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8">
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />
          </div>
        )}

        {/* File attachment */}
        {doc.fileUrl && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{doc.title}</p>
                {doc.fileSize && (
                  <p className="text-xs text-gray-500">{(doc.fileSize / 1024).toFixed(1)} KB</p>
                )}
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        )}

        {/* Signature section */}
        {doc.status === 'VOIDED' ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="text-sm font-semibold text-red-400">This document has been voided.</p>
          </div>
        ) : signed ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-8 flex flex-col items-center gap-3">
            <CheckCircle2 className="h-10 w-10 text-green-400" aria-hidden="true" />
            <p className="text-lg font-semibold text-white">Document Signed</p>
            <p className="text-sm text-gray-400 text-center">
              {doc.signerName && `Signed by ${doc.signerName}. `}
              Thank you for signing this document.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { void handleSubmit(onSign)(e) }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <h2 className="text-base font-semibold text-white">Sign this Document</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="signer-name" className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  id="signer-name"
                  {...register('signerName')}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.signerName && <p className="mt-1 text-xs text-red-400">{errors.signerName.message}</p>}
              </div>
              <div>
                <label htmlFor="signer-email" className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                  Email
                </label>
                <input
                  id="signer-email"
                  type="email"
                  {...register('signerEmail')}
                  placeholder="jane@company.com"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.signerEmail && <p className="mt-1 text-xs text-red-400">{errors.signerEmail.message}</p>}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register('agree')}
                className="mt-0.5 accent-purple-500"
                aria-label="I agree"
              />
              <span className="text-sm text-gray-400">
                I agree to sign this document electronically. My typed name and email constitute my legal e-signature.
              </span>
            </label>
            {errors.agree && <p className="text-xs text-red-400">{errors.agree.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              {isSubmitting ? 'Signing…' : 'Sign Document'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
