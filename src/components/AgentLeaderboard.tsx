import { Medal } from 'lucide-react'
import { agents } from '../data/mock'
import { formatCurrency, formatNumber } from '../lib/utils'
import { StatusBadge } from './StatusBadge'
import { Panel, SectionHeader } from './design-system'

export function AgentLeaderboard() {
  return (
    <Panel>
      <SectionHeader
        title="Top Agents"
        description="Monthly tonnage and payment exposure"
        action={<Medal className="size-5 text-orange-600" />}
      />
      <div className="space-y-2.5">
        {agents.slice(0, 4).map((agent, index) => (
          <div
            key={agent.id}
            className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50/70 p-2.5"
          >
            <div className="grid size-8 place-items-center rounded-full bg-white text-sm font-semibold text-slate-700 shadow-sm">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-950">{agent.name}</p>
                <StatusBadge status={agent.status} className="px-2 py-0.5 text-[10px]" />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {agent.region} · {formatNumber(agent.monthlyTons)} tons · {formatCurrency(agent.outstanding)}
              </p>
            </div>
            <p className="text-sm font-semibold text-emerald-700">{agent.fillRate}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}
