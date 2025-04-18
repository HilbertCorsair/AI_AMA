import * as dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'
import cors from 'cors'

dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Helper function to initialize CORS
const initCORS = cors();

// Vercel serverless function
export default async function handler(req, res) {
  // Handle CORS
  await new Promise((resolve, reject) => {
    initCORS(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  // Add a test GET endpoint
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API is working' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: prompt
      }],
    });

    console.log('Anthropic response:', completion);

    return res.status(200).json({
      bot: completion.content[0].text
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
