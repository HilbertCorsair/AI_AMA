import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()

// Configure Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://ai-ama.vercel.app',
      'https://ai-ama-vercel.app',
      'https://your-app.onrender.com',  // Add your Render.com domain
      'https://ama-tibi.onrender.com'   // Add your specific Render.com domain
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json())

// Define handlePrompt function before using it
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

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/', handlePrompt);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running ...`));

export default app
