const FIVEM_URL = process.env.FIVEM_ENDPOINT || 'http://127.0.0.1:30120/just_admin';
const API_KEY = process.env.JUST_API_KEY || 'just-secret-token-12345';

async function fetchFromFiveM(endpoint, options = {}) {
  const url = `${FIVEM_URL}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-just-token': API_KEY,
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    clearTimeout(timeout);
    return { ok: false, error: error.message };
  }
}

export async function getLiveServerStatus() {
  const result = await fetchFromFiveM('/status');
  if (result.ok) {
    return { isLive: true, ...result.data };
  }
  return { isLive: false, error: result.error };
}

export async function getLivePlayers() {
  const result = await fetchFromFiveM('/players');
  if (result.ok && Array.isArray(result.data)) {
    return { isLive: true, players: result.data };
  }
  return { isLive: false, players: [] };
}

export async function sendPlayerAction(action, payload) {
  const result = await fetchFromFiveM('/action', {
    method: 'POST',
    body: JSON.stringify({ action, ...payload })
  });
  return result;
}

export async function executeRconCommand(command) {
  const result = await fetchFromFiveM('/command', {
    method: 'POST',
    body: JSON.stringify({ command })
  });
  return result;
}

export async function executeResourceAction(action, resourceName) {
  const result = await fetchFromFiveM('/resource', {
    method: 'POST',
    body: JSON.stringify({ action, resourceName })
  });
  return result;
}
