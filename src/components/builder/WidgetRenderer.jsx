import React, { useMemo } from 'react'
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell
} from 'recharts'
import { PieChart, Pie } from 'recharts'
import StackedBarChart from '../charts/StackedBarChart'
import ScatterPlot from '../charts/ScatterPlot'
import DataTable from '../DataTable'
import {
    buildTrend, buildDist, buildPieData, buildScatter, buildStackedDist, applyFilter
} from '../../utils/dataTransforms'
import { PALETTES } from '../../store/useDashboardStore'

function KpiCard({ widget, data, filterValue }) {
    const { colY, colX, title, color, palette } = widget
    const { rows, numericCols = [], categoricalCols = [] } = data
    const accentColor = color || (PALETTES[palette] || PALETTES.ocean)[0]

    const filteredRows = useMemo(() => filterValue ? applyFilter(rows, filterValue) : rows, [rows, filterValue])

    const resolvedY = colY || numericCols[0] || null
    const values = useMemo(() => {
        if (!resolvedY) return []
        return filteredRows.map(r => Number(r[resolvedY])).filter(v => !isNaN(v))
    }, [filteredRows, resolvedY])

    const total = values.reduce((a, b) => a + b, 0)
    const avg = values.length ? total / values.length : 0
    const count = filteredRows.length

    const fmt = v => v >= 1_000_000
        ? (v / 1_000_000).toFixed(1) + 'M'
        : v >= 1_000
            ? (v / 1_000).toFixed(1) + 'K'
            : v.toLocaleString(undefined, { maximumFractionDigits: 2 })

    return (
        <div className="kpi-card" style={{ '--kpi-accent': accentColor }}>
            <div className="kpi-card__accent" />
            <p className="kpi-card__label">{title || resolvedY || 'KPI'}</p>
            <p className="kpi-card__value">{resolvedY ? fmt(total) : count.toLocaleString()}</p>
            <div className="kpi-card__meta">
                {resolvedY && <span>Avg {fmt(avg)}</span>}
                <span>{count.toLocaleString()} rows</span>
            </div>
        </div>
    )
}

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null
    return (
        <div className="tooltip-custom px-3 py-2 min-w-[120px]">
            <p className="text-xs text-slate-400 mb-1 truncate max-w-[160px]">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color || p.fill }} />
                    <span className="text-slate-100 text-xs font-semibold ml-auto">
                        {typeof p.value === 'number' ? p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

const AXIS_PROPS = {
    stroke: 'transparent',
    tick: { fill: '#475569', fontSize: 11 },
    tickLine: false,
    axisLine: false,
}

function BarViz({ data, colX, colY, palette, color: colorOverride, showGridlines, showLabels, onBarClick }) {
    const colors = colorOverride
        ? Array(data.length).fill(colorOverride)
        : (PALETTES[palette] || PALETTES.ocean)
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }} barCategoryGap="30%">
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />}
                <XAxis dataKey="key" {...AXIS_PROPS} tickFormatter={v => v?.length > 10 ? v.slice(0, 10) + '…' : v} interval={0} />
                <YAxis {...AXIS_PROPS} width={40} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700}
                    label={showLabels ? { position: 'top', fontSize: 10, fill: '#6B7280' } : false}
                    onClick={(entry) => onBarClick?.(entry)}
                >
                    {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.88} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

function LineViz({ data, colY, palette, color: colorOverride, showGridlines }) {
    const color = colorOverride || (PALETTES[palette] || PALETTES.ocean)[0]
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />}
                <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={v => v?.slice(0, 10)} interval="preserveStartEnd" />
                <YAxis {...AXIS_PROPS} width={40} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.08)', strokeWidth: 1 }} />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false}
                    activeDot={{ r: 4, fill: color, strokeWidth: 0 }} isAnimationActive animationDuration={800} />
            </LineChart>
        </ResponsiveContainer>
    )
}

