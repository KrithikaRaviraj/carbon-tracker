import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import api from '../api/api'
import ChartLine from '../components/ChartLine'
import ChartPie from '../components/ChartPie'
import ChartBar from '../components/ChartBar'
import '../Dashboard.css'

export default function Dashboard(){
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [filter, setFilter] = useState('7days')
  const [goals, setGoals] = useState({ dailyGoal: 0, monthlyGoal: 0 })

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const [activitiesRes, goalsRes, profileRes] = await Promise.all([
          api.get('/activities'),
          api.get('/goals'),
          api.get('/profile')
        ])
        setUser(profileRes.data.email)
        setActivities(activitiesRes.data || [])
        setGoals(goalsRes.data)
        setProfile(profileRes.data)
      }catch(err){
        console.warn('Dashboard load failed', err)
      }finally{ setLoading(false) }
    }
    load()
  },[])

  const filterDays = filter === '7days' ? 7 : 30
  const filteredActivities = activities.filter(a => 
    new Date(a.date) > new Date(Date.now() - filterDays*24*60*60*1000)
  )
  
  const total = filteredActivities.reduce((s,item)=>s + (item.carbonFootprint||0), 0)
  const weeklyTotal = activities.filter(a => 
    new Date(a.date) > new Date(Date.now() - 7*24*60*60*1000)
  ).reduce((s,item)=>s + (item.carbonFootprint||0), 0)
  
  const today = new Date().toISOString().split('T')[0]
  const todayTotal = activities.filter(a => a.date === today).reduce((s,a) => s + a.carbonFootprint, 0)
  const dailyProgress = goals.dailyGoal > 0 ? (todayTotal / goals.dailyGoal) * 100 : 0
  
  const categories = filteredActivities.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + a.carbonFootprint
    return acc
  }, {})
  
  const dailyData = filteredActivities.reduce((acc, a) => {
    const date = a.date
    acc[date] = (acc[date] || 0) + a.carbonFootprint
    return acc
  }, {})
  
  const chartData = Object.entries(dailyData)
    .map(([date, total]) => ({date, total}))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
      total: item.total
    }))

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-spinner">Loading your dashboard...</div>
    </div>
  )

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {profile?.name || user?.split('@')[0]}!</h1>
          <p>Here's your carbon footprint overview</p>
        </div>
        <div className="filter-controls">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-select">
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">🌍</div>
          <div className="stat-value">{total.toFixed(1)} kg</div>
          <div className="stat-label">Total CO₂</div>
        </div>
        <div className="stat-card weekly">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{weeklyTotal.toFixed(1)} kg</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card activities">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{activities.length}</div>
          <div className="stat-label">Activities</div>
        </div>
        <div className="stat-card avg">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{todayTotal.toFixed(1)} kg</div>
          <div className="stat-label">Today's CO₂</div>
          {goals.dailyGoal > 0 && (
            <div className="goal-progress">
              <div className={`progress-mini ${dailyProgress > 100 ? 'danger' : dailyProgress > 80 ? 'warning' : ''}`}>
                <div className="progress-mini-fill" style={{width: `${Math.min(dailyProgress, 100)}%`}}></div>
              </div>
              <div className="goal-text">{dailyProgress.toFixed(0)}% of goal</div>
            </div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Daily Emissions</h3>
          <ChartBar data={chartData} />
        </div>
        <div className="chart-card">
          <h3>Category Breakdown</h3>
          <ChartPie data={categories} />
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Weekly Summary</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">This Week</span>
              <span className="summary-value">{weeklyTotal.toFixed(1)} kg CO₂</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Daily Average</span>
              <span className="summary-value">{(weeklyTotal/7).toFixed(1)} kg CO₂</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Activities</span>
              <span className="summary-value">{filteredActivities.length}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activities</h3>
          {filteredActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No activities yet</p>
              <Link to="/add" className="btn-primary">Add Your First Activity</Link>
            </div>
          ) : (
            <div className="activities-list">
              {filteredActivities.slice(0, 5).map(activity => (
                <div key={activity.id} className="activity-item-small">
                  <div className="activity-info">
                    <div className="activity-title">{activity.description}</div>
                    <div className="activity-meta">{activity.category} • {activity.date}</div>
                  </div>
                  <div className="activity-carbon">{activity.carbonFootprint.toFixed(1)} kg</div>
                </div>
              ))}
              <Link to="/activities" className="view-all-link">View All Activities →</Link>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/add" className="action-btn primary">
          <span className="action-icon">➕</span>
          Add Activity
        </Link>
        <Link to="/activities" className="action-btn secondary">
          <span className="action-icon">📋</span>
          View All
        </Link>
        <Link to="/export" className="action-btn secondary">
          <span className="action-icon">📥</span>
          Export Data
        </Link>
      </div>
    </div>
  )
}