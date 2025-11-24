import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import '../Activity.css'

export default function AddActivity(){
  const [category,setCategory] = useState('Transportation')
  const [activity,setActivity] = useState('car')
  const [value,setValue] = useState('')
  const [date,setDate] = useState('')
  const [msg,setMsg] = useState(null)
  const navigate = useNavigate()

  const activities = {
    Transportation: {
      car: { unit: 'km', factor: 0.21 },
      bus: { unit: 'km', factor: 0.05 },
      train: { unit: 'km', factor: 0.04 },
      flight: { unit: 'km', factor: 0.25 }
    },
    Energy: {
      electricity: { unit: 'kWh', factor: 0.5 },
      gas: { unit: 'kWh', factor: 0.2 },
      heating: { unit: 'kWh', factor: 0.3 }
    },
    Food: {
      chicken: { unit: 'meals', factor: 1.1 },
      vegetarian: { unit: 'meals', factor: 0.4 },
      dairy: { unit: 'servings', factor: 0.9 }
    }
  }

  async function submit(e){
    e.preventDefault()
    setMsg(null)
    try{
      const activityData = activities[category][activity]
      const carbonFootprint = parseFloat(value) * activityData.factor
      
      const payload = { 
        category, 
        description: `${activity} - ${value} ${activityData.unit}`, 
        carbonFootprint, 
        date: date || new Date().toISOString().split('T')[0] 
      }
      await api.post('/activities', payload)
      toast.success(`Activity saved! ${carbonFootprint.toFixed(2)} kg CO₂`)
      setValue('')
      setTimeout(()=>navigate('/dashboard'),1000)
    }catch(err){
      toast.error('Failed to save activity')
    }
  }

  return (
    <div className="add-activity-container">
      <div className="add-activity-card">
        <div className="add-activity-header">
          <h1>Add New Activity</h1>
          <p>Track your carbon footprint by logging daily activities</p>
        </div>
        <form onSubmit={submit} className="activity-form">
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={e=>{setCategory(e.target.value); setActivity(Object.keys(activities[e.target.value])[0])}} className="form-input">
              {Object.keys(activities).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          
          <div className="form-group">
            <label>Activity</label>
            <select value={activity} onChange={e=>setActivity(e.target.value)} className="form-input">
              {Object.keys(activities[category]).map(act => {
                const data = activities[category][act]
                return <option key={act} value={act}>{act} ({data.unit})</option>
              })}
            </select>
          </div>
          
          <div className="form-group">
            <label>Amount ({activities[category][activity]?.unit})</label>
            <input 
              type="number" 
              step="0.1" 
              placeholder={`Enter ${activities[category][activity]?.unit}`} 
              value={value} 
              onChange={e=>setValue(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e=>setDate(e.target.value)} 
              className="form-input"
            />
          </div>
          
          <button type="submit" className="submit-btn">Add Activity</button>
          {msg && <div className="message">{msg}</div>}
        </form>
      </div>
    </div>
  )
}