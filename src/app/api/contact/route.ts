import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { LeadSource, LeadStatus, Priority } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

// ─────────────────────────────────────────────
// Rate limiter — shared module-level instance
// ─────────────────────────────────────────────
class RateLimiter {
  private readonly map = new Map<string, number[]>()

  isAllowed(ip: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const timestamps = (this.map.get(ip) ?? []).filter(
      (t) => now - t < windowMs,
    )
    if (timestamps.length >= maxRequests) return false
    timestamps.push(now)
    this.map.set(ip, timestamps)
    return true
  }
}

const rateLimiter = new RateLimiter()

// ─────────────────────────────────────────────
// Budget → estimated value midpoint
// ─────────────────────────────────────────────
type BudgetRange = 'Under $1k' | '$1–3k' | '$3–7k' | '$7–15k' | '$15k+'

const BUDGET_MIDPOINT: Record<BudgetRange, number> = {
  'Under $1k': 500,
  '$1–3k':     2000,
  '$3–7k':     5000,
  '$7–15k':    11000,
  '$15k+':     20000,
}

const HIGH_PRIORITY_BUDGETS: BudgetRange[] = ['$7–15k', '$15k+']

// ─────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────
const ContactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  businessName: z.string().min(1),
  website: z.string().url().or(z.literal('')),
  budget: z.enum(['Under $1k', '$1–3k', '$3–7k', '$7–15k', '$15k+']),
  challenge: z.enum([
    'Not enough leads',
    'Low conversion',
    'Need rebrand',
    'Scaling growth',
    'Other',
  ]),
  message: z.string().min(10),
  honeypot: z.string().max(0),
})

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  const firstName = parts[0] ?? name
  const lastName = parts.slice(1).join(' ') || 'N/A'
  return { firstName, lastName }
}

// ─────────────────────────────────────────────
// POST /api/contact
// ─────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<Response> {
  const ip = getClientIp(req)

  if (!rateLimiter.isAllowed(ip, 5, 60 * 60 * 1000)) {
    return Response.json(
      { error: 'Too many requests. Please try again in an hour.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const {
    fullName,
    email,
    phone,
    businessName,
    website,
    budget,
    challenge,
    message,
    honeypot,
  } = parsed.data

  // Honeypot — silently discard
  if (honeypot.length > 0) {
    return Response.json({ success: true })
  }

  const { firstName, lastName } = splitName(fullName)
  const estimatedValue = new Decimal(BUDGET_MIDPOINT[budget])
  const priority = HIGH_PRIORITY_BUDGETS.includes(budget)
    ? Priority.HIGH
    : Priority.MEDIUM

  try {
    await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone ?? null,
        company: businessName,
        website: website || null,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW,
        priority,
        estimatedValue,
        notes: `Challenge: ${challenge}\n\n${message}`,
      },
    })
  } catch (err) {
    console.error('[api/contact] Lead creation failed:', err)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }

  // Send emails — stub until Phase 4 React Email templates
  try {
    await Promise.allSettled([
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'We Received Your Message — VMA',
        html: `
          <p>Hi ${firstName},</p>
          <p>Thanks for reaching out to VMA. Our team will review your project details and get back to you within 1 business day.</p>
          <p>— The VMA Team</p>
        `,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[Contact] ${fullName} — ${businessName} (${budget})`,
        html: `
          <p><strong>New contact form submission</strong></p>
          <p>
            Name: ${fullName}<br>
            Email: ${email}<br>
            Phone: ${phone ?? 'N/A'}<br>
            Business: ${businessName}<br>
            Website: ${website || 'N/A'}<br>
            Budget: ${budget}<br>
            Challenge: ${challenge}
          </p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      }),
    ])
  } catch (err) {
    console.error('[api/contact] Email send failed:', err)
  }

  return Response.json({ success: true })
}
