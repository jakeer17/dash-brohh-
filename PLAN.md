# Auto Dash — Architecture & Implementation Plan

## Overview
**Auto Dash** is a browser-only React (Vite) application that transforms uploaded Excel, CSV, or JSON files into instant, premium-quality interactive dashboards — no backend required.

---

## Tech Stack

| Layer | Library | Purpose |
|---|---|---|
| Framework | React 18 + Vite | SPA scaffolding & HMR |
| Styling | Tailwind CSS 3 | Utility-first design system |
| Animations | Framer Motion | Page transitions, card entries, count-up |
| Icons | Lucide React | Consistent icon set |
| Data Parse | SheetJS (xlsx) | Excel `.xlsx` / `.xls` files |
| Data Parse | PapaParse | CSV with header auto-detection |
| Charts | Recharts | Responsive SVG charts with tooltips |
| Screenshot | html2canvas | Dashboard-to-PNG download |

---

## File Structure

```
d:\autodash\
├── index.html                   # App entry point (Google Fonts preloaded)
├── vite.config.js
├── tailwind.config.cjs          # Extended palette: slate-950, emerald, cyan
├── postcss.config.cjs
└── src/
    ├── main.jsx
    ├── App.jsx                  # Shell: header, uploader, dashboard mount
    ├── styles/
    │   └── index.css            # Glassmorphism tokens, scrollbar, glow utilities
    ├── utils/
    │   └── parser.js            # Smart file parser + type inference + stats
    └── components/
        ├── FileUploader.jsx     # Drag-and-drop zone with animations
        ├── Dashboard.jsx        # Grid layout orchestrator
        ├── KeyMetrics.jsx       # Animated metric cards (row count + numeric cols)
        ├── DataTable.jsx        # Searchable, sortable, paginated table
        ├── DownloadButton.jsx   # html2canvas PNG export with toast
        └── charts/
            ├── TrendLineChart.jsx        # Gradient area line chart
            ├── DistributionBarChart.jsx  # Gradient bar chart for categories
            └── PieDonutChart.jsx         # Donut chart for top-6 breakdown
```

---

## Data Flow

```
File Upload
    ↓
parseFile() [parser.js]
    ├── XLSX → sheet_to_json → normalize()
    ├── CSV  → PapaParse   → normalize()
    └── JSON → JSON.parse  → normalize()
         ↓
normalize() returns:
  { rows[], columns[], types{}, stats{}, numericCols[], dateCols[], categoricalCols[] }
         ↓
Dashboard.jsx distributes data to:
  ├── KeyMetrics      (numericCols → sum/avg/min/max cards)
  ├── TrendLineChart  (dateCols[0] × numericCols[0] → time series)
  ├── DistributionBarChart (categoricalCols[0] → frequency distribution)
  ├── PieDonutChart   (categoricalCols[0] → top-6 breakdown)
  └── DataTable       (all rows, searchable + sortable + paginated)
```

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Background | `#020617` (slate-950) | Page background |
| Surface | glassmorphism `rgba(255,255,255,0.04)` | Card backgrounds |
| Accent 1 | `#06b6d4` (cyan-400) | Borders, line chart |
| Accent 2 | `#34d399` (emerald-400) | Bar chart, Upload CTA |
| Text Primary | `#f1f5f9` (slate-100) | Headings, values |
| Text Muted | `#94a3b8` (slate-400) | Labels, placeholders |

---

## Phased Execution

### Phase 1 — Infrastructure
1. Enhance `tailwind.config.cjs` with extended color palette
2. Add Google Fonts (Inter) to `index.html`
3. Rewrite `src/styles/index.css` with premium glassmorphism tokens

### Phase 2 — Data Engine
4. Upgrade `parser.js`: smarter dates, currency/boolean, multi-col arrays, pre-computed stats

### Phase 3 — App Shell
5. Rewrite `App.jsx` with premium header + logo + page transitions
6. Upgrade `FileUploader.jsx` with drag-and-drop + animations

### Phase 4 — Dashboard
7. Upgrade `Dashboard.jsx` for smart multi-column layout
8. Upgrade `KeyMetrics.jsx` with animated count-up cards
9. Upgrade `TrendLineChart.jsx` with gradient fill + custom tooltip
10. Upgrade `DistributionBarChart.jsx` with gradient bars + custom tooltip
11. Add `PieDonutChart.jsx` — new donut chart component
12. Upgrade `DataTable.jsx` — sort + paginate + styled search
13. Upgrade `DownloadButton.jsx` — icon + spinner + toast

### Phase 5 — Verification
14. `npm install` → confirm zero errors
15. `npm run dev` → browser tests for upload flow, charts, table, download
