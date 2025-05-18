// Enable CORS for all routes
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return await fn(req, res);
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    const apiUrl = 'https://api.commerce.coinbase.com/charges';

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing Coinbase API key' });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (response.status === 201) {
      return res.status(201).json(data);
    } else {
      return res.status(response.status).json({ 
        error: data.error || 'Coinbase Commerce API error' 
      });
    }

  } catch (error) {
    console.error('Charge error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};

// Apply CORS to our handler
export default allowCors(handler);
