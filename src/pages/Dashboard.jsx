import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Flame, ShieldCheck, AlertTriangle, CalendarClock,
  Bell, TrendingUp, TrendingDown, ArrowRight, Zap,
  Plus, FileText, Calendar, RefreshCw, ChevronRight,
  CheckCircle, Clock, AlertCircle, Bot, Sparkles
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  buildings, alerts, upcomingAudits, complianceTrend,
  riskDistribution, extinguisherStatus
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';

/* ── Derived KPIs ─────────────────────────────────────────── */
const totalBuildings    = buildings.length;
const totalExtinguishers= buildings.reduce((acc, b) => acc + b.extinguishers, 0);
const avgCompliance     = Math.round(buildings.reduce((acc, b) => acc + b.complianceScore, 0) / buildings.length);
const highRisk          = buildings.filter(b => b.riskLevel === 'High' || b.riskLevel === 'Critical').length;
const upcomingCount     = upcomingAudits.length;
const unreadAlerts      = alerts.filter(a => !a.read).length;

/* ── Campus Map Data ─────────────────────────────────────── */
const CAMPUS = [
  { name: 'Nexus Tower',     risk: 'Low',      score: 94, floors: 42 },
  { name: 'Helix Park',      risk: 'Medium',   score: 71, floors: 28 },
  { name: 'Prism Center',    risk: 'Critical', score: 42, floors: 18 },
  { name: 'Azure Tech Hub',  risk: 'Low',      score: 88, floors: 14 },
  { name: 'Meridian Plaza',  risk: 'High',     score: 61, floors: 22 },
];

const RISK_COLORS = {
  Low:      { bg: '#F0FDF4', border: '#86EFAC', dot: '#22C55E', text: '#15803D', label: 'Low Risk'      },
  Medium:   { bg: '#FFFBEB', border: '#FCD34D', dot: '#F59E0B', text: '#B45309', label: 'Medium Risk'   },
  High:     { bg: '#FFF7ED', border: '#FDBA74', dot: '#F97316', text: '#C2410C', label: 'High Risk'     },
  Critical: { bg: '#FEF2F2', border: '#FCA5A5', dot: '#EF4444', text: '#B91C1C', label: 'Critical Risk' },
};

