'use client';

import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function LoginScreen({ onLogin }) {
  const { lang, setLang } = useLanguage();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const text = {
    pl: {
      subtitle: 'Panel zarządzania serwerem FiveM (FXServer)',
      userLabel: 'Nazwa administratora',
      passLabel: 'Hasło lub Master Token',
      remember: 'Zapamiętaj mnie',
      signIn: 'Zaloguj się do panelu',
      signingIn: 'Logowanie...',
      orDivider: 'lub użyj szybkiej autoryzacji',
      discordSignIn: 'Zaloguj automatycznie przez Discord',
      discordLoading: 'Łączenie z Discordem...',
      quickHint: 'Domyślne: admin / admin'
    },
    en: {
      subtitle: 'FiveM FXServer administration web panel',
      userLabel: 'Administrator username',
      passLabel: 'Password or Master Token',
      remember: 'Remember me',
      signIn: 'Sign in to panel',
      signingIn: 'Signing in...',
      orDivider: 'or use instant authorization',
      discordSignIn: 'Sign in automatically with Discord',
      discordLoading: 'Connecting with Discord...',
      quickHint: 'Default: admin / admin'
    }
  }[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.ok) {
        if (rememberMe) {
          localStorage.setItem('just_admin_user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('just_admin_user', JSON.stringify(data.user));
        }
        onLogin(data.user);
      } else {
        setErrorMsg(data.message || (lang === 'pl' ? 'Błędne dane logowania' : 'Invalid credentials'));
      }
    } catch {
      setErrorMsg(lang === 'pl' ? 'Błąd połączenia z serwerem' : 'Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    setIsDiscordLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto: true })
      });
      const data = await res.json();

      if (data.ok) {
        if (rememberMe) {
          localStorage.setItem('just_admin_user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('just_admin_user', JSON.stringify(data.user));
        }
        onLogin(data.user);
      } else {
        setErrorMsg(data.message || 'Nie znaleziono administratora powiązanego z Discordem');
      }
    } catch {
      setErrorMsg('Błąd połączenia z autoryzacją Discord');
    } finally {
      setIsDiscordLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--surface-base)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--brand-purple-glow) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 75%)',
        filter: 'blur(60px)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Przelacznik jezyka w rogu */}
      <div className="anim-slide-down" style={{ position: 'absolute', top: '24px', right: '28px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button
          type="button"
          onClick={() => setLang('pl')}
          style={{
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '5px',
            border: lang === 'pl' ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
            backgroundColor: lang === 'pl' ? 'rgba(124, 58, 237, 0.18)' : 'var(--surface-panel)',
            color: lang === 'pl' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🇵🇱 PL
        </button>
        <button
          type="button"
          onClick={() => setLang('en')}
          style={{
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '5px',
            border: lang === 'en' ? '1px solid var(--brand-purple)' : '1px solid var(--border-primary)',
            backgroundColor: lang === 'en' ? 'rgba(124, 58, 237, 0.18)' : 'var(--surface-panel)',
            color: lang === 'en' ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🇬🇧 EN
        </button>
      </div>

      <div
        className="anim-scale-pop"
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-primary)',
          borderRadius: '12px',
          padding: '38px 32px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px -8px var(--brand-purple-glow)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo i naglowek */}
        <div className="anim-slide-down delay-1" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(124, 58, 237, 0.18)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            marginBottom: '14px',
            boxShadow: '0 4px 14px var(--brand-purple-glow)'
          }}>
            <Shield size={26} color="var(--brand-purple)" />
          </div>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Just AdminPanel
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {text.subtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="anim-slide-down" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--status-danger)',
            fontSize: '12px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="anim-slide-up delay-2">
          <button
            type="button"
            onClick={handleDiscordLogin}
            disabled={isDiscordLoading}
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '6px',
              backgroundColor: '#5865F2',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(88, 101, 242, 0.3)',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <svg width="20" height="15" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.1 4.9C55.5 2.8 50.6 1.2 45.4 0.3C45.3 0.3 45.1 0.4 45.1 0.6C44.4 1.8 43.6 3.4 43.1 4.7C37.5 3.9 31.9 3.9 26.4 4.7C25.8 3.4 25.1 1.8 24.3 0.6C24.3 0.4 24.1 0.3 24 0.3C18.8 1.2 13.9 2.8 9.3 4.9C9.2 4.9 9.1 5 9.1 5.2C-0.2 18.9 -2.3 32.2 1 45.4C1 45.6 1.1 45.7 1.3 45.8C7.4 50.3 13.3 53 19.1 54.8C19.3 54.9 19.5 54.8 19.6 54.6C21 52.7 22.2 50.7 23.3 48.6C23.4 48.4 23.3 48.1 23.1 48C21.1 47.2 19.3 46.3 17.5 45.1C17.3 45 17.3 44.7 17.4 44.5C17.8 44.2 18.2 43.9 18.5 43.6C18.6 43.5 18.8 43.5 18.9 43.5C30.4 48.8 42.8 48.8 54.1 43.5C54.2 43.5 54.4 43.5 54.5 43.6C54.9 43.9 55.3 44.2 55.6 44.5C55.8 44.7 55.8 45 55.6 45.1C53.8 46.3 51.9 47.3 50 48C49.8 48.1 49.7 48.4 49.8 48.6C50.9 50.7 52.2 52.7 53.5 54.6C53.6 54.8 53.8 54.9 54 54.8C59.9 53 65.8 50.3 71.8 45.8C72 45.7 72 45.6 72.1 45.4C74.6 28.3 67.9 15.3 60.3 5.2C60.3 5.1 60.2 4.9 60.1 4.9ZM23.8 37.3C20.3 37.3 17.4 34.1 17.4 30.2C17.4 26.3 20.2 23.1 23.8 23.1C27.4 23.1 30.3 26.3 30.2 30.2C30.2 34.1 27.4 37.3 23.8 37.3ZM47.4 37.3C43.9 37.3 41 34.1 41 30.2C41 26.3 43.8 23.1 47.4 23.1C51 23.1 53.9 26.3 53.8 30.2C53.8 34.1 51 37.3 47.4 37.3Z" fill="currentColor"/>
            </svg>
            <span>{isDiscordLoading ? text.discordLoading : text.discordSignIn}</span>
          </button>
        </div>

        <div className="anim-slide-up delay-2" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {text.orDivider}
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        <form onSubmit={handleSubmit} className="anim-slide-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {text.userLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  padding: '10px 12px 10px 36px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {text.passLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '6px',
                  padding: '10px 38px 10px 36px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--brand-purple)' }}
              />
              <span>{text.remember}</span>
            </label>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {text.quickHint}
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              height: '42px',
              marginTop: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>{isLoading ? text.signingIn : text.signIn}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
