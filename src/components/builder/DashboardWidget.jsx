import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, GripVertical, Pencil, Check } from 'lucide-react'
import WidgetRenderer from './WidgetRenderer'
import FocusModal from './FocusModal'

export default function DashboardWidget({
    widget, data, filterValue, isActive,
    onSelect, onUpdate, onRemove, onCrossFilter
}) {
    const [focused, setFocused] = useState(false)
    const [editingTitle, setEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState(widget.title)
    const titleRef = useRef(null)

    function commitTitle() {
        onUpdate?.({ title: titleDraft.trim() || widget.title })
        setEditingTitle(false)
    }

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => onSelect?.()}
                className={`widget-card group ${isActive ? 'widget-card--active' : ''}`}
                style={{ cursor: 'pointer' }}
            >
                {/* Card Header */}
                <div className="widget-header">
                    <div className="flex items-center gap-2 min-w-0">
                        <GripVertical size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors shrink-0 cursor-grab" />
                        {editingTitle ? (
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <input
                                    ref={titleRef}
                                    value={titleDraft}
                                    onChange={e => setTitleDraft(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false) }}
                                    onBlur={commitTitle}
                                    autoFocus
                                    className="widget-title-input"
                                    onClick={e => e.stopPropagation()}
                                />
                                <button onClick={e => { e.stopPropagation(); commitTitle() }}
                                    className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                    <Check size={13} />
                                </button>
                            </div>
                        ) : (
                            <h3 className="widget-title truncate" title={widget.title}>{widget.title}</h3>
                        )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={e => { e.stopPropagation(); setTitleDraft(widget.title); setEditingTitle(true) }}
                            className="icon-btn" title="Edit title"
                        >
                            <Pencil size={12} />
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); setFocused(true) }}
                            className="icon-btn" title="Focus mode"
                        >
                            <Maximize2 size={12} />
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); onRemove?.() }}
                            className="icon-btn icon-btn--danger" title="Remove widget"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="widget-body" style={{ height: 240 }}>
                    <WidgetRenderer
                        widget={widget}
                        data={data}
                        filterValue={filterValue}
                        onCrossFilter={onCrossFilter}
                    />
                </div>
            </motion.div>

            <AnimatePresence>
                {focused && (
                    <FocusModal onClose={() => setFocused(false)} title={widget.title}>
                        <WidgetRenderer
                            widget={widget}
                            data={data}
                            filterValue={filterValue}
                            onCrossFilter={onCrossFilter}
                        />
                    </FocusModal>
                )}
            </AnimatePresence>
        </>
    )
}
