import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react'
import { ActionButton, Panel, Screen } from '../components/design-system'
import { SiloDetailPanel } from '../components/SiloDetailPanel'
import { SiloScene } from '../components/SiloScene'
import { MetricLegend, SiloMetricToggle } from '../components/SiloMetricToggle'
import type { MetricKey } from '../data/siloTypes'
import { metricKeys } from '../lib/colorScales'
import { useSiloTelemetry } from '../lib/useSiloTelemetry'
import { cn } from '../lib/utils'

const DEFAULT_METRIC: MetricKey = 'age'

type PageState = {
  selectedSiloId: string | null
  activeMetric: MetricKey
}

function isMetricKey(value: string | null): value is MetricKey {
  return value !== null && (metricKeys as string[]).includes(value)
}

function readPageState(): PageState {
  const params = new URLSearchParams(window.location.search)
  const metric = params.get('metric')
  return {
    selectedSiloId: params.get('silo'),
    activeMetric: isMetricKey(metric) ? metric : DEFAULT_METRIC,
  }
}

function writePageState(state: PageState, mode: 'push' | 'replace') {
  const params = new URLSearchParams(window.location.search)
  if (state.selectedSiloId) {
    params.set('silo', state.selectedSiloId)
  } else {
    params.delete('silo')
  }
  if (state.activeMetric !== DEFAULT_METRIC) {
    params.set('metric', state.activeMetric)
  } else {
    params.delete('metric')
  }
  const query = params.toString()
  const url = `${window.location.pathname}${query ? `?${query}` : ''}`
  if (mode === 'push') {
    window.history.pushState(null, '', url)
  } else {
    window.history.replaceState(null, '', url)
  }
}

/**
 * Page state is exactly { selectedSiloId, activeMetric }, mirrored to
 * ?silo=…&metric=… so views are deep-linkable. Silo selection pushes a
 * history entry (browser back zooms out); metric changes replace.
 */
function useSiloPageState() {
  const [state, setState] = useState<PageState>(readPageState)

  useEffect(() => {
    const handlePopState = () => setState(readPageState())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const urlState = readPageState()
    if (urlState.selectedSiloId === state.selectedSiloId && urlState.activeMetric === state.activeMetric) {
      return
    }
    writePageState(state, urlState.selectedSiloId !== state.selectedSiloId ? 'push' : 'replace')
  }, [state])

  const selectSilo = useCallback((selectedSiloId: string | null) => {
    setState((prev) => (prev.selectedSiloId === selectedSiloId ? prev : { ...prev, selectedSiloId }))
  }, [])

  const setMetric = useCallback((activeMetric: MetricKey) => {
    setState((prev) => (prev.activeMetric === activeMetric ? prev : { ...prev, activeMetric }))
  }, [])

  return { ...state, selectSilo, setMetric }
}

