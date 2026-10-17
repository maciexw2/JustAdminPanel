'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Cpu, HardDrive, Network } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ServerHealth({ hardware }) {
  const { t } = useLanguage();

  return (
    <div className="panel-card anim-slide-right delay-2" style={{ padding: '20px 22px', flex: '1 1 38%', minWidth: '340px' }}>
      {/* naglowek */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
            {t.health.title}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t.health.subtitle}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '9999px',
          backgroundColor: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          border: '1px solid var(--status-success-border)'
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--status-success)' }} />
          <span>{t.health.statusNormal}</span>
        </div>
      </div>

      {/* paski sprzetowe */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* procek cpu */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Cpu size={14} color="#a1a1aa" />
              <span>{t.health.cpuUtil}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }} className="num-tabular">
              {hardware.cpuUsage}%
            </span>
          </div>

          {/* pasek postempu */}
          <div style={{
            height: '6px',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: `${hardware.cpuUsage}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '5px'
          }}>
            <span>{hardware.cpuModel}</span>
            <span className="num-tabular">{hardware.cpuClock}</span>
          </div>
        </div>

        {/* pamiec ram */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <HardDrive size={14} color="#a1a1aa" />
              <span>{t.health.ramUtil}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }} className="num-tabular">
              {hardware.ramPercent}%
            </span>
          </div>

          {/* pasek postempu */}
          <div style={{
            height: '6px',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: '3px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: `${hardware.ramPercent}%`,
              height: '100%',
              backgroundColor: '#8b5cf6',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '5px'
          }}>
            <span className="num-tabular">{hardware.ramUsedGb} GB / {hardware.ramTotalGb} GB</span>
            <span className="num-tabular">{hardware.ramPercent}%</span>
          </div>
        </div>

        {/* statystyki sieci */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginTop: '2px'
        }}>
          <div style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <ArrowUpRight size={13} color="#3b82f6" />
              <span>{t.metrics.outboundNet}</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
              {hardware.outboundMbps} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>Mbps</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <ArrowDownLeft size={13} color="#10b981" />
              <span>{t.metrics.inboundNet}</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '4px' }} className="num-tabular">
              {hardware.inboundMbps} <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>Mbps</span>
            </div>
          </div>
        </div>
      </div>

      {/* stopka */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Network size={13} color="var(--brand-purple)" />
          <span>OneSync BigMode</span>
        </div>
        <span className="num-tabular">128 Slots Registered</span>
      </div>
    </div>
  );
}
