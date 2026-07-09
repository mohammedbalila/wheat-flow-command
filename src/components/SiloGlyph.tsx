import { motion } from 'framer-motion'
import type { MetricKey, Silo } from '../data/siloTypes'
import { metricInfo, metricValue, siloAlerts, siloMetricColor } from '../lib/colorScales'
import {
  heapedRectPath,
  siloAnchor,
  siloBounds,
  strataLayout,
  SILO_BODY_HEIGHT,
  SILO_BODY_WIDTH,
  SILO_ROOF_EAVE,
  SILO_ROOF_HEIGHT,
  SILO_SKIRT_HEIGHT,
} from '../lib/siloLayout'

const GAUGE_NARROW_WIDTH = 10
const GAUGE_WIDE_WIDTH = SILO_BODY_WIDTH - 10
const GAUGE_MARGIN_TOP = 6
const GAUGE_MARGIN_BOTTOM = 5
const MIN_LABELED_STRATUM_HEIGHT = 8
const SKIRT_WIDEN = 3
const CORRUGATION_STEP = 6
const LADDER_RUNG_STEP = 8
const RAIL_POST_STEP = 10

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function SiloGlyph({
  silo,
  index,
  metric,
  now,
  selected,
  dimmed,
  onSelect,
}: {
  silo: Silo
  index: number
  metric: MetricKey
  now: Date
  selected: boolean
  dimmed: boolean
  onSelect: (siloId: string) => void
}) {
  const anchor = siloAnchor(index)
  const bounds = siloBounds(index)
  const info = metricInfo[metric]
  const color = siloMetricColor(silo, metric, now)
  const alerts = siloAlerts(silo, now)
  const alertLabel = alerts.length === 0 ? 'no alerts' : alerts.length === 1 ? '1 alert' : `${alerts.length} alerts`

  const bodyLeft = anchor.x - SILO_BODY_WIDTH / 2
  const bodyRight = anchor.x + SILO_BODY_WIDTH / 2
  const bodyTop = anchor.groundY - SILO_SKIRT_HEIGHT - SILO_BODY_HEIGHT
  const bodyBottom = anchor.groundY - SILO_SKIRT_HEIGHT
  const apexX = anchor.x
  const apexY = bodyTop - SILO_ROOF_HEIGHT

  const gaugeTop = bodyTop + GAUGE_MARGIN_TOP
  const gaugeBottom = bodyBottom - GAUGE_MARGIN_BOTTOM
  const gaugeHeight = gaugeBottom - gaugeTop
  const gaugeWidth = selected ? GAUGE_WIDE_WIDTH : GAUGE_NARROW_WIDTH
  const gaugeX = anchor.x - gaugeWidth / 2

  const fillHeight = gaugeHeight * clamp(silo.fillPct, 0, 100) / 100
  const overviewBulge = Math.max(0, Math.min(gaugeWidth * 0.4, fillHeight * 0.7, gaugeHeight - fillHeight))
  const overviewFillPath = heapedRectPath(gaugeX, gaugeBottom - fillHeight, gaugeWidth, fillHeight, overviewBulge)

  const strata = selected
    ? strataLayout(silo.batches, silo.fillPct, { x: gaugeX, y: gaugeTop, width: gaugeWidth, height: gaugeHeight })
    : []
  const grainSurfaceY = strata.length ? strata[strata.length - 1].y : gaugeBottom

  const corrugationLines: number[] = []
  for (let lx = bodyLeft + 8; lx < bodyRight - 4; lx += CORRUGATION_STEP) {
    corrugationLines.push(lx)
  }

  const railPosts: number[] = []
  for (let px = bodyLeft + 6; px <= bodyRight - 6; px += RAIL_POST_STEP) {
    railPosts.push(px)
  }

  const ladderRungs: number[] = []
  for (let ly = bodyBottom - 6; ly > bodyTop + 6; ly -= LADDER_RUNG_STEP) {
    ladderRungs.push(ly)
  }
  const ladderX = bodyRight - 14

  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={`Silo ${silo.id}, ${silo.fillPct}% full, ${alertLabel}`}
      aria-pressed={selected}
      className="group cursor-pointer outline-none"
      style={{ transformOrigin: `${anchor.x}px ${anchor.groundY}px` }}
      initial={false}
      animate={{ opacity: dimmed ? 0.3 : 1 }}
      whileHover={{ scale: selected ? 1 : 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(silo.id)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(silo.id)
        }
      }}
    >
      <title>{`${silo.name} — ${silo.fillPct}% full, ${alertLabel}`}</title>

      {/* focus ring */}
      <rect
        x={bounds.x - 10}
        y={bounds.y - 10}
        width={bounds.width + 20}
        height={bounds.height + 20}
        rx="12"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray="4 5"
        className="opacity-0 group-focus-visible:opacity-100"
      />

      {/* ground shadow */}
      <ellipse cx={anchor.x} cy={anchor.groundY + 2} rx={SILO_BODY_WIDTH / 2 + SKIRT_WIDEN + 10} ry="6" fill="rgba(16,32,57,.16)" />

      {/* skirt */}
      <path
        d={`M ${bodyLeft} ${bodyBottom} L ${bodyLeft - SKIRT_WIDEN} ${anchor.groundY} L ${bodyRight + SKIRT_WIDEN} ${anchor.groundY} L ${bodyRight} ${bodyBottom} Z`}
        fill="#8b97a8"
        stroke="#70798a"
        strokeWidth="1"
      />

      {/* body */}
      <rect x={bodyLeft} y={bodyTop} width={SILO_BODY_WIDTH} height={SILO_BODY_HEIGHT} rx="6" fill={`url(#silo-body-${silo.id})`} stroke="#8b97a8" strokeWidth="1.5" />
      <defs>
        <linearGradient id={`silo-body-${silo.id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#9aa7b8" />
          <stop offset="48%" stopColor="#eef1f5" />
          <stop offset="100%" stopColor="#8b97a8" />
        </linearGradient>
      </defs>

      {/* corrugation + seams */}
      <g pointerEvents="none">
        {corrugationLines.map((lx) => (
          <line key={lx} x1={lx} y1={bodyTop + 2} x2={lx} y2={bodyBottom - 2} stroke="rgba(15,23,42,.08)" strokeWidth="1" />
        ))}
        <line x1={bodyLeft} y1={bodyTop + SILO_BODY_HEIGHT / 3} x2={bodyRight} y2={bodyTop + SILO_BODY_HEIGHT / 3} stroke="rgba(15,23,42,.12)" strokeWidth="1" />
        <line x1={bodyLeft} y1={bodyTop + (2 * SILO_BODY_HEIGHT) / 3} x2={bodyRight} y2={bodyTop + (2 * SILO_BODY_HEIGHT) / 3} stroke="rgba(15,23,42,.12)" strokeWidth="1" />
      </g>

      {/* ladder */}
      <g pointerEvents="none" stroke="#64748b" strokeWidth="1.25">
        <line x1={ladderX} y1={bodyBottom - 2} x2={ladderX} y2={bodyTop + 2} />
        {ladderRungs.map((ly) => (
          <line key={ly} x1={ladderX - 4} y1={ly} x2={ladderX + 4} y2={ly} />
        ))}
      </g>

      {/* guardrail at roofline */}
      <g pointerEvents="none" stroke="#64748b" strokeWidth="1.25">
        <line x1={bodyLeft - 2} y1={bodyTop} x2={bodyRight + 2} y2={bodyTop} />
        {railPosts.map((px) => (
          <line key={px} x1={px} y1={bodyTop - 6} x2={px} y2={bodyTop} />
        ))}
      </g>

      {/* roof */}
      <path
        d={`M ${bodyLeft - SILO_ROOF_EAVE} ${bodyTop} L ${apexX} ${apexY} L ${bodyRight + SILO_ROOF_EAVE} ${bodyTop} Z`}
        fill="#b8c2cf"
        stroke="#8b97a8"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx={apexX} cy={apexY} r="4" fill="#70798a" />

      {/* fill gauge (sight glass at overview, cutaway window when selected) */}
      <motion.rect
        initial={false}
        animate={{ x: gaugeX, width: gaugeWidth }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        y={gaugeTop}
        height={gaugeHeight}
        rx="3"
        fill="#eef2f7"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      <motion.path
        pointerEvents="none"
        initial={false}
        animate={{ opacity: selected ? 0 : 1, fill: color }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        d={overviewFillPath}
      />

      {selected ? (
        <motion.g pointerEvents="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.15 }}>
          {/* sensor cable threading through each batch layer */}
          <line x1={apexX} y1={apexY + 6} x2={apexX} y2={grainSurfaceY} stroke="#475569" strokeWidth="1.25" strokeDasharray="1 3" />
          {strata.map((stratum) => (
            <circle key={`node-${stratum.batch.id}`} cx={apexX} cy={stratum.y} r="2.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
          ))}

          {strata.map((stratum, strataIndex) => {
            const value = metricValue(stratum.batch, metric, now)
            const isTop = strataIndex === strata.length - 1
            const bulge = isTop
              ? Math.max(0, Math.min(gaugeWidth * 0.4, stratum.height * 0.7, stratum.y - gaugeTop))
              : 0
            return (
              <g key={stratum.batch.id}>
                <motion.path
                  initial={false}
                  animate={{ fill: info.color(value) }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  stroke="#ffffff"
                  strokeWidth="1"
                  d={isTop
                    ? heapedRectPath(stratum.x, stratum.y, stratum.width, stratum.height, bulge)
                    : `M ${stratum.x} ${stratum.y + stratum.height} L ${stratum.x} ${stratum.y} L ${stratum.x + stratum.width} ${stratum.y} L ${stratum.x + stratum.width} ${stratum.y + stratum.height} Z`}
                />
                {stratum.height >= MIN_LABELED_STRATUM_HEIGHT ? (
                  <text
                    x={apexX}
                    y={stratum.y + stratum.height / 2 + 3}
                    textAnchor="middle"
                    fontSize="8.5"
                    stroke="rgba(15,23,42,.45)"
                    strokeWidth="2"
                    style={{ paintOrder: 'stroke' }}
                    className="fill-white font-semibold"
                  >
                    {stratum.batch.id}
                  </text>
                ) : null}
              </g>
            )
          })}
        </motion.g>
      ) : null}

      {/* alert beacon */}
      {alerts.length > 0 ? (
        <g transform={`translate(${apexX + 12} ${apexY - 2})`} pointerEvents="none">
          <circle r="7.5" fill="#dc3f3f" stroke="#ffffff" strokeWidth="1.7" />
          <text textAnchor="middle" dy="2.9" fontSize="8" className="fill-white font-bold">
            {alerts.length}
          </text>
        </g>
      ) : null}

      {/* label pill */}
      <g transform={`translate(${anchor.x} ${anchor.groundY + 16})`} pointerEvents="none">
        <rect x="-26" y="-11" width="52" height="22" rx="7" fill="#ffffff" stroke="rgba(221,227,234,.92)" />
        <text textAnchor="middle" y="-1.5" className="fill-slate-950 text-[9px] font-semibold">
          {silo.id}
        </text>
        <text textAnchor="middle" y="7.5" className="fill-slate-500 text-[7.5px] font-medium">
          {silo.fillPct}% full
        </text>
      </g>
    </motion.g>
  )
}
