import Arweave from 'arweave';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { ciphertext, iv, metadata } = req.body;
    const dataBuffer = Buffer.from(ciphertext, 'base64');

<<<<<<< HEAD
    // Load JWK from Vite environment variable
    const jwkEnv = process.env.ARWEAVE_JWK_JSON || import.meta.env.VITE_ARWEAVE_JWK_JSON;
    if (!jwkEnv) {
      return res.status(500).json({ error: 'Missing ARWEAVE_JWK_JSON in environment' });
    }
    const jwk = typeof jwkEnv === 'string' ? JSON.parse(jwkEnv) : jwkEnv;
=======
    // Load JWK from environment variable (Vercel compatible)
    const jwkEnv = process.env.ARWEAVE_JWK_JSON;
    if (!jwkEnv) {
      return res.status(500).json({ error: 'Missing ARWEAVE_JWK_JSON in environment' });
    }
    const jwk = JSON.parse(jwkEnv);
>>>>>>> 97caf59870c63b920bb0d4c1f1aa9cb4dd22b0fd

    // Initialize Arweave
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
    });
    const tx = await arweave.createTransaction({ data: dataBuffer }, jwk);
    tx.addTag('App-Name', 'TUMA-Document-Exchange');
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        tx.addTag(key, String(value));
      });
    }
    await arweave.transactions.sign(tx, jwk);
    const response = await arweave.transactions.post(tx);
    if (response.status === 200 || response.status === 202) {
      res.status(200).json({ id: tx.id });
    } else {
      res.status(500).json({ error: `Arweave response status ${response.status}` });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
}
