import { prisma } from './prisma'

interface AuditParams {
  userId?: string
  action: string
  entityType: string
  entityId?: string
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

/**
 * Write an audit log entry. Non-fatal — errors are swallowed so a
 * failed audit write never breaks the primary operation.
 */
export async function logAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action:     params.action,
        entityType: params.entityType,
        entityId:   params.entityId ?? null,
        before:     params.before ? (params.before as import('@prisma/client').Prisma.InputJsonValue) : undefined,
        after:      params.after  ? (params.after  as import('@prisma/client').Prisma.InputJsonValue) : undefined,
        ipAddress:  params.ipAddress ?? null,
        userAgent:  params.userAgent ?? null,
        actorId:    params.userId ?? null,
      },
    })
  } catch (err) {
    console.error('[audit] write failed:', err)
  }
}
