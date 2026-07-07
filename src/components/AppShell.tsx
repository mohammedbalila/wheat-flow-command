import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Role, ScreenId } from '../data/mock'
import type { Language } from '../lib/i18n'
import { Sidebar, type NavItem } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({
  items,
  activeScreen,
  onScreenChange,
  role,
  onRoleChange,
  language,
  onLanguageChange,
  children,
}: {
  items: NavItem[]
  activeScreen: ScreenId
  onScreenChange: (screen: ScreenId) => void
  role: Role
  onRoleChange: (role: Role) => void
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
          language={language}
          onLanguageChange={onLanguageChange}
        />
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
