import { ArrowRight, BadgeCheck, CircleDollarSign, ReceiptText, ShieldCheck } from 'lucide-react'
import { ApprovalTimeline } from '../components/ApprovalTimeline'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { StatusBadge } from '../components/StatusBadge'
import { ActionButton, MetricTile, Panel, SectionHeader, Screen, SubPanel } from '../components/design-system'
import { orders, type OrderStatus } from '../data/mock'
import { formatCurrency, formatNumber } from '../lib/utils'

type Order = (typeof orders)[number]

const columns: DataTableColumn<Order>[] = [
  {
    key: 'order',
    header: 'Order / Agent',
    className: 'min-w-[220px]',
    render: (row) => (
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-950">{row.id}</p>
          <StatusBadge status={row.status} className="px-2 py-0.5 text-[10px]" />
        </div>
        <p className="font-semibold text-slate-950">{row.agent}</p>
        <p className="text-xs text-slate-500">{row.region}</p>
      </div>
    ),
  },
  {
    key: 'product',
    header: 'Product / Credit',
    className: 'min-w-[190px] whitespace-normal',
    render: (row) => (
      <div>
        <p>{row.product}</p>
        <p className="text-xs text-slate-500">{row.credit}</p>
      </div>
    ),
  },
  {
    key: 'commercial',
    header: 'Commercial',
    align: 'right',
    className: 'w-32',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{formatCurrency(row.value)}</p>
        <p className="text-xs text-slate-500">{formatNumber(row.tons)}t</p>
      </div>
    ),
  },
]

export function OrdersApprovalWorkflow({
  workflowStatus,
  onAdvance,
}: {
  workflowStatus: OrderStatus
  onAdvance: () => void
}) {
  const demoOrder = orders[0]
  const decisionQueue = [
    ['Credit hold risk', '$128k exposure', 'Medium'],
    ['Release ready', '6 orders cleared', 'Low'],
    ['Oldest approval', '42 minutes', 'High'],
  ]

  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Active orders', '34', ReceiptText],
          ['Pending approvals', '9', ShieldCheck],
          ['Credit exposure', '$361k', CircleDollarSign],
          ['Release ready', '6', BadgeCheck],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="copper" />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.34fr)]">
        <Panel className="min-h-0">
          <SectionHeader
            title="Orders & Approval Workflow"
            description="Draft to completed delivery with commercial controls."
            action={
              <ActionButton onClick={onAdvance}>
                Advance demo order
                <ArrowRight className="size-4" />
              </ActionButton>
            }
          />
          <DataTable columns={columns} rows={orders} getRowId={(row) => row.id} density="compact" />
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {decisionQueue.map(([label, value, severity]) => (
              <SubPanel key={label} className="p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
                <StatusBadge status={severity} className="mt-3 px-2 py-0.5 text-[10px]" />
              </SubPanel>
            ))}
          </div>
        </Panel>

        <Panel className="min-h-0">
          <SectionHeader
            title={demoOrder.id}
            description={`${demoOrder.agent} · ${demoOrder.region}`}
            action={<StatusBadge status={workflowStatus} />}
          />
          <div className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50/70 p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Product</p>
                <p className="mt-1 font-semibold text-slate-950">{demoOrder.product}</p>
              </div>
              <div>
                <p className="text-slate-500">Order value</p>
                <p className="mt-1 font-semibold text-slate-950">{formatCurrency(demoOrder.value)}</p>
              </div>
              <div>
                <p className="text-slate-500">Tons</p>
                <p className="mt-1 font-semibold text-slate-950">{demoOrder.tons}t</p>
              </div>
              <div>
                <p className="text-slate-500">Requested</p>
                <p className="mt-1 font-semibold text-slate-950">{demoOrder.requested}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 max-h-[360px] overflow-y-auto pr-1">
            <ApprovalTimeline currentStatus={workflowStatus} compact />
          </div>
        </Panel>
      </section>
    </Screen>
  )
}