export function SmartSiloDashboard() {
  const { selectedSiloId, activeMetric, selectSilo, setMetric } = useSiloPageState()
  const { data: telemetry, isError, isFetching, refetch } = useSiloTelemetry()
  const mapWorkspaceRef = useRef<HTMLDivElement | null>(null)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)

  const now = telemetry ? new Date(telemetry.generatedAt) : new Date()
  const selectedSilo = telemetry?.silos.find((silo) => silo.id === selectedSiloId) ?? null

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsMapFullscreen(document.fullscreenElement === mapWorkspaceRef.current)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMapFullscreen(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const toggleMapFullscreen = useCallback(async () => {
    const workspace = mapWorkspaceRef.current
    if (!workspace) {
      return
    }

    if (isMapFullscreen) {
      setIsMapFullscreen(false)
      if (document.fullscreenElement === workspace) {
        await document.exitFullscreen().catch(() => undefined)
      }
      return
    }

    setIsMapFullscreen(true)
    if (document.fullscreenEnabled && workspace.requestFullscreen) {
      await workspace.requestFullscreen().catch(() => undefined)
    }
  }, [isMapFullscreen])

  // Deep links with an unknown silo id fall back to the overview.
  useEffect(() => {
    if (telemetry && selectedSiloId && !telemetry.silos.some((silo) => silo.id === selectedSiloId)) {
      selectSilo(null)
    }
  }, [telemetry, selectedSiloId, selectSilo])

  return (
    <Screen className="gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-[24px] font-semibold leading-tight text-slate-950">Smart Silo Command Map</h1>
          <p className="mt-1 max-w-4xl truncate text-sm leading-5 text-slate-500">
            National silo intelligence over Sudan with live transfer corridors, selected risk layers, and batch-level IoT exceptions.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
          {telemetry ? (
            <span className="text-xs text-slate-500">
              {isFetching ? 'Refreshing…' : `Updated ${new Date(telemetry.generatedAt).toLocaleTimeString('en-GB')}`}
            </span>
          ) : null}
          {selectedSiloId ? (
            <ActionButton variant="secondary" onClick={() => selectSilo(null)}>
              <RotateCcw className="size-4" />
              Back to overview
            </ActionButton>
          ) : null}
        </div>
      </div>

      <div className={cn('grid min-w-0 items-start gap-4', selectedSilo && '2xl:grid-cols-[minmax(0,1fr)_380px]')}>
        <div ref={mapWorkspaceRef} className={cn('silo-map-workspace min-w-0', isMapFullscreen && 'is-map-expanded')}>
          <Panel className="silo-map-panel min-w-0 overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-white/82 px-3 py-2.5">
              <div className="grid items-center gap-2 lg:grid-cols-[minmax(220px,1fr)_auto_auto] 2xl:grid-cols-[minmax(250px,1fr)_auto_minmax(260px,380px)_auto]">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Sudan digital twin command map</p>
                  <p className="mt-0.5 max-w-2xl truncate text-sm leading-5 text-slate-600">
                    Port intake, reserve stock, mill feed, and regional distribution silos on one operational surface.
                  </p>
                </div>
                <SiloMetricToggle metric={activeMetric} onMetricChange={setMetric} />
                <div className="hidden 2xl:block">
                  <MetricLegend metric={activeMetric} />
                </div>
                <ActionButton
                  variant="secondary"
                  className="h-10 whitespace-nowrap px-3"
                  onClick={toggleMapFullscreen}
                  ariaLabel={isMapFullscreen ? 'Exit fullscreen map' : 'Open fullscreen map'}
                  ariaPressed={isMapFullscreen}
                >
                  {isMapFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                  <span className="hidden sm:inline">{isMapFullscreen ? 'Exit fullscreen' : 'Fullscreen map'}</span>
                  <span className="sm:hidden">{isMapFullscreen ? 'Exit' : 'Full'}</span>
                </ActionButton>
              </div>
            </div>
            <div className="silo-map-body p-3">
              {telemetry ? (
                <SiloScene
                  silos={telemetry.silos}
                  metric={activeMetric}
                  now={now}
                  selectedSiloId={selectedSiloId}
                  onSelectSilo={selectSilo}
                />
              ) : isError ? (
                <div className="grid aspect-video w-full place-items-center">
                  <div className="text-center">
                    <p className="text-sm text-slate-600">Telemetry unavailable.</p>
                    <ActionButton variant="secondary" className="mt-3" onClick={() => refetch()}>
                      Retry
                    </ActionButton>
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full animate-pulse bg-slate-100" aria-label="Loading silo telemetry" />
              )}
            </div>
          </Panel>
          {isMapFullscreen && selectedSilo ? (
            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-30 h-[54vh] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-[92px] sm:h-auto sm:w-[min(390px,calc(100vw-48px))]">
              <SiloDetailPanel
                silo={selectedSilo}
                metric={activeMetric}
                now={now}
                onClose={() => selectSilo(null)}
                variant="overlay"
              />
            </div>
          ) : null}
        </div>

        {selectedSilo && !isMapFullscreen ? (
          <SiloDetailPanel silo={selectedSilo} metric={activeMetric} now={now} onClose={() => selectSilo(null)} />
        ) : null}
      </div>
    </Screen>
  )
}
