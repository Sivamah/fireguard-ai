import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Wrench, Calendar, MapPin, QrCode, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';
import { equipment } from '../data/mockData';

const STATUS_META = {
  'Active':            { color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   badge: 'badge-success' },
  'Expired':           { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   badge: 'badge-danger'  },
  'Expiring Soon':     { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  badge: 'badge-warning' },
  'Needs Maintenance': { color: '#F97316', bg: 'rgba(249,115,22,0.12)',  badge: 'badge-high'    },
};

const TYPE_ICONS = {
  'Fire Alarm':        '🔔',
  'Smoke Detector':    '💨',
  'Extinguisher':      '🧯',
  'Exit Light':        '🚪',
  'Sprinkler':         '💧',
  'Hydrant':           '🚿',
  'Suppression System':'⚗️',
};

const STATUSES = ['All', 'Active', 'Expired', 'Expiring Soon', 'Needs Maintenance'];
const TYPES    = ['All', 'Fire Alarm', 'Smoke Detector', 'Extinguisher', 'Exit Light', 'Sprinkler', 'Hydrant', 'Suppression System'];

// QR Code SVG Generator (simple visual placeholder)
function QRCodeDisplay({ id }) {
  const size = 100;
  const cells = [];
  const seed  = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const filled = ((r * 13 + c * 7 + seed) % 3) === 0;
      if (filled) cells.push({ r, c });
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px', background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        {/* Fixed corners */}
        {[[0,0],[0,7],[7,0]].map(([r,c], i) => (
          <g key={i}>
            <rect x={c*10} y={r*10} width={30} height={30} fill="#111" rx={2} />
            <rect x={c*10+5} y={r*10+5} width={20} height={20} fill="white" rx={1} />
            <rect x={c*10+9} y={r*10+9} width={12} height={12} fill="#111" rx={1} />
          </g>
        ))}
        {/* Data cells */}
        {cells.map(({ r, c }, i) => (
          !(r < 3 && c < 3) && !(r < 3 && c > 6) && !(r > 6 && c < 3) &&
          <rect key={i} x={c*10} y={r*10} width={9} height={9} fill="#111" rx={1} />
        ))}
      </svg>
      <div style={{ fontSize: 10, color: '#333', fontFamily: 'monospace', textAlign: 'center' }}>{id}</div>
    </div>
  );
}

// QR Modal
function QRModal({ item, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 28, width: 280, boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Equipment QR Code</div>
        <QRCodeDisplay id={item.id} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{item.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.building} · {item.location}</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>Close</button>
      </motion.div>
    </div>
  );
}

export default function Equipment() {
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatus]   = useState('All');
  const [typeFilter,   setType]     = useState('All');
  const [qrItem,       setQrItem]   = useState(null);

  const filtered = useMemo(() => {
    return equipment.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.building.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      const matchType   = typeFilter === 'All' || e.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const counts = useMemo(() => ({
    total:       equipment.length,
    active:      equipment.filter(e => e.status === 'Active').length,
    expired:     equipment.filter(e => e.status === 'Expired').length,
    expiring:    equipment.filter(e => e.status === 'Expiring Soon').length,
    maintenance: equipment.filter(e => e.status === 'Needs Maintenance').length,
  }), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>Equipment Management</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>{counts.total} fire safety equipment items across all buildings</p>
      </motion.div>

      {/* Status KPIs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-4" style={{ gap: 12 }}>
        {[
          { label: 'Active',          val: counts.active,      color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   status: 'Active' },
          { label: 'Expired',         val: counts.expired,     color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   status: 'Expired' },
          { label: 'Expiring Soon',   val: counts.expiring,    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  status: 'Expiring Soon' },
          { label: 'Needs Maintenance', val: counts.maintenance, color: '#F97316', bg: 'rgba(249,115,22,0.1)', status: 'Needs Maintenance' },
        ].map(s => (
          <div key={s.label} onClick={() => setStatus(s.status === statusFilter ? 'All' : s.status)}
            style={{ padding: '16px', background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s', outline: statusFilter === s.status ? `2px solid ${s.color}` : 'none' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200, maxWidth: 340 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search equipment, buildings, locations…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select" value={typeFilter} onChange={e => setType(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        {(statusFilter !== 'All' || typeFilter !== 'All' || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setStatus('All'); setType('All'); }}>
            <X size={12} /> Clear
          </button>
        )}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} items</div>
      </motion.div>

      {/* Equipment Cards */}
      <div className="grid grid-auto" style={{ gap: 14, alignItems: 'start' }}>
        <AnimatePresence>
          {filtered.map((eq, i) => {
            const meta = STATUS_META[eq.status] || STATUS_META['Active'];
            const isExpired = eq.status === 'Expired';
            return (
              <motion.div key={eq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="equipment-card"
                style={{ borderLeft: `3px solid ${meta.color}` }}>

                {/* Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{TYPE_ICONS[eq.type] || '🔧'}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{eq.type} · {eq.brand}</div>
                    </div>
                  </div>
                  <span className={`badge ${meta.badge}`} style={{ fontSize: 10, flexShrink: 0, marginLeft: 8 }}>{eq.status}</span>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ padding: '8px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Building</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.building}</div>
                  </div>
                  <div style={{ padding: '8px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Location</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.location}</div>
                  </div>
                  <div style={{ padding: '8px', background: isExpired ? 'rgba(239,68,68,0.08)' : 'var(--bg-subtle)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Expiry Date</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isExpired ? '#EF4444' : 'var(--text-primary)' }}>{eq.expiryDate}</div>
                  </div>
                  <div style={{ padding: '8px', background: 'var(--bg-subtle)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Last Inspection</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{eq.lastInspection}</div>
                  </div>
                </div>

                {/* Serial & QR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{eq.serialNo}</div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setQrItem(eq)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5 }}>
                    <QrCode size={13} /> QR Code
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔧</div>
          <div className="empty-state-title">No equipment found</div>
          <div className="empty-state-sub">Try adjusting your filters or search query</div>
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {qrItem && <QRModal item={qrItem} onClose={() => setQrItem(null)} />}
      </AnimatePresence>
    </div>
  );
}
