import { motion } from 'framer-motion'
import { Activity, AlertTriangle, Route, ShieldCheck, X } from 'lucide-react'
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { siloThresholds, type MetricKey, type Silo } from '../data/siloTypes'
import {
  batchAgeDays,
  batchDaysToExpiry,
  metricInfo,
  metricValue,
  siloAlerts,
  worstBatch,
} from '../lib/colorScales'
import { formatNumber } from '../lib/utils'
import { cn } from '../lib/utils'
import { Panel } from './design-system'

function tint(color: string, strength: number) {
  return `color-mix(in srgb, ${color} ${strength}%, white)`
}

function formatStoredDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const batchColumns: Array<{ key: string; header: string; metric?: MetricKey }> = [
  { key: 'batch', header: 'Batch' },
  { key: 'stored', header: 'Stored' },
  { key: 'age', header: 'Age', metric: 'age' },
  { key: 'temp', header: 'Temp', metric: 'temperature' },
  { key: 'protein', header: 'Protein', metric: 'protein' },
  { key: 'expiry', header: 'Expiry', metric: 'expiry' },
]

function getActionOwner(alerts: ReturnType<typeof siloAlerts>) {
  if (alerts.some((alert) => alert.kind === 'temperature')) return 'Quality lab + Warehouse keeper'
  if (alerts.some((alert) => alert.kind === 'expiry')) return 'Planning desk + Jayli mill'
  if (alerts.some((alert) => alert.kind === 'protein')) return 'Commercial quality desk'
  return 'Warehouse keeper'
}

function getRecommendedAction(alerts: ReturnType<typeof siloAlerts>, silo: Silo) {
  const first = alerts[0]
  if (!first) return `Maintain ${silo.site} in current allocation plan. Continue standard aeration and IoT watch.`
  if (first.kind === 'temperature') return `Dispatch ${first.batchId} for quality inspection and increase aeration before next transfer window.`
  if (first.kind === 'expiry') return `Move ${first.batchId} into Jayli blend plan or release order queue before shelf-life breach.`
  return `Blend ${first.batchId} with higher-protein Port Sudan reserve before milling allocation.`
}

