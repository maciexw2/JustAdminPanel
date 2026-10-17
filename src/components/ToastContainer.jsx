'use client';

import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 9999,
      maxWidth: '380px'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="anim-fade-in"
          style={{
            backgroundColor: '#18181d',
            border: '1px solid var(--border-highlight)',
            borderRadius: '6px',
            padding: '10px 14px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            color: '#fff',
            fontSize: '12.5px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} color="var(--status-success)" />
            <span>{toast.message}</span>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{ color: 'var(--text-muted)', padding: '2px' }}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
