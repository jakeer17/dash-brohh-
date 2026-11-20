import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from 'recharts'

// Brand yellow palette for bars
const BAR_COLORS = [
  '#FFC107', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EF4444', '#EC4899', '#14B8A6', '#F97316', '#6366F1'
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1F2937', border: '1px solid #374151', borderRadius: 8,
      padding: '8px 12px', fontSize: '0.78rem', color: '#F9FAFB',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <p style={{ color: '#9CA3AF', marginBottom: 4, fontSize: '0.7rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill, flexShrink: 0 }} />
          <span style={{ color: '#F9FAFB', fontWeight: 600 }}>
            {typeof p.value === 'number' ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// horizontal prop: renders a horizontal bar chart (better for ranking)
export default function DistributionBarChart({ data, xKey, yKey, horizontal = false, hideHeader }) {
  if (!data || data.length === 0) return null

  if (horizontal) {
    // Horizontal layout: categories on Y axis, values on X axis
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="horizontal"
          data={data}
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
          <XAxis
            type="number"
            stroke="transparent"
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}
          />
          <YAxis
            dataKey={xKey}
            type="category"
            stroke="transparent"
            tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={90}
            tickFormatter={v => v && v.length > 12 ? v.slice(0, 11) + '…' : v}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey={yKey} radius={[0, 4, 4, 0]} isAnimationActive animationDuration={700}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Vertical layout (default)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke="transparent"
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => v && v.length > 10 ? v.slice(0, 9) + '…' : v}
          interval={0}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: '#9CA3AF', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey={yKey} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700}>
          {data.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
