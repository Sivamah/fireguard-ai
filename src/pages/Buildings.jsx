import React, { useState, useMemo } from 'react';
import {
  Search, Building2, MapPin, Layers, Eye, ChevronUp, ChevronDown,
  Plus, Pencil, Trash2, AlertTriangle, AlertCircle, Flame,
  ChevronRight, Map
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { buildings as initialBuildings, tamilNaduHierarchy } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

// ─── Sub Components ───────────────────────────────────────────
const RiskBadge = ({ level }) => {
  const configs = {
    Low: { cls: 'badge-success' },
    Medium: { cls: 'badge-warning' },
    High: { cls: '', style: { background: '#FFF3ED', color: '#C2410C' } },
    Critical: { cls: 'badge-danger' },
  };
  const cfg = configs[level] || {};
  return <span className={`badge ${cfg.cls || ''}`} style={cfg.style}>{level}</span>;
};

const ComplianceMeter = ({ score }) => {
  const color = score >= 80 ? 'var(--status-success)' : score >= 60 ? 'var(--status-warning)' : 'var(--status-danger)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-bar" style={{ width: 80 }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 9999, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color, minWidth: 32 }}>{score}%</span>
    </div>
  );
};

// ─── Breadcrumb ───────────────────────────────────────────────
const Breadcrumb = ({ district, area }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
    <Map size={13} color="var(--text-muted)" />
    <span style={{ color: 'var(--text-muted)' }}>Tamil Nadu</span>
    {district && district !== 'All' && (
      <>
        <ChevronRight size={12} color="var(--text-muted)" />
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{district}</span>
      </>
    )}
    {area && area !== 'All' && (
      <>
        <ChevronRight size={12} color="var(--text-muted)" />
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{area}</span>
      </>
    )}
    {(!district || district === 'All') && (
      <>
        <ChevronRight size={12} color="var(--text-muted)" />
        <span style={{ color: 'var(--text-muted)' }}>All Districts</span>
      </>
    )}
  </div>
);

const EMPTY_FORM = {
  name: '', district: 'Coimbatore', area: 'Peelamedu',
  floors: '', extinguishers: '', riskLevel: 'Low'
};

