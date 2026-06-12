import React, { useState, useEffect } from 'react';
import { BrainCircuit, AlertTriangle, ChevronRight, Zap, TrendingDown, RefreshCw } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { aiRiskData as initialAiRiskData, buildings as initialBuildings } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const RiskMeter = ({ score }) => {
  const angle = (score / 100) * 180;
  const color = score >= 75 ? '#EF4444' : score >= 50 ? '#F59E0B' : '#22C55E';
  const label = score >= 75 ? 'Critical' : score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low';

  return (
    <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
      <div style={{ position: 'relative', width: 200, height: 110, margin: '0 auto' }}>
        <svg width="200" height="110" viewBox="0 0 200 110">
          {/* Background arc */}
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="var(--border-light)" strokeWidth="16" strokeLinecap="round" />
          {/* Low zone */}
          <path d="M 10 100 A 90 90 0 0 1 73 28" fill="none" stroke="#22C55E" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
          {/* Medium zone */}
          <path d="M 73 28 A 90 90 0 0 1 127 28" fill="none" stroke="#F59E0B" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
          {/* High zone */}
          <path d="M 127 28 A 90 90 0 0 1 190 100" fill="none" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
          {/* Needle */}
          <g transform={`rotate(${angle - 90}, 100, 100)`}>
            <line x1="100" y1="100" x2="100" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="8" fill={color} />
            <circle cx="100" cy="100" r="4" fill="white" />
          </g>
        </svg>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>/100</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <span style={{
          padding: '6px 20px', borderRadius: 9999,
          background: color + '15', color, fontSize: 14, fontWeight: 700
        }}>{label} Risk</span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ color: 'var(--text-secondary)' }}>Score: <strong>{payload[0].value}%</strong></div>
      </div>
    );
  }
  return null;
};

