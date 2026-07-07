import { Anchor, Droplets, ThermometerSun, Wheat } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { InventoryCard } from '../components/InventoryCard'
import { StatusBadge } from '../components/StatusBadge'
import { MetricTile, Panel, SectionHeader, Screen } from '../components/design-system'
import { siloStocks, vesselIntakes } from '../data/mock'
import { formatNumber } from '../lib/utils'

type Vessel = (typeof vesselIntakes)[number]

const vesselColumns: DataTableColumn<Vessel>[] = [
  { key: 'id', header: 'Intake', render: (row) => row.id },
  {
    key: 'vessel',
    header: 'Vessel',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{row.vessel}</p>
        <p className="text-xs text-slate-500">{row.origin}</p>
      </div>
    ),
  },
  { key: 'berth', header: 'Berth', render: (row) => row.berth },
  { key: 'tons', header: 'Tons', align: 'right', render: (row) => `${formatNumber(row.wheatTons)}t` },
  { key: 'quality', header: 'Moisture / Protein', render: (row) => `${row.moisture} / ${row.protein}` },
  { key: 'eta', header: 'ETA', render: (row) => row.eta },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
]

export function VesselSiloIntake() {
  return (
    <Screen>
      <div className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Berth utilization', '82%', Anchor],
          ['Inbound wheat', '69,350t', Wheat],
          ['Avg moisture', '12.8%', Droplets],
          ['Silo variance', '+0.3°C', ThermometerSun],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="copper" />
        ))}
      </div>

      <Panel className="shrink-0">
        <SectionHeader title="Vessel & Silo Intake" description="Port Sudan unload queue, lab quality, and silo position." />
        <DataTable columns={vesselColumns} rows={vesselIntakes} getRowId={(row) => row.id} />
      </Panel>

      <section className="grid min-h-0 flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {siloStocks.map((silo) => (
          <InventoryCard
            key={silo.id}
            name={silo.name}
            location={silo.location}
            product={silo.grade}
            tons={silo.wheatTons}
            capacityTons={silo.capacityTons}
            status={silo.status}
            alert={`${silo.turnover} turnover`}
          />
        ))}
      </section>
    </Screen>
  )
}
