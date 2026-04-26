'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'

interface DistributionDataPoint {
  status: string
  count: number
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    '#00FF88',
  INACTIVE:  '#6B7A99',
  SUSPENDED: '#F472B6',
  CHURNED:   '#FF3B5C',
}

function formatLabel(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase()
}

interface ClientDistributionChartProps {
  data: DistributionDataPoint[]
}

export function ClientDistributionChart({ data }: ClientDistributionChartProps): React.JSX.Element {
  return (
    <div className="rounded-xl bg-vma-surface border border-vma-border p-5">
      <h3 className="text-sm font-semibold text-vma-text mb-1">Client Status</h3>
      <p className="text-xs text-vma-text-muted mb-5">Distribution by status</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? '#6B7A99'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              color: '#F0F4FF',
              fontSize: 12,
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => [Number(value ?? 0), formatLabel(String(name ?? ''))]}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: '#6B7A99', fontSize: 11 }}>{formatLabel(value)}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
