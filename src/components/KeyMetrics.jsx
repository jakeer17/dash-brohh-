import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Hash, TrendingUp, TrendingDown, BarChart2, Activity, Sigma } from 'lucide-react'

const ICONS = [Hash, TrendingUp, Sigma, BarChart2, Activity, TrendingDown]
const ACCENTS = [
  { from: '#06b6d4', to: '#0ea5e9' },
  { from: '#34d399', to: '#10b981' },
  { from: '#a78bfa', to: '#8b5cf6' },
  { from: '#f472b6', to: '#ec4899' },
  { from: '#fb923c', to: '#f97316' },
  { from: '#facc15', to: '#eab308' },
]

function fmt(n) {
  if (n === null || n === undefined) return '—'
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function MetricCard({ label, value, sub, Icon, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      className="card-metric"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide leading-tight max-w-[70%] truncate">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}22)` }}>
          <Icon size={16} style={{ color: accent.from }} strokeWidth={2} />
        </div>
      </div>

      <motion.div
        className="text-3xl font-bold text-slate-100 leading-none mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.07 + 0.15 }}
      >
        {value}
      </motion.div>

      {sub && (
        <p className="text-xs text-slate-500">{sub}</p>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-[14px] opacity-60"
        style={{ background: `linear-gradient(90deg, ${accent.from}, transparent)` }} />
    </motion.div>
  )
}

export default function KeyMetrics({ rows, types, stats, numericCols }) {
  if (!rows) return null
  const total = rows.length

  const cards = useMemo(() => {
    const items = [{
      label: 'Total Rows',
      value: fmt(total),
      sub: `${Object.keys(types).filter(c => types[c] !== 'empty').length} active columns`,
      iconIdx: 0
    }]

    numericCols.slice(0, 5).forEach((col, i) => {
      const s = stats[col]
      if (!s) return
      items.push({
        label: col,
        value: fmt(s.sum),
        sub: `Avg: ${fmt(s.avg)}  ·  Min: ${fmt(s.min)}  ·  Max: ${fmt(s.max)}`,
        iconIdx: i + 1
      })
    })
    return items
  }, [rows, numericCols, stats, total, types])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
      {cards.map((c, i) => {
        const Icon = ICONS[c.iconIdx % ICONS.length]
        const accent = ACCENTS[c.iconIdx % ACCENTS.length]
        return <MetricCard key={c.label} label={c.label} value={c.value} sub={c.sub} Icon={Icon} accent={accent} index={i} />
      })}
    </div>
  )
}
