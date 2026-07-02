import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileBarChart2, ClipboardList, BrainCircuit, ShieldCheck, Flame,
  Download, FileSpreadsheet, Printer, Check, Building2, Calendar
} from 'lucide-react';
import { buildings, inspections, incidents, aiPredictions, complianceData } from '../data/mockData';

const REPORT_TYPES = [
  {
    id: 'inspection',
    label: 'Inspection Report',
    icon: ClipboardList,
    iconBg: 'rgba(37,99,235,0.15)',
    iconColor: '#60A5FA',
    desc: 'Complete inspection records with checklist results, inspector remarks, and compliance scores for all buildings.',
    dataKey: inspections,
    format: (items, bldFilter) => bldFilter === 'all' ? items : items.filter(i => i.buildingId === bldFilter),
  },
  {
    id: 'risk',
    label: 'Risk Assessment Report',
    icon: BrainCircuit,
    iconBg: 'rgba(239,68,68,0.15)',
    iconColor: '#F87171',
    desc: 'AI-generated risk scores with SHAP feature attribution, building risk rankings, and XAI-based recommendations.',
    dataKey: aiPredictions,
    format: (items, bldFilter) => bldFilter === 'all' ? items : items.filter(i => i.buildingId === bldFilter),
  },
  {
    id: 'compliance',
    label: 'Compliance Report',
    icon: ShieldCheck,
    iconBg: 'rgba(34,197,94,0.15)',
    iconColor: '#4ADE80',
    desc: 'Detailed compliance breakdown by building, equipment status, inspection adherence, and regulatory requirements.',
    dataKey: complianceData.byBuilding,
    format: (items, bldFilter) => bldFilter === 'all' ? items : items.filter(i => i.buildingId === bldFilter),
  },
  {
    id: 'incident',
    label: 'Incident Report',
    icon: Flame,
    iconBg: 'rgba(249,115,22,0.15)',
    iconColor: '#FB923C',
    desc: 'Chronological fire incident records with cause analysis, response times, damages, and corrective actions.',
    dataKey: incidents,
    format: (items, bldFilter) => bldFilter === 'all' ? items : items.filter(i => i.buildingId === bldFilter),
  },
];

