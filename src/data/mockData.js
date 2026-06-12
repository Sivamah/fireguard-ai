// ============================================================
// FireGuard AI — Mock Data (Multi-Tenant SaaS)
// Roles: Super Admin, Supplier, Building Owner, Auditor, Analyst
// ============================================================

export const companies = [
  { id: 'COMP-001', name: 'Acme Corp', status: 'Active', subscription: 'Enterprise', buildings: 4, employees: 1240 },
  { id: 'COMP-002', name: 'Global Industries', status: 'Active', subscription: 'Professional', buildings: 4, employees: 860 },
];

// Tamil Nadu → District → Area → Building
export const tamilNaduHierarchy = {
  state: 'Tamil Nadu',
  districts: [
    { id: 'CBE', name: 'Coimbatore', areas: ['Peelamedu', 'RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Singanallur'] },
    { id: 'CHN', name: 'Chennai', areas: ['T Nagar', 'Anna Nagar', 'Adyar', 'Nungambakkam', 'Velachery'] },
    { id: 'MDU', name: 'Madurai', areas: ['Mattuthavani', 'Tallakulam', 'KK Nagar', 'Bypass Road', 'Goripalayam'] },
    { id: 'TPR', name: 'Tiruppur', areas: ['Palladam Road', 'Avinashi Road', 'Kangeyam Road', 'Tiruppur East'] },
    { id: 'SLM', name: 'Salem', areas: ['Fairlands', 'Shevapet', 'Suramangalam', 'Kitchipalayam'] },
  ],
};

export const suppliers = [
  {
    id: 'SUP-001',
    name: 'ABC Fire Safety Pvt Ltd',
    contact: 'Ramesh Kumar',
    email: 'supplier@abcfire.com',
    phone: '+91 98421 55001',
    address: 'No. 42, Industrial Estate, Peelamedu, Coimbatore – 641 004',
    districts: ['Coimbatore', 'Chennai', 'Madurai', 'Tiruppur'],
    buildingsCovered: 6,
    extinguishersSupplied: 248,
    activeContracts: 5,
    expiringContracts: 2,
    performanceScore: 92,
    certifications: ['ISO 9001:2015', 'BIS Certified', 'NFPA Member'],
    status: 'Active',
    joinedDate: '2023-01-15',
  },
  {
    id: 'SUP-002',
    name: 'SafeGuard Systems Ltd',
    contact: 'Muthu Krishnan',
    email: 'safeguard@systems.com',
    phone: '+91 98765 43210',
    address: 'Plot 18, SIDCO Industrial Area, T Nagar, Chennai – 600 017',
    districts: ['Chennai', 'Salem'],
    buildingsCovered: 2,
    extinguishersSupplied: 80,
    activeContracts: 2,
    expiringContracts: 0,
    performanceScore: 87,
    certifications: ['ISO 9001:2015', 'BIS Certified'],
    status: 'Active',
    joinedDate: '2023-06-01',
  },
];

export const supplierAnalytics = {
  'SUP-001': {
    districtWise: [
      { district: 'Coimbatore', buildings: 2, extinguishers: 96, contracts: 2 },
      { district: 'Chennai', buildings: 2, extinguishers: 64, contracts: 2 },
      { district: 'Madurai', buildings: 1, extinguishers: 52, contracts: 1 },
      { district: 'Tiruppur', buildings: 1, extinguishers: 36, contracts: 1 },
    ],
    monthlySupply: [
      { month: 'Jan', units: 18 }, { month: 'Feb', units: 22 }, { month: 'Mar', units: 15 },
      { month: 'Apr', units: 28 }, { month: 'May', units: 32 }, { month: 'Jun', units: 24 },
    ],
  },
};

