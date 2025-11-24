import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../Sidebar.css'

export default function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/add', icon: '➕', label: 'Add Activity' },
    { path: '/activities', icon: '📋', label: 'Activities' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/export', icon: '📥', label: 'Export' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}