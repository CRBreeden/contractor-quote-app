// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const prompts = [
  {
    input: 'I need a quote for a new deck project using pressure-treated lumber.',
    title: 'New Deck Construction',
    lines: [
      ['2x6x12 Pressure Treated Lumber (10)', '$150.00'],
      ['Deck Screws (500 ct)', '$45.00'],
      ['Labor (10 hrs @ $50/hr)', '$500.00'],
    ],
    total: '$695.00'
  },
  {
    input: 'Estimate for replacing a bathroom vanity and flooring.',
    title: 'Bathroom Remodel Quote',
    lines: [
      ['Vanity Cabinet + Sink', '$350.00'],
      ['Vinyl Flooring (60 sq ft)', '$120.00'],
      ['Labor (6 hrs @ $60/hr)', '$360.00'],
    ],
    total: '$830.00'
  },
  {
    input: 'Build a basic garden shed with wood and metal roof.',
    title: 'Garden Shed Build',
    lines: [
      ['Framing Lumber + Siding', '$600.00'],
      ['Metal Roofing Kit', '$275.00'],
      ['Labor (12 hrs @ $45/hr)', '$540.00'],
    ],
    total: '$1,415.00'
  }
]

export default function Home() {
  const navigate = useNavigate()
  const [step, setStep] = useState('typing')
  const [typedText, setTypedText] = useState('')
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentPrompt = prompts[index % prompts.length]

  useEffect(() => {
    let i = 0
    setTypedText('')
    setStep('typing')

    const type = setInterval(() => {
      if (i < currentPrompt.input.length) {
        setTypedText(prev => prev + currentPrompt.input[i])
        i++
      } else {
        clearInterval(type)
        setStep('generating')
        setTimeout(() => {
          setStep('quote')
          setTimeout(() => setIndex(i => i + 1), 5000)
        }, 2000)
      }
    }, 40)

    return () => clearInterval(type)
  }, [index])

  // NEW: Stripe Subscribe Handler (redirects to Stripe Checkout)
  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/create-subscription-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'customer@example.com' }) // Replace with actual user email if available
      })

      const { url, error } = await response.json()

      if (error) {
        setError(error)
        setLoading(false)
        return
      }

      // Directly redirect to Stripe Checkout page
      window.location.href = url
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            <span className="text-orange-600">You Build.</span><br />
            <span className="text-gray-900">We Quote.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-md">
            Get accurate, AI-powered estimates in minutes. Plan, price, and quote any project with DoerAI.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/Signup')} className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-900 transition">Try For Free →</button>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            ⭐⭐⭐⭐⭐ Over 1,000 quotes generated — Powering the future of doing.
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          {step === 'typing' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 h-60 flex items-start">
              <div className="text-sm font-mono whitespace-pre-wrap text-gray-700">
                {typedText}<span className="animate-pulse">|</span>
              </div>
            </div>
          )}
          {step === 'generating' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 h-60 flex items-center justify-center">
              <p className="text-sm text-gray-500 animate-pulse">Generating quote...</p>
            </div>
          )}
          {step === 'quote' && (
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
              <p className="text-sm text-orange-600 font-semibold mb-1">QUOTE #1234</p>
              <p className="text-xs text-gray-500 mb-4">Valid until 7/12/2025 • Issued 6/12/2025</p>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentPrompt.title}</h2>
              <div className="border-t border-gray-200 mt-4 pt-4">
                {currentPrompt.lines.map(([desc, amt], idx) => (
                  <div className="flex justify-between mb-2" key={idx}>
                    <span className="text-sm text-gray-600">{desc}</span>
                    <span className="text-sm font-medium text-gray-700">{amt}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{currentPrompt.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Section */}
      <section className="px-6 py-20 bg-white border-t">
        <h2 className="text-3xl font-bold text-center mb-10">Pricing</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div onClick={() => navigate('/pricing/free')} className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Free</h3>
            <p className="text-gray-600 mb-4">Perfect for DIYers and students.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✔ 3 Quotes / Month</li>
              <li>✔ Basic AI Assistance</li>
              <li>✖ PDF Download</li>
              <li>✖ Saved Dashboard</li>
            </ul>
            <p className="mt-6 font-bold text-lg text-gray-800">$0/month</p>
          </div>

          <div onClick={() => navigate('/pricing/pro')} className="cursor-pointer bg-white border-2 border-blue-600 rounded-lg shadow p-6 text-left hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">Pro</h3>
            <p className="text-gray-600 mb-4">For solo contractors & builders.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✔ Unlimited Quotes</li>
              <li>✔ PDF Exports</li>
              <li>✔ Saved Projects Dashboard</li>
              <li>✔ AI Quote Optimization</li>
            </ul>
            <p className="mt-6 font-bold text-lg text-blue-600">$19/month</p>
          </div>

          <div onClick={() => navigate('/pricing/enterprise')} className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Enterprise</h3>
            <p className="text-gray-600 mb-4">Built for teams and companies.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✔ Team Accounts</li>
              <li>✔ Bulk Quote API Access</li>
              <li>✔ Admin Dashboard</li>
              <li>✔ Custom Branding</li>
            </ul>
            <p className="mt-6 font-bold text-lg text-gray-800">Contact Us</p>
          </div>
        </div>

        {/* Subscribe Button Section */}
        <div className="mt-16 text-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Subscribe to Pro Plan"}
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 py-10 border-t px-4">
        © {new Date().getFullYear()} DoerAI. Built for doers.
      </footer>
    </div>
  )
}
