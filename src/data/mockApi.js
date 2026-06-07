
// Mock Data Service
// Simulates API responses with delays

const mockDashboardData = {
    complianceScore: 82,
    riskHeatmap: [
        { id: 1, name: 'Factory A-1', code: 'A1', riskLevel: 'low', riskScore: 12 },
        { id: 2, name: 'Factory A-2', code: 'A2', riskLevel: 'low', riskScore: 5 },
        { id: 3, name: 'Factory B-1', code: 'B1', riskLevel: 'medium', riskScore: 45 },
        { id: 4, name: 'Factory B-2', code: 'B2', riskLevel: 'critical', riskScore: 92 },
        { id: 5, name: 'Storage C', code: 'C1', riskLevel: 'high', riskScore: 78 },
        { id: 6, name: 'Storage D', code: 'D1', riskLevel: 'low', riskScore: 15 },
        { id: 7, name: 'Admin Block', code: 'AD', riskLevel: 'low', riskScore: 2 },
        { id: 8, name: 'Chem Lab', code: 'CL', riskLevel: 'warning', riskScore: 60 },
    ],
    alerts: [
        { id: 1, type: 'critical', message: 'Fire Extinguisher Expired in Block B2', time: '10 mins ago' },
        { id: 2, type: 'warning', message: 'Sprinkler Pressure Low in Zone 4', time: '45 mins ago' },
        { id: 3, type: 'safe', message: 'Monthly Drill Completed Successfully', time: '2 hours ago' },
        { id: 4, type: 'warning', message: 'Emergency Exit B obstructed', time: '5 hours ago' },
    ],
    factories: [
        { id: 101, name: 'Chennai Plant A', location: 'Chennai, IN', compliance: 95, status: 'Safe', lastAudit: '2023-12-10' },
        { id: 102, name: 'Mumbai Assembly', location: 'Mumbai, IN', compliance: 78, status: 'Warning', lastAudit: '2023-11-28' },
        { id: 103, name: 'Delhi Warehouse', location: 'Delhi, IN', compliance: 45, status: 'Critical', lastAudit: '2023-10-15' },
        { id: 104, name: 'Bangalore Tech Park', location: 'Bangalore, IN', compliance: 98, status: 'Safe', lastAudit: '2023-12-20' },
        { id: 105, name: 'Hyderabad Unit', location: 'Hyderabad, IN', compliance: 88, status: 'Safe', lastAudit: '2023-12-05' },
        { id: 106, name: 'Pune Factory', location: 'Pune, IN', compliance: 65, status: 'Warning', lastAudit: '2023-11-10' },
    ]
};

export const fetchDashboardData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockDashboardData);
        }, 1500); // Simulate network latency
    });
};
