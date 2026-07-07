import { CheckCircle2, Clock3, MapPin, Route, ShieldCheck, Truck } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import { OtpVerificationPanel } from '../components/OtpVerificationPanel'
import { StatusBadge } from '../components/StatusBadge'
import { ActionButton, MetricTile, Panel, SectionHeader, Screen, SubPanel } from '../components/design-system'
import { dispatches, type OrderStatus } from '../data/mock'
import { formatNumber } from '../lib/utils'

type DispatchRow = (typeof dispatches)[number]

const columns: DataTableColumn<DispatchRow>[] = [
  {
    key: 'release',
    header: 'Release / Agent',
    className: 'min-w-[220px]',
    render: (row) => (
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-950">{row.releaseOrder}</p>
          <StatusBadge status={row.status} className="px-2 py-0.5 text-[10px]" />
        </div>
        <p className="mt-1 text-xs font-medium text-slate-700">{row.agent}</p>
        <p className="text-xs text-slate-500">{row.order} · {row.id}</p>
      </div>
    ),
  },
  {
    key: 'route',
    header: 'Route / Truck',
    className: 'min-w-[220px] whitespace-normal',
    render: (row) => (
      <div>
        <p>{row.route}</p>
        <p className="text-xs text-slate-500">{row.truck} · {row.driver}</p>
      </div>
    ),
  },
  {
    key: 'load',
    header: 'Load',
    align: 'right',
    className: 'w-24',
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-950">{formatNumber(row.tons)}t</p>
        <p className="text-xs text-slate-500">{row.eta}</p>
      </div>
    ),
  },
]

export function DispatchOtp({
  workflowStatus,
  otpVerified,
  onVerifyOtp,
  onSetStatus,
}: {
  workflowStatus: OrderStatus
  otpVerified: boolean
  onVerifyOtp: () => void
  onSetStatus: (status: OrderStatus) => void
}) {
  const gateQueue = [
    { gate: 'Gate 3', release: 'RO-7742', load: '320t', state: otpVerified ? 'OTP Verified' : 'Awaiting OTP' },
    { gate: 'Gate 1', release: 'RO-7736', load: '180t', state: 'Dispatched' },
    { gate: 'Gate 4', release: 'RO-7729', load: '240t', state: 'Completed' },
  ]
  const dispatchRows = dispatches.map((dispatch) => (
    dispatch.id === 'DSP-4428'
      ? { ...dispatch, status: otpVerified ? 'OTP Verified' : dispatch.status }
      : dispatch
  ))
  const auditTrail = [
    ['17:44', 'Release RO-7742 generated'],
    ['17:48', 'Agent OTP issued to Al Baraka Trading'],
    [otpVerified ? '17:52' : 'Pending', otpVerified ? 'OTP matched and gate stamped' : 'Waiting for gate scan'],
  ]

  return (
    <Screen>
      <section className="grid shrink-0 gap-4 md:grid-cols-4">
        {[
          ['Dispatches today', '18', Truck],
          ['OTP match rate', '99.2%', CheckCircle2],
          ['Gates active', '4', MapPin],
          ['Avg loading', '38m', Route],
        ].map(([label, value, Icon]) => (
          <MetricTile key={label as string} label={label as string} value={value as string} icon={Icon} tone="sage" />
        ))}
      </section>

      <section className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[410px_minmax(0,1fr)]">
        <div className="grid min-h-0 content-start gap-4">
          <OtpVerificationPanel verified={otpVerified} onVerify={onVerifyOtp} />
          <Panel className="min-h-0">
            <SectionHeader title="Gate Readiness" description="Live gate queue and loading control." />
            <div className="grid gap-2.5">
              {gateQueue.map((item) => (
                <SubPanel key={item.release} className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.gate}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.release} · {item.load}</p>
                    </div>
                    <StatusBadge status={item.state} className="shrink-0 px-2 py-0.5 text-[10px]" />
                  </div>
                </SubPanel>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 text-xs">
              {[
                ['Staging', '7 trucks'],
                ['Security', '2 checks'],
                ['Next slot', '18:20'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[8px] bg-slate-50 px-2.5 py-2">
                  <p className="font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                  <p className="mt-1 font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid min-h-0 content-start gap-4">
          <Panel className="min-h-0">
            <SectionHeader
              title="Dispatch & OTP Verification"
              description="Release orders, truck gates, and delivery state."
              action={<StatusBadge status={workflowStatus} />}
            />
            <DataTable columns={columns} rows={dispatchRows} getRowId={(row) => row.id} density="compact" />
            <div className="mt-3 flex flex-wrap gap-3">
              <ActionButton variant="secondary" onClick={() => onSetStatus('Dispatched')}>
                Mark dispatched
              </ActionButton>
              <ActionButton className="bg-emerald-700 hover:bg-emerald-600" onClick={() => onSetStatus('Completed')}>
                Complete delivery
              </ActionButton>
            </div>
          </Panel>

          <Panel className="min-h-0">
            <SectionHeader title="OTP Audit Trail" description="Security events captured for the active release." />
            <div className="grid gap-3 lg:grid-cols-[1fr_0.9fr]">
              <SubPanel className="p-3">
                <div className="space-y-3">
                  {auditTrail.map(([time, label]) => (
                    <div key={`${time}-${label}`} className="flex gap-3">
                      <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
                        <Clock3 className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{time}</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SubPanel>
              <SubPanel className="p-3">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Custody lock</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Driver ID, truck plate, and agent OTP must match before release.
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Matched</p>
                    <p className="mt-1 font-semibold text-slate-950">{otpVerified ? '3/3' : '2/3'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500">Hold risk</p>
                    <p className="mt-1 font-semibold text-slate-950">{otpVerified ? 'Low' : 'Medium'}</p>
                  </div>
                </div>
              </SubPanel>
            </div>
          </Panel>
        </div>
      </section>
    </Screen>
  )
}
