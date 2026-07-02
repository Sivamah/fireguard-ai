import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, AlertTriangle, Clock, CheckCircle2, Plus, Filter, X, Users } from 'lucide-react';
import { incidents as incidentData } from '../data/mockData';

const riskColor = l => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[l] || '#64748B');
const riskBg    = l => ({ Critical: 'rgba(239,68,68,0.12)', High: 'rgba(249,115,22,0.12)', Medium: 'rgba(245,158,11,0.12)', Low: 'rgba(34,197,94,0.12)' }[l] || 'var(--bg-elevated)');

const STATUS_META = {
  'Resolved':            { color: '#22C55E', badge: 'badge-success' },
  'Under Investigation': { color: '#F59E0B', badge: 'badge-warning' },
  'Closed':              { color: '#64748B', badge: 'badge-muted' },
};

const TYPE_ICONS = { 'Fire': '🔥', 'Smoke Alarm': '💨', 'False Alarm': '🔔', 'Incident': '⚠️' };

// ── Add Incident Modal ─────────────────────────────────────────
function AddIncidentModal({ onClose }) {
  const [form, setForm] = useState({ building: '', type: 'Fire', severity: 'Medium', cause: '', response: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal" style={{ maxWidth: 520 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Report Incident</div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={17} /></button>
        </div>
        {done ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>Incident Reported</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>The incident has been logged and relevant teams have been notified.</div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Building</label>
                <input className="input" placeholder="Building name" value={form.building} onChange={e => set('building', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Incident Type</label>
                  <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
                    {['Fire', 'Smoke Alarm', 'False Alarm', 'Gas Leak', 'Electrical'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select className="select" value={form.severity} onChange={e => set('severity', e.target.value)}>
                    {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Cause / Description</label>
                <textarea className="input" rows={3} style={{ resize: 'vertical' }} placeholder="Describe what happened, where, and how it started…" value={form.cause} onChange={e => set('cause', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Response</label>
                <input className="input" placeholder="Who was notified? What actions were taken?" value={form.response} onChange={e => set('response', e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-danger" onClick={handleSubmit} disabled={loading || !form.building || !form.cause}>
                {loading ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--status-danger)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Reporting…</> : '🚨 Report Incident'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Incidents Page ────────────────────────────────────────────
export default function Incidents() {
  const [showAdd, setShowAdd]     = useState(false);
  const [sevFilter, setSev]       = useState('All');
  const [statusFilter, setStatus] = useState('All');
  const [expanded, setExpanded]   = useState(null);

  const SEVS = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const STATUSES = ['All', 'Resolved', 'Under Investigation', 'Closed'];

  const filtered = incidentData.filter(inc => {
    const matchSev    = sevFilter === 'All' || inc.severity === sevFilter;
    const matchStatus = statusFilter === 'All' || inc.status === statusFilter;
    return matchSev && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Incident Management</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{incidentData.length} incidents recorded — chronological timeline</p>
        </div>
        <button className="btn btn-danger" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Report Incident
        </button>
      </motion.div>

      {/* Summary KPIs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-4" style={{ gap: 12 }}>
        {[
          { label: 'Total Incidents',   val: incidentData.length,                                               color: '#60A5FA', bg: 'rgba(37,99,235,0.1)' },
          { label: 'Resolved',          val: incidentData.filter(i => i.status === 'Resolved').length,          color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Investigating',     val: incidentData.filter(i => i.status === 'Under Investigation').length, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Total Injuries',    val: incidentData.reduce((s, i) => s + i.injuries, 0),                  color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px', background: s.bg, border: `1px solid ${s.color}25`, borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SEVS.map(s => (
            <button key={s} className={`filter-pill ${sevFilter === s ? 'active' : ''}`} onClick={() => setSev(s)}>{s}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        {STATUSES.map(s => (
          <button key={s} className={`filter-pill ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatus(s)}>{s}</button>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="timeline" style={{ marginLeft: 8 }}>
        <AnimatePresence>
          {filtered.map((inc, i) => {
            const isOpen    = expanded === inc.id;
            const sm        = STATUS_META[inc.status] || {};
            const dc        = riskColor(inc.severity);
            return (
              <motion.div key={inc.id}
                className="timeline-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.07 }}>

                {/* Timeline Dot */}
                <div className={`timeline-dot ${inc.severity.toLowerCase()}`}>
                  <Flame size={9} color={dc} />
                </div>

                {/* Card */}
                <div className="card" style={{ borderLeft: `3px solid ${dc}` }}>
                  <div className="card-body">
                    {/* Row 1 */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setExpanded(isOpen ? null : inc.id)}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: riskBg(inc.severity), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                        {TYPE_ICONS[inc.type] || '⚠️'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.building}</div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <span className={`badge badge-${inc.severity.toLowerCase()}`} style={{ fontSize: 10 }}>{inc.severity}</span>
                            <span className={`badge ${sm.badge}`} style={{ fontSize: 10 }}>{inc.status}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3, display: '-webkit-box', WebkitLineClamp: isOpen ? 999 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {inc.cause}
                        </div>
                        <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Clock size={11} /> {inc.date} at {inc.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            🚒 Response: {inc.responseTime}
                          </span>
                          {inc.injuries > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#EF4444' }}>
                              <Users size={11} /> {inc.injuries} injured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                            {[
                              { label: 'Floor', value: `Floor ${inc.floor}` },
                              { label: 'Property Damage', value: inc.propertyDamage },
                              { label: 'Reported By', value: inc.reportedBy },
                            ].map(d => (
                              <div key={d.label} style={{ padding: '8px', background: 'var(--bg-elevated)', borderRadius: 6 }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{d.label}</div>
                                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</div>
                              </div>
                            ))}
                          </div>
                          {inc.resolution && (
                            <div style={{ padding: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#22C55E', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Resolution</div>
                              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{inc.resolution}</div>
                            </div>
                          )}
                          {inc.followUpActions?.length > 0 && (
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Follow-up Actions</div>
                              {inc.followUpActions.map((a, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                                  <CheckCircle2 size={13} color="#22C55E" /> {a}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div className="empty-state-title">No incidents found</div>
          <div className="empty-state-sub">No incidents match the current filters.</div>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && <AddIncidentModal onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}
