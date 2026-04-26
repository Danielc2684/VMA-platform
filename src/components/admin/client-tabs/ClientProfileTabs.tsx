'use client'

import { useState } from 'react'
import { Prisma } from '@prisma/client'
import { OverviewTab } from './OverviewTab'
import { DocumentsTab } from './DocumentsTab'
import { OnboardingTab } from './OnboardingTab'
import { ProposalsTab } from './ProposalsTab'
import { BillingTab } from './BillingTab'
import { AssetsTab } from './AssetsTab'
import { ReportsTab } from './ReportsTab'
import { CommunicationsTab } from './CommunicationsTab'
import { HistoryTab } from './HistoryTab'

export type OrgWithRelations = Prisma.OrganizationGetPayload<{
  include: {
    members: true
    leads: true
    documents: { include: { template: { select: { name: true } } } }
    proposals: true
    invoices: true
    reports: true
    assets: true
    onboarding: { include: { steps: true } }
    requests: { include: { submittedBy: { select: { fullName: true; email: true } } } }
    appointments: true
  }
}>

export type AuditLogEntry = Prisma.AuditLogGetPayload<{
  include: { actor: { select: { fullName: true; email: true } } }
}>

interface ClientProfileTabsProps {
  org: OrgWithRelations
  auditLogs: AuditLogEntry[]
}

type Tab = {
  id: string
  label: string
  count?: number
}

export function ClientProfileTabs({ org, auditLogs }: ClientProfileTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents', count: org.documents.length },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'proposals', label: 'Proposals', count: org.proposals.length },
    { id: 'billing', label: 'Billing', count: org.invoices.length },
    { id: 'assets', label: 'Assets', count: org.assets.length },
    { id: 'reports', label: 'Reports', count: org.reports.length },
    { id: 'communications', label: 'Communications' },
    { id: 'history', label: 'History' },
  ]

  return (
    <div className="space-y-5">
      {/* Tab nav */}
      <div className="border-b border-vma-border">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Client profile tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-vma-violet text-vma-violet'
                  : 'border-transparent text-vma-text-muted hover:text-vma-text hover:border-vma-border'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-vma-violet/15 text-vma-violet' : 'bg-vma-surface-2 text-vma-text-dim'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab panels */}
      <div role="tabpanel">
        {activeTab === 'overview'       && <OverviewTab org={org} />}
        {activeTab === 'documents'      && <DocumentsTab org={org} />}
        {activeTab === 'onboarding'     && <OnboardingTab org={org} />}
        {activeTab === 'proposals'      && <ProposalsTab org={org} />}
        {activeTab === 'billing'        && <BillingTab org={org} />}
        {activeTab === 'assets'         && <AssetsTab org={org} />}
        {activeTab === 'reports'        && <ReportsTab org={org} />}
        {activeTab === 'communications' && <CommunicationsTab org={org} />}
        {activeTab === 'history'        && <HistoryTab auditLogs={auditLogs} />}
      </div>
    </div>
  )
}