export function SiloDetailPanel({
  silo,
  metric,
  now,
  onClose,
  variant = 'inline',
}: {
  silo: Silo
  metric: MetricKey
  now: Date
  onClose: () => void
  variant?: 'inline' | 'overlay'
}) {
  const info = metricInfo[metric]
  const alerts = siloAlerts(silo, now)
  const storedTons = silo.batches.reduce((total, batch) => total + batch.tons, 0)
  const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical')
  const riskLabel = criticalAlerts.length > 0 ? 'Critical action' : alerts.length > 0 ? 'Watch' : 'Stable'
  const riskTone = criticalAlerts.length > 0 ? '#dc3f3f' : alerts.length > 0 ? '#d37a2b' : '#2d7d58'
  const averageTemp = silo.batches.reduce((total, batch) => total + batch.temperatureC, 0) / silo.batches.length
  const priorityBatch = worstBatch(silo, metric, now)
  const recommendedAction = getRecommendedAction(alerts, silo)
  const owner = getActionOwner(alerts)
  const batchesOldestFirst = [...silo.batches].sort(
    (a, b) => new Date(a.storedDate).getTime() - new Date(b.storedDate).getTime(),
  )

  return (
    <motion.aside
      initial={{ x: 48, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'min-w-0',
        variant === 'inline' ? '2xl:sticky 2xl:top-4' : 'pointer-events-auto h-full w-full',
      )}
      aria-label={`${silo.name} details`}
    >
      <Panel
        className={cn(
          'overflow-hidden p-0',
          variant === 'inline'
            ? '2xl:max-h-[calc(100svh-2rem)] 2xl:overflow-y-auto'
            : 'h-full overflow-y-auto border-white/20 shadow-[0_24px_70px_rgba(0,0,0,.38)]',
        )}
      >
        <div className="bg-[#061527] p-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100/62">Asset Intelligence</p>
              <h2 className="mt-2 text-[18px] font-semibold leading-tight">{silo.name}</h2>
              <p className="mt-1 text-sm text-white/58">{silo.id} · {silo.site}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close silo details"
              className="grid size-8 place-items-center rounded-[8px] text-white/56 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-[8px] border border-white/12 bg-white/[0.07] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/48">Risk</p>
              <p className="mt-1 truncate text-sm font-semibold" style={{ color: riskTone }}>{riskLabel}</p>
            </div>
            <div className="rounded-[8px] border border-white/12 bg-white/[0.07] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/48">Owner</p>
              <p className="mt-1 truncate text-sm font-semibold">{owner}</p>
            </div>
            <div className="rounded-[8px] border border-white/12 bg-white/[0.07] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/48">Avg temp</p>
              <p className="mt-1 text-sm font-semibold">{averageTemp.toFixed(1)}°C</p>
            </div>
          </div>
        </div>

        <div className="p-4">
        <div
          className="rounded-[8px] border p-3"
          style={{
            borderColor: `${riskTone}55`,
            background: `color-mix(in srgb, ${riskTone} 10%, white)`,
          }}
        >
          <div className="flex items-start gap-3">
            <Route className="mt-0.5 size-4 shrink-0" style={{ color: riskTone }} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: riskTone }}>
                Recommended next move
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-800">{recommendedAction}</p>
              {priorityBatch ? (
                <p className="mt-1 text-xs text-slate-500">
                  Priority batch {priorityBatch.id} · {formatNumber(priorityBatch.tons)}t · {info.format(metricValue(priorityBatch, metric, now))}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50/70 p-3">
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-[#0b2d4d]" style={{ width: `${Math.min(silo.fillPct, 100)}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{silo.fillPct}% full</span>
            <span>
              {formatNumber(storedTons)}t / {formatNumber(silo.capacityTons)}t
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            Batches · colored by {info.label.toLowerCase()}
          </p>
          <div className="mt-2 overflow-hidden rounded-[8px] border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-[12px]">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-[0.1em] text-slate-500">
                    {batchColumns.map((column) => (
                      <th key={column.key} className="whitespace-nowrap px-2.5 py-2 font-semibold">
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batchesOldestFirst.map((batch) => {
                    const value = metricValue(batch, metric, now)
                    const rowColor = info.color(value)
                    const daysLeft = batchDaysToExpiry(batch, now)
                    return (
                      <tr
                        key={batch.id}
                        className="border-t border-slate-100"
                        style={{ background: tint(rowColor, 13) }}
                      >
                        <td className="whitespace-nowrap px-2.5 py-2 font-semibold text-slate-950">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="size-2 shrink-0 rounded-full" style={{ background: rowColor }} />
                            {batch.id}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-600">{formatStoredDate(batch.storedDate)}</td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700">{batchAgeDays(batch, now)}d</td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700">{batch.temperatureC.toFixed(1)}°C</td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-slate-700">{batch.proteinPct.toFixed(1)}%</td>
                        <td
                          className={
                            daysLeft <= siloThresholds.expiryWarningDays
                              ? 'whitespace-nowrap px-2.5 py-2 font-semibold text-[#b42323]'
                              : 'whitespace-nowrap px-2.5 py-2 text-slate-700'
                          }
                        >
                          {daysLeft < 0 ? 'expired' : `${daysLeft}d`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              Temperature · last 24h
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Activity className="size-3.5" />
              Live probes
            </span>
          </div>
          <div className="mt-2 h-20 rounded-[8px] border border-slate-200 bg-white px-1 py-1" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={silo.tempHistory24h} margin={{ top: 6, right: 6, left: 6, bottom: 4 }}>
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}°C`, 'Temp']}
                  labelFormatter={(_, payload) => {
                    const time = payload?.[0]?.payload?.time
                    return typeof time === 'string' ? formatClock(time) : ''
                  }}
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #dde3ea',
                    borderRadius: 8,
                    color: '#102039',
                    fontSize: 12,
                  }}
                />
                <ReferenceLine y={siloThresholds.tempLimitC} stroke="#dc3f3f" strokeDasharray="4 4" />
                <Line dataKey="temperatureC" type="monotone" stroke="#1d4f91" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Dashed red line marks the {siloThresholds.tempLimitC}°C limit.</p>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Alerts</p>
          {alerts.length === 0 ? (
            <p className="mt-2 flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              <ShieldCheck className="size-4 shrink-0" />
              No active alerts for this silo.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {alerts.map((alert) => (
                <li
                  key={`${alert.batchId}-${alert.kind}`}
                  className={
                    alert.severity === 'critical'
                      ? 'flex items-start gap-2 rounded-[8px] border border-[#f4a4a4] bg-[#feecec] px-3 py-2 text-xs text-[#b42323]'
                      : 'flex items-start gap-2 rounded-[8px] border border-[#fdc48d] bg-[#fff0e5] px-3 py-2 text-xs text-[#a84f12]'
                  }
                >
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  <span className="leading-4">{alert.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        </div>
      </Panel>
    </motion.aside>
  )
}
