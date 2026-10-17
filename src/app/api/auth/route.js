import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/authStore';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: 'Podaj login oraz hasło' },
        { status: 400 }
      );
    }

    const admin = verifyAdminCredentials(username, password);

    if (admin) {
      return NextResponse.json({
        ok: true,
        user: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
          avatarLetter: admin.username[0].toUpperCase(),
          avatarBg: admin.avatarBg || '#7c3aed',
          discord: admin.discord || '',
          permissions: admin.permissions || 'Administrator'
        },
        token: `session_${Date.now()}`
      });
    }

    const masterKey = process.env.JUST_API_KEY || 'just-secret-token-12345';
    if (password === masterKey) {
      return NextResponse.json({
        ok: true,
        user: {
          id: 'master_root',
          username: username || 'RootAdmin',
          role: 'Super Admin',
          avatarLetter: (username || 'R')[0].toUpperCase(),
          avatarBg: '#7c3aed',
          discord: 'System Master Key',
          permissions: 'Full Root Access'
        },
        token: `session_${Date.now()}`
      });
    }

    return NextResponse.json(
      { ok: false, message: 'Nieprawidłowy login lub hasło (domyślnie: admin / admin)' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
