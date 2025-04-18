import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()

app.use(cors({
  origin: '*',  // Be more permissive with CORS in development
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}))

app.use(express.json())

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

// Main API endpoint
app.post('/api', async (req, res) => {
  try {
    const prompt = req.body.prompt
    console.log('Received prompt:', prompt)

    const completion = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: prompt
      }],
    })

    console.log('Anthropic response:', completion)

    res.status(200).json({
      bot: completion.content[0].text
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
