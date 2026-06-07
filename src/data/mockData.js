// ============================================================
// FireGuard AI — Mock Data
// ============================================================

export const buildings = [
  { id: 'BLD-001', name: 'Nexus Tower', location: 'Downtown, Mumbai', floors: 42, complianceScore: 94, riskScore: 18, riskLevel: 'Low', lastAudit: '2026-05-12', nextAudit: '2026-08-12', extinguishers: 128, alerts: 0 },
  { id: 'BLD-002', name: 'Helix Business Park', location: 'BKC, Mumbai', floors: 28, complianceScore: 71, riskScore: 64, riskLevel: 'Medium', lastAudit: '2026-04-08', nextAudit: '2026-07-08', extinguishers: 84, alerts: 3 },
  { id: 'BLD-003', name: 'Prism Corporate Center', location: 'Andheri, Mumbai', floors: 18, complianceScore: 42, riskScore: 84, riskLevel: 'Critical', lastAudit: '2025-12-15', nextAudit: '2026-03-15', extinguishers: 56, alerts: 7 },
  { id: 'BLD-004', name: 'Azure Tech Hub', location: 'Pune', floors: 14, complianceScore: 88, riskScore: 28, riskLevel: 'Low', lastAudit: '2026-05-20', nextAudit: '2026-08-20', extinguishers: 42, alerts: 1 },
  { id: 'BLD-005', name: 'Meridian Plaza', location: 'Bangalore', floors: 22, complianceScore: 61, riskScore: 72, riskLevel: 'High', lastAudit: '2026-03-01', nextAudit: '2026-06-01', extinguishers: 66, alerts: 5 },
  { id: 'BLD-006', name: 'Vertex Industrial Complex', location: 'Chennai', floors: 8, complianceScore: 55, riskScore: 78, riskLevel: 'High', lastAudit: '2026-02-14', nextAudit: '2026-05-14', extinguishers: 24, alerts: 4 },
  { id: 'BLD-007', name: 'Luminary Office Suites', location: 'Hyderabad', floors: 16, complianceScore: 97, riskScore: 12, riskLevel: 'Low', lastAudit: '2026-05-28', nextAudit: '2026-08-28', extinguishers: 48, alerts: 0 },
  { id: 'BLD-008', name: 'Solaris Campus Block D', location: 'Gurgaon', floors: 12, complianceScore: 76, riskScore: 52, riskLevel: 'Medium', lastAudit: '2026-04-22', nextAudit: '2026-07-22', extinguishers: 36, alerts: 2 },
];

export const extinguishers = [
  { id: 'EXT-2401', building: 'Nexus Tower', buildingId: 'BLD-001', floor: 12, type: 'CO₂', installDate: '2024-01-15', expiryDate: '2026-01-15', status: 'Active', lastInspection: '2026-05-01' },
  { id: 'EXT-2402', building: 'Nexus Tower', buildingId: 'BLD-001', floor: 24, type: 'Dry Powder', installDate: '2024-02-20', expiryDate: '2026-02-20', status: 'Expired', lastInspection: '2026-04-15' },
  { id: 'EXT-2403', building: 'Helix Business Park', buildingId: 'BLD-002', floor: 5, type: 'Water Mist', installDate: '2023-11-10', expiryDate: '2026-07-10', status: 'Expiring Soon', lastInspection: '2026-05-10' },
  { id: 'EXT-2404', building: 'Prism Corporate Center', buildingId: 'BLD-003', floor: 3, type: 'CO₂', installDate: '2022-08-05', expiryDate: '2025-08-05', status: 'Expired', lastInspection: '2025-11-01' },
  { id: 'EXT-2405', building: 'Prism Corporate Center', buildingId: 'BLD-003', floor: 8, type: 'Foam', installDate: '2022-08-05', expiryDate: '2025-08-05', status: 'Expired', lastInspection: '2025-11-01' },
  { id: 'EXT-2406', building: 'Azure Tech Hub', buildingId: 'BLD-004', floor: 7, type: 'CO₂', installDate: '2025-03-18', expiryDate: '2027-03-18', status: 'Active', lastInspection: '2026-05-18' },
  { id: 'EXT-2407', building: 'Meridian Plaza', buildingId: 'BLD-005', floor: 14, type: 'Dry Powder', installDate: '2023-06-22', expiryDate: '2026-06-22', status: 'Expiring Soon', lastInspection: '2026-04-22' },
  { id: 'EXT-2408', building: 'Vertex Industrial Complex', buildingId: 'BLD-006', floor: 2, type: 'Water Mist', installDate: '2022-04-14', expiryDate: '2025-04-14', status: 'Expired', lastInspection: '2025-10-01' },
  { id: 'EXT-2409', building: 'Luminary Office Suites', buildingId: 'BLD-007', floor: 9, type: 'CO₂', installDate: '2025-05-01', expiryDate: '2027-05-01', status: 'Active', lastInspection: '2026-05-28' },
  { id: 'EXT-2410', building: 'Solaris Campus Block D', buildingId: 'BLD-008', floor: 6, type: 'Foam', installDate: '2024-09-30', expiryDate: '2026-09-30', status: 'Active', lastInspection: '2026-04-30' },
  { id: 'EXT-2411', building: 'Nexus Tower', buildingId: 'BLD-001', floor: 36, type: 'CO₂', installDate: '2025-01-10', expiryDate: '2027-01-10', status: 'Active', lastInspection: '2026-05-10' },
  { id: 'EXT-2412', building: 'Helix Business Park', buildingId: 'BLD-002', floor: 18, type: 'Dry Powder', installDate: '2023-12-01', expiryDate: '2025-12-01', status: 'Expired', lastInspection: '2026-02-01' },
];

