import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Handshake, Building2, Flame, FileText, Star, MapPin,
  Phone, Mail, Award, TrendingUp, ChevronRight, Plus, Search,
  X, CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { suppliers, supplierAnalytics, contracts, buildings, extinguishers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

function PerformanceDot({ score }) {
  const color = score >= 90 ? '#22C55E' : score >= 75 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}%</span>
    </div>
  );
}

export default function Suppliers() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const visibleSuppliers = isSuperAdmin || user?.role === 'Company Admin'
    ? suppliers
    : suppliers.filter(s => s.id === user?.supplierId);

  const filtered = visibleSuppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.districts.some(d => d.toLowerCase().includes(search.toLowerCase()))
  );

  const sel = selected ? suppliers.find(s => s.id === selected) : null;
  const selAnalytics = sel ? supplierAnalytics[sel.id] : null;
  const selContracts = sel ? contracts.filter(c => c.supplierId === sel.id) : [];
  const selBuildings = sel ? [...new Set(selContracts.map(c => c.buildingId))].map(id => buildings.find(b => b.id === id)).filter(Boolean) : [];
  const selExts = sel ? extinguishers.filter(e => e.supplierId === sel.id) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Supplier Management</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Manage your fire safety supplier ecosystem</p>
        </div>
        {isSuperAdmin && (
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Plus size={15} /> Add Supplier
          </button>
        )}
      </div>

      {/* Search */}
      <div className="input-wrap" style={{ maxWidth: 380 }}>
        <Search size={15} className="input-icon" />
        <input className="input" placeholder="Search suppliers or districts…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
      </div>

      {/* Supplier Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filtered.map(s => {
          const isActive = selected === s.id;
          return (
            <div key={s.id} className="supplier-card" onClick={() => setSelected(isActive ? null : s.id)}
              style={{ cursor: 'pointer', borderColor: isActive ? 'var(--color-primary)' : 'var(--border)', boxShadow: isActive ? 'var(--shadow-md)' : 'none' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, #DFF3E8, #BEE3CE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏭</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.contact}</div>
                  <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-neutral'}`} style={{ marginTop: 6 }}>{s.status}</span>
                </div>
                <PerformanceDot score={s.performanceScore} />
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Buildings', val: s.buildingsCovered, icon: Building2, color: 'var(--color-primary)', bg: 'var(--color-primary-ultra)' },
                  { label: 'Extinguishers', val: s.extinguishersSupplied, icon: Flame, color: '#B45309', bg: '#FEF3C7' },
                  { label: 'Contracts', val: s.activeContracts, icon: FileText, color: '#4338CA', bg: '#E0E7FF' },
                ].map(st => (
                  <div key={st.label} style={{ background: st.bg, borderRadius: 'var(--radius-sm)', padding: '10px 12px', textAlign: 'center' }}>
                    <st.icon size={16} color={st.color} style={{ marginBottom: 4 }} />
                    <div style={{ fontSize: 18, fontWeight: 800, color: st.color, lineHeight: 1 }}>{st.val}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>{st.label}</div>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} /> {s.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={11} /> {s.email}</span>
              </div>

              {/* Districts */}
              <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.districts.map(d => (
                  <span key={d} style={{ fontSize: 11, background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--border)' }}>
                    <MapPin size={9} style={{ marginRight: 3, verticalAlign: 'middle' }} />{d}
                  </span>
                ))}
              </div>

              {/* Certifications */}
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.certifications.map(c => (
                  <span key={c} style={{ fontSize: 10.5, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Award size={9} /> {c}
                  </span>
                ))}
              </div>

              <button style={{ marginTop: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: isActive ? 'var(--color-primary)' : 'var(--bg-subtle)', border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s' }}>
                {isActive ? (<><X size={13} /> Hide Details</>) : (<>View Details <ChevronRight size={13} /></>)}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      {sel && (
        <div className="card animate-up" style={{ border: '2px solid var(--color-primary)' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="card-title">{sel.name} — Detailed Analytics</div>
              <div className="card-subtitle">{sel.address}</div>
            </div>
            <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm"><X size={14} /></button>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* District Chart */}
              {selAnalytics && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>District-wise Supply</div>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selAnalytics.districtWise} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                        <XAxis dataKey="district" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                        <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                        <Bar dataKey="extinguishers" fill="var(--color-primary)" name="Extinguishers" radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Contracts */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Contracts ({selContracts.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selContracts.map(c => (
                    <div key={c.id} className={`contract-card ${c.status.toLowerCase()}`}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.buildingName}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{c.type} · {c.endDate}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${c.status === 'Active' ? 'badge-success' : c.status === 'Expiring' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary)', marginTop: 4 }}>{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buildings Covered */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Buildings Covered ({selBuildings.length})</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {selBuildings.map(b => (
                  <div key={b.id} onClick={() => navigate('/buildings')}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    <Building2 size={14} color="var(--color-primary)" />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.district} · {b.complianceScore}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
