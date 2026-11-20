import * as XLSX from 'xlsx'
import Papa from 'papaparse'

// ─── Type Inference ───────────────────────────────────────────────────────────
const DATE_RE = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}|^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/
const CURRENCY_RE = /^[$€£¥]\s*[\d,]+(\.\d+)?$|^[\d,]+(\.\d+)?\s*[$€£¥]$/

function inferType(value) {
  if (value === null || value === undefined || value === '') return 'null'
  const s = String(value).trim()
  if (!s) return 'null'

  // Excel serial date (number between 1 and 73000 ≈ year 1900-2100)
  if (typeof value === 'number' && value > 0 && value < 73000 && Number.isInteger(value)) {
    // could be a serial date — but we can't tell without more context, treat as number
  }

  // Boolean
  if (/^(true|false|yes|no)$/i.test(s)) return 'boolean'

  // Currency → numeric
  if (CURRENCY_RE.test(s)) return 'number'

  // Percentage → numeric
  if (/^-?\d+(\.\d+)?%$/.test(s)) return 'number'

  // Date
  if (DATE_RE.test(s) && !isNaN(Date.parse(s))) return 'date'

  // Number
  const n = Number(s.replace(/,/g, ''))
  if (!isNaN(n) && s !== '') return 'number'

  return 'string'
}

function cleanValue(v, type) {
  if (v === null || v === undefined || String(v).trim() === '') return null
  const s = String(v).trim()
  if (type === 'number') {
    const stripped = s.replace(/[$€£¥,%\s]/g, '').replace(/,/g, '')
    const n = Number(stripped)
    return isNaN(n) ? null : n
  }
  if (type === 'date') {
    const d = new Date(s)
    return isNaN(d.getTime()) ? null : d.toISOString()
  }
  if (type === 'boolean') return /^(true|yes)$/i.test(s)
  return s
}

// ─── Column Stats ─────────────────────────────────────────────────────────────
function computeStats(rows, col, type) {
  if (type !== 'number') return null
  const vals = rows.map(r => r[col]).filter(v => v !== null && !isNaN(v))
  if (!vals.length) return null
  const sum = vals.reduce((a, b) => a + b, 0)
  const avg = sum / vals.length
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  return {
    count: vals.length,
    sum: Math.round(sum * 1000) / 1000,
    avg: Math.round(avg * 1000) / 1000,
    min: Math.round(min * 1000) / 1000,
    max: Math.round(max * 1000) / 1000,
  }
}

// ─── Normalize ────────────────────────────────────────────────────────────────
function normalize(rawRows) {
  if (!rawRows || rawRows.length === 0) return { rows: [], columns: [], types: {}, stats: {}, numericCols: [], dateCols: [], categoricalCols: [] }

  const columns = Object.keys(rawRows[0])

  // Infer types per column (use first non-null value, but also check top 10 rows for confidence)
  const types = {}
  columns.forEach(col => {
    const typeCounts = {}
    for (let i = 0; i < Math.min(rawRows.length, 20); i++) {
      const t = inferType(rawRows[i][col])
      if (t !== 'null') typeCounts[t] = (typeCounts[t] || 0) + 1
    }
    // pick dominant type
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
    types[col] = sorted.length ? sorted[0][0] : 'string'
  })

  // Mark columns that are >90% null as 'empty'
  columns.forEach(col => {
    const nullCount = rawRows.filter(r => r[col] === null || r[col] === undefined || String(r[col]).trim() === '').length
    if (nullCount / rawRows.length > 0.9) types[col] = 'empty'
  })

  // Clean rows
  const rows = rawRows.map(r => {
    const out = {}
    for (const col of columns) {
      out[col] = cleanValue(r[col], types[col])
    }
    return out
  })

  // Pre-compute stats and categorize columns
  const stats = {}
  const numericCols = []
  const dateCols = []
  const categoricalCols = []

  columns.forEach(col => {
    const t = types[col]
    if (t === 'number') {
      numericCols.push(col)
      stats[col] = computeStats(rows, col, t)
    } else if (t === 'date') {
      dateCols.push(col)
    } else if (t === 'string' || t === 'boolean') {
      categoricalCols.push(col)
    }
  })

  return { rows, columns, types, stats, numericCols, dateCols, categoricalCols }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function parseFile(file) {
  const name = file.name.toLowerCase()

  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    const arrayBuffer = await file.arrayBuffer()
    const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false })
    return normalize(json)
  }

  if (name.endsWith('.csv')) {
    const text = await file.text()
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: false })
    return normalize(parsed.data)
  }

  if (name.endsWith('.json')) {
    const text = await file.text()
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) return normalize(parsed)
    if (parsed.data && Array.isArray(parsed.data)) return normalize(parsed.data)
    throw new Error('Unsupported JSON structure — expected an array or { data: [...] }')
  }

  throw new Error(`Unsupported file type: ${file.name}`)
}
