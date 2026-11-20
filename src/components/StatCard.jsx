import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function fmt(n) {
    if (n === null || n === undefined) return '—'
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const CARD_STYLES = [
    { accent: '#10B981', gradFrom: 'rgba(16,185,129,0.15)', gradTo: 'rgba(16,185,129,0.02)', areaColor: '#10B981' },
    { accent: '#3B82F6', gradFrom: 'rgba(59,130,246,0.15)', gradTo: 'rgba(59,130,246,0.02)', areaColor: '#3B82F6' },
    { accent: '#F59E0B', gradFrom: 'rgba(245,158,11,0.15)', gradTo: 'rgba(245,158,11,0.02)', areaColor: '#F59E0B' },
    { accent: '#8B5CF6', gradFrom: 'rgba(139,92,246,0.15)', gradTo: 'rgba(139,92,246,0.02)', areaColor: '#8B5CF6' },
    { accent: '#EF4444', gradFrom: 'rgba(239,68,68,0.15)', gradTo: 'rgba(239,68,68,0.02)', areaColor: '#EF4444' },
]

export default function StatCard({ label, sum, avg, count, trendPct, sparkData, index = 0, delay = 0 }) {
    const style = CARD_STYLES[index % CARD_STYLES.length]
    const gradId = `sparkGrad${index}`

    const trendInfo = useMemo(() => {
        if (trendPct === null || trendPct === undefined) return null
        if (trendPct > 0) return { icon: TrendingUp, cls: 'stat-card__trend--up', label: `↑ ${trendPct}%` }
        if (trendPct < 0) return { icon: TrendingDown, cls: 'stat-card__trend--down', label: `↓ ${Math.abs(trendPct)}%` }
        return { icon: Minus, cls: 'stat-card__trend--neutral', label: '→ 0%' }
    }, [trendPct])

    return (
        <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + index * 0.08, duration: 0.4, ease: 'easeOut' }}
        >
            {/* Top row: label + trend */}
            <div className="flex items-start justify-between gap-2 mb-1">
                <p className="stat-card__label flex-1">{label}</p>
                {trendInfo && (
                    <span className={`stat-card__trend ${trendInfo.cls} flex-shrink-0`}>
                        <trendInfo.icon size={10} strokeWidth={2.5} />
                        {trendInfo.label}
                    </span>
                )}
            </div>

            {/* Big number */}
            <div className="stat-card__value">{fmt(sum)}</div>

            {/* Sub info */}
            <p style={{ fontSize: '0.68rem', color: '#9CA3AF', marginBottom: '0.35rem', fontWeight: 500 }}>
                Avg {fmt(avg)} · {count.toLocaleString()} rows
            </p>

            {/* Sparkline */}
            {sparkData && sparkData.length >= 3 && (
                <div className="stat-card__sparkline">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                            <defs>
                                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={style.areaColor} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={style.areaColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    return (
                                        <div style={{
                                            background: '#1F2937', border: '1px solid #374151', borderRadius: 6,
                                            padding: '4px 8px', fontSize: '0.7rem', color: '#F9FAFB'
                                        }}>
                                            {fmt(payload[0].value)}
                                        </div>
                                    )
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={style.areaColor}
                                strokeWidth={2}
                                fill={`url(#${gradId})`}
                                dot={false}
                                isAnimationActive
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Bottom accent bar */}
            <div className="stat-card__accent-bar" style={{ background: style.accent }} />
        </motion.div>
    )
}
