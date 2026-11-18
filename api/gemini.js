// Vercel Serverless Function: Proxy request to Google AI Studio
// The GEMINI_API_KEY is stored securely on Vercel's server environment.
// The browser NEVER sees or receives the API Key.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: { message: 'Method Not Allowed. Use POST.' }
    });
  }

  // Key is retrieved exclusively on server side
  const key = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  if (!key) {
    return res.status(500).json({
      error: { message: 'Server chưa cấu hình GEMINI_API_KEY trong Vercel Environment Variables.' }
    });
  }

  const { model, contents, system_instruction, generationConfig } = req.body || {};
  const targetModel = model || 'gemini-3.5-flash-lite';

  try {
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${key}`;
    const payload = {
      contents: contents || []
    };
    if (system_instruction) payload.system_instruction = system_instruction;
    if (generationConfig) payload.generationConfig = generationConfig;

    const googleRes = await fetch(googleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await googleRes.json();
    return res.status(googleRes.status).json(data);
  } catch (err) {
    console.error('Vercel Gemini Proxy Error:', err);
    return res.status(500).json({
      error: { message: err.message || 'Lỗi kết nối từ máy chủ Vercel tới Google AI Studio.' }
    });
  }
}
