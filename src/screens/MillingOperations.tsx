import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Factory, Gauge, TimerReset, Zap } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { StatusBadge } from '../components/StatusBadge'
import { MetricTile, Panel, Screen, SectionHeader, SubPanel } from '../components/design-system'
import { millingRuns, millingTrend } from '../data/mock'
import { formatNumber } from '../lib/utils'

type Run = (typeof millingRuns)[number]

const columns: DataTableColumn<Run>[] = [
  {
    key: 'line',
    header: 'Line / Status',
    className: 'min-w-[210px]',
    render: (row) => (
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-950">{row.line.replace('Jayli Factory ', '')}</p>
          <StatusBadge status={row.status} className="px-2 py-0.5 text-[10px]" />
        </div>
        <p className="text-xs text-slate-500">{row.id} · {row.supervisor}</p>
      </div>
    ),
  },
  {
    key: 'product',
    header: 'Product',
    className: 'min-w-[150px] whitespace-normal',
    render: (row) => row.product,
  },
  { key: 'output', header: 'Output', align: 'right', className: 'w-24', render: (row) => `${formatNumber(row.outputTons)}t` },
]

export function MillingOperations() {
  const totalInput = millingRuns.reduce((sum, run) => sum + run.inputTons, 0)
  const totalOutput = millingRuns.reduce((sum, run) => sum + run.outputTons, 0)
  const runningLines = millingRuns.filter((run) => run.status === 'Running').length
  const shiftBalance = [
    {
      label: 'Committed',
      value: `${formatNumber(totalInput)}t`,
      detail: '97% plan',
      progress: 97,
      tone: 'bg-[#b46b35]',
    },
    {
      label: 'Recovered',
      value: `${formatNumber(totalOutput)}t`,
      detail: '73% yield',
      progress: 73,
      tone: 'bg-[#2d7d58]',
    },
    {
      label: 'Buffer',
      value: '4h 20m',
      detail: 'Cleaning',
      progress: 42,
      tone: 'bg-[#d97706]',
    },
  ]

  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Daily wheat feed', '1,990t', Factory],
          ['Flour output', '1,453t', Zap],
          ['Extraction rate', '73.1%', Gauge],
          ['Next cleaning', '4h 20m', TimerReset],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="sage" />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 items-start gap-4 xl:grid-cols-[minmax(420px,0.42fr)_minmax(0,0.58fr)]">
        <div className="min-h-0 space-y-4">
          <Panel className="space-y-5">
            <SectionHeader
              title="Production Trend"
              description="Jayli and Bahri output across the weekly milling cycle."
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <SubPanel className="p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Input</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{formatNumber(totalInput)}t</p>
              </SubPanel>
              <SubPanel className="p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Output</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{formatNumber(totalOutput)}t</p>
              </SubPanel>
              <SubPanel className="p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Live Lines</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{runningLines}/3</p>
              </SubPanel>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={millingTrend} margin={{ left: -8, right: 16, top: 10, bottom: 0 }}>
                  <CartesianGrid className="chart-grid" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #dde3ea',
                      borderRadius: 8,
                      color: '#102039',
                    }}
                  />
                  <Area type="monotone" dataKey="wheat" stroke="#b46b35" fill="rgba(180,107,53,.12)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="flour" stroke="#2d7d58" fill="rgba(45,125,88,.12)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#b46b35]" />
                Wheat feed
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#2d7d58]" />
                Flour output
              </span>
            </div>
          </Panel>

          <Panel className="space-y-3">
            <SectionHeader
              title="Shift Balance"
              className="mb-0"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {shiftBalance.map((item) => (
                <SubPanel key={item.label} className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.progress}%` }} />
                  </div>
                </SubPanel>
              ))}
            </div>
          </Panel>
        </div>

        <div className="min-h-0 space-y-4">
          <Panel className="space-y-5">
            <SectionHeader
              title="Active Runs"
              description="Current factory lines and production status."
            />
            <div className="mt-4">
              <DataTable columns={columns} rows={millingRuns} getRowId={(row) => row.id} density="compact" />
            </div>

            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-3">
              {millingRuns.map((run) => (
                <SubPanel key={run.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{run.line.replace('Jayli Factory ', '')}</p>
                      <p className="mt-1 text-xs text-slate-500">{run.product}</p>
                    </div>
                    <StatusBadge status={run.status} className="px-2 py-0.5 text-[10px]" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Input</p>
                      <p className="mt-1 font-semibold text-slate-950">{formatNumber(run.inputTons)}t</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Rate</p>
                      <p className="mt-1 font-semibold text-slate-950">{run.extractionRate}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Uptime</p>
                      <p className="mt-1 font-semibold text-slate-950">{run.uptime}</p>
                    </div>
                  </div>
                </SubPanel>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHeader title="Factory Control" description="Next actions for line supervisors." className="mb-3" />
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['Lab release', 'Line A cleared', 'Protein band locked'],
                ['Cleaning window', '4h 20m', 'Bahri Mill C scheduled'],
                ['Recovery target', '74.0%', 'Next shift threshold'],
              ].map(([label, value, detail]) => (
                <SubPanel key={label} className="p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{detail}</p>
                </SubPanel>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </Screen>
  )
}
