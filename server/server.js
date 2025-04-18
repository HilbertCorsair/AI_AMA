import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()  // Make sure this is called

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express()

app.use(cors())
app.use(express.json())

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

// API endpoint
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
