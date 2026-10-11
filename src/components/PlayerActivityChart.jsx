'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function PlayerActivityChart({ data = [], nowCount = 0 }) {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // wymiary svg
  const width = 800;
  const height = 240;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxPlayers = 130;

  const safeData = data && data.length > 0 ? data : [
    { time: '00:00', players: 0 },
    { time: '06:00', players: 0 },
    { time: '12:00', players: 0 },
    { time: '18:00', players: 0 },
    { time: 'Now', players: nowCount, isCurrent: true }
  ];

  // oblicz kordynaty
  const points = safeData.map((d, i) => {
    const x = padLeft + (i / Math.max(1, safeData.length - 1)) * chartW;
    const y = padTop + chartH - (d.players / maxPlayers) * chartH;
    return { ...d, x, y };
  });

  // generuj sciezke beziera dla svg
  const generateSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  const peakPoint = points.find((p) => p.isPeak) || points[points.length - 3];
  const nowPoint = points[points.length - 1];

  const yTicks = [120, 80, 40, 0];
  const xLabels = [
    { label: '00:00', x: points[0]?.x },
    { label: '04:00', x: points[2]?.x },
    { label: '08:00', x: points[4]?.x },
    { label: '12:00', x: points[6]?.x },
    { label: '16:00', x: points[8]?.x },
    { label: `21:00 (${t.chart.peak})`, x: peakPoint?.x, isHighlight: true },
    { label: `${t.chart.liveNow} (${nowCount})`, x: nowPoint?.x, isCurrent: true }
  ];

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="panel-card anim-slide-left delay-2" style={{ padding: '20px 22px', flex: '1 1 58%', minWidth: '480px' }}>
      {/* gorny naglowek */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
              {t.chart.title}
            </h2>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: 'var(--border-primary)',
              color: 'var(--text-secondary)'
            }}>
              24H
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {t.chart.subtitle}
          </p>
        </div>

        {/* podsumowanie statystyk w prawym gornym rogu */}
        <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.chart.liveNow.toUpperCase()}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }} className="num-tabular">
              {nowCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.chart.peak.toUpperCase()}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#c4b5fd' }} className="num-tabular">
              118 <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)' }}>(21:00)</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.chart.average.toUpperCase()}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }} className="num-tabular">
              54
            </div>
          </div>
        </div>
      </div>

      {/* interaktywny wykres svg */}
      <div style={{ position: 'relative', width: '100%', height: '230px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.32" />
              <stop offset="85%" stopColor="#7c3aed" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* linie siadki i os y */}
          {yTicks.map((val) => {
            const yPos = padTop + chartH - (val / maxPlayers) * chartH;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={width - padRight}
                  y2={yPos}
                  stroke="var(--border-subtle)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 12}
                  y={yPos + 4}
                  fill="var(--text-muted)"
                  fontSize="11"
                  textAnchor="end"
                  className="num-tabular"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* wypelnienie obszaru */}
          <path d={areaPath} fill="url(#purpleGradient)" />

          {/* linia wykrsu */}
          <path
            d={linePath}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowEffect)"
          />

          {/* dymek szczytowego punktu */}
          {peakPoint && (
            <g transform={`translate(${peakPoint.x}, ${peakPoint.y})`}>
              <line x1="0" y1="0" x2="0" y2="25" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
              <circle r="4.5" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
              <g transform="translate(0, -22)">
                <rect
                  x="-42"
                  y="-12"
                  width="84"
                  height="18"
                  rx="3"
                  fill="#18181d"
                  stroke="#7c3aed"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="1"
                  fill="#fafafa"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  118 players
                </text>
              </g>
            </g>
          )}

          {/* wskaznik aktualnego stanu */}
          {nowPoint && (
            <g transform={`translate(${nowPoint.x}, ${nowPoint.y})`}>
              <circle r="4" fill="#22c55e" stroke="#141418" strokeWidth="2" />
              <circle r="7" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
            </g>
          )}

          {/* linia na najechaniu */}
          {activePoint && (
            <g transform={`translate(${activePoint.x}, 0)`}>
              <line
                x1="0"
                y1={padTop}
                x2="0"
                y2={padTop + chartH}
                stroke="#fff"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.4"
              />
              <circle
                cy={activePoint.y}
                r="5"
                fill="#fff"
                stroke="#7c3aed"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* strefy klikania myszko */}
          {points.map((pt, idx) => (
            <rect
              key={idx}
              x={pt.x - chartW / (points.length * 2)}
              y={padTop}
              width={chartW / points.length}
              height={chartH}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(idx)}
            />
          ))}

          {/* etykiety osi x */}
          {xLabels.map((lbl, i) => {
            if (lbl.x === undefined) return null;
            return (
              <text
                key={i}
                x={lbl.x}
                y={padTop + chartH + 20}
                fill={lbl.isHighlight ? '#c4b5fd' : lbl.isCurrent ? '#22c55e' : 'var(--text-muted)'}
                fontSize="11"
                fontWeight={lbl.isHighlight || lbl.isCurrent ? '600' : '400'}
                textAnchor="middle"
              >
                {lbl.label}
              </text>
            );
          })}
        </svg>

        {/* okienko tooltipa */}
        {activePoint && (
          <div style={{
            position: 'absolute',
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
            transform: 'translate(-50%, -120%)',
            backgroundColor: '#18181d',
            border: '1px solid var(--border-highlight)',
            borderRadius: '5px',
            padding: '5px 9px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            zIndex: 10
          }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{activePoint.time}</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
              {activePoint.players} players
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
