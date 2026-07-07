export type Role =
  | 'CEO'
  | 'Sales Manager'
  | 'Accountant'
  | 'Warehouse Keeper'
  | 'Agent'

export type ScreenId =
  | 'dashboard'
  | 'intake'
  | 'milling'
  | 'warehouse'
  | 'orders'
  | 'dispatch'
  | 'agents'
  | 'reports'
  | 'settings'

export type OrderStatus =
  | 'Draft'
  | 'Sales Approved'
  | 'Accountant Approved'
  | 'Release Order Generated'
  | 'OTP Verified'
  | 'Dispatched'
  | 'Completed'

export const roles: Array<{
  role: Role
  title: string
  focus: string
  permissions: string[]
}> = [
  {
    role: 'CEO',
    title: 'Full executive command',
    focus: 'Portfolio visibility, approvals, dispatch performance',
    permissions: ['All dashboards', 'Commercial reports', 'RBAC preview', 'Override approvals'],
  },
  {
    role: 'Sales Manager',
    title: 'Demand and approvals',
    focus: 'Agent orders, regional sales, sales approval gate',
    permissions: ['Orders', 'Agents', 'Sales reports', 'Release request creation'],
  },
  {
    role: 'Accountant',
    title: 'Financial release control',
    focus: 'Credit exposure, payment confirmation, accountant approval',
    permissions: ['Payment ledger', 'Accountant approval', 'Receipts', 'Commercial reports'],
  },
  {
    role: 'Warehouse Keeper',
    title: 'Stock and dispatch custody',
    focus: 'Warehouse inventory, release loading, OTP dispatch handoff',
    permissions: ['Warehouse stock', 'Release orders', 'OTP confirmation', 'Dispatch ledger'],
  },
  {
    role: 'Agent',
    title: 'Distribution center portal',
    focus: 'Order requests, allocations, delivery status',
    permissions: ['Create draft orders', 'View own allocation', 'OTP receipt', 'Delivery history'],
  },
]

export const orderStages: OrderStatus[] = [
  'Draft',
  'Sales Approved',
  'Accountant Approved',
  'Release Order Generated',
  'OTP Verified',
  'Dispatched',
  'Completed',
]

export const executiveKpis = [
  {
    label: 'Wheat in silos',
    value: 50000,
    suffix: ' tons',
    trend: '+4.2%',
    detail: 'Port Sudan and Khartoum reserve',
    tone: 'gold',
  },
  {
    label: 'Flour available',
    value: 7000,
    suffix: ' tons',
    trend: '18 days cover',
    detail: 'Grade A and bakery blend',
    tone: 'emerald',
  },
  {
    label: 'Active orders',
    value: 34,
    suffix: '',
    trend: '12 high priority',
    detail: 'Across 8 regions',
    tone: 'cyan',
  },
  {
    label: 'Pending approvals',
    value: 9,
    suffix: '',
    trend: '5 in queue',
    detail: 'Average age 42 minutes',
    tone: 'amber',
  },
  {
    label: 'Dispatches today',
    value: 18,
    suffix: '',
    trend: '+6 today',
    detail: 'OTP secured releases',
    tone: 'green',
  },
]

export const flowNodes = [
  {
    id: 'vessel',
    label: 'Vessel Intake',
    location: 'Port Sudan',
    metric: '28,400t',
    status: 'Quality cleared',
    screen: 'intake' as ScreenId,
  },
  {
    id: 'silo',
    label: 'Silo Stock',
    location: 'Terminal A / Khartoum',
    metric: '50,000t',
    status: '72% capacity',
    screen: 'intake' as ScreenId,
  },
  {
    id: 'factory',
    label: 'Factory Milling',
    location: 'Jayli Factory',
    metric: '1,240t/day',
    status: '3 shifts live',
    screen: 'milling' as ScreenId,
  },
  {
    id: 'warehouse',
    label: 'Warehouse',
    location: 'Omdurman Hub',
    metric: '7,000t',
    status: 'Ready stock',
    screen: 'warehouse' as ScreenId,
  },
  {
    id: 'orders',
    label: 'Agent Orders',
    location: '8 regions',
    metric: '34 active',
    status: '9 approvals',
    screen: 'orders' as ScreenId,
  },
  {
    id: 'dispatch',
    label: 'OTP Dispatch',
    location: 'Fleet gates',
    metric: '18 today',
    status: '99.2% matched',
    screen: 'dispatch' as ScreenId,
  },
]

