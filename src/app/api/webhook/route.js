import { NextResponse } from 'next/server';

const API_KEY = process.env.JUST_API_KEY || 'just-secret-token-12345';

export async function POST(req) {
  try {
    const token = req.headers.get('x-just-token');

    if (token !== API_KEY) {
      return NextResponse.json({ ok: false, error: 'Nieautoryzowany dostep' }, { status: 401 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    return NextResponse.json({
      ok: true,
      received: true,
      event,
      timestamp: Date.now()
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
