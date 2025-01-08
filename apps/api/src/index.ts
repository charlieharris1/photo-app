import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
const { createClient } = require('@supabase/supabase-js');

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

app.get('/user/:userId', (req, res) => {
  const userId = req.params.userId
  return res.json({ userId })
})

const supabaseClient = createClient(
  'https://kemizktqnypwjxexthcu.supabase.co',
  "abc"
)

function removeBearerPrefix(token: string) {
  return token.split(" ").pop(); // Split the string by spaces and get the last part
}

app.post('/print', async (req, res) => {
  console.log('Authorization => ', req.headers.authorization)
  const token = removeBearerPrefix(req.headers.authorization as string)
  const user = await supabaseClient.auth.getUser(token)
  console.log('User: ', user)
  const imageId = req.query.imageId
  return res.json({ imageId })
})


// Export the Express app
export default app

