import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import BackButton from '../components/BackButton' // ✅ NEW IMPORT

export default function QuoteCustomerView() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { formData, materials, labor, total } = state || {}

  const quoteNumber = `Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
  const issueDate = new Date().toLocaleDateString()
  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()

  const handleDownloadPDF = async () => {
    const node = document.getElementById('quote-preview')

    node.style.background = '#ffffff'
    node.style.color = '#000000'
    node.querySelectorAll('*').forEach(el => {
      el.style.background = '#ffffff'
      el.style.color = '#000000'
      el.style.boxShadow = 'none'
      el.style.borderColor = '#cccccc'
    })

    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${quoteNumber}.pdf`)
  }

  const materialTotal = materials.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
  const laborBase = labor.workers * labor.payPerHour * labor.hoursPerDay * labor.days
  const totalLabor = laborBase * (1 + labor.laborMarkup / 100)
  const totalMaterials = materialTotal * (1 + labor.materialsMarkup / 100)

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 text-black max-w-4xl mx-auto">
      <div className="flex justify-between mb-6 items-center">
        <BackButton /> 
        <h1 className="text-3xl font-bold">Customer Quote</h1>
        <button onClick={handleDownloadPDF} className="bg-green-600 text-white px-4 py-2 rounded">Download PDF</button>
      </div>

      <div id="quote-preview" className="bg-white p-8 rounded shadow-md">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-wide">QUOTE</h2>
            <p className="mt-4 whitespace-pre-line text-sm text-gray-700">
              {formData?.fromCompany}<br />
              {formData?.fromAddress}<br />
              {formData?.fromEmail}<br />
              {formData?.fromPhone}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-wide">{formData?.fromCompany || 'Company Name'}</div>
            <div className="text-sm text-gray-500 mt-1">
              Quote No: <strong>{quoteNumber}</strong><br />
              Issue Date: <strong>{issueDate}</strong><br />
              Valid Until: <strong>{validUntil}</strong>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="uppercase text-xs font-bold text-gray-500 mb-1">For:</p>
          <p className="text-sm">
            {formData?.toName}<br />
            {formData?.toCompany}<br />
            {formData?.toAddress}<br />
            {formData?.toEmail}<br />
            {formData?.toPhone}
          </p>
        </div>

        <table className="w-full text-sm mb-6 border-t border-b">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left py-2 px-2">DESCRIPTION</th>
              <th className="text-center py-2 px-2">QUANTITY</th>
              <th className="text-center py-2 px-2">UNIT PRICE ($)</th>
              <th className="text-center py-2 px-2">AMOUNT ($)</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2 px-2">{item.name}</td>
                <td className="text-center py-2 px-2">{item.qty}</td>
                <td className="text-center py-2 px-2">{item.unitPrice.toFixed(2)}</td>
                <td className="text-center py-2 px-2">{(item.qty * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="border-b">
              <td className="py-2 px-2">Installation ({labor.days} day{labor.days > 1 ? 's' : ''})</td>
              <td className="text-center py-2 px-2">—</td>
              <td className="text-center py-2 px-2">—</td>
              <td className="text-center py-2 px-2">{totalLabor.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-right text-lg font-bold">
          TOTAL: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  )
}
