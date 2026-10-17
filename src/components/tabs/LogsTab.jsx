'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Trash2,
  Download,
  Play,
  Pause,
  CornerDownLeft,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const initialLogs = [
  { id: 1, type: 'server', time: '20:30:11', text: '[FXServer] Process spawned with PID 28419 (64-bit Linux)' },
  { id: 2, type: 'server', time: '20:30:14', text: '[FXServer] Bound TCP/UDP to endpoint 142.250.190.40:30120' },
  { id: 3, type: 'txadmin', time: '20:30:18', text: '[txAdmin] txAdmin bridge v7.2.1 initialized. Master token registered.' },
  { id: 4, type: 'server', time: '20:30:22', text: '[just-core] Manifest v2.1.0 loaded. 85 game components registered.' },
  { id: 5, type: 'server', time: '20:30:28', text: '[ox_inventory] Database schema verified. Table `ox_inventory` indexed in 44ms.' },
  { id: 6, type: 'warn', time: '20:31:05', text: '[screenshot-basic] Resource is currently dormant (stopped by config).' },
  { id: 7, type: 'chat', time: '20:32:19', text: '[chat] #42 (Maciex): Server patrol starting at Mission Row PD.' },
  { id: 8, type: 'txadmin', time: '20:33:02', text: '[txAdmin] Automated world state snapshot committed (482 MB).' },
  { id: 9, type: 'chat', time: '20:34:40', text: '[chat] #19 (Vega): EMS ambulance 10-8, ready for dispatch calls.' }
];

