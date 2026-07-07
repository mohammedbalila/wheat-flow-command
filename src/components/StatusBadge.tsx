import { cn } from '../lib/utils'

const statusStyles: Record<string, string> = {
  Healthy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Ready: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Running: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Strategic: 'border-blue-200 bg-blue-50 text-blue-700',
  Growth: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Export: 'border-sky-200 bg-sky-50 text-sky-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Dispatched: 'border-blue-200 bg-blue-50 text-blue-700',
  'Awaiting OTP': 'border-orange-200 bg-orange-50 text-orange-700',
  'OTP Verified': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Release Order Generated': 'border-orange-200 bg-orange-50 text-orange-700',
  'Accountant Approved': 'border-lime-200 bg-lime-50 text-lime-700',
  'Sales Approved': 'border-blue-200 bg-blue-50 text-blue-700',
  Draft: 'border-slate-200 bg-slate-50 text-slate-600',
  Watch: 'border-orange-200 bg-orange-50 text-orange-700',
  Replenish: 'border-orange-200 bg-orange-50 text-orange-700',
  Allocated: 'border-blue-200 bg-blue-50 text-blue-700',
  Sampling: 'border-blue-200 bg-blue-50 text-blue-700',
  'Quality cleared': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Awaiting berth': 'border-slate-200 bg-slate-50 text-slate-600',
  'Maintenance window': 'border-orange-200 bg-orange-50 text-orange-700',
  High: 'border-red-200 bg-red-50 text-red-700',
  Medium: 'border-orange-200 bg-orange-50 text-orange-700',
  Low: 'border-blue-200 bg-blue-50 text-blue-700',
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
        statusStyles[status] ?? 'border-slate-200 bg-slate-50 text-slate-600',
        className,
      )}
    >
      {status}
    </span>
  )
}
