import type { Batch } from '../data/siloTypes'

export type ViewBox = {
  x: number
  y: number
  width: number
  height: number
}

export type StratumRect = {
  batch: Batch
  x: number
  y: number
  width: number
  height: number
}

export type SiloAnchor = {
  /** Horizontal center of the silo. */
  x: number
  /** Where the silo skirt meets the ground. */
  groundY: number
}

export const SCENE_WIDTH = 960
export const SCENE_HEIGHT = 600
export const SCENE_COLS = 4
export const SCENE_ROWS = 2

export const OVERVIEW_VIEWBOX: ViewBox = { x: 0, y: 0, width: SCENE_WIDTH, height: SCENE_HEIGHT }

// Elevation-view silo dimensions (a standing grain bin, not a top-down disc).
// Kept compact so each asset reads as a map marker first, then as a silo on zoom.
export const SILO_BODY_WIDTH = 30
export const SILO_BODY_HEIGHT = 54
export const SILO_ROOF_HEIGHT = 14
export const SILO_ROOF_EAVE = 4
export const SILO_SKIRT_HEIGHT = 6
export const SILO_TOTAL_HEIGHT = SILO_ROOF_HEIGHT + SILO_BODY_HEIGHT + SILO_SKIRT_HEIGHT

const ROW_GROUND_Y = [236, 494] as const
const COLUMN_WIDTH = SCENE_WIDTH / SCENE_COLS
const YARD_PAD_ABOVE_ROOF = 26
const YARD_PAD_BELOW_GROUND = 40

const ZOOM_PAD_X = 116
const ZOOM_PAD_TOP = 78
const ZOOM_PAD_BOTTOM = 82

const SUDAN_SILO_ANCHORS: SiloAnchor[] = [
  { x: 716, groundY: 172 }, // Port Sudan Terminal A
  { x: 768, groundY: 190 }, // Port Sudan Terminal B
  { x: 568, groundY: 318 }, // Khartoum Strategic Reserve
  { x: 520, groundY: 342 }, // Omdurman Buffer Yard
  { x: 604, groundY: 282 }, // Jayli Factory
  { x: 616, groundY: 334 }, // Bahri Mill
  { x: 716, groundY: 326 }, // Kassala Distribution Center
  { x: 674, groundY: 396 }, // Gedaref Rural Supply
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function siloAnchor(index: number): SiloAnchor {
  const mapAnchor = SUDAN_SILO_ANCHORS[index]
  if (mapAnchor) {
    return mapAnchor
  }

  const col = index % SCENE_COLS
  const row = Math.floor(index / SCENE_COLS)
  return {
    x: COLUMN_WIDTH * (col + 0.5),
    groundY: ROW_GROUND_Y[row] ?? ROW_GROUND_Y[ROW_GROUND_Y.length - 1],
  }
}

/** Tight bounding box around the whole glyph (roof apex to skirt base). */
export function siloBounds(index: number): ViewBox {
  const anchor = siloAnchor(index)
  const halfWidth = SILO_BODY_WIDTH / 2 + SILO_ROOF_EAVE
  return {
    x: anchor.x - halfWidth,
    y: anchor.groundY - SILO_TOTAL_HEIGHT,
    width: halfWidth * 2,
    height: SILO_TOTAL_HEIGHT,
  }
}

/** The concrete pad band a given row occupies, for the yard background. */
export function siloYardBand(row: number) {
  const groundY = ROW_GROUND_Y[row]
  return {
    top: groundY - SILO_TOTAL_HEIGHT - YARD_PAD_ABOVE_ROOF,
    bottom: groundY + YARD_PAD_BELOW_GROUND,
    groundY,
  }
}

function expandToAspect(box: ViewBox, aspect: number): ViewBox {
  if (box.width / box.height >= aspect) {
    const height = box.width / aspect
    return { x: box.x, y: box.y - (height - box.height) / 2, width: box.width, height }
  }
  const width = box.height * aspect
  return { x: box.x - (width - box.width) / 2, y: box.y, width, height: box.height }
}

function clampToScene(box: ViewBox): ViewBox {
  const width = Math.min(box.width, SCENE_WIDTH)
  const height = Math.min(box.height, SCENE_HEIGHT)
  return {
    x: clamp(box.x, 0, SCENE_WIDTH - width),
    y: clamp(box.y, 0, SCENE_HEIGHT - height),
    width,
    height,
  }
}

/**
 * Zoom target for a silo: its bounding box padded for context, expanded to
 * the overview's aspect ratio (so preserveAspectRatio never letterboxes),
 * and clamped inside the scene.
 */
export function siloViewBox(index: number): ViewBox {
  const bounds = siloBounds(index)
  const padded: ViewBox = {
    x: bounds.x - ZOOM_PAD_X,
    y: bounds.y - ZOOM_PAD_TOP,
    width: bounds.width + ZOOM_PAD_X * 2,
    height: bounds.height + ZOOM_PAD_TOP + ZOOM_PAD_BOTTOM,
  }
  return clampToScene(expandToAspect(padded, SCENE_WIDTH / SCENE_HEIGHT))
}

export function viewBoxToString(viewBox: ViewBox) {
  return `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
}

/**
 * Cutaway strata for a zoomed silo: horizontal bands stacked oldest-at-bottom
 * inside the given gauge rect, band heights proportional to each batch's
 * share of stored tonnage, scaled to the silo's fill level.
 */
export function strataLayout(batches: Batch[], fillPct: number, gauge: ViewBox): StratumRect[] {
  const totalTons = batches.reduce((total, batch) => total + batch.tons, 0)
  if (totalTons <= 0) {
    return []
  }

  const stackHeight = gauge.height * clamp(fillPct, 0, 100) / 100
  const oldestFirst = [...batches].sort(
    (a, b) => new Date(a.storedDate).getTime() - new Date(b.storedDate).getTime(),
  )

  let bottom = gauge.y + gauge.height
  return oldestFirst.map((batch) => {
    const height = stackHeight * (batch.tons / totalTons)
    bottom -= height
    return { batch, x: gauge.x, y: bottom, width: gauge.width, height }
  })
}

/** A rect whose top edge bulges upward at the center, like a heap of grain. */
export function heapedRectPath(x: number, y: number, width: number, height: number, bulge: number) {
  const bottom = y + height
  const cx = x + width / 2
  return [
    `M ${x} ${bottom}`,
    `L ${x} ${y}`,
    `Q ${cx} ${y - bulge} ${x + width} ${y}`,
    `L ${x + width} ${bottom}`,
    'Z',
  ].join(' ')
}
