import { useLayoutEffect, useMemo, useRef } from 'react'
import { animate, motion, useReducedMotion } from 'framer-motion'
import { interpolateObject } from 'd3-interpolate'
import type { MetricKey, Silo } from '../data/siloTypes'
import { metricInfo, siloAlerts, siloMetricColor, worstBatch } from '../lib/colorScales'
import {
  OVERVIEW_VIEWBOX,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  SILO_TOTAL_HEIGHT,
  siloAnchor,
  siloViewBox,
  viewBoxToString,
  type ViewBox,
} from '../lib/siloLayout'
import { formatNumber } from '../lib/utils'
import { SiloGlyph } from './SiloGlyph'

const ZOOM_DURATION_S = 0.6

const SUDAN_BOUNDARY_PATH = 'M 207 469 L 210 456 L 209 451 L 203 451 L 195 442 L 197 426 L 192 427 L 189 411 L 191 406 L 182 401 L 172 405 L 168 399 L 173 388 L 185 379 L 177 362 L 195 349 L 188 334 L 200 328 L 199 322 L 210 309 L 208 297 L 215 291 L 248 290 L 248 131 L 286 131 L 286 57 L 519 57 L 525 48 L 528 50 L 526 57 L 591 57 L 605 67 L 621 65 L 624 57 L 728 57 L 729 69 L 744 92 L 742 93 L 737 86 L 741 110 L 742 147 L 749 173 L 753 179 L 758 178 L 767 184 L 775 190 L 776 196 L 781 194 L 778 197 L 785 197 L 792 205 L 779 223 L 771 222 L 751 231 L 748 241 L 732 240 L 728 261 L 731 269 L 711 312 L 715 344 L 710 369 L 701 390 L 700 402 L 684 404 L 670 428 L 661 435 L 657 469 L 652 476 L 649 477 L 643 470 L 632 482 L 633 495 L 624 523 L 617 522 L 620 508 L 618 496 L 598 479 L 589 475 L 587 443 L 592 421 L 574 420 L 575 428 L 550 429 L 560 440 L 563 463 L 516 512 L 501 513 L 473 493 L 458 501 L 453 512 L 432 520 L 429 528 L 400 528 L 394 518 L 364 518 L 347 522 L 320 496 L 317 487 L 289 492 L 285 504 L 279 510 L 279 521 L 270 544 L 253 552 L 230 550 L 233 541 L 228 539 L 235 530 L 236 508 L 207 469 Z M 743 99 L 742 103 L 743 99 Z'

const cityLabels = [
  { label: 'Port Sudan', x: 740, y: 140, anchor: 'start' },
  { label: 'Kassala', x: 712, y: 300, anchor: 'start' },
  { label: 'Gedaref', x: 676, y: 356, anchor: 'start' },
  { label: 'Khartoum', x: 568, y: 300, anchor: 'start' },
  { label: 'Omdurman', x: 526, y: 320, anchor: 'end' },
  { label: 'Jayli', x: 604, y: 262, anchor: 'start' },
] as const

const routes = [
  { id: 'port-khartoum', label: 'Port Sudan to Khartoum', d: 'M 724 162 C 692 214 636 254 568 300', tone: '#38d5ff' },
  { id: 'port-kassala', label: 'Port Sudan to Kassala', d: 'M 724 162 C 733 220 728 270 710 300', tone: '#7dd3fc' },
  { id: 'kassala-gedaref', label: 'Kassala to Gedaref', d: 'M 710 300 C 694 323 681 344 674 356', tone: '#f59e0b' },
  { id: 'khartoum-omdurman', label: 'Khartoum to Omdurman', d: 'M 568 300 C 558 304 543 314 526 320', tone: '#f97316' },
  { id: 'khartoum-jayli', label: 'Khartoum to Jayli', d: 'M 568 300 C 579 282 590 270 604 262', tone: '#f59e0b' },
  { id: 'khartoum-bahri', label: 'Khartoum to Bahri', d: 'M 568 300 C 582 310 598 322 616 324', tone: '#f97316' },
] as const

function siloStoredTons(silo: Silo) {
  return silo.batches.reduce((total, batch) => total + batch.tons, 0)
}

