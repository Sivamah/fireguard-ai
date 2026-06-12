import React, { useState, useMemo } from 'react';
import {
  ShieldAlert, Building2, Calendar, AlertTriangle, CheckCircle2,
  Clock, Search, Plus, X, ChevronDown, User, Bell
} from 'lucide-react';
import { fireIncidents, buildings, users } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const SEVERITY_CONFIG = {
  Critical: { color: '#EF4444', bg: '#FEF2F2', border: '#EF4444', emoji: '🔴' },
  High:     { color: '#F97316', bg: '#FFF7ED', border: '#F97316', emoji: '🟠' },
  Medium:   { color: '#F59E0B', bg: '#FFFBEB', border: '#F59E0B', emoji: '🟡' },
  Low:      { color: '#22C55E', bg: '#F0FDF4', border: '#22C55E', emoji: '🟢' },
};

const STATUS_STEPS = ['Reported', 'Investigating', 'Resolved'];

function StatusTrack({ status }) {
  const current = status === 'Resolved' ? 2 : status === 'Investigating' ? 1 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 8 }}>
      {STATUS_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, border: '2px solid',
              background: i <= current ? 'var(--color-primary)' : 'var(--bg-subtle)',
              borderColor: i <= current ? 'var(--color-primary)' : 'var(--border)',
              color: i <= current ? 'white' : 'var(--text-muted)',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 9.5, color: i <= current ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{step}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? 'var(--color-primary)' : 'var(--border)', margin: '0 2px', marginBottom: 18 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CreateIncidentModal({ onClose, onAdd, user }) {
  const [form, setForm] = useState({
    buildingId: '', floor: '', severity: 'Medium',
    cause: '', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    notified: ['Building Owner', 'Super Admin'],
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleNotify = (role) => setForm(p => ({
    ...p, notified: p.notified.includes(role) ? p.notified.filter(r => r !== role) : [...p.notified, role]
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const bld = buildings.find(b => b.id === form.buildingId);
    if (!bld) return;
    onAdd({
      id: `INC-${String(fireIncidents.length + Date.now()).slice(-3)}`,
      companyId: bld.companyId,
      buildingId: form.buildingId,
      building: bld.name,
      date: form.date,
      time: form.time,
      floor: parseInt(form.floor) || 1,
      severity: form.severity,
      cause: form.cause,
      status: 'Reported',
      resolution: '',
      notified: form.notified,
      createdBy: user?.id,
    });
    onClose();
  };

  const NOTIFY_ROLES = ['Building Owner', 'Supplier', 'Auditor', 'Super Admin'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 580 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <ShieldAlert size={20} color="#EF4444" /> Report Fire Incident
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Building *</label>
              <select className="select" value={form.buildingId} onChange={e => set('buildingId', e.target.value)} required>
                <option value="">Select building…</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name} — {b.district}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Time *</label>
                <input type="time" className="input" value={form.time} onChange={e => set('time', e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Floor</label>
                <input type="number" className="input" min={1} max={100} placeholder="Floor number" value={form.floor} onChange={e => set('floor', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Severity *</label>
                <select className="select" value={form.severity} onChange={e => set('severity', e.target.value)}>
                  {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cause / Description *</label>
              <textarea className="input textarea" rows={3} placeholder="Describe what happened…" value={form.cause} onChange={e => set('cause', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={13} /> Notify Stakeholders</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {NOTIFY_ROLES.map(role => (
                  <label key={role} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', border: `1px solid ${form.notified.includes(role) ? 'var(--color-primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 12.5, fontWeight: 500, background: form.notified.includes(role) ? 'var(--color-accent-soft)' : 'transparent', color: form.notified.includes(role) ? 'var(--color-primary)' : 'var(--text-secondary)', transition: 'all 0.15s' }}>
                    <input type="checkbox" style={{ display: 'none' }} checked={form.notified.includes(role)} onChange={() => toggleNotify(role)} />
                    {form.notified.includes(role) ? <CheckCircle2 size={12} /> : <User size={12} />} {role}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <ShieldAlert size={14} /> Report Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FireIncidents() {
  const { user, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [localIncidents, setLocalIncidents] = useState(fireIncidents);
  const [expanded, setExpanded] = useState(null);

  const visible = useMemo(() => {
    return localIncidents.filter(inc => {
      if (!isSuperAdmin && inc.companyId !== user?.companyId && user?.role !== 'Supplier' && user?.role !== 'Auditor') return false;
      if (severityFilter !== 'All' && inc.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
      const q = search.toLowerCase();
      return !q || inc.building.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q) || inc.cause.toLowerCase().includes(q);
    });
  }, [localIncidents, search, severityFilter, statusFilter, user, isSuperAdmin]);

  const resolve = (id, resolution) => {
    setLocalIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved', resolution } : i));
  };

  const investigate = (id) => {
    setLocalIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Investigating' } : i));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Fire Incident Management</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Track, manage, and resolve fire incidents across all buildings</p>
        </div>
        <button className="btn btn-danger" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={15} /> Report Incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-4">
        {[
          { label: 'Total Incidents', val: visible.length,                               color: 'var(--text-primary)', bg: 'var(--bg-elevated)', border: 'var(--border)' },
          { label: 'Critical / High',  val: visible.filter(i => ['Critical','High'].includes(i.severity)).length, color: '#EF4444', bg: '#FEF2F2', border: '#EF4444' },
          { label: 'Investigating',    val: visible.filter(i => i.status === 'Investigating').length,              color: '#F59E0B', bg: '#FFFBEB', border: '#F59E0B' },
          { label: 'Resolved',         val: visible.filter(i => i.status === 'Resolved').length,                  color: '#22C55E', bg: '#F0FDF4', border: '#22C55E' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}30`, borderRadius: 'var(--radius-md)', padding: '16px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12.5, color: s.color, fontWeight: 600, marginTop: 6, opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div className="input-wrap" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} className="input-icon" />
          <input className="input" placeholder="Search incidents…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(s => (
            <button key={s} onClick={() => setSeverityFilter(s)} className={`btn btn-sm ${severityFilter === s ? 'btn-primary' : 'btn-secondary'}`}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'Reported', 'Investigating', 'Resolved'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Incident Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visible.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <CheckCircle2 size={40} color="var(--status-success)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>No incidents found</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>All clear! No fire incidents match your filters.</div>
          </div>
        ) : visible.map(inc => {
          const cfg = SEVERITY_CONFIG[inc.severity] || SEVERITY_CONFIG.Medium;
          const isOpen = expanded === inc.id;
          return (
            <div key={inc.id} className="card" style={{ border: `1.5px solid ${isOpen ? cfg.border : 'var(--border)'}`, transition: 'border-color 0.2s' }}>
              {/* Card Header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : inc.id)}>
                {/* Severity Icon */}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {cfg.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{inc.building}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, padding: '2px 8px', borderRadius: 20 }}>Floor {inc.floor}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>
                    {inc.id} · {inc.date} {inc.time} · <span style={{ color: cfg.color, fontWeight: 600 }}>{inc.severity}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.cause}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span className={`badge ${inc.status === 'Resolved' ? 'badge-success' : inc.status === 'Investigating' ? 'badge-warning' : 'badge-danger'}`}>{inc.status}</span>
                  <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {/* Expanded Details */}
              {isOpen && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-light)' }}>
                  <StatusTrack status={inc.status} />

                  <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cause</div>
                      <div style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>{inc.cause}</div>
                    </div>
                    {inc.resolution && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resolution</div>
                        <div style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>{inc.resolution}</div>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Notified Stakeholders</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {inc.notified.map(r => (
                        <span key={r} style={{ fontSize: 12, background: 'var(--color-primary-ultra)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{r}</span>
                      ))}
                    </div>
                  </div>

                  {(isSuperAdmin || user?.role === 'Company Admin' || user?.role === 'Auditor') && inc.status !== 'Resolved' && (
                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                      {inc.status === 'Reported' && (
                        <button className="btn btn-secondary btn-sm" onClick={() => investigate(inc.id)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={13} /> Mark Investigating
                        </button>
                      )}
                      <button className="btn btn-sm" style={{ background: '#22C55E', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                        onClick={() => {
                          const res = window.prompt('Enter resolution details:');
                          if (res) resolve(inc.id, res);
                        }}>
                        <CheckCircle2 size={13} /> Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && <CreateIncidentModal onClose={() => setShowModal(false)} onAdd={inc => setLocalIncidents(p => [inc, ...p])} user={user} />}
    </div>
  );
}
