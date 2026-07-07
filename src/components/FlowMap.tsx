import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Factory, PackageCheck, ShieldCheck, Ship, Truck, Wheat } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ScreenId } from '../data/mock'
import { IconTile, SectionHeader } from './design-system'

const iconById: Record<string, LucideIcon> = {
  vessel: Ship,
  silo: Wheat,
  factory: Factory,
  warehouse: PackageCheck,
  orders: ShieldCheck,
  dispatch: Truck,
}

export function FlowMap({
  nodes,
  onNodeClick,
}: {
  nodes: Array<{
    id: string
    label: string
    location: string
    metric: string
    status: string
    screen: ScreenId
  }>
  onNodeClick?: (screen: ScreenId) => void
}) {
  return (
    <div className="ds-panel min-w-0 rounded-[8px] p-4">
      <SectionHeader
        title="Supply Chain Flow"
        description="Vessel wheat intake to completed delivery"
        className="mb-3"
        action={
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700">
            Live operations
          </div>
        }
      />
      <div className="max-w-full overflow-x-auto pb-1">
        <div className="grid min-w-[1260px] grid-cols-[repeat(6,minmax(0,1fr))] gap-7">
          {nodes.map((node, index) => {
            const Icon = iconById[node.id] ?? PackageCheck
            return (
              <div key={node.id} className="relative">
                <motion.button
                  type="button"
                  aria-label={`Open ${node.label}`}
                  whileHover={{ y: -4 }}
                  onClick={() => onNodeClick?.(node.screen)}
                  className="min-h-[144px] w-full rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/45"
                >
                  <div className="flex items-start justify-between gap-4">
                    <IconTile icon={Icon} tone={node.id === 'factory' ? 'blue' : node.id === 'silo' ? 'sage' : 'copper'} className="size-8" />
                    <span className="max-w-[76px] text-right text-sm font-semibold leading-5 text-slate-700">{node.metric}</span>
                  </div>
                  <p className="mt-4 text-[15px] font-semibold leading-5 text-slate-950">{node.label}</p>
                  <p className="mt-2 line-clamp-1 text-sm leading-5 text-slate-500">{node.location}</p>
                  <p className="mt-2 line-clamp-1 text-sm font-medium leading-5 text-slate-600">{node.status}</p>
                </motion.button>
                {index < nodes.length - 1 ? (
                  <div className="absolute right-[-28px] top-1/2 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
                    <ArrowRight className="size-3.5" />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
