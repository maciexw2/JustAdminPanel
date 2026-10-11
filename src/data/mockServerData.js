export const initialServerInfo = {
  name: 'Los Santos Roleplay // Polish Official',
  version: 'FXServer-master SERVER v1.0.0.7290 linux',
  endpoint: '142.250.190.40:30120',
  txAdminVersion: 'v7.2.1',
  oneSync: 'OneSync BigMode',
  onlinePlayers: 42,
  maxPlayers: 128,
  registeredSlots: 128,
  uptime: '14h 32m',
  uptimeStarted: '04:15 AM',
  fps: 60.2,
  tickTimeMs: 16.6,
  status: 'ONLINE',
  healthRate: '99.98%',
  totalResources: 87,
  activeResources: 85,
  stoppedResources: 2
};

export const initialHardware = {
  cpuUsage: 34,
  cpuModel: 'AMD EPYC 7763 (8 vCores)',
  cpuClock: '2.45 GHz',
  ramUsedGb: 19.5,
  ramTotalGb: 32.0,
  ramPercent: 61,
  outboundMbps: 15.4,
  inboundMbps: 6.2
};

export const activityData24h = [
  { time: '00:00', players: 28 },
  { time: '02:00', players: 22 },
  { time: '04:00', players: 18 },
  { time: '06:00', players: 26 },
  { time: '08:00', players: 40 },
  { time: '10:00', players: 58 },
  { time: '12:00', players: 74 },
  { time: '14:00', players: 85 },
  { time: '16:00', players: 96 },
  { time: '18:00', players: 108 },
  { time: '20:00', players: 114 },
  { time: '21:00', players: 118, isPeak: true },
  { time: '22:00', players: 78 },
  { time: 'Now', players: 42, isCurrent: true }
];

export const initialPlayers = [
  {
    id: 42,
    name: 'Maciex',
    tag: 'ADMIN',
    avatarLetter: 'M',
    avatarBg: '#7c3aed',
    job: 'Police (Chief)',
    jobType: 'police',
    ping: 24,
    sessionDuration: '04h 21m',
    steamHex: 'steam:11000010c2a8f9b',
    discord: '28491820491829104',
    license: 'license:a4f89d9e2a1b0c8d7e6f5',
    coords: 'X: 425.1, Y: -979.5, Z: 30.7 (Mission Row PD)',
    cash: '$45,200',
    bank: '$1,420,800',
    health: 100,
    armor: 100
  },
  {
    id: 19,
    name: 'Vega',
    tag: null,
    avatarLetter: 'V',
    avatarBg: '#2563eb',
    job: 'EMS Paramedic',
    jobType: 'ems',
    ping: 31,
    sessionDuration: '02h 45m',
    steamHex: 'steam:11000013b827e1c',
    discord: '49281729481928472',
    license: 'license:b7c3d2e1f0a9b8c7d6e5',
    coords: 'X: 298.6, Y: -584.2, Z: 43.2 (Pillbox Hill Medical)',
    cash: '$12,400',
    bank: '$320,500',
    health: 100,
    armor: 25
  },
  {
    id: 68,
    name: 'QLin',
    tag: null,
    avatarLetter: 'Q',
    avatarBg: '#d97706',
    job: "Benny's Mechanic",
    jobType: 'mechanic',
    ping: 38,
    sessionDuration: '01h 12m',
    steamHex: 'steam:11000014a91928f',
    discord: '61928374619283746',
    license: 'license:c9f8e7d6c5b4a3b2c1d0',
    coords: 'X: -211.3, Y: -1324.8, Z: 30.9 (Benny\'s Workshop)',
    cash: '$8,950',
    bank: '$184,200',
    health: 85,
    armor: 0
  },
  {
    id: 102,
    name: 'John_Doe',
    tag: null,
    avatarLetter: 'J',
    avatarBg: '#4b5563',
    job: 'Civilian',
    jobType: 'civilian',
    ping: 94,
    sessionDuration: '00h 42m',
    steamHex: 'steam:11000019e83719b',
    discord: '81729384719284719',
    license: 'license:d8e7c6b5a4b3c2d1e0f9',
    coords: 'X: -1037.4, Y: -2737.8, Z: 13.8 (LS Airport)',
    cash: '$2,300',
    bank: '$45,000',
    health: 60,
    armor: 0
  },
  {
    id: 114,
    name: 'Kacper_K',
    tag: null,
    avatarLetter: 'K',
    avatarBg: '#059669',
    job: 'Taxi Driver',
    jobType: 'civilian',
    ping: 28,
    sessionDuration: '03h 05m',
    steamHex: 'steam:11000017a4192bc',
    discord: '38192049182938472',
    license: 'license:e7d8c9a0b1c2d3e4f5a6',
    coords: 'X: 894.2, Y: -178.6, Z: 73.8 (Taxi Depot)',
    cash: '$4,500',
    bank: '$92,100',
    health: 100,
    armor: 0
  },
  {
    id: 128,
    name: 'ShadowV',
    tag: 'MOD',
    avatarLetter: 'S',
    avatarBg: '#7c3aed',
    job: 'State Trooper',
    jobType: 'police',
    ping: 22,
    sessionDuration: '05h 18m',
    steamHex: 'steam:11000012c81924d',
    discord: '19283746501928374',
    license: 'license:f6e5d4c3b2a109876543',
    coords: 'X: -440.1, Y: 6012.3, Z: 31.7 (Paleto Bay)',
    cash: '$28,400',
    bank: '$840,200',
    health: 100,
    armor: 100
  }
];

