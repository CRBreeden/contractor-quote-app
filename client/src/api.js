// src/api.js
const API_BASE = 'http://localhost:8000';

export async function getAIQuoteItems(jobDescription) {
  try {
    const res = await fetch(`${API_BASE}/generate-quote-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job: jobDescription }),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch from backend');
    }

    return await res.json();
  } catch (err) {
    console.error('Error calling Flask backend:', err);
    return [];
  }
}