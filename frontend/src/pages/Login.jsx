import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import '../Login.css'

export default function Login({ setIsAuth }){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      if (isRegister) {
        await api.post('/auth/register', { email, password })
        setError(null)
        setIsRegister(false)
        setPassword('')
        alert('Account created! Please login.')
      } else {
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        setIsAuth(true)
        navigate('/dashboard')
      }
    }catch(err){
      setError(err?.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'))
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🌱</div>
          <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isRegister ? 'Create your Carbon Tracker account' : 'Sign in to your Carbon Tracker account'}</p>
        </div>
        
        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="form-input"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isRegister ? 'Creating...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button" 
              onClick={() => {setIsRegister(!isRegister); setError(null)}} 
              className="link"
              style={{background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline'}}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}