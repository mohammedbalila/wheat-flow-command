import { scaleLinear } from 'd3-scale'
import { siloThresholds, type Batch, type MetricKey, type Silo } from '../data/siloTypes'

// App palette. Red always means "act now", on every scale.
const palette = {
  blue: '#2563eb',
  green: '#2d7d58',
  amber: '#d37a2b',
  red: '#dc3f3f',
} as const

const DAY_MS = 86_400_000
const { tempLimitC, expiryWarningDays, ageWarningDays, proteinTargetRange } = siloThresholds
const [proteinLow, proteinHigh] = proteinTargetRange

const AGE_MAX_DAYS = ageWarningDays * 2
const TEMP_MIN_C = 24
const TEMP_MAX_C = tempLimitC + 4
const EXPIRY_SAFE_DAYS = expiryWarningDays * 4

export function batchAgeDays(batch: Batch, now: Date) {
  return Math.max(0, Math.round((now.getTime() - new Date(batch.storedDate).getTime()) / DAY_MS))
}

export function batchDaysToExpiry(batch: Batch, now: Date) {
  return Math.ceil((new Date(batch.expiryDate).getTime() - now.getTime()) / DAY_MS)
}

export function metricValue(batch: Batch, metric: MetricKey, now: Date): number {
  switch (metric) {
    case 'age':
      return batchAgeDays(batch, now)
    case 'temperature':
      return batch.temperatureC
    case 'protein':
      return batch.proteinPct
    case 'expiry':
      return batchDaysToExpiry(batch, now)
  }
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

const ageScale = scaleLinear<string>()
  .domain([0, ageWarningDays, AGE_MAX_DAYS])
  .range([palette.green, palette.amber, palette.red])
  .clamp(true)

const temperatureScale = scaleLinear<string>()
  .domain([TEMP_MIN_C, 28, tempLimitC, TEMP_MAX_C])
  .range([palette.blue, palette.green, palette.amber, palette.red])
  .clamp(true)

const proteinScale = scaleLinear<string>()
  .domain([proteinLow - 1, proteinLow - 0.35, proteinLow, proteinHigh, proteinHigh + 0.7])
  .range([palette.red, palette.amber, palette.green, palette.green, palette.amber])
  .clamp(true)

const expiryScale = scaleLinear<string>()
  .domain([0, expiryWarningDays, EXPIRY_SAFE_DAYS])
  .range([palette.red, palette.amber, palette.green])
  .clamp(true)

export type MetricInfo = {
  key: MetricKey
  label: string
  legendTitle: string
  domain: readonly [number, number]
  color: (value: number) => string
  /** 0..1 where 1 = act now; drives pessimistic worst-batch aggregation. */
  severity: (value: number) => number
  format: (value: number) => string
  ticks: Array<{ value: number; label: string }>
}

export const metricKeys: MetricKey[] = ['age', 'temperature', 'protein', 'expiry']

export const metricInfo: Record<MetricKey, MetricInfo> = {
  age: {
    key: 'age',
    label: 'Age',
    legendTitle: 'Days in storage — red stock should be turned first',
    domain: [0, AGE_MAX_DAYS],
    color: (value) => ageScale(value),
    severity: (value) => clamp01(value / AGE_MAX_DAYS),
    format: (value) => `${Math.round(value)}d`,
    ticks: [
      { value: 0, label: '0d' },
      { value: ageWarningDays, label: `${ageWarningDays}d` },
      { value: AGE_MAX_DAYS, label: `${AGE_MAX_DAYS}d+` },
    ],
  },
  temperature: {
    key: 'temperature',
    label: 'Temperature',
    legendTitle: `Grain temperature — red is above the ${tempLimitC}°C limit`,
    domain: [TEMP_MIN_C, TEMP_MAX_C],
    color: (value) => temperatureScale(value),
    severity: (value) => clamp01((value - TEMP_MIN_C) / (TEMP_MAX_C - TEMP_MIN_C)),
    format: (value) => `${value.toFixed(1)}°C`,
    ticks: [
      { value: TEMP_MIN_C, label: `${TEMP_MIN_C}°C` },
      { value: tempLimitC, label: `${tempLimitC}°C limit` },
      { value: TEMP_MAX_C, label: `${TEMP_MAX_C}°C+` },
    ],
  },
  protein: {
    key: 'protein',
    label: 'Protein %',
    legendTitle: `Protein quality — green is the ${proteinLow}–${proteinHigh}% target band`,
    domain: [proteinLow - 1, proteinHigh + 0.7],
    color: (value) => proteinScale(value),
    severity: (value) => {
      if (value < proteinLow) return 0.6 + clamp01((proteinLow - value) / 1) * 0.4
      if (value > proteinHigh) return 0.3 + clamp01((value - proteinHigh) / 0.7) * 0.2
      return 0
    },
    format: (value) => `${value.toFixed(1)}%`,
    ticks: [
      { value: proteinLow - 1, label: `${(proteinLow - 1).toFixed(1)}%` },
      { value: (proteinLow + proteinHigh) / 2, label: `target ${proteinLow}–${proteinHigh}%` },
      { value: proteinHigh + 0.7, label: `${(proteinHigh + 0.7).toFixed(1)}%` },
    ],
  },
  expiry: {
    key: 'expiry',
    label: 'Expiry risk',
    legendTitle: 'Days to expiry — red needs turning or processing now',
    domain: [0, EXPIRY_SAFE_DAYS],
    color: (value) => expiryScale(value),
    severity: (value) => 1 - clamp01(value / EXPIRY_SAFE_DAYS),
    format: (value) => (value < 0 ? 'expired' : `${Math.round(value)}d left`),
    ticks: [
      { value: 0, label: '0d' },
      { value: expiryWarningDays, label: `${expiryWarningDays}d` },
      { value: EXPIRY_SAFE_DAYS, label: `${EXPIRY_SAFE_DAYS}d+` },
    ],
  },
}

export function legendGradient(metric: MetricKey): string {
  const info = metricInfo[metric]
  const [min, max] = info.domain
  const stops = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12
    return `${info.color(min + (max - min) * t)} ${Math.round(t * 100)}%`
  })
  return `linear-gradient(90deg, ${stops.join(', ')})`
}

