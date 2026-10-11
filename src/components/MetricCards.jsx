'use client';

import React from 'react';
import { Copy, ChevronRight, Check } from 'lucide-react';

export default function MetricCards({ serverInfo, onOpenResources, onToast }) {
  const [copiedUptime, setCopiedUptime] = React.useState(false);

  const handleCopyUptime = () => {
    navigator.clipboard?.writeText?.(serverInfo.uptime);
    setCopiedUptime(true);
    onToast?.(`Copied server uptime (${serverInfo.uptime})`);
    setTimeout(() => setCopiedUptime(false), 2000);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gap: '14px',
      padding: '0 28px 20px'
    }}>
      {/* 1. gracze online */}
      <div className="panel-card anim-slide-up delay-1" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Players Online
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
              border: '1px solid var(--status-success-border)'
            }}>
              +8 last hr
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }} className="num-tabular">
              {serverInfo.onlinePlayers}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }} className="num-tabular">
              / {serverInfo.maxPlayers} max
            </span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          OneSync: <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>ON</span>
        </div>
      </div>

      {/* 2. ststus serwra */}
      <div className="panel-card anim-slide-up delay-2" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Server Status
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
              border: '1px solid var(--status-success-border)'
            }}>
              <span className="live-pulse-dot" style={{ width: '5px', height: '5px' }} />
              <span>ACTIVE</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              ONLINE
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }} className="num-tabular">
              {serverInfo.healthRate}
            </span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{serverInfo.name.split('//')[0]}</span>
          <span style={{ color: 'var(--text-secondary)' }}>txAdmin 7.2</span>
        </div>
      </div>

      {/* 3. czas pracy serwera */}
      <div className="panel-card anim-slide-up delay-3" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Server Uptime
            </span>
            <button
              onClick={handleCopyUptime}
              style={{
                color: 'var(--text-muted)',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s ease'
              }}
              title="Copy uptime"
            >
              {copiedUptime ? <Check size={14} color="var(--status-success)" /> : <Copy size={13} />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }} className="num-tabular">
              {serverInfo.uptime}
            </span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>Started {serverInfo.uptimeStarted}</span>
          <span>·</span>
          <span style={{ color: 'var(--status-success)', fontWeight: 600 }} className="num-tabular">
            {serverInfo.fps} FPS
          </span>
          <span>•</span>
          <span style={{ color: 'var(--status-success)', fontWeight: 600 }} className="num-tabular">
            {serverInfo.tickTimeMs}ms
          </span>
        </div>
      </div>

      {/* 4. laczne zasobby */}
      <div className="panel-card anim-slide-up delay-4" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Total Resources
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '9999px',
              backgroundColor: 'var(--status-warning-bg)',
              color: 'var(--status-warning)',
              border: '1px solid var(--status-warning-border)'
            }}>
              {serverInfo.stoppedResources} Stopped
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }} className="num-tabular">
              {serverInfo.totalResources}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              manifested
            </span>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {serverInfo.activeResources} active, {serverInfo.stoppedResources} dormant
          </span>
          <button
            onClick={onOpenResources}
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Manage <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