export const liveUpdates = [
  {
    time: '17:44',
    title: 'Release order RO-7742 generated',
    detail: 'Al Baraka Trading, Khartoum North, 320 tons bakery flour',
  },
  {
    time: '17:31',
    title: 'Jayli Factory Line A switched to premium blend',
    detail: 'Moisture target adjusted to 13.2% after lab confirmation',
  },
  {
    time: '17:18',
    title: 'OTP verified at Omdurman gate 3',
    detail: 'Truck SD-7-4421 cleared for Kassala distribution center',
  },
  {
    time: '17:02',
    title: 'Inventory alert resolved',
    detail: 'Port Sudan Silo B temperature variance back under tolerance',
  },
]

export const vesselIntakes = [
  {
    id: 'VIN-2041',
    vessel: 'MV Nile Amber',
    origin: 'Constanta',
    berth: 'Port Sudan Berth 4',
    wheatTons: 28400,
    moisture: '12.8%',
    protein: '11.7%',
    eta: '23 Jun, 19:30',
    status: 'Quality cleared',
    inspector: 'Hassan Idris',
  },
  {
    id: 'VIN-2038',
    vessel: 'Red Sea Star',
    origin: 'Odessa',
    berth: 'Port Sudan Berth 2',
    wheatTons: 21350,
    moisture: '13.1%',
    protein: '11.4%',
    eta: '24 Jun, 08:15',
    status: 'Sampling',
    inspector: 'Mariam Osman',
  },
  {
    id: 'VIN-2031',
    vessel: 'Al Zahra Bulk',
    origin: 'Mersin',
    berth: 'Anchorage queue',
    wheatTons: 19600,
    moisture: '12.5%',
    protein: '12.0%',
    eta: '25 Jun, 03:40',
    status: 'Awaiting berth',
    inspector: 'Sami Abdelrahman',
  },
]

export const siloStocks = [
  {
    id: 'SIL-A1',
    name: 'Terminal Silo A1',
    location: 'Port Sudan',
    wheatTons: 18500,
    capacityTons: 24000,
    grade: 'Hard wheat',
    turnover: '5.2 days',
    status: 'Healthy',
  },
  {
    id: 'SIL-B2',
    name: 'Terminal Silo B2',
    location: 'Port Sudan',
    wheatTons: 11600,
    capacityTons: 18000,
    grade: 'Blend reserve',
    turnover: '7.8 days',
    status: 'Watch',
  },
  {
    id: 'SIL-KH1',
    name: 'Khartoum Strategic Reserve',
    location: 'Khartoum',
    wheatTons: 13900,
    capacityTons: 20000,
    grade: 'Bakery blend',
    turnover: '9.1 days',
    status: 'Healthy',
  },
  {
    id: 'SIL-OM3',
    name: 'Omdurman Buffer Silo',
    location: 'Omdurman',
    wheatTons: 6000,
    capacityTons: 9000,
    grade: 'Factory feed',
    turnover: '2.6 days',
    status: 'Replenish',
  },
]

