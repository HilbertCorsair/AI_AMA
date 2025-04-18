import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express()

// Configure CORS to allow requests from your client domain
app.use(cors({
  origin: [
    'https://ai-ekwe2zc0c-hilbertcorsairs-projects.vercel.app',
    'https://ai-ama.vercel.app',
    'http://localhost:5173' // for local development
  ],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json())

// Add a root route handler
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const handlePrompt = async (req, res) => {
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
}

// Handle API routes
app.post('/api', handlePrompt)

// Add error logging
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app
