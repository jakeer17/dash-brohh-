import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Legend
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="tooltip-custom px-3 py-2.5 min-w-[140px]">
            <p className="text-xs text-slate-400 mb-1.5 truncate">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-slate-300 text-xs">{p.name}:</span>
                    <span className="text-slate-100 text-xs font-semibold ml-auto pl-3">
                        {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function StackedBarChart({ data, xKey, yKeys = [], palette = [], showGridlines = true, showLabels = false }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }} barCategoryGap="30%">
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />}
                <XAxis
                    dataKey={xKey}
                    stroke="transparent"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => v && v.length > 10 ? v.slice(0, 10) + '…' : v}
                    interval={0}
                />
                <YAxis
                    stroke="transparent"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                {yKeys.map((key, i) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        stackId="s"
                        fill={palette[i % palette.length] || '#06b6d4'}
                        radius={i === yKeys.length - 1 ? [3, 3, 0, 0] : 0}
                        label={showLabels ? { position: 'top', fontSize: 10, fill: '#94a3b8' } : false}
                        isAnimationActive
                        animationDuration={700}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    )
}
