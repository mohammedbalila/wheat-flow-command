import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartPie, Download, FileText, Landmark } from 'lucide-react'
import { commercialTrend, productMix, regionSales, type RoleProfile } from '../data/mock'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { MetricTile, Panel, SectionHeader, Screen } from '../components/design-system'
import { formatCurrency, formatNumber } from '../lib/utils'

type RegionRow = (typeof regionSales)[number]
const colors = ['#1d4f91', '#2d7d58', '#b46b35', '#8b5cf6']

const columns: DataTableColumn<RegionRow>[] = [
  { key: 'region', header: 'Region', render: (row) => row.region },
  { key: 'tons', header: 'Tons', align: 'right', render: (row) => formatNumber(row.tons) },
  { key: 'revenue', header: 'Revenue', align: 'right', render: (row) => formatCurrency(row.revenue) },
  { key: 'growth', header: 'Growth', align: 'right', render: (row) => `${row.growth}%` },
]

export function CommercialReports({ roleProfile }: { roleProfile: RoleProfile }) {
  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['June revenue', '$7.8m', Landmark],
          ['Gross margin', '20.7%', ChartPie],
          ['Orders closed', '188', FileText],
          ['Board pack', 'Ready', Download],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="blue" />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(310px,0.34fr)]">
        <div className="grid min-h-0 content-start gap-4">
        <Panel className="min-h-0">
          <SectionHeader
            title={`${roleProfile.role} Commercial Reports`}
            description={roleProfile.role === 'CEO' ? 'Revenue, margin, regional movement, and product mix.' : roleProfile.dataScope}
          />
          <div className="mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commercialTrend} margin={{ left: -18, right: 12, top: 10, bottom: 0 }}>
                <CartesianGrid className="chart-grid" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #dde3ea',
                    borderRadius: 8,
                    color: '#102039',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#1d4f91" fill="rgba(29,79,145,.12)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="margin" stroke="#2d7d58" fill="rgba(45,125,88,.12)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="min-h-0">
          <SectionHeader title="Regional Revenue Table" />
          <div className="mt-3 max-h-[232px] overflow-y-auto">
            <DataTable columns={columns} rows={regionSales} getRowId={(row) => row.region} density="compact" />
          </div>
        </Panel>
        </div>

        <Panel className="min-h-0">
          <SectionHeader title="Product Mix" />
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #dde3ea',
                    borderRadius: 8,
                    color: '#102039',
                  }}
                />
                <Pie data={productMix} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={4}>
                  {productMix.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {productMix.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="size-2 rounded-full" style={{ background: colors[index % colors.length] }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-950">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Board note</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">Bakery and family flour hold 69% of June revenue.</p>
          </div>
        </Panel>
      </section>
    </Screen>
  )
}
