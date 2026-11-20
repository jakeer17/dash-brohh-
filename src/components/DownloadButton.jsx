import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Loader2, Check } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function DownloadButton({ targetId }) {
  const [state, setState] = useState('idle') // idle | loading | done

  async function download() {
    const node = document.getElementById(targetId)
    if (!node) return
    setState('loading')
    try {
      const canvas = await html2canvas(node, {
        backgroundColor: '#020617',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `autodash-${new Date().toISOString().slice(0, 10)}.png`
      a.click()
      setState('done')
      setTimeout(() => setState('idle'), 2500)
    } catch (e) {
      console.error(e)
      setState('idle')
    }
  }

  return (
    <button
      onClick={download}
      disabled={state !== 'idle'}
      className="btn-secondary"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'idle' && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5">
            <Download size={13} /> Export PNG
          </motion.span>
        )}
        {state === 'loading' && (
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5">
            <Loader2 size={13} className="animate-spin" /> Capturing…
          </motion.span>
        )}
        {state === 'done' && (
          <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-emerald-400">
            <Check size={13} /> Saved!
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
