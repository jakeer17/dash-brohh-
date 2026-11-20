// ─── Palette Presets ──────────────────────────────────────────────────────────
export const PALETTES = {
    ocean: ['#06b6d4', '#0284c7', '#7c3aed', '#34d399', '#f472b6'],
    forest: ['#34d399', '#059669', '#10b981', '#6ee7b7', '#a7f3d0'],
    sunset: ['#f472b6', '#fb923c', '#fbbf24', '#f59e0b', '#ef4444'],
    violet: ['#a78bfa', '#7c3aed', '#6366f1', '#818cf8', '#c4b5fd'],
    fire: ['#ef4444', '#f97316', '#fbbf24', '#84cc16', '#22c55e'],
    mono: ['#94a3b8', '#64748b', '#475569', '#334155', '#cbd5e1'],
}

export const VIZ_TYPES = [
    { id: 'bar', label: 'Bar', core: true },
    { id: 'stacked-bar', label: 'Stacked', core: true },
    { id: 'column', label: 'Column', core: true },
    { id: 'line', label: 'Line', core: true },
    { id: 'area', label: 'Area', core: true },
    { id: 'scatter', label: 'Scatter', core: true },
    { id: 'pie', label: 'Pie', core: true },
    { id: 'donut', label: 'Donut', core: true },
    { id: 'kpi', label: 'KPI', core: true },
    { id: 'table', label: 'Table', core: true },
    // Advanced – UI only
    { id: 'waterfall', label: 'Waterfall', core: false },
    { id: 'funnel', label: 'Funnel', core: false },
    { id: 'treemap', label: 'Treemap', core: false },
    { id: 'map', label: 'Map', core: false },
    { id: 'python', label: 'Python', core: false },
    { id: 'r', label: 'R Visual', core: false },
    { id: 'slicer', label: 'Slicer', core: false },
]

let _nextId = 1
export function genId() { return `w${_nextId++}` }

export function makeWidget(override = {}) {
    return {
        id: genId(),
        title: 'Widget',
        vizType: 'bar',
        colX: null,
        colY: null,
        colY2: null,
        palette: 'ocean',
        color: null,           // single override color (hex) from color picker
        showLabels: false,
        showGridlines: true,
        ...override,
    }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
export function dashboardReducer(state, action) {
    switch (action.type) {
        case 'ADD_WIDGET':
            return {
                ...state,
                widgets: [...state.widgets, makeWidget(action.payload)],
                activeWidgetId: action.payload?.id ?? null,
            }
        case 'REMOVE_WIDGET':
            return {
                ...state,
                widgets: state.widgets.filter(w => w.id !== action.id),
                activeWidgetId: state.activeWidgetId === action.id
                    ? (state.widgets.find(w => w.id !== action.id)?.id ?? null)
                    : state.activeWidgetId,
            }
        case 'UPDATE_WIDGET':
            return {
                ...state,
                widgets: state.widgets.map(w =>
                    w.id === action.id ? { ...w, ...action.patch } : w
                ),
            }
        case 'SET_ACTIVE':
            return { ...state, activeWidgetId: action.id }
        case 'SET_FILTER':
            return { ...state, filterValue: action.filterValue }
        case 'CLEAR_FILTER':
            return { ...state, filterValue: null }
        case 'SET_VIEW':
            return { ...state, currentView: action.view }
        case 'SET_TITLE':
            return { ...state, dashboardTitle: action.title }
        case 'REORDER': {
            const ws = [...state.widgets]
            const [moved] = ws.splice(action.from, 1)
            ws.splice(action.to, 0, moved)
            return { ...state, widgets: ws }
        }
        default:
            return state
    }
}

// ─── Initial State Builder ────────────────────────────────────────────────────
export function createInitialState(data) {
    const { numericCols = [], dateCols = [], categoricalCols = [] } = data
    const dateCol = dateCols[0] || null
    const catCols = categoricalCols.slice(0, 3)
    const numCols = numericCols.slice(0, 4)
    const widgets = []

    if (dateCol && numCols[0]) {
        widgets.push(makeWidget({ title: `${numCols[0]} over Time`, vizType: 'area', colX: dateCol, colY: numCols[0], palette: 'ocean' }))
    }
    if (catCols[0]) {
        widgets.push(makeWidget({ title: `${catCols[0]} Distribution`, vizType: 'bar', colX: catCols[0], colY: numCols[0] || null, palette: 'forest' }))
    }
    if (catCols[0]) {
        widgets.push(makeWidget({ title: `${catCols[0]} Breakdown`, vizType: 'donut', colX: catCols[0], colY: numCols[0] || null, palette: 'sunset' }))
    }
    if (numCols.length >= 2) {
        widgets.push(makeWidget({ title: `${numCols[0]} vs ${numCols[1]}`, vizType: 'scatter', colX: numCols[0], colY: numCols[1], palette: 'violet' }))
    }
    if (numCols[0]) {
        widgets.push(makeWidget({ title: `Total ${numCols[0]}`, vizType: 'kpi', colX: catCols[0] || null, colY: numCols[0], palette: 'ocean' }))
    }
    widgets.push(makeWidget({ title: 'Data Table', vizType: 'table', palette: 'mono' }))

    // Pure numeric fallback
    if (!dateCol && !catCols[0]) {
        return {
            widgets: [makeWidget({ title: 'Data Table', vizType: 'table', palette: 'mono' })],
            activeWidgetId: null,
            filterValue: null,
            currentView: 'report',
            dashboardTitle: 'Sales Performance 2024',
        }
    }

    return {
        widgets,
        activeWidgetId: widgets[0]?.id ?? null,
        filterValue: null,
        currentView: 'report',
        dashboardTitle: 'Sales Performance 2024',
    }
}
