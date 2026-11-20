import React, { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, X, Plus, Database, Code2, GitBranch } from 'lucide-react'
import DashboardWidget from './DashboardWidget'
import DataTable from '../DataTable'
import { makeWidget, genId } from '../../store/useDashboardStore'

export default function DashboardCanvas({ state, data, dispatch, canvasPageRef }) {
    const { widgets, activeWidgetId, filterValue, currentView } = state

    function addDefaultWidget() {
        const { categoricalCols = [], numericCols = [], dateCols = [] } = data
        const id = genId()
        dispatch({
            type: 'ADD_WIDGET',
            payload: makeWidget({
                id,
                title: 'New Widget',
                vizType: categoricalCols.length ? 'bar' : 'table',
                colX: categoricalCols[0] || dateCols[0] || null,
                colY: numericCols[0] || null,
                palette: 'ocean',
            }),
        })
        dispatch({ type: 'SET_ACTIVE', id })
    }

    return (
        <main className="pbi-canvas-area" onClick={() => dispatch({ type: 'SET_ACTIVE', id: null })}>
            {/* Filter Banner */}
            <AnimatePresence>
                {filterValue && (
                    <motion.div
                        className="filter-banner"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                    >
                        <Filter size={13} className="text-amber-500" />
                        <span>Filtered by <strong>{filterValue.col}</strong> = <em>"{filterValue.val}"</em></span>
                        <button
                            onClick={e => { e.stopPropagation(); dispatch({ type: 'CLEAR_FILTER' }) }}
                            className="filter-clear"
                        >
                            <X size={12} /> Clear filter
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The "Page" – white aspect-ratio container */}
            <div className="pbi-canvas-page-wrap">
                <div className="pbi-canvas-page" id="pbi-canvas-page" ref={canvasPageRef}>
                    {currentView === 'report' && (
                        <div className="pbi-widget-grid" onClick={e => e.stopPropagation()}>
                            <AnimatePresence mode="popLayout">
                                {widgets.map(widget => (
                                    <DashboardWidget
                                        key={widget.id}
                                        widget={widget}
                                        data={data}
                                        filterValue={filterValue}
                                        isActive={widget.id === activeWidgetId}
                                        onSelect={e => { e.stopPropagation(); dispatch({ type: 'SET_ACTIVE', id: widget.id }) }}
                                        onUpdate={patch => dispatch({ type: 'UPDATE_WIDGET', id: widget.id, patch })}
                                        onRemove={() => dispatch({ type: 'REMOVE_WIDGET', id: widget.id })}
                                        onCrossFilter={fv => dispatch({ type: 'SET_FILTER', filterValue: fv })}
                                    />
                                ))}
                            </AnimatePresence>
                            <button
                                className="pbi-add-widget-card"
                                onClick={e => { e.stopPropagation(); addDefaultWidget() }}
                            >
                                <Plus size={20} />
                                <span>Add Widget</span>
                            </button>
                        </div>
                    )}

                    {currentView === 'table' && (
                        <div className="pbi-view-table">
                            <p className="pbi-view-heading">
                                <Database size={14} /> Raw Data
                                <span>({data.rows.length.toLocaleString()} rows)</span>
                            </p>
                            <DataTable rows={data.rows} columns={data.columns} types={data.types} />
                        </div>
                    )}

                    {currentView === 'dax' && (
                        <div className="pbi-placeholder-view">
                            <Code2 size={48} strokeWidth={1} />
                            <h2>DAX Expressions</h2>
                            <p>Write and manage DAX measures and calculated columns.</p>
                            <div className="pbi-coming-soon-badge">Coming Soon</div>
                        </div>
                    )}

                    {currentView === 'query' && (
                        <div className="pbi-placeholder-view">
                            <GitBranch size={48} strokeWidth={1} />
                            <h2>Power Query Editor</h2>
                            <p>Transform and shape your data with M-formula queries.</p>
                            <div className="pbi-coming-soon-badge">Coming Soon</div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
