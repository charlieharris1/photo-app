import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

// Create Express app
const app = express()

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Example route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API!!' })
})

// Export the Express app
export default app

