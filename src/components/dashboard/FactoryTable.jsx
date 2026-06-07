
import React from 'react';
import { Eye, Download } from 'lucide-react';
import './FactoryTable.css';

const FactoryTable = ({ factories = [], loading = false }) => {
    const getStatusBadge = (status) => {
        let className = 'badge-default';
        if (status === 'Safe') className = 'badge-safe';
        if (status === 'Warning') className = 'badge-warning';
        if (status === 'Critical') className = 'badge-critical';

        return <span className={`status-badge ${className}`}>{status}</span>;
    };

    const getComplianceColor = (val) => {
        if (val >= 80) return 'text-safe';
        if (val >= 50) return 'text-warning';
        return 'text-critical';
    };

    return (
        <div className="card table-card">
            <div className="card-header-row">
                <h3 className="card-title">Multi-Factory Monitoring</h3>
                <button className="primary-btn">
                    <Download size={16} /> Export Report
                </button>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Factory Name</th>
                            <th>Location</th>
                            <th>Compliance %</th>
                            <th>Last Audit</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center loading-cell">Loading table data...</td>
                            </tr>
                        ) : factories.length > 0 ? (
                            factories.map((factory) => (
                                <tr key={factory.id}>
                                    <td className="fw-500">{factory.name}</td>
                                    <td className="text-light">{factory.location}</td>
                                    <td>
                                        <div className="compliance-wrapper">
                                            <div className="progress-bar-bg">
                                                <div
                                                    className={`progress-bar-fill ${factory.compliance >= 80 ? 'bg-safe' : factory.compliance >= 50 ? 'bg-warning' : 'bg-critical'}`}
                                                    style={{ width: `${factory.compliance}%` }}
                                                ></div>
                                            </div>
                                            <span className={`compliance-val ${getComplianceColor(factory.compliance)}`}>{factory.compliance}%</span>
                                        </div>
                                    </td>
                                    <td className="text-light">{factory.lastAudit}</td>
                                    <td>{getStatusBadge(factory.status)}</td>
                                    <td>
                                        <button className="action-btn" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FactoryTable;
