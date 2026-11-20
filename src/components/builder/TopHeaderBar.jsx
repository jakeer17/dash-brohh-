import React, { useRef, useState } from 'react'
import { BarChart2, ChevronDown, Download, Link, Upload, Edit3 } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function TopHeaderBar({ dashboardTitle, onTitleChange, onReset, canvasRef }) {
    const [showExport, setShowExport] = useState(false)
    const [toast, setToast] = useState(null)
    const titleRef = useRef(null)

    function showToast(msg) {
        setToast(msg)
        setTimeout(() => setToast(null), 2200)
    }

    async function handleExportPNG() {
        setShowExport(false)
        const el = canvasRef?.current || document.getElementById('pbi-canvas-page')
        if (!el) return showToast('Canvas not found')
        try {
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' })
            const link = document.createElement('a')
            link.download = `${dashboardTitle || 'dashboard'}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
            showToast('PNG exported!')
        } catch {
            showToast('Export failed')
        }
    }

    function handleShareLink() {
        setShowExport(false)
        const url = `${window.location.origin}?dashboard=${encodeURIComponent(dashboardTitle)}`
        navigator.clipboard.writeText(url).then(
            () => showToast('Link copied to clipboard!'),
            () => showToast('Copy failed – please copy manually'),
        )
    }

    return (
        <header className="pbi-topbar">
            {/* Left – Brand */}
            <div className="pbi-topbar__brand">
                <div className="pbi-logo">
                    <BarChart2 size={15} strokeWidth={2.5} />
                </div>
                <span className="pbi-brand-name">Auto Dash Pro</span>
            </div>

            {/* Center – Editable title */}
            <div className="pbi-topbar__title">
                <Edit3 size={12} className="pbi-title-icon" />
                <input
                    ref={titleRef}
                    className="pbi-title-input"
                    value={dashboardTitle}
                    onChange={e => onTitleChange(e.target.value)}
                    spellCheck={false}
                />
            </div>

            {/* Right – Actions */}
            <div className="pbi-topbar__actions">
                {onReset && (
                    <button className="pbi-btn-ghost" onClick={onReset} title="Upload new file">
                        <Upload size={13} /> New File
                    </button>
                )}
                <div className="pbi-export-wrap">
                    <button
                        className="pbi-btn-primary"
                        onClick={() => setShowExport(v => !v)}
                    >
                        <Download size={13} /> Export <ChevronDown size={11} />
                    </button>
                    {showExport && (
                        <div className="pbi-export-menu">
                            <button className="pbi-export-item" onClick={handleExportPNG}>
                                <Download size={13} /> Export PNG
                            </button>
                            <button className="pbi-export-item" onClick={handleShareLink}>
                                <Link size={13} /> Share Link
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast */}
            {toast && <div className="pbi-toast">{toast}</div>}
        </header>
    )
}
