import { NextResponse } from 'next/server';
import { getLiveServerStatus } from '@/lib/fivemBridge';

export async function GET() {
  const live = await getLiveServerStatus();

  if (live.isLive) {
    return NextResponse.json({
      connected: true,
      server: {
        name: live.name || 'FiveM FXServer',
        version: live.version || 'FXServer',
        endpoint: live.endpoint || '127.0.0.1:30120',
        txAdminVersion: live.txAdminVersion || 'v7.2.1',
        oneSync: live.oneSync || 'OneSync Infinity',
        onlinePlayers: live.onlinePlayers || 0,
        maxPlayers: live.maxPlayers || 128,
        registeredSlots: live.registeredSlots || 128,
        uptime: live.uptime || '0m',
        uptimeStarted: live.uptimeStarted || 'Teraz',
        fps: live.fps ? Math.round(Number(live.fps) * 10) / 10 : 60.0,
        tickTimeMs: live.tickTimeMs ? Math.round(Number(live.tickTimeMs) * 10) / 10 : 16.6,
        status: 'ONLINE',
        healthRate: '100%',
        totalResources: live.totalResources || 0,
        activeResources: live.activeResources || 0,
        stoppedResources: live.stoppedResources || 0
      },
      hardware: {
        cpuUsage: live.cpuUsage || 0,
        cpuModel: live.cpuModel || 'Serwer Host',
        cpuClock: live.cpuClock || '3.2 GHz',
        ramUsedGb: live.ramUsedGb || 0,
        ramTotalGb: live.ramTotalGb || 16.0,
        ramPercent: live.ramPercent || 0,
        outboundMbps: live.outboundMbps || 0,
        inboundMbps: live.inboundMbps || 0
      }
    });
  }

  return NextResponse.json({
    connected: false,
    server: {
      name: 'FXServer (Offline)',
      version: 'FXServer',
      endpoint: '127.0.0.1:30120',
      txAdminVersion: 'v7.2.1',
      oneSync: 'OneSync BigMode',
      onlinePlayers: 0,
      maxPlayers: 128,
      registeredSlots: 128,
      uptime: 'Offline',
      uptimeStarted: '-',
      fps: 0,
      tickTimeMs: 0,
      status: 'OFFLINE',
      healthRate: '0%',
      totalResources: 0,
      activeResources: 0,
      stoppedResources: 0
    },
    hardware: {
      cpuUsage: 0,
      cpuModel: 'Oczekiwanie na połączenie',
      cpuClock: '-',
      ramUsedGb: 0,
      ramTotalGb: 0,
      ramPercent: 0,
      outboundMbps: 0,
      inboundMbps: 0
    }
  });
}
