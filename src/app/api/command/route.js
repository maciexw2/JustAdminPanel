import { NextResponse } from 'next/server';
import { executeRconCommand } from '@/lib/fivemBridge';

export async function POST(req) {
  try {
    const { command } = await req.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ ok: false, error: 'Brak polecenia' }, { status: 400 });
    }

    const bridgeRes = await executeRconCommand(command);

    return NextResponse.json({
      ok: true,
      command,
      output: bridgeRes.data?.output || `Wykonano polecenie: ${command}`,
      bridged: bridgeRes.ok
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
