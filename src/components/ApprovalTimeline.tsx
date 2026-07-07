import { CheckCircle2, CircleDashed, LockKeyhole } from 'lucide-react'
import { orderStages, type OrderStatus } from '../data/mock'
import { cn } from '../lib/utils'

export function ApprovalTimeline({
  currentStatus,
  compact = false,
}: {
  currentStatus: OrderStatus
  compact?: boolean
}) {
  const currentIndex = orderStages.indexOf(currentStatus)

  return (
    <div className={cn('space-y-3', compact && 'space-y-2')}>
      {orderStages.map((stage, index) => {
        const complete = index < currentIndex
        const current = index === currentIndex
        const Icon = complete ? CheckCircle2 : current ? CircleDashed : LockKeyhole

        return (
          <div key={stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'grid size-8 place-items-center rounded-full border',
                  complete && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                  current && 'border-orange-200 bg-orange-50 text-orange-700',
                  !complete && !current && 'border-slate-200 bg-slate-50 text-slate-400',
                )}
              >
                <Icon className="size-4" />
              </div>
              {index < orderStages.length - 1 ? (
                <div
                  className={cn(
                    'h-6 w-px',
                    complete ? 'bg-emerald-200' : 'bg-slate-200',
                    compact && 'h-4',
                  )}
                />
              ) : null}
            </div>
            <div className={cn('pb-2', compact && 'pb-1')}>
              <p
                className={cn(
                  'text-sm font-semibold',
                  complete && 'text-emerald-700',
                  current && 'text-orange-700',
                  !complete && !current && 'text-slate-400',
                )}
              >
                {stage}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {complete
                  ? 'Confirmed in audit trail'
                  : current
                    ? 'Current gate for release'
                    : 'Locked until prior gate clears'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
