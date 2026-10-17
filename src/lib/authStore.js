import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, originalHash] = stored.split(':');
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToVerify, 'hex'));
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ADMINS_FILE)) {
    const defaultAdmins = [
      {
        id: 'adm_1',
        username: 'admin',
        role: 'Super Admin',
        roleColor: '#7c3aed',
        passwordHash: hashPassword('admin'),
        discord: 'admin#0001',
        discordId: '28491820491829104',
        steamHex: 'steam:11000010c2a8f9b',
        avatarBg: '#7c3aed',
        has2fa: true,
        createdAt: new Date().toISOString(),
        lastActive: 'Online Now',
        permissions: 'Full Root Access (txAdmin Master)'
      }
    ];
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(defaultAdmins, null, 2), 'utf-8');
  }
}

export function getAdminsRaw() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(ADMINS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getPublicAdmins() {
  const admins = getAdminsRaw();
  return admins.map(({ passwordHash, ...safe }) => safe);
}

export function saveAdmins(admins) {
  ensureDataFile();
  fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), 'utf-8');
}

export function verifyAdminCredentials(username, password) {
  const admins = getAdminsRaw();
  const admin = admins.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());
  if (!admin) return null;

  const isValid = verifyPassword(password, admin.passwordHash);
  if (!isValid) return null;

  admin.lastActive = 'Online Now';
  saveAdmins(admins);

  const { passwordHash, ...safeAdmin } = admin;
  return safeAdmin;
}

export function findAdminByDiscord(discordIdentifier) {
  const admins = getAdminsRaw();
  const cleanId = discordIdentifier.trim().toLowerCase();
  
  const found = admins.find(
    (a) =>
      (a.discordId && a.discordId.toLowerCase() === cleanId) ||
      (a.discord && a.discord.toLowerCase() === cleanId)
  );

  if (!found) return null;

  found.lastActive = 'Online Now (Discord)';
  saveAdmins(admins);

  const { passwordHash, ...safeAdmin } = found;
  return safeAdmin;
}

export function createAdmin(adminData) {
  const admins = getAdminsRaw();
  const existing = admins.find((a) => a.username.toLowerCase() === adminData.username.trim().toLowerCase());
  if (existing) {
    throw new Error('Użytkownik o takiej nazwie już istnieje');
  }

  const newAdmin = {
    id: `adm_${Date.now()}`,
    username: adminData.username.trim(),
    role: adminData.role || 'Moderator',
    roleColor: adminData.roleColor || (adminData.role === 'Super Admin' ? '#7c3aed' : adminData.role === 'Admin' ? '#2563eb' : '#059669'),
    passwordHash: hashPassword(adminData.password || 'admin123'),
    discord: adminData.discord || '',
    discordId: adminData.discordId || '',
    steamHex: adminData.steamHex || '',
    avatarBg: adminData.avatarBg || '#7c3aed',
    has2fa: Boolean(adminData.has2fa),
    createdAt: new Date().toISOString(),
    lastActive: 'Nigdy',
    permissions: adminData.permissions || 'Standard Staff Access'
  };

  admins.push(newAdmin);
  saveAdmins(admins);

  const { passwordHash, ...safe } = newAdmin;
  return safe;
}

export function updateAdmin(id, updateData) {
  const admins = getAdminsRaw();
  const index = admins.findIndex((a) => a.id === id);
  if (index === -1) throw new Error('Administrator nie został znaleziony');

  const current = admins[index];

  if (updateData.password && updateData.password.trim()) {
    current.passwordHash = hashPassword(updateData.password.trim());
  }

  if (updateData.role) {
    current.role = updateData.role;
    current.roleColor = updateData.role === 'Super Admin' ? '#7c3aed' : updateData.role === 'Admin' ? '#2563eb' : '#059669';
  }

  if (updateData.discord !== undefined) current.discord = updateData.discord;
  if (updateData.discordId !== undefined) current.discordId = updateData.discordId;
  if (updateData.steamHex !== undefined) current.steamHex = updateData.steamHex;
  if (updateData.has2fa !== undefined) current.has2fa = Boolean(updateData.has2fa);
  if (updateData.permissions) current.permissions = updateData.permissions;

  saveAdmins(admins);
  const { passwordHash, ...safe } = current;
  return safe;
}

export function deleteAdmin(id) {
  const admins = getAdminsRaw();
  const toDelete = admins.find((a) => a.id === id);
  if (!toDelete) throw new Error('Administrator nie został znaleziony');

  const superAdmins = admins.filter((a) => a.role === 'Super Admin');
  if (toDelete.role === 'Super Admin' && superAdmins.length <= 1) {
    throw new Error('Nie można usunąć jedynego Super Admina w systemie');
  }

  const filtered = admins.filter((a) => a.id !== id);
  saveAdmins(filtered);
  return true;
}
