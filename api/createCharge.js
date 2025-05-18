<<<<<<< HEAD
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    const apiUrl = "https://api.commerce.coinbase.com/charges";

    if (!apiKey) {
      return res.status(400).json({ error: "Missing Coinbase API key" });
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": apiKey,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Coinbase Commerce API error" });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Charge error:", error.message);
    return res.status(500).json({ error: error.message });
=======
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const COINBASE_COMMERCE_API_KEY = process.env.COINBASE_COMMERCE_API_KEY;
    const COINBASE_COMMERCE_API_URL = 'https://api.commerce.coinbase.com/charges';
    const response = await fetch(COINBASE_COMMERCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_COMMERCE_API_KEY,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (response.status === 201) {
      res.status(201).json(data);
    } else {
      res.status(response.status).json({ error: data.error || 'Coinbase Commerce API error' });
    }
  } catch (error) {
    console.error('Charge error:', error);
    res.status(500).json({ error: error.message });
>>>>>>> 97caf59870c63b920bb0d4c1f1aa9cb4dd22b0fd
  }
}
