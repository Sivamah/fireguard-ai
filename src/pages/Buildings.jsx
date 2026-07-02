import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, Users, Wrench, ClipboardList, BrainCircuit,
  ShieldCheck, AlertTriangle, X, ChevronRight, Search, Filter, Flame
} from 'lucide-react';
import { buildings, equipment, inspections, incidents, aiPredictions } from '../data/mockData';

const riskColor = l => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[l] || '#64748B');
const riskBg    = l => ({ Critical: 'rgba(239,68,68,0.12)', High: 'rgba(249,115,22,0.12)', Medium: 'rgba(245,158,11,0.12)', Low: 'rgba(34,197,94,0.12)' }[l] || 'var(--bg-elevated)');

const TYPE_ICONS = { Hospital: '🏥', School: '🏫', Office: '🏢', Warehouse: '🏭', Factory: '⚙️', Mall: '🛍️' };
const TYPES = ['All', 'Hospital', 'School', 'Office', 'Warehouse', 'Factory', 'Mall'];

// ── Building Detail Modal ─────────────────────────────────────
function BuildingDetailModal({ building, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const bldEquipment   = equipment.filter(e => e.buildingId === building.id);
  const bldInspections = inspections.filter(i => i.buildingId === building.id);
  const bldIncidents   = incidents.filter(i => i.buildingId === building.id);
  const bldAI          = aiPredictions.find(a => a.buildingId === building.id);

  const expiredEq = bldEquipment.filter(e => e.status === 'Expired').length;

  const tabs = ['overview', 'equipment', 'inspections', 'incidents', 'ai'];
  const tabLabels = { overview: 'Overview', equipment: 'Equipment', inspections: 'Inspections', incidents: 'Incidents', ai: 'AI Prediction' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        style={{ maxWidth: 740 }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 28 }}>{TYPE_ICONS[building.type] || '🏢'}</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{building.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                <MapPin size={11} /> {building.location}
                <span>·</span>
                <span className={`badge badge-${building.riskLevel.toLowerCase()}`}>{building.riskLevel} Risk</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {tabs.map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === tab ? 'var(--color-primary)' : 'transparent'}`, color: activeTab === tab ? '#60A5FA' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s', marginBottom: -1 }}>
                {tabLabels[tab]}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="grid grid-3" style={{ gap: 12 }}>
                {[
                  { label: 'Type', value: building.type },
                  { label: 'Floors', value: `${building.floors} floors` },
                  { label: 'Area', value: `${building.area_sqft?.toLocaleString()} sq ft` },
                  { label: 'Occupancy', value: `${building.occupancy} persons` },
                  { label: 'Year Built', value: building.yearBuilt },
                  { label: 'Contact', value: building.contactPerson },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-3" style={{ gap: 12 }}>
                <div style={{ padding: '14px', background: riskBg(building.riskLevel), border: `1px solid ${riskColor(building.riskLevel)}30`, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: riskColor(building.riskLevel) }}>{building.riskScore}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Risk Score</div>
                </div>
                <div style={{ padding: '14px', background: building.complianceScore >= 70 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${building.complianceScore >= 70 ? '#22C55E' : '#F59E0B'}30`, borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: building.complianceScore >= 70 ? '#22C55E' : '#F59E0B' }}>{building.complianceScore}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Compliance</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)' }}>{building.alerts}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Active Alerts</div>
                </div>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Last Inspection</div><div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{building.lastInspection}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Next Inspection</div><div style={{ fontSize: 13.5, fontWeight: 600, color: '#F59E0B' }}>{building.nextInspection}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Equipment</div><div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{building.equipmentCount} items ({expiredEq} expired)</div></div>
              </div>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bldEquipment.length === 0 ? <div className="empty-state"><div className="empty-state-title">No equipment found</div></div> :
                bldEquipment.map(eq => {
                  const sc = { Active: '#22C55E', Expired: '#EF4444', 'Expiring Soon': '#F59E0B', 'Needs Maintenance': '#F97316' }[eq.status] || '#64748B';
                  return (
                    <div key={eq.id} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                      <Wrench size={16} color={sc} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{eq.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{eq.type} · {eq.location}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span className={`badge ${eq.status === 'Active' ? 'badge-success' : eq.status === 'Expired' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{eq.status}</span>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>Expires: {eq.expiryDate}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Inspections Tab */}
          {activeTab === 'inspections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bldInspections.length === 0 ? <div className="empty-state"><div className="empty-state-title">No inspections found</div></div> :
                bldInspections.map(ins => (
                  <div key={ins.id} style={{ padding: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{ins.id}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{ins.date} · {ins.inspector}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: ins.overallScore >= 80 ? '#22C55E' : ins.overallScore >= 60 ? '#F59E0B' : '#EF4444' }}>{ins.overallScore}%</div>
                        <span className={`badge ${ins.status === 'Completed' ? 'badge-success' : ins.status === 'Overdue Action' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{ins.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic', borderLeft: '3px solid var(--border)', paddingLeft: 10 }}>{ins.remarks}</div>
                  </div>
                ))}
            </div>
          )}

          {/* Incidents Tab */}
          {activeTab === 'incidents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bldIncidents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">✅</div>
                  <div className="empty-state-title">No incidents recorded</div>
                  <div className="empty-state-sub">This building has a clean incident history.</div>
                </div>
              ) : bldIncidents.map(inc => (
                <div key={inc.id} style={{ padding: '14px', background: 'var(--bg-elevated)', border: `1px solid ${riskColor(inc.severity)}25`, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{inc.type} — {inc.date}</div>
                    <span className={`badge badge-${inc.severity.toLowerCase()}`} style={{ fontSize: 10 }}>{inc.severity}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{inc.cause}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>Response: {inc.responseTime} · Damage: {inc.propertyDamage}</div>
                </div>
              ))}
            </div>
          )}

          {/* AI Tab */}
          {activeTab === 'ai' && bldAI && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12, padding: '16px', background: riskBg(bldAI.riskLevel), border: `1px solid ${riskColor(bldAI.riskLevel)}30`, borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                <BrainCircuit size={24} color={riskColor(bldAI.riskLevel)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: riskColor(bldAI.riskLevel) }}>Risk Score: {bldAI.riskScore} / 100</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bldAI.riskLevel} Risk · {bldAI.confidence}% confidence · {bldAI.modelVersion}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Risk Factors</div>
                {bldAI.features.filter(f => f.direction === 'increases').map(f => (
                  <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', width: 180, flexShrink: 0 }}>{f.name}</div>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${f.impact}%`, background: riskColor(f.severity), borderRadius: 4, transition: 'width 1s' }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: riskColor(f.severity), width: 36, textAlign: 'right' }}>{f.impact}%</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Recommendations</div>
                {bldAI.recommendations.slice(0, 3).map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 6 }}>
                    <span className={`badge ${r.priority === 'Critical' ? 'badge-danger' : r.priority === 'High' ? 'badge-high' : 'badge-warning'}`} style={{ fontSize: 10, flexShrink: 0 }}>{r.priority}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>{r.action}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>By {r.deadline} · {r.estimatedCost}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'ai' && !bldAI && <div className="empty-state"><div className="empty-state-title">No AI prediction available</div></div>}
        </div>
      </motion.div>
    </div>
  );
}

