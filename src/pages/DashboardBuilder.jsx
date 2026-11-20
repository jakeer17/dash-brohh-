import React, { useReducer, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Zap, Upload, FilterX } from 'lucide-react'
import LeftSidebar from '../components/builder/LeftSidebar'
import RightSidebar from '../components/builder/RightSidebar'
import DashboardCanvas from '../components/builder/DashboardCanvas'
import { dashboardReducer, createInitialState } from '../store/useDashboardStore'

export default function DashboardBuilder({ data, onReset }) {
    const [state, dispatch] = useReducer(
        dashboardReducer,
        data,
        createInitialState
    )

    const activeWidget = useMemo(
        () => state.widgets.find(w => w.id === state.activeWidgetId) ?? null,
        [state.widgets, state.activeWidgetId]
    )

    return (
        <div className="builder-layout">
            {/* Top Bar */}
            <header className="builder-topbar">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                        <BarChart2 size={16} strokeWidth={2.5} className="text-slate-950" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(90deg, #34d399, #06b6d4)' }}>
                            Auto Dash Pro
                        </h1>
                        <p className="text-[10px] text-slate-500">
                            <Zap size={9} className="inline text-emerald-400 mr-0.5" />
                            {data.rows.length.toLocaleString()} rows · {data.columns.length} columns
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {state.filterValue && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => dispatch({ type: 'CLEAR_FILTER' })}
                            className="btn-secondary text-xs flex items-center gap-1.5"
                        >
                            <FilterX size={12} /> Clear Filter
                        </motion.button>
                    )}
                    <button onClick={onReset} className="btn-secondary text-xs flex items-center gap-1.5">
                        <Upload size={12} /> New File
                    </button>
                </div>
            </header>

            {/* Three Panels */}
            <div className="builder-panels">
                <LeftSidebar data={data} dispatch={dispatch} />

                <DashboardCanvas
                    widgets={state.widgets}
                    activeWidgetId={state.activeWidgetId}
                    filterValue={state.filterValue}
                    data={data}
                    dispatch={dispatch}
                />

                <RightSidebar
                    activeWidget={activeWidget}
                    onUpdate={patch => dispatch({ type: 'UPDATE_WIDGET', id: state.activeWidgetId, patch })}
                    data={data}
                />
            </div>
        </div>
    )
}
