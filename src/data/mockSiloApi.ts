import type { Batch, Silo, SiloTelemetry, TempReading } from './siloTypes'

/**
 * Single seam for the future IoT backend: implement SiloApi against the real
 * service and re-point `siloApi` — nothing outside this file changes.
 */
export interface SiloApi {
  fetchTelemetry(): Promise<SiloTelemetry>
}

const DAY_MS = 86_400_000
const HISTORY_POINTS = 48
const HISTORY_STEP_MS = 30 * 60 * 1000
const FETCH_LATENCY_MS = 220
const TEMP_FLOOR_C = 23
const TEMP_CEILING_C = 38

type SiloSeed = {
  id: string
  name: string
  site: string
  capacityTons: number
  fillPct: number
  batchCount: number
  meanTempC: number
  ageRangeDays: readonly [number, number]
  proteinBase: number
  /** Force the oldest batch to expire this many days from now (demo breach). */
  oldestExpiresInDays?: number
}

const siloSeeds: SiloSeed[] = [
  { id: 'S1', name: 'Terminal Silo S1', site: 'Port Sudan Terminal A', capacityTons: 24000, fillPct: 78, batchCount: 4, meanTempC: 27.5, ageRangeDays: [10, 45], proteinBase: 12.0 },
  { id: 'S2', name: 'Terminal Silo S2', site: 'Port Sudan Terminal B', capacityTons: 18000, fillPct: 64, batchCount: 5, meanTempC: 29.5, ageRangeDays: [20, 70], proteinBase: 11.4 },
  { id: 'S3', name: 'Reserve Silo S3', site: 'Khartoum Strategic Reserve', capacityTons: 20000, fillPct: 82, batchCount: 6, meanTempC: 30.5, ageRangeDays: [30, 95], proteinBase: 11.6, oldestExpiresInDays: 9 },
  { id: 'S4', name: 'Buffer Silo S4', site: 'Omdurman Buffer Yard', capacityTons: 9000, fillPct: 55, batchCount: 3, meanTempC: 31.0, ageRangeDays: [40, 80], proteinBase: 10.6 },
  { id: 'S5', name: 'Mill Feed Silo S5', site: 'Jayli Factory', capacityTons: 11500, fillPct: 91, batchCount: 4, meanTempC: 33.8, ageRangeDays: [50, 75], proteinBase: 11.1 },
  { id: 'S6', name: 'Mill Silo S6', site: 'Bahri Mill', capacityTons: 15000, fillPct: 42, batchCount: 3, meanTempC: 26.8, ageRangeDays: [5, 25], proteinBase: 12.7 },
  { id: 'S7', name: 'Distribution Silo S7', site: 'Kassala Distribution Center', capacityTons: 9500, fillPct: 68, batchCount: 4, meanTempC: 28.6, ageRangeDays: [15, 55], proteinBase: 11.9 },
  { id: 'S8', name: 'Rural Supply Silo S8', site: 'Gedaref Rural Supply', capacityTons: 8200, fillPct: 37, batchCount: 5, meanTempC: 30.2, ageRangeDays: [60, 120], proteinBase: 10.9, oldestExpiresInDays: 4 },
]

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(20260708)

function round1(value: number) {
  return Math.round(value * 10) / 10
}

function buildHistory(meanTempC: number, now: number): TempReading[] {
  const readings: TempReading[] = []
  let temp = meanTempC + (rand() - 0.5) * 1.4
  for (let i = HISTORY_POINTS - 1; i >= 0; i -= 1) {
    temp += (meanTempC - temp) * 0.12 + (rand() - 0.5) * 0.5
    readings.push({
      time: new Date(now - i * HISTORY_STEP_MS).toISOString(),
      temperatureC: round1(temp),
    })
  }
  return readings
}

function buildSilo(seed: SiloSeed, now: number): Silo {
  const [minAge, maxAge] = seed.ageRangeDays
  const targetTons = seed.capacityTons * (seed.fillPct / 100)
  const weights = Array.from({ length: seed.batchCount }, () => 0.6 + rand())
  const weightTotal = weights.reduce((total, weight) => total + weight, 0)

  const batches: Batch[] = weights.map((weight, index) => {
    // Oldest batch first; ages spread across the seed range with jitter.
    const ageProgress = seed.batchCount === 1 ? 0 : index / (seed.batchCount - 1)
    const ageDays = maxAge - (maxAge - minAge) * ageProgress + (rand() - 0.5) * 6
    const storedAt = now - ageDays * DAY_MS
    const shelfLifeDays = 165 + rand() * 45
    const expiresAt =
      index === 0 && seed.oldestExpiresInDays !== undefined
        ? now + seed.oldestExpiresInDays * DAY_MS
        : storedAt + shelfLifeDays * DAY_MS

    return {
      id: `${seed.id}-B${index + 1}`,
      storedDate: new Date(storedAt).toISOString(),
      expiryDate: new Date(expiresAt).toISOString(),
      temperatureC: round1(seed.meanTempC + (rand() - 0.5) * 2.2),
      proteinPct: round1(seed.proteinBase + (rand() - 0.5) * 0.8),
      tons: Math.round((targetTons * weight) / weightTotal),
    }
  })

  const storedTons = batches.reduce((total, batch) => total + batch.tons, 0)

  return {
    id: seed.id,
    name: seed.name,
    site: seed.site,
    capacityTons: seed.capacityTons,
    fillPct: Math.round((storedTons / seed.capacityTons) * 100),
    batches,
    tempHistory24h: buildHistory(seed.meanTempC, now),
  }
}

const walkTargets = new Map(siloSeeds.map((seed) => [seed.id, seed.meanTempC]))

const state: SiloTelemetry = {
  generatedAt: new Date().toISOString(),
  silos: siloSeeds.map((seed) => buildSilo(seed, Date.now())),
}

/** Mean-reverting bounded random walk so refetches visibly move the UI. */
function advanceRandomWalk(telemetry: SiloTelemetry, now: number) {
  for (const silo of telemetry.silos) {
    const target = walkTargets.get(silo.id) ?? silo.batches[0]?.temperatureC ?? 28
    for (const batch of silo.batches) {
      const next = batch.temperatureC + (target - batch.temperatureC) * 0.05 + (rand() - 0.5) * 0.7
      batch.temperatureC = round1(Math.min(Math.max(next, TEMP_FLOOR_C), TEMP_CEILING_C))
    }
    const siloTemp = silo.batches.reduce((total, batch) => total + batch.temperatureC, 0) / silo.batches.length
    silo.tempHistory24h.push({ time: new Date(now).toISOString(), temperatureC: round1(siloTemp) })
    if (silo.tempHistory24h.length > HISTORY_POINTS) {
      silo.tempHistory24h.splice(0, silo.tempHistory24h.length - HISTORY_POINTS)
    }
  }
}

export const mockSiloApi: SiloApi = {
  async fetchTelemetry() {
    await new Promise((resolve) => setTimeout(resolve, FETCH_LATENCY_MS))
    const now = Date.now()
    advanceRandomWalk(state, now)
    state.generatedAt = new Date(now).toISOString()
    return structuredClone(state)
  },
}

export const siloApi: SiloApi = mockSiloApi
