import { NextResponse } from 'next/server';
import { sendPlayerAction } from '@/lib/fivemBridge';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BANS_FILE = path.join(DATA_DIR, 'bans.json');

function getBansFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(BANS_FILE)) {
      fs.writeFileSync(BANS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(BANS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveBansToDisk(bans) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(BANS_FILE, JSON.stringify(bans, null, 2), 'utf-8');
  } catch {}
}

export async function GET() {
  const bans = getBansFromDisk();
  return NextResponse.json({ ok: true, bans });
}

export async function POST(req) {
  try {
    const { player, reason, duration, steamHex, admin } = await req.json();

    if (!player || !reason) {
      return NextResponse.json({ ok: false, error: 'Brak danych bana' }, { status: 400 });
    }

    const newBan = {
      id: `BAN-${Math.floor(1000 + Math.random() * 9000)}`,
      player,
      steamHex: steamHex || ('steam:1100001' + Math.floor(1000000 + Math.random() * 9000000).toString(16)),
      reason,
      admin: admin || 'Administrator',
      issuedAt: 'Przed chwilą',
      duration: (duration || 'Permanent').toUpperCase(),
      isPermanent: !duration || duration === 'Permanent'
    };

    const currentBans = getBansFromDisk();
    const updatedBans = [newBan, ...currentBans];
    saveBansToDisk(updatedBans);

    await sendPlayerAction('ban', {
      player,
      reason,
      duration: newBan.duration
    });

    return NextResponse.json({ ok: true, ban: newBan });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Brak ID bana' }, { status: 400 });
    }

    const currentBans = getBansFromDisk();
    const updatedBans = currentBans.filter((b) => b.id !== id);
    saveBansToDisk(updatedBans);

    return NextResponse.json({ ok: true, message: `Odwolano bana ${id}` });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
