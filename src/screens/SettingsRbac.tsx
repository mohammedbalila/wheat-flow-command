import { CheckCircle2, KeyRound, LockKeyhole, ShieldCheck, Settings } from 'lucide-react'
import { roles, type Role } from '../data/mock'
import { cn } from '../lib/utils'
import { IconTile, PageHeader, Panel, Screen, SectionHeader } from '../components/design-system'

export function SettingsRbac({
  role,
  onRoleChange,
}: {
  role: Role
  onRoleChange: (role: Role) => void
}) {
  const selected = roles.find((item) => item.role === role) ?? roles[0]

  return (
    <Screen>
      <Panel>
        <PageHeader
          title="Settings / RBAC Preview"
          description="Enterprise access model, approval duties, and boardroom-safe role preview."
          action={
          <div className="rounded-[8px] border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-600">
            Security preview mode
          </div>
          }
        />
      </Panel>

      <section className="grid shrink-0 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {roles.map((item) => {
          const active = item.role === role
          return (
            <button
              key={item.role}
              type="button"
              onClick={() => onRoleChange(item.role)}
              className={cn(
                'rounded-[8px] border p-4 text-left transition',
                active
                  ? 'border-blue-200 bg-blue-50 shadow-[0_20px_45px_rgba(29,79,145,.1)]'
                  : 'border-slate-200 bg-white hover:bg-slate-50',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <KeyRound className={cn('size-5', active ? 'text-orange-600' : 'text-slate-500')} />
                {active ? <CheckCircle2 className="size-5 text-emerald-700" /> : null}
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-950">{item.role}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.focus}</p>
            </button>
          )
        })}
      </section>

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[330px_minmax(0,1fr)_300px]">
        <Panel>
          <div className="flex items-center gap-3">
            <IconTile icon={Settings} tone="blue" />
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{selected.role}</h2>
              <p className="text-sm text-slate-500">{selected.title}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-500">{selected.focus}</p>
        </Panel>

        <Panel>
          <SectionHeader title="Permission Matrix" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {selected.permissions.map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <LockKeyhole className="size-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{permission}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Enterprise Controls" />
          <div className="mt-4 space-y-3">
            {['SSO ready', 'Audit retained', 'Data residency'].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="size-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </Screen>
  )
}
