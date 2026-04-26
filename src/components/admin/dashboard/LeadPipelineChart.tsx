'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'

interface PipelineDataPoint {
  status: string
  count: number
}

const STAGE_COLORS: Record<string, string> = {
  NEW:           '#5B8DEF',
  CONTACTED:     '#8B5CF6',
  QUALIFIED:     '#00D4FF',
  PROPOSAL_SENT: '#E879F9',
  NEGOTIATING:   '#F472B6',
  WON:           '#00FF88',
  LOST:          '#FF3B5C',
  UNQUALIFIED:   '#3D4A6B',
}

function formatLabel(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

interface LeadPipelineChartProps {
  data: PipelineDataPoint[]
}

export function LeadPipelineChart({ data }: LeadPipelineChartProps): React.JSX.Element {
  return (
    <div className="rounded-xl bg-vma-surface border border-vma-border p-5">
      <h3 className="text-sm font-semibold text-vma-text mb-1">Lead Pipeline</h3>
      <p className="text-xs text-vma-text-muted mb-5">By status</p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="status"
            tickFormatter={formatLabel}
            tick={{ fill: '#6B7A99', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7A99', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              color: '#F0F4FF',
              fontSize: 12,
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, _: any, p: any) => [Number(value ?? 0), formatLabel((p?.payload as PipelineDataPoint | undefined)?.status ?? '')]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STAGE_COLORS[entry.status] ?? '#6B7A99'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
