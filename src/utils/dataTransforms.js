// ─── Standardized Data Transforms ────────────────────────────────────────────
// All transforms accept raw rows + column names and return chart-ready arrays.

/** Aggregate rows by a date column, sum a numeric column → [{date, value}] */
export function buildTrend(rows, dateCol, numCol, filterValue = null) {
    const map = {}
    rows.forEach(r => {
        if (filterValue !== null && r[filterValue?.col] !== filterValue?.val) return
        const raw = r[dateCol]
        if (!raw) return
        const d = String(raw).slice(0, 10)
        map[d] = (map[d] || 0) + (Number(r[numCol]) || 0)
    })
    return Object.keys(map).sort().map(k => ({ date: k, value: Math.round(map[k] * 100) / 100 }))
}

/** Frequency distribution of a categorical column → [{key, count}] */
export function buildDist(rows, col, filterValue = null) {
    const map = {}
    rows.forEach(r => {
        if (filterValue !== null && filterValue.col !== col &&
            r[filterValue?.col] !== filterValue?.val) return
        const v = r[col] != null ? String(r[col]) : 'N/A'
        map[v] = (map[v] || 0) + 1
    })
    return Object.entries(map)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)
}

/** Pie/Donut: aggregate numCol by catCol, or fall back to frequency → [{name, value}] */
export function buildPieData(rows, catCol, numCol = null, filterValue = null) {
    const map = {}
    rows.forEach(r => {
        if (filterValue !== null && filterValue.col !== catCol &&
            r[filterValue?.col] !== filterValue?.val) return
        const key = r[catCol] != null ? String(r[catCol]) : 'N/A'
        const val = numCol ? (Number(r[numCol]) || 0) : 1
        map[key] = (map[key] || 0) + val
    })
    return Object.entries(map)
        .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 12)
}

/** Scatter: two numeric columns → [{x, y, label?}] */
export function buildScatter(rows, xCol, yCol, labelCol = null, filterValue = null) {
    return rows
        .filter(r => {
            if (filterValue !== null && r[filterValue?.col] !== filterValue?.val) return false
            return r[xCol] != null && r[yCol] != null && !isNaN(Number(r[xCol])) && !isNaN(Number(r[yCol]))
        })
        .slice(0, 500)
        .map(r => ({
            x: Number(r[xCol]),
            y: Number(r[yCol]),
            label: labelCol ? String(r[labelCol] ?? '') : undefined,
        }))
}

/** Stacked bar: catCol on X, multiple numCols as stacks → [{key, ...numCols}] */
export function buildStackedDist(rows, catCol, numCols, filterValue = null) {
    const map = {}
    rows.forEach(r => {
        if (filterValue !== null && filterValue.col !== catCol &&
            r[filterValue?.col] !== filterValue?.val) return
        const key = r[catCol] != null ? String(r[catCol]) : 'N/A'
        if (!map[key]) { map[key] = { key }; numCols.forEach(c => { map[key][c] = 0 }) }
        numCols.forEach(c => { map[key][c] += Number(r[c]) || 0 })
    })
    return Object.values(map)
        .sort((a, b) => {
            const sumA = numCols.reduce((s, c) => s + a[c], 0)
            const sumB = numCols.reduce((s, c) => s + b[c], 0)
            return sumB - sumA
        })
        .slice(0, 20)
}

/** Apply filter to raw rows for table display */
export function applyFilter(rows, filterValue) {
    if (!filterValue) return rows
    return rows.filter(r => String(r[filterValue.col] ?? '') === String(filterValue.val))
}

/** Smart default vizType based on column types */
export function suggestVizType(colType, hasDates) {
    if (colType === 'number' && hasDates) return 'line'
    if (colType === 'number') return 'bar'
    if (colType === 'string') return 'bar'
    return 'table'
}

/** Calculate KPI summary for the top N numeric columns.
 *  Returns an array of { label, sum, avg, count, min, max, sparkData }
 *  sparkData is a date-grouped series [{date, value}] if a date column exists,
 *  otherwise a simple index series for sparkline rendering.
 */
export function calculateKPISummary(data, topN = 3) {
    const { rows, numericCols = [], dateCols = [], stats = {} } = data
    const cols = numericCols.slice(0, topN)
    const dateCol = dateCols[0] || null

    return cols.map(col => {
        const s = stats[col] || {}

        // Build sparkline: date-grouped trend or fallback chunked sums
        let sparkData = []
        if (dateCol && rows.length > 0) {
            const map = {}
            rows.forEach(r => {
                const raw = r[dateCol]
                if (!raw) return
                const d = String(raw).slice(0, 7) // YYYY-MM (monthly buckets)
                map[d] = (map[d] || 0) + (Number(r[col]) || 0)
            })
            sparkData = Object.keys(map).sort().map(k => ({
                date: k,
                value: Math.round(map[k] * 100) / 100,
            }))
        } else if (rows.length > 0) {
            // Fallback: chunk rows into 12 equal buckets
            const chunkSize = Math.max(1, Math.floor(rows.length / 12))
            for (let i = 0; i < rows.length; i += chunkSize) {
                const chunk = rows.slice(i, i + chunkSize)
                const val = chunk.reduce((acc, r) => acc + (Number(r[col]) || 0), 0)
                sparkData.push({ date: String(i), value: Math.round(val * 100) / 100 })
            }
        }

        // Calculate trend: compare first half vs second half of sparkData
        let trendPct = null
        if (sparkData.length >= 4) {
            const half = Math.floor(sparkData.length / 2)
            const firstHalf = sparkData.slice(0, half).reduce((a, d) => a + d.value, 0)
            const secondHalf = sparkData.slice(half).reduce((a, d) => a + d.value, 0)
            if (firstHalf !== 0) {
                trendPct = Math.round(((secondHalf - firstHalf) / Math.abs(firstHalf)) * 100)
            }
        }

        return {
            label: col,
            sum: s.sum ?? 0,
            avg: s.avg ?? 0,
            count: s.count ?? 0,
            min: s.min ?? 0,
            max: s.max ?? 0,
            trendPct,
            sparkData,
        }
    })
}

/** Group rows by catCol, sum numCol, return top N sorted desc.
 *  Returns [{key, value}] — ready for charts.
 */
export function groupByAndAggregate(rows, catCol, numCol, topN = 10, filters = {}) {
    if (!catCol || !numCol) return []
    const map = {}
    rows.forEach(r => {
        // Apply any active filters
        for (const [fc, fv] of Object.entries(filters)) {
            if (fv && String(r[fc]) !== fv) return
        }
        const key = r[catCol] != null ? String(r[catCol]) : 'N/A'
        map[key] = (map[key] || 0) + (Number(r[numCol]) || 0)
    })
    return Object.entries(map)
        .map(([key, value]) => ({ key, value: Math.round(value * 100) / 100 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, topN)
}

/** Get unique values for a categorical column (for filter dropdowns) */
export function getUniqueValues(rows, col, limit = 100) {
    const set = new Set()
    for (const row of rows) {
        const v = row[col]
        if (v != null && v !== '') {
            set.add(String(v))
            if (set.size >= limit) break
        }
    }
    return Array.from(set).sort()
}

