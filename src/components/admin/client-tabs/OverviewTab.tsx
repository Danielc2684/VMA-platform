import { Globe, Phone, MapPin, Building2, FileText, Users } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDistanceToNow } from 'date-fns'
import type { OrgWithRelations } from './ClientProfileTabs'

interface OverviewTabProps {
  org: OrgWithRelations
}

export function OverviewTab({ org }: OverviewTabProps): React.JSX.Element {
  const totalSteps = org.onboarding?.steps.length ?? 0
  const completedSteps = org.onboarding?.steps.filter((s) => s.completedAt).length ?? 0
  const onboardingPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  const recentLeads = org.leads.slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-5">
        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Monthly Budget" value={org.monthlyBudget ? `$${Number(org.monthlyBudget).toLocaleString()}` : '—'} sub="per month" />
          <StatCard label="Total Leads" value={String(org.leads.length)} sub="all time" />
          <StatCard label="Team Members" value={String(org.members.length)} sub="users" />
          <StatCard label="Onboarding" value={totalSteps > 0 ? `${onboardingPct}%` : '—'} sub={totalSteps > 0 ? `${completedSteps}/${totalSteps} steps` : 'not started'} />
        </div>

        {/* Org details */}
        <div className="rounded-xl border border-vma-border bg-vma-surface p-5">
          <h3 className="text-sm font-semibold text-vma-text mb-4">Organization Details</h3>
          <dl className="space-y-3">
            {org.website && (
              <DetailRow icon={<Globe className="h-3.5 w-3.5" />} label="Website">
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-vma-violet hover:underline text-xs">
                  {org.website.replace(/^https?:\/\//, '')}
                </a>
              </DetailRow>
            )}
            {org.phone && (
              <DetailRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone">
                <span className="text-xs text-vma-text">{org.phone}</span>
              </DetailRow>
            )}
            {org.industry && (
              <DetailRow icon={<Building2 className="h-3.5 w-3.5" />} label="Industry">
                <span className="text-xs text-vma-text">{org.industry}</span>
              </DetailRow>
            )}
            {(org.city ?? org.state ?? org.country) && (
              <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location">
                <span className="text-xs text-vma-text">
                  {[org.city, org.state, org.country].filter(Boolean).join(', ')}
                </span>
              </DetailRow>
            )}
            {org.address && (
              <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address">
                <span className="text-xs text-vma-text">{org.address}</span>
              </DetailRow>
            )}
          </dl>
          {org.notes && (
            <div className="mt-4 pt-4 border-t border-vma-border">
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="h-3.5 w-3.5 text-vma-text-dim" />
                <span className="text-xs font-medium text-vma-text-muted">Notes</span>
              </div>
              <p className="text-xs text-vma-text leading-relaxed">{org.notes}</p>
            </div>
          )}
        </div>

        {/* Recent leads */}
        {recentLeads.length > 0 && (
          <div className="rounded-xl border border-vma-border bg-vma-surface p-5">
            <h3 className="text-sm font-semibold text-vma-text mb-4">Recent Leads</h3>
            <div className="space-y-2">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-vma-border last:border-0">
                  <div>
                    <p className="text-xs font-medium text-vma-text">{lead.firstName} {lead.lastName}</p>
                    {lead.email && <p className="text-[11px] text-vma-text-muted">{lead.email}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lead.status} />
                    <span className="text-[10px] text-vma-text-dim">
                      {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right column — team */}
      <div className="space-y-5">
        <div className="rounded-xl border border-vma-border bg-vma-surface p-5">
          <div className="flex items-center gap-1.5 mb-4">
            <Users className="h-3.5 w-3.5 text-vma-text-dim" />
            <h3 className="text-sm font-semibold text-vma-text">Team Members</h3>
          </div>
          {org.members.length === 0 ? (
            <p className="text-xs text-vma-text-dim">No members assigned.</p>
          ) : (
            <div className="space-y-3">
              {org.members.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: 'var(--vma-gradient-brand)' }}
                    aria-hidden="true"
                  >
                    {(m.fullName ?? m.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-vma-text truncate">{m.fullName ?? 'Unnamed'}</p>
                    <p className="text-[11px] text-vma-text-muted truncate">{m.email}</p>
                  </div>
                  <StatusBadge status={m.role} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }): React.JSX.Element {
  return (
    <div className="rounded-xl border border-vma-border bg-vma-surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim mb-1">{label}</p>
      <p className="font-mono text-lg font-bold text-vma-violet">{value}</p>
      <p className="text-[11px] text-vma-text-muted mt-0.5">{sub}</p>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-vma-text-dim mt-0.5 flex-shrink-0">{icon}</span>
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-vma-text-dim w-16 flex-shrink-0 mt-0.5">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
