import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function QuotePreview() {
  const navigate = useNavigate()
  const { state: savedQuoteData } = useLocation()

  // Map AI "quantity" → "qty" for inputs and "description" → "desc"
  const [formData] = useState(savedQuoteData?.formData || {})

  const [materials, setMaterials] = useState(() => {
    if (!savedQuoteData?.materials) return []
    return savedQuoteData.materials.map(item => ({
      ...item,
      qty: item.quantity ?? 0,
      unitPrice: item.unitPrice ?? 0,
      desc: item.description ?? ''
    }))
  })

  const [labor, setLabor] = useState(savedQuoteData?.labor || {
    workers: 3,
    payPerHour: 30,
    hoursPerDay: 8,
    days: 2,
    laborMarkup: 25,
    materialsMarkup: 15,
  })

  // 👇 Use the env variable for the AI backend
  const aiApiUrl = import.meta.env.VITE_AI_API_URL

  const handleMaterialChange = (index, field, value) => {
    const updated = [...materials]
    updated[index][field] =
      field === 'qty' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    setMaterials(updated)
  }

  const deleteMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  const addMaterial = () => {
    setMaterials([...materials, { name: '', desc: '', qty: 1, unitPrice: 0 }])
  }

  const handleLaborChange = (field, value) => {
    setLabor({ ...labor, [field]: parseFloat(value) || 0 })
  }

  const materialCost = materials.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0)
  const laborBase = labor.workers * labor.payPerHour * labor.hoursPerDay * labor.days
  const totalLabor = laborBase * (1 + labor.laborMarkup / 100)
  const totalMaterials = materialCost * (1 + labor.materialsMarkup / 100)
  const total = totalLabor + totalMaterials

  const handleGenerateQuote = () => {
    navigate('/customer-quote', {
      state: { formData, materials, labor, total },
    })
  }

  const handleSaveQuote = async () => {
    const quoteName = prompt('Enter a name for this quote (e.g., "Smith Drywall Job")')
    if (!quoteName) return

    const quoteData = {
      formData,
      materials,
      labor,
      total,
    }

    const token = localStorage.getItem('token')
    if (!token) {
      alert('⚠️ You must be logged in to save a quote.')
      navigate('/login')
      return
    }

    try {
      const res = await fetch(`${aiApiUrl}/save-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ quoteName, quoteData }),
      })
      const json = await res.json()
      if (json.success) {
        alert('Quote saved successfully!')
      } else {
        alert('Failed to save quote')
      }
    } catch (err) {
      console.error('Save failed', err)
      alert('Error saving quote')
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 text-black max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">← Prev</button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold">Quote</h1>
          <p className="text-sm text-gray-500">Due: {formData?.projectEndDate || 'N/A'}</p>
        </div>
      </div>

      <div id="quote-section" className="bg-white text-black p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold">From</h2>
            <p>{formData?.fromCompany}<br />{formData?.fromName}<br />{formData?.fromEmail}<br />{formData?.fromPhone}<br />{formData?.fromAddress}</p>
          </div>
          <div>
            <h2 className="font-semibold">To</h2>
            <p>{formData?.toCompany}<br />{formData?.toName}<br />{formData?.toEmail}<br />{formData?.toPhone}<br />{formData?.toAddress}</p>
          </div>
        </div>

        <div className="text-sm text-gray-700 italic mt-4">
          Project Details: {formData?.projectDetails || 'N/A'}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Items</h2>
            <button onClick={addMaterial} className="bg-black text-white px-3 py-1 rounded">+ Add Item</button>
          </div>

          {materials.map((item, index) => (
            <div key={index} className="flex flex-col gap-1 border-b py-3">
              <input
                type="text"
                value={item.name}
                onChange={e => handleMaterialChange(index, 'name', e.target.value)}
                placeholder="Item name"
                className="text-base font-medium w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={item.desc}
                onChange={e => handleMaterialChange(index, 'desc', e.target.value)}
                placeholder="Item description"
                className="text-sm text-gray-500 w-full bg-transparent border-b border-gray-100 focus:outline-none focus:border-gray-400"
              />
              <div className="flex justify-between items-center text-sm mt-1">
                <div className="flex gap-2 items-center">
                  <label>Qty:</label>
                  <input
                    type="number"
                    value={item.qty}
                    min={0}
                    onChange={e => handleMaterialChange(index, 'qty', e.target.value)}
                    className="w-16 border-b border-gray-300 text-center bg-transparent focus:outline-none focus:border-black"
                  />
                  <label>Price:</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    min={0}
                    step={0.01}
                    onChange={e => handleMaterialChange(index, 'unitPrice', e.target.value)}
                    className="w-20 border-b border-gray-300 text-center bg-transparent focus:outline-none focus:border-black"
                  />
                </div>
                <div className="font-semibold">
                  ${ (item.qty * item.unitPrice).toFixed(2) }
                </div>
                <button onClick={() => deleteMaterial(index)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Labor</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(labor).map((key) => (
              <div key={key}>
                <label className="text-sm capitalize">{key}</label>
                <input
                  type="number"
                  value={labor[key]}
                  onChange={e => handleLaborChange(key, e.target.value)}
                  className="w-full border px-2 py-1 rounded text-black"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-right space-y-2">
          <div>Material Total: ${materialCost.toFixed(2)}</div>
          <div>Labor Total: ${totalLabor.toFixed(2)}</div>
          <div className="font-bold text-lg">Total: ${total.toFixed(2)}</div>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={handleSaveQuote}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              💾 Save Quote
            </button>
            <button
              onClick={handleGenerateQuote}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Finalize Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
