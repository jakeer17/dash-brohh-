import React from 'react'
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis,
    Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const d = payload[0]?.payload
    return (
        <div className="tooltip-custom px-3 py-2.5 min-w-[120px]">
            {d?.label && <p className="text-xs text-slate-400 mb-1 truncate">{d.label}</p>}
            <div className="flex flex-col gap-1">
                <span className="text-slate-300 text-xs">X: <span className="text-slate-100 font-semibold">{d?.x?.toLocaleString()}</span></span>
                <span className="text-slate-300 text-xs">Y: <span className="text-slate-100 font-semibold">{d?.y?.toLocaleString()}</span></span>
            </div>
        </div>
    )
}

export default function ScatterPlot({ data, xLabel = 'X', yLabel = 'Y', palette = [], showGridlines = true }) {
    const color = palette[0] || '#06b6d4'
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />}
                <XAxis
                    dataKey="x"
                    type="number"
                    name={xLabel}
                    stroke="transparent"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v}
                    label={{ value: xLabel, position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 11 }}
                />
                <YAxis
                    dataKey="y"
                    type="number"
                    name={yLabel}
                    stroke="transparent"
                    tick={{ fill: '#475569', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v}
                />
                <ZAxis range={[30, 30]} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.08)' }} />
                <Scatter
                    data={data}
                    fill={color}
                    fillOpacity={0.7}
                    isAnimationActive
                    animationDuration={600}
                />
            </ScatterChart>
        </ResponsiveContainer>
    )
}
