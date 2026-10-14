'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Shield,
  UserPlus,
  Lock,
  Key,
  X,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  Search,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function AdminsTab({ onToast }) {
  const { t } = useLanguage();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Formularz dodawania
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formRole, setFormRole] = useState('Admin');
  const [formDiscord, setFormDiscord] = useState('');
  const [formSteamHex, setFormSteamHex] = useState('');
  const [formHas2fa, setFormHas2fa] = useState(true);
  const [formPermissions, setFormPermissions] = useState('Kick, Ban, Spectate, Revive');

  // Formularz edycji
  const [editRole, setEditRole] = useState('Admin');
  const [editDiscord, setEditDiscord] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editHas2fa, setEditHas2fa] = useState(false);
  const [editPermissions, setEditPermissions] = useState('');

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admins');
      const data = await res.json();
      if (data.ok && Array.isArray(data.admins)) {
        setAdmins(data.admins);
      }
    } catch {
      onToast?.('Błąd pobierania listy administratorów');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleRoleChange = (role) => {
    setFormRole(role);
    if (role === 'Super Admin') setFormPermissions('Full Root Access (txAdmin Master)');
    else if (role === 'Senior Admin') setFormPermissions('Kick, Ban, Teleport, Resource Control');
    else if (role === 'Admin') setFormPermissions('Kick, Ban, Spectate, Revive');
    else setFormPermissions('Warn, Kick, Spectate, Freeze');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!formUsername.trim() || !formPassword.trim()) return;

    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formUsername,
          password: formPassword,
          role: formRole,
          discord: formDiscord,
          steamHex: formSteamHex,
          has2fa: formHas2fa,
          permissions: formPermissions
        })
      });
      const data = await res.json();

      if (data.ok) {
        onToast?.(`${t.adminsTab.createdToast}: ${formUsername}`);
        setShowAddModal(false);
        setFormUsername('');
        setFormPassword('');
        setFormDiscord('');
        setFormSteamHex('');
        loadAdmins();
      } else {
        onToast?.(data.message || 'Error');
      }
    } catch {
      onToast?.(lang === 'pl' ? 'Błąd połączenia z serwerem' : 'Server connection error');
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditRole(admin.role);
    setEditDiscord(admin.discord || '');
    setEditPassword('');
    setEditHas2fa(Boolean(admin.has2fa));
    setEditPermissions(admin.permissions || '');
    setShowEditModal(true);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const res = await fetch('/api/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedAdmin.id,
          role: editRole,
          discord: editDiscord,
          password: editPassword,
          has2fa: editHas2fa,
          permissions: editPermissions
        })
      });
      const data = await res.json();

      if (data.ok) {
        onToast?.(`${t.adminsTab.updatedToast}: ${selectedAdmin.username}`);
        setShowEditModal(false);
        setSelectedAdmin(null);
        loadAdmins();
      } else {
        onToast?.(data.message || 'Error');
      }
    } catch {
      onToast?.(lang === 'pl' ? 'Błąd połączenia z serwerem' : 'Server connection error');
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!confirm(`${t.adminsTab.deleteConfirm} ${admin.username}?`)) return;

    try {
      const res = await fetch(`/api/admins?id=${encodeURIComponent(admin.id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.ok) {
        onToast?.(`${t.adminsTab.deletedToast}: ${admin.username}`);
        loadAdmins();
      } else {
        onToast?.(data.message || 'Error');
      }
    } catch {
      onToast?.(lang === 'pl' ? 'Błąd połączenia z serwerem' : 'Server connection error');
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      (a.discord && a.discord.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div className="panel-card anim-slide-up delay-1" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.adminsTab.statRegistered}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
            {admins.length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>JSON</span>
          </div>
        </div>

        <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.adminsTab.statSuper}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--brand-purple)', marginTop: '4px' }} className="num-tabular">
            {admins.filter((a) => a.role === 'Super Admin').length} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>Root</span>
          </div>
        </div>

        <div className="panel-card anim-slide-up delay-3" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.adminsTab.stat2fa}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }} className="num-tabular">
            {admins.filter((a) => a.has2fa).length} / {admins.length}
          </div>
        </div>

        <div className="panel-card anim-slide-up delay-4" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.adminsTab.statStorage}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--status-success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> {t.adminsTab.storageDesc}
          </div>
        </div>
      </div>

      <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.adminsTab.searchPlaceholder}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-primary)',
                borderRadius: '5px',
                padding: '6px 12px 6px 30px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="button"
            onClick={loadAdmins}
            className="btn-secondary"
            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
          >
            <RefreshCw size={13} className={loading ? 'anim-spin' : ''} />
            <span>{t.header.refreshTelemetry}</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ height: '34px', padding: '0 14px', fontSize: '12.5px' }}
        >
          <UserPlus size={14} />
          <span>{t.adminsTab.addAdmin}</span>
        </button>
      </div>

      <div className="panel-card anim-slide-up delay-3" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{
              backgroundColor: 'var(--surface-subtle)',
              borderBottom: '1px solid var(--border-primary)',
              color: 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              <th style={{ padding: '12px 18px' }}>{t.adminsTab.thAdmin}</th>
              <th style={{ padding: '12px 16px' }}>{t.adminsTab.thRole}</th>
              <th style={{ padding: '12px 16px' }}>{t.adminsTab.thPermissions}</th>
              <th style={{ padding: '12px 16px' }}>{t.adminsTab.thDiscord}</th>
              <th style={{ padding: '12px 16px' }}>{t.adminsTab.th2fa}</th>
              <th style={{ padding: '12px 16px' }}>{t.adminsTab.thLastActive}</th>
              <th style={{ padding: '12px 18px', textAlign: 'right' }}>{t.adminsTab.thActions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((a, idx) => (
              <tr
                key={a.id}
                className="interactive-row anim-row-stagger"
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  animationDelay: `${idx * 45}ms`
                }}
              >
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '6px',
                      backgroundColor: a.avatarBg || 'var(--brand-purple)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}>
                      {a.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{a.username}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.steamHex || a.id}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: `${a.roleColor || '#7c3aed'}22`,
                    color: a.roleColor || 'var(--brand-purple)',
                    border: `1px solid ${a.roleColor || '#7c3aed'}44`
                  }}>
                    {a.role}
                  </span>
                </td>

                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {a.permissions || 'Standardowe uprawnienia'}
                </td>

                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                  {a.discord || a.discordId || 'Brak powiązania'}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  {a.has2fa ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-success)', fontSize: '11.5px', fontWeight: 600 }}>
                      <CheckCircle2 size={13} /> Aktywne
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>Wyłączone</span>
                  )}
                </td>

                <td style={{ padding: '12px 16px', fontSize: '12px', color: a.lastActive?.includes('Online') ? 'var(--status-success)' : 'var(--text-muted)' }}>
                  {a.lastActive || 'Niedawno'}
                </td>

                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(a)}
                      title="Edytuj uprawnienia i hasło"
                      style={{
                        padding: '6px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteAdmin(a)}
                      title="Usuń administratora"
                      style={{
                        padding: '6px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-content anim-scale-pop"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={16} color="var(--brand-purple)" />
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  {t.adminsTab.modalAddTitle}
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.adminsTab.usernameLabel}
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder={t.adminsTab.usernamePlaceholder}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.adminsTab.passwordLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={t.adminsTab.passwordPlaceholder}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '5px',
                      padding: '8px 36px 8px 12px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {t.adminsTab.roleLabel}
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Senior Admin">Senior Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {t.adminsTab.discordLabel}
                  </label>
                  <input
                    type="text"
                    value={formDiscord}
                    onChange={(e) => setFormDiscord(e.target.value)}
                    placeholder={t.adminsTab.discordPlaceholder}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.adminsTab.permissionsLabel}
                </label>
                <input
                  type="text"
                  value={formPermissions}
                  onChange={(e) => setFormPermissions(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="has2faCheckbox"
                  checked={formHas2fa}
                  onChange={(e) => setFormHas2fa(e.target.checked)}
                  style={{ accentColor: 'var(--brand-purple)' }}
                />
                <label htmlFor="has2faCheckbox" style={{ fontSize: '12px', color: '#fff', cursor: 'pointer' }}>
                  {t.adminsTab.enable2fa}
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ height: '34px', padding: '0 14px' }}
                >
                  {t.adminsTab.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ height: '34px', padding: '0 16px' }}
                >
                  {t.adminsTab.createBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedAdmin && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-content anim-scale-pop"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={16} color="var(--brand-purple)" />
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  {t.adminsTab.modalEditTitle}: {selectedAdmin.username}
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.adminsTab.editPasswordLabel}
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder={t.adminsTab.editPasswordPlaceholder}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {t.adminsTab.roleLabel}
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Senior Admin">Senior Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {t.adminsTab.discordLabel}
                  </label>
                  <input
                    type="text"
                    value={editDiscord}
                    onChange={(e) => setEditDiscord(e.target.value)}
                    placeholder={t.adminsTab.discordPlaceholder}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      color: '#fff',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  {t.adminsTab.permissionsLabel}
                </label>
                <input
                  type="text"
                  value={editPermissions}
                  onChange={(e) => setEditPermissions(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="editHas2faCheckbox"
                  checked={editHas2fa}
                  onChange={(e) => setEditHas2fa(e.target.checked)}
                  style={{ accentColor: 'var(--brand-purple)' }}
                />
                <label htmlFor="editHas2faCheckbox" style={{ fontSize: '12px', color: '#fff', cursor: 'pointer' }}>
                  {t.adminsTab.enable2fa}
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                  style={{ height: '34px', padding: '0 14px' }}
                >
                  {t.adminsTab.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ height: '34px', padding: '0 16px' }}
                >
                  {t.adminsTab.saveChangesBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
