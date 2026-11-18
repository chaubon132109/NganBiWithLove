import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '').trim();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-gemini-proxy',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: { message: 'Method Not Allowed' } }));
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const targetModel = parsed.model || 'gemini-3.5-flash-lite';
                const key = apiKey;

                if (!key) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: { message: 'Server chưa cấu hình GEMINI_API_KEY' } }));
                  return;
                }

                const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${key}`;
                const payload = { contents: parsed.contents || [] };
                if (parsed.system_instruction) payload.system_instruction = parsed.system_instruction;
                if (parsed.generationConfig) payload.generationConfig = parsed.generationConfig;

                const gRes = await fetch(googleUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });

                const data = await gRes.json();
                res.statusCode = gRes.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: { message: err.message } }));
              }
            });
          });
        }
      }
    ],
  };
})
