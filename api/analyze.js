export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, maxTokens } = req.body;
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'API key not configured', 
      debug: 'VITE_ANTHROPIC_API_KEY not found in environment' 
    });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens || 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      // Return the actual error from Anthropic for debugging
      return res.status(response.status).json({ 
        error: 'Anthropic API error',
        status: response.status,
        details: responseText,
        keyPrefix: apiKey.substring(0, 10) + '...'
      });
    }

    const data = JSON.parse(responseText);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      stack: error.stack
    });
  }
}