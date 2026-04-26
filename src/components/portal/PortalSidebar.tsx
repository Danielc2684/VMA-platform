'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Clipboard,
  FileText,
  BarChart3,
  CreditCard,
  FolderOpen,
  MessageSquare,
  Inbox,
  ChevronRight,
  LogOut,
  Settings,
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'Onboarding', href: '/portal/onboarding', icon: Clipboard },
  { label: 'Documents', href: '/portal/documents', icon: FileText },
  { label: 'Reports', href: '/portal/reports', icon: BarChart3 },
  { label: 'Billing', href: '/portal/billing', icon: CreditCard },
  { label: 'Files', href: '/portal/files', icon: FolderOpen },
  { label: 'Messages', href: '/portal/messages', icon: MessageSquare },
  { label: 'Requests', href: '/portal/requests', icon: Inbox },
]

interface PortalSidebarProps {
  userEmail: string
  userFirstName: string
  userInitials: string
}

export function PortalSidebar({
  userEmail,
  userFirstName,
  userInitials,
}: PortalSidebarProps): React.JSX.Element {
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
          href="/portal/dashboard"
          className="flex items-center gap-2 min-w-0"
          aria-label="Portal dashboard"
        >
          <div className="w-7 h-7 rounded-lg bg-vma-pink flex items-center justify-center shrink-0">
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
                VMA<span className="text-vma-pink">.</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="ml-auto p-1 rounded text-vma-text-muted hover:text-vma-text hover:bg-vma-surface transition-colors shrink-0"
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

      {/* Greeting */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 border-b border-vma-border overflow-hidden shrink-0"
          >
            <p className="text-xs text-vma-text-muted">Welcome back,</p>
            <p className="text-sm font-semibold text-vma-text truncate">{userFirstName}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1" aria-label="Client portal navigation">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/portal/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-vma-magenta-dim text-vma-pink'
                  : 'text-vma-text-muted hover:text-vma-text hover:bg-vma-surface'
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-vma-pink rounded-full" />
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
      </nav>

      {/* User footer */}
      <div className="border-t border-vma-border p-3 space-y-1 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-7 h-7 rounded-full bg-vma-surface-2 border border-vma-border-bright flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-vma-pink">
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
                <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-vma-magenta-dim text-vma-pink font-mono">
                  Client
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/portal/settings"
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
