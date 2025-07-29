// src/pages/QuoteDashboard.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton' // ✅ NEW IMPORT

export default function QuoteDashboard() {
  const [quotes, setQuotes] = useState([])
  const navigate = useNavigate()

  // 👇 Use the env variable for the AI backend
  const aiApiUrl = import.meta.env.VITE_AI_API_URL

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetch(`${aiApiUrl}/quotes`, {
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error === 'Unauthorized') {
          navigate('/login')
        } else {
          setQuotes(data)
        }
      })
      .catch(err => console.error('Failed to load quotes:', err))
  }, [navigate, aiApiUrl])

  const handleView = (quote) => {
    // Parse JSON string if needed, then navigate to preview page with full quote data
    const data = typeof quote.data === 'string' ? JSON.parse(quote.data) : quote.data
    navigate('/preview', { state: data })
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <BackButton to="/" /> {/* ✅ BACK TO HOME */}

      <h1 className="text-3xl font-bold mb-4 text-gray-900">📁 Saved Quotes</h1>

      {quotes.length === 0 ? (
        <p className="text-gray-600">No saved quotes yet.</p>
      ) : (
        <div className="grid gap-4">
          {quotes.map((q) => (
            <div
              key={q.quoteId}
              className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{q.quoteName}</h2>
                <p className="text-gray-700 text-sm">Created: {new Date(q.dateCreated).toLocaleString()}</p>
                <p className="text-gray-700 text-sm">ID: {q.quoteId}</p>
              </div>
              <button
                onClick={() => handleView(q)}
                className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 self-start md:self-center"
              >
                View Quote
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
