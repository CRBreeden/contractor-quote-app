import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import QuoteDashboard from './pages/QuoteDashboard'
import QuoteDetails from './pages/QuoteDetails'
import QuotePreview from './pages/QuotePreview'
import QuoteCustomerView from './pages/QuoteCustomerView'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

// 🛡️ Protected route wrapper
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quote" element={<QuoteDetails />} />

      {/* 🔒 Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <QuoteDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview"
        element={
          <ProtectedRoute>
            <QuotePreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-quote"
        element={
          <ProtectedRoute>
            <QuoteCustomerView />
          </ProtectedRoute>
        }
      />

      {/* Auth routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Legal pages */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  )
}
