import { NextResponse } from 'next/server';
import { getLivePlayers, sendPlayerAction } from '@/lib/fivemBridge';

export async function GET() {
  const live = await getLivePlayers();

  if (live.isLive && Array.isArray(live.players)) {
    return NextResponse.json({
      connected: true,
      players: live.players
    });
  }

  return NextResponse.json({
    connected: false,
    players: []
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, playerId, reason, coords, message, seconds } = body;

    const globalActions = ['broadcast', 'announcement', 'restart_server', 'clear_cache', 'lockdown'];
    if (!action || (!playerId && !globalActions.includes(action))) {
      return NextResponse.json({ ok: false, error: 'Brak akcji lub ID gracza' }, { status: 400 });
    }

    const bridgeRes = await sendPlayerAction(action, { playerId, reason, coords, message, seconds });

    return NextResponse.json({
      ok: true,
      action,
      playerId: playerId || 'server',
      bridged: bridgeRes.ok,
      message: `Wykonano ${action} dla ${playerId ? `gracza #${playerId}` : 'serwera'}`
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
