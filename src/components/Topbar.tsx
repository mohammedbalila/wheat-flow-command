import { Bell, CalendarDays, Search, UserCircle2 } from 'lucide-react'
import { roles, type Role } from '../data/mock'
import { copy, languageLabels, type Language } from '../lib/i18n'
import { cn } from '../lib/utils'

export function Topbar({
  role,
  onRoleChange,
  language,
  onLanguageChange,
}: {
  role: Role
  onRoleChange: (role: Role) => void
  language: Language
  onLanguageChange: (language: Language) => void
}) {
  const text = copy[language]

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_8px_24px_rgba(16,32,57,0.06)] backdrop-blur md:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_128px_88px_40px] items-center gap-3 lg:flex lg:flex-wrap">
        <div className="min-w-0 lg:flex lg:flex-1 lg:items-center lg:gap-3">
          <div className="hidden items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm lg:flex">
            <CalendarDays className="size-4 text-blue-700" />
            {text.date}
          </div>
          <label className="relative block min-w-0 lg:flex-1 lg:max-w-md">
            <Search
              className={cn(
                'pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-slate-400',
                language === 'ar' ? 'right-3' : 'left-3',
              )}
            />
            <input
              placeholder={text.searchPlaceholder}
              className={cn(
                'h-10 w-full rounded-[8px] border border-slate-200 bg-white text-sm text-slate-800 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-blue-400',
                language === 'ar' ? 'pl-3 pr-10 text-right' : 'pl-10 pr-3',
              )}
            />
          </label>
        </div>

        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as Role)}
          className="h-10 min-w-0 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none shadow-sm transition focus:border-blue-400 lg:w-auto"
        >
          {roles.map((item) => (
            <option key={item.role} value={item.role}>
              {item.role}
            </option>
          ))}
        </select>

        <div
          className="grid h-10 grid-cols-2 rounded-[8px] border border-slate-200 bg-white p-1 shadow-sm"
          aria-label={text.language}
        >
          {(['en', 'ar'] as Language[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onLanguageChange(item)}
              className={cn(
                'rounded-[6px] px-2 text-xs font-semibold transition',
                item === language ? 'bg-[#0b2d4d] text-white' : 'text-slate-500 hover:bg-slate-50',
              )}
            >
              {languageLabels[item]}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          aria-label={text.notifications}
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 shadow-sm lg:flex">
          <UserCircle2 className="size-5 text-slate-500" />
          <div>
            <p className="text-xs font-semibold text-slate-900">Mustafa Demo</p>
            <p className="text-[11px] text-slate-500">{text.executiveSession}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