/** Pessimistic aggregation: a silo shows its worst batch for the active metric. */
export function worstBatch(silo: Silo, metric: MetricKey, now: Date): Batch | null {
  const info = metricInfo[metric]
  let worst: Batch | null = null
  let worstSeverity = -1
  for (const batch of silo.batches) {
    const severity = info.severity(metricValue(batch, metric, now))
    if (severity > worstSeverity) {
      worst = batch
      worstSeverity = severity
    }
  }
  return worst
}

export function siloMetricColor(silo: Silo, metric: MetricKey, now: Date): string {
  const batch = worstBatch(silo, metric, now)
  if (!batch) {
    return '#e2e8f0'
  }
  return metricInfo[metric].color(metricValue(batch, metric, now))
}

export type SiloAlert = {
  batchId: string
  kind: 'temperature' | 'expiry' | 'protein'
  severity: 'critical' | 'warning'
  message: string
}

export function batchAlerts(batch: Batch, now: Date): SiloAlert[] {
  const alerts: SiloAlert[] = []

  if (batch.temperatureC > tempLimitC) {
    alerts.push({
      batchId: batch.id,
      kind: 'temperature',
      severity: 'critical',
      message: `${batch.id} at ${batch.temperatureC.toFixed(1)}°C — above the ${tempLimitC}°C limit`,
    })
  }

  const daysLeft = batchDaysToExpiry(batch, now)
  if (daysLeft < 0) {
    alerts.push({
      batchId: batch.id,
      kind: 'expiry',
      severity: 'critical',
      message: `${batch.id} expired ${Math.abs(daysLeft)}d ago — remove from rotation`,
    })
  } else if (daysLeft <= expiryWarningDays) {
    alerts.push({
      batchId: batch.id,
      kind: 'expiry',
      severity: 'critical',
      message: `${batch.id} expires in ${daysLeft}d — turn or process now`,
    })
  } else if (daysLeft <= expiryWarningDays * 2) {
    alerts.push({
      batchId: batch.id,
      kind: 'expiry',
      severity: 'warning',
      message: `${batch.id} expires in ${daysLeft}d — schedule processing`,
    })
  }

  if (batch.proteinPct < proteinLow || batch.proteinPct > proteinHigh) {
    alerts.push({
      batchId: batch.id,
      kind: 'protein',
      severity: 'warning',
      message: `${batch.id} protein ${batch.proteinPct.toFixed(1)}% — outside ${proteinLow}–${proteinHigh}% target`,
    })
  }

  return alerts
}

export function siloAlerts(silo: Silo, now: Date): SiloAlert[] {
  return silo.batches.flatMap((batch) => batchAlerts(batch, now))
}
