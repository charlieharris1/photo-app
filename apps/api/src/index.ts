import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()
const port = process.env.PORT || 3001

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
  res.json({ message: 'Welcome to the API' })
})

app.listen(port, () => {
  console.log(`API server listening on port ${port}`)
})

