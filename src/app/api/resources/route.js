import { NextResponse } from 'next/server';
import { executeResourceAction, getLiveResources } from '@/lib/fivemBridge';

export async function GET() {
  const live = await getLiveResources();
  return NextResponse.json({
    ok: true,
    connected: live.isLive,
    resources: live.resources || []
  });
}

export async function POST(req) {
  try {
    const { action, resourceName } = await req.json();

    if (!action || !resourceName) {
      return NextResponse.json({ ok: false, error: 'Brak akcji lub nazwy zasobu' }, { status: 400 });
    }

    const bridgeRes = await executeResourceAction(action, resourceName);

    return NextResponse.json({
      ok: true,
      action,
      resourceName,
      bridged: bridgeRes.ok,
      message: `Zasob ${resourceName}: wykonano ${action}`
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
