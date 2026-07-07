import {
  AlertTriangle,
  ClipboardCheck,
  Factory,
  Gauge,
  PackageCheck,
  Ship,
  Truck,
  Wheat,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  executiveKpis,
  flowNodes,
  inventoryAlerts,
  liveUpdates,
  type OrderStatus,
  type ScreenId,
} from '../data/mock'
import { FlowMap } from '../components/FlowMap'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { IconTile, MetricTile, PageHeader, Panel, Screen, SectionHeader, SubPanel } from '../components/design-system'

const kpiIcons = [Wheat, PackageCheck, ClipboardCheck, Gauge, Truck]

export function ExecutiveDashboard({
  workflowStatus,
  onOpenScreen,
}: {
  workflowStatus: OrderStatus
  onOpenScreen: (screen: ScreenId) => void
}) {
  const executiveActions = [
    ['Decision needed', '9 approvals', 'Average age 42 minutes'],
    ['Operational risk', '3 alerts', 'Gedaref stock below target'],
    ['Cash exposure', '$361k', 'Credit checks in release queue'],
  ]

  return (
    <Screen className="gap-3">
      <PageHeader
        title="Executive Dashboard"
        description="Real-time overview of wheat-to-flour supply chain operations across Sudan."
        action={
          <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-[520px]">
            {[
              ['Factory uptime', '94.8%', Factory],
              ['Vessels planned', '3', Ship],
              ['Inventory alerts', '3', AlertTriangle],
            ].map(([label, value, Icon]) => (
              <MetricTile
                key={label as string}
                label={label as string}
                value={value as string}
                icon={Icon}
                tone={label === 'Inventory alerts' ? 'red' : 'blue'}
              />
            ))}
          </div>
        }
      />

      <section className="grid shrink-0 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {executiveKpis.map((kpi, index) => (
          <StatCard key={kpi.label} {...kpi} icon={kpiIcons[index]} />
        ))}
      </section>

      <FlowMap nodes={flowNodes} onNodeClick={onOpenScreen} />

      <section className="grid min-h-0 flex-1 items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_300px_300px]">
        <Panel className="flex min-h-0 min-w-0 flex-col p-3">
          <SectionHeader title="Executive Decisions" description="Board-level risks and required actions." className="mb-2" />
          <div className="grid gap-2.5 md:grid-cols-3">
            {executiveActions.map(([label, value, detail]) => (
              <SubPanel key={label} className="p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                <p className="mt-1.5 text-base font-semibold text-slate-950">{value}</p>
                <p className="mt-1 line-clamp-1 text-xs leading-4 text-slate-500">{detail}</p>
              </SubPanel>
            ))}
          </div>
          <div className="mt-auto grid gap-2 border-t border-slate-200 pt-3 text-xs sm:grid-cols-3">
            {[
              ['SLA', '6 orders under 45m'],
              ['Owner', 'Commercial control'],
              ['Impact', '$361k held risk'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                <p className="mt-1 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="flex min-h-0 flex-col p-3">
          <SectionHeader
            title="Approval Pulse"
            description="Demo order ORD-8814"
            action={<StatusBadge status={workflowStatus} />}
            className="mb-2"
          />
          <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700">Current gate</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{workflowStatus}</p>
            <p className="mt-1 line-clamp-2 text-xs text-emerald-700/75">Commercial controls cleared for release generation.</p>
          </div>
        </Panel>

        <Panel className="flex min-h-0 flex-col p-3">
          <SectionHeader title="Live Exceptions" className="mb-2" />
          <div className="space-y-2">
            {liveUpdates.slice(0, 1).map((update, index) => (
              <motion.div
                key={update.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-sm font-semibold text-slate-950">{update.title}</p>
                  <span className="text-xs font-semibold text-orange-600">{update.time}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs leading-4 text-slate-500">{update.detail}</p>
              </motion.div>
            ))}
            {inventoryAlerts.slice(0, 1).map((alert) => (
              <div key={alert.title} className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <IconTile icon={AlertTriangle} tone={alert.severity === 'High' ? 'red' : 'copper'} className="size-7" />
                    <p className="line-clamp-1 text-sm font-semibold text-slate-950">{alert.title}</p>
                  </div>
                  <StatusBadge status={alert.severity} className="px-2 py-0.5 text-[10px]" />
                </div>
                <p className="mt-1 line-clamp-1 text-xs leading-4 text-slate-500">{alert.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-xs">
            <span className="font-semibold uppercase tracking-[0.1em] text-slate-500">Control room</span>
            <span className="font-semibold text-slate-900">Next sweep in 12m</span>
          </div>
        </Panel>
      </section>
    </Screen>
  )
}
