import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Building2, Wrench, ClipboardList, AlertTriangle, Zap } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { complianceData, buildings } from '../data/mockData';

const scoreColor  = s => s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : s >= 40 ? '#F97316' : '#EF4444';
const scoreGrade  = s => s >= 90 ? 'A' : s >= 80 ? 'B' : s >= 70 ? 'C+' : s >= 60 ? 'C' : s >= 50 ? 'D' : 'F';

// ── Circular Progress Ring ────────────────────────────────────
function CircleProgress({ score, size = 90, strokeWidth = 8, label }) {
  const r        = (size - strokeWidth) / 2;
  const circ     = 2 * Math.PI * r;
  const dashOff  = circ * (1 - score / 100);
  const color    = scoreColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: dashOff }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: '50% 50%', fill: color, fontSize: size / 4.5, fontWeight: 900, fontFamily: 'var(--font)' }}>
          {score}%
        </text>
      </svg>
      {label && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || 'var(--text-secondary)', display: 'flex', gap: 8 }}>
          <span>{p.name}</span><span style={{ fontWeight: 700 }}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Compliance Page ───────────────────────────────────────────
export default function Compliance() {
  const { overall, byBuilding, trend } = complianceData;

  const radarData = useMemo(() => {
    const avgByCategory = (key) => Math.round(byBuilding.reduce((s, b) => s + b[key], 0) / byBuilding.length);
    return [
      { category: 'Equipment',   value: avgByCategory('equipment'),   fullMark: 100 },
      { category: 'Inspection',  value: avgByCategory('inspection'),  fullMark: 100 },
      { category: 'Maintenance', value: avgByCategory('maintenance'), fullMark: 100 },
      { category: 'Emergency',   value: avgByCategory('emergency'),   fullMark: 100 },
    ];
  }, [byBuilding]);

  const overallScore = overall.score;
  const grade        = scoreGrade(overallScore);
  const color        = scoreColor(overallScore);

  const categories = [
    { key: 'equipment',   label: 'Equipment Compliance',   icon: Wrench,        desc: 'Fire equipment active and within service life' },
    { key: 'inspection',  label: 'Inspection Compliance',  icon: ClipboardList, desc: 'Inspections completed on schedule' },
    { key: 'maintenance', label: 'Maintenance Compliance', icon: AlertTriangle,  desc: 'Scheduled maintenance performed on time' },
    { key: 'emergency',   label: 'Emergency Preparedness', icon: Zap,           desc: 'Emergency exits, drills, and evacuation plans' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Compliance Dashboard</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
          Safety compliance scores based on equipment status, inspection history, and emergency preparedness
        </p>
      </motion.div>

      {/* ── Overall Score ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, alignItems: 'stretch' }}>

        {/* Big score card */}
        <div className="card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: `linear-gradient(135deg, var(--bg-card) 0%, ${color}10 100%)`, borderColor: `${color}30` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Overall Compliance</div>
          <CircleProgress score={overallScore} size={120} strokeWidth={10} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color, letterSpacing: '-1px' }}>Grade {grade}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#22C55E', fontWeight: 600 }}>
            <TrendingUp size={13} /> {overall.trend} vs last month
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last updated: {overall.lastUpdated}</div>
        </div>

        {/* Category circles */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 18 }}>Compliance by Category</div>
          <div className="grid grid-4" style={{ gap: 12 }}>
            {categories.map((cat, i) => {
              const avg = Math.round(byBuilding.reduce((s, b) => s + b[cat.key], 0) / byBuilding.length);
              return (
                <motion.div key={cat.key}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 10px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <CircleProgress score={avg} size={72} strokeWidth={7} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{cat.label.split(' ')[0]}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', lineHeight: 1.3 }}>{cat.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Charts Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card">
          <div className="card-header">
            <div className="card-title">Compliance Radar</div>
            <div className="card-subtitle">Average score across all buildings per category</div>
          </div>
          <div className="card-body" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Radar name="Compliance" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart by Building */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
          <div className="card-header">
            <div className="card-title">Compliance by Building</div>
            <div className="card-subtitle">Overall compliance score per facility</div>
          </div>
          <div className="card-body" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byBuilding} margin={{ left: -20, right: 8, bottom: 20, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="building"
                  tick={{ fontSize: 9.5, fill: 'var(--text-muted)' }}
                  angle={-25} textAnchor="end" interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="overall" name="Overall" radius={[4, 4, 0, 0]}>
                  {byBuilding.map((b, i) => <Cell key={i} fill={scoreColor(b.overall)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Building Compliance Table ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
        <div className="card-header">
          <div className="card-title">Detailed Compliance by Building</div>
          <div className="card-subtitle">Compliance breakdown across all safety categories</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Building', 'Equipment', 'Inspection', 'Maintenance', 'Emergency', 'Overall', 'Grade'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byBuilding.sort((a, b) => b.overall - a.overall).map((row, i) => {
                  const bld = buildings.find(b => b.id === row.buildingId);
                  return (
                    <motion.tr key={row.buildingId}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                      style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        <div>{row.building.split(' ').slice(0, 3).join(' ')}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 400 }}>{bld?.type}</div>
                      </td>
                      {['equipment', 'inspection', 'maintenance', 'emergency'].map(cat => (
                        <td key={cat} style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 50, height: 5, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${row[cat]}%`, background: scoreColor(row[cat]), borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: scoreColor(row[cat]) }}>{row[cat]}%</span>
                          </div>
                        </td>
                      ))}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 15, fontWeight: 900, color: scoreColor(row.overall) }}>{row.overall}%</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${scoreColor(row.overall)}20`, border: `2px solid ${scoreColor(row.overall)}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: scoreColor(row.overall) }}>
                          {scoreGrade(row.overall)}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
