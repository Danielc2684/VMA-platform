import { prisma } from './prisma'

interface NotificationParams {
  userId: string
  type: string
  title: string
  message: string
  link?: string
  metadata?: Record<string, unknown>
}

/**
 * Create a notification for a user. Non-fatal.
 */
export async function createNotification(params: NotificationParams): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        profileId: params.userId,
        type:      params.type,
        title:     params.title,
        body:      params.message,
        href:      params.link ?? null,
        metadata:  (params.metadata ?? {}) as import('@prisma/client').Prisma.InputJsonValue,
      },
    })
  } catch (err) {
    console.error('[notifications] create failed:', err)
  }
}

/**
 * Notify all users with ADMIN or SUPER_ADMIN role.
 */
export async function notifyAdmins(
  params: Omit<NotificationParams, 'userId'>,
): Promise<void> {
  try {
    const admins = await prisma.profile.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true },
    })
    await Promise.allSettled(
      admins.map((a) => createNotification({ ...params, userId: a.id })),
    )
  } catch (err) {
    console.error('[notifications] notifyAdmins failed:', err)
  }
}
