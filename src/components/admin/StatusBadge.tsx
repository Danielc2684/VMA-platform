import type { LeadStatus, Priority, DocStatus, ProposalStatus, OrgStatus, OnboardingStatus, UserRole, InvoiceStatus, ReportType, ReportStatus, RequestStatus, DocCategory } from '@prisma/client'

type BadgeStatus = LeadStatus | Priority | DocStatus | ProposalStatus | OrgStatus | OnboardingStatus | UserRole | InvoiceStatus | ReportType | ReportStatus | RequestStatus | DocCategory | string

const STATUS_STYLES: Record<string, string> = {
  // Lead
  NEW:             'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  CONTACTED:       'bg-vma-violet/15 text-vma-violet border-vma-violet/30',
  QUALIFIED:       'bg-vma-cyan/15 text-vma-cyan border-vma-cyan/30',
  PROPOSAL_SENT:   'bg-vma-magenta/15 text-vma-magenta border-vma-magenta/30',
  NEGOTIATING:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  WON:             'bg-vma-green/15 text-vma-green border-vma-green/30',
  LOST:            'bg-vma-red/15 text-vma-red border-vma-red/30',
  UNQUALIFIED:     'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  // Priority
  LOW:             'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  MEDIUM:          'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  HIGH:            'bg-orange-500/15 text-orange-400 border-orange-500/30',
  URGENT:          'bg-vma-red/15 text-vma-red border-vma-red/30',
  // Document
  DRAFT:           'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  REVIEW:          'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  APPROVED:        'bg-vma-green/15 text-vma-green border-vma-green/30',
  SENT:            'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  AWAITING_COUNTERSIGN: 'bg-vma-magenta/15 text-vma-magenta border-vma-magenta/30',
  COUNTERSIGNED:   'bg-vma-green/15 text-vma-green border-vma-green/30',
  SIGNED:          'bg-vma-green/15 text-vma-green border-vma-green/30',
  ARCHIVED:        'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  VOIDED:          'bg-vma-red/15 text-vma-red border-vma-red/30',
  // Proposal
  VIEWED:          'bg-vma-cyan/15 text-vma-cyan border-vma-cyan/30',
  ACCEPTED:        'bg-vma-green/15 text-vma-green border-vma-green/30',
  REJECTED:        'bg-vma-red/15 text-vma-red border-vma-red/30',
  EXPIRED:         'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  // Org
  ACTIVE:          'bg-vma-green/15 text-vma-green border-vma-green/30',
  INACTIVE:        'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  SUSPENDED:       'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  CHURNED:         'bg-vma-red/15 text-vma-red border-vma-red/30',
  // Onboarding
  NOT_STARTED:     'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  IN_PROGRESS:     'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  COMPLETED:       'bg-vma-green/15 text-vma-green border-vma-green/30',
  PAUSED:          'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  // User role
  SUPER_ADMIN:     'bg-vma-magenta/15 text-vma-magenta border-vma-magenta/30',
  ADMIN:           'bg-vma-violet/15 text-vma-violet border-vma-violet/30',
  MANAGER:         'bg-vma-cyan/15 text-vma-cyan border-vma-cyan/30',
  CLIENT:          'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  VIEWER:          'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  // Invoice
  PAID:            'bg-vma-green/15 text-vma-green border-vma-green/30',
  OVERDUE:         'bg-vma-red/15 text-vma-red border-vma-red/30',
  CANCELLED:       'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  REFUNDED:        'bg-vma-cyan/15 text-vma-cyan border-vma-cyan/30',
  // Report type
  WEEKLY:          'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  MONTHLY:         'bg-vma-violet/15 text-vma-violet border-vma-violet/30',
  QUARTERLY:       'bg-vma-cyan/15 text-vma-cyan border-vma-cyan/30',
  CAMPAIGN:        'bg-vma-magenta/15 text-vma-magenta border-vma-magenta/30',
  CUSTOM:          'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
  // Report status
  PUBLISHED:       'bg-vma-green/15 text-vma-green border-vma-green/30',
  // Request status
  OPEN:            'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  AWAITING_APPROVAL: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  // Doc category
  CONTRACT:        'bg-vma-violet/15 text-vma-violet border-vma-violet/30',
  PROPOSAL:        'bg-vma-cyan/15 text-vma-cyan border-vma-cyan/30',
  REPORT:          'bg-vma-blue/15 text-vma-blue border-vma-blue/30',
  INVOICE:         'bg-vma-magenta/15 text-vma-magenta border-vma-magenta/30',
  STRATEGY:        'bg-orange-500/15 text-orange-400 border-orange-500/30',
  CREATIVE:        'bg-vma-green/15 text-vma-green border-vma-green/30',
  LEGAL:           'bg-vma-red/15 text-vma-red border-vma-red/30',
  OTHER:           'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30',
}

function formatLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

interface StatusBadgeProps {
  status: BadgeStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps): React.JSX.Element {
  const style = STATUS_STYLES[status] ?? 'bg-vma-text-dim/15 text-vma-text-dim border-vma-text-dim/30'
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${style} ${sizeClass}`}>
      {formatLabel(status)}
    </span>
  )
}
