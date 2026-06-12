import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Flame, ClipboardCheck, AlertTriangle, TrendingUp,
  TrendingDown, ChevronRight, BrainCircuit, ShieldCheck, Calendar,
  Zap, Package, FileText, Users, Handshake, Globe, BarChart2,
  ArrowUpRight, CheckCircle2, Clock, MapPin
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import {
  companies, buildings, extinguishers, audits, upcomingAudits,
  alerts, complianceTrend, contracts, fireIncidents, suppliers,
  supplierAnalytics
} from '../data/mockData';

// ── Helpers ──
const riskColor = (level) => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[level] || '#6B7280');
const riskBg    = (level) => ({ Critical: '#FEF2F2', High: '#FFF7ED', Medium: '#FFFBEB', Low: '#F0FDF4' }[level] || '#F9FAFB');

function KpiCard({ label, value, icon: Icon, iconBg, iconColor, accentColor, delta, deltaLabel, onClick }) {
  return (
    <div className="kpi-card animate-up" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', '--kpi-accent': accentColor || 'var(--color-primary)' }}>
      <div className="kpi-icon" style={{ background: iconBg || 'var(--color-primary-ultra)', color: iconColor || 'var(--color-primary)' }}>
        <Icon size={22} />
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {delta !== undefined && (
        <div className="kpi-desc">
          {delta >= 0 ? <TrendingUp size={13} color="var(--status-success)" /> : <TrendingDown size={13} color="var(--status-danger)" />}
          <span style={{ color: delta >= 0 ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>{Math.abs(delta)}%</span>
          <span style={{ color: 'var(--text-muted)' }}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{title}</h2>
        {sub && <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</p>}
      </div>
      {action && <button onClick={onAction} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{action} <ChevronRight size={13} /></button>}
    </div>
  );
}

// ── Tamil Nadu District Risk Map ──────────────────────────────────────────────
function DistrictRiskMap({ scoped }) {
  const districtData = useMemo(() => {
    const districts = ['Coimbatore', 'Chennai', 'Madurai', 'Tiruppur', 'Salem'];
    return districts.map(d => {
      const dBuildings = scoped.filter(b => b.district === d);
      const avgScore   = dBuildings.length ? Math.round(dBuildings.reduce((s, b) => s + b.complianceScore, 0) / dBuildings.length) : null;
      const riskLevel  = dBuildings.some(b => b.riskLevel === 'Critical') ? 'Critical'
        : dBuildings.some(b => b.riskLevel === 'High') ? 'High'
        : dBuildings.some(b => b.riskLevel === 'Medium') ? 'Medium'
        : dBuildings.length ? 'Low' : null;
      return { name: d, buildings: dBuildings.length, avgScore, riskLevel, alerts: dBuildings.reduce((s, b) => s + b.alerts, 0) };
    }).filter(d => d.buildings > 0);
  }, [scoped]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {districtData.map(d => (
          <div key={d.name} className={`district-card ${d.riskLevel?.toLowerCase()}`}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{d.name}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: riskColor(d.riskLevel), lineHeight: 1 }}>{d.avgScore}%</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{d.buildings} building{d.buildings !== 1 ? 's' : ''}</div>
            {d.alerts > 0 && <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: '#EF4444', background: '#FEF2F2', padding: '2px 7px', borderRadius: 20, display: 'inline-block' }}>{d.alerts} alert{d.alerts !== 1 ? 's' : ''}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Role: SUPER ADMIN ─────────────────────────────────────────────────────────
function SuperAdminDash({ nav }) {
  const totalExt     = extinguishers.length;
  const expiredExt   = extinguishers.filter(e => e.status === 'Expired').length;
  const expiringSoon = extinguishers.filter(e => e.status === 'Expiring Soon').length;
  const critBuildings = buildings.filter(b => b.riskLevel === 'Critical').length;
  const activeContracts = contracts.filter(c => c.status === 'Active').length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Greeting */}
      <div className="animate-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Good afternoon, Siva 👋</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Here's your platform overview for today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/reports')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart2 size={14} /> Reports
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => nav('/ai-assistant')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} /> Ask AI
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-5">
        <KpiCard label="Total Companies"   value={companies.length}    icon={Globe}         iconBg="#E0F2FE" iconColor="#0369A1" accentColor="#0369A1" delta={15} deltaLabel="vs last quarter" />
        <KpiCard label="Total Buildings"   value={buildings.length}    icon={Building2}      iconBg="var(--color-primary-ultra)" iconColor="var(--color-primary)" accentColor="var(--color-primary)" delta={12} deltaLabel="new this year" />
        <KpiCard label="Extinguishers"     value={totalExt}            icon={Flame}          iconBg="#FEF3C7" iconColor="#B45309" accentColor="#F59E0B" />
        <KpiCard label="Active Contracts"  value={activeContracts}     icon={FileText}       iconBg="#E0E7FF" iconColor="#4338CA" accentColor="#4338CA" />
        <KpiCard label="Critical Alerts"   value={unreadAlerts}        icon={AlertTriangle}  iconBg="#FEF2F2" iconColor="#EF4444" accentColor="#EF4444" />
      </div>

      {/* Status strip */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Expired Extinguishers', val: expiredExt, color: '#EF4444', bg: '#FEF2F2', path: '/extinguishers' },
          { label: 'Expiring Soon',         val: expiringSoon, color: '#F59E0B', bg: '#FFFBEB', path: '/extinguishers' },
          { label: 'Critical Risk Buildings', val: critBuildings, color: '#EF4444', bg: '#FEF2F2', path: '/buildings' },
          { label: 'Overdue Audits',        val: audits.filter(a => a.status === 'Overdue').length, color: '#F97316', bg: '#FFF7ED', path: '/audits' },
          { label: 'Expiring Contracts',    val: contracts.filter(c => c.status === 'Expiring').length, color: '#B45309', bg: '#FEF3C7', path: '/contracts' },
        ].map(s => (
          <div key={s.label} onClick={() => nav(s.path)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${s.color}30`; }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
            <ArrowUpRight size={12} color={s.color} />
          </div>
        ))}
      </div>

      {/* Map + Compliance Chart */}
      <div className="dashboard-grid-map">
        <div className="card">
          <div className="card-header"><div><div className="card-title">🗺️ Tamil Nadu Risk Map</div><div className="card-subtitle">District-wise compliance overview</div></div></div>
          <div className="card-body"><DistrictRiskMap scoped={buildings} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Compliance Trend</div></div>
          <div className="card-body" style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrend.slice(-6)} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F6F50" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1F6F50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} fill="url(#cg1)" />
                <Area type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Buildings + Alerts */}
      <div className="dashboard-grid-half">
        {/* Recent Buildings */}
        <div className="card">
          <div className="card-header">
            <SectionHeader title="High Risk Buildings" sub="Requires immediate attention" action="View All" onAction={() => nav('/buildings')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {buildings.filter(b => b.riskLevel !== 'Low').slice(0, 4).map(b => (
              <div key={b.id} onClick={() => nav('/buildings')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = '4px'}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: riskBg(b.riskLevel), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={18} color={riskColor(b.riskLevel)} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{b.district} · {b.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: riskColor(b.riskLevel) }}>{b.complianceScore}%</div>
                  <span style={{ fontSize: 10, background: riskBg(b.riskLevel), color: riskColor(b.riskLevel), padding: '1px 6px', borderRadius: 20, fontWeight: 700 }}>{b.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Audits */}
        <div className="card">
          <div className="card-header">
            <SectionHeader title="Upcoming Audits" action="View All" onAction={() => nav('/audits')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {upcomingAudits.slice(0, 4).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: a.priority === 'Critical' ? '#FEF2F2' : a.priority === 'High' ? '#FFF7ED' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={16} color={a.priority === 'Critical' ? '#EF4444' : a.priority === 'High' ? '#F97316' : '#F59E0B'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.building}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{a.date} · {a.auditor}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: a.priority === 'Critical' ? '#FEF2F2' : '#FFF7ED', color: a.priority === 'Critical' ? '#EF4444' : '#F97316' }}>{a.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Role: SUPPLIER ────────────────────────────────────────────────────────────
function SupplierDash({ nav, user }) {
  const sup = suppliers.find(s => s.id === user.supplierId) || suppliers[0];
  const analytics = supplierAnalytics[sup?.id] || supplierAnalytics['SUP-001'];
  const myContracts = contracts.filter(c => c.supplierId === sup?.id);
  const activeC  = myContracts.filter(c => c.status === 'Active').length;
  const expiringC = myContracts.filter(c => c.status === 'Expiring').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="animate-up" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏭</div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{sup?.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Supplier Dashboard · {sup?.districts?.join(', ')}</p>
        </div>
      </div>

      <div className="grid grid-4">
        <KpiCard label="Buildings Covered"     value={sup?.buildingsCovered || 0}    icon={Building2}  iconBg="#DFF3E8" iconColor="#1F6F50" accentColor="#1F6F50" />
        <KpiCard label="Extinguishers Supplied" value={sup?.extinguishersSupplied || 0} icon={Flame}    iconBg="#FEF3C7" iconColor="#B45309" accentColor="#F59E0B" />
        <KpiCard label="Active Contracts"      value={activeC}                        icon={FileText}   iconBg="#E0E7FF" iconColor="#4338CA" accentColor="#4338CA" />
        <KpiCard label="Expiring Contracts"    value={expiringC}                      icon={AlertTriangle} iconBg="#FEF3C7" iconColor="#B45309" accentColor="#F59E0B" />
      </div>

      {/* Performance Score */}
      <div className="card animate-up stagger-2">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="card-title">Performance Score</div>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#1F6F50' }}>{sup?.performanceScore}%</span>
        </div>
        <div className="card-body">
          <div className="progress"><div className="progress-fill success" style={{ width: `${sup?.performanceScore}%` }} /></div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sup?.certifications?.map(c => (
              <span key={c} style={{ fontSize: 11.5, background: 'var(--color-primary-ultra)', color: 'var(--color-primary)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* District-wise Analytics */}
      <div className="dashboard-grid-half">
        <div className="card">
          <div className="card-header"><div className="card-title">📍 District-wise Supply</div></div>
          <div className="card-body" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.districtWise} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="district" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="extinguishers" fill="var(--color-primary)" name="Extinguishers" radius={[4,4,0,0]} />
                <Bar dataKey="buildings" fill="#3B82F6" name="Buildings" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📋 Recent Contracts</div></div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {myContracts.slice(0, 5).map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.buildingName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Expires: {c.endDate}</div>
                </div>
                <span className={`badge ${c.status === 'Active' ? 'badge-success' : c.status === 'Expiring' ? 'badge-warning' : 'badge-danger'}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Role: BUILDING OWNER ──────────────────────────────────────────────────────
function BuildingOwnerDash({ nav, user }) {
  const myBuilding = buildings.find(b => b.id === user.buildingId) || buildings[0];
  const myExts     = extinguishers.filter(e => e.buildingId === myBuilding?.id);
  const myAudits   = audits.filter(a => a.buildingId === myBuilding?.id);
  const myUpcoming = upcomingAudits.filter(a => a.buildingId === myBuilding?.id);
  const myAlerts   = alerts.filter(a => a.building === myBuilding?.name);

  const compScore = myBuilding?.complianceScore || 0;
  const scoreColor = compScore >= 80 ? 'var(--status-success)' : compScore >= 60 ? '#F59E0B' : 'var(--status-danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Building Header */}
      <div className="card animate-up" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #156040 100%)', border: 'none' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginBottom: 4 }}>YOUR BUILDING</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>{myBuilding?.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={13} /> {myBuilding?.district}, {myBuilding?.state} · {myBuilding?.floors} Floors · {myBuilding?.type}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: 'white', lineHeight: 1 }}>{compScore}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Compliance Score</div>
            <div style={{ width: 120, margin: '8px auto 0', height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${compScore}%`, background: 'rgba(255,255,255,0.9)', borderRadius: 20, transition: 'width 0.8s' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-4">
        <KpiCard label="Total Extinguishers" value={myExts.length}                              icon={Flame}         iconBg="#FEF3C7" iconColor="#B45309" accentColor="#F59E0B" />
        <KpiCard label="Expired"             value={myExts.filter(e => e.status==='Expired').length} icon={AlertTriangle} iconBg="#FEF2F2" iconColor="#EF4444" accentColor="#EF4444" />
        <KpiCard label="Upcoming Audits"     value={myUpcoming.length}                          icon={ClipboardCheck} iconBg="#E0E7FF" iconColor="#4338CA" accentColor="#4338CA" />
        <KpiCard label="Active Alerts"       value={myAlerts.filter(a=>!a.read).length}        icon={ShieldCheck}   iconBg="var(--color-primary-ultra)" iconColor="var(--color-primary)" />
      </div>

      {/* AI Recommendations */}
      <div className="card animate-up stagger-3">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ai-pulse-dot" /> AI Safety Recommendations
            </div>
            <div className="card-subtitle">Based on your compliance data</div>
          </div>
          <button onClick={() => nav('/ai-assistant')} className="btn btn-primary btn-sm">Ask AI</button>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myExts.filter(e => e.status !== 'Active').slice(0, 3).map((e, i) => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.status === 'Expired' ? '#EF4444' : '#F59E0B', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{e.status === 'Expired' ? '🚨' : '⚠️'} Extinguisher {e.id} — Floor {e.floor}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{e.status} · {e.type} · {e.location}</div>
              </div>
              <span className={`badge ${e.status === 'Expired' ? 'badge-danger' : 'badge-warning'}`}>{e.status}</span>
            </div>
          ))}
          {myExts.filter(e => e.status !== 'Active').length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--status-success-bg)', borderRadius: 'var(--radius-sm)' }}>
              <CheckCircle2 size={20} color="var(--status-success)" />
              <span style={{ fontSize: 13, color: 'var(--status-success-text)', fontWeight: 600 }}>All extinguishers are in good standing! ✅</span>
            </div>
          )}
        </div>
      </div>

      {/* Audit History */}
      <div className="card">
        <div className="card-header"><SectionHeader title="Recent Audits" action="View All" onAction={() => nav('/audits')} /></div>
        <div className="card-body" style={{ paddingTop: 0 }}>
          {myAudits.slice(0, 3).map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: a.status === 'Completed' ? '#F0FDF4' : '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a.status === 'Completed' ? <CheckCircle2 size={16} color="#22C55E" /> : <Clock size={16} color="#EF4444" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.id} · {a.date}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Auditor: {a.auditor}</div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: a.complianceScore >= 80 ? '#22C55E' : a.complianceScore >= 60 ? '#F59E0B' : '#EF4444' }}>{a.complianceScore}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Role: AUDITOR ─────────────────────────────────────────────────────────────
function AuditorDash({ nav, user }) {
  const myAudits   = audits.filter(a => a.auditorId === user.id);
  const myUpcoming = upcomingAudits.filter(a => a.auditorId === user.id);
  const completed  = myAudits.filter(a => a.status === 'Completed').length;
  const actionReq  = myAudits.filter(a => a.status === 'Action Required' || a.status === 'Overdue').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="animate-up">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Welcome, {user.name} 📋</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Your assigned audits & compliance reports</p>
      </div>

      <div className="grid grid-4">
        <KpiCard label="Scheduled Audits"   value={myUpcoming.length}  icon={Calendar}      iconBg="#E0E7FF" iconColor="#4338CA" accentColor="#4338CA" />
        <KpiCard label="Completed Audits"   value={completed}          icon={CheckCircle2}  iconBg="#F0FDF4" iconColor="#15803D" accentColor="#22C55E" />
        <KpiCard label="Action Required"    value={actionReq}          icon={AlertTriangle} iconBg="#FEF2F2" iconColor="#EF4444" accentColor="#EF4444" />
        <KpiCard label="Avg Compliance"     value={`${myAudits.length ? Math.round(myAudits.reduce((s,a)=>s+a.complianceScore,0)/myAudits.length) : 0}%`} icon={ShieldCheck} iconBg="var(--color-primary-ultra)" iconColor="var(--color-primary)" />
      </div>

      <div className="dashboard-grid-half">
        <div className="card">
          <div className="card-header"><SectionHeader title="Upcoming Audits" action="View All" onAction={() => nav('/audits')} /></div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {myUpcoming.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No upcoming audits assigned.</p> :
            myUpcoming.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.building}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{a.date}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: a.priority === 'Critical' ? '#FEF2F2' : '#FFF7ED', color: a.priority === 'Critical' ? '#EF4444' : '#F97316' }}>{a.priority}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><SectionHeader title="Recent Audit Reports" action="View All" onAction={() => nav('/audits')} /></div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {myAudits.slice(0, 4).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.building}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{a.date} · {a.status}</div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: a.complianceScore >= 80 ? '#22C55E' : a.complianceScore >= 60 ? '#F59E0B' : '#EF4444' }}>{a.complianceScore}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Role: ANALYST ─────────────────────────────────────────────────────────────
function AnalystDash({ nav, user }) {
  const myBuildings = buildings.filter(b => user.buildings?.includes(b.id));
  const avgCompliance = buildings.length ? Math.round(buildings.reduce((s,b) => s+b.complianceScore,0)/buildings.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="animate-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Analytics Dashboard 📊</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Risk insights & compliance trends</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => nav('/ai-assistant')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} /> AI Assistant
        </button>
      </div>

      <div className="grid grid-4">
        <KpiCard label="Avg Compliance"  value={`${avgCompliance}%`}        icon={ShieldCheck}  iconBg="var(--color-primary-ultra)" iconColor="var(--color-primary)" />
        <KpiCard label="High Risk"       value={buildings.filter(b=>['Critical','High'].includes(b.riskLevel)).length} icon={AlertTriangle} iconBg="#FEF2F2" iconColor="#EF4444" accentColor="#EF4444" />
        <KpiCard label="Assigned Bldgs"  value={myBuildings.length || 'All'} icon={Building2}    iconBg="#E0F2FE" iconColor="#0369A1" />
        <KpiCard label="AI Risk Reports" value={3}                           icon={BrainCircuit} iconBg="#F3E8FF" iconColor="#7C3AED" accentColor="#7C3AED" onClick={() => nav('/ai-risk')} />
      </div>

      {/* Compliance Trend Chart */}
      <div className="card animate-up stagger-2">
        <div className="card-header">
          <div className="card-title">📈 Compliance Trend — Full Year</div>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/reports')}>Export Report</button>
        </div>
        <div className="card-body" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={complianceTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F6F50" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1F6F50" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="score"  stroke="var(--color-primary)" strokeWidth={2} fill="url(#cg2)" name="Compliance %" />
              <Area type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-4">
          {[
            { label: 'AI Risk Analysis', sub: 'View risk scores', icon: BrainCircuit, path: '/ai-risk', color: '#7C3AED', bg: '#F3E8FF' },
            { label: 'Generate Report',  sub: 'Export compliance', icon: FileText,    path: '/reports', color: '#1F6F50', bg: '#DFF3E8' },
            { label: 'View Buildings',   sub: 'Portfolio overview', icon: Building2,  path: '/buildings', color: '#0369A1', bg: '#E0F2FE' },
            { label: 'AI Chat',          sub: 'Ask anything',     icon: BrainCircuit, path: '/ai-assistant', color: '#B45309', bg: '#FEF3C7' },
          ].map(a => (
            <div key={a.path} className="quick-action" onClick={() => nav(a.path)}>
              <div className="quick-action-icon" style={{ background: a.bg, color: a.color }}><a.icon size={22} /></div>
              <div className="quick-action-label">{a.label}</div>
              <div className="quick-action-sub">{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPANY ADMIN ─────────────────────────────────────────────────────────────
function CompanyAdminDash({ nav, user }) {
  const scoped = buildings.filter(b => b.companyId === user.companyId);
  const scopedExts = extinguishers.filter(e => e.companyId === user.companyId);
  const avgScore = scoped.length ? Math.round(scoped.reduce((s,b)=>s+b.complianceScore,0)/scoped.length) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="animate-up">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Managing {user.companyName} · {scoped.length} buildings</p>
      </div>
      <div className="grid grid-4">
        <KpiCard label="Buildings"         value={scoped.length}             icon={Building2}      iconBg="var(--color-primary-ultra)" iconColor="var(--color-primary)" />
        <KpiCard label="Extinguishers"     value={scopedExts.length}         icon={Flame}          iconBg="#FEF3C7" iconColor="#B45309" accentColor="#F59E0B" />
        <KpiCard label="Avg Compliance"   value={`${avgScore}%`}            icon={ShieldCheck}    iconBg="#F0FDF4" iconColor="#15803D" accentColor="#22C55E" />
        <KpiCard label="Active Alerts"     value={alerts.filter(a=>a.companyId===user.companyId&&!a.read).length} icon={AlertTriangle} iconBg="#FEF2F2" iconColor="#EF4444" accentColor="#EF4444" />
      </div>
      <div className="dashboard-grid-map">
        <div className="card">
          <div className="card-header"><div><div className="card-title">🗺️ Tamil Nadu Risk Map</div><div className="card-subtitle">Your buildings by district</div></div></div>
          <div className="card-body"><DistrictRiskMap scoped={scoped} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Compliance Trend</div></div>
          <div className="card-body" style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrend.slice(-6)}>
                <defs><linearGradient id="cg3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1F6F50" stopOpacity={0.2} /><stop offset="95%" stopColor="#1F6F50" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} fill="url(#cg3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isSuperAdmin, isSupplier, isBuildingOwner, isAuditor, isAnalyst } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  if (isSuperAdmin)    return <SuperAdminDash   nav={navigate} user={user} />;
  if (isSupplier)      return <SupplierDash      nav={navigate} user={user} />;
  if (isBuildingOwner) return <BuildingOwnerDash nav={navigate} user={user} />;
  if (isAuditor)       return <AuditorDash       nav={navigate} user={user} />;
  if (isAnalyst)       return <AnalystDash        nav={navigate} user={user} />;
  return <CompanyAdminDash nav={navigate} user={user} />;
}
