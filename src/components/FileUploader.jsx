import React, { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { parseFile } from '../utils/parser'

const ACCEPTED = ['.xlsx', '.xls', '.csv', '.json']

export default function FileUploader({ onData }) {
  const inputRef = useRef()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)
  const [dragging, setDragging] = useState(false)

  async function process(file) {
    if (!file) return
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED.includes(ext)) {
      setErr(`Unsupported format "${ext}". Please upload .xlsx, .csv, or .json`)
      return
    }
    setLoading(true); setErr(null); setFileInfo(null)
    try {
      const parsed = await parseFile(file)
      setFileInfo({ name: file.name, rows: parsed.rows.length, cols: parsed.columns.length })
      onData(parsed)
    } catch (e) {
      console.error(e)
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    process(e.dataTransfer.files[0])
  }, [])

  const onDragOver = e => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Drop zone */}
      <motion.div
        animate={{
          borderColor: dragging ? '#10B981' : '#D1D5DB',
          scale: dragging ? 1.015 : 1,
          backgroundColor: dragging ? '#F0FDF4' : '#FFFFFF',
        }}
        transition={{ duration: 0.2 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !loading && inputRef.current.click()}
        className="relative flex flex-col items-center justify-center gap-5 p-14 text-center cursor-pointer rounded-2xl group"
        style={{
          minHeight: '300px',
          border: '2px dashed #D1D5DB',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        {/* Animated glow on drag */}
        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
            />
          )}
        </AnimatePresence>

        {/* Upload Icon */}
        <motion.div
          animate={{ y: dragging ? -8 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}
        >
          <UploadCloud size={32} style={{ color: '#10B981' }} strokeWidth={1.5} />
        </motion.div>

        <div>
          <p className="text-lg font-semibold mb-1" style={{ color: '#111827' }}>
            {dragging ? 'Release to upload' : 'Drag & drop your file here'}
          </p>
          <p className="text-sm" style={{ color: '#9CA3AF' }}>or click to browse your computer</p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {['.xlsx', '.xls', '.csv', '.json'].map(ext => (
            <span key={ext} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '3px 10px', borderRadius: 99,
              fontSize: '0.72rem', fontWeight: 600,
              background: '#F3F4F6', color: '#6B7280',
              border: '1px solid #E5E7EB',
            }}>{ext}</span>
          ))}
        </div>

        {/* Hint */}
        <p className="text-xs flex items-center gap-1" style={{ color: '#D1D5DB' }}>
          <Sparkles size={11} style={{ color: '#FFC107' }} />
          Auto-generates KPI cards, charts & smart filters instantly
        </p>

        <input
          ref={inputRef} type="file"
          accept=".xlsx,.xls,.csv,.json"
          className="hidden"
          onChange={e => process(e.target.files[0])}
        />
      </motion.div>

      {/* Status messages */}
      <div className="mt-4 space-y-3">
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <Loader2 size={16} style={{ color: '#10B981' }} className="animate-spin" />
              <span className="text-sm" style={{ color: '#374151' }}>Parsing file…</span>
            </motion.div>
          )}

          {fileInfo && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <CheckCircle2 size={16} style={{ color: '#10B981' }} className="shrink-0" />
              <FileText size={14} style={{ color: '#6B7280' }} className="shrink-0" />
              <span className="text-sm font-medium" style={{ color: '#111827' }}>{fileInfo.name}</span>
              <div className="ml-auto flex gap-2">
                <span className="badge">{fileInfo.rows.toLocaleString()} rows</span>
                <span className="badge">{fileInfo.cols} cols</span>
              </div>
            </motion.div>
          )}

          {err && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
            >
              <AlertCircle size={16} style={{ color: '#EF4444' }} className="shrink-0" />
              <span className="text-sm" style={{ color: '#DC2626' }}>{err}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
