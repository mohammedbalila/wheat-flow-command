import { AlertTriangle, Boxes, ClipboardCheck, Warehouse } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { InventoryCard } from '../components/InventoryCard'
import { StatusBadge } from '../components/StatusBadge'
import { MetricTile, Panel, SectionHeader, Screen } from '../components/design-system'
import { inventoryAlerts, warehouseInventory, type RoleProfile } from '../data/mock'
import { formatNumber } from '../lib/utils'

type WarehouseRow = (typeof warehouseInventory)[number]

const columns: DataTableColumn<WarehouseRow>[] = [
  {
    key: 'name',
    header: 'Warehouse',
    className: 'min-w-[210px]',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{row.name}</p>
        <p className="text-xs text-slate-500">{row.location}</p>
      </div>
    ),
  },
  { key: 'product', header: 'Product', className: 'min-w-[150px] whitespace-normal', render: (row) => row.product },
  {
    key: 'stock',
    header: 'Stock',
    align: 'right',
    className: 'w-28',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{formatNumber(row.tons)}t</p>
        <p className="text-xs text-slate-500">{formatNumber(row.bags)} bags</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    className: 'w-32',
    render: (row) => (
      <div className="space-y-1">
        <StatusBadge status={row.status} className="px-2 py-0.5 text-[10px]" />
        <p className="text-xs text-slate-500">{row.alert}</p>
      </div>
    ),
  },
]

export function WarehouseInventory({ roleProfile }: { roleProfile: RoleProfile }) {
  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Available flour', '7,000t', Warehouse],
          ['Packed bags', '127,200', Boxes],
          ['Allocated today', '1,060t', ClipboardCheck],
          ['Open alerts', '3', AlertTriangle],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="blue" />
        ))}
      </section>

      <section className="grid shrink-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {warehouseInventory.map((item) => (
          <InventoryCard
            key={item.id}
            name={item.name}
            location={item.location}
            product={item.product}
            tons={item.tons}
            capacityTons={item.capacityTons}
            status={item.status}
            alert={item.alert}
          />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.32fr)]">
        <Panel className="min-h-0">
          <SectionHeader
            title={`${roleProfile.role} Inventory View`}
            description={roleProfile.role === 'Warehouse Keeper' ? roleProfile.focus : 'Stock by hub, bag count, and allocation state.'}
          />
          <div className="mt-4 max-h-[260px] overflow-y-auto">
            <DataTable columns={columns} rows={warehouseInventory} getRowId={(row) => row.id} density="compact" />
          </div>
        </Panel>
        <Panel className="min-h-0">
          <SectionHeader title="Alert Queue" />
          <div className="mt-4 max-h-[260px] space-y-2.5 overflow-y-auto">
            {inventoryAlerts.map((alert) => (
              <div key={alert.title} className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-950">{alert.title}</p>
                  <StatusBadge status={alert.severity} className="px-2 py-0.5 text-[10px]" />
                </div>
                <p className="mt-1 text-sm text-slate-500">{alert.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </Screen>
  )
}
