import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Wrench, ClipboardList, AlertTriangle, BrainCircuit,
  ShieldCheck, ChevronRight, TrendingUp, TrendingDown,
  CheckCircle2, Clock, Flame, Zap, ArrowRight
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { buildings, equipment, inspections, incidents, alerts, complianceTrend, aiPredictions } from '../data/mockData';

// ── Helpers ──────────────────────────────────────────────────
const riskColor = l => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[l] || '#64748B');
const riskBg    = l => ({ Critical: 'rgba(239,68,68,0.12)', High: 'rgba(249,115,22,0.12)', Medium: 'rgba(245,158,11,0.12)', Low: 'rgba(34,197,94,0.12)' }[l] || 'var(--bg-elevated)');
const statusColor = s => ({ Active: '#22C55E', Expired: '#EF4444', 'Expiring Soon': '#F59E0B', 'Needs Maintenance': '#F97316' }[s] || '#64748B');

function AnimatedCounter({ value, suffix = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'inline-block' }}
    >
      {value}{suffix}
    </motion.span>
  );
}

// ── KPI Card ─────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, iconBg, iconColor, accentColor, delta, deltaLabel, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="kpi-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', '--kpi-accent': accentColor || 'var(--color-primary)' }}
    >
      <div className="kpi-icon" style={{ background: iconBg, color: iconColor }}>
        <Icon size={21} />
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value"><AnimatedCounter value={value} /></div>
      {delta !== undefined && (
        <div className="kpi-desc">
          {delta >= 0
            ? <TrendingUp size={13} color="var(--status-success)" />
            : <TrendingDown size={13} color="var(--status-danger)" />}
          <span style={{ color: delta >= 0 ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>{Math.abs(delta)}%</span>
          <span style={{ color: 'var(--text-muted)' }}>{deltaLabel}</span>
        </div>
      )}
    </motion.div>
  );
}

