import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Upload, Database } from 'lucide-react'
import StatCard from './StatCard'
import FilterSidebar from './FilterSidebar'
import TrendLineChart from './charts/TrendLineChart'
import DistributionBarChart from './charts/DistributionBarChart'
import PieDonutChart from './charts/PieDonutChart'
import DataTable from './DataTable'
import DownloadButton from './DownloadButton'
import {
  calculateKPISummary,
  groupByAndAggregate,
  buildTrend,
  applyFilter,
} from '../utils/dataTransforms'

export default function Dashboard({ data, onReset }) {
  const { rows, columns, types, stats, numericCols = [], dateCols = [], categoricalCols = [] } = data

  // ── Filter state ──────────────────────────────────────────────────────
  const [filters, setFilters] = useState({})

  // Apply all active sidebar filters to get filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      for (const [col, val] of Object.entries(filters)) {
        if (val && String(r[col]) !== val) return false
      }
      return true
    })
  }, [rows, filters])

  // ── KPI Ribbon (Zone 1) ────────────────────────────────────────────────
  const kpis = useMemo(() => calculateKPISummary(data, 3), [data])

  // ── Analytic Grid (Zone 2) ────────────────────────────────────────────
  const dateCol = dateCols[0] || null
  const trendNumCol = numericCols[0] || null
  const catCol = categoricalCols[0] || null
  const catNumCol = numericCols[0] || null

  const trendData = useMemo(() => {
    if (!dateCol || !trendNumCol) return []
    return buildTrend(filteredRows, dateCol, trendNumCol)
  }, [filteredRows, dateCol, trendNumCol])

  const rankData = useMemo(() => {
    if (!catCol || !catNumCol) return []
    return groupByAndAggregate(filteredRows, catCol, catNumCol, 8, {})
  }, [filteredRows, catCol, catNumCol])

  const pieData = useMemo(() => {
    if (!catCol) return []
    return groupByAndAggregate(filteredRows, catCol, catNumCol, 8, {}).map(d => ({ name: d.key, value: d.value }))
  }, [filteredRows, catCol, catNumCol])

  const hasTrend = dateCol && trendNumCol && trendData.length > 0
  const hasRank = catCol && catNumCol && rankData.length > 0
  const hasPie = pieData.length >= 2

  return (
    <div className="dash-root">
      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <header className="dash-topbar">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <BarChart2 size={16} strokeWidth={2.5} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Auto Dash Pro</h1>
            <p className="text-[10px] text-gray-400 font-medium">
              {rows.length.toLocaleString()} rows · {columns.length} cols
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DownloadButton targetId="dash-printable" />
          {onReset && (
            <button onClick={onReset} className="btn-secondary text-xs flex items-center gap-1.5">
              <Upload size={12} /> New File
            </button>
          )}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="dash-body" id="dash-printable">
        {/* Filter Sidebar (Zone 3 – left) */}
        <FilterSidebar
          categoricalCols={categoricalCols}
          rows={rows}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Main content */}
        <main className="dash-main">

          {/* ZONE 1: KPI RIBBON */}
          {kpis.length > 0 && (
            <section>
              <p className="section-header">
                <Database size={10} strokeWidth={3} style={{ color: '#9CA3AF' }} />
                Key Performance Indicators
              </p>
              <div className="kpi-ribbon">
                {kpis.map((kpi, i) => (
                  <StatCard
                    key={kpi.label}
                    label={kpi.label}
                    sum={kpi.sum}
                    avg={kpi.avg}
                    count={kpi.count}
                    trendPct={kpi.trendPct}
                    sparkData={kpi.sparkData}
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ZONE 2: ANALYTIC GRID */}
          {(hasTrend || hasRank || hasPie) && (
            <section>
              <p className="section-header">
                <BarChart2 size={10} strokeWidth={3} style={{ color: '#9CA3AF' }} />
                Analytic Overview
              </p>
              <div className="analytic-grid">
                {/* Main: Trend Area Chart (span 2 cols) */}
                {hasTrend && (
                  <motion.div
                    className="chart-card analytic-grid--col-span-2"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className="chart-card__header">
                      <div>
                        <p className="chart-card__title">Trend over Time</p>
                        <p className="chart-card__subtitle">{trendNumCol} aggregated by {dateCol}</p>
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem 0.25rem', height: 240 }}>
                      <TrendLineChart
                        data={trendData}
                        xKey="date"
                        yKey="value"
                        title=""
                        numericCols={numericCols}
                        onColChange={() => { }}
                        hideHeader
                      />
                    </div>
                  </motion.div>
                )}

                {/* Secondary: Horizontal Bar (ranking) */}
                {hasRank && (
                  <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <div className="chart-card__header">
                      <div>
                        <p className="chart-card__title">Ranking by Category</p>
                        <p className="chart-card__subtitle">{catNumCol} grouped by {catCol}</p>
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem 0.25rem', height: 260 }}>
                      <DistributionBarChart
                        data={rankData}
                        xKey="key"
                        yKey="value"
                        title=""
                        categoricalCols={categoricalCols}
                        onColChange={() => { }}
                        horizontal
                        hideHeader
                      />
                    </div>
                  </motion.div>
                )}

                {/* Secondary: Donut Chart */}
                {hasPie && (
                  <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <div className="chart-card__header">
                      <div>
                        <p className="chart-card__title">Distribution</p>
                        <p className="chart-card__subtitle">{catCol} breakdown</p>
                      </div>
                    </div>
                    <div style={{ padding: '0.5rem', height: 260 }}>
                      <PieDonutChart
                        data={pieData}
                        title=""
                        hideHeader
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          )}

          {/* ZONE 3: DATA TABLE */}
          <section>
            <p className="section-header">
              <Database size={10} strokeWidth={3} style={{ color: '#9CA3AF' }} />
              Raw Data
              <span style={{ fontSize: '0.65rem', fontWeight: 500, color: '#9CA3AF', marginLeft: 4 }}>
                ({filteredRows.length.toLocaleString()} rows)
              </span>
            </p>
            <DataTable rows={filteredRows} columns={columns} types={types} />
          </section>
        </main>
      </div>
    </div>
  )
}
