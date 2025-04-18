import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = path.join(__dirname, '.env')

// Debug information
console.log('Current directory:', __dirname)
console.log('.env file exists:', fs.existsSync(envPath))
console.log('.env file content:', fs.readFileSync(envPath, 'utf8'))

// Load environment variables
dotenv.config({ path: envPath })

console.log('ANTHROPIC_API_KEY loaded:', !!process.env.ANTHROPIC_API_KEY)

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set in environment variables');
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'));

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Work under way!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const completion = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: prompt
      }],
    });

    res.status(200).send({
      bot: completion.content[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'We have a problem.');
  }
})

app.listen(5000, () => console.log('AI-AMA'))
