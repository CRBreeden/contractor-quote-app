import React from 'react'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-black space-y-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>We collect the following information when you use this app:</p>
      <ul className="list-disc list-inside space-y-2">
        <li>Account details: name, email, password</li>
        <li>Quote data: material items, labor inputs, project details</li>
      </ul>
      <p>We do not sell your data or share it with third parties. All data is used to help you generate and manage your quotes.</p>
      <p>By creating an account, you consent to this data usage.</p>
    </div>
  )
}
