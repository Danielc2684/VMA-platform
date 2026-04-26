'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'

interface RevenueDataPoint {
  month: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return `$${value}`
}

export function RevenueChart({ data }: RevenueChartProps): React.JSX.Element {
  return (
    <div className="rounded-xl bg-vma-surface border border-vma-border p-5">
      <h3 className="text-sm font-semibold text-vma-text mb-1">Revenue Trend</h3>
      <p className="text-xs text-vma-text-muted mb-5">Last 12 months</p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6B7A99', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: '#6B7A99', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
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
            formatter={(value: any) => [formatCurrency(Number(value ?? 0)), 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#revGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
