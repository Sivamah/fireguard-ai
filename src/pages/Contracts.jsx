import React, { useState, useMemo } from 'react';
import {
  FileText, Building2, Handshake, Calendar, AlertTriangle,
  Plus, Search, Filter, X, CheckCircle2, Clock, RefreshCw, ChevronDown
} from 'lucide-react';
import { contracts, buildings, suppliers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const STATUS_CONFIG = {
  Active:   { class: 'badge-success', color: '#22C55E', bg: '#F0FDF4', border: '#22C55E' },
  Expiring: { class: 'badge-warning', color: '#B45309', bg: '#FEF3C7', border: '#F59E0B' },
  Expired:  { class: 'badge-danger',  color: '#DC2626', bg: '#FEF2F2', border: '#EF4444' },
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function AddContractModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ supplierId: '', buildingId: '', type: 'Annual Maintenance', startDate: '', endDate: '', value: '', autoRenewal: false });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.supplierId || !form.buildingId || !form.startDate || !form.endDate) return;
    const sup = suppliers.find(s => s.id === form.supplierId);
    const bld = buildings.find(b => b.id === form.buildingId);
    onAdd({
      id: `CON-${Date.now()}`,
      ...form,
      supplierName: sup?.name || '',
      buildingName: bld?.name || '',
      status: 'Active',
      companyId: bld?.companyId || '',
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Add New Contract</div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Supplier</label>
              <select className="select" value={form.supplierId} onChange={e => set('supplierId', e.target.value)} required>
                <option value="">Select supplier…</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Building</label>
              <select className="select" value={form.buildingId} onChange={e => set('buildingId', e.target.value)} required>
                <option value="">Select building…</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name} — {b.district}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contract Type</label>
              <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
                {['Annual Maintenance', 'Supply & Install', 'Supply & Maintain', 'Emergency Response'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="input" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="input" value={form.endDate} onChange={e => set('endDate', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Contract Value</label>
              <input type="text" className="input" placeholder="e.g. ₹1,20,000" value={form.value} onChange={e => set('value', e.target.value)} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)' }}>
              <input type="checkbox" checked={form.autoRenewal} onChange={e => set('autoRenewal', e.target.checked)} />
              Auto-renewal enabled
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Contract</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Contracts() {
  const { user, isSuperAdmin } = useAuth();
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal,  setShowModal]  = useState(false);
  const [localContracts, setLocalContracts] = useState(contracts);

  const visible = useMemo(() => {
    return localContracts.filter(c => {
      if (!isSuperAdmin && user?.role !== 'Supplier' && c.companyId !== user?.companyId) return false;
      if (user?.role === 'Supplier' && c.supplierId !== user?.supplierId) return false;
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      const q = search.toLowerCase();
      return !q || c.supplierName.toLowerCase().includes(q) || c.buildingName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });
  }, [localContracts, search, statusFilter, user, isSuperAdmin]);

  const stats = {
    total:    visible.length,
    active:   visible.filter(c => c.status === 'Active').length,
    expiring: visible.filter(c => c.status === 'Expiring').length,
    expired:  visible.filter(c => c.status === 'Expired').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Contract Management</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Manage supplier & building service agreements</p>
        </div>
        {(isSuperAdmin || user?.role === 'Company Admin' || user?.role === 'Supplier') && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Plus size={15} /> Add Contract
          </button>
        )}
      </div>

      {/* Stats Strip */}
      <div className="grid grid-4">
        {[
          { label: 'Total', val: stats.total, color: 'var(--color-primary)', bg: 'var(--color-primary-ultra)', icon: FileText },
          { label: 'Active', val: stats.active, color: '#15803D', bg: '#F0FDF4', icon: CheckCircle2 },
          { label: 'Expiring', val: stats.expiring, color: '#B45309', bg: '#FEF3C7', icon: Clock },
          { label: 'Expired', val: stats.expired, color: '#DC2626', bg: '#FEF2F2', icon: AlertTriangle },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', align: 'center', gap: 14 }}
            onClick={() => setStatusFilter(s.label === 'Total' ? 'All' : s.label)}
            style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label} Contracts</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div className="input-wrap" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} className="input-icon" />
          <input className="input" placeholder="Search contracts…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Active', 'Expiring', 'Expired'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Contract List */}
      <div className="card">
        <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract ID</th>
                <th>Building</th>
                <th>Supplier</th>
                <th>Type</th>
                <th>End Date</th>
                <th>Days Left</th>
                <th>Value</th>
                <th>Auto-Renew</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No contracts found.</td></tr>
              ) : visible.map(c => {
                const days = daysUntil(c.endDate);
                const cfg  = STATUS_CONFIG[c.status] || STATUS_CONFIG.Active;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 12.5 }}>{c.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary-ultra)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building2 size={13} color="var(--color-primary)" />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{c.buildingName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.supplierName}</td>
                    <td style={{ fontSize: 12.5 }}>{c.type}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{c.endDate}</td>
                    <td>
                      {c.status !== 'Expired' ? (
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: days <= 30 ? '#EF4444' : days <= 90 ? '#F59E0B' : '#22C55E' }}>
                          {days} days
                        </span>
                      ) : (
                        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{c.value || '—'}</td>
                    <td>
                      {c.autoRenewal
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#22C55E' }}><CheckCircle2 size={13} /> Yes</span>
                        : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No</span>
                      }
                    </td>
                    <td><span className={`badge ${cfg.class}`}>{c.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expiry Alerts */}
      {visible.filter(c => c.status === 'Expiring').length > 0 && (
        <div className="card animate-up" style={{ border: '1.5px solid #F59E0B', background: '#FFFBEB' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#B45309" />
              <div className="card-title" style={{ color: '#B45309' }}>Contracts Expiring Soon</div>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.filter(c => c.status === 'Expiring').map(c => {
              const days = daysUntil(c.endDate);
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                  <RefreshCw size={16} color="#B45309" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{c.buildingName}</span>
                    <span style={{ fontSize: 12, color: '#B45309', marginLeft: 8 }}>({c.supplierName})</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#B45309', fontWeight: 700 }}>Expires in {days} days</span>
                  <button className="btn btn-sm" style={{ background: '#B45309', color: 'white', border: 'none' }}>Renew</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && <AddContractModal onClose={() => setShowModal(false)} onAdd={c => setLocalContracts(p => [c, ...p])} />}
    </div>
  );
}