export const buildings = [
  // Acme Corp — supplierId = SUP-001
  {
    id: 'BLD-001', companyId: 'COMP-001', supplierId: 'SUP-001', ownerUserId: 'USR-010',
    name: 'NGP Tech Park', type: 'IT Park',
    state: 'Tamil Nadu', district: 'Coimbatore', area: 'Peelamedu',
    location: 'Peelamedu, Coimbatore', floors: 42, area_sqft: 180000,
    complianceScore: 94, riskScore: 18, riskLevel: 'Low',
    lastAudit: '2026-05-12', nextAudit: '2026-08-12', extinguishers: 128, alerts: 0,
    contactPerson: 'Vijay Anand', contactPhone: '+91 99401 11001',
  },
  {
    id: 'BLD-002', companyId: 'COMP-001', supplierId: 'SUP-001', ownerUserId: 'USR-011',
    name: 'Coimbatore Central Tower', type: 'Commercial',
    state: 'Tamil Nadu', district: 'Coimbatore', area: 'RS Puram',
    location: 'RS Puram, Coimbatore', floors: 28, area_sqft: 95000,
    complianceScore: 71, riskScore: 64, riskLevel: 'Medium',
    lastAudit: '2026-04-08', nextAudit: '2026-07-08', extinguishers: 84, alerts: 3,
    contactPerson: 'Suresh Natarajan', contactPhone: '+91 99401 22002',
  },
  {
    id: 'BLD-003', companyId: 'COMP-001', supplierId: 'SUP-001', ownerUserId: 'USR-012',
    name: 'FireGuard Corporate Center', type: 'Corporate',
    state: 'Tamil Nadu', district: 'Chennai', area: 'T Nagar',
    location: 'T Nagar, Chennai', floors: 18, area_sqft: 72000,
    complianceScore: 42, riskScore: 84, riskLevel: 'Critical',
    lastAudit: '2025-12-15', nextAudit: '2026-03-15', extinguishers: 56, alerts: 7,
    contactPerson: 'Priya Menon', contactPhone: '+91 99401 33003',
  },
  {
    id: 'BLD-004', companyId: 'COMP-001', supplierId: 'SUP-002', ownerUserId: 'USR-013',
    name: 'Marina Business Hub', type: 'Mixed Use',
    state: 'Tamil Nadu', district: 'Chennai', area: 'Anna Nagar',
    location: 'Anna Nagar, Chennai', floors: 14, area_sqft: 58000,
    complianceScore: 88, riskScore: 28, riskLevel: 'Low',
    lastAudit: '2026-05-20', nextAudit: '2026-08-20', extinguishers: 42, alerts: 1,
    contactPerson: 'Arun Babu', contactPhone: '+91 99401 44004',
  },
  // Global Industries — supplierId = SUP-001
  {
    id: 'BLD-005', companyId: 'COMP-002', supplierId: 'SUP-001', ownerUserId: 'USR-014',
    name: 'Meenakshi Industrial Complex', type: 'Industrial',
    state: 'Tamil Nadu', district: 'Madurai', area: 'Mattuthavani',
    location: 'Mattuthavani, Madurai', floors: 22, area_sqft: 120000,
    complianceScore: 61, riskScore: 72, riskLevel: 'High',
    lastAudit: '2026-03-01', nextAudit: '2026-06-01', extinguishers: 66, alerts: 5,
    contactPerson: 'Senthil Kumar', contactPhone: '+91 99401 55005',
  },
  {
    id: 'BLD-006', companyId: 'COMP-002', supplierId: 'SUP-001', ownerUserId: 'USR-015',
    name: 'Madurai Tech Square', type: 'IT Park',
    state: 'Tamil Nadu', district: 'Madurai', area: 'Tallakulam',
    location: 'Tallakulam, Madurai', floors: 8, area_sqft: 42000,
    complianceScore: 55, riskScore: 78, riskLevel: 'High',
    lastAudit: '2026-02-14', nextAudit: '2026-05-14', extinguishers: 24, alerts: 4,
    contactPerson: 'Deepa Lakshmi', contactPhone: '+91 99401 66006',
  },
  {
    id: 'BLD-007', companyId: 'COMP-002', supplierId: 'SUP-001', ownerUserId: 'USR-016',
    name: 'Tiruppur Export Hub', type: 'Warehouse',
    state: 'Tamil Nadu', district: 'Tiruppur', area: 'Palladam Road',
    location: 'Palladam Road, Tiruppur', floors: 16, area_sqft: 88000,
    complianceScore: 97, riskScore: 12, riskLevel: 'Low',
    lastAudit: '2026-05-28', nextAudit: '2026-08-28', extinguishers: 48, alerts: 0,
    contactPerson: 'Murugan Arumugam', contactPhone: '+91 99401 77007',
  },
  {
    id: 'BLD-008', companyId: 'COMP-002', supplierId: 'SUP-002', ownerUserId: 'USR-017',
    name: 'Salem Corporate Park', type: 'Corporate',
    state: 'Tamil Nadu', district: 'Salem', area: 'Fairlands',
    location: 'Fairlands, Salem', floors: 12, area_sqft: 54000,
    complianceScore: 76, riskScore: 52, riskLevel: 'Medium',
    lastAudit: '2026-04-22', nextAudit: '2026-07-22', extinguishers: 36, alerts: 2,
    contactPerson: 'Kavitha Rajan', contactPhone: '+91 99401 88008',
  },
];

