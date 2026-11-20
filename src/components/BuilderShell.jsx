import React, { useReducer, useRef } from 'react'
import { dashboardReducer, createInitialState } from '../store/useDashboardStore'
import TopHeaderBar from './builder/TopHeaderBar'
import NavRail from './builder/NavRail'
import DashboardCanvas from './builder/DashboardCanvas'
import RightBuilderPane from './builder/RightBuilderPane'

export default function BuilderShell({ data, onReset }) {
    const [state, dispatch] = useReducer(dashboardReducer, data, createInitialState)
    const canvasPageRef = useRef(null)

    return (
        <div className="pbi-shell">
            {/* Zone A – Top Header */}
            <TopHeaderBar
                dashboardTitle={state.dashboardTitle}
                onTitleChange={title => dispatch({ type: 'SET_TITLE', title })}
                onReset={onReset}
                canvasRef={canvasPageRef}
            />

            {/* Body row: Zone B + Zone C + Zone D */}
            <div className="pbi-body">
                {/* Zone B – Nav Rail */}
                <NavRail
                    currentView={state.currentView}
                    onViewChange={view => dispatch({ type: 'SET_VIEW', view })}
                />

                {/* Zone C – Center Canvas */}
                <DashboardCanvas
                    state={state}
                    data={data}
                    dispatch={dispatch}
                    canvasPageRef={canvasPageRef}
                />

                {/* Zone D – Right Builder Pane */}
                <RightBuilderPane
                    state={state}
                    data={data}
                    dispatch={dispatch}
                />
            </div>
        </div>
    )
}
