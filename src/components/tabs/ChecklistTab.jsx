'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Key,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Server,
  Globe,
  Radio,
  Sliders,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ChecklistTab({ onNavigateTab, onToast }) {
  const { lang, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [generatingToken, setGeneratingToken] = useState(false);
  const [generatedSnippet, setGeneratedSnippet] = useState(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checklist');
      const json = await res.json();
      if (json.ok) {
        setData(json);
      }
    } catch {
      onToast?.(lang === 'pl' ? 'Błąd pobierania listy produkcyjnej' : 'Error fetching production checklist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, []);

  const handleGenerateToken = async () => {
    try {
      setGeneratingToken(true);
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_token' })
      });
      const resJson = await res.json();

      if (resJson.ok) {
        setGeneratedSnippet(resJson.luaConfigSnippet);
        onToast?.(lang === 'pl' ? 'Wygenerowano 64-bitowy token! Zaktualizuj config.lua' : '64-bit secure token generated! Update config.lua');
        await loadChecklist();
      }
    } catch {
      onToast?.(lang === 'pl' ? 'Błąd generowania tokena' : 'Error generating token');
    } finally {
      setGeneratingToken(false);
    }
  };

  const handleToggleManual = async (key) => {
    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_manual', key })
      });
      const resJson = await res.json();
      if (resJson.ok) {
        onToast?.(lang === 'pl' ? 'Zaktualizowano status weryfikacji ręcznej' : 'Manual verification status updated');
        await loadChecklist();
      }
    } catch {
      onToast?.(lang === 'pl' ? 'Błąd aktualizacji statusu' : 'Error updating check status');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedSnippet(true);
    onToast?.(t.checklistTab.toastCopied);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const items = data?.items || [];
  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'required') return item.severity === 'required' && item.status !== 'ready';
    if (filter === 'recommended') return item.severity === 'recommended' && item.status !== 'ready';
    if (filter === 'ready') return item.status === 'ready';
    return true;
  });

  return (
    <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 28px 28px', maxWidth: '1080px' }}>
      
      <div className="panel-card anim-slide-down" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(124, 58, 237, 0.08) 100%)',
        borderColor: data?.isProductionReady ? 'var(--status-success-border)' : 'rgba(124, 58, 237, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: data?.isProductionReady
            ? 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, var(--brand-purple-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: data?.isProductionReady ? 'var(--status-success-bg)' : 'rgba(239, 68, 68, 0.15)',
                color: data?.isProductionReady ? 'var(--status-success)' : 'var(--status-danger)',
                border: `1px solid ${data?.isProductionReady ? 'var(--status-success-border)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                {data?.isProductionReady ? (
                  <>
                    <CheckCircle2 size={13} />
                    <span>{t.checklistTab.readyBanner}</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={13} />
                    <span>{t.checklistTab.blockerBanner} ({data?.requiredPending || 0} {t.checklistTab.blockersCount})</span>
                  </>
                )}
              </div>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {t.checklistTab.auditLabel}
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
              {t.checklistTab.title}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '640px', lineHeight: '18px' }}>
              {t.checklistTab.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={loadChecklist}
              disabled={loading}
              className="btn-secondary"
              style={{ height: '34px', fontSize: '12px' }}
              title={t.checklistTab.rescan}
            >
              <RefreshCw size={14} className={loading ? 'anim-spin' : ''} />
              <span>{t.checklistTab.rescan}</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '22px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {t.checklistTab.readinessStatus} <span style={{ color: '#fff', fontWeight: 600 }}>{data?.readyCount || 0} {t.checklistTab.configuredOutOf} {data?.totalCount || 8} {t.checklistTab.configuredOutOfEnd}</span>
            </span>
            <span style={{
              fontWeight: 700,
              fontSize: '13px',
              color: data?.percentage > 70 ? 'var(--status-success)' : data?.percentage > 35 ? 'var(--brand-purple)' : 'var(--status-danger)'
            }} className="num-tabular">
              {data?.percentage || 0}%
            </span>
          </div>

          <div style={{
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${data?.percentage || 0}%`,
              height: '100%',
              backgroundColor: data?.isProductionReady ? 'var(--status-success)' : 'var(--brand-purple)',
              boxShadow: data?.isProductionReady ? '0 0 12px var(--status-success)' : '0 0 12px var(--brand-purple)',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>
        </div>
      </div>

      {generatedSnippet && (
        <div className="panel-card anim-scale-pop" style={{
          padding: '18px 22px',
          backgroundColor: 'rgba(124, 58, 237, 0.12)',
          borderColor: 'var(--brand-purple)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 600, fontSize: '13px' }}>
              <Key size={16} color="var(--brand-purple)" />
              <span>{t.checklistTab.keySavedNotice}</span>
            </div>
            <button
              onClick={() => setGeneratedSnippet(null)}
              style={{ color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}
            >
              {t.checklistTab.closePreview}
            </button>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {t.checklistTab.openFileInstruction}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: '#09090c',
            border: '1px solid var(--border-primary)',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            color: '#4ade80'
          }}>
            <span>{generatedSnippet}</span>
            <button
              onClick={() => copyToClipboard(generatedSnippet)}
              className="btn-secondary"
              style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}
            >
              {copiedSnippet ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
              <span>{copiedSnippet ? t.checklistTab.copied : t.checklistTab.copy}</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[
          { id: 'all', label: `${t.checklistTab.filterAll} (${items.length})` },
          { id: 'required', label: `${t.checklistTab.filterCritical} (${items.filter(i => i.severity === 'required' && i.status !== 'ready').length})` },
          { id: 'recommended', label: `${t.checklistTab.filterRecommended} (${items.filter(i => i.severity === 'recommended' && i.status !== 'ready').length})` },
          { id: 'ready', label: `${t.checklistTab.filterCompleted} (${items.filter(i => i.status === 'ready').length})` }
        ].map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                fontSize: '12px',
                fontWeight: active ? 600 : 500,
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: active ? 'var(--brand-purple)' : 'var(--surface-panel)',
                color: active ? '#fff' : 'var(--text-secondary)',
                border: active ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.map((item, idx) => {
          const isReady = item.status === 'ready';
          const isRequired = item.severity === 'required';
          const itemTitle = lang === 'en' && item.titleEn ? item.titleEn : item.title;
          const itemDesc = lang === 'en' && item.descriptionEn ? item.descriptionEn : item.description;
          const itemVal = lang === 'en' && item.currentValueEn ? item.currentValueEn : item.currentValue;
          const itemActionLabel = lang === 'en' && item.actionLabelEn ? item.actionLabelEn : item.actionLabel;

          return (
            <div
              key={item.id}
              className="panel-card anim-row-stagger"
              style={{
                padding: '18px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: isReady
                  ? '3px solid var(--status-success)'
                  : isRequired
                  ? '3px solid var(--status-danger)'
                  : '3px solid var(--status-warning)',
                animationDelay: `${idx * 40}ms`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '320px' }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {isReady ? (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={15} color="var(--status-success)" />
                    </div>
                  ) : isRequired ? (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <XCircle size={15} color="var(--status-danger)" />
                    </div>
                  ) : (
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={15} color="var(--status-warning)" />
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                      {itemTitle}
                    </span>

                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      backgroundColor: isReady
                        ? 'var(--status-success-bg)'
                        : isRequired
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                      color: isReady
                        ? 'var(--status-success)'
                        : isRequired
                        ? '#f87171'
                        : '#fbbf24',
                      border: isReady
                        ? '1px solid var(--status-success-border)'
                        : isRequired
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {isReady ? t.checklistTab.tagReady : isRequired ? t.checklistTab.tagRequired : t.checklistTab.tagRecommended}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '16px' }}>
                    {itemDesc}
                  </p>

                  <div style={{
                    marginTop: '8px',
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t.checklistTab.detected}</span>
                    <code style={{
                      backgroundColor: 'var(--surface-subtle)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-mono)',
                      color: isReady ? '#4ade80' : '#fbbf24'
                    }}>
                      {itemVal}
                    </code>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {item.canAutoFix && (
                  <button
                    type="button"
                    onClick={handleGenerateToken}
                    disabled={generatingToken}
                    className="btn-primary"
                    style={{ height: '32px', fontSize: '12px' }}
                  >
                    <Zap size={13} />
                    <span>{generatingToken ? t.checklistTab.generating : itemActionLabel}</span>
                  </button>
                )}

                {item.targetTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.(item.targetTab)}
                    className="btn-secondary"
                    style={{ height: '32px', fontSize: '12px' }}
                  >
                    <span>{itemActionLabel}</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                {item.canToggleManual && (
                  <button
                    type="button"
                    onClick={() => handleToggleManual(item.manualKey)}
                    className="btn-secondary"
                    style={{
                      height: '32px',
                      fontSize: '12px',
                      backgroundColor: isReady ? 'var(--status-success-bg)' : 'var(--surface-elevated)',
                      borderColor: isReady ? 'var(--status-success-border)' : 'var(--border-primary)',
                      color: isReady ? 'var(--status-success)' : '#fff'
                    }}
                  >
                    {isReady ? <Check size={13} /> : null}
                    <span>{itemActionLabel}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