// ── Report Preview Table ──────────────────────────────────────
function ReportPreview({ type, bldFilter }) {
  if (type === 'inspection') {
    const data = bldFilter === 'all' ? inspections : inspections.filter(i => i.buildingId === bldFilter);
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              {['Inspection ID', 'Building', 'Date', 'Inspector', 'Score', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(i => (
              <tr key={i.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{i.id}</td>
                <td style={{ padding: '10px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{i.building}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{i.date}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{i.inspector}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 800, color: i.overallScore >= 80 ? '#22C55E' : i.overallScore >= 60 ? '#F59E0B' : '#EF4444' }}>{i.overallScore}%</td>
                <td style={{ padding: '10px 14px' }}><span className={`badge ${i.status === 'Completed' ? 'badge-success' : i.status === 'Overdue Action' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: 10 }}>{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'risk') {
    const data = bldFilter === 'all' ? aiPredictions : aiPredictions.filter(p => p.buildingId === bldFilter);
    const c = l => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[l] || '#64748B');
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              {['Building', 'Risk Score', 'Risk Level', 'Confidence', 'Top Factor', 'Recommendations'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.sort((a, b) => b.riskScore - a.riskScore).map(p => (
              <tr key={p.buildingId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.building}</td>
                <td style={{ padding: '10px 14px', fontSize: 15, fontWeight: 900, color: c(p.riskLevel) }}>{p.riskScore}</td>
                <td style={{ padding: '10px 14px' }}><span className={`badge badge-${p.riskLevel.toLowerCase()}`} style={{ fontSize: 10 }}>{p.riskLevel}</span></td>
                <td style={{ padding: '10px 14px', fontSize: 12.5, color: 'var(--text-secondary)' }}>{p.confidence}%</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.features.filter(f => f.direction === 'increases')[0]?.name || '—'}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.recommendations.length} actions</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'compliance') {
    const data = bldFilter === 'all' ? complianceData.byBuilding : complianceData.byBuilding.filter(b => b.buildingId === bldFilter);
    const sc = s => s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : s >= 40 ? '#F97316' : '#EF4444';
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              {['Building', 'Equipment', 'Inspection', 'Maintenance', 'Emergency', 'Overall'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.buildingId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{b.building}</td>
                {['equipment', 'inspection', 'maintenance', 'emergency', 'overall'].map(k => (
                  <td key={k} style={{ padding: '10px 14px', fontSize: 13, fontWeight: k === 'overall' ? 900 : 600, color: sc(b[k]) }}>{b[k]}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'incident') {
    const data = bldFilter === 'all' ? incidents : incidents.filter(i => i.buildingId === bldFilter);
    const sc = l => ({ Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#22C55E' }[l] || '#64748B');
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              {['ID', 'Building', 'Date', 'Type', 'Severity', 'Injuries', 'Damage', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(inc => (
              <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 14px', fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{inc.id}</td>
                <td style={{ padding: '10px 14px', fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{inc.building}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{inc.date}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{inc.type}</td>
                <td style={{ padding: '10px 14px' }}><span className={`badge badge-${inc.severity.toLowerCase()}`} style={{ fontSize: 10 }}>{inc.severity}</span></td>
                <td style={{ padding: '10px 14px', fontSize: 12.5, fontWeight: 700, color: inc.injuries > 0 ? '#EF4444' : '#22C55E' }}>{inc.injuries}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{inc.propertyDamage}</td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: inc.status === 'Resolved' ? '#22C55E' : '#F59E0B' }}>{inc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

// ── Export Loading State ──────────────────────────────────────
function ExportButton({ label, icon: Icon, onClick, loading, disabled }) {
  return (
    <button className="btn btn-secondary" onClick={onClick} disabled={disabled} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      {loading ? (
        <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : <Icon size={15} />}
      {label}
    </button>
  );
}

// ── Reports Page ──────────────────────────────────────────────
export default function Reports() {
  const [activeReport, setActiveReport] = useState(null);
  const [bldFilter,    setBldFilter]    = useState('all');
  const [exporting,    setExporting]    = useState('');
  const [exported,     setExported]     = useState('');

  const handleExport = async (format) => {
    if (!activeReport) return;
    setExporting(format);
    await new Promise(r => setTimeout(r, 2000));
    setExporting('');
    setExported(format);
    setTimeout(() => setExported(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Reports & Analytics</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Generate and export fire safety reports for inspections, risk assessments, compliance, and incidents</p>
      </motion.div>

      {/* Report Type Selection */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-4" style={{ gap: 14 }}>
        {REPORT_TYPES.map((rt, i) => {
          const Icon = rt.icon;
          const isActive = activeReport === rt.id;
          return (
            <motion.div key={rt.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => { setActiveReport(rt.id); setBldFilter('all'); setExported(''); }}
              className="quick-action"
              style={{ outline: isActive ? `2px solid var(--color-primary)` : 'none', outlineOffset: 2 }}>
              <div className="quick-action-icon" style={{ background: rt.iconBg, color: rt.iconColor }}>
                <Icon size={22} />
              </div>
              <div>
                <div className="quick-action-label">{rt.label}</div>
                <div className="quick-action-sub" style={{ marginTop: 4, lineHeight: 1.35 }}>{rt.desc}</div>
              </div>
              {isActive && (
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--color-primary)', fontWeight: 700 }}>
                  <Check size={13} /> Selected
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Report Panel */}
      <AnimatePresence>
        {activeReport && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div className="card-title">{REPORT_TYPES.find(r => r.id === activeReport)?.label}</div>
                  <div className="card-subtitle">Preview — click Export to generate the full report</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Building Filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Building2 size={14} color="var(--text-muted)" />
                    <select className="select" value={bldFilter} onChange={e => setBldFilter(e.target.value)} style={{ width: 'auto', minWidth: 180 }}>
                      <option value="all">All Buildings</option>
                      {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  {/* Export buttons */}
                  <ExportButton label="PDF Report" icon={exported === 'pdf' ? Check : Download} onClick={() => handleExport('pdf')} loading={exporting === 'pdf'} />
                  <ExportButton label="Excel" icon={exported === 'xlsx' ? Check : FileSpreadsheet} onClick={() => handleExport('xlsx')} loading={exporting === 'xlsx'} />
                </div>
              </div>
            </div>

            {/* Export Progress */}
            {(exporting || exported) && (
              <div style={{ padding: '10px 20px', background: exported ? 'rgba(34,197,94,0.08)' : 'rgba(37,99,235,0.08)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                {exported ? (
                  <><Check size={15} color="#22C55E" /><span style={{ color: '#22C55E', fontWeight: 600 }}>Export ready! In a production system, the file would download automatically.</span></>
                ) : (
                  <><div style={{ width: 14, height: 14, border: '2px solid rgba(37,99,235,0.3)', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} /><span style={{ color: 'var(--text-secondary)' }}>Generating {exporting.toUpperCase()} report…</span></>
                )}
              </div>
            )}

            {/* Data Table Preview */}
            <div className="card-body" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <ReportPreview type={activeReport} bldFilter={bldFilter} />
              </div>
            </div>

            {/* Meta footer */}
            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                FireGuard AI · IEEE Final Year Project · Generated: {new Date().toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)' }}>
                <Printer size={13} /> Print-ready format
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeReport && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="empty-state" style={{ padding: '60px 24px' }}>
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">Select a Report Type</div>
          <div className="empty-state-sub">Choose from Inspection, Risk Assessment, Compliance, or Incident reports above to preview and export data</div>
        </motion.div>
      )}
    </div>
  );
}
