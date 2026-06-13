import React, { useState } from 'react';
import { Users, Plus, Shield, Eye, Edit, Trash2, CheckCircle, X, Check, Mail, User as UserIcon } from 'lucide-react';
import { users as initialUsers, permissions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const RoleBadge = ({ role }) => {
  const configs = {
    'Super Admin':    { cls: 'badge-danger',  label: 'Super Admin' },
    'Company Admin':  { cls: 'badge-danger',  label: 'Company Admin' },
    'Building Owner': { cls: 'badge-info',    label: 'Building Owner' },
    'Supplier':       { cls: 'badge-warning', label: 'Supplier' },
    Auditor:          { cls: 'badge-primary', label: 'Auditor' },
  };
  const cfg = configs[role] || { cls: 'badge-neutral', label: role };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
};

const roleDescriptions = {
  'Super Admin':    { color: '#EF4444', bg: '#FEF2F2', description: 'Platform-wide access. Can manage all companies, subscriptions, and system settings.', icon: '🌍' },
  'Company Admin':  { color: '#EF4444', bg: '#FEF2F2', description: 'Full access to their company. Can manage all buildings, users, and settings within the company.', icon: '👑' },
  'Building Owner': { color: '#0369A1', bg: '#E0F2FE', description: 'Access to own building data. Can view compliance, extinguishers, contracts, and AI insights.', icon: '🏢' },
  'Supplier':       { color: '#7C3AED', bg: '#F3E8FF', description: 'Manages supply and maintenance contracts for buildings in assigned districts.', icon: '🏭' },
  'Auditor':        { color: '#3B82F6', bg: '#EFF6FF', description: 'Can create, schedule, and complete audits for assigned buildings. Access to AI Assistant.', icon: '🔍' },
};

const EMPTY_INVITE = { name: '', email: '', role: 'Viewer', buildings: '' };
const EMPTY_EDIT = { name: '', email: '', role: 'Viewer', buildings: '', status: 'Active' };

export default function UserPermissions() {
  const { user: currentUser, isSuperAdmin } = useAuth();
  
  const initialScopedUsers = React.useMemo(() => {
    return isSuperAdmin ? initialUsers : initialUsers.filter(u => u.companyId === currentUser?.companyId);
  }, [isSuperAdmin, currentUser]);

  const [users, setUsers] = useState(initialScopedUsers);
  
  React.useEffect(() => {
    setUsers(initialScopedUsers);
  }, [initialScopedUsers]);

  const [tab, setTab] = useState('users');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState(EMPTY_INVITE);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [viewUser, setViewUser] = useState(null);

  const handleInvite = (e) => {
    e.preventDefault();
    const newUser = {
      id: `USR-${String(users.length + 10).padStart(3, '0')}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'Active',
      lastLogin: 'Never',
      buildings: inviteForm.buildings || 'None assigned',
      companyId: isSuperAdmin && inviteForm.role === 'Super Admin' ? null : currentUser?.companyId,
    };
    setUsers(prev => [...prev, newUser]);
    setInviteForm(EMPTY_INVITE);
    setIsInviteOpen(false);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, buildings: user.buildings, status: user.status });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(u => u.id === editUser.id
      ? { ...u, name: editForm.name, email: editForm.email, role: editForm.role, buildings: editForm.buildings, status: editForm.status }
      : u
    ));
    setEditUser(null);
  };

  const handleDelete = (user) => {
    if (window.confirm(`Remove user "${user.name}" from FireGuard AI?\n\nThis action cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div className="grid grid-4" style={{ gap: 16 }}>
        {[
          { label: 'Total Users',    value: users.length,                                            color: '#3B82F6', icon: Users },
          { label: 'Active',         value: users.filter(u => u.status === 'Active').length,          color: '#22C55E', icon: CheckCircle },
          { label: 'Admins',         value: users.filter(u => u.role.includes('Admin')).length,       color: '#EF4444', icon: Shield },
          { label: 'Auditors',       value: users.filter(u => u.role === 'Auditor').length,           color: '#3B82F6', icon: Eye },
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
          <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>User Management</button>
          <button className={`tab ${tab === 'permissions' ? 'active' : ''}`} onClick={() => setTab('permissions')}>Permission Matrix</button>
          <button className={`tab ${tab === 'roles' ? 'active' : ''}`} onClick={() => setTab('roles')}>Role Definitions</button>
        </div>
        {tab === 'users' && (
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => { setInviteForm(EMPTY_INVITE); setIsInviteOpen(true); }}>
            <Plus size={13} /> Invite User
          </button>
        )}
      </div>

      {/* Users Table */}
      {tab === 'users' && (
        <div className="card">
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Buildings</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${user.role === 'Admin' ? '#DC2626' : user.role === 'Auditor' ? '#3B82F6' : user.role === 'Analyst' ? '#8B5CF6' : '#6B7280'}, ${user.role === 'Admin' ? '#EF4444' : user.role === 'Auditor' ? '#60A5FA' : user.role === 'Analyst' ? '#A78BFA' : '#9CA3AF'})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0
                        }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td><RoleBadge role={user.role} /></td>
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 160 }} className="truncate">
                        {user.buildings}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                    <td>
                      <span className={`badge badge-${user.status === 'Active' ? 'success' : 'neutral'}`}>
                        {user.status === 'Active' ? <CheckCircle size={10} /> : null}
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="View User"
                          onClick={() => setViewUser(user)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm btn-icon"
                          title="Edit User"
                          onClick={() => openEdit(user)}
                        >
                          <Edit size={13} />
                        </button>
                        {user.role !== 'Admin' && (
                          <button
                            className="btn btn-ghost btn-sm btn-icon"
                            title="Delete User"
                            style={{ color: '#EF4444' }}
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                      No users found. Invite a user to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permission Matrix */}
      {tab === 'permissions' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Permission Matrix</div>
              <div className="card-subtitle">Role-based access control — AWS IAM inspired</div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 16 }}>
            <div className="permission-matrix">
              <table className="permission-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: 220 }}>Permission</th>
                    {permissions.roles.map(role => (
                      <th key={role}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: roleDescriptions[role]?.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14
                          }}>
                            {roleDescriptions[role]?.icon}
                          </div>
                          <span>{role}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.modules.map((module, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? 'var(--bg-primary)' : 'transparent' }}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{module.name}</td>
                      {module.permissions.map((allowed, ri) => (
                        <td key={ri}>
                          {allowed ? (
                            <div style={{
                              width: 24, height: 24, borderRadius: '50%',
                              background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              margin: '0 auto'
                            }}>
                              <Check size={13} color="#16A34A" strokeWidth={2.5} />
                            </div>
                          ) : (
                            <div style={{
                              width: 24, height: 24, borderRadius: '50%',
                              background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              margin: '0 auto'
                            }}>
                              <X size={12} color="var(--border-color)" strokeWidth={2.5} />
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Role Definitions */}
      {tab === 'roles' && (
        <div className="grid grid-2" style={{ gap: 20 }}>
          {Object.entries(roleDescriptions).map(([role, config]) => (
            <div key={role} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-md)',
                  background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24
                }}>
                  {config.icon}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{role}</div>
                  <RoleBadge role={role} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {config.description}
              </div>
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Key Permissions:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {permissions.modules.filter((_, i) => permissions.modules[i].permissions[
                    permissions.roles.indexOf(role)
                  ]).slice(0, 5).map((module, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <CheckCircle size={12} color="#22C55E" />
                      {module.name}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn btn-secondary btn-sm w-full"
                  style={{ justifyContent: 'center' }}
                  onClick={() => alert(`Role permission editing for "${role}" requires Super Admin privileges in production. Currently showing read-only matrix.`)}
                >
                  Edit Role Permissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite User Modal */}
      {isInviteOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setIsInviteOpen(false)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 440,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Invite New User</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add a user to the FireGuard AI platform.</div>
            </div>
            <form onSubmit={handleInvite} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name *</label>
                <input required className="input" placeholder="e.g. Rahul Singh" style={{ width: '100%' }}
                  value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address *</label>
                <input required type="email" className="input" placeholder="user@company.com" style={{ width: '100%' }}
                  value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Role *</label>
                   <select required className="select" style={{ width: '100%' }}
                    value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="Building Owner">Building Owner</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Company Admin">Company Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Buildings</label>
                  <input className="input" placeholder="e.g. Nexus Tower" style={{ width: '100%' }}
                    value={inviteForm.buildings} onChange={e => setInviteForm(f => ({ ...f, buildings: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsInviteOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Mail size={13} /> Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setEditUser(null)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 440,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Edit User</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{editUser.id}</div>
            </div>
            <form onSubmit={handleEditSave} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name *</label>
                <input required className="input" style={{ width: '100%' }}
                  value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address *</label>
                <input required type="email" className="input" style={{ width: '100%' }}
                  value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Role</label>
                  <select className="select" style={{ width: '100%' }}
                    value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="Building Owner">Building Owner</option>
                    <option value="Auditor">Auditor</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Company Admin">Company Admin</option>
                    {isSuperAdmin && <option value="Super Admin">Super Admin</option>}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Status</label>
                  <select className="select" style={{ width: '100%' }}
                    value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Buildings</label>
                <input className="input" style={{ width: '100%' }}
                  value={editForm.buildings} onChange={e => setEditForm(f => ({ ...f, buildings: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditUser(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }} onClick={() => setViewUser(null)}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 400,
            boxShadow: 'var(--shadow-xl)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '24px 28px',
              background: `linear-gradient(135deg, ${viewUser.role === 'Admin' ? '#DC2626, #EF4444' : viewUser.role === 'Auditor' ? '#3B82F6, #60A5FA' : viewUser.role === 'Analyst' ? '#8B5CF6, #A78BFA' : '#6B7280, #9CA3AF'})`,
              color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
                  {viewUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{viewUser.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{viewUser.email}</div>
              </div>
              <button onClick={() => setViewUser(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Role', value: viewUser.role },
                { label: 'Status', value: viewUser.status },
                { label: 'Last Login', value: viewUser.lastLogin },
                { label: 'User ID', value: viewUser.id },
              ].map((item, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Buildings</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{viewUser.buildings}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
