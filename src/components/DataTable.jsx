import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 25

const TYPE_BADGE = {
  number: { label: '№', color: '#06b6d4' },
  date: { label: '📅', color: '#34d399' },
  string: { label: 'Aa', color: '#a78bfa' },
  boolean: { label: '?', color: '#fb923c' },
}

export default function DataTable({ rows, columns, types }) {
  const [q, setQ] = useState('')
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (!q.trim()) return rows
    const low = q.toLowerCase()
    return rows.filter(r => columns.some(c => (r[c] ?? '').toString().toLowerCase().includes(low)))
  }, [q, rows, columns])

  const sorted = useMemo(() => {
    if (!sortCol) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol]
      if (av === null) return 1
      if (bv === null) return -1
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortCol, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageRows = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(0)
  }

  function onSearch(v) { setQ(v); setPage(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card p-5 mt-4"
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search all columns…"
            className="input-search"
          />
        </div>
        <div className="text-xs text-slate-500 shrink-0">
          {filtered.length.toLocaleString()} / {rows.length.toLocaleString()} rows
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr>
              {columns.map(col => {
                const badge = TYPE_BADGE[types?.[col]] || null
                const isActive = sortCol === col
                return (
                  <th
                    key={col}
                    onClick={() => toggleSort(col)}
                    className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: isActive ? 'rgba(6,182,212,0.05)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {badge && (
                        <span className="text-[10px] font-mono opacity-60" style={{ color: badge.color }}>
                          {badge.label}
                        </span>
                      )}
                      {col}
                      {isActive
                        ? sortDir === 'asc'
                          ? <ChevronUp size={11} className="text-cyan-400" />
                          : <ChevronDown size={11} className="text-cyan-400" />
                        : <ChevronDown size={11} className="opacity-0 group-hover:opacity-30" />
                      }
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, idx) => (
              <tr key={idx} className="group transition-colors hover:bg-white/[0.025]">
                {columns.map(c => (
                  <td key={c} className="py-2.5 px-3 text-slate-300 text-xs whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {r[c] === null || r[c] === undefined
                      ? <span className="text-slate-700 italic">null</span>
                      : typeof r[c] === 'boolean'
                        ? <span className={r[c] ? 'text-emerald-400' : 'text-rose-400'}>{String(r[c])}</span>
                        : String(r[c])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-slate-500">Page {safePage + 1} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(0)} disabled={safePage === 0} className="btn-secondary py-1 px-1.5 disabled:opacity-30"><ChevronsLeft size={13} /></button>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0} className="btn-secondary py-1 px-1.5 disabled:opacity-30"><ChevronLeft size={13} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1} className="btn-secondary py-1 px-1.5 disabled:opacity-30"><ChevronRight size={13} /></button>
            <button onClick={() => setPage(totalPages - 1)} disabled={safePage >= totalPages - 1} className="btn-secondary py-1 px-1.5 disabled:opacity-30"><ChevronsRight size={13} /></button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
