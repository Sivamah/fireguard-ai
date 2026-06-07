
import React from 'react';
import './ComplianceScore.css';

const ComplianceScore = ({ score = 0, loading = false }) => {
    // Calculate stroke dashoffset for the circle progress
    // Radius = 50, Circumference = 2 * pi * 50 ≈ 314
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s >= 80) return 'var(--color-accent-green)';
        if (s >= 50) return 'var(--color-accent-yellow)';
        return 'var(--color-accent-red)';
    };

    if (loading) return <div className="card loading-state">Loading Score...</div>;

    return (
        <div className="card compliance-card">
            <h3 className="card-title">Global Compliance Score</h3>
            <div className="score-circle-container">
                <svg width="140" height="140" className="score-svg">
                    <circle
                        className="score-bg"
                        cx="70"
                        cy="70"
                        r={radius}
                    />
                    <circle
                        className="score-progress"
                        cx="70"
                        cy="70"
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        stroke={getColor(score)}
                    />
                </svg>
                <div className="score-value">
                    <span className="number">{score}%</span>
                    <span className="label">Safe</span>
                </div>
            </div>
            <div className="compliance-footer">
                <div className="stat-item">
                    <span className="dot safe"></span>
                    <span>8 Active</span>
                </div>
                <div className="stat-item">
                    <span className="dot warning"></span>
                    <span>2 Warning</span>
                </div>
            </div>
        </div>
    );
};

export default ComplianceScore;