export const initialAuditLogs = [
  {
    id: 'log-1',
    type: 'ban',
    admin: 'Maciex',
    actionText: 'banned Player #124',
    timeAgo: '2m ago',
    detail: 'Reason: Cheating / Lua Executor (Permanent)'
  },
  {
    id: 'log-2',
    type: 'restart',
    admin: 'Vega',
    actionText: 'restarted just-core',
    timeAgo: '8m ago',
    detail: 'Successfully rebuilt cache in 120ms'
  },
  {
    id: 'log-3',
    type: 'kick',
    admin: 'QLin',
    actionText: 'kicked Player #84',
    timeAgo: '13m ago',
    detail: 'Reason: AFK in queue priority chamber'
  },
  {
    id: 'log-4',
    type: 'join',
    admin: null,
    actionText: 'Player #42 (Maciex) joined server',
    timeAgo: '16m ago',
    detail: 'Steam Auth verified · License #a4f89...'
  },
  {
    id: 'log-5',
    type: 'backup',
    admin: null,
    actionText: 'Database backup generated automatically',
    timeAgo: '32m ago',
    detail: 'Snapshot size: 482 MB · Local storage'
  }
];

export const initialResources = [
  { name: 'just-core', version: 'v2.1.0', author: 'JustDevs', status: 'started', type: 'framework' },
  { name: 'ox_inventory', version: 'v2.41.0', author: 'Overextended', status: 'started', type: 'system' },
  { name: 'ox_lib', version: 'v3.18.2', author: 'Overextended', status: 'started', type: 'dependency' },
  { name: 'es_extended', version: 'legacy-1.9.4', author: 'ESX Org', status: 'started', type: 'framework' },
  { name: 'qbx_core', version: 'v1.4.0', author: 'Qbox-project', status: 'started', type: 'framework' },
  { name: 'pma-voice', version: 'v6.3.0', author: 'AvarianKnight', status: 'started', type: 'voice' },
  { name: 'fivem-appearance', version: 'v1.2.0', author: 'pedr0fontoura', status: 'started', type: 'character' },
  { name: 'screenshot-basic', version: 'v1.4.1', author: 'citizenfx', status: 'stopped', type: 'utility' },
  { name: 'legacy_carhud', version: 'v0.9.1', author: 'custom', status: 'stopped', type: 'hud' }
];
