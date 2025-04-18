import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express()

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ai-ama.vercel.app',
    'https://your-vercel-domain.vercel.app' // Add your actual Vercel domain
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json())

// Handle preflight requests
app.options('*', cors());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt
    console.log('Received prompt:', prompt)

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

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