function AreaViz({ data, palette, color: colorOverride, showGridlines }) {
    const color = colorOverride || (PALETTES[palette] || PALETTES.ocean)[0]
    const gradId = `areaGrad_${palette}_${colorOverride || ''}`
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                {showGridlines && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />}
                <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={v => v?.slice(0, 10)} interval="preserveStartEnd" />
                <YAxis {...AXIS_PROPS} width={40} tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: `${color}55`, strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradId})`}
                    dot={false} activeDot={{ r: 4, fill: color, strokeWidth: 0 }} isAnimationActive animationDuration={800} />
            </AreaChart>
        </ResponsiveContainer>
    )
}

function PieViz({ data, palette, mode = 'pie', showLabels, onSliceClick }) {
    const colors = PALETTES[palette] || PALETTES.ocean
    const innerRadius = mode === 'donut' ? '55%' : 0
    const RADIAN = Math.PI / 180
    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
        if (!showLabels || percent < 0.04) return null
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
        return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} opacity={0.8}>{`${(percent * 100).toFixed(0)}%`}</text>
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={innerRadius} outerRadius="70%"
                    labelLine={false} label={showLabels ? renderLabel : false}
                    isAnimationActive animationDuration={700}
                    onClick={(entry) => onSliceClick?.(entry)}
                >
                    {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.9} stroke="transparent" />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            </PieChart>
        </ResponsiveContainer>
    )
}

// ─── Main WidgetRenderer ──────────────────────────────────────────────────────
export default function WidgetRenderer({ widget, data, filterValue, onCrossFilter }) {
    const { vizType, colX, colY, colY2, palette, color, showLabels, showGridlines } = widget
    const { rows, columns, types, numericCols = [], dateCols = [], categoricalCols = [] } = data

    const resolvedColX = colX || categoricalCols[0] || dateCols[0] || columns[0]
    const resolvedColY = colY || numericCols[0] || null

    const chartData = useMemo(() => {
        if (vizType === 'table') return null
        if (vizType === 'line' || vizType === 'area') {
            const dateC = dateCols.includes(resolvedColX) ? resolvedColX : dateCols[0]
            const numC = numericCols.includes(resolvedColX) ? resolvedColX : (resolvedColY || numericCols[0])
            if (!dateC || !numC) return []
            return buildTrend(rows, dateC, numC, filterValue)
        }
        if (vizType === 'pie' || vizType === 'donut') {
            const catC = resolvedColX || categoricalCols[0]
            if (!catC) return []
            return buildPieData(rows, catC, resolvedColY, filterValue)
        }
        if (vizType === 'scatter') {
            const xC = numericCols.includes(resolvedColX) ? resolvedColX : numericCols[0]
            const yC = numericCols.includes(resolvedColY) ? resolvedColY : numericCols[1]
            if (!xC || !yC) return []
            return buildScatter(rows, xC, yC, categoricalCols[0], filterValue)
        }
        if (vizType === 'stacked-bar') {
            const catC = categoricalCols.includes(resolvedColX) ? resolvedColX : categoricalCols[0]
            const stackCols = colY2 && colY2.length > 0 ? colY2 : numericCols.slice(0, 3)
            if (!catC || !stackCols.length) return []
            return buildStackedDist(rows, catC, stackCols, filterValue)
        }
        // default: bar (distribution)
        const catC = resolvedColX || categoricalCols[0]
        if (!catC) return []
        return buildDist(rows, catC, filterValue)
    }, [vizType, resolvedColX, resolvedColY, rows, filterValue, numericCols, dateCols, categoricalCols, colY2])

    const colors = PALETTES[palette] || PALETTES.ocean

    if (vizType === 'table') {
        const filteredRows = filterValue ? applyFilter(rows, filterValue) : rows
        return <DataTable rows={filteredRows} columns={columns} types={types} compact />
    }

    if (vizType === 'kpi') {
        return <KpiCard widget={widget} data={data} filterValue={filterValue} />
    }

    if (!chartData || chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-600 text-sm flex-col gap-2">
                <span className="text-2xl opacity-40">📊</span>
                <span>No data for this visualization</span>
                <span className="text-xs opacity-60">Select different columns in the sidebar</span>
            </div>
        )
    }

    if (vizType === 'line') return <LineViz data={chartData} palette={palette} color={color} showGridlines={showGridlines} />
    if (vizType === 'area') return <AreaViz data={chartData} palette={palette} color={color} showGridlines={showGridlines} />
    if (vizType === 'pie') return <PieViz data={chartData} palette={palette} color={color} mode="pie" showLabels={showLabels} onSliceClick={e => onCrossFilter?.({ col: resolvedColX, val: e.name })} />
    if (vizType === 'donut') return <PieViz data={chartData} palette={palette} color={color} mode="donut" showLabels={showLabels} onSliceClick={e => onCrossFilter?.({ col: resolvedColX, val: e.name })} />
    if (vizType === 'scatter') return <ScatterPlot data={chartData} xLabel={colX || 'X'} yLabel={colY || 'Y'} palette={colors} showGridlines={showGridlines} />
    if (vizType === 'stacked-bar') {
        const stackCols = widget.colY2?.length ? widget.colY2 : numericCols.slice(0, 3)
        return <StackedBarChart data={chartData} xKey="key" yKeys={stackCols} palette={colors} showGridlines={showGridlines} showLabels={showLabels} />
    }
    // bar / column
    return <BarViz data={chartData} palette={palette} color={color} showGridlines={showGridlines} showLabels={showLabels}
        onBarClick={e => onCrossFilter?.({ col: resolvedColX, val: e.key })} />
}