export const millingRuns = [
  {
    id: 'MIL-901',
    line: 'Jayli Factory Line A',
    product: 'Premium bakery flour',
    inputTons: 860,
    outputTons: 642,
    extractionRate: '74.7%',
    uptime: '96%',
    status: 'Running',
    supervisor: 'Ayman Farah',
  },
  {
    id: 'MIL-902',
    line: 'Jayli Factory Line B',
    product: 'Family flour 50kg',
    inputTons: 720,
    outputTons: 525,
    extractionRate: '72.9%',
    uptime: '91%',
    status: 'Running',
    supervisor: 'Noura Elamin',
  },
  {
    id: 'MIL-811',
    line: 'Bahri Mill C',
    product: 'Industrial semolina mix',
    inputTons: 410,
    outputTons: 286,
    extractionRate: '69.8%',
    uptime: '84%',
    status: 'Maintenance window',
    supervisor: 'Mohamed Tahir',
  },
]

export const millingTrend = [
  { day: 'Mon', wheat: 1520, flour: 1096 },
  { day: 'Tue', wheat: 1660, flour: 1212 },
  { day: 'Wed', wheat: 1590, flour: 1148 },
  { day: 'Thu', wheat: 1740, flour: 1288 },
  { day: 'Fri', wheat: 1820, flour: 1345 },
  { day: 'Sat', wheat: 1690, flour: 1240 },
  { day: 'Sun', wheat: 1515, flour: 1118 },
]

export const warehouseInventory = [
  {
    id: 'WH-KH-A',
    name: 'Khartoum Central Flour Warehouse',
    location: 'Khartoum',
    product: 'Premium bakery flour',
    tons: 2350,
    capacityTons: 3200,
    bags: 47000,
    status: 'Ready',
    alert: 'No constraint',
  },
  {
    id: 'WH-OM-B',
    name: 'Omdurman Distribution Hub',
    location: 'Omdurman',
    product: 'Family flour 50kg',
    tons: 1820,
    capacityTons: 2600,
    bags: 36400,
    status: 'Ready',
    alert: 'High outbound',
  },
  {
    id: 'WH-KS-C',
    name: 'Kassala DC Reserve',
    location: 'Kassala',
    product: 'Bakery blend',
    tons: 970,
    capacityTons: 1400,
    bags: 19400,
    status: 'Allocated',
    alert: 'Replenish in 36h',
  },
  {
    id: 'WH-GD-D',
    name: 'Gedaref Rural Supply',
    location: 'Gedaref',
    product: 'Family flour 25kg',
    tons: 610,
    capacityTons: 1200,
    bags: 24400,
    status: 'Watch',
    alert: 'Below target',
  },
]

export const orders = [
  {
    id: 'ORD-8814',
    agent: 'Al Baraka Trading',
    region: 'Khartoum North',
    product: 'Premium bakery flour',
    tons: 320,
    value: 214000,
    status: 'Accountant Approved' as OrderStatus,
    requested: '23 Jun, 15:16',
    credit: 'Within limit',
  },
  {
    id: 'ORD-8809',
    agent: 'Kassala Golden Grain',
    region: 'Kassala',
    product: 'Family flour 50kg',
    tons: 210,
    value: 131500,
    status: 'Sales Approved' as OrderStatus,
    requested: '23 Jun, 14:22',
    credit: 'Payment review',
  },
  {
    id: 'ORD-8798',
    agent: 'Omdurman Food Supply',
    region: 'Omdurman',
    product: 'Bakery blend',
    tons: 180,
    value: 117400,
    status: 'Release Order Generated' as OrderStatus,
    requested: '23 Jun, 12:04',
    credit: 'Within limit',
  },
  {
    id: 'ORD-8791',
    agent: 'Nile Delta Distribution',
    region: 'Gezira',
    product: 'Family flour 25kg',
    tons: 145,
    value: 82000,
    status: 'Draft' as OrderStatus,
    requested: '23 Jun, 11:38',
    credit: 'New request',
  },
]

