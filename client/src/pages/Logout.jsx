// src/pages/Logout.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton' // ✅ NEW IMPORT

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    navigate('/login')
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <BackButton to="/" /> {/* ✅ BACK TO HOME */}
      <p className="text-center mt-10 text-gray-600">Logging out...</p>
    </div>
  )
}
