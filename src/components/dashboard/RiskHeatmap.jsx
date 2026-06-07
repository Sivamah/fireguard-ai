
import React from 'react';
import './RiskHeatmap.css';

const RiskHeatmap = ({ buildings = [], loading = false }) => {
    if (loading) return <div className="card loading-state">Loading Risk Map...</div>;

    return (
        <div className="card risk-card">
            <div className="card-header-row">
                <h3 className="card-title">Risk Heatmap</h3>
                <span className="legend-hint">Live Data</span>
            </div>

            <div className="heatmap-grid">
                {buildings.map((building) => (
                    <div
                        key={building.id}
                        className={`heat-block risks-${building.riskLevel}`}
                        title={`${building.name}: ${building.riskScore}% Risk`}
                    >
                        <span className="block-name">{building.code}</span>
                    </div>
                ))}
                {/* Fillers for grid visuals if needed */}
                {[...Array(4)].map((_, i) => <div key={`empty-${i}`} className="heat-block empty"></div>)}
            </div>

            <div className="risk-legend">
                <div className="legend-item">
                    <span className="box low"></span> Low
                </div>
                <div className="legend-item">
                    <span className="box med"></span> Med
                </div>
                <div className="legend-item">
                    <span className="box high"></span> High
                </div>
                <div className="legend-item">
                    <span className="box crit"></span> Crit
                </div>
            </div>
        </div>
    );
};

export default RiskHeatmap;
