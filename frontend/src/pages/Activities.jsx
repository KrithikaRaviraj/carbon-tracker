import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/api'
import '../Activity.css'

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    try {
      const res = await api.get('/activities')
      setActivities(res.data)
    } catch (err) {
      console.error('Failed to load activities', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteActivity(id) {
    try {
      await api.delete(`/activities/${id}`)
      setActivities(activities.filter(a => a.id !== id))
      toast.success('Activity deleted')
    } catch (err) {
      toast.error('Failed to delete activity')
    }
  }
  
  function startEdit(activity) {
    setEditingId(activity.id)
    // Extract original values from description
    const descParts = activity.description.split(' - ')
    const activityType = descParts[0]
    const amount = parseFloat(descParts[1]) || 0
    
    setEditForm({
      category: activity.category,
      description: activity.description,
      activityType: activityType,
      amount: amount,
      carbonFootprint: activity.carbonFootprint,
      date: activity.date
    })
  }
  
  async function saveEdit() {
    try {
      // Recalculate carbon footprint based on activity type and amount
      const activityTypes = {
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
      
      const categoryActivities = activityTypes[editForm.category] || {}
      const activityData = categoryActivities[editForm.activityType] || { factor: 1, unit: 'units' }
      const newCarbonFootprint = editForm.amount * activityData.factor
      const newDescription = `${editForm.activityType} - ${editForm.amount} ${activityData.unit}`
      
      const updateData = {
        category: editForm.category,
        description: newDescription,
        carbonFootprint: newCarbonFootprint,
        date: editForm.date
      }
      
      console.log('Saving edit:', updateData)
      const response = await api.put(`/activities/${editingId}`, updateData)
      console.log('Edit saved:', response.data)
      
      setActivities(activities.map(a => 
        a.id === editingId ? {...a, ...updateData} : a
      ))
      setEditingId(null)
      toast.success('Activity updated')
    } catch (err) {
      console.error('Failed to update activity:', err)
      toast.error(err.response?.data?.message || 'Failed to update activity')
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div className="activities-list">
        <h2>Your Activities</h2>
        {activities.length === 0 ? (
          <div className="card">
            <p>No activities yet. Start tracking your carbon footprint!</p>
          </div>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="activity-item">
              {editingId === activity.id ? (
                <div className="edit-form">
                  <div className="readonly-info">
                    <strong>{editForm.activityType}</strong>
                    <span className="category-badge">{activity.category}</span>
                  </div>
                  
                  <label>Amount ({editForm.activityType === 'car' || editForm.activityType === 'bus' || editForm.activityType === 'train' || editForm.activityType === 'flight' ? 'km' : editForm.activityType === 'electricity' || editForm.activityType === 'gas' || editForm.activityType === 'heating' ? 'kWh' : editForm.activityType === 'chicken' || editForm.activityType === 'vegetarian' ? 'meals' : 'servings'})</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={editForm.amount} 
                    onChange={e => setEditForm({...editForm, amount: parseFloat(e.target.value) || 0})}
                    className="edit-input"
                    placeholder="Amount"
                  />
                  
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={editForm.date} 
                    onChange={e => setEditForm({...editForm, date: e.target.value})}
                    className="edit-input"
                  />
                  
                  <div className="carbon-preview">
                    Carbon Footprint: {(editForm.amount * (editForm.activityType === 'car' ? 0.21 : editForm.activityType === 'bus' ? 0.05 : editForm.activityType === 'train' ? 0.04 : editForm.activityType === 'flight' ? 0.25 : editForm.activityType === 'electricity' ? 0.5 : editForm.activityType === 'gas' ? 0.2 : editForm.activityType === 'heating' ? 0.3 : editForm.activityType === 'chicken' ? 1.1 : editForm.activityType === 'vegetarian' ? 0.4 : 0.9)).toFixed(2)} kg CO₂
                  </div>
                  
                  <div className="edit-actions">
                    <button onClick={saveEdit} className="save-btn">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="activity-info">
                    <h4>{activity.description}</h4>
                    <p>{activity.category} • {activity.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="activity-carbon">
                      {activity.carbonFootprint.toFixed(2)} kg CO₂
                    </div>
                    <button onClick={() => startEdit(activity)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => deleteActivity(activity.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}