function siloAverageTemp(silo: Silo) {
  return silo.batches.reduce((total, batch) => total + batch.temperatureC, 0) / silo.batches.length
}

function buildCommandSummary(silos: Silo[], metric: MetricKey, now: Date) {
  const totalInventory = silos.reduce((total, silo) => total + siloStoredTons(silo), 0)
  const alertEntries = silos.map((silo) => ({
    silo,
    alerts: siloAlerts(silo, now),
    worstBatch: worstBatch(silo, metric, now),
  }))
  const criticalSilos = alertEntries.filter((entry) => entry.alerts.some((alert) => alert.severity === 'critical')).length
  const averageTemp = silos.reduce((total, silo) => total + siloAverageTemp(silo), 0) / silos.length
  const nextEntry = alertEntries
    .filter((entry) => entry.alerts.length > 0)
    .sort((a, b) => {
      const aCritical = a.alerts.filter((alert) => alert.severity === 'critical').length
      const bCritical = b.alerts.filter((alert) => alert.severity === 'critical').length
      return bCritical - aCritical || b.alerts.length - a.alerts.length
    })[0]

  return {
    totalInventory,
    criticalSilos,
    averageTemp,
    nextEntry,
  }
}

function MapStat({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string
  value: string
  detail: string
  tone?: 'neutral' | 'risk' | 'live'
}) {
  const toneClass = {
    neutral: 'border-white/12 bg-white/[0.075] text-white',
    risk: 'border-red-300/25 bg-red-500/12 text-red-50',
    live: 'border-cyan-300/25 bg-cyan-400/12 text-cyan-50',
  }[tone]

  return (
    <div className={`min-w-[132px] rounded-[8px] border px-3 py-2 shadow-[0_14px_34px_rgba(0,0,0,.24)] backdrop-blur-md ${toneClass}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/58">{label}</p>
      <p className="mt-1 text-[18px] font-semibold leading-none">{value}</p>
      <p className="mt-1 truncate text-[11px] text-white/56">{detail}</p>
    </div>
  )
}

export function SiloScene({
  silos,
  metric,
  now,
  selectedSiloId,
  onSelectSilo,
}: {
  silos: Silo[]
  metric: MetricKey
  now: Date
  selectedSiloId: string | null
  onSelectSilo: (siloId: string | null) => void
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const currentViewBox = useRef<ViewBox>({ ...OVERVIEW_VIEWBOX })
  const isFirstRender = useRef(true)
  const reduceMotion = useReducedMotion()
  const selectedIndex = silos.findIndex((silo) => silo.id === selectedSiloId)
  const selectedSilo = silos[selectedIndex] ?? null
  const summary = useMemo(() => buildCommandSummary(silos, metric, now), [silos, metric, now])
  const activeMode = metricInfo[metric]
  const nextAlert = summary.nextEntry?.alerts[0]
  const nextBatch = summary.nextEntry?.worstBatch

  // The viewBox is tweened imperatively (it is an attribute, not a CSS
  // property) and always derived from the selected silo, never stored.
  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) {
      return
    }

    const target = selectedIndex >= 0 ? siloViewBox(selectedIndex) : OVERVIEW_VIEWBOX
    const apply = (viewBox: ViewBox) => {
      currentViewBox.current = viewBox
      svg.setAttribute('viewBox', viewBoxToString(viewBox))
    }

    if (isFirstRender.current || reduceMotion) {
      isFirstRender.current = false
      apply(target)
      return
    }

    const interpolate = interpolateObject({ ...currentViewBox.current }, { ...target })
    const controls = animate(0, 1, {
      duration: ZOOM_DURATION_S,
      ease: 'easeInOut',
      onUpdate: (progress) => apply(interpolate(progress) as ViewBox),
    })
    return () => controls.stop()
  }, [selectedIndex, reduceMotion])

  return (
    <div className="silo-scene-surface relative overflow-hidden rounded-[8px] bg-[#061527] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
      <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <MapStat label="National stock" value={`${formatNumber(summary.totalInventory)}t`} detail="Live silo inventory" />
          <MapStat label="Critical silos" value={String(summary.criticalSilos)} detail="Act-now exceptions" tone={summary.criticalSilos > 0 ? 'risk' : 'live'} />
          <MapStat label="Avg grain temp" value={`${summary.averageTemp.toFixed(1)}°C`} detail="Batch-weighted view" tone="live" />
        </div>
        <div className="hidden max-w-[340px] rounded-[8px] border border-white/12 bg-[#071b2f]/78 px-3 py-2 text-right text-white shadow-[0_14px_34px_rgba(0,0,0,.24)] backdrop-blur-md lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100/62">Active intelligence layer</p>
          <p className="mt-1 text-sm font-semibold">{activeMode.label}</p>
          <p className="mt-1 text-[11px] leading-4 text-white/56">{activeMode.legendTitle}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="rounded-[8px] border border-white/12 bg-[#071b2f]/82 px-3 py-2 text-white shadow-[0_14px_34px_rgba(0,0,0,.24)] backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/54">Critical path</p>
          <p className="mt-1 truncate text-sm font-semibold">
            {summary.nextEntry && nextAlert
              ? `${summary.nextEntry.silo.id} ${summary.nextEntry.silo.site} · ${nextAlert.message}`
              : 'All silo exceptions are inside control thresholds.'}
          </p>
          <p className="mt-1 truncate text-[11px] text-white/52">
            {nextBatch ? `${nextBatch.id} / ${formatNumber(nextBatch.tons)}t linked to Jayli and Khartoum allocation planning` : 'No urgent transfer recommendation.'}
          </p>
        </div>
        <div className="hidden rounded-[8px] border border-emerald-300/20 bg-emerald-400/12 px-3 py-2 text-emerald-50 shadow-[0_14px_34px_rgba(0,0,0,.24)] backdrop-blur-md md:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100/66">Corridors live</p>
          <p className="mt-1 text-sm font-semibold">{routes.length} active</p>
          <p className="mt-1 text-[11px] text-emerald-50/58">Port intake to mill feed</p>
        </div>
      </div>

    <svg
      ref={svgRef}
      viewBox={viewBoxToString(OVERVIEW_VIEWBOX)}
      preserveAspectRatio="xMidYMid meet"
      className="block h-[clamp(400px,calc(100svh-315px),600px)] w-full"
      role="group"
      aria-label="Sudan smart silo network map. Select a silo to inspect its batches."
      onClick={() => onSelectSilo(null)}
    >
      <defs>
        <radialGradient id="silo-map-vignette" cx="54%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#123452" />
          <stop offset="58%" stopColor="#071b2f" />
          <stop offset="100%" stopColor="#04111f" />
        </radialGradient>
        <linearGradient id="silo-map-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#071b2f" />
          <stop offset="100%" stopColor="#04111f" />
        </linearGradient>
        <linearGradient id="sudan-land" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#153b38" />
          <stop offset="100%" stopColor="#092528" />
        </linearGradient>
        <linearGradient id="red-sea" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0c4f73" />
          <stop offset="100%" stopColor="#06293e" />
        </linearGradient>
        <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 H 0 V 40" fill="none" stroke="rgba(148,163,184,.08)" strokeWidth="1" />
        </pattern>
        <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000000" floodOpacity="0.42" />
        </filter>
        <filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.8" floodColor="#38d5ff" floodOpacity="0.34" />
        </filter>
        <clipPath id="sudan-clip">
          <path d={SUDAN_BOUNDARY_PATH} />
        </clipPath>
      </defs>

      <rect x="0" y="0" width={SCENE_WIDTH} height={SCENE_HEIGHT} fill="url(#silo-map-bg)" />
      <rect x="0" y="0" width={SCENE_WIDTH} height={SCENE_HEIGHT} fill="url(#silo-map-vignette)" opacity="0.82" />
      <rect x="0" y="0" width={SCENE_WIDTH} height={SCENE_HEIGHT} fill="url(#map-grid)" />

      <path
        d="M 735 0 C 750 56 760 108 785 160 C 820 234 826 318 792 394 C 762 462 765 536 722 600 L 960 600 L 960 0 Z"
        fill="url(#red-sea)"
      />

      <g filter="url(#map-shadow)">
        <path d={SUDAN_BOUNDARY_PATH} fill="url(#sudan-land)" stroke="#5f7f76" strokeWidth="2" />
      </g>
      <path d={SUDAN_BOUNDARY_PATH} fill="none" stroke="rgba(226,232,240,.12)" strokeWidth="7" />

      <g clipPath="url(#sudan-clip)" opacity="0.8">
        <path
          d="M 518 58 C 512 118 536 176 552 232 C 560 260 566 280 568 300 C 558 338 536 386 508 446 C 498 470 492 496 490 520"
          fill="none"
          stroke="#48bfe3"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.58"
        />
        <path
          d="M 606 425 C 592 380 580 336 568 300"
          fill="none"
          stroke="#48bfe3"
          strokeLinecap="round"
          strokeWidth="4"
          opacity="0.46"
        />
        <path
          d="M 678 356 C 636 340 596 318 568 300"
          fill="none"
          stroke="#48bfe3"
          strokeLinecap="round"
          strokeWidth="4"
          opacity="0.46"
        />

        {routes.map((route) => (
          <g key={route.id}>
            <path
              d={route.d}
              fill="none"
              stroke="rgba(255,255,255,.16)"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d={route.d}
              fill="none"
              stroke="#b46b35"
              strokeDasharray="9 9"
              strokeLinecap="round"
              strokeWidth="2.2"
              opacity="0.7"
            />
            <motion.path
              d={route.d}
              fill="none"
              stroke={route.tone}
              strokeDasharray="22 110"
              strokeLinecap="round"
              strokeWidth="3.2"
              filter="url(#route-glow)"
              initial={false}
              animate={reduceMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -132] }}
              transition={{ duration: 3.4, ease: 'linear', repeat: Infinity }}
              opacity="0.94"
            />
          </g>
        ))}
      </g>

      <g pointerEvents="none">
        <text x="392" y="240" className="fill-white text-[38px] font-semibold" opacity="0.07">
          SUDAN
        </text>
        <text x="842" y="270" className="fill-cyan-100 text-[13px] font-semibold" opacity="0.55" transform="rotate(72 842 270)">
          Red Sea
        </text>
        <text x="502" y="176" className="fill-cyan-100 text-[10px] font-semibold" opacity="0.44" transform="rotate(72 502 176)">
          Nile corridor
        </text>
      </g>

      <g pointerEvents="none">
        {cityLabels.map((city) => (
          <g key={city.label}>
            <circle cx={city.x} cy={city.y} r="3.5" fill="#38d5ff" stroke="#04111f" strokeWidth="1.5" />
            <text
              x={city.anchor === 'end' ? city.x - 8 : city.x + 8}
              y={city.y - 7}
              textAnchor={city.anchor}
              className="fill-slate-100 text-[11px] font-semibold"
              stroke="rgba(4,17,31,.86)"
              strokeWidth="3"
              style={{ paintOrder: 'stroke' }}
            >
              {city.label}
            </text>
          </g>
        ))}
      </g>

      {silos.map((silo, index) => {
        const anchor = siloAnchor(index)
        const alerts = siloAlerts(silo, now)
        const color = selectedSilo?.id === silo.id ? '#38d5ff' : alerts.length > 0 ? '#f97316' : siloMetricColor(silo, metric, now)
        const centerY = anchor.groundY - SILO_TOTAL_HEIGHT / 2
        if (alerts.length === 0 && selectedSilo?.id !== silo.id) {
          return null
        }
        return (
          <g key={`pulse-${silo.id}`} pointerEvents="none">
            <motion.circle
              cx={anchor.x}
              cy={centerY}
              r="18"
              fill="none"
              stroke={color}
              strokeWidth="2"
              initial={false}
              animate={reduceMotion ? { opacity: 0.34, r: 18 } : { opacity: [0.42, 0], r: [18, 42] }}
              transition={{ duration: 2.4, ease: 'easeOut', repeat: Infinity, delay: index * 0.18 }}
            />
            <circle cx={anchor.x} cy={centerY} r="6" fill={color} opacity="0.32" />
          </g>
        )
      })}

      {silos.map((silo, index) => (
        <SiloGlyph
          key={silo.id}
          silo={silo}
          index={index}
          metric={metric}
          now={now}
          selected={silo.id === selectedSiloId}
          dimmed={selectedSiloId !== null && silo.id !== selectedSiloId}
          onSelect={(siloId) => onSelectSilo(siloId)}
        />
      ))}
    </svg>
    </div>
  )
}
