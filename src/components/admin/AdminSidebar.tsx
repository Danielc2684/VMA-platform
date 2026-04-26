'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Clipboard,
  MessageSquare,
  Inbox,
  FolderOpen,
  Mail,
  QrCode,
  Globe,
  BarChart3,
  DollarSign,
  Bot,
  Database,
  Megaphone,
  Settings,
  ChevronRight,
  LogOut,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { NotificationsBell } from './NotificationsBell'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: Users },
      { label: 'Clients', href: '/admin/clients', icon: Building2 },
      { label: 'Proposals', href: '/admin/proposals', icon: FileText },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Onboarding', href: '/admin/onboarding', icon: Clipboard },
      { label: 'Documents', href: '/admin/documents', icon: FolderOpen },
      { label: 'Communications', href: '/admin/messages', icon: MessageSquare },
      { label: 'Requests', href: '/admin/requests', icon: Inbox },
      { label: 'Assets', href: '/admin/assets', icon: Database },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Email Sequences', href: '/admin/email-sequences', icon: Mail },
      { label: 'QR Codes', href: '/admin/qr-codes', icon: QrCode },
      { label: 'Website Content', href: '/admin/site-content', icon: Globe },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Revenue', href: '/admin/revenue', icon: DollarSign },
    ],
  },
  {
    title: 'AI Outreach',
    items: [
      { label: 'Agent Dashboard', href: '/admin/agent', icon: Bot },
      { label: 'Agent Leads', href: '/admin/agent/leads', icon: Users },
      { label: 'Campaigns', href: '/admin/agent/campaigns', icon: Megaphone },
      { label: 'Agent Settings', href: '/admin/agent/settings', icon: Zap },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  userEmail: string
  userRole: string
  userInitials: string
  unreadNotifications?: number
}

export function AdminSidebar({
  userEmail,
  userRole,
  userInitials,
  unreadNotifications = 0,
}: AdminSidebarProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout(): Promise<void> {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 240 : 60 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-vma-black border-r border-vma-border overflow-hidden shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-vma-border shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 min-w-0"
          aria-label="Admin dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-vma-violet flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-white text-xs">V</span>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-display font-bold text-vma-text text-lg whitespace-nowrap"
              >
                VMA<span className="text-vma-violet">.</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {isExpanded && (
          <div className="ml-auto mr-1">
            <NotificationsBell initialUnread={unreadNotifications} />
          </div>
        )}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="p-1 rounded text-vma-text-muted hover:text-vma-text hover:bg-vma-surface transition-colors shrink-0"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1" aria-label="Admin navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-2">
            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>

            {section.items.map((item) => {
              const isActive =
                item.href === '/admin/dashboard'
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors group ${
                    isActive
                      ? 'bg-vma-violet-dim text-vma-violet-light'
                      : 'text-vma-text-muted hover:text-vma-text hover:bg-vma-surface'
                  }`}
                  title={!isExpanded ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-vma-violet rounded-full" />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="whitespace-nowrap font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}

            {!isExpanded && (
              <div className="h-px mx-4 mt-2 bg-vma-border" />
            )}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-vma-border p-3 space-y-1 shrink-0">
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-vma-surface-2 border border-vma-border-bright flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-vma-violet">
              {userInitials}
            </span>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="min-w-0 flex-1"
              >
                <p className="text-xs font-medium text-vma-text truncate">{userEmail}</p>
                <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-vma-violet-dim text-vma-violet-light font-mono">
                  {userRole}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-vma-text-muted hover:text-vma-text hover:bg-vma-surface transition-colors"
          title={!isExpanded ? 'Settings' : undefined}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="text-sm"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-2 py-2 rounded-lg text-sm text-vma-text-muted hover:text-vma-red hover:bg-vma-surface transition-colors"
          title={!isExpanded ? 'Sign out' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="text-sm"
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
