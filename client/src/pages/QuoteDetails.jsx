import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import '../App.css'

export default function QuoteDetails() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    fromCompany: '',
    fromName: '',
    fromEmail: '',
    fromPhone: '',
    fromAddress: '',
    toCompany: '',
    toName: '',
    toEmail: '',
    toPhone: '',
    toAddress: '',
    projectDetails: '',
    projectEndDate: '',
  })
  const [loading, setLoading] = useState(false) // loading state added

  // 👇 Use env variable for the AI backend
  const aiApiUrl = import.meta.env.VITE_AI_API_URL

  const handleChange = e => {
    const { name, value } = e.target
    setData(d => ({ ...d, [name]: value }))
  }

  const handleAutofill = () => {
    console.log('Autofill 👷‍♂️', data)
  }

  const handleNext = async () => {
    setLoading(true) // show loading overlay
    try {
      const res = await fetch(`${aiApiUrl}/quote-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') || '',
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        navigate('/preview', {
          state: {
            formData: data,
            materials: result.materials || [],
            labor: result.labor || {},
          },
        })
      } else {
        alert(result.error || 'Failed to submit quote details')
      }
    } catch (err) {
      console.error('Failed to submit details:', err)
      alert('Something went wrong while contacting the server.')
    } finally {
      setLoading(false) // hide loading overlay
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          style={{ paddingTop: '30vh' }} // moves it slightly down from center
        >
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col items-center space-y-4 max-w-xs w-full mx-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-900 text-center">
              Generating your quote, please wait...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <BackButton />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="text-lg font-bold">BLNC</div>
            <h1 className="text-3xl font-extrabold">Quote Details</h1>
            <p className="text-gray-500">Enter quote information and project requirements</p>
          </div>
          <button
            onClick={handleAutofill}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Autofill Forms
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="From *">
            <Input label="Company Name *" name="fromCompany" value={data.fromCompany} onChange={handleChange} />
            <Input label="Contact Name *" name="fromName" value={data.fromName} onChange={handleChange} />
            <Input label="Email *" name="fromEmail" value={data.fromEmail} onChange={handleChange} />
            <Input label="Phone *" name="fromPhone" value={data.fromPhone} onChange={handleChange} />
            <Input label="Address *" name="fromAddress" value={data.fromAddress} onChange={handleChange} />
          </Card>

          <Card title="Bill To *">
            <Input label="Company Name *" name="toCompany" value={data.toCompany} onChange={handleChange} />
            <Input label="Contact Name *" name="toName" value={data.toName} onChange={handleChange} />
            <Input label="Email *" name="toEmail" value={data.toEmail} onChange={handleChange} />
            <Input label="Phone *" name="toPhone" value={data.toPhone} onChange={handleChange} />
            <Input label="Address *" name="toAddress" value={data.toAddress} onChange={handleChange} />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Project Details</label>
            <textarea
              name="projectDetails"
              value={data.projectDetails}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y text-black"
              placeholder="Be as specific as possible about your requirements"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Project End Date *</label>
            <input
              type="date"
              name="projectEndDate"
              value={data.projectEndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={loading}
            className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Generating...' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Input({ label, name, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>
  )
}
