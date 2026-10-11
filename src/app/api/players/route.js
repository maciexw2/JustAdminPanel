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
    const { action, playerId, reason, coords } = body;

    if (!action || !playerId) {
      return NextResponse.json({ ok: false, error: 'Brak akcji lub ID gracza' }, { status: 400 });
    }

    const bridgeRes = await sendPlayerAction(action, { playerId, reason, coords });

    return NextResponse.json({
      ok: true,
      action,
      playerId,
      bridged: bridgeRes.ok,
      message: `Wykonano ${action} dla gracza #${playerId}`
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
