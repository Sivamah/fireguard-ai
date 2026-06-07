import React, { useState } from 'react';
import { Search, ClipboardCheck, CheckCircle, AlertTriangle, Clock, Plus, Eye, Download, Calendar, User } from 'lucide-react';
import { audits as initialAudits, upcomingAudits as initialUpcoming } from '../data/mockData';

const StatusBadge = ({ status }) => {
  const configs = {
    'Completed': { cls: 'badge-success' },
    'Action Required': { cls: 'badge-warning' },
    'Overdue': { cls: 'badge-danger' },
    'Scheduled': { cls: 'badge-info' },
  };
  const cfg = configs[status] || { cls: 'badge-neutral' };
  return <span className={`badge ${cfg.cls}`}>{status}</span>;
};

const EMPTY_SCHEDULE = { building: '', auditor: '', date: '', priority: 'Medium', notes: '' };

export default function Audits() {
  const [audits] = useState(initialAudits);
  const [upcomingAudits, setUpcomingAudits] = useState(initialUpcoming);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('history');
  const [selected, setSelected] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(null);
  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE);

  const filtered = audits.filter(a =>
    a.building.toLowerCase().includes(search.toLowerCase()) ||
    a.auditor.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const downloadAuditReport = (audit) => {
    const content = [
      'FIREGUARD AI — AUDIT REPORT',
      '============================',
      `Audit ID: ${audit.id}`,
      `Building: ${audit.building}`,
      `Auditor: ${audit.auditor}`,
      `Date: ${audit.date}`,
      `Status: ${audit.status}`,
      `Compliance Score: ${audit.complianceScore}%`,
      '',
      'FINDINGS',
      '--------',
      audit.findings,
      '',
      `Generated: ${new Date().toISOString()}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audit.id}-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleScheduleAudit = (e) => {
    e.preventDefault();
    const newAudit = {
      id: `SCH-${String(upcomingAudits.length + 10).padStart(3, '0')}`,
      building: scheduleForm.building,
      date: scheduleForm.date,
      auditor: scheduleForm.auditor,
      priority: scheduleForm.priority,
      notes: scheduleForm.notes,
    };
    setUpcomingAudits(prev => [...prev, newAudit]);
    setScheduleForm(EMPTY_SCHEDULE);
    setIsScheduleOpen(false);
  };

  const handleReschedule = (audit, newDate) => {
    setUpcomingAudits(prev => prev.map(a => a.id === audit.id ? { ...a, date: newDate } : a));
    setIsRescheduleOpen(null);
  };

  const handlePrepare = (audit) => {
    const content = [
      'AUDIT PREPARATION CHECKLIST',
      '============================',
      `Building: ${audit.building}`,
      `Scheduled Date: ${audit.date}`,
      `Assigned Auditor: ${audit.auditor}`,
      `Priority: ${audit.priority}`,
      '',
      'CHECKLIST:',
      '[ ] Review last audit findings',
      '[ ] Collect extinguisher inspection logs',
      '[ ] Prepare fire exit route maps',
      '[ ] Verify sprinkler system records',
      '[ ] Schedule building access with facility manager',
      '[ ] Print compliance checklists',
      '',
      `Generated: ${new Date().toISOString()}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audit.id}-preparation-checklist.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div className="grid grid-4" style={{ gap: 16 }}>
        {[
          { label: 'Total Audits', value: audits.length, color: '#3B82F6', icon: ClipboardCheck },
          { label: 'Completed', value: audits.filter(a => a.status === 'Completed').length, color: '#22C55E', icon: CheckCircle },
          { label: 'Action Required', value: audits.filter(a => a.status === 'Action Required').length, color: '#F59E0B', icon: Clock },
          { label: 'Overdue', value: audits.filter(a => a.status === 'Overdue').length, color: '#EF4444', icon: AlertTriangle },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="kpi-card animate-up" style={{ animationDelay: `${(i + 1) * 0.05}s` }}>
              <div className="kpi-icon" style={{ background: `${stat.color}15` }}>
                <Icon size={20} color={stat.color} strokeWidth={2} />
              </div>
              <div className="kpi-label">{stat.label}</div>
              <div className="kpi-value">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div className="tabs">
          <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
            Audit History
          </button>
          <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>
            Upcoming Audits ({upcomingAudits.length})
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="input-wrap" style={{ width: 220 }}>
            <Search size={14} className="input-icon" />
            <input className="input" placeholder="Search audits..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setScheduleForm(EMPTY_SCHEDULE); setIsScheduleOpen(true); }}>
            <Plus size={13} /> Schedule Audit
          </button>
        </div>
      </div>

      {/* History Table */}
      {tab === 'history' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Audit History</div>
            <div className="card-subtitle">{filtered.length} records</div>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0, marginTop: 16 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Building</th>
                  <th>Auditor</th>
                  <th>Date</th>
                  <th>Compliance</th>
                  <th>Findings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(audit => (
                  <tr key={audit.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: audit.status === 'Overdue' ? '#FEF2F2' : audit.status === 'Action Required' ? '#FFFBEB' : 'var(--color-primary-ultra-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <ClipboardCheck size={14} color={audit.status === 'Overdue' ? '#DC2626' : audit.status === 'Action Required' ? '#B45309' : 'var(--color-primary)'} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 12.5 }}>{audit.id}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, fontWeight: 500 }}>{audit.building}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{audit.auditor}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{audit.date}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60 }}>
                          <div style={{
                            height: '100%',
                            width: `${audit.complianceScore}%`,
                            background: audit.complianceScore >= 80 ? 'var(--status-success)' :
                              audit.complianceScore >= 60 ? 'var(--status-warning)' : 'var(--status-danger)',
                            borderRadius: 9999
                          }} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: audit.complianceScore >= 80 ? 'var(--status-success)' :
                            audit.complianceScore >= 60 ? '#B45309' : '#DC2626'
                        }}>{audit.complianceScore}%</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 240 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }} className="truncate">{audit.findings}</div>
                    </td>
                    <td><StatusBadge status={audit.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setSelected(audit)} title="View Details"><Eye size={13} /></button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Download Report"
                          onClick={() => downloadAuditReport(audit)}
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                      No audits match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upcoming Audits */}
      {tab === 'upcoming' && (
        <div className="grid grid-3" style={{ gap: 20 }}>
          {upcomingAudits.map(audit => (
            <div key={audit.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: audit.priority === 'Critical' ? '#FEF2F2' : audit.priority === 'High' ? '#FFFBEB' : 'var(--color-primary-ultra-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ClipboardCheck size={20} color={audit.priority === 'Critical' ? '#DC2626' : audit.priority === 'High' ? '#B45309' : 'var(--color-primary)'} />
                </div>
                <span className={`badge badge-${audit.priority === 'Critical' ? 'danger' : audit.priority === 'High' ? 'warning' : 'neutral'}`}>
                  {audit.priority}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{audit.building}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} /> {audit.date}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={12} /> {audit.auditor}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setIsRescheduleOpen(audit)}
                >
                  Reschedule
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handlePrepare(audit)}
                >
                  Prepare
                </button>
              </div>
            </div>
          ))}
          {upcomingAudits.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              No upcoming audits scheduled. Click "Schedule Audit" to add one.
            </div>
          )}
        </div>
      )}

      {/* Audit Detail Modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 560,
            boxShadow: 'var(--shadow-xl)', animation: 'fadeInUp 0.25s ease', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '24px 28px',
              background: selected.status === 'Overdue' ? 'linear-gradient(135deg,#DC2626,#EF4444)' :
                selected.status === 'Action Required' ? 'linear-gradient(135deg,#EA580C,#F97316)' :
                  'linear-gradient(135deg,var(--color-primary),var(--color-secondary))',
              color: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{selected.id}</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{selected.building}</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Audited by {selected.auditor} · {selected.date}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', cursor: 'pointer', fontSize: 12 }}>Close</button>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{selected.complianceScore}%</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>Compliance Score</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Audit Findings</div>
              <div style={{
                padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20
              }}>
                {selected.findings}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => downloadAuditReport(selected)}
                >
                  <Download size={14} /> Download Report
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => { setSelected(null); setIsScheduleOpen(true); setScheduleForm(f => ({ ...f, building: selected.building })); }}
                >
                  Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Audit Modal */}
      {isScheduleOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setIsScheduleOpen(false)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 460,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Schedule New Audit</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add a new audit to the upcoming schedule.</div>
            </div>
            <form onSubmit={handleScheduleAudit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Building *</label>
                <input required className="input" placeholder="e.g. Nexus Tower" style={{ width: '100%' }}
                  value={scheduleForm.building} onChange={e => setScheduleForm(f => ({ ...f, building: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Auditor Name *</label>
                <input required className="input" placeholder="e.g. Priya Sharma" style={{ width: '100%' }}
                  value={scheduleForm.auditor} onChange={e => setScheduleForm(f => ({ ...f, auditor: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Date *</label>
                  <input required type="date" className="input" style={{ width: '100%' }}
                    value={scheduleForm.date} onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Priority</label>
                  <select className="select" style={{ width: '100%' }}
                    value={scheduleForm.priority} onChange={e => setScheduleForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Notes</label>
                <textarea className="input" placeholder="Optional audit notes..." style={{ width: '100%', minHeight: 64, resize: 'vertical' }}
                  value={scheduleForm.notes} onChange={e => setScheduleForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsScheduleOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Schedule Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setIsRescheduleOpen(null)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 380,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden', padding: '28px'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>Reschedule Audit</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>{isRescheduleOpen.building}</div>
            <form onSubmit={e => { e.preventDefault(); handleReschedule(isRescheduleOpen, e.target.date.value); }}>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>New Date *</label>
              <input required type="date" name="date" className="input" defaultValue={isRescheduleOpen.date} style={{ width: '100%', marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsRescheduleOpen(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
