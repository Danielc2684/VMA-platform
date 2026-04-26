import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { LeadSource, LeadStatus, Priority } from '@prisma/client'

// ─────────────────────────────────────────────
// Rate limiter — in-memory, per IP, 5 req/hr
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
// Schema
// ─────────────────────────────────────────────
const AuditSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  website: z.string().url().or(z.literal('')),
  challenge: z.enum([
    'Not enough leads',
    'Low conversion',
    'Need rebrand',
    'Scaling growth',
    'Other',
  ]),
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
// POST /api/audit
// ─────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<Response> {
  const ip = getClientIp(req)

  // Rate limit: 5 per IP per hour
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

  const parsed = AuditSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const { name, email, website, challenge, honeypot } = parsed.data

  // Honeypot — silently drop without creating a lead
  if (honeypot.length > 0) {
    return Response.json({ success: true })
  }

  const { firstName, lastName } = splitName(name)

  try {
    await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        website: website || null,
        source: LeadSource.WEBSITE,
        status: LeadStatus.NEW,
        priority: Priority.MEDIUM,
        notes: `Free audit request: ${challenge}`,
      },
    })
  } catch (err) {
    console.error('[api/audit] Lead creation failed:', err)
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
        subject: 'Your VMA Digital Audit Request — We Got It',
        html: `
          <p>Hi ${firstName},</p>
          <p>Thanks for requesting your free digital audit. Our team will analyze your presence and send a personalized roadmap within 24 hours.</p>
          <p>— The VMA Team</p>
        `,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `[Audit Request] ${name} — ${challenge}`,
        html: `
          <p><strong>New audit request</strong></p>
          <p>Name: ${name}<br>Email: ${email}<br>Website: ${website || 'Not provided'}<br>Challenge: ${challenge}</p>
        `,
      }),
    ])
  } catch (err) {
    // Email failure is non-fatal — lead is already created
    console.error('[api/audit] Email send failed:', err)
  }

  return Response.json({ success: true })
}
