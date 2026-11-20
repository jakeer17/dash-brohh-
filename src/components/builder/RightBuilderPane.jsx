import React, { useState } from 'react'
import {
    BarChart2, BarChart, LineChart, PieChart, Table2, Activity,
    ScatterChart, Layers, TrendingDown, Filter, Map, Code, Triangle,
    GitBranch, ToggleLeft, Zap, BrainCircuit
} from 'lucide-react'
import { VIZ_TYPES, PALETTES, genId, makeWidget } from '../../store/useDashboardStore'

/* ─── Viz SVG thumbnails ──────────────────────────────────────────────────── */
function VizSVG({ id }) {
    const s = { width: 22, height: 22 }
    switch (id) {
        case 'bar': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="8" width="4" height="12" rx="1" fill="currentColor" opacity=".9" /><rect x="9" y="4" width="4" height="16" rx="1" fill="currentColor" /><rect x="16" y="11" width="4" height="9" rx="1" fill="currentColor" opacity=".7" /></svg>
        case 'stacked-bar': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="14" width="4" height="6" rx="1" fill="currentColor" opacity=".5" /><rect x="2" y="9" width="4" height="5" fill="currentColor" opacity=".75" /><rect x="2" y="4" width="4" height="5" rx="1" fill="currentColor" /><rect x="9" y="11" width="4" height="9" rx="1" fill="currentColor" opacity=".5" /><rect x="9" y="5" width="4" height="6" rx="1" fill="currentColor" opacity=".85" /><rect x="16" y="16" width="4" height="4" rx="1" fill="currentColor" opacity=".5" /><rect x="16" y="10" width="4" height="6" rx="1" fill="currentColor" /></svg>
        case 'column': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="8" width="4" height="12" rx="1" fill="currentColor" opacity=".7" /><rect x="9" y="3" width="4" height="17" rx="1" fill="currentColor" /><rect x="16" y="12" width="4" height="8" rx="1" fill="currentColor" opacity=".85" /></svg>
        case 'line': return <svg {...s} viewBox="0 0 22 22" fill="none"><polyline points="2,16 7,10 12,13 17,5 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        case 'area': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M2,16 L7,10 L12,13 L17,5 L20,8 L20,20 L2,20 Z" fill="currentColor" opacity=".35" /><polyline points="2,16 7,10 12,13 17,5 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
        case 'scatter': return <svg {...s} viewBox="0 0 22 22" fill="none"><circle cx="5" cy="16" r="2" fill="currentColor" opacity=".7" /><circle cx="9" cy="10" r="2" fill="currentColor" /><circle cx="14" cy="13" r="2" fill="currentColor" opacity=".85" /><circle cx="18" cy="6" r="2" fill="currentColor" opacity=".6" /><circle cx="12" cy="6" r="1.5" fill="currentColor" opacity=".5" /></svg>
        case 'pie': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M11,11 L11,2 A9,9 0,0,1 20,11 Z" fill="currentColor" /><path d="M11,11 L20,11 A9,9 0,0,1 5.5,18.6 Z" fill="currentColor" opacity=".65" /><path d="M11,11 L5.5,18.6 A9,9 0,0,1 11,2 Z" fill="currentColor" opacity=".4" /></svg>
        case 'donut': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M11,11 L11,3 A8,8 0,0,1 19,11 Z" fill="currentColor" /><path d="M11,11 L19,11 A8,8 0,0,1 5,17.9 Z" fill="currentColor" opacity=".65" /><path d="M11,11 L5,17.9 A8,8 0,0,1 11,3 Z" fill="currentColor" opacity=".4" /><circle cx="11" cy="11" r="4" fill="white" /></svg>
        case 'kpi': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="6" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1" opacity=".5" /><text x="11" y="13" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="bold">KPI</text></svg>
        case 'table': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="2" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="7" x2="8" y2="20" stroke="currentColor" strokeWidth="1" /><line x1="14" y1="7" x2="14" y2="20" stroke="currentColor" strokeWidth="1" /><line x1="2" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1" opacity=".5" /></svg>
        // Advanced (greyed)
        case 'waterfall': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="12" width="3" height="6" rx="1" fill="currentColor" /><rect x="7" y="8" width="3" height="10" rx="1" fill="currentColor" opacity=".7" /><rect x="12" y="6" width="3" height="12" rx="1" fill="currentColor" opacity=".5" /><rect x="17" y="9" width="3" height="9" rx="1" fill="currentColor" opacity=".35" /></svg>
        case 'funnel': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M2 4h18L13 12v6l-4-2v-4L2 4z" fill="currentColor" opacity=".6" /></svg>
        case 'treemap': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="10" height="10" rx="1" fill="currentColor" /><rect x="14" y="2" width="6" height="6" rx="1" fill="currentColor" opacity=".6" /><rect x="14" y="10" width="6" height="10" rx="1" fill="currentColor" opacity=".4" /><rect x="2" y="14" width="10" height="6" rx="1" fill="currentColor" opacity=".7" /></svg>
        case 'map': return <svg {...s} viewBox="0 0 22 22" fill="none"><circle cx="11" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M6 10 Q9 7 11 10 Q13 13 16 10" stroke="currentColor" strokeWidth="1" fill="none" /><line x1="11" y1="3" x2="11" y2="17" stroke="currentColor" strokeWidth="1" opacity=".4" /></svg>
        case 'python': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M8 4h3a3 3 0 013 3v1H8a1 1 0 00-1 1v5a1 1 0 001 1h6a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" /><circle cx="10" cy="7" r="1" fill="currentColor" /><circle cx="12" cy="15" r="1" fill="currentColor" /></svg>
        case 'r': return <svg {...s} viewBox="0 0 22 22" fill="none"><text x="4" y="16" fontSize="13" fontWeight="bold" fill="currentColor" fontFamily="monospace">R</text></svg>
        case 'slicer': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="4" width="18" height="3" rx="1.5" fill="currentColor" opacity=".4" /><rect x="2" y="9" width="18" height="3" rx="1.5" fill="currentColor" /><rect x="2" y="14" width="18" height="3" rx="1.5" fill="currentColor" opacity=".4" /></svg>
        default: return null
    }
}

