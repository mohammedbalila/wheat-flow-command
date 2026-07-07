import type { ScreenId } from '../data/mock'

export type Language = 'en' | 'ar'

export const languageLabels: Record<Language, string> = {
  en: 'EN',
  ar: 'AR',
}

export const copy = {
  en: {
    appName: 'WheatFlow',
    appSubtitle: 'Supply Chain Command',
    date: 'Tuesday, 23 Jun 2026',
    searchPlaceholder: 'Search vessels, release orders, agents...',
    executiveSession: 'Executive session',
    notifications: 'Notifications',
    demoRole: 'Demo role',
    permissionsPreview: 'Permissions preview only. Enterprise security preview.',
    routeFallbackTitle: 'Executive Dashboard',
    language: 'Language',
    nav: {
      dashboard: 'Executive Dashboard',
      intake: 'Vessel & Silo Intake',
      milling: 'Milling / Factory Operations',
      warehouse: 'Warehouse Inventory',
      orders: 'Orders & Approval Workflow',
      dispatch: 'Dispatch & OTP Verification',
      agents: 'Agents & Distribution Centers',
      reports: 'Commercial Reports',
      settings: 'Settings / RBAC Preview',
    } satisfies Record<ScreenId, string>,
  },
  ar: {
    appName: 'ويت فلو',
    appSubtitle: 'قيادة سلسلة الإمداد',
    date: 'الثلاثاء، 23 يونيو 2026',
    searchPlaceholder: 'ابحث عن سفن أو أوامر إفراج أو وكلاء...',
    executiveSession: 'جلسة تنفيذية',
    notifications: 'الإشعارات',
    demoRole: 'الدور التجريبي',
    permissionsPreview: 'معاينة صلاحيات وأمن مؤسسي.',
    routeFallbackTitle: 'لوحة القيادة التنفيذية',
    language: 'اللغة',
    nav: {
      dashboard: 'لوحة القيادة التنفيذية',
      intake: 'استلام السفن والصوامع',
      milling: 'عمليات الطحن والمصانع',
      warehouse: 'مخزون المستودعات',
      orders: 'الطلبات وسير الموافقات',
      dispatch: 'الإرسال والتحقق بالرمز',
      agents: 'الوكلاء ومراكز التوزيع',
      reports: 'التقارير التجارية',
      settings: 'الإعدادات والصلاحيات',
    } satisfies Record<ScreenId, string>,
  },
}
