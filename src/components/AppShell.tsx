import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Role, RoleProfile, ScreenId } from '../data/mock'
import type { Language } from '../lib/i18n'
import { Sidebar, type NavItem } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({
  items,
  activeScreen,
  onScreenChange,
  role,
  onRoleChange,
  profile,
  language,
  onLanguageChange,
  children,
}: {
  items: NavItem[]
  activeScreen: ScreenId
  onScreenChange: (screen: ScreenId) => void
  role: Role
  onRoleChange: (role: Role) => void
  profile: RoleProfile
  language: Language
  onLanguageChange: (language: Language) => void
  children: ReactNode
}) {
  return (
    <div className="min-h-svh bg-[var(--color-canvas)] lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      <Sidebar
        items={items}
        activeScreen={activeScreen}
        onScreenChange={onScreenChange}
        role={role}
        language={language}
      />
      <div className="min-w-0">
        <Topbar
          role={role}
          onRoleChange={onRoleChange}
          profile={profile}
          language={language}
          onLanguageChange={onLanguageChange}
        />
        <div className="border-b border-slate-200/70 bg-white/75 px-4 py-2.5 backdrop-blur md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold uppercase tracking-[0.1em] text-slate-500">
              Role scope
            </span>
            <span className="font-semibold text-slate-950">{profile.role}</span>
            <span className="max-w-3xl text-slate-600">{profile.focus}</span>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-500">{profile.dataScope}</span>
          </div>
        </div>
        <main className="px-4 py-4 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
