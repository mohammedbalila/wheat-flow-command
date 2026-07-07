import { ArrowRight, BadgeCheck, CircleDollarSign, ReceiptText, ShieldCheck } from 'lucide-react'
import { ApprovalTimeline } from '../components/ApprovalTimeline'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { StatusBadge } from '../components/StatusBadge'
import { ActionButton, MetricTile, Panel, SectionHeader, Screen, SubPanel } from '../components/design-system'
import { orderStages, orders, type OrderStatus, type RoleProfile } from '../data/mock'
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
  roleProfile,
  workflowStatus,
  onAdvance,
}: {
  roleProfile: RoleProfile
  workflowStatus: OrderStatus
  onAdvance: () => void
}) {
  const visibleOrders = orders.filter((order) => {
    if (roleProfile.role === 'CEO') {
      return true
    }

    if (roleProfile.role === 'Sales Manager') {
      return ['Draft', 'Sales Approved', 'Accountant Approved'].includes(order.status)
    }

    if (roleProfile.role === 'Accountant') {
      return order.credit === 'Payment review' || ['Sales Approved', 'Accountant Approved'].includes(order.status)
    }

    if (roleProfile.role === 'Agent') {
      return order.agent === roleProfile.ownedAgent
    }

    return ['Release Order Generated', 'Accountant Approved'].includes(order.status)
  })
  const demoOrder = visibleOrders[0] ?? orders[0]
  const activeOrderValue = visibleOrders.reduce((total, order) => total + order.value, 0)
  const canAdvanceCurrentStep = (() => {
    if (!roleProfile.canAdvanceWorkflow) {
      return false
    }

    if (roleProfile.role === 'CEO') {
      return workflowStatus !== 'Completed'
    }

    if (roleProfile.role === 'Sales Manager') {
      return workflowStatus === 'Draft'
    }

    if (roleProfile.role === 'Accountant') {
      return workflowStatus === 'Sales Approved'
    }

    if (roleProfile.role === 'Warehouse Keeper') {
      return workflowStatus === 'Accountant Approved'
    }

    return false
  })()
  const decisionQueue = [
    ['Role scope', `${visibleOrders.length} orders`, 'Low'],
    ['Exposure in view', formatCurrency(activeOrderValue), activeOrderValue > 250000 ? 'Medium' : 'Low'],
    ['Current authority', canAdvanceCurrentStep ? 'Action available' : 'Read only', canAdvanceCurrentStep ? 'Low' : 'Medium'],
  ]

  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Visible orders', String(visibleOrders.length), ReceiptText],
          ['Pending approvals', String(visibleOrders.filter((order) => order.status !== 'Completed').length), ShieldCheck],
          ['Exposure in scope', formatCurrency(activeOrderValue), CircleDollarSign],
          ['Current gate', `${orderStages.indexOf(workflowStatus) + 1}/7`, BadgeCheck],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="copper" />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(330px,0.34fr)]">
        <Panel className="min-h-0">
          <SectionHeader
            title={`${roleProfile.role} Order Workbench`}
            description={roleProfile.actionHelp}
            action={
              <ActionButton onClick={onAdvance} disabled={!canAdvanceCurrentStep}>
                {roleProfile.actionLabel}
                <ArrowRight className="size-4" />
              </ActionButton>
            }
          />
          <DataTable columns={columns} rows={visibleOrders} getRowId={(row) => row.id} density="compact" />
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
