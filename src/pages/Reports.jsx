import React, { useState } from 'react';
import { FileBarChart2, Download, FileText, Shield, Flame, ClipboardCheck, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { buildings as initialBuildings } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

// ─── Report Definitions ──────────────────────────────────────
const reports = [
  {
    id: 'RPT-001',
    title: 'Compliance Summary Report',
    description: 'Full portfolio compliance overview with building scores, audit status, and regulatory gap analysis.',
    icon: Shield,
    color: '#22C55E',
    bg: '#F0FDF4',
    formats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2026-06-01',
    pages: '12-18 pages',
  },
  {
    id: 'RPT-002',
    title: 'Audit History Report',
    description: 'Comprehensive audit trail with findings, auditor notes, compliance scores, and remediation status.',
    icon: ClipboardCheck,
    color: '#3B82F6',
    bg: '#EFF6FF',
    formats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2026-05-28',
    pages: '8-14 pages',
  },
  {
    id: 'RPT-003',
    title: 'Extinguisher Status Report',
    description: 'Complete inventory status, expiry tracking, replacement schedule, and maintenance log.',
    icon: Flame,
    color: '#F59E0B',
    bg: '#FFFBEB',
    formats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2026-06-03',
    pages: '6-10 pages',
  },
  {
    id: 'RPT-004',
    title: 'Risk Assessment Report',
    description: 'AI-generated risk analysis with building risk scores, factor breakdown, and prioritized recommendations.',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: '#FEF2F2',
    formats: ['PDF', 'Excel', 'CSV'],
    lastGenerated: '2026-06-05',
    pages: '15-22 pages',
  },
];

const recentReports = [
  { name: 'Q2-2026 Compliance Summary.pdf', date: '2026-06-05', size: '2.4 MB', type: 'PDF' },
  { name: 'FireGuard Corporate Center Risk Assessment.pdf', date: '2026-06-03', size: '1.8 MB', type: 'PDF' },
  { name: 'May-2026 Extinguisher Report.xls', date: '2026-06-01', size: '0.9 MB', type: 'Excel' },
  { name: 'Portfolio Audit History Q2.csv', date: '2026-05-28', size: '3.1 MB', type: 'CSV' },
];

// ─── Export Helpers ───────────────────────────────────────────

/**
 * FIX: Generate real CSV content with proper MIME type.
 * Root Cause was: Blob used 'text/plain' for all formats — files opened as garbled text.
 */
function generateCSV(report, scopeBuildings, selectedPeriod, totalBuildings) {
  const timestamp = new Date().toISOString();
  const rows = [];

  // CSV Header metadata
  rows.push(['FireGuard AI — ' + report.title]);
  rows.push(['Scope', scopeBuildings.length === totalBuildings ? 'All Buildings' : scopeBuildings.map(b => b.name).join('; ')]);
  rows.push(['Period', selectedPeriod]);
  rows.push(['Generated', timestamp]);
  rows.push([]); // blank line

  // Data headers
  rows.push(['Building ID', 'Building Name', 'District', 'Area', 'Floors', 'Compliance Score', 'Risk Score', 'Risk Level', 'Extinguishers', 'Last Audit', 'Next Audit', 'Active Alerts']);

  // Data rows
  scopeBuildings.forEach(b => {
    rows.push([
      b.id,
      b.name,
      b.district,
      b.area,
      b.floors,
      b.complianceScore + '%',
      b.riskScore,
      b.riskLevel,
      b.extinguishers,
      b.lastAudit,
      b.nextAudit,
      b.alerts,
    ]);
  });

  // Properly escape CSV values (handle commas and quotes)
  const csvContent = rows.map(row =>
    row.map(cell => {
      const val = String(cell ?? '');
      return val.includes(',') || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',')
  ).join('\n');

  return csvContent;
}

/**
 * FIX: Generate real Excel-compatible TSV with proper MIME type.
 * application/vnd.ms-excel with tab-separated content opens natively in Excel.
 */
function generateExcel(report, scopeBuildings, selectedPeriod, totalBuildings) {
  const timestamp = new Date().toISOString();
  const rows = [];

  rows.push(['FireGuard AI Report', report.title, '', '', '', '']);
  rows.push(['Scope', scopeBuildings.length === totalBuildings ? 'All Buildings' : scopeBuildings.map(b => b.name).join('; ')]);
  rows.push(['Period', selectedPeriod, '', '', '', '']);
  rows.push(['Generated', timestamp, '', '', '', '']);
  rows.push([]);

  rows.push(['Building ID', 'Building Name', 'District', 'Area', 'Floors', 'Compliance %', 'Risk Score', 'Risk Level', 'Extinguishers', 'Last Audit', 'Next Audit', 'Active Alerts']);

  scopeBuildings.forEach(b => {
    rows.push([b.id, b.name, b.district, b.area, b.floors, b.complianceScore, b.riskScore, b.riskLevel, b.extinguishers, b.lastAudit, b.nextAudit, b.alerts]);
  });

  // Tab-separated for Excel compatibility
  return rows.map(row => row.join('\t')).join('\r\n');
}

/**
 * FIX: Generate a proper HTML report that opens in browser, renders correctly,
 * and can be printed/saved as PDF via browser print dialog.
 * Root Cause was: Blob with 'text/plain' MIME → PDF extension showed as garbled text in PDF viewer.
 */
function generatePDFHTML(report, scopeBuildings, selectedPeriod, totalBuildings) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const avgCompliance = scopeBuildings.length > 0
    ? Math.round(scopeBuildings.reduce((a, b) => a + b.complianceScore, 0) / scopeBuildings.length)
    : 0;
  const criticalCount = scopeBuildings.filter(b => b.riskLevel === 'Critical').length;
  const highCount = scopeBuildings.filter(b => b.riskLevel === 'High').length;

  const riskBadge = (level) => {
    const colors = { Low: '#22C55E', Medium: '#F59E0B', High: '#F97316', Critical: '#EF4444' };
    const bg = { Low: '#F0FDF4', Medium: '#FFFBEB', High: '#FFF7ED', Critical: '#FEF2F2' };
    return `<span style="background:${bg[level]};color:${colors[level]};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">${level}</span>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FireGuard AI — ${report.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #F8FAFC; color: #1E293B; }
    .header { background: linear-gradient(135deg, #1A3828, #1F6F50); color: white; padding: 40px 48px; }
    .header h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header .subtitle { font-size: 14px; opacity: 0.75; margin-top: 6px; }
    .meta { display: flex; gap: 32px; margin-top: 24px; font-size: 13px; }
    .meta-item label { opacity: 0.6; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .meta-item value { font-weight: 700; font-size: 14px; }
    .content { padding: 40px 48px; max-width: 960px; margin: 0 auto; }
    .kpi-row { display: flex; gap: 20px; margin-bottom: 32px; }
    .kpi { background: white; border-radius: 12px; padding: 20px 24px; flex: 1; box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid #E2E8F0; }
    .kpi-val { font-size: 32px; font-weight: 800; color: #1E293B; }
    .kpi-label { font-size: 12px; color: #64748B; margin-top: 4px; }
    .section-title { font-size: 16px; font-weight: 700; color: #1E293B; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #E2E8F0; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.07); margin-bottom: 32px; }
    th { background: #F1F5F9; padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; }
    td { padding: 12px 16px; border-top: 1px solid #F1F5F9; font-size: 13px; }
    tr:hover td { background: #F8FAFC; }
    .footer { text-align: center; padding: 32px; font-size: 12px; color: #94A3B8; }
    @media print { body { background: white; } .header { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:12px;opacity:0.6;margin-bottom:8px;">🔥 FIREGUARD AI · TAMIL NADU FIRE SAFETY PLATFORM</div>
    <h1>${report.title}</h1>
    <div class="subtitle">${report.description}</div>
    <div class="meta">
      <div class="meta-item"><label>Scope</label><value>${scopeBuildings.length === totalBuildings ? 'All Buildings' : scopeBuildings.map(b => b.name).join(', ')}</value></div>
      <div class="meta-item"><label>Period</label><value>${selectedPeriod}</value></div>
      <div class="meta-item"><label>Generated</label><value>${timestamp} IST</value></div>
      <div class="meta-item"><label>Report ID</label><value>${report.id}-${new Date().toISOString().slice(0,10)}</value></div>
    </div>
  </div>

  <div class="content">
    <div class="kpi-row">
      <div class="kpi"><div class="kpi-val">${scopeBuildings.length}</div><div class="kpi-label">Buildings in Scope</div></div>
      <div class="kpi"><div class="kpi-val" style="color:#3B82F6">${avgCompliance}%</div><div class="kpi-label">Avg. Compliance Score</div></div>
      <div class="kpi"><div class="kpi-val" style="color:#EF4444">${criticalCount}</div><div class="kpi-label">Critical Risk Buildings</div></div>
      <div class="kpi"><div class="kpi-val" style="color:#F97316">${highCount}</div><div class="kpi-label">High Risk Buildings</div></div>
    </div>

    <div class="section-title">Building Details</div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Building Name</th>
          <th>District</th>
          <th>Area</th>
          <th>Floors</th>
          <th>Compliance</th>
          <th>Risk Score</th>
          <th>Risk Level</th>
          <th>Extinguishers</th>
          <th>Last Audit</th>
          <th>Next Audit</th>
        </tr>
      </thead>
      <tbody>
        ${scopeBuildings.map(b => `
        <tr>
          <td style="font-family:monospace;font-size:11px;color:#64748B">${b.id}</td>
          <td style="font-weight:600">${b.name}</td>
          <td>${b.district}</td>
          <td>${b.area}</td>
          <td>${b.floors}</td>
          <td style="font-weight:700;color:${b.complianceScore >= 80 ? '#22C55E' : b.complianceScore >= 60 ? '#F59E0B' : '#EF4444'}">${b.complianceScore}%</td>
          <td style="font-weight:700">${b.riskScore}</td>
          <td>${riskBadge(b.riskLevel)}</td>
          <td>${b.extinguishers}</td>
          <td>${b.lastAudit}</td>
          <td>${b.nextAudit}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <div class="section-title">Summary by District</div>
    <table>
      <thead>
        <tr><th>District</th><th>Buildings</th><th>Avg. Compliance</th><th>High/Critical Buildings</th><th>Total Extinguishers</th></tr>
      </thead>
      <tbody>
        ${[...new Set(scopeBuildings.map(b => b.district))].map(district => {
          const distBuildings = scopeBuildings.filter(b => b.district === district);
          const distAvg = Math.round(distBuildings.reduce((a, b) => a + b.complianceScore, 0) / distBuildings.length);
          const distRisk = distBuildings.filter(b => b.riskLevel === 'High' || b.riskLevel === 'Critical').length;
          const distExt = distBuildings.reduce((a, b) => a + b.extinguishers, 0);
          return `<tr>
            <td style="font-weight:700">${district}</td>
            <td>${distBuildings.length}</td>
            <td style="font-weight:700;color:${distAvg >= 80 ? '#22C55E' : distAvg >= 60 ? '#F59E0B' : '#EF4444'}">${distAvg}%</td>
            <td>${distRisk}</td>
            <td>${distExt}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <strong>FireGuard AI</strong> · Tamil Nadu Fire Safety Compliance Platform<br>
    This report was auto-generated. Use Ctrl+P / Cmd+P to save as PDF.
  </div>
</body>
</html>`;
}

/**
 * FIX: Unified download handler with format-aware MIME types and real content.
 *
 * BEFORE: All formats used Blob([text], {type:'text/plain'}) — files corrupted/unreadable.
 * AFTER:
 *   CSV  → text/csv, real CSV rows
 *   Excel → application/vnd.ms-excel, TSV content (opens in Excel natively)
 *   PDF  → Opens HTML report in new tab (use Ctrl+P to Save as PDF)
 */
function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revoke to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Main Component ───────────────────────────────────────────
export default function Reports() {
  const { user, isSuperAdmin } = useAuth();
  
  const buildings = React.useMemo(() => {
    return isSuperAdmin ? initialBuildings : initialBuildings.filter(b => b.companyId === user?.companyId);
  }, [isSuperAdmin, user]);

  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [selectedPeriod, setSelectedPeriod] = useState('Q2 2026 (Apr-Jun)');

  const scopeBuildings = selectedBuilding === 'All Buildings'
    ? buildings
    : buildings.filter(b => b.name === selectedBuilding);

  const filteredRecentReports = React.useMemo(() => {
    let filtered = [...recentReports];
    if (selectedBuilding !== 'All Buildings') {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(selectedBuilding.toLowerCase().split(' ')[0]));
    }
    return filtered;
  }, [selectedBuilding, selectedPeriod]);

  const handleGenerate = (report, format) => {
    const reportDef = typeof report.id === 'string' && report.id.startsWith('RPT')
      ? reports.find(r => r.id === report.id) || report
      : report;

    setGenerating(report.id);
    setGenerated(null);

    // Use setTimeout to allow UI to update before heavy work
    setTimeout(() => {
      const dateStr = new Date().toISOString().slice(0, 10);
      const safeName = (reportDef.title || reportDef.name || 'report').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
      const scopeStr = (selectedBuilding === 'All Buildings' ? 'All-Buildings' : selectedBuilding.replace(/\s+/g, '-')).replace(/[^a-zA-Z0-9\-]/g, '');

      if (format === 'CSV') {
        // ✅ FIX: Real CSV with proper MIME type
        const csvContent = generateCSV(reportDef, scopeBuildings, selectedPeriod);
        triggerDownload(
          csvContent,
          `${safeName}-${scopeStr}-${dateStr}.csv`,
          'text/csv;charset=utf-8;'
        );

      } else if (format === 'Excel') {
        // ✅ FIX: Tab-separated values with Excel MIME type — opens in Excel natively
        const excelContent = generateExcel(reportDef, scopeBuildings, selectedPeriod);
        triggerDownload(
          excelContent,
          `${safeName}-${scopeStr}-${dateStr}.xls`,
          'application/vnd.ms-excel;charset=utf-8;'
        );

      } else if (format === 'PDF') {
        // ✅ FIX: Open structured HTML report in new tab (renders as readable report)
        // User can print/save as PDF using browser's Ctrl+P dialog
        const htmlContent = generatePDFHTML(reportDef, scopeBuildings, selectedPeriod);
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');
        if (!newTab) {
          // Fallback if popup blocked: download as HTML
          triggerDownload(htmlContent, `${safeName}-${scopeStr}-${dateStr}.html`, 'text/html;charset=utf-8;');
        }
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }

      setGenerating(null);
      setGenerated(report.id);
      setTimeout(() => setGenerated(null), 3000);
    }, 800);
  };

  const getFormatIcon = (fmt) => {
    if (fmt === 'PDF') return '📄';
    if (fmt === 'Excel') return '📊';
    if (fmt === 'CSV') return '📋';
    return '📄';
  };

  const getFormatHint = (fmt) => {
    if (fmt === 'PDF') return 'Opens in browser tab • Print to save PDF';
    if (fmt === 'Excel') return 'Downloads .xls • Opens in Excel';
    if (fmt === 'CSV') return 'Downloads .csv • Opens in any spreadsheet';
    return '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <PageHeader
        title="Compliance Reports"
        description="Generate, view, and export detailed fire safety reports for your Tamil Nadu portfolio."
      />

      {/* Filters */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>Scope</div>
            <select className="select" value={selectedBuilding} onChange={e => setSelectedBuilding(e.target.value)} style={{ width: 220 }}>
              <option value="All Buildings">All Buildings</option>
              {buildings.map(b => (
                <option key={b.id} value={b.name}>{b.name} ({b.district})</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>Period</div>
            <select className="select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} style={{ width: 200 }}>
              <option value="Q2 2026 (Apr-Jun)">Q2 2026 (Apr-Jun)</option>
              <option value="Q1 2026 (Jan-Mar)">Q1 2026 (Jan-Mar)</option>
              <option value="Full Year 2025">Full Year 2025</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Scope: <strong>{selectedBuilding}</strong> · {selectedPeriod} · <strong>{scopeBuildings.length} building{scopeBuildings.length !== 1 ? 's' : ''}</strong>
            </div>
          </div>
        </div>

        {/* Format Guide */}
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { fmt: 'PDF', hint: 'Opens in browser • Print/Save as PDF', color: '#EF4444' },
            { fmt: 'Excel', hint: 'Downloads .xls • Opens in Microsoft Excel', color: '#22C55E' },
            { fmt: 'CSV', hint: 'Downloads .csv • Opens in any spreadsheet app', color: '#3B82F6' },
          ].map(({ fmt, hint, color }) => (
            <div key={fmt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 700, color, fontSize: 11 }}>{fmt}</span>
              <span>— {hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="dashboard-grid-half" style={{ gap: 20 }}>
        {reports.map(report => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          const isGenerated = generated === report.id;

          return (
            <div key={report.id} className="report-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div className="report-icon" style={{ background: report.bg, flexShrink: 0 }}>
                  <Icon size={24} color={report.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{report.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{report.description}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>~{report.pages}</span>
                <span style={{ fontSize: 11, color: 'var(--border-color)' }}>·</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Last: {report.lastGenerated}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {isGenerated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--status-success)', fontSize: 13, fontWeight: 600 }}>
                    <CheckCircle size={16} />
                    Done! Check your downloads or new tab.
                  </div>
                ) : (
                  <>
                    {report.formats.map(fmt => (
                      <button
                        key={fmt}
                        id={`btn-${report.id}-${fmt}`}
                        className={fmt === 'PDF' ? 'btn btn-primary btn-sm' : fmt === 'Excel' ? 'btn btn-secondary btn-sm' : 'btn btn-ghost btn-sm'}
                        onClick={() => handleGenerate(report, fmt)}
                        disabled={isGenerating}
                        title={getFormatHint(fmt)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        {isGenerating ? (
                          <>
                            <div style={{
                              width: 12, height: 12, border: '2px solid currentColor',
                              borderTopColor: 'transparent', borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite'
                            }} />
                            Generating...
                          </>
                        ) : (
                          <>{getFormatIcon(fmt)} {fmt === 'PDF' ? 'Open PDF' : `Download ${fmt}`}</>
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Reports</div>
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Showing all generated reports.')}>View All</button>
        </div>
        <div className="table-container hidden-on-mobile" style={{ border: 'none', borderRadius: 0, marginTop: 12 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecentReports.map((report, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: report.type === 'PDF' ? '#FEF2F2' : report.type === 'Excel' ? '#F0FDF4' : '#EFF6FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <FileText size={14} color={report.type === 'PDF' ? '#DC2626' : report.type === 'Excel' ? '#16A34A' : '#2563EB'} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{report.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${report.type === 'PDF' ? 'badge-danger' : report.type === 'Excel' ? 'badge-success' : 'badge-info'}`} style={{ fontSize: 10 }}>
                      {report.type}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{report.date}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{report.size}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-sm btn-icon"
                        title={`Re-generate ${report.type}`}
                        onClick={() => handleGenerate(
                          { id: `recent-${i}`, title: report.name, description: 'Re-generated report' },
                          report.type
                        )}
                      >
                        <Download size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => {
                        const shareUrl = `${window.location.origin}/reports/${report.name.replace(/\s+/g, '-').toLowerCase()}`;
                        navigator.clipboard?.writeText(shareUrl).then(() => {
                          alert('Share link copied to clipboard!');
                        }).catch(() => {
                          alert(`Share link: ${shareUrl}`);
                        });
                      }}>Share</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="show-on-mobile" style={{ marginTop: 16 }}>
          {filteredRecentReports.map((report, i) => (
            <div key={i} className="mobile-card">
              <div className="mobile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: report.type === 'PDF' ? '#FEF2F2' : '#F0FDF4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FileText size={16} color={report.type === 'PDF' ? '#DC2626' : '#16A34A'} />
                  </div>
                  <div>
                    <div className="mobile-card-title">{report.name}</div>
                    <div className="mobile-card-subtitle">{report.date} · {report.size}</div>
                  </div>
                </div>
              </div>
              <div className="mobile-card-actions">
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleGenerate({ id: `recent-${i}`, title: report.name, description: 'Re-generated report' }, report.type)}>
                  <Download size={13} style={{ marginRight: 4 }} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
