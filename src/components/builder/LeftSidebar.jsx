import React from 'react'
import { motion } from 'framer-motion'
import { Database, Hash, Type, Calendar, Plus } from 'lucide-react'
import { makeWidget, genId } from '../../store/useDashboardStore'
import { suggestVizType } from '../../utils/dataTransforms'

const TYPE_CONFIG = {
    number: { label: 'Measure', icon: Hash, color: '#06b6d4', badge: 'M' },
    date: { label: 'Date', icon: Calendar, color: '#34d399', badge: 'D' },
    string: { label: 'Dimension', icon: Type, color: '#a78bfa', badge: 'A' },
    boolean: { label: 'Boolean', icon: Type, color: '#fb923c', badge: '?' },
}

export default function LeftSidebar({ data, dispatch }) {
    const { columns, types, numericCols = [], dateCols = [], categoricalCols = [] } = data

    const dims = columns.filter(c => types[c] === 'string' || types[c] === 'boolean' || types[c] === 'date')
    const measures = columns.filter(c => types[c] === 'number')

    function addWidget(col) {
        const colType = types[col] || 'string'
        const hasDates = dateCols.length > 0
        const vizType = suggestVizType(colType, hasDates)
        const id = genId()
        dispatch({
            type: 'ADD_WIDGET',
            payload: makeWidget({
                id,
                title: col,
                vizType,
                colX: colType === 'number' ? (hasDates ? dateCols[0] : categoricalCols[0]) : col,
                colY: colType === 'number' ? col : (numericCols[0] || null),
                palette: colType === 'number' ? 'ocean' : 'forest',
            }),
        })
        dispatch({ type: 'SET_ACTIVE', id })
    }

    function renderSection(title, cols) {
        if (!cols.length) return null
        return (
            <div className="mb-4">
                <p className="sidebar-section-label">{title}</p>
                <div className="space-y-1">
                    {cols.map(col => {
                        const cfg = TYPE_CONFIG[types[col]] || TYPE_CONFIG.string
                        return (
                            <motion.div
                                key={col}
                                whileHover={{ x: 2 }}
                                className="col-pill group"
                                title={`Click to add as widget`}
                            >
                                <span className="col-pill__badge" style={{ color: cfg.color }}>{cfg.badge}</span>
                                <span className="col-pill__name truncate">{col}</span>
                                <button
                                    onClick={() => addWidget(col)}
                                    className="col-pill__add opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Add to canvas"
                                >
                                    <Plus size={11} />
                                </button>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <aside className="sidebar-panel">
            <div className="sidebar-header">
                <Database size={14} className="text-cyan-400" />
                <span className="sidebar-title">Data Source</span>
            </div>
            <div className="sidebar-body">
                <div className="sidebar-stat">
                    <span className="text-slate-400">{data.rows.length.toLocaleString()}</span>
                    <span className="text-slate-600"> rows · </span>
                    <span className="text-slate-400">{columns.length}</span>
                    <span className="text-slate-600"> cols</span>
                </div>

                {renderSection('Dimensions', dims)}
                {renderSection('Measures', measures)}
            </div>
        </aside>
    )
}