export default function LogsTab({ onToast }) {
  const { t } = useLanguage();
  const [logs, setLogs] = useState(initialLogs);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [cmdInput, setCmdInput] = useState('');
  const terminalEndRef = useRef(null);

  // efekt auto skrolowania
  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // symulacja strumienia logow na rzywo
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const now = new Date().toTimeString().split(' ')[0];
      const randomLogs = [
        { type: 'server', text: `[ox_lib] MySQL pooled connection verified (latency: ${(1.2 + Math.random() * 0.8).toFixed(1)}ms).` },
        { type: 'chat', text: `[chat] #${Math.floor(20 + Math.random() * 80)}: /me checks vehicle license plate.` },
        { type: 'txadmin', text: `[txAdmin] OneSync tick latency synchronized: 16.6ms.` },
        { type: 'server', text: `[just-core] Garbage collector cleared ${Math.floor(2 + Math.random() * 8)} MB unreferenced buffers.` }
      ];

      const item = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs((prev) => [...prev.slice(-150), { id: Date.now(), time: now, ...item }]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim();
    const now = new Date().toTimeString().split(' ')[0];

    const userEntry = {
      id: Date.now(),
      type: 'cmd',
      time: now,
      text: `> ${cmd}`
    };

    let reply = null;
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setLogs([]);
      setCmdInput('');
      return;
    } else if (lower === 'status') {
      reply = {
        id: Date.now() + 1,
        type: 'server',
        time: now,
        text: '[FXServer] 42/128 players | 85 active resources | 60.2 FPS'
      };
    } else if (lower.startsWith('say ')) {
      const msg = cmd.slice(4);
      reply = {
        id: Date.now() + 1,
        type: 'chat',
        time: now,
        text: `[txAdmin Broadcast] (Admin) Console: "${msg}"`
      };
      onToast?.(`Broadcast sent: "${msg}"`);
    } else if (lower.startsWith('ensure ') || lower.startsWith('restart ')) {
      const res = cmd.split(' ')[1] || 'resource';
      reply = {
        id: Date.now() + 1,
        type: 'server',
        time: now,
        text: `[FXServer] Restarting resource "${res}"... Rebuilt in 82ms.`
      };
      onToast?.(`Resource "${res}" restarted`);
    } else {
      reply = {
        id: Date.now() + 1,
        type: 'server',
        time: now,
        text: `[FXServer] Command "${cmd}" dispatched to server engine.`
      };
    }

    setLogs((prev) => [...prev, userEntry, reply]);
    setCmdInput('');
  };

  const handleExportLogs = () => {
    const content = logs.map((l) => `[${l.time}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fxserver-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onToast?.('Console logs exported to file');
  };

  const filteredLogs = logs.filter((l) => {
    if (filterType !== 'ALL' && l.type.toUpperCase() !== filterType) return false;
    if (search && !l.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getLogColor = (type) => {
    switch (type) {
      case 'cmd': return '#c4b5fd';
      case 'server': return '#38bdf8';
      case 'txadmin': return '#a78bfa';
      case 'chat': return '#4ade80';
      case 'warn': return '#fbbf24';
      case 'danger': return '#f87171';
      default: return '#e4e4e7';
    }
  };

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 28px 28px', height: 'calc(100vh - 140px)' }}>
      {/* gorny pasek filtrow i kontrolek */}
      <div className="panel-card anim-slide-up delay-1" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        {/* pigulki filtrow */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'ALL', label: t.logsTab.filterAll },
            { id: 'SERVER', label: t.logsTab.filterServer },
            { id: 'TXADMIN', label: t.logsTab.filterTxAdmin },
            { id: 'CHAT', label: t.logsTab.filterChat },
            { id: 'WARN', label: t.logsTab.filterWarn }
          ].map((pill) => {
            const active = filterType === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setFilterType(pill.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: active ? 600 : 500,
                  padding: '4px 9px',
                  borderRadius: '4px',
                  backgroundColor: active ? 'var(--brand-purple)' : 'var(--surface-subtle)',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--brand-purple)' : 'var(--border-subtle)'}`
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* szukajka */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--surface-subtle)',
          border: '1px solid var(--border-primary)',
          borderRadius: '4px',
          padding: '4px 10px',
          width: '220px'
        }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.logsTab.searchPlaceholder}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* przyciski akcji */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="btn-secondary"
            style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
          >
            {isStreaming ? <Pause size={13} color="#fbbf24" /> : <Play size={13} color="#4ade80" />}
            <span>{isStreaming ? 'Pause' : 'Stream'}</span>
          </button>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className="btn-secondary"
            style={{
              height: '30px',
              fontSize: '11.5px',
              padding: '0 10px',
              backgroundColor: autoScroll ? 'rgba(124, 58, 237, 0.2)' : 'var(--surface-subtle)',
              borderColor: autoScroll ? 'var(--brand-purple)' : 'var(--border-subtle)'
            }}
          >
            <span>{t.logsTab.autoScroll} {autoScroll ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setLogs([])}
            className="btn-secondary"
            style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
            title={t.logsTab.clear}
          >
            <Trash2 size={13} />
            <span>{t.logsTab.clear}</span>
          </button>

          <button
            onClick={handleExportLogs}
            className="btn-secondary"
            style={{ height: '30px', fontSize: '11.5px', padding: '0 10px' }}
          >
            <Download size={13} />
            <span>{t.logsTab.export}</span>
          </button>
        </div>
      </div>

      {/* pelne okno terminala */}
      <div className="panel-card anim-slide-up delay-2" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#09090c', overflow: 'hidden' }}>
        {/* naglowek terminala */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--surface-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={14} color="var(--brand-purple)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              root@fxserver-node-01: /home/fxserver/server-data
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontSize: '10.5px', color: 'var(--status-success)', fontWeight: 600 }}>LIVE RCON</span>
          </div>
        </div>

        {/* wyjscie logow */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: '19px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          {filteredLogs.map((log) => (
            <div key={log.id} style={{ display: 'flex', gap: '10px', wordBreak: 'break-word' }}>
              <span style={{ color: '#52525b', flexShrink: 0, userSelect: 'none' }} className="num-tabular">
                [{log.time}]
              </span>
              <span style={{ color: getLogColor(log.type), flex: 1 }}>
                {log.text}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* formularz komendy w terminalu */}
        <form
          onSubmit={handleCommandSubmit}
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-primary)',
            backgroundColor: 'var(--surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ color: 'var(--brand-purple)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
            fxs&gt;
          </span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder={t.logsTab.sendCmdPlaceholder}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px'
            }}
          />
          <button type="submit" className="btn-primary" style={{ height: '30px', padding: '0 12px', fontSize: '11.5px' }}>
            <CornerDownLeft size={13} />
            <span>{t.logsTab.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
