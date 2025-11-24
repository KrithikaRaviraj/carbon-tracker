import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import api from '../api/api'
import '../Profile.css'

export default function Profile() {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const res = await api.get('/profile')
      setProfile(res.data)
      setName(res.data.name || '')
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  async function updateName() {
    if (!name.trim()) {
      toast.error('Please enter a name')
      return
    }
    try {
      await api.put('/profile/name', { name })
      toast.success('Name updated successfully! 🎉')
      setProfile({...profile, name})
    } catch (err) {
      toast.error('Failed to update name')
    }
  }

  async function changePassword() {
    if (!passwords.currentPassword) {
      toast.error('Please enter current password')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      const response = await api.put('/profile/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      toast.success('Password changed successfully! 🔒')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      
      if (response.data.logout) {
        setTimeout(() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }, 2000)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
  }

  if (loading) return <div className="profile-container">Loading...</div>

  return (
    <div className="profile-container">
      <Toaster position="top-right" />
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>Account Information</h3>
          <div className="profile-info">
            <div className="info-item">
              <label>Email</label>
              <div className="info-value">{profile.email}</div>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <div className="info-value">
                {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Account Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{profile.totalActivities}</div>
              <div className="stat-label">Total Activities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{profile.totalEmissions?.toFixed(1)} kg</div>
              <div className="stat-label">Total CO₂ Tracked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {profile.totalActivities > 0 ? (profile.totalEmissions / profile.totalActivities).toFixed(1) : 0} kg
              </div>
              <div className="stat-label">Avg per Activity</div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Update Name</h3>
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="profile-input"
            />
            <button onClick={updateName} className="profile-btn">
              Update Name
            </button>
          </div>
        </div>

        <div className="profile-card">
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
              className="profile-input"
            />
            <label>New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
              className="profile-input"
            />
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
              className="profile-input"
            />
            <button onClick={changePassword} className="profile-btn">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}