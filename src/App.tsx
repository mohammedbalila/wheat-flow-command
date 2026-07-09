import { useEffect, useMemo, useState } from 'react'
import {
  ChartPie,
  Database,
  Factory,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Ship,
  Truck,
  UsersRound,
  Warehouse,
} from 'lucide-react'
import { AppShell } from './components/AppShell'
import type { NavItem } from './components/Sidebar'
import {
  canRoleAccessScreen,
  getRoleProfile,
  orderStages,
  roles,
  type OrderStatus,
  type Role,
  type ScreenId,
} from './data/mock'
import { appPath, parseAppRoute } from './lib/routes'
import { copy, type Language } from './lib/i18n'
import { AgentsDistributionCenters } from './screens/AgentsDistributionCenters'
import { CommercialReports } from './screens/CommercialReports'
import { DispatchOtp } from './screens/DispatchOtp'
import { ExecutiveDashboard } from './screens/ExecutiveDashboard'
import { MillingOperations } from './screens/MillingOperations'
import { OrdersApprovalWorkflow } from './screens/OrdersApprovalWorkflow'
import { SettingsRbac } from './screens/SettingsRbac'
import { SmartSiloDashboard } from './screens/SmartSiloDashboard'
import { VesselSiloIntake } from './screens/VesselSiloIntake'
import { WarehouseInventory } from './screens/WarehouseInventory'

function getInitialRole(): Role {
  const storedRole = window.localStorage.getItem('wheatflow-role') as Role | null
  if (storedRole && roles.some((item) => item.role === storedRole)) {
    return storedRole
  }

  return 'CEO'
}

function App() {
  const initialRoute = parseAppRoute(window.location.pathname)
  const [activeScreen, setActiveScreen] = useState<ScreenId>(initialRoute.screen)
  const [language, setLanguage] = useState<Language>(initialRoute.language)
  const [role, setRole] = useState<Role>(getInitialRole)
  const [workflowStatus, setWorkflowStatus] = useState<OrderStatus>(() => getRoleProfile(getInitialRole()).demoWorkflowStatus)
  const [otpVerified, setOtpVerified] = useState(false)
  const roleProfile = useMemo(() => getRoleProfile(role), [role])

  const navItems = useMemo<NavItem[]>(
    () => {
      const baseItems: NavItem[] = [
        { id: 'dashboard', label: copy[language].nav.dashboard, icon: LayoutDashboard },
        { id: 'intake', label: copy[language].nav.intake, icon: Ship },
        { id: 'silos', label: copy[language].nav.silos, icon: Database },
        { id: 'milling', label: copy[language].nav.milling, icon: Factory },
        { id: 'warehouse', label: copy[language].nav.warehouse, icon: Warehouse },
        { id: 'orders', label: copy[language].nav.orders, icon: ShieldCheck },
        { id: 'dispatch', label: copy[language].nav.dispatch, icon: Truck },
        { id: 'agents', label: copy[language].nav.agents, icon: UsersRound },
        { id: 'reports', label: copy[language].nav.reports, icon: ChartPie },
        { id: 'settings', label: copy[language].nav.settings, icon: Settings },
      ]

      return baseItems.map((item) => ({
        ...item,
        locked: !roleProfile.accessibleScreens.includes(item.id),
        accessLabel: `${role} cannot access this module`,
      }))
    },
    [language, role, roleProfile],
  )

  useEffect(() => {
    const nextPath = appPath(language, activeScreen)
    if (window.location.pathname !== nextPath) {
      window.history.replaceState(null, '', nextPath)
    }
  }, [activeScreen, language])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem('wheatflow-language', language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('wheatflow-role', role)
  }, [role])

  useEffect(() => {
    if (!canRoleAccessScreen(role, activeScreen)) {
      navigate(roleProfile.landingScreen, language, role)
    }
  }, [activeScreen, language, role, roleProfile.landingScreen])

  useEffect(() => {
    function handlePopState() {
      const nextRoute = parseAppRoute(window.location.pathname)
      setActiveScreen(nextRoute.screen)
      setLanguage(nextRoute.language)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(screen: ScreenId, nextLanguage = language, accessRole = role) {
    if (!canRoleAccessScreen(accessRole, screen)) {
      return
    }

    setActiveScreen(screen)
    setLanguage(nextLanguage)
    window.history.pushState(null, '', appPath(nextLanguage, screen))
  }

  function handleLanguageChange(nextLanguage: Language) {
    navigate(activeScreen, nextLanguage)
  }

  function handleRoleChange(nextRole: Role) {
    const nextProfile = getRoleProfile(nextRole)
    setRole(nextRole)
    setWorkflowStatus(nextProfile.demoWorkflowStatus)
    setOtpVerified(false)

    if (!canRoleAccessScreen(nextRole, activeScreen)) {
      navigate(nextProfile.landingScreen, language, nextRole)
    }
  }

  function advanceWorkflow() {
    const currentIndex = orderStages.indexOf(workflowStatus)
    const next = orderStages[Math.min(currentIndex + 1, orderStages.length - 1)]
    setWorkflowStatus(next)
    if (next !== 'OTP Verified') {
      setOtpVerified(false)
    }
  }

  function handleOtpVerified() {
    setOtpVerified(true)
    setWorkflowStatus('OTP Verified')
  }

  const screen = (() => {
    switch (activeScreen) {
      case 'dashboard':
        return <ExecutiveDashboard roleProfile={roleProfile} workflowStatus={workflowStatus} onOpenScreen={navigate} />
      case 'intake':
        return <VesselSiloIntake />
      case 'silos':
        return <SmartSiloDashboard />
      case 'milling':
        return <MillingOperations />
      case 'warehouse':
        return <WarehouseInventory roleProfile={roleProfile} />
      case 'orders':
        return (
          <OrdersApprovalWorkflow
            roleProfile={roleProfile}
            workflowStatus={workflowStatus}
            onAdvance={advanceWorkflow}
          />
        )
      case 'dispatch':
        return (
          <DispatchOtp
            roleProfile={roleProfile}
            workflowStatus={workflowStatus}
            otpVerified={otpVerified}
            onVerifyOtp={handleOtpVerified}
            onSetStatus={setWorkflowStatus}
          />
        )
      case 'agents':
        return <AgentsDistributionCenters roleProfile={roleProfile} />
      case 'reports':
        return <CommercialReports roleProfile={roleProfile} />
      case 'settings':
        return <SettingsRbac role={role} onRoleChange={handleRoleChange} />
      default:
        return null
    }
  })()

  return (
    <AppShell
      items={navItems}
      activeScreen={activeScreen}
      onScreenChange={navigate}
      role={role}
      onRoleChange={handleRoleChange}
      profile={roleProfile}
      language={language}
      onLanguageChange={handleLanguageChange}
    >
      {screen}
    </AppShell>
  )
}

export default App
