import React from 'react'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black space-y-4">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p>This app provides AI-generated quotes based on user input.</p>
      <p>By using this app, you agree:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>You are responsible for verifying all material and labor pricing before use.</li>
        <li>The app is provided “as-is” with no guarantees of accuracy or fitness for any particular job.</li>
        <li>We are not liable for any financial loss resulting from decisions made using the app.</li>
      </ul>
      <p>We reserve the right to update these terms at any time.</p>
    </div>
  )
}
