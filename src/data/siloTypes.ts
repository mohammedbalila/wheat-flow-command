export type MetricKey = 'age' | 'temperature' | 'protein' | 'expiry'

export type Batch = {
  id: string
  storedDate: string
  expiryDate: string
  temperatureC: number
  proteinPct: number
  tons: number
}

export type TempReading = {
  time: string
  temperatureC: number
}

export type Silo = {
  id: string
  name: string
  site: string
  capacityTons: number
  fillPct: number
  batches: Batch[]
  tempHistory24h: TempReading[]
}

export type SiloTelemetry = {
  generatedAt: string
  silos: Silo[]
}

export type SiloThresholds = {
  tempLimitC: number
  expiryWarningDays: number
  ageWarningDays: number
  proteinTargetRange: readonly [number, number]
}

export const siloThresholds = {
  tempLimitC: 32,
  expiryWarningDays: 7,
  ageWarningDays: 60,
  proteinTargetRange: [11.0, 12.5],
} as const satisfies SiloThresholds