export const extinguishers = [
  { id: 'EXT-2401', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'NGP Tech Park', buildingId: 'BLD-001', floor: 12, type: 'CO₂', weight: '4.5 kg', installDate: '2024-01-15', expiryDate: '2026-01-15', status: 'Active', lastInspection: '2026-05-01', location: 'Near Server Room' },
  { id: 'EXT-2402', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'NGP Tech Park', buildingId: 'BLD-001', floor: 24, type: 'Dry Powder', weight: '6 kg', installDate: '2024-02-20', expiryDate: '2026-02-20', status: 'Expired', lastInspection: '2026-04-15', location: 'Fire Exit Corridor' },
  { id: 'EXT-2403', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'Coimbatore Central Tower', buildingId: 'BLD-002', floor: 5, type: 'Water Mist', weight: '9 ltr', installDate: '2023-11-10', expiryDate: '2026-07-10', status: 'Expiring Soon', lastInspection: '2026-05-10', location: 'Reception Area' },
  { id: 'EXT-2404', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'FireGuard Corporate Center', buildingId: 'BLD-003', floor: 3, type: 'CO₂', weight: '4.5 kg', installDate: '2022-08-05', expiryDate: '2025-08-05', status: 'Expired', lastInspection: '2025-11-01', location: 'IT Server Room' },
  { id: 'EXT-2405', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'FireGuard Corporate Center', buildingId: 'BLD-003', floor: 8, type: 'Foam', weight: '9 ltr', installDate: '2022-08-05', expiryDate: '2025-08-05', status: 'Expired', lastInspection: '2025-11-01', location: 'Cafeteria' },
  { id: 'EXT-2406', companyId: 'COMP-001', supplierId: 'SUP-002', building: 'Marina Business Hub', buildingId: 'BLD-004', floor: 7, type: 'CO₂', weight: '4.5 kg', installDate: '2025-03-18', expiryDate: '2027-03-18', status: 'Active', lastInspection: '2026-05-18', location: 'Elevator Lobby' },
  { id: 'EXT-2407', companyId: 'COMP-002', supplierId: 'SUP-001', building: 'Meenakshi Industrial Complex', buildingId: 'BLD-005', floor: 14, type: 'Dry Powder', weight: '6 kg', installDate: '2023-06-22', expiryDate: '2026-06-22', status: 'Expiring Soon', lastInspection: '2026-04-22', location: 'Production Floor' },
  { id: 'EXT-2408', companyId: 'COMP-002', supplierId: 'SUP-001', building: 'Madurai Tech Square', buildingId: 'BLD-006', floor: 2, type: 'Water Mist', weight: '9 ltr', installDate: '2022-04-14', expiryDate: '2025-04-14', status: 'Expired', lastInspection: '2025-10-01', location: 'Main Entrance' },
  { id: 'EXT-2409', companyId: 'COMP-002', supplierId: 'SUP-001', building: 'Tiruppur Export Hub', buildingId: 'BLD-007', floor: 9, type: 'CO₂', weight: '4.5 kg', installDate: '2025-05-01', expiryDate: '2027-05-01', status: 'Active', lastInspection: '2026-05-28', location: 'Warehouse Bay A' },
  { id: 'EXT-2410', companyId: 'COMP-002', supplierId: 'SUP-002', building: 'Salem Corporate Park', buildingId: 'BLD-008', floor: 6, type: 'Foam', weight: '9 ltr', installDate: '2024-09-30', expiryDate: '2026-09-30', status: 'Active', lastInspection: '2026-04-30', location: 'Conference Wing' },
  { id: 'EXT-2411', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'NGP Tech Park', buildingId: 'BLD-001', floor: 36, type: 'CO₂', weight: '4.5 kg', installDate: '2025-01-10', expiryDate: '2027-01-10', status: 'Active', lastInspection: '2026-05-10', location: 'Executive Floor' },
  { id: 'EXT-2412', companyId: 'COMP-001', supplierId: 'SUP-001', building: 'Coimbatore Central Tower', buildingId: 'BLD-002', floor: 18, type: 'Dry Powder', weight: '6 kg', installDate: '2023-12-01', expiryDate: '2025-12-01', status: 'Expired', lastInspection: '2026-02-01', location: 'Service Corridor' },
];