// ─── Main Component ───────────────────────────────────────────
export default function Buildings() {
  const { user, isSuperAdmin } = useAuth();
  
  const initialScopedBuildings = useMemo(() => {
    return isSuperAdmin ? initialBuildings : initialBuildings.filter(b => b.companyId === user?.companyId);
  }, [isSuperAdmin, user]);

  const [buildings, setBuildings] = useState(initialScopedBuildings);

  React.useEffect(() => {
    setBuildings(initialScopedBuildings);
  }, [initialScopedBuildings]);

  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editBuilding, setEditBuilding] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  // Derive available areas based on selected district
  const availableAreas = useMemo(() => {
    if (districtFilter === 'All') return [];
    const dist = tamilNaduHierarchy.districts.find(d => d.name === districtFilter);
    return dist ? dist.areas : [];
  }, [districtFilter]);

  // Areas for form (based on form's district)
  const formAreas = useMemo(() => {
    const dist = tamilNaduHierarchy.districts.find(d => d.name === form.district);
    return dist ? dist.areas : [];
  }, [form.district]);

  const editFormAreas = useMemo(() => {
    const dist = tamilNaduHierarchy.districts.find(d => d.name === editForm.district);
    return dist ? dist.areas : [];
  }, [editForm.district]);

  const filtered = useMemo(() => {
    let data = [...buildings];
    if (search) data = data.filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase()) ||
      b.district.toLowerCase().includes(search.toLowerCase()) ||
      b.area.toLowerCase().includes(search.toLowerCase())
    );
    if (districtFilter !== 'All') data = data.filter(b => b.district === districtFilter);
    if (areaFilter !== 'All') data = data.filter(b => b.area === areaFilter);
    if (riskFilter !== 'All') data = data.filter(b => b.riskLevel === riskFilter);
    data.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return data;
  }, [buildings, search, districtFilter, areaFilter, riskFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const totalExtinguishers = buildings.reduce((acc, b) => acc + b.extinguishers, 0);

  const handleDistrictChange = (d) => {
    setDistrictFilter(d);
    setAreaFilter('All');
  };

  const handleAddBuilding = (e) => {
    e.preventDefault();
    const riskScore = form.riskLevel === 'Critical' ? 85 : form.riskLevel === 'High' ? 70 : form.riskLevel === 'Medium' ? 50 : 20;
    const complianceScore = form.riskLevel === 'Critical' ? 45 : form.riskLevel === 'High' ? 60 : form.riskLevel === 'Medium' ? 75 : 90;
    const newBuilding = {
      id: `BLD-${String(buildings.length + 1).padStart(3, '0')}`,
      name: form.name,
      state: 'Tamil Nadu',
      district: form.district,
      area: form.area,
      location: `${form.area}, ${form.district}`,
      floors: parseInt(form.floors) || 1,
      extinguishers: parseInt(form.extinguishers) || 0,
      complianceScore,
      riskScore,
      riskLevel: form.riskLevel,
      lastAudit: 'Not audited',
      nextAudit: 'Schedule required',
      alerts: 0,
      companyId: user?.companyId,
    };
    setBuildings(prev => [...prev, newBuilding]);
    setForm(EMPTY_FORM);
    setIsAddModalOpen(false);
  };

  const handleDeleteBuilding = (bldg) => {
    if (window.confirm(`Delete "${bldg.name}"? This cannot be undone.`)) {
      setBuildings(prev => prev.filter(b => b.id !== bldg.id));
      if (selectedBuilding?.id === bldg.id) setSelectedBuilding(null);
    }
  };

  const openEdit = (bldg) => {
    setEditBuilding(bldg);
    setEditForm({
      name: bldg.name,
      district: bldg.district,
      area: bldg.area,
      floors: bldg.floors,
      extinguishers: bldg.extinguishers,
      riskLevel: bldg.riskLevel
    });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setBuildings(prev => prev.map(b => b.id === editBuilding.id
      ? {
          ...b,
          name: editForm.name,
          district: editForm.district,
          area: editForm.area,
          location: `${editForm.area}, ${editForm.district}`,
          floors: parseInt(editForm.floors),
          extinguishers: parseInt(editForm.extinguishers),
          riskLevel: editForm.riskLevel
        }
      : b
    ));
    setEditBuilding(null);
  };

  const districts = tamilNaduHierarchy.districts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Summary Cards */}
      <div className="grid grid-4" style={{ gap: 16 }}>
        {[
          { label: 'Total Buildings', value: buildings.length, color: '#3B82F6', icon: Building2 },
          { label: 'Critical Risk', value: buildings.filter(b => b.riskLevel === 'Critical').length, color: '#EF4444', icon: AlertTriangle },
          { label: 'High Risk', value: buildings.filter(b => b.riskLevel === 'High').length, color: '#F97316', icon: AlertCircle },
          { label: 'Extinguishers', value: totalExtinguishers, color: '#22C55E', icon: Flame },
        ].map((stat, i) => {
          const Icon = stat.icon || Building2;
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

      {/* Header */}
      <PageHeader
        title="Building Portfolio"
        description={`${filtered.length} building${filtered.length !== 1 ? 's' : ''} shown`}
        action={
          <button className="btn btn-primary btn-sm" onClick={() => { setForm(EMPTY_FORM); setIsAddModalOpen(true); }}>
            <Plus size={13} /> Add Building
          </button>
        }
      />

      {/* ── Tamil Nadu Hierarchy Filters ── */}
      <div className="card" style={{ padding: '16px 20px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 14 }}>
          <Breadcrumb district={districtFilter} area={areaFilter} />
        </div>

        {/* Filter Row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>Search Building</div>
            <div className="input-wrap">
              <Search size={14} className="input-icon" />
              <input
                className="input"
                placeholder="Search by name, area, district..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* District Filter */}
          <div style={{ flex: '0 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>
              📍 District
            </div>
            <select
              className="select"
              value={districtFilter}
              onChange={e => handleDistrictChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="All">All Districts</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name} ({buildings.filter(b => b.district === d.name).length})
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div style={{ flex: '0 1 160px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>
              🏘 Area / Street
            </div>
            <select
              className="select"
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              disabled={districtFilter === 'All'}
              style={{ width: '100%', opacity: districtFilter === 'All' ? 0.5 : 1 }}
            >
              <option value="All">All Areas</option>
              {availableAreas.map(a => (
                <option key={a} value={a}>
                  {a} ({buildings.filter(b => b.area === a).length})
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div style={{ flex: '0 1 140px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>⚠ Risk Level</div>
            <select
              className="select"
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="All">All Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(districtFilter !== 'All' || areaFilter !== 'All' || riskFilter !== 'All' || search) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setDistrictFilter('All'); setAreaFilter('All'); setRiskFilter('All'); setSearch(''); }}
              style={{ flexShrink: 0, alignSelf: 'flex-end' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* District Quick-select chips */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>Quick:</span>
          {['All', ...districts.map(d => d.name)].map(d => (
            <button
              key={d}
              onClick={() => handleDistrictChange(d)}
              style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 600,
                border: `1.5px solid ${districtFilter === d ? 'var(--color-primary)' : 'var(--border)'}`,
                background: districtFilter === d ? 'var(--color-primary)' : 'transparent',
                color: districtFilter === d ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {d === 'All' ? 'All Districts' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Building2 size={14} />
        Showing <strong>{filtered.length}</strong> of {buildings.length} buildings
        {districtFilter !== 'All' && <> in <strong>{districtFilter}</strong></>}
        {areaFilter !== 'All' && <> · <strong>{areaFilter}</strong></>}
      </div>

      <div className="card" style={{ overflow: 'visible', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>

        {/* Desktop Table */}
        <div className="table-container hidden-on-mobile">
          <table className="data-table">
            <thead>
              <tr>
                {[
                  { key: 'name', label: 'Building Name' },
                  { key: 'district', label: 'District' },
                  { key: 'area', label: 'Area' },
                  { key: 'floors', label: 'Floors' },
                  { key: 'extinguishers', label: 'Extinguishers' },
                  { key: 'complianceScore', label: 'Compliance' },
                  { key: 'riskScore', label: 'Risk Score' },
                  { key: 'riskLevel', label: 'Risk Level' },
                  { key: null, label: 'Actions' },
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
              {filtered.map(bldg => (
                <tr key={bldg.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedBuilding(bldg)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                        background: bldg.riskLevel === 'Critical' ? '#FEF2F2' : bldg.riskLevel === 'High' ? '#FFF7ED' : 'var(--color-primary-ultra-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Building2 size={16} color={bldg.riskLevel === 'Critical' ? '#DC2626' : bldg.riskLevel === 'High' ? '#EA580C' : 'var(--color-primary)'} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{bldg.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bldg.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5 }}>
                      <MapPin size={11} color="var(--text-muted)" />
                      <span style={{ fontWeight: 600 }}>{bldg.district}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bldg.area}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <Layers size={13} color="var(--text-muted)" />
                      {bldg.floors}
                    </div>
                  </td>
                  <td><span style={{ fontSize: 13, fontWeight: 600 }}>{bldg.extinguishers}</span></td>
                  <td><ComplianceMeter score={bldg.complianceScore} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 40, height: 4, background: 'var(--border-light)', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{
                          width: `${bldg.riskScore}%`, height: '100%', borderRadius: 9999,
                          background: bldg.riskScore >= 75 ? 'var(--status-danger)' : bldg.riskScore >= 50 ? 'var(--status-warning)' : 'var(--status-success)'
                        }} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{bldg.riskScore}</span>
                    </div>
                  </td>
                  <td><RiskBadge level={bldg.riskLevel} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm btn-icon" title="View Details" onClick={() => setSelectedBuilding(bldg)}>
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Edit Building" onClick={() => openEdit(bldg)}>
                        <Pencil size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Delete Building" style={{ color: '#EF4444' }} onClick={() => handleDeleteBuilding(bldg)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                    No buildings match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="show-on-mobile">
          {filtered.map(bldg => (
            <div key={bldg.id} className="mobile-card" onClick={() => setSelectedBuilding(bldg)}>
              <div className="mobile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: bldg.riskLevel === 'Critical' ? '#FEF2F2' : bldg.riskLevel === 'High' ? '#FFF7ED' : 'var(--color-primary-ultra-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Building2 size={16} color={bldg.riskLevel === 'Critical' ? '#DC2626' : bldg.riskLevel === 'High' ? '#EA580C' : 'var(--color-primary)'} />
                  </div>
                  <div>
                    <div className="mobile-card-title">{bldg.name}</div>
                    <div className="mobile-card-subtitle">{bldg.district} · {bldg.area}</div>
                  </div>
                </div>
                <RiskBadge level={bldg.riskLevel} />
              </div>
              <div className="mobile-card-row">
                <span style={{ color: 'var(--text-muted)' }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />{bldg.location}</span>
                <span>{bldg.floors} Floors</span>
              </div>
              <div className="mobile-card-row">
                <span style={{ color: 'var(--text-muted)' }}>Compliance</span>
                <ComplianceMeter score={bldg.complianceScore} />
              </div>
              <div className="mobile-card-actions">
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={e => { e.stopPropagation(); openEdit(bldg); }}>Edit</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={e => { e.stopPropagation(); setSelectedBuilding(bldg); }}>View Details</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              No buildings match your filters.
            </div>
          )}
        </div>
      </div>

      {/* ── Building Detail Modal ── */}
      {selectedBuilding && (
        <>
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, animation: 'fadeIn 0.2s ease'
          }} onClick={() => setSelectedBuilding(null)}>
            <div style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 580,
              boxShadow: 'var(--shadow-xl)', animation: 'fadeInUp 0.25s ease', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

              {/* Gradient Header */}
              <div style={{
                padding: '24px 28px',
                background: selectedBuilding.riskLevel === 'Critical'
                  ? 'linear-gradient(135deg, #DC2626, #EF4444)'
                  : selectedBuilding.riskLevel === 'High'
                    ? 'linear-gradient(135deg, #EA580C, #F97316)'
                    : 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{selectedBuilding.id}</span>
                      <span>·</span>
                      <span>Tamil Nadu → {selectedBuilding.district} → {selectedBuilding.area}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>{selectedBuilding.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                      📍 {selectedBuilding.location} · {selectedBuilding.floors} Floors
                    </div>
                  </div>
                  <button onClick={() => setSelectedBuilding(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', cursor: 'pointer', fontSize: 12 }}>
                    Close
                  </button>
                </div>

                {/* KPI Row */}
                <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                  {[
                    { label: 'Compliance', value: `${selectedBuilding.complianceScore}%` },
                    { label: 'Risk Score', value: `${selectedBuilding.riskScore}/100` },
                    { label: 'Extinguishers', value: selectedBuilding.extinguishers },
                    { label: 'Active Alerts', value: selectedBuilding.alerts },
                  ].map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
                      <div style={{ fontSize: 10, opacity: 0.7 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Grid */}
              <div style={{ padding: '24px 28px' }}>

                {/* Location Hierarchy */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>LOCATION HIERARCHY</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tamil Nadu</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{selectedBuilding.district}</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedBuilding.area}</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedBuilding.name}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Last Audit', value: selectedBuilding.lastAudit },
                    { label: 'Next Audit', value: selectedBuilding.nextAudit },
                    { label: 'Risk Level', value: selectedBuilding.riskLevel },
                    { label: 'Status', value: selectedBuilding.complianceScore >= 80 ? 'Compliant' : 'Non-Compliant' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => alert(`Generating full compliance report for ${selectedBuilding.name}...`)}>
                    View Full Report
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => { setSelectedBuilding(null); alert(`Audit scheduling initiated for ${selectedBuilding.name}.`); }}>
                    Schedule Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Add Building Modal ── */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'fadeIn 0.2s ease'
        }} onClick={() => setIsAddModalOpen(false)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480,
            boxShadow: 'var(--shadow-xl)', animation: 'fadeInUp 0.25s ease', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Add New Building</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tamil Nadu · {form.district} · {form.area}</div>
            </div>
            <form onSubmit={handleAddBuilding} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Building Name *</label>
                <input required className="input" placeholder="e.g. NGP Tech Park" style={{ width: '100%' }}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              {/* Location Hierarchy Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>District *</label>
                  <select required className="select" style={{ width: '100%' }}
                    value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value, area: tamilNaduHierarchy.districts.find(d => d.name === e.target.value)?.areas[0] || '' }))}>
                    {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Area / Street *</label>
                  <select required className="select" style={{ width: '100%' }}
                    value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}>
                    {formAreas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Floors *</label>
                  <input required type="number" min="1" className="input" placeholder="10" style={{ width: '100%' }}
                    value={form.floors} onChange={e => setForm(f => ({ ...f, floors: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Extinguishers *</label>
                  <input required type="number" min="0" className="input" placeholder="42" style={{ width: '100%' }}
                    value={form.extinguishers} onChange={e => setForm(f => ({ ...f, extinguishers: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Initial Risk Level</label>
                <select className="select" style={{ width: '100%' }} value={form.riskLevel}
                  onChange={e => setForm(f => ({ ...f, riskLevel: e.target.value }))}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Building</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Building Modal ── */}
      {editBuilding && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'fadeIn 0.2s ease'
        }} onClick={() => setEditBuilding(null)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480,
            boxShadow: 'var(--shadow-xl)', animation: 'fadeInUp 0.25s ease', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Edit Building</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{editBuilding.id} · Tamil Nadu</div>
            </div>
            <form onSubmit={handleEditSave} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Building Name *</label>
                <input required className="input" style={{ width: '100%' }}
                  value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>District *</label>
                  <select required className="select" style={{ width: '100%' }} value={editForm.district}
                    onChange={e => setEditForm(f => ({ ...f, district: e.target.value, area: tamilNaduHierarchy.districts.find(d => d.name === e.target.value)?.areas[0] || '' }))}>
                    {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Area / Street *</label>
                  <select required className="select" style={{ width: '100%' }} value={editForm.area}
                    onChange={e => setEditForm(f => ({ ...f, area: e.target.value }))}>
                    {editFormAreas.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Floors *</label>
                  <input required type="number" min="1" className="input" style={{ width: '100%' }}
                    value={editForm.floors} onChange={e => setEditForm(f => ({ ...f, floors: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Extinguishers *</label>
                  <input required type="number" min="0" className="input" style={{ width: '100%' }}
                    value={editForm.extinguishers} onChange={e => setEditForm(f => ({ ...f, extinguishers: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Risk Level</label>
                <select className="select" style={{ width: '100%' }} value={editForm.riskLevel}
                  onChange={e => setEditForm(f => ({ ...f, riskLevel: e.target.value }))}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditBuilding(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