export const dispatches = [
  {
    id: 'DSP-4428',
    releaseOrder: 'RO-7742',
    order: 'ORD-8814',
    agent: 'Al Baraka Trading',
    truck: 'SD-7-4421',
    route: 'Omdurman Hub → Khartoum North',
    tons: 320,
    driver: 'Yasir Malik',
    status: 'Awaiting OTP',
    eta: '52 min',
  },
  {
    id: 'DSP-4421',
    releaseOrder: 'RO-7736',
    order: 'ORD-8798',
    agent: 'Omdurman Food Supply',
    truck: 'SD-4-2188',
    route: 'Jayli Factory → Omdurman',
    tons: 180,
    driver: 'Abdelaziz Noor',
    status: 'Dispatched',
    eta: '34 min',
  },
  {
    id: 'DSP-4415',
    releaseOrder: 'RO-7729',
    order: 'ORD-8782',
    agent: 'Kassala Golden Grain',
    truck: 'KS-9-3320',
    route: 'Khartoum Central → Kassala DC',
    tons: 240,
    driver: 'Khalid Bashir',
    status: 'Completed',
    eta: 'Delivered',
  },
]

export const agents = [
  {
    id: 'AG-018',
    name: 'Al Baraka Trading',
    owner: 'Faisal Al Mahdi',
    region: 'Khartoum North',
    monthlyTons: 1840,
    fillRate: '98.5%',
    outstanding: 128000,
    status: 'Strategic',
  },
  {
    id: 'AG-026',
    name: 'Kassala Golden Grain',
    owner: 'Rasha Hamid',
    region: 'Kassala',
    monthlyTons: 1360,
    fillRate: '94.1%',
    outstanding: 76000,
    status: 'Growth',
  },
  {
    id: 'AG-032',
    name: 'Omdurman Food Supply',
    owner: 'Osman Saeed',
    region: 'Omdurman',
    monthlyTons: 1295,
    fillRate: '96.8%',
    outstanding: 52000,
    status: 'Strategic',
  },
  {
    id: 'AG-041',
    name: 'Nile Delta Distribution',
    owner: 'Mona Abdelrahim',
    region: 'Gezira',
    monthlyTons: 1020,
    fillRate: '91.6%',
    outstanding: 44000,
    status: 'Watch',
  },
  {
    id: 'AG-052',
    name: 'Emirates Sudan Foods',
    owner: 'Khalifa Mansour',
    region: 'UAE Export Desk',
    monthlyTons: 780,
    fillRate: '97.2%',
    outstanding: 61000,
    status: 'Export',
  },
]

export const regionSales = [
  { region: 'Khartoum', tons: 4200, revenue: 2840000, growth: 12 },
  { region: 'Omdurman', tons: 3180, revenue: 2010000, growth: 8 },
  { region: 'Kassala', tons: 2320, revenue: 1480000, growth: 16 },
  { region: 'Gezira', tons: 1980, revenue: 1210000, growth: 5 },
  { region: 'Port Sudan', tons: 1460, revenue: 935000, growth: 7 },
  { region: 'UAE Export', tons: 940, revenue: 820000, growth: 19 },
]

export const commercialTrend = [
  { month: 'Jan', revenue: 5.2, margin: 18.2, orders: 122 },
  { month: 'Feb', revenue: 5.7, margin: 18.8, orders: 136 },
  { month: 'Mar', revenue: 6.4, margin: 19.4, orders: 148 },
  { month: 'Apr', revenue: 6.0, margin: 18.9, orders: 141 },
  { month: 'May', revenue: 7.1, margin: 20.1, orders: 169 },
  { month: 'Jun', revenue: 7.8, margin: 20.7, orders: 188 },
]

export const productMix = [
  { name: 'Premium bakery', value: 38 },
  { name: 'Family 50kg', value: 31 },
  { name: 'Bakery blend', value: 21 },
  { name: 'Industrial', value: 10 },
]

export const inventoryAlerts = [
  {
    title: 'Gedaref rural stock below floor',
    detail: '610 tons available against 900 ton threshold',
    severity: 'High',
  },
  {
    title: 'Omdurman outbound pressure',
    detail: 'Seven release orders planned before 21:00',
    severity: 'Medium',
  },
  {
    title: 'Silo B2 temperature watch',
    detail: 'Variance reduced, keep two-hour checks active',
    severity: 'Low',
  },
]
