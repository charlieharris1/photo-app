import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createClient } from '@supabase/supabase-js';

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
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_SECRET_KEY as string
)

function removeBearerPrefix(token: string) {
  return token.split(" ").pop(); // Split the string by spaces and get the last part
}

// TODO: RLS?
app.post('/current-print-batch/files', async (req, res) => {
  const { files } = req.body
  const token = removeBearerPrefix(req.headers.authorization as string)
  const user = await supabaseClient.auth.getUser(token)
  const userId = user?.data?.user?.id

  if (userId) {
    // TODO: Add validation here.
    const now = new Date().toISOString(); // Current timestamp
    await supabaseClient.from('current_print_batch').insert(files.map((file: { filePath: string}) => ({
      user_id: userId,
      file_path: file.filePath,
      created_at: now,
      last_updated_at: now
    })))

    // TODO: Handle error inserting.
  }

  return res.sendStatus(204)
})


export default app

