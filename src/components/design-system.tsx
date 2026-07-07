import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

export function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={cn('ds-panel rounded-[8px] p-4', className)}>{children}</section>
}

export function SubPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('ds-soft rounded-[8px] p-3', className)}>{children}</div>
}

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h2 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-slate-900">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight text-slate-950">{title}</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-5 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function IconTile({
  icon: Icon,
  tone = 'blue',
  className,
}: {
  icon: LucideIcon
  tone?: 'blue' | 'sage' | 'copper' | 'slate' | 'red'
  className?: string
}) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    sage: 'bg-emerald-50 text-emerald-700',
    copper: 'bg-orange-50 text-orange-700',
    slate: 'bg-slate-100 text-slate-700',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <span className={cn('grid size-10 place-items-center rounded-[8px]', tones[tone], className)}>
      <Icon className="size-5" />
    </span>
  )
}

export function ActionButton({
  children,
  variant = 'primary',
  className,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const variants = {
    primary: 'bg-[#0b2d4d] text-white hover:bg-[#103a60]',
    secondary: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-semibold transition',
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

export function MetricTile({
  label,
  value,
  icon: Icon,
  tone = 'blue',
}: {
  label: string
  value: string
  icon: unknown
  tone?: 'blue' | 'sage' | 'copper' | 'slate' | 'red'
}) {
  const MetricIcon = Icon as LucideIcon

  return (
    <div className="ds-panel rounded-[8px] p-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
          <p className="mt-2 text-[22px] font-semibold text-slate-950">{value}</p>
        </div>
        <IconTile icon={MetricIcon} tone={tone} className="size-9" />
      </div>
    </div>
  )
}

export function Screen({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('flex min-h-0 flex-col gap-4', className)}>{children}</div>
}