export const replacementHistory = [
  { id: 'REP-001', extinguisherId: 'EXT-2402', oldUnit: 'EXT-2402', newUnit: 'EXT-2413', buildingId: 'BLD-001', date: '2026-03-10', reason: 'Expiry', technician: 'ABC Fire Safety Team', cost: '₹3,200' },
];

export const audits = [
  { id: 'AUD-2601', companyId: 'COMP-001', building: 'NGP Tech Park', buildingId: 'BLD-001', auditor: 'Priya Sharma', auditorId: 'USR-006', date: '2026-05-12', findings: 'Minor issues with signage on floors 8-10. All extinguishers functional.', complianceScore: 94, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2602', companyId: 'COMP-001', building: 'Coimbatore Central Tower', buildingId: 'BLD-002', auditor: 'Priya Sharma', auditorId: 'USR-006', date: '2026-04-08', findings: '3 expired extinguishers on floors 12-14. Exit routes partially blocked.', complianceScore: 71, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2603', companyId: 'COMP-001', building: 'FireGuard Corporate Center', buildingId: 'BLD-003', auditor: 'Karthik Rao', auditorId: 'USR-007', date: '2025-12-15', findings: 'Critical: Multiple expired extinguishers, overdue sprinkler inspection, blocked fire exits.', complianceScore: 42, status: 'Overdue', reportUrl: '#' },
  { id: 'AUD-2604', companyId: 'COMP-001', building: 'Marina Business Hub', buildingId: 'BLD-004', auditor: 'Karthik Rao', auditorId: 'USR-007', date: '2026-05-20', findings: 'All systems operational. Minor documentation gaps found.', complianceScore: 88, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2605', companyId: 'COMP-002', building: 'Meenakshi Industrial Complex', buildingId: 'BLD-005', auditor: 'Priya Sharma', auditorId: 'USR-006', date: '2026-03-01', findings: 'Fire suppression system needs service. 5 extinguishers expiring within 30 days.', complianceScore: 61, status: 'Action Required', reportUrl: '#' },
  { id: 'AUD-2606', companyId: 'COMP-002', building: 'Tiruppur Export Hub', buildingId: 'BLD-007', auditor: 'Suresh Iyer', auditorId: 'USR-008', date: '2026-05-28', findings: 'Excellent compliance. All safety systems up to date. Recommended for certification renewal.', complianceScore: 97, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2607', companyId: 'COMP-002', building: 'Salem Corporate Park', buildingId: 'BLD-008', auditor: 'Suresh Iyer', auditorId: 'USR-008', date: '2026-04-22', findings: 'Smoke detectors on floors 5-7 need battery replacement. Evacuation plan outdated.', complianceScore: 76, status: 'Completed', reportUrl: '#' },
];

export const upcomingAudits = [
  { id: 'SCH-001', companyId: 'COMP-001', building: 'FireGuard Corporate Center', buildingId: 'BLD-003', date: '2026-06-18', auditor: 'Karthik Rao', auditorId: 'USR-007', priority: 'Critical', status: 'Scheduled' },
  { id: 'SCH-002', companyId: 'COMP-002', building: 'Meenakshi Industrial Complex', buildingId: 'BLD-005', date: '2026-06-22', auditor: 'Priya Sharma', auditorId: 'USR-006', priority: 'High', status: 'Scheduled' },
  { id: 'SCH-003', companyId: 'COMP-002', building: 'Madurai Tech Square', buildingId: 'BLD-006', date: '2026-06-28', auditor: 'Suresh Iyer', auditorId: 'USR-008', priority: 'High', status: 'Scheduled' },
  { id: 'SCH-004', companyId: 'COMP-001', building: 'Coimbatore Central Tower', buildingId: 'BLD-002', date: '2026-07-08', auditor: 'Priya Sharma', auditorId: 'USR-006', priority: 'Medium', status: 'Scheduled' },
  { id: 'SCH-005', companyId: 'COMP-002', building: 'Salem Corporate Park', buildingId: 'BLD-008', date: '2026-07-22', auditor: 'Suresh Iyer', auditorId: 'USR-008', priority: 'Medium', status: 'Scheduled' },
];

export const contracts = [
  { id: 'CON-001', companyId: 'COMP-001', supplierId: 'SUP-001', supplierName: 'ABC Fire Safety Pvt Ltd', buildingId: 'BLD-001', buildingName: 'NGP Tech Park', type: 'Annual Maintenance', startDate: '2026-01-01', endDate: '2026-12-31', value: '₹1,80,000', status: 'Active', autoRenewal: true },
  { id: 'CON-002', companyId: 'COMP-001', supplierId: 'SUP-001', supplierName: 'ABC Fire Safety Pvt Ltd', buildingId: 'BLD-002', buildingName: 'Coimbatore Central Tower', type: 'Supply & Install', startDate: '2025-10-01', endDate: '2026-09-30', value: '₹1,20,000', status: 'Expiring', autoRenewal: false },
  { id: 'CON-003', companyId: 'COMP-001', supplierId: 'SUP-001', supplierName: 'ABC Fire Safety Pvt Ltd', buildingId: 'BLD-003', buildingName: 'FireGuard Corporate Center', type: 'Annual Maintenance', startDate: '2025-06-01', endDate: '2026-05-31', value: '₹96,000', status: 'Expired', autoRenewal: false },
  { id: 'CON-004', companyId: 'COMP-001', supplierId: 'SUP-002', supplierName: 'SafeGuard Systems Ltd', buildingId: 'BLD-004', buildingName: 'Marina Business Hub', type: 'Annual Maintenance', startDate: '2026-03-01', endDate: '2027-02-28', value: '₹84,000', status: 'Active', autoRenewal: true },
  { id: 'CON-005', companyId: 'COMP-002', supplierId: 'SUP-001', supplierName: 'ABC Fire Safety Pvt Ltd', buildingId: 'BLD-005', buildingName: 'Meenakshi Industrial Complex', type: 'Supply & Maintain', startDate: '2026-02-01', endDate: '2027-01-31', value: '₹2,10,000', status: 'Active', autoRenewal: true },
  { id: 'CON-006', companyId: 'COMP-002', supplierId: 'SUP-001', supplierName: 'ABC Fire Safety Pvt Ltd', buildingId: 'BLD-006', buildingName: 'Madurai Tech Square', type: 'Annual Maintenance', startDate: '2025-09-01', endDate: '2026-08-31', value: '₹60,000', status: 'Expiring', autoRenewal: false },
  { id: 'CON-007', companyId: 'COMP-002', supplierId: 'SUP-001', supplierName: 'ABC Fire Safety Pvt Ltd', buildingId: 'BLD-007', buildingName: 'Tiruppur Export Hub', type: 'Annual Maintenance', startDate: '2026-01-15', endDate: '2027-01-14', value: '₹1,44,000', status: 'Active', autoRenewal: true },
  { id: 'CON-008', companyId: 'COMP-002', supplierId: 'SUP-002', supplierName: 'SafeGuard Systems Ltd', buildingId: 'BLD-008', buildingName: 'Salem Corporate Park', type: 'Supply & Install', startDate: '2026-04-01', endDate: '2027-03-31', value: '₹72,000', status: 'Active', autoRenewal: false },
];

export const fireIncidents = [
  { id: 'INC-001', companyId: 'COMP-001', buildingId: 'BLD-003', building: 'FireGuard Corporate Center', date: '2026-04-14', time: '14:32', floor: 8, severity: 'High', cause: 'Electrical short circuit in server room', status: 'Resolved', resolution: 'Fire contained within 12 minutes. No casualties. Equipment damage estimated ₹3.2 lakhs.', notified: ['Building Owner', 'Supplier', 'Super Admin', 'Auditor'], createdBy: 'USR-001' },
  { id: 'INC-002', companyId: 'COMP-002', buildingId: 'BLD-006', building: 'Madurai Tech Square', date: '2026-05-22', time: '09:15', floor: 2, severity: 'Medium', cause: 'Kitchen equipment malfunction in cafeteria', status: 'Resolved', resolution: 'Smoke alarm triggered, evacuated floor 2, fire extinguished by staff. No injuries.', notified: ['Building Owner', 'Supplier', 'Super Admin'], createdBy: 'USR-001' },
  { id: 'INC-003', companyId: 'COMP-001', buildingId: 'BLD-002', building: 'Coimbatore Central Tower', date: '2026-06-05', time: '16:45', floor: 14, severity: 'Low', cause: 'False alarm — dust accumulation on smoke sensor', status: 'Investigating', resolution: '', notified: ['Building Owner', 'Auditor'], createdBy: 'USR-002' },
];

export const alerts = [
  { id: 'ALT-001', companyId: 'COMP-001', type: 'Critical', building: 'FireGuard Corporate Center', message: 'Fire audit overdue by 84 days. Immediate action required.', time: '2 hours ago', read: false },
  { id: 'ALT-002', companyId: 'COMP-002', type: 'High', building: 'Meenakshi Industrial Complex', message: 'Scheduled audit overdue. 5 extinguishers expiring in 7 days.', time: '5 hours ago', read: false },
  { id: 'ALT-003', companyId: 'COMP-002', type: 'High', building: 'Madurai Tech Square', message: '3 extinguishers expired. Compliance score dropped to 55%.', time: '1 day ago', read: false },
  { id: 'ALT-004', companyId: 'COMP-001', type: 'Medium', building: 'Coimbatore Central Tower', message: 'Exit route obstruction reported on floors 12 & 13.', time: '2 days ago', read: true },
  { id: 'ALT-005', companyId: 'COMP-002', type: 'Medium', building: 'Salem Corporate Park', message: 'Smoke detectors require battery replacement — floors 5-7.', time: '3 days ago', read: true },
  { id: 'ALT-006', companyId: 'COMP-001', type: 'Low', building: 'Marina Business Hub', message: 'Annual compliance certification renewal due in 45 days.', time: '4 days ago', read: true },
  { id: 'ALT-007', companyId: 'COMP-001', type: 'High', building: 'NGP Tech Park', message: 'Contract CON-002 expires in 23 days. Renewal required.', time: '6 hours ago', read: false },
];

export const complianceTrend = [
  { month: 'Jan', score: 72, target: 85 },
  { month: 'Feb', score: 68, target: 85 },
  { month: 'Mar', score: 74, target: 85 },
  { month: 'Apr', score: 79, target: 85 },
  { month: 'May', score: 76, target: 85 },
  { month: 'Jun', score: 81, target: 85 },
  { month: 'Jul', score: 84, target: 85 },
  { month: 'Aug', score: 82, target: 85 },
  { month: 'Sep', score: 87, target: 85 },
  { month: 'Oct', score: 85, target: 85 },
  { month: 'Nov', score: 89, target: 85 },
  { month: 'Dec', score: 91, target: 85 },
];

// ─── USERS (5 Demo Accounts + supporting cast) ──────────────────────────────
export const users = [
  // === DEMO ACCOUNTS ===
  {
    id: 'USR-001', name: 'Siva Kumar', email: 'siva@fireguard.ai', password: 'demo123',
    role: 'Super Admin', status: 'Active', lastLogin: '2026-06-12',
    buildings: 'All', companyId: null, companyName: 'FireGuard AI (Platform)',
    phone: '+91 98420 00001', department: 'Platform Management',
  },
  {
    id: 'USR-002', name: 'ABC Fire Safety Pvt Ltd', email: 'supplier@abcfire.com', password: 'demo123',
    role: 'Supplier', status: 'Active', lastLogin: '2026-06-11',
    buildings: 'BLD-001,BLD-002,BLD-003,BLD-005,BLD-006,BLD-007',
    companyId: null, companyName: 'ABC Fire Safety Pvt Ltd',
    supplierId: 'SUP-001',
    phone: '+91 98421 55001', department: 'Operations',
  },
  {
    id: 'USR-003', name: 'NGP Tech Park', email: 'owner@ngp.com', password: 'demo123',
    role: 'Building Owner', status: 'Active', lastLogin: '2026-06-10',
    buildings: 'BLD-001', companyId: 'COMP-001', companyName: 'Acme Corp',
    buildingId: 'BLD-001',
    phone: '+91 98422 00003', department: 'Facilities',
  },
  {
    id: 'USR-006', name: 'Priya Sharma', email: 'auditor@fireguard.ai', password: 'demo123',
    role: 'Auditor', status: 'Active', lastLogin: '2026-06-09',
    buildings: 'BLD-001,BLD-002,BLD-005', companyId: null, companyName: 'FireGuard AI (Audit)',
    phone: '+91 98423 00006', department: 'Compliance',
  },
  {
    id: 'USR-004', name: 'Analyst User', email: 'analyst@fireguard.ai', password: 'demo123',
    role: 'Analyst', status: 'Active', lastLogin: '2026-06-08',
    buildings: 'BLD-003', companyId: 'COMP-001', companyName: 'Acme Corp',
    phone: '+91 98424 00004', department: 'Analytics',
  },
  // === SUPPORTING USERS ===
  {
    id: 'USR-005', name: 'Arjun Kapoor', email: 'arjun@fireguard.ai', password: 'admin123',
    role: 'Super Admin', status: 'Active', lastLogin: '2026-06-06',
    buildings: 'All', companyId: null, companyName: 'FireGuard AI (Platform)',
    phone: '+91 98420 00005', department: 'Platform Management',
  },
  {
    id: 'USR-007', name: 'Karthik Rao', email: 'karthik@acme.com', password: 'admin123',
    role: 'Auditor', status: 'Active', lastLogin: '2026-06-03',
    buildings: 'BLD-003,BLD-004', companyId: null, companyName: 'FireGuard AI (Audit)',
    phone: '+91 98425 00007', department: 'Compliance',
  },
  {
    id: 'USR-008', name: 'Suresh Iyer', email: 'suresh@global.com', password: 'admin123',
    role: 'Auditor', status: 'Active', lastLogin: '2026-05-28',
    buildings: 'BLD-006,BLD-007,BLD-008', companyId: null, companyName: 'FireGuard AI (Audit)',
    phone: '+91 98426 00008', department: 'Compliance',
  },
  {
    id: 'USR-009', name: 'Rajan Mehta', email: 'rajan@global.com', password: 'admin123',
    role: 'Company Admin', status: 'Active', lastLogin: '2026-06-04',
    buildings: 'All Global Industries', companyId: 'COMP-002', companyName: 'Global Industries',
    phone: '+91 98427 00009', department: 'Safety',
  },
];

export const permissions = {
  roles: ['Super Admin', 'Supplier', 'Building Owner', 'Auditor', 'Analyst', 'Company Admin'],
  modules: [
    { name: 'Dashboard',           permissions: [true,  true,  true,  true,  true,  true ] },
    { name: 'View Buildings',      permissions: [true,  true,  true,  true,  true,  true ] },
    { name: 'Manage Buildings',    permissions: [true,  false, false, false, false, true ] },
    { name: 'View Extinguishers',  permissions: [true,  true,  true,  true,  true,  true ] },
    { name: 'Manage Extinguishers',permissions: [true,  false, false, false, false, true ] },
    { name: 'Create Audits',       permissions: [true,  false, false, true,  false, true ] },
    { name: 'View Audits',         permissions: [true,  false, true,  true,  true,  true ] },
    { name: 'AI Risk Analysis',    permissions: [true,  false, false, false, true,  true ] },
    { name: 'AI Assistant',        permissions: [true,  false, false, false, true,  true ] },
    { name: 'Generate Reports',    permissions: [true,  true,  false, true,  true,  true ] },
    { name: 'Supplier Management', permissions: [true,  true,  false, false, false, false] },
    { name: 'Contract Management', permissions: [true,  true,  false, false, false, true ] },
    { name: 'Fire Incidents',      permissions: [true,  true,  true,  true,  false, true ] },
    { name: 'Manage Company Users',permissions: [true,  false, false, false, false, true ] },
    { name: 'Manage All Companies',permissions: [true,  false, false, false, false, false] },
    { name: 'System Analytics',    permissions: [true,  false, false, false, false, false] },
  ]
};

export const aiRiskData = {
  buildings: [
    {
      id: 'BLD-003', companyId: 'COMP-001', name: 'FireGuard Corporate Center',
      riskScore: 84, riskLevel: 'Critical',
      factors: [
        { factor: 'Expired Extinguishers', severity: 'Critical', impact: 35, description: '12 extinguishers expired, covering floors 1-6 and 14-18' },
        { factor: 'Overdue Audit', severity: 'High', impact: 28, description: 'Last audit conducted 172 days ago, exceeding 90-day mandate' },
        { factor: 'Expired Contract', severity: 'High', impact: 21, description: 'Maintenance contract expired 12 days ago' },
      ],
      recommendations: [
        { action: 'Replace 12 expired extinguishers immediately', priority: 'Critical', deadline: '2026-06-18', estimatedCost: '₹48,000' },
        { action: 'Schedule emergency compliance audit', priority: 'Critical', deadline: '2026-06-18', estimatedCost: '₹15,000' },
        { action: 'Renew maintenance contract with ABC Fire Safety', priority: 'High', deadline: '2026-06-25', estimatedCost: '₹96,000/yr' },
      ],
      complianceBreakdown: [
        { area: 'Fire Extinguishers', score: 28 }, { area: 'Sprinkler System', score: 45 },
        { area: 'Evacuation Plans', score: 60 }, { area: 'Smoke Detectors', score: 55 },
      ]
    },
    {
      id: 'BLD-005', companyId: 'COMP-002', name: 'Meenakshi Industrial Complex',
      riskScore: 72, riskLevel: 'High',
      factors: [
        { factor: 'Expiring Extinguishers', severity: 'High', impact: 28, description: '5 extinguishers expiring within 15 days' },
        { factor: 'Outdated Fire Suppression', severity: 'Medium', impact: 20, description: 'Fire suppression system last serviced 8 months ago' },
      ],
      recommendations: [
        { action: 'Replace 5 expiring extinguishers', priority: 'High', deadline: '2026-06-22', estimatedCost: '₹20,000' },
        { action: 'Service fire suppression system', priority: 'Medium', deadline: '2026-07-01', estimatedCost: '₹35,000' },
      ],
      complianceBreakdown: [
        { area: 'Fire Extinguishers', score: 60 }, { area: 'Sprinkler System', score: 55 },
        { area: 'Evacuation Plans', score: 78 }, { area: 'Smoke Detectors', score: 72 },
      ]
    },
    {
      id: 'BLD-006', companyId: 'COMP-002', name: 'Madurai Tech Square',
      riskScore: 78, riskLevel: 'High',
      factors: [
        { factor: 'Expired Extinguishers', severity: 'High', impact: 30, description: '3 extinguishers expired on floors 2, 4, 7' },
        { factor: 'Incident History', severity: 'Medium', impact: 18, description: 'Kitchen fire incident recorded 3 weeks ago' },
      ],
      recommendations: [
        { action: 'Replace 3 expired extinguishers', priority: 'High', deadline: '2026-06-20', estimatedCost: '₹12,000' },
        { action: 'Kitchen safety inspection', priority: 'Medium', deadline: '2026-06-28', estimatedCost: '₹8,000' },
      ],
      complianceBreakdown: [
        { area: 'Fire Extinguishers', score: 45 }, { area: 'Sprinkler System', score: 62 },
        { area: 'Evacuation Plans', score: 70 }, { area: 'Smoke Detectors', score: 58 },
      ]
    },
  ]
};

export const chatHistory = [
  { id: 1, role: 'ai', content: 'Hello! I\'m **FireGuard AI Assistant**. I can help you analyze fire safety compliance, identify risks, and generate reports across your portfolio.\n\nTry asking me:\n- "Which buildings have expired extinguishers?"\n- "Show me high risk buildings"\n- "What audits are due this month?"', timestamp: new Date().toISOString() }
];
