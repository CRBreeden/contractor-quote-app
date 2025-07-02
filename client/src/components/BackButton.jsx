import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function BackButton({ to, state }) {
  const navigate = useNavigate()

  const goBack = () => {
    if (to) {
      navigate(to, { state }) // Pass along the state if provided
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={goBack}
      className="flex items-center gap-2 bg-white border border-gray-300 shadow-md px-3 py-1.5 text-sm text-blue-600 hover:bg-gray-100 rounded mb-4"
      style={{ backgroundColor: 'white' }} // enforce white background
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  )
}

