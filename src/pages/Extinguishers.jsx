import React, { useState, useMemo } from 'react';
import { Search, Flame, AlertTriangle, CheckCircle, Clock, Plus, Eye, ChevronUp, ChevronDown, X, RefreshCw } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { extinguishers as initialExtinguishers } from '../data/mockData';

const StatusBadge = ({ status }) => {
  const configs = {
    'Active': { cls: 'badge-success', icon: <CheckCircle size={10} /> },
    'Expiring Soon': { cls: 'badge-warning', icon: <Clock size={10} /> },
    'Expired': { cls: 'badge-danger', icon: <AlertTriangle size={10} /> },
  };
  const cfg = configs[status] || { cls: 'badge-neutral' };
  return (
    <span className={`badge ${cfg.cls}`}>
      {cfg.icon} {status}
    </span>
  );
};

const EMPTY_ADD = { building: '', floor: '', type: 'CO₂', installDate: '', expiryDate: '' };

export default function Extinguishers() {
  const [extinguishers, setExtinguishers] = useState(initialExtinguishers);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedExt, setSelectedExt] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD);

  const types = [...new Set(extinguishers.map(e => e.type))];

  const filtered = useMemo(() => {
    let data = [...extinguishers];
    if (search) data = data.filter(e =>
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.building.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase())
    );
    const statusMap = { Active: 'Active', 'Expiring': 'Expiring Soon', Expired: 'Expired' };
    if (activeTab !== 'All') data = data.filter(e => e.status === (statusMap[activeTab] || activeTab));
    if (typeFilter !== 'All') data = data.filter(e => e.type === typeFilter);
    data.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return data;
  }, [extinguishers, search, activeTab, typeFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const counts = {
    All: extinguishers.length,
    Active: extinguishers.filter(e => e.status === 'Active').length,
    Expiring: extinguishers.filter(e => e.status === 'Expiring Soon').length,
    Expired: extinguishers.filter(e => e.status === 'Expired').length,
  };

  const handleReplace = (ext) => {
    if (window.confirm(`Confirm replacement for Unit ${ext.id}?\n\nThis will mark the unit as Active with today's date.`)) {
      const today = new Date().toISOString().slice(0, 10);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);
      setExtinguishers(prev => prev.map(e => e.id === ext.id
        ? { ...e, status: 'Active', installDate: today, expiryDate: expiryDate.toISOString().slice(0, 10), lastInspection: today }
        : e
      ));
      if (selectedExt?.id === ext.id) setSelectedExt(null);
    }
  };

  const handleAddUnit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const newUnit = {
      id: `EXT-${2500 + extinguishers.length}`,
      building: addForm.building,
      buildingId: 'BLD-NEW',
      floor: parseInt(addForm.floor) || 1,
      type: addForm.type,
      installDate: addForm.installDate || today,
      expiryDate: addForm.expiryDate,
      status: 'Active',
      lastInspection: today,
    };
    setExtinguishers(prev => [...prev, newUnit]);
    setAddForm(EMPTY_ADD);
    setIsAddOpen(false);
  };

  const generateReplacementReport = () => {
    const expired = extinguishers.filter(e => e.status === 'Expired');
    const content = `Unit ID,Building,Floor,Type,Expiry Date,Last Inspection\n${expired.map(e =>
      `${e.id},${e.building},${e.floor},${e.type},${e.expiryDate},${e.lastInspection}`
    ).join('\n')}`;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `replacement-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary Cards */}
      <div className="grid grid-4" style={{ gap: 16 }}>
        {[
          { label: 'Total Tracked', value: extinguishers.length, color: '#3B82F6', sub: 'Across all buildings', icon: Flame },
          { label: 'Active', value: counts.Active, color: '#22C55E', sub: `${counts.Active > 0 ? Math.round(counts.Active / extinguishers.length * 100) : 0}% of portfolio`, icon: CheckCircle },
          { label: 'Expiring Soon', value: counts.Expiring, color: '#F59E0B', sub: 'Within 30 days', icon: Clock },
          { label: 'Expired', value: counts.Expired, color: '#EF4444', sub: 'Immediate replacement needed', icon: AlertTriangle },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="kpi-card animate-up" style={{ animationDelay: `${(i + 1) * 0.05}s` }}>
              <div className="kpi-icon" style={{ background: `${stat.color}15` }}>
                <Icon size={20} color={stat.color} strokeWidth={2} />
              </div>
              <div className="kpi-label">{stat.label}</div>
              <div className="kpi-value">{stat.value}</div>
              <div className="kpi-desc">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Expiry Alert */}
      {counts.Expired > 0 && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-lg)',
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12
        }}>
          <AlertTriangle size={18} color="#DC2626" />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
              {counts.Expired} expired extinguishers require immediate replacement
            </span>
            <span style={{ fontSize: 12, color: '#EF4444', marginLeft: 8 }}>
              Non-compliance risk — action required within 48 hours
            </span>
          </div>
          <button className="btn btn-danger btn-sm" onClick={generateReplacementReport}>
            Generate Replacement Report
          </button>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Extinguisher Inventory"
        description={`${filtered.length} records`}
        action={
          <button className="btn btn-primary btn-sm" onClick={() => { setAddForm(EMPTY_ADD); setIsAddOpen(true); }}>
            <Plus size={13} /> Add Unit
          </button>
        }
      />

      {/* Table Card */}
      <div className="card" style={{ overflow: 'visible', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
        
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="input-wrap" style={{ flex: '1 1 220px' }}>
            <Search size={14} className="input-icon" />
            <input className="input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 140 }}>
            <option value="All">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Status Tabs */}
        <div style={{ paddingBottom: 16, overflowX: 'auto' }}>
          <div className="tabs">
            {Object.entries(counts).map(([key, count]) => (
              <button
                key={key}
                className={`tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {key} <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.6 }}>({count})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="table-container hidden-on-mobile">
          <table className="data-table">
            <thead>
              <tr>
                {[
                  { key: 'id', label: 'Unit ID' },
                  { key: 'building', label: 'Building' },
                  { key: 'floor', label: 'Floor' },
                  { key: 'type', label: 'Type' },
                  { key: 'installDate', label: 'Installed' },
                  { key: 'expiryDate', label: 'Expires' },
                  { key: 'lastInspection', label: 'Last Inspection' },
                  { key: 'status', label: 'Status' },
                  { key: null, label: '' },
                ].map(col => (
                  <th key={col.key || 'action'} onClick={() => col.key && handleSort(col.key)} style={{ cursor: col.key ? 'pointer' : 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.label} <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ext => {
                const isExpired = ext.status === 'Expired';
                const isExpiring = ext.status === 'Expiring Soon';
                return (
                  <tr key={ext.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: isExpired ? '#FEF2F2' : isExpiring ? '#FFFBEB' : 'var(--color-primary-ultra-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Flame size={14} color={isExpired ? '#DC2626' : isExpiring ? '#B45309' : 'var(--color-primary)'} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 12.5 }}>{ext.id}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5 }}>{ext.building}</td>
                    <td><span style={{ fontSize: 12, fontWeight: 600 }}>FL {ext.floor}</span></td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: 11 }}>{ext.type}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ext.installDate}</td>
                    <td style={{ fontSize: 12, fontWeight: isExpired ? 700 : 400, color: isExpired ? '#DC2626' : isExpiring ? '#B45309' : 'var(--text-secondary)' }}>
                      {ext.expiryDate}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ext.lastInspection}</td>
                    <td><StatusBadge status={ext.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="View Details"
                          onClick={() => setSelectedExt(ext)}
                        >
                          <Eye size={13} />
                        </button>
                        {isExpired && (
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ fontSize: 11, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                            onClick={() => handleReplace(ext)}
                          >
                            <RefreshCw size={11} /> Replace
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                    No extinguishers match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="show-on-mobile">
          {filtered.map(ext => {
            const isExpired = ext.status === 'Expired';
            const isExpiring = ext.status === 'Expiring Soon';
            return (
              <div key={ext.id} className="mobile-card" onClick={() => setSelectedExt(ext)}>
                <div className="mobile-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-md)',
                      background: isExpired ? '#FEF2F2' : isExpiring ? '#FFFBEB' : 'var(--color-primary-ultra-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Flame size={16} color={isExpired ? '#DC2626' : isExpiring ? '#B45309' : 'var(--color-primary)'} />
                    </div>
                    <div>
                      <div className="mobile-card-title">{ext.id}</div>
                      <div className="mobile-card-subtitle">{ext.building} - FL {ext.floor}</div>
                    </div>
                  </div>
                  <StatusBadge status={ext.status} />
                </div>
                <div className="mobile-card-row">
                  <span style={{ color: 'var(--text-muted)' }}>Type</span>
                  <span className="badge badge-neutral" style={{ fontSize: 11 }}>{ext.type}</span>
                </div>
                <div className="mobile-card-row">
                  <span style={{ color: 'var(--text-muted)' }}>Expires</span>
                  <span style={{ fontWeight: isExpired ? 700 : 400, color: isExpired ? '#DC2626' : isExpiring ? '#B45309' : 'var(--text-primary)' }}>
                    {ext.expiryDate}
                  </span>
                </div>
                <div className="mobile-card-actions">
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={e => { e.stopPropagation(); setSelectedExt(ext); }}>View</button>
                  {isExpired && (
                    <button className="btn btn-danger btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={e => { e.stopPropagation(); handleReplace(ext); }}>
                      <RefreshCw size={11} style={{ marginRight: 4 }}/> Replace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              No extinguishers match your current filters.
            </div>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedExt && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setSelectedExt(null)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 460,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '20px 24px',
              background: selectedExt.status === 'Expired'
                ? 'linear-gradient(135deg, #DC2626, #EF4444)'
                : selectedExt.status === 'Expiring Soon'
                  ? 'linear-gradient(135deg, #B45309, #F59E0B)'
                  : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{selectedExt.building}</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{selectedExt.id}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Floor {selectedExt.floor} · {selectedExt.type}</div>
              </div>
              <button onClick={() => setSelectedExt(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', cursor: 'pointer', fontSize: 12 }}>
                Close
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Install Date', value: selectedExt.installDate },
                { label: 'Expiry Date', value: selectedExt.expiryDate },
                { label: 'Last Inspection', value: selectedExt.lastInspection },
                { label: 'Status', value: selectedExt.status },
              ].map((item, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>
            {selectedExt.status === 'Expired' && (
              <div style={{ padding: '0 24px 20px' }}>
                <button
                  className="btn btn-danger"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleReplace(selectedExt)}
                >
                  <RefreshCw size={14} /> Mark as Replaced
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {isAddOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setIsAddOpen(false)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 440,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add Extinguisher Unit</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Register a new fire extinguisher unit.</div>
            </div>
            <form onSubmit={handleAddUnit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Building Name *</label>
                <input required className="input" placeholder="e.g. Nexus Tower" style={{ width: '100%' }}
                  value={addForm.building} onChange={e => setAddForm(f => ({ ...f, building: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Floor *</label>
                  <input required type="number" min="1" className="input" placeholder="5" style={{ width: '100%' }}
                    value={addForm.floor} onChange={e => setAddForm(f => ({ ...f, floor: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Type *</label>
                  <select required className="select" style={{ width: '100%' }}
                    value={addForm.type} onChange={e => setAddForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="CO₂">CO₂</option>
                    <option value="Dry Powder">Dry Powder</option>
                    <option value="Water Mist">Water Mist</option>
                    <option value="Foam">Foam</option>
                    <option value="Wet Chemical">Wet Chemical</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Install Date *</label>
                  <input required type="date" className="input" style={{ width: '100%' }}
                    value={addForm.installDate} onChange={e => setAddForm(f => ({ ...f, installDate: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Expiry Date *</label>
                  <input required type="date" className="input" style={{ width: '100%' }}
                    value={addForm.expiryDate} onChange={e => setAddForm(f => ({ ...f, expiryDate: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsAddOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Add Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
