import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Maximize2 } from 'lucide-react'

export default function FocusModal({ onClose, title, children }) {
    useEffect(() => {
        function onKey(e) { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <motion.div
            className="focus-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className="focus-modal"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="focus-modal__header">
                    <div className="flex items-center gap-2">
                        <Maximize2 size={15} className="text-cyan-400" />
                        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
                    </div>
                    <button onClick={onClose} className="icon-btn" title="Close (Esc)">
                        <X size={16} />
                    </button>
                </div>
                <div className="focus-modal__body">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    )
}