/* ── Subcomponents ───────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
const KpiCard = ({ icon: Icon, iconBg, iconColor, label, value, desc, descColor, stagger }) => (
  <div className="kpi-card animate-up" style={{ animationDelay: `${stagger * 0.07}s` }}>
    <div className="kpi-icon" style={{ background: iconBg }}>
      <Icon size={20} color={iconColor} strokeWidth={2} />
    </div>
    <div className="kpi-label">{label}</div>
    <div className="kpi-value">{value}</div>
    <div className="kpi-desc" style={{ color: descColor || 'var(--text-secondary)' }}>{desc}</div>
  </div>
);

const AlertRow = ({ alert }) => {
  const cfg = {
    Critical: { bg: '#FEF2F2', border: '#FECACA', dot: '#EF4444', textColor: '#B91C1C' },
    High:     { bg: '#FFF7ED', border: '#FDBA74', dot: '#F97316', textColor: '#C2410C' },
    Medium:   { bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B', textColor: '#92400E' },
    Low:      { bg: '#EFF6FF', border: '#BFDBFE', dot: '#3B82F6', textColor: '#1D4ED8' },
  }[alert.type] || {};

  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '14px 20px', borderBottom: '1px solid var(--border-light)',
      background: alert.read ? 'transparent' : cfg.bg,
      transition: 'background 0.12s'
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0, marginTop: 5 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{alert.building}</span>
            {!alert.read && (
              <span style={{ marginLeft: 8, fontSize: 9.5, fontWeight: 700, background: cfg.dot, color: 'white', padding: '1px 6px', borderRadius: 99 }}>NEW</span>
            )}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{alert.time}</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.5 }}>{alert.message}</div>
      </div>
    </div>
  );
};

const AuditRow = ({ audit, navigate }) => {
  const daysLeft = Math.ceil((new Date(audit.date) - new Date()) / (1000 * 60 * 60 * 24));
  const urgency = daysLeft <= 3 ? 'danger' : daysLeft <= 7 ? 'warning' : 'success';
  const colors = { danger: '#EF4444', warning: '#F59E0B', success: '#22C55E' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
      borderBottom: '1px solid var(--border-light)', transition: 'background 0.12s', cursor: 'pointer'
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      onClick={() => navigate('/audits')}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${colors[urgency]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CalendarClock size={16} color={colors[urgency]} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{audit.building}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{audit.auditor} · {audit.date}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: colors[urgency] }}>{daysLeft}d</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>left</div>
      </div>
    </div>
  );
};

/* ── Donut Chart ─────────────────────────────────────────── */
const DonutChart = ({ data, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
    <div style={{ position: 'relative', width: 160, height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
          {data.reduce((a, d) => a + d.value, 0)}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
            <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Building Risk Campus ────────────────────────────────── */
const CampusMap = ({ navigate }) => (
  <div style={{
    background: 'linear-gradient(145deg, #E8F5EE 0%, #F0F9F4 50%, #EAF5F0 100%)',
    borderRadius: 'var(--radius-lg)', padding: 24, minHeight: 240,
    border: '1px solid #C7E8D5'
  }}>
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
      {CAMPUS.map((b, i) => {
        const cfg = RISK_COLORS[b.risk];
        const heights = [120, 96, 80, 72, 88];
        const h = heights[i] || 80;
        return (
          <div
            key={i}
            className="campus-building"
            onClick={() => navigate('/buildings')}
            style={{ cursor: 'pointer', flexShrink: 0, minWidth: 90 }}
          >
            {/* Tower graphic */}
            <div style={{
              width: '100%', height: h,
              background: cfg.bg, border: `2px solid ${cfg.border}`,
              borderRadius: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 6,
              transition: 'all 0.2s var(--ease-spring)',
              boxShadow: `0 4px 12px ${cfg.dot}20`
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${cfg.dot}35`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px ${cfg.dot}20`; }}
            >
              <Building2 size={20} color={cfg.dot} strokeWidth={1.5} />
              <div style={{ fontSize: 13, fontWeight: 800, color: cfg.text }}>{b.score}%</div>
              <div style={{ fontSize: 10, color: cfg.text, opacity: 0.7 }}>{b.floors}F</div>
            </div>
            {/* Labels */}
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{b.name}</div>
              <div style={{
                marginTop: 4, fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 99,
                background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
                display: 'inline-block'
              }}>
                {cfg.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    {/* Legend */}
    <div style={{ display: 'flex', gap: 16, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Object.entries(RISK_COLORS).map(([key, cfg]) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.dot }} />
          <span style={{ color: 'var(--text-secondary)' }}>{cfg.label}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Quick Actions ───────────────────────────────────────── */
const ACTIONS = [
  { label: 'Add Building',       sub: 'Register new property',       icon: Building2,   bg: '#DFF3E8', color: '#1F6F50', path: '/buildings' },
  { label: 'Add Extinguisher',   sub: 'Register fire equipment',     icon: Flame,        bg: '#FEE2E2', color: '#DC2626', path: '/extinguishers' },
  { label: 'Schedule Audit',     sub: 'Book compliance inspection',  icon: Calendar,     bg: '#EFF6FF', color: '#2563EB', path: '/audits' },
  { label: 'Generate Report',    sub: 'Export compliance data',      icon: FileText,     bg: '#F5F3FF', color: '#7C3AED', path: '/reports' },
  { label: 'Ask AI Assistant',   sub: 'Get intelligent insights',    icon: Bot,          bg: '#FFFBEB', color: '#D97706', path: '/ai-assistant' },
];

/* ── Compliance Line Chart ───────────────────────────────── */
const ComplianceChart = () => {
  const last6 = complianceTrend.slice(-6);
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={last6} margin={{ top: 5, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1F6F50" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#1F6F50" stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#E5E7EB" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-md)' }}
          formatter={(v, n) => [`${v}%`, n === 'score' ? 'Score' : 'Target']}
        />
        <Area type="monotone" dataKey="target" stroke="#E5E7EB" strokeWidth={1.5} fill="url(#targetGrad)" strokeDasharray="5 3" dot={false} />
        <Area type="monotone" dataKey="score"  stroke="#1F6F50" strokeWidth={2.5} fill="url(#compGrad)"   dot={{ r: 3, fill: '#1F6F50', strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/* ── Main Dashboard Component ───────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setReady(true); }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (!ready) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── GREETING HEADER ── */}
      <div className="animate-up" style={{ animationDelay: '0s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.6px', lineHeight: 1.2 }}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 6, maxWidth: 500 }}>
              Here's what's happening with your fire safety system today. You have{' '}
              <span style={{ fontWeight: 700, color: '#EF4444' }}>{unreadAlerts} urgent alerts</span> and{' '}
              <span style={{ fontWeight: 700, color: '#F59E0B' }}>{upcomingCount} upcoming audits</span>.
            </p>
          </div>
          <button className="btn btn-primary animate-up" style={{ animationDelay: '0.2s', flexShrink: 0 }} onClick={() => navigate('/ai-assistant')}>
            <Sparkles size={15} /> Ask AI Assistant
          </button>
        </div>
      </div>

      {/* ── CRITICAL ALERT BANNER ── */}
      {buildings.some(b => b.riskLevel === 'Critical') && (
        <div className="animate-up" style={{
          animationDelay: '0.05s',
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)',
          border: '1.5px solid #FECACA',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color="#EF4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#B91C1C' }}>
              Action Required — Prism Corporate Center at Critical Risk
            </div>
            <div style={{ fontSize: 13, color: '#DC2626', opacity: 0.8, marginTop: 2 }}>
              Overdue audit · expired extinguishers · compliance at 42% — immediate attention needed
            </div>
          </div>
          <button className="btn btn-danger btn-sm" style={{ flexShrink: 0 }} onClick={() => navigate('/buildings')}>
            View Details <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* ── KPI CARDS ── */}
      <div className="grid grid-3" style={{ gap: 16 }}>
        <KpiCard
          icon={Building2} iconBg="#DFF3E8" iconColor="#1F6F50"
          label="Total Buildings" value={totalBuildings}
          desc={`${buildings.filter(b => b.riskLevel === 'Low').length} buildings low risk`}
          stagger={1}
        />
        <KpiCard
          icon={Flame} iconBg="#FEE2E2" iconColor="#EF4444"
          label="Extinguishers" value={totalExtinguishers}
          desc={<><span style={{ color: '#EF4444', fontWeight: 700 }}>14%</span> expired or expiring</>}
          stagger={2}
        />
        <KpiCard
          icon={ShieldCheck} iconBg="#EFF6FF" iconColor="#3B82F6"
          label="Avg. Compliance" value={`${avgCompliance}%`}
          desc={<><TrendingUp size={13} style={{ display: 'inline' }} /> <span style={{ color: '#22C55E', fontWeight: 700 }}>+6.2%</span> vs last quarter</>}
          stagger={3}
        />
        <KpiCard
          icon={AlertTriangle} iconBg="#FFF7ED" iconColor="#F97316"
          label="High Risk Buildings" value={highRisk}
          desc="Require immediate attention"
          descColor="#C2410C"
          stagger={4}
        />
        <KpiCard
          icon={CalendarClock} iconBg="#F5F3FF" iconColor="#7C3AED"
          label="Upcoming Audits" value={upcomingCount}
          desc={`Next: ${upcomingAudits[0]?.building.split(' ')[0]} on ${upcomingAudits[0]?.date}`}
          stagger={5}
        />
        <KpiCard
          icon={Bell} iconBg="#FFFBEB" iconColor="#D97706"
          label="Active Alerts" value={unreadAlerts}
          desc={`${alerts.filter(a => a.type === 'Critical').length} critical need action`}
          descColor="#B91C1C"
          stagger={6}
        />
      </div>

      {/* ── CAMPUS MAP + RISK OVERVIEW ── */}
      <div className="dashboard-grid-map">
        {/* Map */}
        <div className="card animate-up" style={{ animationDelay: '0.15s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">🗺 Building Campus Map</div>
              <div className="card-subtitle">Visual risk overview across your property portfolio</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/buildings')}>
              View All <ChevronRight size={13} />
            </button>
          </div>
          <div className="card-body">
            <CampusMap navigate={navigate} />
          </div>
        </div>

        {/* Risk Donut */}
        <div className="card animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Risk Overview</div>
              <div className="card-subtitle">Portfolio risk distribution</div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart data={riskDistribution} label="Buildings" />
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE CHART + EXTINGUISHER STATUS ── */}
      <div className="dashboard-grid-chart">
        {/* Compliance Trend */}
        <div className="card animate-up" style={{ animationDelay: '0.18s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Compliance Score Trend</div>
              <div className="card-subtitle">Last 6 months — overall portfolio performance</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-success"><TrendingUp size={10} /> +6.2% YoY</span>
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const csv = 'Month,Score,Target\n' + complianceTrend.slice(-6).map(r => `${r.month},${r.score},${r.target}`).join('\n');
                const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: 'compliance.csv' });
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
              }}>Export</button>
            </div>
          </div>
          <div className="card-body">
            <ComplianceChart />
            <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 24, height: 2, background: '#1F6F50', borderRadius: 2 }} />
                Compliance Score
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 24, height: 2, background: '#E5E7EB', borderRadius: 2, borderTop: '1px dashed #9CA3AF' }} />
                Target (85%)
              </div>
            </div>
          </div>
        </div>

        {/* Extinguisher Status */}
        <div className="card animate-up" style={{ animationDelay: '0.22s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Extinguisher Status</div>
              <div className="card-subtitle">Equipment health overview</div>
            </div>
          </div>
          <div className="card-body">
            <DonutChart data={extinguisherStatus} label="Units" />
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="animate-up" style={{ animationDelay: '0.2s' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Quick Actions</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Common tasks — click to get started</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  padding: '22px 14px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)',
                  background: 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.2s var(--ease-spring)',
                  textAlign: 'center', flex: '1 1 150px', minWidth: 150
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={action.color} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{action.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{action.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ALERTS + UPCOMING AUDITS ── */}
      <div className="dashboard-grid-half">
        {/* Recent Alerts */}
        <div className="card animate-up" style={{ animationDelay: '0.25s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Recent Alerts</div>
              <div className="card-subtitle">{unreadAlerts} unread notifications</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/buildings')}>View all</button>
          </div>
          <div style={{ marginTop: 12 }}>
            {alerts.slice(0, 4).map(alert => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* Upcoming Audits */}
        <div className="card animate-up" style={{ animationDelay: '0.28s' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Upcoming Audits</div>
              <div className="card-subtitle">Scheduled inspections — stay prepared</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/audits')}>Schedule</button>
          </div>
          <div style={{ marginTop: 12 }}>
            {upcomingAudits.slice(0, 4).map(audit => (
              <AuditRow key={audit.id} audit={audit} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>

      {/* ── AI ASSISTANT PROMO ── */}
      <div className="animate-up" style={{ animationDelay: '0.3s' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A3828 0%, #1F6F50 50%, #2D8A65 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 48px',
          display: 'flex', alignItems: 'center', gap: 48,
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -40, right: 40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -60, right: 180, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          {/* AI Robot Illustration */}
          <div style={{
            width: 100, height: 100, borderRadius: 24,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            backdropFilter: 'blur(10px)'
          }}>
            <Bot size={48} color="rgba(255,255,255,0.9)" strokeWidth={1.5} />
          </div>

          {/* Text */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Sparkles size={16} color="#4ADE80" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#4ADE80', letterSpacing: 1, textTransform: 'uppercase' }}>AI Powered</span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 10 }}>
              Need insights? Ask FireGuard AI
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20, maxWidth: 480 }}>
              Get instant answers about building compliance, expiring equipment, audit readiness, and risk assessment — powered by intelligent analysis.
            </p>
            {/* Suggested prompts */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {[
                'Which buildings have high risk?',
                'Show expired extinguishers',
                'Generate compliance report',
                'Audits due this week?',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => navigate('/ai-assistant')}
                  style={{
                    padding: '6px 14px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.85)', fontSize: 12.5, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                    backdropFilter: 'blur(4px)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <button
              className="btn btn-lg"
              onClick={() => navigate('/ai-assistant')}
              style={{ background: 'white', color: '#1F6F50', fontWeight: 700, borderRadius: 10, border: 'none' }}
            >
              <Bot size={18} /> Ask AI Assistant <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER PLATFORM BENEFITS ── */}
      <div className="animate-up" style={{ animationDelay: '0.35s' }}>
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
          padding: '28px 32px',
          display: 'flex', flexWrap: 'wrap', gap: 24
        }}>
          {[
            { icon: '🤖', title: 'AI Powered',              sub: 'Intelligent risk assessment & predictions' },
            { icon: '🔔', title: 'Real-time Alerts',        sub: 'Instant notifications for critical issues' },
            { icon: '✅', title: 'Compliance Tracking',     sub: 'Automated audit trails & reporting' },
            { icon: '🏢', title: 'Multi-location',          sub: 'Manage unlimited buildings from one view' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: '1 1 200px' }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