export const audits = [
  { id: 'AUD-2601', building: 'Nexus Tower', buildingId: 'BLD-001', auditor: 'Priya Sharma', date: '2026-05-12', findings: 'Minor issues with signage on floors 8-10. All extinguishers functional.', complianceScore: 94, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2602', building: 'Helix Business Park', buildingId: 'BLD-002', auditor: 'Rajan Mehta', date: '2026-04-08', findings: '3 expired extinguishers on floors 12-14. Exit routes partially blocked.', complianceScore: 71, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2603', building: 'Prism Corporate Center', buildingId: 'BLD-003', auditor: 'Anjali Nair', date: '2025-12-15', findings: 'Critical: Multiple expired extinguishers, overdue sprinkler inspection, blocked fire exits.', complianceScore: 42, status: 'Overdue', reportUrl: '#' },
  { id: 'AUD-2604', building: 'Azure Tech Hub', buildingId: 'BLD-004', auditor: 'Suresh Iyer', date: '2026-05-20', findings: 'All systems operational. Minor documentation gaps found.', complianceScore: 88, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2605', building: 'Meridian Plaza', buildingId: 'BLD-005', auditor: 'Priya Sharma', date: '2026-03-01', findings: 'Fire suppression system needs service. 5 extinguishers expiring within 30 days.', complianceScore: 61, status: 'Action Required', reportUrl: '#' },
  { id: 'AUD-2606', building: 'Luminary Office Suites', buildingId: 'BLD-007', auditor: 'Karthik Rao', date: '2026-05-28', findings: 'Excellent compliance. All safety systems up to date. Recommended for certification renewal.', complianceScore: 97, status: 'Completed', reportUrl: '#' },
  { id: 'AUD-2607', building: 'Solaris Campus Block D', buildingId: 'BLD-008', auditor: 'Rajan Mehta', date: '2026-04-22', findings: 'Smoke detectors on floors 5-7 need battery replacement. Evacuation plan outdated.', complianceScore: 76, status: 'Completed', reportUrl: '#' },
];

export const upcomingAudits = [
  { id: 'SCH-001', building: 'Prism Corporate Center', date: '2026-06-10', auditor: 'Anjali Nair', priority: 'Critical' },
  { id: 'SCH-002', building: 'Meridian Plaza', date: '2026-06-15', auditor: 'Priya Sharma', priority: 'High' },
  { id: 'SCH-003', building: 'Vertex Industrial Complex', date: '2026-06-20', auditor: 'Suresh Iyer', priority: 'High' },
  { id: 'SCH-004', building: 'Helix Business Park', date: '2026-07-08', auditor: 'Rajan Mehta', priority: 'Medium' },
  { id: 'SCH-005', building: 'Solaris Campus Block D', date: '2026-07-22', auditor: 'Karthik Rao', priority: 'Medium' },
];

export const alerts = [
  { id: 'ALT-001', type: 'Critical', building: 'Prism Corporate Center', message: 'Fire audit overdue by 84 days. Immediate action required.', time: '2 hours ago', read: false },
  { id: 'ALT-002', type: 'High', building: 'Meridian Plaza', message: 'Scheduled audit overdue. 5 extinguishers expiring in 7 days.', time: '5 hours ago', read: false },
  { id: 'ALT-003', type: 'High', building: 'Vertex Industrial Complex', message: '3 extinguishers expired. Compliance score dropped to 55%.', time: '1 day ago', read: false },
  { id: 'ALT-004', type: 'Medium', building: 'Helix Business Park', message: 'Exit route obstruction reported on floors 12 & 13.', time: '2 days ago', read: true },
  { id: 'ALT-005', type: 'Medium', building: 'Solaris Campus Block D', message: 'Smoke detectors require battery replacement — floors 5-7.', time: '3 days ago', read: true },
  { id: 'ALT-006', type: 'Low', building: 'Azure Tech Hub', message: 'Annual compliance certification renewal due in 45 days.', time: '4 days ago', read: true },
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

export const riskDistribution = [
  { name: 'Low Risk', value: 38, color: '#22C55E' },
  { name: 'Medium Risk', value: 27, color: '#F59E0B' },
  { name: 'High Risk', value: 22, color: '#F97316' },
  { name: 'Critical', value: 13, color: '#EF4444' },
];

export const extinguisherStatus = [
  { name: 'Active', value: 68, color: '#22C55E' },
  { name: 'Expiring Soon', value: 18, color: '#F59E0B' },
  { name: 'Expired', value: 14, color: '#EF4444' },
];

export const users = [
  { id: 'USR-001', name: 'Arjun Kapoor', email: 'arjun.kapoor@fireguard.ai', role: 'Admin', status: 'Active', lastLogin: '2026-06-06', buildings: 'All' },
  { id: 'USR-002', name: 'Priya Sharma', email: 'priya.sharma@fireguard.ai', role: 'Auditor', status: 'Active', lastLogin: '2026-06-05', buildings: 'Nexus Tower, Meridian Plaza' },
  { id: 'USR-003', name: 'Rajan Mehta', email: 'rajan.mehta@fireguard.ai', role: 'Auditor', status: 'Active', lastLogin: '2026-06-04', buildings: 'Helix Business Park, Solaris Campus' },
  { id: 'USR-004', name: 'Anjali Nair', email: 'anjali.nair@fireguard.ai', role: 'Analyst', status: 'Active', lastLogin: '2026-06-06', buildings: 'Prism Corporate Center' },
  { id: 'USR-005', name: 'Suresh Iyer', email: 'suresh.iyer@fireguard.ai', role: 'Analyst', status: 'Inactive', lastLogin: '2026-05-28', buildings: 'Azure Tech Hub, Vertex Industrial' },
  { id: 'USR-006', name: 'Karthik Rao', email: 'karthik.rao@fireguard.ai', role: 'Viewer', status: 'Active', lastLogin: '2026-06-03', buildings: 'Luminary Office Suites' },
];

export const permissions = {
  roles: ['Admin', 'Auditor', 'Analyst', 'Viewer'],
  modules: [
    { name: 'Dashboard', permissions: [true, true, true, true] },
    { name: 'View Buildings', permissions: [true, true, true, true] },
    { name: 'Manage Buildings', permissions: [true, false, false, false] },
    { name: 'View Extinguishers', permissions: [true, true, true, true] },
    { name: 'Manage Extinguishers', permissions: [true, true, false, false] },
    { name: 'Create Audits', permissions: [true, true, false, false] },
    { name: 'View Audits', permissions: [true, true, true, true] },
    { name: 'AI Risk Analysis', permissions: [true, true, true, false] },
    { name: 'AI Assistant', permissions: [true, true, true, false] },
    { name: 'Generate Reports', permissions: [true, true, true, false] },
    { name: 'Export Data', permissions: [true, true, false, false] },
    { name: 'Manage Users', permissions: [true, false, false, false] },
    { name: 'System Settings', permissions: [true, false, false, false] },
  ]
};

export const aiRiskData = {
  buildings: [
    {
      id: 'BLD-003',
      name: 'Prism Corporate Center',
      riskScore: 84,
      riskLevel: 'Critical',
      factors: [
        { factor: 'Expired Extinguishers', severity: 'Critical', impact: 35, description: '12 extinguishers expired, covering floors 1-6 and 14-18' },
        { factor: 'Overdue Audit', severity: 'High', impact: 28, description: 'Last audit conducted 172 days ago, exceeding 90-day mandate' },
        { factor: 'Missing Inspections', severity: 'High', impact: 21, description: 'Sprinkler inspection missed for 2 consecutive quarters' },
      ],
      recommendations: [
        { action: 'Replace 12 expired extinguishers', priority: 'Critical', deadline: '2026-06-10', estimatedCost: '₹48,000' },
        { action: 'Schedule emergency audit immediately', priority: 'Critical', deadline: '2026-06-10', estimatedCost: '₹15,000' },
        { action: 'Commission sprinkler system inspection', priority: 'High', deadline: '2026-06-20', estimatedCost: '₹22,000' },
        { action: 'Update fire evacuation plan', priority: 'Medium', deadline: '2026-06-30', estimatedCost: '₹5,000' },
      ],
      complianceBreakdown: [
        { area: 'Fire Extinguishers', score: 28 },
        { area: 'Sprinkler System', score: 45 },
        { area: 'Evacuation Plans', score: 60 },
        { area: 'Fire Exits', score: 55 },
        { area: 'Alarm Systems', score: 72 },
        { area: 'Documentation', score: 40 },
      ]
    },
    {
      id: 'BLD-005',
      name: 'Meridian Plaza',
      riskScore: 72,
      riskLevel: 'High',
      factors: [
        { factor: 'Expiring Extinguishers', severity: 'High', impact: 28, description: '5 extinguishers expiring within 15 days' },
        { factor: 'Overdue Service', severity: 'Medium', impact: 22, description: 'Fire suppression system service overdue by 45 days' },
        { factor: 'Stale Audit', severity: 'Medium', impact: 18, description: 'Audit conducted 97 days ago' },
      ],
      recommendations: [
        { action: 'Replace 5 expiring extinguishers', priority: 'High', deadline: '2026-06-15', estimatedCost: '₹20,000' },
        { action: 'Service fire suppression system', priority: 'High', deadline: '2026-06-20', estimatedCost: '₹35,000' },
        { action: 'Schedule routine audit', priority: 'Medium', deadline: '2026-06-30', estimatedCost: '₹12,000' },
      ],
      complianceBreakdown: [
        { area: 'Fire Extinguishers', score: 60 },
        { area: 'Sprinkler System', score: 55 },
        { area: 'Evacuation Plans', score: 78 },
        { area: 'Fire Exits', score: 70 },
        { area: 'Alarm Systems', score: 80 },
        { area: 'Documentation', score: 65 },
      ]
    },
    {
      id: 'BLD-006',
      name: 'Vertex Industrial Complex',
      riskScore: 78,
      riskLevel: 'High',
      factors: [
        { factor: 'Expired Extinguishers', severity: 'High', impact: 25, description: '3 extinguishers expired on factory floor' },
        { factor: 'Evacuation Drill', severity: 'Medium', impact: 20, description: 'No documented evacuation drill in past 6 months' },
      ],
      recommendations: [
        { action: 'Replace 3 expired extinguishers', priority: 'High', deadline: '2026-06-12', estimatedCost: '₹12,000' },
        { action: 'Conduct factory-wide evacuation drill', priority: 'Medium', deadline: '2026-06-25', estimatedCost: '₹0' },
      ],
      complianceBreakdown: [
        { area: 'Fire Extinguishers', score: 40 },
        { area: 'Sprinkler System', score: 85 },
        { area: 'Evacuation Plans', score: 30 },
        { area: 'Fire Exits', score: 90 },
        { area: 'Alarm Systems', score: 85 },
        { area: 'Documentation', score: 45 },
      ]
    }
  ]
};

export const chatHistory = [
  {
    id: 1,
    role: 'ai',
    content: 'Hello! I\'m **FireGuard AI Assistant**. I can help you analyze fire safety compliance, identify risks, and generate reports across your portfolio.\n\nTry asking me about high-risk buildings, expiring equipment, or compliance summaries.',
    timestamp: new Date().toISOString()
  }
];
