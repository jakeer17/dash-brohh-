import React from 'react'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Area, AreaChart
} from 'recharts'

const CHART_GREEN = '#10B981'
const CHART_GREEN_LIGHT = 'rgba(16,185,129,0.12)'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1F2937', border: '1px solid #374151', borderRadius: 8,
      padding: '8px 12px', fontSize: '0.78rem', color: '#F9FAFB',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <p style={{ color: '#9CA3AF', marginBottom: 4, fontSize: '0.7rem' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || CHART_GREEN, flexShrink: 0 }} />
          <span style={{ color: '#F9FAFB', fontWeight: 600 }}>
            {typeof p.value === 'number' ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function formatTick(val) {
  if (typeof val !== 'string') return val
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0, 10)
  return val.length > 12 ? val.slice(0, 10) + '…' : val
}

export default function TrendLineChart({ data, xKey, yKey, title, hideHeader }) {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 12, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_GREEN} stopOpacity={0.2} />
              <stop offset="100%" stopColor={CHART_GREEN} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey={xKey}
            stroke="transparent"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            tickFormatter={formatTick}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="transparent"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={CHART_GREEN}
            strokeWidth={2.5}
            fill="url(#gradGreen)"
            dot={false}
            activeDot={{ r: 5, fill: CHART_GREEN, strokeWidth: 2, stroke: '#fff' }}
            isAnimationActive
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
