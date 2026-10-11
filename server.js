import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let config = {
  serverUrl: 'https://stitch.googleapis.com/mcp',
  apiKey: 'AQ.Ab8RN6LV3upFhHgJ4QeA9WkbAHM6gK2DiW95o1w1rDkARtGHiQ'
};

const userMcpPath = path.join(process.env.HOME || '', '.gemini/config/mcp_config.json');
try {
  if (fs.existsSync(userMcpPath)) {
    const raw = JSON.parse(fs.readFileSync(userMcpPath, 'utf8'));
    if (raw?.mcpServers?.stitch) {
      config.serverUrl = raw.mcpServers.stitch.serverUrl || config.serverUrl;
      config.apiKey = raw.mcpServers.stitch.headers?.['X-Goog-Api-Key'] || config.apiKey;
    }
  }
} catch (err) {
  console.warn('Could not read user mcp_config.json, using defaults.');
}

app.get('/api/config', (req, res) => {
  const maskedKey = config.apiKey
    ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-6)}`
    : 'Not configured';

  res.json({
    serverUrl: config.serverUrl,
    apiKeyMasked: maskedKey,
    hasApiKey: Boolean(config.apiKey)
  });
});

app.post('/api/config', (req, res) => {
  const { serverUrl, apiKey } = req.body;
  if (serverUrl) config.serverUrl = serverUrl;
  if (apiKey) config.apiKey = apiKey;

  res.json({
    ok: true,
    serverUrl: config.serverUrl,
    apiKeyMasked: `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-6)}`
  });
});

app.post('/api/ping', async (req, res) => {
  const start = Date.now();
  try {
    const response = await fetch(config.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': config.apiKey
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'ping',
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'JustAdminPanel', version: '1.0.0' }
        }
      })
    });

    const latency = Date.now() - start;
    const data = await response.json();

    res.json({
      ok: response.ok,
      status: response.status,
      latencyMs: latency,
      result: data?.result
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      latencyMs: Date.now() - start,
      error: error.message
    });
  }
});

app.post('/api/mcp', async (req, res) => {
  try {
    const payload = req.body;
    const response = await fetch(config.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': config.apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

app.get('/api/proxy-html', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    res.status(500).send(`Failed to load screen preview: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`JustAdminPanel running at http://localhost:${PORT}`);
});
