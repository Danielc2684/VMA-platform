import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default function PortalDashboardPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-vma-text">Client Dashboard</h1>
        <p className="text-vma-text-muted text-sm mt-1">
          Your marketing command center. Phase 4 will populate this with your campaign data.
        </p>
      </div>

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Onboarding Progress', 'Active Reports', 'Open Requests'].map((label) => (
          <div
            key={label}
            className="rounded-xl border border-vma-border bg-vma-surface p-6 space-y-2"
          >
            <p className="text-xs text-vma-text-muted uppercase tracking-wider">{label}</p>
            <p className="font-mono text-2xl font-bold text-vma-text">—</p>
          </div>
        ))}
      </div>
    </div>
  )
}
