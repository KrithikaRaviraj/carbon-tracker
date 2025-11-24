import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/api'
import '../Goals.css'

export default function Goals() {
  const [goals, setGoals] = useState({ dailyGoal: 0, monthlyGoal: 0 })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [goalsRes, activitiesRes] = await Promise.all([
        api.get('/goals'),
        api.get('/activities')
      ])
      setGoals(goalsRes.data)
      setActivities(activitiesRes.data || [])
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function saveGoals() {
    try {
      console.log('Saving goals:', goals)
      const response = await api.post('/goals', goals)
      console.log('Goals saved:', response.data)
      toast.success('Goals updated!')
    } catch (err) {
      console.error('Failed to save goals:', err)
      toast.error(err.response?.data?.message || 'Failed to save goals')
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const todayActivities = activities.filter(a => a.date === today)
  const todayTotal = todayActivities.reduce((s, a) => s + a.carbonFootprint, 0)

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthActivities = activities.filter(a => a.date.startsWith(thisMonth))
  const monthTotal = monthActivities.reduce((s, a) => s + a.carbonFootprint, 0)

  const dailyProgress = goals.dailyGoal > 0 ? (todayTotal / goals.dailyGoal) * 100 : 0
  const monthlyProgress = goals.monthlyGoal > 0 ? (monthTotal / goals.monthlyGoal) * 100 : 0

  if (loading) return <div className="goals-container">Loading...</div>

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>Goals & Progress</h1>
        <p>Set and track your carbon footprint goals</p>
      </div>

      <div className="goals-grid">
        <div className="goal-card">
          <h3>Set Your Goals</h3>
          <div className="goal-form">
            <div className="form-group">
              <label>Daily CO₂ Goal (kg)</label>
              <input
                type="number"
                step="0.1"
                value={goals.dailyGoal}
                onChange={e => setGoals({...goals, dailyGoal: parseFloat(e.target.value) || 0})}
                className="goal-input"
              />
            </div>
            <div className="form-group">
              <label>Monthly CO₂ Goal (kg)</label>
              <input
                type="number"
                step="0.1"
                value={goals.monthlyGoal}
                onChange={e => setGoals({...goals, monthlyGoal: parseFloat(e.target.value) || 0})}
                className="goal-input"
              />
            </div>
            <button onClick={saveGoals} className="save-goals-btn">
              Save Goals
            </button>
          </div>
        </div>

        <div className="progress-card">
          <h3>Today's Progress</h3>
          <div className="progress-info">
            <div className="progress-stats">
              <span className="current">{todayTotal.toFixed(1)} kg</span>
              <span className="target">/ {goals.dailyGoal} kg</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${dailyProgress > 80 ? 'warning' : dailyProgress > 100 ? 'danger' : ''}`}
                style={{width: `${Math.min(dailyProgress, 100)}%`}}
              ></div>
            </div>
            {dailyProgress > 80 && (
              <div className={`warning-text ${dailyProgress > 100 ? 'danger' : ''}`}>
                {dailyProgress > 100 ? '⚠️ Goal exceeded!' : '⚠️ Near goal limit'}
              </div>
            )}
          </div>
        </div>

        <div className="progress-card">
          <h3>Monthly Progress</h3>
          <div className="progress-info">
            <div className="progress-stats">
              <span className="current">{monthTotal.toFixed(1)} kg</span>
              <span className="target">/ {goals.monthlyGoal} kg</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${monthlyProgress > 80 ? 'warning' : monthlyProgress > 100 ? 'danger' : ''}`}
                style={{width: `${Math.min(monthlyProgress, 100)}%`}}
              ></div>
            </div>
            {monthlyProgress > 80 && (
              <div className={`warning-text ${monthlyProgress > 100 ? 'danger' : ''}`}>
                {monthlyProgress > 100 ? '⚠️ Goal exceeded!' : '⚠️ Near goal limit'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}