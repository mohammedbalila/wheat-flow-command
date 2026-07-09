import type { ScreenId } from '../data/mock'
import type { Language } from './i18n'

export const routePaths: Record<ScreenId, string> = {
  dashboard: 'dashboard',
  intake: 'intake',
  silos: 'silos',
  milling: 'milling',
  warehouse: 'warehouse',
  orders: 'orders',
  dispatch: 'dispatch',
  agents: 'agents',
  reports: 'reports',
  settings: 'settings',
}

const screenByPath = new Map(Object.entries(routePaths).map(([screen, path]) => [path, screen as ScreenId]))

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

function stripBasePath(pathname: string) {
  if (!basePath) {
    return pathname
  }

  if (pathname === basePath) {
    return '/'
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length)
  }

  return pathname
}

export function parseAppRoute(pathname: string): { language: Language; screen: ScreenId } {
  const parts = stripBasePath(pathname).split('/').filter(Boolean)
  const maybeLanguage = parts[0]
  const language: Language = maybeLanguage === 'ar' ? 'ar' : 'en'
  const screenPath = maybeLanguage === 'ar' || maybeLanguage === 'en' ? parts[1] : parts[0]

  return {
    language,
    screen: screenByPath.get(screenPath ?? '') ?? 'dashboard',
  }
}

export function appPath(language: Language, screen: ScreenId) {
  return `${basePath}/${language}/${routePaths[screen]}`
}
