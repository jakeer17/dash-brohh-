import React from 'react'
import { LayoutDashboard, Table2, Code2, GitBranch } from 'lucide-react'

const VIEWS = [
    { id: 'report', icon: LayoutDashboard, label: 'Report' },
    { id: 'table', icon: Table2, label: 'Table' },
    { id: 'dax', icon: Code2, label: 'DAX' },
    { id: 'query', icon: GitBranch, label: 'Query' },
]

export default function NavRail({ currentView, onViewChange }) {
    return (
        <nav className="pbi-nav-rail">
            {VIEWS.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    className={`pbi-nav-icon ${currentView === id ? 'pbi-nav-icon--active' : ''}`}
                    onClick={() => onViewChange(id)}
                    title={label}
                >
                    <Icon size={18} strokeWidth={1.75} />
                    <span className="pbi-nav-label">{label}</span>
                </button>
            ))}
        </nav>
    )
}
