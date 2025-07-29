// src/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton' // ✅ NEW IMPORT

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false)

  // 👇 Use env variable for backend URL
  const aiApiUrl = import.meta.env.VITE_AI_API_URL

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!agreeTerms || !agreeDisclaimer) {
      alert('You must agree to the terms and disclaimer.')
      return
    }

    const res = await fetch(`${aiApiUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        agreed_to_terms: true
      })
    })

    const data = await res.json()

    if (!data.success) {
      alert(data.error || 'Signup failed')
      return
    }

    alert('Account created! Please log in.')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <BackButton to="/" /> {/* ✅ BACK TO HOME */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-black">Create Account</h1>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-black"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-black"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded text-black"
          required
        />

        <div className="text-sm space-y-2 text-black">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="mt-1"
            />
            <span>
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 underline" target="_blank">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 underline" target="_blank">
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeDisclaimer}
              onChange={e => setAgreeDisclaimer(e.target.checked)}
              className="mt-1"
            />
            <span>
              I understand that quotes are AI-generated estimates only. I am responsible for confirming all pricing.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Create Account
        </button>

        <p className="text-sm text-black text-center mt-2">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  )
}
