import { NextResponse } from 'next/server';
import { getPublicAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/lib/authStore';

export async function GET() {
  try {
    const admins = getPublicAdmins();
    return NextResponse.json({ ok: true, admins });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.username || !body.password) {
      return NextResponse.json(
        { ok: false, message: 'Nazwa użytkownika i hasło są wymagane' },
        { status: 400 }
      );
    }

    const created = createAdmin(body);
    return NextResponse.json({ ok: true, admin: created, message: 'Administrator utworzony pomyślnie' });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ ok: false, message: 'Brak ID administratora' }, { status: 400 });
    }

    const updated = updateAdmin(body.id, body);
    return NextResponse.json({ ok: true, admin: updated, message: 'Zaktualizowano dane administratora' });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ ok: false, message: 'Brak ID administratora' }, { status: 400 });
    }

    deleteAdmin(id);
    return NextResponse.json({ ok: true, message: 'Administrator został usunięty' });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }
}
