import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, CheckCircle2, AlertTriangle, Clock, Plus,
  Building2, ChevronRight, X, Camera, Upload, Check, XCircle
} from 'lucide-react';
import { inspections as inspectionData, buildings } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const CHECKLIST_ITEMS = [
  { key: 'fireAlarm',       label: 'Fire Alarm System',    desc: 'Verify all panels, detectors, and sirens are operational',          icon: '🔔' },
  { key: 'smokeDetector',   label: 'Smoke Detectors',      desc: 'Test all smoke and heat detectors for responsiveness',              icon: '💨' },
  { key: 'emergencyExit',   label: 'Emergency Exits',      desc: 'All exits clear, illuminated, and properly marked',                  icon: '🚪' },
  { key: 'hydrant',         label: 'Fire Hydrants',        desc: 'Pressure test and inspect all hydrants for blockage',               icon: '🚿' },
  { key: 'sprinkler',       label: 'Sprinkler System',     desc: 'Inspect sprinkler heads, test water supply and control valves',     icon: '💧' },
  { key: 'electricalSafety',label: 'Electrical Safety',    desc: 'Check panels, wiring, load capacity, and extension cord usage',     icon: '⚡' },
];

// ── New Inspection Form ────────────────────────────────────────
function NewInspectionPanel({ onClose }) {
  const { user } = useAuth();
  const [step,      setStep]      = useState(1); // 1=select, 2=checklist, 3=remarks, 4=done
  const [bldId,     setBldId]     = useState('');
  const [checklist, setChecklist] = useState(
    Object.fromEntries(CHECKLIST_ITEMS.map(i => [i.key, null]))
  );
  const [remarks,   setRemarks]   = useState('');
  const [photos,    setPhotos]    = useState([]);
  const [loading,   setLoading]   = useState(false);

  const building  = buildings.find(b => b.id === bldId);
  const answered  = Object.values(checklist).filter(v => v !== null).length;
  const passed    = Object.values(checklist).filter(v => v === true).length;
  const pct       = Math.round((answered / CHECKLIST_ITEMS.length) * 100);
  const score     = answered > 0 ? Math.round((passed / CHECKLIST_ITEMS.length) * 100) : 0;

  const toggle = (key, val) => setChecklist(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setStep(4);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="card" style={{ flex: 1, minWidth: 0 }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="card-title">New Inspection</div>
          <div className="card-subtitle">Step {Math.min(step, 3)} of 3 — {step === 1 ? 'Select Building' : step === 2 ? 'Equipment Checklist' : step >= 3 ? 'Remarks & Submit' : ''}</div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 20px' }}>
        <div className="progress">
          <div className="progress-fill primary" style={{ width: step === 4 ? '100%' : `${(step - 1) * 33.3}%`, transition: 'width 0.5s' }} />
        </div>
      </div>

      <div className="card-body">
        {/* Step 4 — Done */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Inspection Submitted!</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Score: {score}% · {building?.name}</div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => { setStep(1); setBldId(''); setChecklist(Object.fromEntries(CHECKLIST_ITEMS.map(i => [i.key, null]))); setRemarks(''); }}>
                New Inspection
              </button>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </motion.div>
        )}

        {/* Step 1 — Select Building */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Select Building</label>
              <select className="select" value={bldId} onChange={e => setBldId(e.target.value)}>
                <option value="">— Choose a building —</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
              </select>
            </div>
            {building && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{building.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{building.location} · {building.floors} floors · {building.occupancy} persons</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <span className={`badge badge-${building.riskLevel.toLowerCase()}`} style={{ fontSize: 10 }}>{building.riskLevel} Risk</span>
                  <span className="badge badge-muted" style={{ fontSize: 10 }}>Last: {building.lastInspection}</span>
                </div>
              </motion.div>
            )}
            <button className="btn btn-primary" disabled={!bldId} onClick={() => setStep(2)}>
              Start Inspection <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2 — Checklist */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{answered}/{CHECKLIST_ITEMS.length} items checked</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: pct === 100 ? '#22C55E' : 'var(--text-primary)' }}>{pct}% complete</div>
            </div>
            <div className="progress" style={{ marginBottom: 10 }}>
              <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? '#22C55E' : '#2563EB', transition: 'width 0.4s' }} />
            </div>
            {CHECKLIST_ITEMS.map(item => {
              const val = checklist[item.key];
              return (
                <div key={item.key}
                  className={`checklist-item ${val === true ? 'checked' : val === false ? 'failed' : ''}`}
                  style={{ gap: 12 }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => toggle(item.key, true)}
                      style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${val === true ? '#22C55E' : 'var(--border)'}`, background: val === true ? 'rgba(34,197,94,0.2)' : 'var(--bg-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      <Check size={16} color={val === true ? '#22C55E' : 'var(--text-muted)'} />
                    </button>
                    <button
                      onClick={() => toggle(item.key, false)}
                      style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${val === false ? '#EF4444' : 'var(--border)'}`, background: val === false ? 'rgba(239,68,68,0.15)' : 'var(--bg-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      <XCircle size={16} color={val === false ? '#EF4444' : 'var(--text-muted)'} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={answered === 0} onClick={() => setStep(3)}>
                Next: Remarks <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Remarks & Photos */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '12px 14px', background: score >= 80 ? 'rgba(34,197,94,0.1)' : score >= 60 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444'}30`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Inspection Score</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444' }}>{score}%</div>
            </div>
            <div className="form-group">
              <label className="form-label">Inspector Remarks</label>
              <textarea
                className="input" rows={4}
                placeholder="Describe your findings, issues observed, and immediate action required…"
                value={remarks} onChange={e => setRemarks(e.target.value)}
                style={{ resize: 'vertical', minHeight: 96 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Photo Evidence (Optional)</label>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Camera size={22} color="var(--text-muted)" />
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Click to upload photos</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>JPG, PNG up to 10MB each</div>
                <span className="badge badge-muted" style={{ fontSize: 10 }}>Demo: Upload simulated</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Submitting…
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={15} /> Submit Inspection
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Inspections Page ──────────────────────────────────────────
export default function Inspections() {
  const { user } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [filter, setFilter]  = useState('All');

  const FILTERS = ['All', 'Completed', 'Action Required', 'Overdue Action'];

  const filtered = useMemo(() => {
    if (filter === 'All') return inspectionData;
    return inspectionData.filter(i => i.status === filter);
  }, [filter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Digital Inspections</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{inspectionData.length} inspections across {buildings.length} buildings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> {showNew ? 'Cancel' : 'New Inspection'}
        </button>
      </motion.div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left Panel — Inspection List */}
        <div style={{ flex: showNew ? '0 0 auto' : '1 1 auto', width: showNew ? '45%' : '100%', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.3s' }}>
          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="grid grid-3" style={{ gap: 10 }}>
            {[
              { label: 'Completed',       val: inspectionData.filter(i => i.status === 'Completed').length,       color: '#22C55E' },
              { label: 'Action Required', val: inspectionData.filter(i => i.status === 'Action Required').length, color: '#F59E0B' },
              { label: 'Overdue',         val: inspectionData.filter(i => i.status === 'Overdue Action').length,  color: '#EF4444' },
            ].map(s => (
              <div key={s.label} style={{ padding: '12px', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {/* Inspection Cards */}
          <AnimatePresence>
            {filtered.map((ins, i) => {
              const scoreColor = ins.overallScore >= 80 ? '#22C55E' : ins.overallScore >= 60 ? '#F59E0B' : '#EF4444';
              const passed = Object.values(ins.checklist).filter(v => v?.status === true).length;
              const total  = Object.keys(ins.checklist).length;
              return (
                <motion.div key={ins.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card" style={{ overflow: 'visible' }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.building}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{ins.id} · {ins.date} · {ins.inspector}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: scoreColor }}>{ins.overallScore}%</div>
                        <span className={`badge ${ins.status === 'Completed' ? 'badge-success' : ins.status === 'Overdue Action' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{ins.status}</span>
                      </div>
                    </div>

                    {/* Checklist progress */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span>Checklist: {passed}/{total} passed</span>
                        <span>{ins.completionPct}% complete</span>
                      </div>
                      <div className="progress">
                        <div className="progress-fill" style={{ width: `${ins.completionPct}%`, background: scoreColor }} />
                      </div>
                    </div>

                    {/* Checklist icons */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      {CHECKLIST_ITEMS.map(item => {
                        const v = ins.checklist[item.key];
                        return (
                          <div key={item.key} title={`${item.label}: ${v?.status ? 'Pass' : 'Fail'}`}
                            style={{ width: 30, height: 30, borderRadius: 8, background: v?.status ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: `1px solid ${v?.status ? '#22C55E' : '#EF4444'}25` }}>
                            {item.icon}
                          </div>
                        );
                      })}
                    </div>

                    {/* Remarks */}
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45, borderLeft: '3px solid var(--border)', paddingLeft: 10, fontStyle: 'italic' }}>
                      {ins.remarks.substring(0, 140)}{ins.remarks.length > 140 ? '…' : ''}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Panel — New Inspection Form */}
        <AnimatePresence>
          {showNew && (
            <div style={{ flex: '0 0 auto', width: '52%', minWidth: 320 }}>
              <NewInspectionPanel onClose={() => setShowNew(false)} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
