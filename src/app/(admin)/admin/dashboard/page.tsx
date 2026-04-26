import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  AlertCircle,
  BarChart3,
  Bot,
  Plus,
  Send,
  Receipt,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/admin/StatsCard'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { LeadPipelineChart } from '@/components/admin/dashboard/LeadPipelineChart'
import { ClientDistributionChart } from '@/components/admin/dashboard/ClientDistributionChart'
import { ActivityFeed } from '@/components/admin/dashboard/ActivityFeed'
import { LeadStatus, OrgStatus, DocStatus, InvoiceStatus, AgentCampaignStatus } from '@prisma/client'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'

export const metadata: Metadata = { title: 'Dashboard' }

// Revalidate every 5 minutes
export const revalidate = 300

async function getDashboardData() {
  const now = new Date()

  const [
    activeClients,
    mrrResult,
    openLeadsCount,
    wonLeads,
    lostLeads,
    pendingDocs,
    overdueInvoices,
    activeCampaigns,
    leadsByStatus,
    clientsByStatus,
    recentActivity,
    alertDocs,
  ] = await Promise.all([
    // Active clients
    prisma.organization.count({ where: { status: OrgStatus.ACTIVE } }),

    // MRR (sum of monthlyBudget for active orgs)
    prisma.organization.aggregate({
      where: { status: OrgStatus.ACTIVE, monthlyBudget: { not: null } },
      _sum: { monthlyBudget: true },
    }),

    // Open leads (not terminal)
    prisma.lead.count({
      where: {
        status: { notIn: [LeadStatus.WON, LeadStatus.LOST, LeadStatus.UNQUALIFIED] },
      },
    }),

    // Won leads (for conversion rate)
    prisma.lead.count({ where: { status: LeadStatus.WON } }),
    prisma.lead.count({ where: { status: LeadStatus.LOST } }),

    // Documents pending signature
    prisma.document.count({
      where: { status: DocStatus.SENT, signedAt: null },
    }),

    // Overdue invoices
    prisma.invoice.count({
      where: { status: InvoiceStatus.SENT, dueDate: { lt: now } },
    }),

    // Active agent campaigns
    prisma.agentCampaign.count({
      where: {
        status: { in: [AgentCampaignStatus.QUEUED, AgentCampaignStatus.RUNNING] },
      },
    }),

    // Leads by status for pipeline chart
    prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),

    // Clients by status
    prisma.organization.groupBy({ by: ['status'], _count: { _all: true } }),

    // Recent audit log entries
    prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { fullName: true, email: true } },
      },
    }),

    // Documents past 48hr review SLA (status=SENT, createdAt >48hr ago)
    prisma.document.count({
      where: {
        status: DocStatus.SENT,
        createdAt: { lt: new Date(now.getTime() - 48 * 60 * 60 * 1000) },
      },
    }),
  ])

  // Revenue trend — last 12 months from invoices
  const revenueMonths = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(now, 11 - i)
      return prisma.invoice
        .aggregate({
          where: {
            status: InvoiceStatus.PAID,
            paidAt: { gte: startOfMonth(date), lte: endOfMonth(date) },
          },
          _sum: { total: true },
        })
        .then((r) => ({
          month: format(date, 'MMM'),
          revenue: Number(r._sum.total ?? 0),
        }))
    }),
  )

  const conversionRate =
    wonLeads + lostLeads === 0
      ? 0
      : Math.round((wonLeads / (wonLeads + lostLeads)) * 100)

  const mrr = Number(mrrResult._sum.monthlyBudget ?? 0)

  return {
    activeClients,
    mrr,
    openLeadsCount,
    conversionRate,
    pendingDocs,
    overdueInvoices,
    activeCampaigns,
    leadsByStatus: leadsByStatus.map((l) => ({
      status: l.status,
      count: l._count._all,
    })),
    clientsByStatus: clientsByStatus.map((c) => ({
      status: c.status,
      count: c._count._all,
    })),
    recentActivity,
    revenueMonths,
    alertDocs,
  }
}

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const d = await getDashboardData()

  const hasAlerts = d.overdueInvoices > 0 || d.alertDocs > 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-vma-text">Command Center</h1>
        <p className="text-vma-text-muted text-sm mt-1">Real-time overview of VMA operations.</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Active Clients"
          value={d.activeClients}
          icon={Building2}
          accentColor="violet"
        />
        <StatsCard
          label="Monthly Retainer"
          value={`$${(d.mrr / 1000).toFixed(1)}k`}
          icon={DollarSign}
          accentColor="green"
        />
        <StatsCard
          label="Open Leads"
          value={d.openLeadsCount}
          icon={Users}
          accentColor="violet"
        />
        <StatsCard
          label="Conversion Rate"
          value={`${d.conversionRate}%`}
          icon={TrendingUp}
          accentColor={d.conversionRate >= 30 ? 'green' : 'violet'}
        />
        <StatsCard
          label="Pending Signatures"
          value={d.pendingDocs}
          icon={FileText}
          accentColor={d.pendingDocs > 0 ? 'magenta' : 'violet'}
        />
        <StatsCard
          label="Overdue Invoices"
          value={d.overdueInvoices}
          icon={AlertCircle}
          accentColor={d.overdueInvoices > 0 ? 'red' : 'violet'}
        />
        <StatsCard
          label="Reports Published"
          value="—"
          icon={BarChart3}
          accentColor="violet"
        />
        <StatsCard
          label="Active Campaigns"
          value={d.activeCampaigns}
          icon={Bot}
          accentColor="magenta"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RevenueChart data={d.revenueMonths} />
        </div>
        <LeadPipelineChart data={d.leadsByStatus} />
        <ClientDistributionChart data={d.clientsByStatus} />
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityFeed entries={d.recentActivity} />
        </div>

        {/* Quick actions */}
        <div className="rounded-xl bg-vma-surface border border-vma-border p-5 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-vma-text">Quick Actions</h3>
          {[
            { label: 'New Lead', href: '/admin/leads?action=new', icon: Plus },
            { label: 'New Proposal', href: '/admin/proposals?action=new', icon: FileText },
            { label: 'Send Document', href: '/admin/documents?action=send', icon: Send },
            { label: 'Create Invoice', href: '/admin/revenue?action=new', icon: Receipt },
          ].map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-vma-surface-2 border border-vma-border hover:border-vma-violet hover:text-vma-violet text-vma-text-muted text-sm transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Alerts panel */}
      {hasAlerts && (
        <div className="rounded-xl bg-vma-surface border border-vma-red/30 p-5">
          <h3 className="text-sm font-semibold text-vma-red mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            Alerts Requiring Attention
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {d.overdueInvoices > 0 && (
              <Link
                href="/admin/revenue"
                className="flex items-start gap-3 p-3 rounded-lg bg-vma-red/10 border border-vma-red/20 hover:border-vma-red/40 transition-colors"
              >
                <AlertCircle className="h-4 w-4 text-vma-red shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-vma-text">
                    {d.overdueInvoices} Overdue Invoice{d.overdueInvoices !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-vma-text-muted">Payment past due date →</p>
                </div>
              </Link>
            )}
            {d.alertDocs > 0 && (
              <Link
                href="/admin/documents"
                className="flex items-start gap-3 p-3 rounded-lg bg-vma-magenta/10 border border-vma-magenta/20 hover:border-vma-magenta/40 transition-colors"
              >
                <FileText className="h-4 w-4 text-vma-magenta shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-vma-text">
                    {d.alertDocs} Document{d.alertDocs !== 1 ? 's' : ''} Past 48hr SLA
                  </p>
                  <p className="text-xs text-vma-text-muted">Clients haven&apos;t signed →</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
