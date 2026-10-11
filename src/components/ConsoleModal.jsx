'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, CornerDownLeft, Trash2, Shield, Circle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ConsoleModal({ isOpen, onClose, onToast }) {
  const { t } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { id: 1, type: 'info', time: '20:31:02', text: '[FXServer] Server initialized on port 30120 (OneSync BigMode: active)' },
    { id: 2, type: 'info', time: '20:31:04', text: '[txAdmin] Bridge connection established with node 142.250.190.40' },
    { id: 3, type: 'success', time: '20:31:07', text: '[just-core] Framework components loaded successfully. Cache warm in 120ms.' },
    { id: 4, type: 'info', time: '20:31:12', text: '[ox_inventory] Initialized 85 unique item weights & custom hooks.' },
    { id: 5, type: 'warn', time: '20:32:45', text: '[screenshot-basic] Resource is stopped in resources.cfg' },
    { id: 6, type: 'info', time: '20:33:10', text: '[chat] #42 (Maciex): Chief on duty, 10-8 patrol units check-in.' }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim();
    const now = new Date().toTimeString().split(' ')[0];

    // dodaj komende usera do termianla
    const userEntry = {
      id: Date.now(),
      type: 'cmd',
      time: now,
      text: `> ${cmd}`
    };

    if (cmd.toLowerCase() === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    setHistory((prev) => [...prev, userEntry]);
    setInputVal('');

    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      const data = await res.json();

      const replyEntry = {
        id: Date.now() + 1,
        type: data.success ? 'success' : 'warn',
        time: new Date().toTimeString().split(' ')[0],
        text: data.output || `[FXServer] ${cmd} executed`
      };

      setHistory((prev) => [...prev, replyEntry]);
      if (data.success) {
        onToast?.(`Executed: ${cmd.split(' ')[0]}`);
      }
    } catch {
      const fallbackEntry = {
        id: Date.now() + 1,
        type: 'info',
        time: new Date().toTimeString().split(' ')[0],
        text: `[FXServer fallback] Executed: ${cmd}`
      };
      setHistory((prev) => [...prev, fallbackEntry]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '780px', height: '560px', display: 'flex', flexDirection: 'column', backgroundColor: '#0e0e12' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* naglowek termianla */}
        <div style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-panel)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="var(--brand-purple)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              {t.modals.console.title}
            </span>
            <span style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              color: 'var(--status-success)',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              LIVE STREAM
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setHistory([])}
              style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
              title={t.modals.console.clear}
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={onClose}
              style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '4px' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* cialo termianla */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {history.map((entry) => {
            const getColor = () => {
              if (entry.type === 'cmd') return '#c4b5fd';
              if (entry.type === 'success') return '#4ade80';
              if (entry.type === 'warn') return '#fbbf24';
              if (entry.type === 'danger') return '#f87171';
              return '#a1a1aa';
            };

            return (
              <div key={entry.id} style={{ display: 'flex', gap: '10px', wordBreak: 'break-word' }}>
                <span style={{ color: '#52525b', flexShrink: 0, userSelect: 'none' }} className="num-tabular">
                  [{entry.time}]
                </span>
                <span style={{ color: getColor(), flex: 1 }}>
                  {entry.text}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* pasek do wpsiywania komend */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-primary)',
            backgroundColor: 'var(--surface-panel)',
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
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.modals.console.placeholder}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px'
            }}
            autoFocus
          />
          <button type="submit" className="btn-primary" style={{ height: '30px', padding: '0 10px', fontSize: '11px' }}>
            <CornerDownLeft size={13} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
