import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ isAuth, setIsAuth }){
  const navigate = useNavigate()
  function logout(){
    localStorage.removeItem('token')
    setIsAuth(false)
    navigate('/login')
  }
  return (
    <div className="nav">
      <div style={{fontWeight:700}}>Carbon Tracker</div>
      <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
        <ThemeToggle />
        {isAuth ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} style={{marginLeft:12}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  )
}