'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Boxes,
  Activity,
  Terminal,
  Settings,
  ShieldCheck,
  ChevronDown,
  Server,
  ListChecks
} from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function Sidebar({ activeTab, setActiveTab, playerCount = 42, stoppedCount = 2 }) {
  const { t } = useLanguage();

  const navSections = [
    {
      title: t.nav.overview,
      items: [
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard }
      ]
    },
    {
      title: t.nav.management,
      items: [
        { id: 'players', label: t.nav.players, icon: Users, badge: String(playerCount) },
        { id: 'moderation', label: t.nav.moderation, icon: ShieldAlert },
        { id: 'resources', label: t.nav.resources, icon: Boxes, badge: String(stoppedCount), badgeVariant: 'warning' }
      ]
    },
    {
      title: t.nav.monitoring,
      items: [
        { id: 'server', label: t.nav.server, icon: Activity },
        { id: 'logs', label: t.nav.logs, icon: Terminal }
      ]
    },
    {
      title: t.nav.system,
      items: [
        { id: 'checklist', label: t.nav.checklist, icon: ListChecks, badge: 'PROD', badgeVariant: 'warning' },
        { id: 'settings', label: t.nav.settings, icon: Settings },
        { id: 'admins', label: t.nav.admins, icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside className="anim-slide-left" style={{
      width: '240px',
      minWidth: '240px',
      backgroundColor: 'var(--surface-base)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      userSelect: 'none'
    }}>
      {/* naglowek marki */}
      <div style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          position: 'relative',
          width: '32px',
          height: '32px',
          borderRadius: '7px',
          overflow: 'hidden',
          backgroundColor: '#18181d',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image
            src="/logojust.png"
            alt="Just AdminPanel Logo"
            width={28}
            height={28}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: '#fff' }}>
              Just AdminPanel
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '14px' }}>
            {t.nav.connectedNode}
          </p>
        </div>
      </div>

      {/* sekcje nawigacjii */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {navSections.map((section) => (
          <div key={section.title}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              padding: '0 10px 6px',
              letterSpacing: '0.08em'
            }}>
              {section.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className="sidebar-nav-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--brand-purple)' : 'transparent',
                      boxShadow: isActive ? '0 4px 14px var(--brand-purple-glow)' : 'none',
                      transform: isActive ? 'translateX(2px)' : 'none',
                      textAlign: 'left',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} style={{ transition: 'transform 0.2s ease', transform: isActive ? 'scale(1.1)' : 'none' }} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        backgroundColor: item.badgeVariant === 'warning'
                          ? 'var(--status-warning-bg)'
                          : isActive
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'var(--border-primary)',
                        color: item.badgeVariant === 'warning'
                          ? 'var(--status-warning)'
                          : '#fff',
                        border: item.badgeVariant === 'warning'
                          ? '1px solid var(--status-warning-border)'
                          : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* dolna belka profilowa */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: '7px',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#7c3aed',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px'
            }}>
              M
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: '16px' }}>
                Maciex
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '14px' }}>
                v2.4.0-stable
              </div>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>
    </aside>
  );
}