export default function AIRisk() {
  const { user, isSuperAdmin } = useAuth();
  
  const buildings = React.useMemo(() => {
    return isSuperAdmin ? initialBuildings : initialBuildings.filter(b => b.companyId === user?.companyId);
  }, [isSuperAdmin, user]);
  
  const aiRiskData = React.useMemo(() => {
    return {
      buildings: isSuperAdmin ? initialAiRiskData.buildings : initialAiRiskData.buildings.filter(b => b.companyId === user?.companyId)
    };
  }, [isSuperAdmin, user]);

  const [selectedBuilding, setSelectedBuilding] = useState(aiRiskData.buildings[0] || null);
  
  React.useEffect(() => {
    setSelectedBuilding(aiRiskData.buildings[0] || null);
  }, [aiRiskData]);

  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuildingSelect = (b) => {
    setLoading(true);
    setAnimating(true);
    setTimeout(() => {
      setSelectedBuilding(b);
      setLoading(false);
    }, 600);
    setTimeout(() => setAnimating(false), 800);
  };

  const severityColors = { Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' };
  const priorityColors = { Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#3B82F6' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Cards */}
      <div className="grid grid-4" style={{ gap: 16 }}>
        {buildings.filter(b => b.riskLevel === 'Critical' || b.riskLevel === 'High').slice(0, 4).map((bldg, i) => {
          const isSelected = aiRiskData.buildings.find(ab => ab.id === bldg.id) && selectedBuilding?.id === bldg.id;
          const color = bldg.riskLevel === 'Critical' ? '#EF4444' : '#F97316';
          return (
            <div key={bldg.id}
              className="kpi-card animate-up"
              style={{
                cursor: 'pointer',
                border: isSelected ? `2px solid ${color}` : '1px solid var(--border-light)',
                background: isSelected ? `${color}05` : 'var(--bg-card)',
                animationDelay: `${i * 0.05}s`
              }}
              onClick={() => {
                const ab = aiRiskData.buildings.find(b2 => b2.id === bldg.id);
                if (ab) handleBuildingSelect(ab);
              }}
            >
              <div className="kpi-label">{bldg.name}</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, color: isSelected ? color : 'var(--text-primary)' }}>
                {bldg.riskScore}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                <span className={`badge badge-${bldg.riskLevel === 'Critical' ? 'danger' : 'warning'}`}>{bldg.riskLevel}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bldg.complianceScore}% compliant</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Panel */}
      <div className="grid" style={{ gridTemplateColumns: '320px 1fr', gap: 20 }}>

        {/* Building Selector */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Risk Profile</div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            {aiRiskData.buildings.map(b => (
              <div
                key={b.id}
                onClick={() => handleBuildingSelect(b)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${selectedBuilding?.id === b.id ? (b.riskLevel === 'Critical' ? '#EF4444' : '#F97316') : 'var(--border-light)'}`,
                  background: selectedBuilding?.id === b.id ? (b.riskLevel === 'Critical' ? '#FEF2F2' : '#FFF7ED') : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 8,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{b.id}</div>
                  </div>
                  <div style={{
                    fontSize: 20, fontWeight: 800,
                    color: b.riskScore >= 75 ? '#DC2626' : '#EA580C'
                  }}>{b.riskScore}</div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div className="progress-bar">
                    <div style={{
                      height: '100%',
                      width: `${b.riskScore}%`,
                      background: b.riskScore >= 75 ? '#EF4444' : '#F97316',
                      borderRadius: 9999,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <span className={`badge badge-${b.riskLevel === 'Critical' ? 'danger' : 'warning'}`} style={{ fontSize: 10 }}>{b.riskLevel}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.factors.length} risk factors</span>
                </div>
              </div>
            ))}

            {/* Other buildings (not in AI detail) */}
            {buildings.filter(b => !aiRiskData.buildings.find(ab => ab.id === b.id)).slice(0, 3).map(b => (
              <div key={b.id} style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)', marginBottom: 6,
                opacity: 0.6, cursor: 'default'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{b.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: b.riskScore < 30 ? '#22C55E' : 'var(--text-secondary)' }}>{b.riskScore}</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div className="progress-bar">
                    <div className="progress-fill success" style={{ width: `${b.riskScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedBuilding && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, opacity: animating ? 0.6 : 1, transition: 'opacity 0.3s' }}>
            {/* Risk Score Card */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Risk Score — {selectedBuilding.name}</div>
                  <div className="card-subtitle">AI-computed composite risk score</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => handleBuildingSelect(selectedBuilding)}>
                  <RefreshCw size={12} /> Refresh Analysis
                </button>
              </div>
              <div className="card-body">
                <div className="grid" style={{ gridTemplateColumns: '220px 1fr', gap: 24 }}>
                  <RiskMeter score={selectedBuilding.riskScore} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>Risk Factors</div>
                    {selectedBuilding.factors.map((factor, i) => (
                      <div key={i} style={{
                        padding: '12px 16px', borderRadius: 'var(--radius-md)',
                        border: `1px solid ${severityColors[factor.severity]}30`,
                        background: severityColors[factor.severity] + '08',
                        marginBottom: 8
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{factor.factor}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className={`badge badge-${factor.severity === 'Critical' ? 'danger' : factor.severity === 'High' ? 'warning' : 'info'}`} style={{ fontSize: 10 }}>
                              {factor.severity}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: severityColors[factor.severity] }}>+{factor.impact} pts</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{factor.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: 20 }}>
              {/* Compliance Breakdown Chart */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">Compliance Breakdown</div>
                  <div className="card-subtitle">By safety category</div>
                </div>
                <div className="card-body" style={{ paddingTop: 12 }}>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={selectedBuilding.complianceBreakdown} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-light)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="area" width={120} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {selectedBuilding.complianceBreakdown.map((entry, idx) => (
                          <Cell key={idx} fill={entry.score >= 70 ? '#22C55E' : entry.score >= 50 ? '#F59E0B' : '#EF4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, #1E3A28, #2D5A3D)',
                border: 'none'
              }}>
                <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Zap size={18} color="#86EFAC" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>AI Recommendations</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{selectedBuilding.recommendations.length} actions identified</div>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ paddingTop: 16 }}>
                  {selectedBuilding.recommendations.map((rec, i) => (
                    <div key={i} style={{
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${priorityColors[rec.priority]}30`,
                      borderLeft: `3px solid ${priorityColors[rec.priority]}`,
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 8
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'white', lineHeight: 1.3 }}>{rec.action}</div>
                        <span style={{
                          padding: '2px 8px', borderRadius: 9999, fontSize: 10, fontWeight: 600,
                          background: priorityColors[rec.priority] + '25',
                          color: priorityColors[rec.priority], flexShrink: 0, marginLeft: 8
                        }}>{rec.priority}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                        <span>Due: {rec.deadline}</span>
                        <span>{rec.estimatedCost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
