import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Light-mode palette — brand + harmonious companions
const PALETTE = [
    '#10B981', '#FFC107', '#3B82F6', '#8B5CF6',
    '#EF4444', '#F97316', '#14B8A6', '#EC4899'
]

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const p = payload[0]
    return (
        <div style={{
            background: '#1F2937', border: '1px solid #374151', borderRadius: 8,
            padding: '8px 12px', fontSize: '0.78rem', color: '#F9FAFB',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.payload.fill, flexShrink: 0 }} />
                <span style={{ color: '#D1D5DB', fontSize: '0.7rem', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                <span style={{ color: '#F9FAFB', fontWeight: 700, marginLeft: 8 }}>
                    {typeof p.value === 'number' ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.value}
                </span>
                {p.payload.pct && (
                    <span style={{ color: '#9CA3AF', fontSize: '0.68rem' }}>({p.payload.pct}%)</span>
                )}
            </div>
        </div>
    )
}

export default function PieDonutChart({ data, title, hideHeader }) {
    // data is expected to be [{name, value}]
    const total = useMemo(() => data.reduce((s, d) => s + (d.value ?? d.count ?? 0), 0), [data])

    const chartData = useMemo(() => {
        const key = data[0]?.value !== undefined ? 'value' : 'count'
        const top = data.slice(0, 7)
        const rest = data.slice(7)
        const items = top.map(d => ({
            name: d.name ?? d.key,
            value: d[key] ?? 0,
            pct: total > 0 ? ((d[key] / total) * 100).toFixed(1) : '0.0'
        }))
        if (rest.length) {
            const otherVal = rest.reduce((s, d) => s + (d[key] ?? 0), 0)
            items.push({
                name: 'Other',
                value: Math.round(otherVal * 100) / 100,
                pct: total > 0 ? ((otherVal / total) * 100).toFixed(1) : '0.0'
            })
        }
        return items
    }, [data, total])

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="45%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={85}
                    paddingAngle={2}
                    isAnimationActive
                    animationDuration={700}
                >
                    {chartData.map((entry, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} opacity={0.9} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={8}
                    formatter={value => (
                        <span style={{ color: '#6B7280', fontSize: '11px', fontWeight: 500 }}>
                            {value.length > 13 ? value.slice(0, 11) + '…' : value}
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
