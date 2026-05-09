import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'

function Guard({ children }) {
  const user = localStorage.getItem('as_user')
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div style={{ minHeight:'100vh' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  )
}
