<<<<<<< HEAD
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { chargeId } = req.query;
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;

  if (!chargeId) {
    return res.status(400).json({ error: "Missing chargeId parameter" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Coinbase API key" });
  }

  try {
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
      method: "GET",
      headers: {
        "X-CC-Api-Key": apiKey,
        "X-CC-Version": "2018-03-22",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Failed to get charge status" });
    }

    const timeline = data.data.timeline || [];
    const statusName = data.data.status || (timeline.length ? timeline[timeline.length - 1].status : "pending");

    return res.status(200).json({
      statusName,
      timeline,
      data: data.data,
    });

  } catch (err) {
    console.error("Charge Status Error:", err.message);
    return res.status(500).json({ error: err.message });
=======
// /api/chargeStatus.js (Vercel Serverless Function)
export default async function handler(req, res) {
  const { chargeId } = req.query;
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!chargeId || !apiKey) {
    return res.status(400).json({ error: 'Missing chargeId or API key' });
  }
  try {
    const response = await fetch(`https://api.commerce.coinbase.com/charges/${chargeId}`, {
      headers: {
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Failed to get charge status' });
    }
    const timeline = data.data.timeline || [];
    const statusName = timeline.length > 0 ? timeline[timeline.length - 1].status : data.data.status;
    return res.status(200).json({ statusName });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
>>>>>>> 97caf59870c63b920bb0d4c1f1aa9cb4dd22b0fd
  }
}
