import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart2, Zap } from 'lucide-react'
import FileUploader from './components/FileUploader'
import BuilderShell from './components/BuilderShell'

export default function App() {
  const [data, setData] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {!data ? (
        <motion.div
          key="uploader"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12"
        >
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-between mb-10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                <BarChart2 size={20} strokeWidth={2.5} style={{ color: '#fff' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#111827' }}>
                  Auto Dash Pro
                </h1>
                <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
                  Power BI-style Analytics Builder
                </p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: '#9CA3AF' }}>
              <Zap size={12} style={{ color: '#10B981' }} />
              <span>Excel · CSV · JSON</span>
            </span>
          </motion.header>

          <FileUploader onData={setData} />
        </motion.div>
      ) : (
        <motion.div
          key="builder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ height: '100vh', overflow: 'hidden' }}
        >
          <BuilderShell data={data} onReset={() => setData(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
