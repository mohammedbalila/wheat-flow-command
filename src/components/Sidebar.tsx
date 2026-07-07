import type { LucideIcon } from 'lucide-react'
import { LockKeyhole, Wheat } from 'lucide-react'
import type { Role, ScreenId } from '../data/mock'
import { copy, type Language } from '../lib/i18n'
import { cn } from '../lib/utils'

export type NavItem = {
  id: ScreenId
  label: string
  icon: LucideIcon
  locked?: boolean
  accessLabel?: string
}

export function Sidebar({
  items,
  activeScreen,
  onScreenChange,
  role,
  language,
}: {
  items: NavItem[]
  activeScreen: ScreenId
  onScreenChange: (screen: ScreenId) => void
  role: Role
  language: Language
}) {
  const text = copy[language]

  return (
    <aside className="border-b border-white/10 bg-[#062849] text-white lg:sticky lg:top-0 lg:h-svh lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-4 py-4 lg:px-5 lg:py-7">
          <div className="grid size-11 place-items-center rounded-[8px] bg-white/10 text-orange-200 ring-1 ring-white/15">
            <Wheat className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">{text.appName}</p>
            <p className="text-xs text-white/62">{text.appSubtitle}</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:min-h-0 lg:space-y-1.5 lg:overflow-y-auto lg:overflow-x-hidden lg:px-3">
          {items.map((item) => {
            const Icon = item.icon
            const active = activeScreen === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!item.locked) {
                    onScreenChange(item.id)
                  }
                }}
                title={item.locked ? `${item.label} - ${item.accessLabel ?? 'Restricted for this role'}` : item.label}
                aria-disabled={item.locked}
                className={cn(
                  'inline-flex min-w-max items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-semibold transition lg:w-full lg:min-w-0 lg:items-start',
                  item.locked
                    ? 'cursor-not-allowed text-white/35 hover:bg-transparent'
                    : active
                    ? 'bg-white text-[#062849] shadow-[0_14px_30px_rgba(0,0,0,.18)]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon className="mt-0.5 size-4 shrink-0" />
                <span className="min-w-0 flex-1 whitespace-nowrap text-left leading-5 lg:whitespace-normal">
                  {item.label}
                </span>
                {item.locked ? <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-white/35" /> : null}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto hidden p-4 lg:block">
          <div className="rounded-[8px] border border-white/15 bg-white/8 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              {text.demoRole}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{role}</p>
            <p className="mt-1 text-xs leading-5 text-white/58">{text.permissionsPreview}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