// ── Buildings Page ────────────────────────────────────────────
export default function Buildings() {
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState('All');
  const [riskFilter, setRiskFilter]   = useState('All');
  const [selected, setSelected]       = useState(null);

  const filtered = useMemo(() => {
    return buildings.filter(b => {
      const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.location.toLowerCase().includes(search.toLowerCase());
      const matchType   = typeFilter === 'All' || b.type === typeFilter;
      const matchRisk   = riskFilter === 'All' || b.riskLevel === riskFilter;
      return matchSearch && matchType && matchRisk;
    });
  }, [search, typeFilter, riskFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Buildings Portfolio</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{buildings.length} buildings across Tamil Nadu — click any building to view details</p>
      </motion.div>

      {/* Summary Strip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { label: 'Critical', count: buildings.filter(b => b.riskLevel === 'Critical').length, color: '#EF4444' },
          { label: 'High Risk', count: buildings.filter(b => b.riskLevel === 'High').length, color: '#F97316' },
          { label: 'Medium Risk', count: buildings.filter(b => b.riskLevel === 'Medium').length, color: '#F59E0B' },
          { label: 'Low Risk', count: buildings.filter(b => b.riskLevel === 'Low').length, color: '#22C55E' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: `${s.color}14`, border: `1px solid ${s.color}30`, borderRadius: 'var(--radius-full)', cursor: 'pointer' }}
            onClick={() => setRiskFilter(s.label.replace(' Risk', ''))}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.count} {s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 220, maxWidth: 340 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search buildings…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button key={t} className={`filter-pill ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
              {t !== 'All' && TYPE_ICONS[t]} {t}
            </button>
          ))}
        </div>
        {riskFilter !== 'All' && (
          <button className="btn btn-ghost btn-sm" onClick={() => setRiskFilter('All')}>
            <X size={12} /> Clear Risk Filter
          </button>
        )}
      </motion.div>

      {/* Building Cards */}
      <div className="grid grid-auto" style={{ gap: 16 }}>
        <AnimatePresence>
          {filtered.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className="building-card"
              onClick={() => setSelected(b)}>

              {/* Card Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ fontSize: 28 }}>{TYPE_ICONS[b.type] || '🏢'}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{b.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>
                      <MapPin size={10} /> {b.location}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>

              {/* Risk Bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Risk Score</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: riskColor(b.riskLevel) }}>{b.riskScore} / 100</span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${b.riskScore}%`, background: riskColor(b.riskLevel) }} />
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Compliance', value: `${b.complianceScore}%`, color: b.complianceScore >= 70 ? '#22C55E' : b.complianceScore >= 50 ? '#F59E0B' : '#EF4444' },
                  { label: 'Equipment', value: b.equipmentCount },
                  { label: 'Alerts', value: b.alerts, color: b.alerts > 0 ? '#EF4444' : '#22C55E' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-muted" style={{ fontSize: 10 }}>{b.type}</span>
                  <span className={`badge badge-${b.riskLevel.toLowerCase()}`} style={{ fontSize: 10 }}>{b.riskLevel}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Next: <span style={{ color: '#F59E0B' }}>{b.nextInspection}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <div className="empty-state-title">No buildings found</div>
          <div className="empty-state-sub">Try adjusting your search or filters</div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <BuildingDetailModal building={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
