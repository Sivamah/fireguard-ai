
import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import './InspectionAlerts.css';

const InspectionAlerts = ({ alerts = [], loading = false }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'critical': return <AlertCircle size={18} color="var(--color-accent-red)" />;
            case 'warning': return <AlertTriangle size={18} color="var(--color-accent-yellow)" />;
            default: return <CheckCircle size={18} color="var(--color-accent-green)" />;
        }
    };

    if (loading) return <div className="card loading-state">Loading Alerts...</div>;

    return (
        <div className="card alerts-card">
            <div className="card-header-row">
                <h3 className="card-title">Real-time Alerts</h3>
                <button className="view-all-btn">View All</button>
            </div>

            <div className="alerts-list">
                {alerts.length === 0 ? (
                    <div className="empty-state">No active alerts</div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className={`alert-item ${alert.type}`}>
                            <div className="alert-icon-wrapper">
                                {getIcon(alert.type)}
                            </div>
                            <div className="alert-content">
                                <span className="alert-msg">{alert.message}</span>
                                <span className="alert-time">{alert.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InspectionAlerts;
