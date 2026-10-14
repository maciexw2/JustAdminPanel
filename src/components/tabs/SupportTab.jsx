'use client';

import React from 'react';
import {
  HeartHandshake,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  Code2,
  Sparkles,
  Server,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Terminal,
  Cpu,
  GitBranch
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

// Wektorowe SVG logo GitHub
function GithubIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function SupportTab({ onToast }) {
  const { t, lang } = useLanguage();

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    onToast?.(lang === 'pl' ? `Skopiowano ${label} do schowka!` : `Copied ${label} to clipboard!`);
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Baner Glowny Supportu */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.16) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(9, 9, 11, 0.95) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          borderRadius: '12px',
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'rgba(124, 58, 237, 0.25)', border: '1px solid rgba(124, 58, 237, 0.4)', marginBottom: '14px' }}>
            <Sparkles size={13} color="#a78bfa" />
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#c4b5fd', letterSpacing: '0.04em' }}>
              JUSTADMIN ARCHITECTURE & COMMUNITY
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            {lang === 'pl' ? 'Oficjalne Wsparcie & Społeczność' : 'Official Support & Community'}
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            {lang === 'pl'
              ? 'Potrzebujesz pomocy z konfiguracją mostka FiveM, integracją baz danych, lub chcesz zgłosić pomysł na nową funkcję panelu? Dołącz do naszego oficjalnego serwera Discord lub sprawdź repozytoria twórcy na GitHubie.'
              : 'Need help setting up your FiveM bridge, custom database integrations, or want to suggest new dashboard features? Join our official Discord community or check out the developer repositories on GitHub.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <a
              href="https://discord.gg/MajXduM7bz"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                backgroundColor: '#5865F2',
                borderColor: '#4752c4',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={16} fill="#fff" />
              <span>{lang === 'pl' ? 'Dołącz do Discorda' : 'Join Discord Server'}</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="https://github.com/maciexw2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <GithubIcon size={16} color="#fff" />
              <span>GitHub: @maciexw2</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Grid: 2 Kolumny (Discord & GitHub / Tworca) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Karta Discord */}
        <div
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-primary)',
            borderRadius: '10px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(88, 101, 242, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(88, 101, 242, 0.3)' }}>
                  <MessageSquare size={20} color="#818cf8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0 }}>
                    Discord Support Server
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {lang === 'pl' ? 'Oficjalna strefa zgłoszeń & helpdesk' : 'Official helpdesk & ticket support'}
                  </span>
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '11px' }}>
                24/7 ONLINE
              </span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {lang === 'pl'
                ? 'Dostęp do ticketów technicznych, aktualizacji w czasie rzeczywistym, poradników optymalizacyjnych FiveM oraz bezpośredniego kontaktu z developerami.'
                : 'Access to technical support tickets, live changelogs, FiveM optimization guides, and direct assistance from core developers.'}
            </p>

            <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <code style={{ fontSize: '12px', color: '#a78bfa', fontFamily: 'var(--font-mono, monospace)' }}>
                https://discord.gg/MajXduM7bz
              </code>
              <button
                onClick={() => handleCopy('https://discord.gg/MajXduM7bz', 'link do Discorda')}
                style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
              >
                {lang === 'pl' ? 'Kopiuj' : 'Copy'}
              </button>
            </div>
          </div>

          <a
            href="https://discord.gg/MajXduM7bz"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', height: '36px', textDecoration: 'none' }}
          >
            <span>{lang === 'pl' ? 'Przejdź do Discorda' : 'Open Discord Invite'}</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Karta GitHub / Autor */}
        <div
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-primary)',
            borderRadius: '10px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-primary)' }}>
                  <GithubIcon size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0 }}>
                    maciexw2
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Lead Architect & Core Developer
                  </span>
                </div>
              </div>
              <span className="badge" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd', fontSize: '11px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                CREATOR
              </span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {lang === 'pl'
                ? 'Twórca i główny programista panelu JustAdminPanel oraz ekosystemu JustServices. Zobacz inne projekty open-source, skrypty NUI i narzędzia serwerowe na profilu GitHub.'
                : 'Creator and lead developer behind JustAdminPanel and the JustServices ecosystem. Explore additional open-source repositories, NUI systems, and tools on GitHub.'}
            </p>

            <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <code style={{ fontSize: '12px', color: '#e4e4e7', fontFamily: 'var(--font-mono, monospace)' }}>
                https://github.com/maciexw2
              </code>
              <button
                onClick={() => handleCopy('https://github.com/maciexw2', 'link do GitHuba')}
                style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
              >
                {lang === 'pl' ? 'Kopiuj' : 'Copy'}
              </button>
            </div>
          </div>

          <a
            href="https://github.com/maciexw2"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', height: '36px', textDecoration: 'none' }}
          >
            <GithubIcon size={14} color="var(--text-secondary)" />
            <span>{lang === 'pl' ? 'Odwiedź profil GitHub' : 'View GitHub Profile'}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Credits & Tech Stack */}
      <div
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-primary)',
          borderRadius: '10px',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldCheck size={18} color="var(--brand-purple)" />
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', margin: 0 }}>
            {lang === 'pl' ? 'Credits & Architektura Systemu' : 'Credits & Architecture Stack'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Code2 size={15} color="#60a5fa" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Author & Lead Dev</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Projekt stworzony i rozwijany przez <strong>maciexw2</strong>.
            </p>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Cpu size={15} color="#34d399" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>FiveM Native Bridge</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Dedykowany skrypt Lua <code>just_admin</code> z HTTP API i mechanizmem hooków <code>bridge.lua</code>.
            </p>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Terminal size={15} color="#fbbf24" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Frontend Architecture</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Next.js 16 + React 19 + Turbopack z ciemnym motywem Tailwind/CSS Variables.
            </p>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Zap size={15} color="#ec4899" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Framework Agnostic</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Pełne wsparcie dla silników ESX Legacy, QBCore, QBox oraz serwerów Standalone.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>JustAdminPanel v2.4.0 • Licencja dla serwerów FiveM</span>
          </div>

          <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
            <a
              href="https://discord.gg/MajXduM7bz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#a78bfa', textDecoration: 'none' }}
            >
              Discord Community
            </a>
            <span style={{ color: 'var(--border-primary)' }}>•</span>
            <a
              href="https://github.com/maciexw2"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#a78bfa', textDecoration: 'none' }}
            >
              GitHub / maciexw2
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
