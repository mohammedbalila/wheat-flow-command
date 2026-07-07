import { Building2, MapPin, RadioTower, UsersRound } from 'lucide-react'
import { AgentLeaderboard } from '../components/AgentLeaderboard'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { StatusBadge } from '../components/StatusBadge'
import { MetricTile, Panel, SectionHeader, Screen } from '../components/design-system'
import { agents } from '../data/mock'
import { formatCurrency, formatNumber } from '../lib/utils'

type Agent = (typeof agents)[number]

const columns: DataTableColumn<Agent>[] = [
  {
    key: 'name',
    header: 'Agent',
    className: 'min-w-[220px]',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{row.name}</p>
        <p className="text-xs text-slate-500">{row.owner}</p>
      </div>
    ),
  },
  { key: 'region', header: 'Region', className: 'min-w-[130px]', render: (row) => row.region },
  {
    key: 'volume',
    header: 'Volume',
    align: 'right',
    className: 'w-28',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{formatNumber(row.monthlyTons)}t</p>
        <p className="text-xs text-slate-500">{row.fillRate} fill</p>
      </div>
    ),
  },
  {
    key: 'exposure',
    header: 'Exposure',
    align: 'right',
    className: 'w-32',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{formatCurrency(row.outstanding)}</p>
        <StatusBadge status={row.status} className="mt-1 px-2 py-0.5 text-[10px]" />
      </div>
    ),
  },
]

export function AgentsDistributionCenters() {
  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Active agents', '52', UsersRound],
          ['Distribution centers', '14', Building2],
          ['Regions covered', '8', MapPin],
          ['Portal uptime', '99.9%', RadioTower],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="blue" />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.32fr)]">
        <Panel className="min-h-0">
          <SectionHeader title="Agents & Distribution Centers" description="Agent scorecards, regional coverage, and allocation pressure." />
          <div className="mt-4 max-h-[520px] overflow-y-auto">
            <DataTable columns={columns} rows={agents} getRowId={(row) => row.id} density="compact" />
          </div>
        </Panel>
        <AgentLeaderboard />
      </section>
    </Screen>
  )
}
