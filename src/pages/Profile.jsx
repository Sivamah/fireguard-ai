import React, { useState, useRef } from 'react';
import { User, Mail, Shield, Save, Key, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatarData || null); // base64 image if user uploads
  const fileInputRef = useRef(null);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setTimeout(() => {
      updateProfile({ name, email, avatarData: avatar });
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '?';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <div className="card">
        <div className="card-header" style={{ paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <div className="card-title">My Profile</div>
            <div className="card-subtitle">Manage your personal information and account settings</div>
          </div>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            
            {/* Avatar Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: avatar ? 'transparent' : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 700, color: 'white',
                boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
              }}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : initials}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <button style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-secondary)'
                }} onClick={() => fileInputRef.current?.click()} type="button">
                  <Camera size={14} />
                </button>
              </div>
              <span className={`badge badge-${user?.role === 'Admin' ? 'danger' : user?.role === 'Auditor' ? 'primary' : 'info'}`}>
                <Shield size={12} /> {user?.role}
              </span>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSave} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="grid grid-2" style={{ gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Full Name</label>
                  <div className="input-wrap">
                    <User className="input-icon" size={16} />
                    <input className="input" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Email Address</label>
                  <div className="input-wrap">
                    <Mail className="input-icon" size={16} />
                    <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Assigned Buildings</label>
                <div style={{
                  padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                  fontSize: 13, color: 'var(--text-secondary)', border: '1px solid var(--border-light)'
                }}>
                  {user?.buildings || 'None'}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 20, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="btn btn-secondary">
                  <Key size={14} /> Change Password
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {saved && <span style={{ fontSize: 13, color: 'var(--status-success)', fontWeight: 600 }}>Saved successfully!</span>}
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : <><Save size={14} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
