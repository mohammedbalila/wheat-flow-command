import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { regionSales } from '../data/mock'
import { Panel, SectionHeader } from './design-system'

export function RegionSalesChart() {
  return (
    <Panel>
      <SectionHeader
        title="Top Regions"
        description="Tons sold and growth performance"
        action={<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">June cycle</span>}
      />
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={regionSales} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid className="chart-grid" vertical={false} />
            <XAxis
              dataKey="region"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(29,79,145,.06)' }}
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #dde3ea',
                borderRadius: 8,
                color: '#102039',
              }}
            />
            <Bar dataKey="tons" radius={[6, 6, 0, 0]} fill="#1d4f91" />
            <Line dataKey="growth" type="monotone" stroke="#2d7d58" strokeWidth={2.5} dot={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
