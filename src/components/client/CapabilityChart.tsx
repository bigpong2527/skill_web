'use client';

import React from 'react';

interface Props {
  breakdown: Record<string, number> | string | null | undefined;
  primaryDomain?: string | null;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const safeEndAngle = endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;
  const start = polarToCartesian(x, y, radius, safeEndAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = safeEndAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function CapabilityChart({ breakdown, primaryDomain }: Props) {
  // 🚨 此时 breakdown 在 db.ts 已经被处理为 Object。如果不是有效对象，直接不渲染
  if (!breakdown || typeof breakdown !== 'object') return null;

  const rawItems = Object.entries(breakdown)
    .map(([name, val]) => ({ name: name.trim(), pct: Number(val) || 0 }))
    .filter((item) => item.pct > 0 && item.name)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  if (rawItems.length === 0) return null;

  const totalPct = rawItems.reduce((acc, cur) => acc + cur.pct, 0);

  const CX = 230;
  const CY = 115;
  const RADIUS = 64;
  const STROKE_WIDTH = 14;

  let currentAngle = 0;
  const slices = rawItems.map((item, idx) => {
    const angleSpan = (item.pct / totalPct) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    const midAngle = startAngle + angleSpan / 2;
    currentAngle = endAngle;

    const pathD = describeArc(CX, CY, RADIUS, startAngle, endAngle);
    const sliceColor = COLORS[idx % COLORS.length];

    const p1 = polarToCartesian(CX, CY, RADIUS + 8, midAngle);
    const isRight = midAngle >= 0 && midAngle < 180;
    const verticalOffset = Math.sin(((midAngle - 90) * Math.PI) / 180) * 16;
    const p2 = { x: isRight ? p1.x + 16 : p1.x - 16, y: p1.y + verticalOffset };
    const p3 = { x: isRight ? p2.x + 16 : p2.x - 16, y: p2.y };

    return { ...item, pathD, color: sliceColor, p1, p2, p3, isRight };
  });

  return (
    <div className="w-full flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/30 border border-slate-200/60 dark:border-white/5 transition-all">
      <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 self-start pl-1">
        Skills Distribution
      </div>

      <svg viewBox="0 0 460 230" className="w-full max-w-[430px] h-auto overflow-visible select-none">
        <circle cx={CX} cy={CY} r={RADIUS - STROKE_WIDTH / 2 - 4} className="fill-white dark:fill-[#0B1121]" />
        <text x={CX} y={CY - 4} textAnchor="middle" className="text-[9px] font-mono fill-slate-400 uppercase tracking-widest">
          Domain
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" className="text-[11px] font-mono font-bold fill-blue-600 dark:fill-blue-400">
          {primaryDomain ? (primaryDomain.length > 14 ? `${primaryDomain.slice(0, 12)}...` : primaryDomain) : 'Ecosystem'}
        </text>

        {slices.map((slice, idx) => (
          <g key={idx}>
            <path d={slice.pathD} fill="none" stroke={slice.color} strokeWidth={STROKE_WIDTH} strokeLinecap="round" className="transition-all duration-300 hover:opacity-85" />
            <polyline points={`${slice.p1.x},${slice.p1.y} ${slice.p2.x},${slice.p2.y} ${slice.p3.x},${slice.p3.y}`} fill="none" stroke={slice.color} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.85" />
            <circle cx={slice.p1.x} cy={slice.p1.y} r="2" fill={slice.color} />
            <text x={slice.isRight ? slice.p3.x + 4 : slice.p3.x - 4} y={slice.p3.y + 3} textAnchor={slice.isRight ? 'start' : 'end'} className="text-[11px] font-mono font-bold fill-slate-800 dark:fill-slate-200">
              {slice.name.length > 20 ? `${slice.name.slice(0, 18)}..` : slice.name} ({slice.pct}%)
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
