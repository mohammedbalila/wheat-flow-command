import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn, formatNumber } from '../lib/utils'

const toneStyles: Record<string, string> = {
  gold: 'bg-orange-50 text-orange-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  cyan: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-lime-50 text-lime-700',
}

function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => formatNumber(Math.round(latest)))
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const unsubscribe = rounded.on('change', setDisplay)
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    })

    return () => {
      unsubscribe()
      controls.stop()
    }
  }, [motionValue, rounded, value])

  return <>{display}</>
}

export function StatCard({
  label,
  value,
  suffix,
  trend,
  detail,
  tone,
  icon: Icon,
}: {
  label: string
  value: number
  suffix?: string
  trend: string
  detail: string
  tone: string
  icon: LucideIcon
}) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="ds-panel relative overflow-hidden rounded-[8px] p-3"
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[24px] font-semibold tracking-normal text-slate-950">
              <AnimatedCounter value={value} />
            </span>
            {suffix ? <span className="text-sm font-medium text-slate-500">{suffix}</span> : null}
          </div>
        </div>
        <div className={cn('rounded-[8px] p-2', toneStyles[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="relative mt-2">
        <p className="text-xs leading-5 text-slate-500">{detail}</p>
        <span className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
          <span className="truncate">{trend}</span>
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </motion.article>
  )
}
