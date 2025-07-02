import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <Link to="/" className="text-xl font-bold text-blue-600">DoerAI</Link>

      <div className="space-x-4">
        {isLoggedIn && (
          <Link to="/quote" className="text-gray-600 hover:text-blue-600">Quote!</Link>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="items-center gap-2 bg-white border border-gray-300 shadow-md px-3 py-1.5 text-sm hover:bg-gray-100 rounded mb-4"
              style={{ backgroundColor: 'white' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="text-gray-600 hover:text-blue-600">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
