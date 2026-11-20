import React, { useMemo } from 'react'
import { SlidersHorizontal, RotateCcw, Filter } from 'lucide-react'
import { getUniqueValues } from '../utils/dataTransforms'

export default function FilterSidebar({ categoricalCols = [], rows = [], filters = {}, onFilterChange }) {
    const cols = categoricalCols.slice(0, 5)

    const uniqueValuesMap = useMemo(() => {
        const map = {}
        cols.forEach(col => {
            map[col] = getUniqueValues(rows, col, 80)
        })
        return map
    }, [rows, cols.join(',')])

    const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length

    function handleReset() {
        const cleared = {}
        cols.forEach(c => { cleared[c] = '' })
        onFilterChange(cleared)
    }

    if (cols.length === 0) return null

    return (
        <aside className="filter-sidebar">
            {/* Brand Yellow Header */}
            <div className="filter-sidebar__header">
                <div className="flex items-center gap-2 mb-1">
                    <SlidersHorizontal size={14} strokeWidth={2.5} style={{ color: '#1C1917' }} />
                    <span className="filter-sidebar__title">Filters</span>
                    {activeFilterCount > 0 && (
                        <span style={{
                            background: '#1C1917', color: '#FFC107', fontSize: '0.6rem',
                            fontWeight: 700, borderRadius: 99, padding: '1px 6px', marginLeft: 'auto'
                        }}>
                            {activeFilterCount} active
                        </span>
                    )}
                </div>
                <p className="filter-sidebar__subtitle">Drill into your data</p>
            </div>

            {/* Filter Groups */}
            <div className="filter-sidebar__body">
                {cols.map(col => {
                    const vals = uniqueValuesMap[col] || []
                    const currentVal = filters[col] || ''
                    return (
                        <div key={col}>
                            <div className="filter-group__label">
                                <Filter size={8} strokeWidth={3} />
                                {col}
                            </div>
                            <select
                                className="filter-group__select"
                                value={currentVal}
                                onChange={e => onFilterChange({ ...filters, [col]: e.target.value })}
                            >
                                <option value="">— All —</option>
                                {vals.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    )
                })}

                {/* Reset */}
                {activeFilterCount > 0 && (
                    <button className="filter-reset-btn" onClick={handleReset}>
                        <RotateCcw size={10} style={{ display: 'inline', marginRight: 4 }} strokeWidth={2.5} />
                        Reset All Filters
                    </button>
                )}
            </div>
        </aside>
    )
}
