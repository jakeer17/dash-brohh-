import React, { useState } from 'react'
import { Layers, Palette as PaletteIcon, BarChart2, ToggleLeft } from 'lucide-react'
import { VIZ_TYPES, PALETTES } from '../../store/useDashboardStore'

// SVG icon shapes for the viz grid
function VizIcon({ type, active }) {
    const base = `viz-icon ${active ? 'viz-icon--active' : ''}`
    return (
        <button className={base} title={type.label}>
            <VizSVG id={type.id} />
            <span className="viz-icon__label">{type.label}</span>
        </button>
    )
}

function VizSVG({ id }) {
    const s = { width: 22, height: 22 }
    switch (id) {
        case 'bar': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="8" width="4" height="12" rx="1" fill="currentColor" opacity=".9" /><rect x="9" y="4" width="4" height="16" rx="1" fill="currentColor" /><rect x="16" y="11" width="4" height="9" rx="1" fill="currentColor" opacity=".7" /></svg>
        case 'stacked-bar': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="14" width="4" height="6" rx="1" fill="currentColor" opacity=".5" /><rect x="2" y="9" width="4" height="5" rx="0" fill="currentColor" opacity=".75" /><rect x="2" y="4" width="4" height="5" rx="1 1 0 0" fill="currentColor" /><rect x="9" y="11" width="4" height="9" rx="1" fill="currentColor" opacity=".5" /><rect x="9" y="5" width="4" height="6" rx="1 1 0 0" fill="currentColor" opacity=".85" /><rect x="16" y="16" width="4" height="4" rx="1" fill="currentColor" opacity=".5" /><rect x="16" y="10" width="4" height="6" rx="1 1 0 0" fill="currentColor" /></svg>
        case 'line': return <svg {...s} viewBox="0 0 22 22" fill="none"><polyline points="2,16 7,10 12,13 17,5 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        case 'area': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M2,16 L7,10 L12,13 L17,5 L20,8 L20,20 L2,20 Z" fill="currentColor" opacity=".35" /><polyline points="2,16 7,10 12,13 17,5 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        case 'pie': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M11,11 L11,2 A9,9 0,0,1 20,11 Z" fill="currentColor" /><path d="M11,11 L20,11 A9,9 0,0,1 5.5,18.6 Z" fill="currentColor" opacity=".65" /><path d="M11,11 L5.5,18.6 A9,9 0,0,1 11,2 Z" fill="currentColor" opacity=".4" /></svg>
        case 'donut': return <svg {...s} viewBox="0 0 22 22" fill="none"><path d="M11,11 L11,3 A8,8 0,0,1 19,11 Z" fill="currentColor" /><path d="M11,11 L19,11 A8,8 0,0,1 5,17.9 Z" fill="currentColor" opacity=".65" /><path d="M11,11 L5,17.9 A8,8 0,0,1 11,3 Z" fill="currentColor" opacity=".4" /><circle cx="11" cy="11" r="4" fill="#0f172a" /></svg>
        case 'scatter': return <svg {...s} viewBox="0 0 22 22" fill="none"><circle cx="5" cy="16" r="2" fill="currentColor" opacity=".7" /><circle cx="9" cy="10" r="2" fill="currentColor" /><circle cx="14" cy="13" r="2" fill="currentColor" opacity=".85" /><circle cx="18" cy="6" r="2" fill="currentColor" opacity=".6" /><circle cx="12" cy="6" r="1.5" fill="currentColor" opacity=".5" /></svg>
        case 'table': return <svg {...s} viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="2" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" /><line x1="8" y1="7" x2="8" y2="20" stroke="currentColor" strokeWidth="1" /><line x1="14" y1="7" x2="14" y2="20" stroke="currentColor" strokeWidth="1" /><line x1="2" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1" opacity=".5" /></svg>
        default: return null
    }
}

const PALETTE_NAMES = Object.keys(PALETTES)

