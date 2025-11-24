import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddActivity from './pages/AddActivity'
import Activities from './pages/Activities'
import Goals from './pages/Goals'
import Export from './pages/Export'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './Home.css'
import './Sidebar.css'

function App(){
  const [isAuth, setIsAuth] = React.useState(!!localStorage.getItem('token'))
  
  // Listen for storage changes to update auth state
  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem('token'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  return (
    <div>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      {isAuth && <Sidebar />}
      <div className={isAuth ? 'main-content' : ''}>
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Home/>} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="/dashboard" element={isAuth ? <Dashboard/> : <Navigate to="/login" replace />} />
          <Route path="/add" element={isAuth ? <AddActivity/> : <Navigate to="/login" replace />} />
          <Route path="/activities" element={isAuth ? <Activities/> : <Navigate to="/login" replace />} />
          <Route path="/goals" element={isAuth ? <Goals/> : <Navigate to="/login" replace />} />
          <Route path="/export" element={isAuth ? <Export/> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile/> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App