import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import type { MetricKey } from '../data/siloTypes'
import { legendGradient, metricInfo, metricKeys } from '../lib/colorScales'
import { cn } from '../lib/utils'

export function SiloMetricToggle({
  metric,
  onMetricChange,
}: {
  metric: MetricKey
  onMetricChange: (metric: MetricKey) => void
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % metricKeys.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + metricKeys.length) % metricKeys.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = metricKeys.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    onMetricChange(metricKeys[nextIndex])
    buttonRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Heat map metric"
      className="flex flex-wrap gap-1 rounded-[8px] border border-slate-200 bg-slate-50 p-1"
    >
      {metricKeys.map((key, index) => (
        <button
          key={key}
          ref={(element) => {
            buttonRefs.current[index] = element
          }}
          type="button"
          role="radio"
          aria-checked={key === metric}
          tabIndex={key === metric ? 0 : -1}
          onClick={() => onMetricChange(key)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={cn(
            'rounded-[7px] px-3 py-1.5 text-xs font-semibold transition',
            key === metric ? 'bg-[#0b2d4d] text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-950',
          )}
        >
          {metricInfo[key].label}
        </button>
      ))}
    </div>
  )
}

export function MetricLegend({ metric }: { metric: MetricKey }) {
  const info = metricInfo[metric]
  const [min, max] = info.domain

  return (
    <div className="min-w-[260px] flex-1 rounded-[8px] border border-slate-200 bg-white/80 px-3 py-2">
      <p className="text-xs leading-5 text-slate-500">{info.legendTitle}</p>
      <div className="mt-2 h-2.5 rounded-full" style={{ background: legendGradient(metric) }} />
      <div className="relative mt-1 h-4 text-[10px] font-medium text-slate-500" dir="ltr">
        {info.ticks.map((tick) => {
          const offset = ((tick.value - min) / (max - min)) * 100
          return (
            <span
              key={tick.label}
              className={cn(
                'absolute whitespace-nowrap',
                offset <= 2 ? '' : offset >= 98 ? '-translate-x-full' : '-translate-x-1/2',
              )}
              style={{ left: `${offset}%` }}
            >
              {tick.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
