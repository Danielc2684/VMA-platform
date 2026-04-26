'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  body: string
  href: string | null
  isRead: boolean
  createdAt: string
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch('/api/notifications')
  if (!res.ok) throw new Error('Failed to fetch notifications')
  return res.json() as Promise<NotificationsResponse>
}

export function NotificationsBell({ initialUnread }: { initialUnread: number }): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    initialData: { notifications: [], unreadCount: initialUnread },
    refetchInterval: 30_000,
  })

  const { mutate: markAllRead } = useMutation({
    mutationFn: () =>
      fetch('/api/notifications/read-all', { method: 'POST' }).then((r) => r.json()),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-vma-text-muted hover:text-vma-text hover:bg-vma-surface transition-colors"
        aria-label={`Notifications${data.unreadCount > 0 ? `, ${data.unreadCount} unread` : ''}`}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {data.unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-vma-magenta" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-vma-surface border border-vma-border shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-vma-border">
            <h3 className="text-sm font-semibold text-vma-text">
              Notifications
              {data.unreadCount > 0 && (
                <span className="ml-2 text-xs bg-vma-violet text-white px-1.5 py-0.5 rounded-full">
                  {data.unreadCount}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              {data.unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="text-xs text-vma-violet hover:text-vma-violet-light transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="text-vma-text-muted hover:text-vma-text transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {data.notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-vma-text-muted">
                No notifications yet
              </div>
            ) : (
              data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-vma-border last:border-0 ${
                    !n.isRead ? 'bg-vma-violet-dim/30' : ''
                  }`}
                >
                  {n.href ? (
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <p className="text-xs font-semibold text-vma-text">{n.title}</p>
                      <p className="text-xs text-vma-text-muted mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-vma-text-dim mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </Link>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-vma-text">{n.title}</p>
                      <p className="text-xs text-vma-text-muted mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-vma-text-dim mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