// ── Section Header ────────────────────────────────────────────
function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div className="section-header">
      <div>
        <div className="section-title">{title}</div>
        {sub && <div className="section-sub">{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Computed stats ──
  const totalBuildings     = buildings.length;
  const totalEquipment     = equipment.length;
  const expiredEquipment   = equipment.filter(e => e.status === 'Expired').length;
  const expiringSoon       = equipment.filter(e => e.status === 'Expiring Soon').length;
  const needsMaintenance   = equipment.filter(e => e.status === 'Needs Maintenance').length;
  const pendingInspections = inspections.filter(i => i.status === 'Overdue Action' || i.status === 'Action Required').length;
  const highRiskBuildings  = buildings.filter(b => b.riskLevel === 'Critical' || b.riskLevel === 'High').length;
  const unreadAlerts       = alerts.filter(a => !a.read).length;

  const overallCompliance  = useMemo(() => {
    const scores = buildings.map(b => b.complianceScore);
    return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
  }, []);

  // Top risk building for overview panel
  const topRiskBuilding = useMemo(() => {
    const sorted = [...aiPredictions].sort((a, b) => b.riskScore - a.riskScore);
    return sorted[0];
  }, []);

  const gaugeData = [{ value: topRiskBuilding?.riskScore || 0, fill: riskColor(topRiskBuilding?.riskLevel) }];

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Greeting Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            FireGuard AI · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/reports')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ClipboardList size={14} /> Reports
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/ai-prediction')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={14} /> AI Prediction
          </button>
        </div>
      </motion.div>

      {/* ── Research Workflow Banner ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 100%)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="ai-pulse-dot" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Research Workflow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Building Data', path: '/buildings', icon: Building2 },
            { label: 'Equipment', path: '/equipment', icon: Wrench },
            { label: 'Inspection', path: '/inspections', icon: ClipboardList },
            { label: 'Incidents', path: '/incidents', icon: Flame },
            { label: 'AI Prediction', path: '/ai-prediction', icon: BrainCircuit },
            { label: 'Compliance', path: '/compliance', icon: ShieldCheck },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div onClick={() => navigate(step.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = '#60A5FA'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                <step.icon size={12} />
                {step.label}
              </div>
              {i < 5 && <ArrowRight size={12} color="var(--text-muted)" />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-4" style={{ gap: 16 }}>
        <KpiCard label="Total Buildings"    value={totalBuildings}    icon={Building2}    iconBg="rgba(37,99,235,0.12)"   iconColor="#60A5FA"  accentColor="#2563EB" delta={0}  deltaLabel="this month" onClick={() => navigate('/buildings')} delay={0} />
        <KpiCard label="Total Equipment"    value={totalEquipment}    icon={Wrench}       iconBg="rgba(34,197,94,0.12)"   iconColor="#4ADE80"  accentColor="#22C55E" delta={2}  deltaLabel="new items"  onClick={() => navigate('/equipment')} delay={0.05} />
        <KpiCard label="Pending Inspections" value={pendingInspections} icon={ClipboardList} iconBg="rgba(245,158,11,0.12)" iconColor="#FCD34D" accentColor="#F59E0B" delta={-1} deltaLabel="vs last week" onClick={() => navigate('/inspections')} delay={0.10} />
        <KpiCard label="High Risk Buildings" value={highRiskBuildings}  icon={AlertTriangle} iconBg="rgba(239,68,68,0.12)" iconColor="#F87171"  accentColor="#EF4444" onClick={() => navigate('/buildings')} delay={0.15} />
      </div>

      {/* ── Equipment Status Strip ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { label: 'Expired Equipment',   val: expiredEquipment,  color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  path: '/equipment' },
          { label: 'Expiring Soon',       val: expiringSoon,      color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', path: '/equipment' },
          { label: 'Needs Maintenance',   val: needsMaintenance,  color: '#F97316', bg: 'rgba(249,115,22,0.1)', path: '/equipment' },
          { label: 'Unread Alerts',       val: unreadAlerts,      color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  path: '/' },
          { label: 'Compliance Score',    val: `${overallCompliance}%`, color: overallCompliance >= 70 ? '#22C55E' : '#F59E0B', bg: overallCompliance >= 70 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', path: '/compliance' },
        ].map(s => (
          <div key={s.label} onClick={() => navigate(s.path)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 'var(--radius-full)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${s.color}30`}>
            <span style={{ fontSize: 17, fontWeight: 800, color: s.color }}>{s.val}</span>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* ── Row: AI Risk Overview + Recent Alerts ── */}
      <div className="dashboard-grid-half">
        {/* AI Risk Overview */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="ai-pulse-dot" /> AI Risk Overview
                </div>
                <div className="card-subtitle">{topRiskBuilding?.building}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/ai-prediction')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <BrainCircuit size={13} /> Predict
              </button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              {/* Gauge */}
              <div style={{ width: 110, height: 110, flexShrink: 0, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" startAngle={180} endAngle={-180} data={[{ value: 100, fill: 'var(--bg-elevated)' }, ...gaugeData]}>
                    <RadialBar dataKey="value" cornerRadius={4} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: riskColor(topRiskBuilding?.riskLevel), letterSpacing: '-1px' }}>{topRiskBuilding?.riskScore}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>RISK</div>
                </div>
              </div>
              {/* Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span className={`badge badge-${topRiskBuilding?.riskLevel?.toLowerCase()}`}>{topRiskBuilding?.riskLevel} Risk</span>
                  <span className="badge badge-primary">{topRiskBuilding?.confidence}% confidence</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {topRiskBuilding?.features?.filter(f => f.direction === 'increases').slice(0, 3).map(f => (
                    <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor(f.severity), flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{f.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: riskColor(f.severity) }}>{f.impact}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card">
          <div className="card-header">
            <SectionHeader title="Recent Alerts" sub={`${unreadAlerts} unread`} action="View All" onAction={() => navigate('/incidents')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {alerts.slice(0, 5).map(alert => {
              const dc = riskColor(alert.type);
              return (
                <div key={alert.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'flex-start' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: dc, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.building}</span>
                      <span style={{ fontSize: 10, color: dc, fontWeight: 700, flexShrink: 0, marginLeft: 6 }}>{alert.type}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{alert.message}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }}>{alert.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Row: Recent Inspections + Compliance Overview ── */}
      <div className="dashboard-grid-half">
        {/* Recent Inspections */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <div className="card-header">
            <SectionHeader title="Recent Inspections" sub="Latest inspection results" action="View All" onAction={() => navigate('/inspections')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {inspections.slice(0, 4).map(ins => (
              <div key={ins.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)', minHeight: 54 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: ins.overallScore >= 80 ? 'rgba(34,197,94,0.12)' : ins.overallScore >= 60 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {ins.overallScore >= 60 ? <CheckCircle2 size={17} color={ins.overallScore >= 80 ? '#22C55E' : '#F59E0B'} /> : <AlertTriangle size={17} color="#EF4444" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.building}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{ins.date} · {ins.inspector}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: ins.overallScore >= 80 ? '#22C55E' : ins.overallScore >= 60 ? '#F59E0B' : '#EF4444' }}>{ins.overallScore}%</div>
                  <span className={`badge ${ins.status === 'Completed' ? 'badge-success' : ins.status === 'Overdue Action' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{ins.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Overview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <div className="card-header">
            <SectionHeader title="Compliance Overview" sub="6-month trend" action="Details" onAction={() => navigate('/compliance')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {/* Overall score */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Overall Compliance</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: overallCompliance >= 70 ? '#22C55E' : '#F59E0B' }}>{overallCompliance}%</span>
            </div>
            {/* Mini trend chart */}
            <div style={{ height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceTrend} margin={{ top: 2, right: 2, bottom: 2, left: -30 }}>
                  <defs>
                    <linearGradient id="cgrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                  <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2} fill="url(#cgrad)" name="Score %" />
                  <Area type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 3" fill="none" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 2, background: '#2563EB', borderRadius: 2 }} /> Score
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 2, background: '#F59E0B', borderRadius: 2, borderTop: '1px dashed' }} /> Target (80%)
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Row: High Risk Buildings + Recent Incidents ── */}
      <div className="dashboard-grid-half">
        {/* High Risk Buildings */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <div className="card-header">
            <SectionHeader title="High Risk Buildings" sub="Requires immediate attention" action="View All" onAction={() => navigate('/buildings')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {buildings.filter(b => b.riskLevel === 'Critical' || b.riskLevel === 'High').map(b => (
              <div key={b.id} onClick={() => navigate('/buildings')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'padding-left 0.15s', minHeight: 56 }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = '4px'}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: riskBg(b.riskLevel), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={18} color={riskColor(b.riskLevel)} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{b.type} · {b.district}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: riskColor(b.riskLevel) }}>{b.riskScore}</div>
                  <span className={`badge badge-${b.riskLevel.toLowerCase()}`} style={{ fontSize: 10 }}>{b.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card">
          <div className="card-header">
            <SectionHeader title="Recent Incidents" sub="Fire events & safety alerts" action="View All" onAction={() => navigate('/incidents')} />
          </div>
          <div className="card-body" style={{ paddingTop: 0 }}>
            {incidents.map(inc => (
              <div key={inc.id} onClick={() => navigate('/incidents')}
                style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: riskBg(inc.severity), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Flame size={16} color={riskColor(inc.severity)} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.building}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.cause}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{inc.date} · Response: {inc.responseTime}</div>
                </div>
                <span className={`badge badge-${inc.severity.toLowerCase()}`} style={{ fontSize: 10, flexShrink: 0, alignSelf: 'flex-start', marginTop: 2 }}>{inc.severity}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
