'use client';

import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  Zap,
  Server,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  RotateCw
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ServerTab({ serverInfo, hardware, onToast }) {
  const { t } = useLanguage();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [syncRate, setSyncRate] = useState('50ms');
  const isOnline = serverInfo?.status === 'ONLINE';

  const baseLoad = isOnline ? (hardware?.cpuUsage || 15) : 0;
  const cores = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    load: isOnline ? Math.max(0, Math.min(100, Math.round(baseLoad + ((i % 3) * 4) - 2))) : 0
  }));

  const routingBuckets = isOnline ? [
    { id: 0, name: 'Default World (Los Santos)', count: serverInfo?.onlinePlayers || 0, population: serverInfo?.onlinePlayers > 0 ? 'High' : 'Empty' }
  ] : [];

  const handleToggleMaintenance = () => {
    const newState = !maintenanceMode;
    setMaintenanceMode(newState);
    onToast?.(newState ? 'Server maintenance mode ACTIVATED.' : 'Server maintenance mode DEACTIVATED.');
  };

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px' }}>
      {/* gorny bank telemetri */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        <div className="panel-card anim-slide-up delay-1" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.serverTab.statFps}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--status-success)', marginTop: '4px' }} className="num-tabular">
            {serverInfo.fps} FPS <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>· {serverInfo.tickTimeMs}ms</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-2" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.serverTab.statOnesync}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            BigMode <span style={{ fontSize: '12px', color: '#c4b5fd', fontWeight: 500 }}>(128 slots)</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-3" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.serverTab.statNetIo}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#60a5fa', marginTop: '4px' }} className="num-tabular">
            {hardware.outboundMbps} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mbps</span> / {hardware.inboundMbps} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mbps</span>
          </div>
        </div>
        <div className="panel-card anim-slide-up delay-4" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.serverTab.statHealth}</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#4ade80', marginTop: '4px' }}>
            99.98%
          </div>
        </div>
      </div>

      {/* srodkowy rzad: rdzenie cpu i pamiec */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {/* podzial rdzeni procka */}
        <div className="panel-card anim-slide-left delay-2" style={{ flex: '1 1 50%', minWidth: '420px', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {t.serverTab.cpuTitle}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {hardware.cpuModel} @ {hardware.cpuClock}
              </p>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa' }} className="num-tabular">
              {hardware.cpuUsage}% AVG
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {cores.map((c) => (
              <div key={c.id} style={{
                backgroundColor: 'var(--surface-subtle)',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>vCore #{c.id}</span>
                  <span style={{ fontWeight: 600, color: '#fff' }} className="num-tabular">{c.load}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--surface-base)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.load}%`, height: '100%', backgroundColor: '#3b82f6' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* podzial zuzycia ramu */}
        <div className="panel-card anim-slide-right delay-2" style={{ flex: '1 1 45%', minWidth: '360px', padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {t.serverTab.ramTitle}
              </h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t.serverTab.totalAllocated}: {hardware.ramUsedGb} GB / {hardware.ramTotalGb} GB ({hardware.ramPercent}%)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Lua Runtime & JIT Heap', size: '4.8 GB', percent: 25, color: '#7c3aed' },
              { label: 'V8 Engine & C++ Workers', size: '6.2 GB', percent: 32, color: '#3b82f6' },
              { label: 'Entity & Physical World Buffers', size: '5.1 GB', percent: 26, color: '#22c55e' },
              { label: 'txAdmin Daemon & SQLite Cache', size: '3.4 GB', percent: 17, color: '#f59e0b' }
            ].map((layer) => (
              <div key={layer.label} style={{
                backgroundColor: 'var(--surface-subtle)',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{layer.label}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{layer.size}</span>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--surface-base)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${layer.percent * 2}%`, height: '100%', backgroundColor: layer.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabela wymiarow routing buckets */}
      <div className="panel-card anim-slide-up delay-3" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
            {t.serverTab.routingBuckets}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t.serverTab.routingSubtitle}
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-subtle)', color: 'var(--text-muted)', fontSize: '10.5px', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 18px' }}>{t.serverTab.thBucketId}</th>
              <th style={{ padding: '10px 16px' }}>{t.serverTab.thDimensionName}</th>
              <th style={{ padding: '10px 16px' }}>{t.serverTab.thPlayers}</th>
              <th style={{ padding: '10px 18px', textAlign: 'right' }}>{t.serverTab.thIsolation}</th>
            </tr>
          </thead>
          <tbody>
            {routingBuckets.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {isOnline ? 'Brak aktywnych partycji routing buckets' : 'Brak połączenia z silnikiem FiveM (Wymiary OneSync niedostępne)'}
                </td>
              </tr>
            ) : (
              routingBuckets.map((b, idx) => (
              <tr
                key={b.id}
                className="interactive-row anim-row-stagger"
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  animationDelay: `${idx * 40}ms`
                }}
              >
                <td style={{ padding: '12px 18px', fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 600 }}>
                  Bucket #{b.id}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#fff' }}>
                  {b.name}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 600, color: '#4ade80' }}>{b.count}</span> {t.serverTab.playersUnit}
                </td>
                <td style={{ padding: '12px 18px', textAlign: 'right', color: 'var(--text-muted)' }}>
                  {b.population}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
