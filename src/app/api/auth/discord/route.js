import { NextResponse } from 'next/server';
import { findAdminByDiscord, getPublicAdmins } from '@/lib/authStore';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { discordId, auto } = body;

    if (auto) {
      const admins = getPublicAdmins();
      const discordAdmin = admins.find((a) => a.discord || a.discordId) || admins[0];

      if (discordAdmin) {
        return NextResponse.json({
          ok: true,
          user: {
            id: discordAdmin.id,
            username: discordAdmin.username,
            role: discordAdmin.role,
            avatarLetter: discordAdmin.username[0].toUpperCase(),
            avatarBg: discordAdmin.avatarBg || '#5865F2',
            discord: discordAdmin.discord || 'Discord Verified',
            permissions: discordAdmin.permissions || 'Staff'
          },
          token: `discord_session_${Date.now()}`
        });
      }
    }

    if (discordId) {
      const admin = findAdminByDiscord(discordId);
      if (admin) {
        return NextResponse.json({
          ok: true,
          user: {
            id: admin.id,
            username: admin.username,
            role: admin.role,
            avatarLetter: admin.username[0].toUpperCase(),
            avatarBg: admin.avatarBg || '#5865F2',
            discord: admin.discord || discordId,
            permissions: admin.permissions || 'Staff'
          },
          token: `discord_session_${Date.now()}`
        });
      }
      return NextResponse.json(
        { ok: false, message: `Konto Discord (${discordId}) nie jest przypisane do żadnego administratora` },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { ok: false, message: 'Podaj identyfikator Discord lub użyj automatycznego logowania' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