const CORE_TYPES = VIZ_TYPES.filter(v => v.core)
const ADVANCED_TYPES = VIZ_TYPES.filter(v => !v.core)
const PALETTE_NAMES = Object.keys(PALETTES)

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function RightBuilderPane({ state, data, dispatch }) {
    const { activeWidgetId, widgets } = state
    const activeWidget = widgets.find(w => w.id === activeWidgetId) || null
    const [formatTab, setFormatTab] = useState('axes') // 'axes' | 'style'

    const { numericCols = [], dateCols = [], categoricalCols = [], columns = [] } = data || {}

    function handleVizClick(vizType) {
        if (!activeWidgetId) {
            const { categoricalCols: cc = [], numericCols: nc = [], dateCols: dc = [] } = data || {}
            const id = genId()
            dispatch({
                type: 'ADD_WIDGET',
                payload: makeWidget({
                    id,
                    title: VIZ_TYPES.find(v => v.id === vizType)?.label || vizType,
                    vizType,
                    colX: cc[0] || dc[0] || null,
                    colY: nc[0] || null,
                    palette: 'ocean',
                }),
            })
            dispatch({ type: 'SET_ACTIVE', id })
        } else {
            dispatch({ type: 'UPDATE_WIDGET', id: activeWidgetId, patch: { vizType } })
        }
    }

    function updateActive(patch) {
        if (!activeWidgetId) return
        dispatch({ type: 'UPDATE_WIDGET', id: activeWidgetId, patch })
    }

    return (
        <aside className="pbi-rhs">
            {/* ── Top: Visualizations ── */}
            <div className="pbi-rhs-top">
                <div className="pbi-rhs-section-hdr">
                    <BarChart2 size={12} /> Visualizations
                </div>

                <div className="pbi-viz-section-label">Core</div>
                <div className="pbi-viz-grid-core">
                    {CORE_TYPES.map(vt => (
                        <button
                            key={vt.id}
                            className={`pbi-viz-icon ${activeWidget?.vizType === vt.id ? 'pbi-viz-icon--active' : ''}`}
                            onClick={() => handleVizClick(vt.id)}
                            title={vt.label}
                        >
                            <VizSVG id={vt.id} />
                            <span className="pbi-viz-label">{vt.label}</span>
                        </button>
                    ))}
                </div>

                <div className="pbi-viz-section-label pbi-viz-section-label--adv">Advanced</div>
                <div className="pbi-viz-grid-adv">
                    {ADVANCED_TYPES.map(vt => (
                        <button
                            key={vt.id}
                            className="pbi-viz-icon pbi-viz-icon--adv"
                            title={`${vt.label} – Coming Soon`}
                            disabled
                        >
                            <VizSVG id={vt.id} />
                            <span className="pbi-viz-label">{vt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Bottom: Format / Properties ── */}
            <div className="pbi-rhs-bottom">
                {!activeWidget ? (
                    <div className="pbi-rhs-empty">
                        <BarChart2 size={24} strokeWidth={1} />
                        <p>Select a widget to format it</p>
                    </div>
                ) : (
                    <div className="pbi-format-pane">
                        <div className="pbi-rhs-section-hdr">
                            <Layers size={12} /> Format — <em className="pbi-format-type">{activeWidget.vizType}</em>
                        </div>

                        {/* Format sub-tabs */}
                        <div className="pbi-format-tabs">
                            <button className={`pbi-ftab ${formatTab === 'axes' ? 'pbi-ftab--on' : ''}`} onClick={() => setFormatTab('axes')}>Data</button>
                            <button className={`pbi-ftab ${formatTab === 'style' ? 'pbi-ftab--on' : ''}`} onClick={() => setFormatTab('style')}>Style</button>
                        </div>

                        {formatTab === 'axes' && (
                            <div className="pbi-format-body">
                                {/* Title */}
                                <div className="pbi-field">
                                    <label className="pbi-field-label">Chart Title</label>
                                    <input
                                        className="pbi-field-input"
                                        value={activeWidget.title}
                                        onChange={e => updateActive({ title: e.target.value })}
                                    />
                                </div>

                                {/* X Axis */}
                                <div className="pbi-field">
                                    <label className="pbi-field-label">X Axis / Category</label>
                                    <select
                                        className="pbi-field-select"
                                        value={activeWidget.colX || ''}
                                        onChange={e => updateActive({ colX: e.target.value || null })}
                                    >
                                        <option value="">— Auto —</option>
                                        {[...dateCols, ...categoricalCols].map(c => <option key={c} value={c}>{c}</option>)}
                                        {numericCols.map(c => <option key={c} value={c}>{c} (num)</option>)}
                                    </select>
                                </div>

                                {/* Y Axis */}
                                <div className="pbi-field">
                                    <label className="pbi-field-label">Y Axis / Measure</label>
                                    <select
                                        className="pbi-field-select"
                                        value={activeWidget.colY || ''}
                                        onChange={e => updateActive({ colY: e.target.value || null })}
                                    >
                                        <option value="">— Auto / Count —</option>
                                        {numericCols.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {formatTab === 'style' && (
                            <div className="pbi-format-body">
                                {/* Primary Color */}
                                <div className="pbi-field">
                                    <label className="pbi-field-label">Primary Color</label>
                                    <div className="pbi-color-row">
                                        <input
                                            type="color"
                                            className="pbi-color-input"
                                            value={activeWidget.color || (PALETTES[activeWidget.palette] || PALETTES.ocean)[0]}
                                            onChange={e => updateActive({ color: e.target.value })}
                                        />
                                        <span className="pbi-color-hex">
                                            {activeWidget.color || (PALETTES[activeWidget.palette] || PALETTES.ocean)[0]}
                                        </span>
                                        {activeWidget.color && (
                                            <button className="pbi-color-reset" onClick={() => updateActive({ color: null })} title="Reset to palette color">✕</button>
                                        )}
                                    </div>
                                </div>

                                {/* Palette */}
                                <div className="pbi-field">
                                    <label className="pbi-field-label">Color Palette</label>
                                    <div className="pbi-palette-grid">
                                        {PALETTE_NAMES.map(name => (
                                            <button
                                                key={name}
                                                className={`pbi-palette-btn ${activeWidget.palette === name ? 'pbi-palette-btn--active' : ''}`}
                                                onClick={() => updateActive({ palette: name, color: null })}
                                                title={name}
                                            >
                                                <div className="pbi-swatches">
                                                    {PALETTES[name].slice(0, 5).map((c, i) => (
                                                        <span key={i} style={{ background: c }} className="pbi-swatch" />
                                                    ))}
                                                </div>
                                                <span className="pbi-palette-name">{name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="pbi-field">
                                    <label className="pbi-field-label">Options</label>
                                    <div className="pbi-toggles">
                                        <Toggle label="Show Labels" value={activeWidget.showLabels} onChange={v => updateActive({ showLabels: v })} />
                                        <Toggle label="Show Gridlines" value={activeWidget.showGridlines} onChange={v => updateActive({ showGridlines: v })} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    )
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="pbi-toggle-row">
            <span className="pbi-toggle-label">{label}</span>
            <button
                className={`toggle-switch ${value ? 'toggle-switch--on' : ''}`}
                onClick={() => onChange(!value)}
                role="switch"
                aria-checked={value}
            >
                <span className="toggle-thumb" />
            </button>
        </div>
    )
}
