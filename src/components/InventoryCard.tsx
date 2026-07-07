import { PackageCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatNumber } from '../lib/utils'
import { StatusBadge } from './StatusBadge'
import { IconTile } from './design-system'

export function InventoryCard({
  name,
  location,
  product,
  tons,
  capacityTons,
  status,
  alert,
}: {
  name: string
  location: string
  product: string
  tons: number
  capacityTons: number
  status: string
  alert: string
}) {
  const fill = Math.round((tons / capacityTons) * 100)

  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="ds-panel rounded-[8px] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{location}</p>
        </div>
        <IconTile icon={PackageCheck} tone="copper" className="size-8" />
      </div>
      <div className="mt-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[22px] font-semibold text-slate-950">{formatNumber(tons)}t</p>
            <p className="text-sm text-slate-500">{product}</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-orange-400"
            style={{ width: `${fill}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500">
          <span>{fill}% capacity</span>
          <span>{alert}</span>
        </div>
      </div>
    </motion.article>
  )
}
