// ✅ Clean server.js - handles future API or backend expansion
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Root route - sanity check
app.get('/', (req, res) => {
  res.send('Backend server is running!')
})

// Add future routes here (e.g., /login, /save-quote, etc.)

app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`)
})