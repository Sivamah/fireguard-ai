import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Building2, RotateCcw, ChevronDown, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Zap, Info, Star
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { buildings, aiPredictions } from '../data/mockData';

const riskColor = l => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[l] || '#64748B');
const riskBg    = l => ({ Critical: 'rgba(239,68,68,0.10)', High: 'rgba(249,115,22,0.10)', Medium: 'rgba(245,158,11,0.10)', Low: 'rgba(34,197,94,0.10)' }[l] || 'var(--bg-elevated)');
const featureColor = (sev) => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E', None: '#22C55E' }[sev] || '#64748B');
const priorityBadge = p => ({ Critical: 'badge-danger', High: 'badge-high', Medium: 'badge-warning', Low: 'badge-muted' }[p] || 'badge-muted');

// ── Animated circular risk gauge ─────────────────────────────
function RiskGauge({ score, riskLevel, size = 180 }) {
  const [val, setVal] = useState(0);
  useEffect(() => { const t = setTimeout(() => setVal(score), 100); return () => clearTimeout(t); }, [score]);
  const color = riskColor(riskLevel);

  return (
    <div className="gauge-container">
      <div style={{ position: 'relative', width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" startAngle={225} endAngle={-45} data={[{ value: 100, fill: 'var(--bg-elevated)' }, { value: val, fill: color }]}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <RadialBar dataKey="value" cornerRadius={6} filter="url(#glow)" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <div style={{ fontSize: 42, fontWeight: 900, color, letterSpacing: '-2px', lineHeight: 1 }}>
            {val}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Risk Score</div>
        </div>
      </div>
    </div>
  );
}

// ── Feature Importance Bar ────────────────────────────────────
function FeatureBar({ feature, maxImpact, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth((feature.impact / maxImpact) * 100), delay + 200); return () => clearTimeout(t); }, [feature.impact, maxImpact, delay]);
  const color = featureColor(feature.severity);
  const isRisk = feature.direction === 'increases';

  return (
    <div className="ai-feature-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 24, flexShrink: 0, justifyContent: 'center' }}>
        {isRisk
          ? <TrendingUp size={14} color="#EF4444" />
          : <TrendingDown size={14} color="#22C55E" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {feature.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{feature.value}</div>
      </div>
      <div style={{ width: 150, flexShrink: 0 }}>
        <div className="feature-track">
          <div className="feature-fill" style={{ width: `${width}%`, background: isRisk ? color : '#22C55E', transition: `width 0.9s ease ${delay * 0.05}s` }} />
        </div>
      </div>
      <div style={{ width: 40, textAlign: 'right', fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>
        {feature.impact}%
      </div>
    </div>
  );
}

// ── Main AI Prediction Page ───────────────────────────────────
export default function AIPrediction() {
  const [selectedBld, setSelectedBld]       = useState(buildings[3].id); // Default: warehouse (highest risk)
  const [isRunning,   setIsRunning]         = useState(false);
  const [runCount,    setRunCount]          = useState(0);
  const [activeTab,   setActiveTab]         = useState('factors');
  const [showAbout,   setShowAbout]         = useState(false);

  const prediction = aiPredictions.find(p => p.buildingId === selectedBld);
  const building   = buildings.find(b => b.id === selectedBld);

  const maxImpact = prediction ? Math.max(...prediction.features.map(f => f.impact)) : 1;

  const runPrediction = async () => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 2400));
    setIsRunning(false);
    setRunCount(c => c + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="ai-pulse-dot" />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>
                AI Fire Risk Prediction
              </h2>
              <span className="badge badge-primary" style={{ fontSize: 10 }}>XAI Engine v2.1</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Explainable AI-based risk scoring with SHAP-inspired feature attribution
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowAbout(!showAbout)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Info size={14} /> About the Model
          </button>
        </div>

        {/* About XAI Panel */}
        <AnimatePresence>
          {showAbout && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginTop: 14 }}>
              <div style={{ padding: '16px 20px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Algorithm', value: 'Gradient Boosted Decision Tree with SHAP Attribution' },
                    { label: 'Training Dataset', value: '12,400 fire safety records across 6 building types' },
                    { label: 'IEEE Standard', value: 'NFPA 1 & NFPA 72 compliance factors' },
                    { label: 'Explainability', value: 'SHAP values for local feature importance (model-agnostic)' },
                    { label: 'Features', value: '18 safety indicators (equipment, inspection, incident, structural)' },
                    { label: 'Validation', value: '87% accuracy on hold-out set (2024–2025 data)' },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: 10.5, color: '#60A5FA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Building Selector ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Building2 size={18} color="var(--text-muted)" />
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', flexShrink: 0 }}>Select Building:</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <select className="select" value={selectedBld} onChange={e => { setSelectedBld(e.target.value); setRunCount(0); }}>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.type}) — Risk: {b.riskScore}/100
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={runPrediction} disabled={isRunning}>
            {isRunning ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Analyzing…
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={15} />
                {runCount > 0 ? 'Predict Again' : 'Run AI Prediction'}
              </span>
            )}
          </button>
          {runCount > 0 && <span className="badge badge-success" style={{ fontSize: 10 }}>✓ {runCount} run{runCount > 1 ? 's' : ''}</span>}
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      {prediction && building && (
        <AnimatePresence>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>

            {/* Left: Risk Score Panel */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Gauge Card */}
              <div className="card" style={{ padding: '28px 20px', textAlign: 'center', background: `linear-gradient(135deg, var(--bg-card) 0%, ${riskBg(prediction.riskLevel)} 100%)`, borderColor: `${riskColor(prediction.riskLevel)}30` }}>
                <AnimatePresence>
                  {!isRunning ? (
                    <motion.div key={`gauge-${selectedBld}-${runCount}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                      <RiskGauge score={prediction.riskScore} riskLevel={prediction.riskLevel} size={180} />
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="loading"
                      style={{ height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <div style={{ width: 50, height: 50, border: '4px solid var(--bg-elevated)', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Running XAI engine…</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className={`badge badge-${prediction.riskLevel.toLowerCase()}`} style={{ fontSize: 12 }}>
                      {prediction.riskLevel} Risk
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: 12 }}>
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8 }}>
                    {prediction.modelVersion} · Updated {new Date(prediction.lastUpdated).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Building Info */}
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Building Profile</div>
                {[
                  { label: 'Type',       value: building.type },
                  { label: 'Floors',     value: `${building.floors} floors` },
                  { label: 'Occupancy',  value: `${building.occupancy} persons` },
                  { label: 'Compliance', value: `${building.complianceScore}%` },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12.5 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Risk Level Legend */}
              <div className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Risk Scale</div>
                {[
                  { level: 'Critical', range: '80–100', desc: 'Immediate action mandatory' },
                  { level: 'High',     range: '60–79',  desc: 'Urgent remediation needed' },
                  { level: 'Medium',   range: '40–59',  desc: 'Address within 30 days' },
                  { level: 'Low',      range: '0–39',   desc: 'Maintain current standards' },
                ].map(r => (
                  <div key={r.level} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: riskColor(r.level), flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: riskColor(r.level) }}>{r.level}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{r.range}</span>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{r.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Features + Recommendations */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)' }}>
                {[
                  { key: 'factors',         label: '📊 Feature Importance' },
                  { key: 'recommendations', label: '💡 AI Recommendations' },
                ].map(tab => (
                  <button key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === tab.key ? 'var(--color-primary)' : 'transparent'}`, color: activeTab === tab.key ? '#60A5FA' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s', marginBottom: -1 }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Feature Importance Tab */}
              {activeTab === 'factors' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                  <div className="card-header">
                    <div className="card-title">SHAP-Based Feature Importance</div>
                    <div className="card-subtitle">Each factor's contribution to the predicted risk score — generated by the XAI engine</div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', gap: 12, marginBottom: 14, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <TrendingUp size={13} color="#EF4444" /> Risk-increasing factors
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                        <TrendingDown size={13} color="#22C55E" /> Risk-decreasing factors
                      </div>
                    </div>

                    <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 4, marginBottom: 6, display: 'flex', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      <span style={{ flex: 1, paddingLeft: 32 }}>Feature</span>
                      <span style={{ width: 150, paddingLeft: 8 }}>Impact</span>
                      <span style={{ width: 40 }}>%</span>
                    </div>

                    {prediction.features.map((feature, i) => (
                      <FeatureBar key={feature.name} feature={feature} maxImpact={maxImpact} delay={i * 60} />
                    ))}

                    <div style={{ marginTop: 16, padding: '12px', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#60A5FA' }}>Interpretation:</strong> Bars represent each feature's SHAP value contribution. 
                      Red bars (↑) increase risk score; green bars (↓) reduce it. 
                      The final risk score is the sum of all positive contributions minus negatives, normalized to 0–100.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
                  <div className="card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="card-title">AI Recommendations</div>
                        <div className="card-subtitle">{prediction.recommendations.length} actions prioritized to reduce risk score from {prediction.riskScore} → below 40</div>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: 10 }}><Star size={9} /> AI-Generated</span>
                    </div>
                  </div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {prediction.recommendations.map((rec, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ padding: '14px 16px', background: 'var(--bg-elevated)', border: `1px solid ${rec.priority === 'Critical' ? '#EF444430' : rec.priority === 'High' ? '#F9731630' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = riskColor(rec.priority)}
                        onMouseLeave={e => e.currentTarget.style.borderColor = rec.priority === 'Critical' ? '#EF444430' : rec.priority === 'High' ? '#F9731630' : 'var(--border)'}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ fontWeight: 900, fontSize: 16, flexShrink: 0, width: 26, height: 26, background: `${riskColor(rec.priority)}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: riskColor(rec.priority), marginTop: 1 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                              <span className={`badge ${priorityBadge(rec.priority)}`} style={{ fontSize: 10 }}>{rec.priority}</span>
                              <span className="badge badge-muted" style={{ fontSize: 10 }}>{rec.category}</span>
                            </div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{rec.action}</div>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>📅 By {rec.deadline}</span>
                              <span style={{ fontSize: 11.5, color: '#22C55E', fontWeight: 600 }}>Est. {rec.estimatedCost}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* ── All Buildings Risk Summary ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
        <div className="card-header">
          <div className="card-title">All Buildings — Risk Overview</div>
          <div className="card-subtitle">Click any building above to run the AI prediction engine</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {aiPredictions.sort((a, b) => b.riskScore - a.riskScore).map(pred => {
              const bld = buildings.find(b => b.id === pred.buildingId);
              const isSelected = pred.buildingId === selectedBld;
              return (
                <div key={pred.buildingId}
                  onClick={() => { setSelectedBld(pred.buildingId); setRunCount(0); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: isSelected ? 'var(--color-primary-ultra)' : 'var(--bg-elevated)', border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: riskColor(pred.riskLevel), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pred.building}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bld?.type} · {bld?.location}</div>
                  </div>
                  {/* Mini progress */}
                  <div style={{ width: 100 }}>
                    <div className="progress">
                      <div style={{ height: '100%', width: `${pred.riskScore}%`, background: riskColor(pred.riskLevel), borderRadius: 4, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: riskColor(pred.riskLevel), width: 32, textAlign: 'right' }}>{pred.riskScore}</div>
                  <span className={`badge badge-${pred.riskLevel.toLowerCase()}`} style={{ fontSize: 10, width: 64, textAlign: 'center', flexShrink: 0 }}>{pred.riskLevel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