export default function RightSidebar({ activeWidget, onUpdate, data }) {
    const [tab, setTab] = useState('visualize')

    if (!activeWidget) {
        return (
            <aside className="sidebar-panel">
                <div className="sidebar-header">
                    <BarChart2 size={14} className="text-cyan-400" />
                    <span className="sidebar-title">Visualizations</span>
                </div>
                <div className="sidebar-body flex items-center justify-center">
                    <p className="text-xs text-slate-600 text-center px-4">Select a widget on the canvas to customize it</p>
                </div>
            </aside>
        )
    }

    const { vizType, palette, showLabels, showGridlines, colX, colY } = activeWidget
    const { numericCols = [], dateCols = [], categoricalCols = [], columns = [] } = data

    return (
        <aside className="sidebar-panel">
            <div className="sidebar-header">
                <BarChart2 size={14} className="text-cyan-400" />
                <span className="sidebar-title">Properties</span>
            </div>

            {/* Tabs */}
            <div className="rhs-tabs">
                <button className={`rhs-tab ${tab === 'visualize' ? 'rhs-tab--active' : ''}`} onClick={() => setTab('visualize')}>
                    <Layers size={12} /> Visualize
                </button>
                <button className={`rhs-tab ${tab === 'format' ? 'rhs-tab--active' : ''}`} onClick={() => setTab('format')}>
                    <PaletteIcon size={12} /> Format
                </button>
            </div>

            <div className="sidebar-body">
                {tab === 'visualize' && (
                    <div>
                        <p className="sidebar-section-label">Chart Type</p>
                        <div className="viz-grid">
                            {VIZ_TYPES.map(vt => (
                                <button
                                    key={vt.id}
                                    className={`viz-icon ${vt.id === vizType ? 'viz-icon--active' : ''}`}
                                    onClick={() => onUpdate({ vizType: vt.id })}
                                    title={vt.label}
                                >
                                    <VizSVG id={vt.id} />
                                    <span className="viz-icon__label">{vt.label}</span>
                                </button>
                            ))}
                        </div>

                        <p className="sidebar-section-label mt-4">Data Columns</p>
                        <div className="space-y-2">
                            <div>
                                <label className="field-label">X Axis / Category</label>
                                <select className="field-select" value={colX || ''} onChange={e => onUpdate({ colX: e.target.value || null })}>
                                    <option value="">— Auto —</option>
                                    {[...dateCols, ...categoricalCols].map(c => <option key={c} value={c}>{c}</option>)}
                                    {numericCols.map(c => <option key={c} value={c}>{c} (numeric)</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="field-label">Y Axis / Measure</label>
                                <select className="field-select" value={colY || ''} onChange={e => onUpdate({ colY: e.target.value || null })}>
                                    <option value="">— Auto / Count —</option>
                                    {numericCols.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'format' && (
                    <div className="space-y-4">
                        <div>
                            <p className="sidebar-section-label">Color Palette</p>
                            <div className="palette-grid">
                                {PALETTE_NAMES.map(name => (
                                    <button
                                        key={name}
                                        className={`palette-swatch-btn ${palette === name ? 'palette-swatch-btn--active' : ''}`}
                                        onClick={() => onUpdate({ palette: name })}
                                        title={name}
                                    >
                                        <div className="palette-swatches">
                                            {PALETTES[name].slice(0, 5).map((c, i) => (
                                                <span key={i} className="swatch" style={{ background: c }} />
                                            ))}
                                        </div>
                                        <span className="palette-name">{name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="sidebar-section-label">Options</p>
                            <div className="space-y-2">
                                <Toggle label="Show Labels" value={showLabels} onChange={v => onUpdate({ showLabels: v })} />
                                <Toggle label="Show Gridlines" value={showGridlines} onChange={v => onUpdate({ showGridlines: v })} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="toggle-row">
            <span className="toggle-label">{label}</span>
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
