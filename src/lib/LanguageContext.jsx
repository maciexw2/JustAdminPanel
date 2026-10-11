'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  pl: {
    // Nawigacja / Sidebar
    nav: {
      overview: 'PRZEGLĄD',
      management: 'ZARZĄDZANIE',
      monitoring: 'MONITORING',
      system: 'SYSTEM',
      dashboard: 'Pulpit',
      players: 'Gracze',
      moderation: 'Moderacja',
      resources: 'Zasoby',
      server: 'Serwer',
      logs: 'Konsola i Logi',
      checklist: 'Checklista Wdrożenia',
      settings: 'Ustawienia',
      admins: 'Administratorzy',
      connectedNode: 'Węzeł FiveM txAdmin',
      activeStatus: 'Aktywny',
      versionTag: 'Wersja v2.4.0'
    },

    // Header
    header: {
      controlPlane: 'Pulpit Zarządzania',
      online: 'ONLINE',
      playersCount: 'GRACZY',
      notifications: 'Powiadomienia',
      noNotifications: 'Brak nowych powiadomień',
      markAllRead: 'Oznacz jako przeczytane',
      preflightPill: 'Checklista Wdrożenia',
      quickActions: 'Szybkie Akcje',
      refreshTelemetry: 'Odśwież',
      copyIp: 'Kopiuj IP',
      logout: 'Wyloguj',
      tabs: {
        dashboard: {
          title: 'Pulpit Główny',
          subtitle: 'Monitoruj stan serwera i zarządzaj graczami w czasie rzeczywistym.'
        },
        players: {
          title: 'Zarządzanie Graczami',
          subtitle: 'Lista aktywnych graczy, przydziały służb, koordynaty oraz statusy sesji.'
        },
        moderation: {
          title: 'Moderacja i Kary',
          subtitle: 'Egzekwuj regulamin serwera, zarządzaj banlistą txAdmin oraz ostrzeżeniami.'
        },
        resources: {
          title: 'Menedżer Zasobów',
          subtitle: 'Zarządzaj skryptami FXServer, pamięcią Lua i stanami manifestów w locie.'
        },
        server: {
          title: 'Telemetria i Wydajność',
          subtitle: 'Niskopoziomowa diagnostyka maszyny, obciążenie wątków i wymiary OneSync.'
        },
        logs: {
          title: 'Konsola RCON i Logi',
          subtitle: 'Interaktywna konsola główna silnika FXServer i strumień zdarzeń na żywo.'
        },
        settings: {
          title: 'Ustawienia Panelu',
          subtitle: 'Konfiguracja mostka txAdmin, tokeny autoryzacji, webhooki Discord i motywy.'
        },
        admins: {
          title: 'Personel Administracyjny',
          subtitle: 'Zarządzaj uprawnieniami zespołu, kontami dostępowymi i weryfikacją 2FA.'
        },
        checklist: {
          title: 'Lista Kontrolna Wdrożenia',
          subtitle: 'Weryfikacja bezpieczeństwa w stylu Vercel przed otwarciem serwera dla graczy.'
        }
      }
    },

    // Metric Cards
    metrics: {
      playersOnline: 'Gracze Online',
      lastHour: '+8 ostatnia godz.',
      maxSlots: 'maksymalnie',
      onesyncStatus: 'OneSync: WŁĄCZONY',
      tickTime: 'Czas Ticku',
      stable: 'Stabilny',
      frameTarget: 'Cel 16.6ms (60 FPS)',
      cpuLoad: 'Obciążenie CPU',
      allCores: '8 rdzeni aktywnych',
      ramAllocation: 'Przydział RAM',
      totalAvailable: 'dostępne w węźle',
      serverUptime: 'Czas Działania',
      sinceBoot: 'Bez restartu',
      copyUptime: 'Kopiuj',
      copiedUptime: 'Skopiowano!',
      activeResources: 'Aktywne Zasoby',
      stopped: 'zatrzymane',
      manageScripts: 'Zarządzaj',
      outboundNet: 'Ruch Wychodzący',
      inboundNet: 'Przychodzący'
    },

    // Player Activity Chart
    chart: {
      title: 'Historia Graczy (Ostatnie 24h)',
      subtitle: 'Natężenie ruchu i szczyty logowań na serwerze',
      liveNow: 'Teraz na serwerze',
      peak: 'Szczyt (Peak)',
      average: 'Średnia 24h',
      playersUnit: 'graczy',
      slots: 'slotów'
    },

    // Server Health
    health: {
      title: 'Kondycja Maszyny',
      subtitle: 'Metryki sprzętowe węzła serwerowego',
      statusNormal: 'W normie',
      cpuUtil: 'Użycie procesora (CPU)',
      ramUtil: 'Pamięć operacyjna (RAM)',
      networkIo: 'Przepustowość sieciowa (I/O)',
      diskIo: 'Zapis dyskowy SSD',
      nodeHealth: 'Wskaźnik stabilności węzła'
    },

    // Connected Players widget
    connected: {
      title: 'Podłączeni Gracze',
      subtitle: 'Aktywne sesje na serwerze',
      searchPlaceholder: 'Szukaj gracza, ID, roli...',
      viewAll: 'Zobacz wszystkich',
      viewAllBtn: 'Wszyscy gracze',
      thId: 'ID',
      thPlayer: 'GRACZ',
      thJob: 'ROLA / PRACA',
      thPing: 'PING',
      thSession: 'CZAS SESJI',
      thAction: 'AKCJE',
      inspect: 'Podgląd',
      kick: 'Wyrzuć',
      noPlayers: 'Brak aktywnych graczy na serwerze.'
    },

    // Recent Activity
    activity: {
      title: 'Ostatnia Aktywność',
      subtitle: 'Strumień zdarzeń serwera w czasie rzeczywistym',
      viewAllLogs: 'Pełne Logi',
      noActivity: 'Brak zarejestrowanych zdarzeń.'
    },

    // Server Footer Banner
    footer: {
      engine: 'Silnik Serwera FiveM:',
      endpoint: 'Bezpośrednie IP:',
      copyEndpoint: 'Kopiuj IP',
      copied: 'Skopiowano!',
      quickConsole: 'Otwórz Konsolę',
      emergencyHelp: 'Pomoc techniczna'
    },

    // Modals
    modals: {
      quickActions: {
        title: 'Szybkie Akcje Administracyjne',
        subtitle: 'Błyskawiczne polecenia serwerowe i komunikaty',
        announcementTitle: 'Ogłoszenie Globalne na Serwerze',
        announcementPlaceholder: 'Wpisz treść komunikatu dla wszystkich graczy...',
        sendBroadcast: 'Wyślij Ogłoszenie',
        restartServer: 'Zrestartuj Serwer',
        restartIn: 'w',
        clearCache: 'Wyczyść Cache FXServer',
        lockdown: 'Włącz Tryb Lockdown',
        openConsole: 'Konsola Główna RCON'
      },
      inspect: {
        title: 'Szczegóły Gracza',
        serverIdentifiers: 'Identyfikatory Gry',
        gameplayStats: 'Stan w Grze',
        healthArmor: 'Zdrowie i Kamizelka',
        finances: 'Finanse',
        bank: 'Bank',
        cash: 'Gotówka',
        job: 'Frakcja / Praca',
        coords: 'Koordynaty (XYZ)',
        ping: 'Opóźnienie',
        sessionTime: 'Czas Sesji',
        actions: 'Działania Administracyjne',
        reviveHeal: 'Ulecz / Ożyw (Revive)',
        teleportTo: 'Teleportuj do Gracza',
        kickPlayer: 'Wyrzuć z Serwera (Kick)',
        banPlayer: 'Zbanuj Gracza (Ban)',
        banReasonPrompt: 'Powód nałożenia bana:',
        confirmBan: 'Potwierdź Ban'
      },
      console: {
        title: 'Główna Konsola FXServer RCON',
        placeholder: 'Wpisz polecenie serwera (np. status, restart, ensure)...',
        clear: 'Wyczyść widok',
        execute: 'Wykonaj'
      },
      resources: {
        title: 'Manifest Zasobów FXServer',
        searchPlaceholder: 'Szukaj skryptu...',
        start: 'Uruchom',
        stop: 'Zatrzymaj',
        restart: 'Restartuj'
      }
    },

    // Players Tab
    playersTab: {
      statConnected: 'Połączeni Gracze',
      statPolice: 'Policja na Służbie',
      statEms: 'Medycy EMS',
      statMechanics: 'Mechanicy Benny\'s',
      unitsActive: 'jednostek na służbie',
      onDuty: 'na dyżurze',
      inGarage: 'w warsztacie',
      slots: 'slotów',
      searchPlaceholder: 'Szukaj po nicku, ID, pracy lub licencji...',
      allRoles: 'Wszyscy',
      police: 'Policja',
      ems: 'EMS',
      mechanic: 'Mechanik',
      civilian: 'Obywatel',
      sortById: 'Po ID Serwera',
      sortByPing: 'Najniższy Ping',
      sortByName: 'Nazwa A-Z',
      thId: 'ID',
      thPlayer: 'GRACZ',
      thRole: 'ROLA / PRACA',
      thPing: 'PING',
      thSession: 'SESJA',
      thFinances: 'FINANSE',
      thHealth: 'ŻYCIE / KAMIZELKA',
      thModeration: 'MODERACJA',
      btnInspect: 'Podgląd',
      btnKick: 'Kick',
      btnBan: 'Ban',
      noPlayersFound: 'Nie znaleziono graczy spełniających kryteria.'
    },

    // Moderation Tab
    moderationTab: {
      statActiveBans: 'Aktywne Bany',
      statPermBans: 'Bany Permanentne',
      statWarnings: 'Aktywne Ostrzeżenia',
      statStatus: 'Status Moderacji',
      allSystemsOk: 'Wszystkie systemy działają poprawnie',
      tabBans: 'Lista Banów',
      tabWarnings: 'Punkty Ostrzeżeń (Warns)',
      issueSanction: 'Nałóż Nową Sankcję',
      searchBans: 'Szukaj bana, gracza lub powodu...',
      thBanId: 'ID BANA',
      thTarget: 'UKARANY GRACZ',
      thReason: 'POWÓD',
      thAdmin: 'ADMINISTRATOR',
      thDuration: 'CZAS TRWANIA',
      thActions: 'AKCJE',
      unban: 'Cofnij Ban (Unban)',
      dismiss: 'Usuń Ostrzeżenie',
      modalTitle: 'Nałóż Sankcję na Gracza',
      targetLabel: 'Gracz docelowy (Nick, ID lub Licencja)',
      reasonLabel: 'Powód kary',
      durationLabel: 'Czas trwania',
      permBan: 'Permanentny',
      days3: '3 Dni',
      days7: '7 Dni',
      days14: '14 Dni',
      warningType: 'Ostrzeżenie (Warn point)',
      submitSanction: 'Zatwierdź Sankcję'
    },

    // Resources Tab
    resourcesTab: {
      statManifested: 'Wszystkie Zasoby',
      statRunning: 'Aktywne w Runtime',
      statStopped: 'Zatrzymane / Nieaktywne',
      statLuaPool: 'Pamięć RAM Lua',
      searchPlaceholder: 'Filtruj zasoby po nazwie lub autorze...',
      all: 'Wszystkie',
      running: 'Uruchomione',
      stopped: 'Zatrzymane',
      core: 'Rdzenne (Core)',
      gameplay: 'Rozgrywka',
      standalone: 'Niezależne',
      ensureBtn: 'Wykonaj ensure',
      refreshAllBtn: 'Przeładuj Manifesty',
      thResource: 'ZASÓB',
      thAuthor: 'AUTOR / WERSJA',
      thType: 'TYP',
      thStatus: 'STATUS',
      thControls: 'STEROWANIE',
      btnStart: 'Start',
      btnStop: 'Stop',
      btnRestart: 'Restart'
    },

    // Server Tab
    serverTab: {
      statFps: 'Klatki na sekundę (FPS)',
      statOnesync: 'Architektura OneSync',
      statNetIo: 'Przepustowość Sieciowa',
      statHealth: 'Stabilność Węzła',
      cpuTitle: 'Rozkład Obciążenia Rdzeni CPU',
      ramTitle: 'Warstwy Alokacji Pamięci RAM',
      totalAllocated: 'Łącznie zaalokowano',
      routingBuckets: 'Partycje Wymiarów OneSync (Routing Buckets)',
      routingSubtitle: 'Izolowane partycje synchronizacji obiektów w świecie',
      thBucketId: 'ID WYMIARU',
      thDimensionName: 'NAZWA WYMIARU',
      thPlayers: 'LICZBA GRACZY',
      thIsolation: 'TYP IZOLACJI',
      playersUnit: 'graczy'
    },

    // Logs Tab
    logsTab: {
      filterAll: 'WSZYSTKIE',
      filterServer: 'SERWER',
      filterTxAdmin: 'TXADMIN',
      filterChat: 'CZAT',
      filterWarn: 'OSTRZEŻENIA',
      searchPlaceholder: 'Szukaj w logach...',
      autoScroll: 'Autoprzewijanie',
      clear: 'Wyczyść',
      export: 'Eksportuj',
      sendCmdPlaceholder: 'Wpisz komendę RCON do wykonania w konsoli...',
      send: 'Wyślij'
    },

    // Admins Tab
    adminsTab: {
      statRegistered: 'Zarejestrowani Administratorzy',
      statSuper: 'Główni Administratorzy (Super)',
      stat2fa: 'Aktywne Zabezpieczenie 2FA',
      statStorage: 'Zabezpieczenie Haseł',
      storageDesc: 'PBKDF2 + Sól (Sha512)',
      searchPlaceholder: 'Szukaj administratora...',
      addAdmin: 'Dodaj Nowego Administratora',
      thAdmin: 'ADMINISTRATOR',
      thRole: 'ROLA',
      thPermissions: 'UPRAWNIENIA',
      thDiscord: 'DISCORD ID',
      th2fa: '2FA',
      thLastActive: 'OSTATNIA AKTYWNOŚĆ',
      thActions: 'AKCJE',
      btnEdit: 'Edytuj',
      btnDelete: 'Usuń',
      modalAddTitle: 'Dodaj Nowego Administratora',
      modalEditTitle: 'Edycja Administratora',
      usernameLabel: 'Nazwa Użytkownika',
      passwordLabel: 'Hasło Dostępowe',
      roleLabel: 'Rola / Ranga',
      discordLabel: 'Nazwa Discord (np. user#0001)',
      discordIdLabel: 'Discord Snowflake ID (opcjonalnie)',
      steamHexLabel: 'Steam Hex ID',
      permissionsLabel: 'Uprawnienia / Dostęp',
      enable2fa: 'Wymuszaj weryfikację dwuetapową 2FA',
      saveAdmin: 'Zapisz Administratora'
    },

    // Checklist Tab
    checklistTab: {
      readyBanner: 'GOTOWY DO WDROŻENIA PRODUKCYJNEGO',
      blockerBanner: 'WYMAGANE DZIAŁANIA PRZED STARTEM',
      title: 'Lista Kontrolna Wdrożenia (Production Checklist)',
      subtitle: 'Zanim udostępnisz serwer FiveM graczom na publicznym porcie, upewnij się, że domyślne hasła, tokeny mostka RPC oraz webhooki zostały zabezpieczone.',
      rescan: 'Skanuj Ponownie',
      readinessStatus: 'Stan gotowości systemu:',
      configuredOutOf: 'skonfigurowanych punktów',
      allTab: 'Wszystkie',
      criticalTab: 'Krytyczne blokady',
      recommendedTab: 'Zalecane',
      completedTab: 'Ukończone',
      detected: 'Wykryto:',
      tagReady: 'ZROBIONE',
      tagRequired: 'WYMAGANA ZMIANA',
      tagRecommended: 'ZALECANE',
      generateTokenBtn: 'Generuj bezpieczny token 64-bit'
    }
  },

  en: {
    // Navigation / Sidebar
    nav: {
      overview: 'OVERVIEW',
      management: 'MANAGEMENT',
      monitoring: 'MONITORING',
      system: 'SYSTEM',
      dashboard: 'Dashboard',
      players: 'Players',
      moderation: 'Moderation',
      resources: 'Resources',
      server: 'Server',
      logs: 'Console & Logs',
      checklist: 'Production Checklist',
      settings: 'Settings',
      admins: 'Admins',
      connectedNode: 'FiveM txAdmin Node',
      activeStatus: 'Active',
      versionTag: 'Version v2.4.0'
    },

    // Header
    header: {
      controlPlane: 'Control Plane',
      online: 'ONLINE',
      playersCount: 'PLAYERS',
      notifications: 'Notifications',
      noNotifications: 'No new notifications',
      markAllRead: 'Mark all as read',
      preflightPill: 'Pre-flight Checklist',
      quickActions: 'Quick Actions',
      refreshTelemetry: 'Refresh',
      copyIp: 'Copy IP',
      logout: 'Log out',
      tabs: {
        dashboard: {
          title: 'Dashboard',
          subtitle: 'Monitor your server status and manage active participants in real time.'
        },
        players: {
          title: 'Player Management',
          subtitle: 'Active connected players roster, duty assignments, and session telemetry.'
        },
        moderation: {
          title: 'Moderation & Enforcement',
          subtitle: 'Enforce server guidelines, synchronize txAdmin banlist, and track warnings.'
        },
        resources: {
          title: 'Resource Orchestrator',
          subtitle: 'Manage FXServer manifests, Lua heaps, and script execution states on the fly.'
        },
        server: {
          title: 'Telemetry & Performance',
          subtitle: 'Low-level hardware diagnostics, thread workloads, and OneSync partitions.'
        },
        logs: {
          title: 'Master Console & Live Logs',
          subtitle: 'Interactive FXServer master console (RCON) and live audit log stream.'
        },
        settings: {
          title: 'Control Plane Settings',
          subtitle: 'FXServer bridge integration, secret keys, Discord webhooks, and themes.'
        },
        admins: {
          title: 'Staff & Administrator Roster',
          subtitle: 'Manage administrative privileges, credentials, and 2FA authentication.'
        },
        checklist: {
          title: 'Production Deployment Checklist',
          subtitle: 'Vercel-style security and credentials pre-flight audit before opening to players.'
        }
      }
    },

    // Metric Cards
    metrics: {
      playersOnline: 'Players Online',
      lastHour: '+8 last hr',
      maxSlots: 'max capacity',
      onesyncStatus: 'OneSync: ACTIVE',
      tickTime: 'Server Tick Time',
      stable: 'Optimal',
      frameTarget: 'Target 16.6ms (60 FPS)',
      cpuLoad: 'CPU Workload',
      allCores: '8 Cores Active',
      ramAllocation: 'RAM Usage',
      totalAvailable: 'available on host',
      serverUptime: 'System Uptime',
      sinceBoot: 'Since restart',
      copyUptime: 'Copy',
      copiedUptime: 'Copied!',
      activeResources: 'Active Resources',
      stopped: 'stopped',
      manageScripts: 'Manage',
      outboundNet: 'Outbound Network',
      inboundNet: 'Inbound'
    },

    // Player Activity Chart
    chart: {
      title: 'Player Concurrency History (Last 24h)',
      subtitle: 'Real-time player distribution and connection peaks',
      liveNow: 'Currently Connected',
      peak: '24h Peak',
      average: '24h Average',
      playersUnit: 'players',
      slots: 'slots'
    },

    // Server Health
    health: {
      title: 'Node Health',
      subtitle: 'Host hardware diagnostics and metrics',
      statusNormal: 'Normal',
      cpuUtil: 'CPU Utilization',
      ramUtil: 'RAM Memory Allocation',
      networkIo: 'Network Throughput (I/O)',
      diskIo: 'SSD Storage I/O',
      nodeHealth: 'Node Stability Index'
    },

    // Connected Players widget
    connected: {
      title: 'Connected Players',
      subtitle: 'Active participants on the server',
      searchPlaceholder: 'Search by player, ID, role...',
      viewAll: 'View all',
      viewAllBtn: 'All Players',
      thId: 'ID',
      thPlayer: 'PLAYER',
      thJob: 'ROLE / OCCUPATION',
      thPing: 'PING',
      thSession: 'SESSION DURATION',
      thAction: 'ACTIONS',
      inspect: 'Inspect',
      kick: 'Kick',
      noPlayers: 'No connected players on the server.'
    },

    // Recent Activity
    activity: {
      title: 'Recent Activity',
      subtitle: 'Real-time server event and audit log stream',
      viewAllLogs: 'View All Logs',
      noActivity: 'No events registered yet.'
    },

    // Server Footer Banner
    footer: {
      engine: 'FXServer Engine Build:',
      endpoint: 'Direct Connection IP:',
      copyEndpoint: 'Copy IP',
      copied: 'Copied!',
      quickConsole: 'Open Console',
      emergencyHelp: 'Technical Support'
    },

    // Modals
    modals: {
      quickActions: {
        title: 'Quick Server Actions',
        subtitle: 'Instant server controls, commands, and broadcasts',
        announcementTitle: 'Global In-Game Announcement',
        announcementPlaceholder: 'Type announcement broadcast message for all players...',
        sendBroadcast: 'Send Broadcast',
        restartServer: 'Restart FXServer',
        restartIn: 'in',
        clearCache: 'Purge Server Cache',
        lockdown: 'Enable Maintenance Lockdown',
        openConsole: 'Master RCON Console'
      },
      inspect: {
        title: 'Player Profile & Diagnostics',
        serverIdentifiers: 'Player Identifiers',
        gameplayStats: 'In-Game Statistics',
        healthArmor: 'Health & Armor',
        finances: 'Finances',
        bank: 'Bank Account',
        cash: 'Wallet Cash',
        job: 'Role / Occupation',
        coords: 'Coordinates (XYZ)',
        ping: 'Network Latency',
        sessionTime: 'Session Length',
        actions: 'Administrative Moderation',
        reviveHeal: 'Heal & Revive (100%)',
        teleportTo: 'Teleport to Location',
        kickPlayer: 'Kick Participant',
        banPlayer: 'Issue Ban Sanction',
        banReasonPrompt: 'Reason for sanction:',
        confirmBan: 'Confirm Ban'
      },
      console: {
        title: 'FXServer Master RCON Console',
        placeholder: 'Enter server command (e.g. status, restart, ensure)...',
        clear: 'Clear view',
        execute: 'Execute'
      },
      resources: {
        title: 'FXServer Resource Manifest',
        searchPlaceholder: 'Search resources...',
        start: 'Start',
        stop: 'Stop',
        restart: 'Restart'
      }
    },

    // Players Tab
    playersTab: {
      statConnected: 'Connected Players',
      statPolice: 'Police on Duty',
      statEms: 'EMS Paramedics',
      statMechanics: 'Benny\'s Mechanics',
      unitsActive: 'units active on patrol',
      onDuty: 'on duty',
      inGarage: 'in workshop',
      slots: 'slots',
      searchPlaceholder: 'Search by player name, ID, role or license...',
      allRoles: 'All',
      police: 'Police',
      ems: 'EMS',
      mechanic: 'Mechanic',
      civilian: 'Civilian',
      sortById: 'Server ID',
      sortByPing: 'Lowest Ping',
      sortByName: 'Name A-Z',
      thId: 'ID',
      thPlayer: 'PLAYER',
      thRole: 'ROLE / OCCUPATION',
      thPing: 'PING',
      thSession: 'SESSION',
      thFinances: 'FINANCES',
      thHealth: 'HEALTH / ARMOR',
      thModeration: 'MODERATION',
      btnInspect: 'Inspect',
      btnKick: 'Kick',
      btnBan: 'Ban',
      noPlayersFound: 'No players match the specified criteria.'
    },

    // Moderation Tab
    moderationTab: {
      statActiveBans: 'Active Bans',
      statPermBans: 'Permanent Sanctions',
      statWarnings: 'Active Warnings',
      statStatus: 'Moderation System Status',
      allSystemsOk: 'All systems fully operational',
      tabBans: 'Banlist Entries',
      tabWarnings: 'Warning Points (Warns)',
      issueSanction: 'Issue New Sanction',
      searchBans: 'Search by ban ID, player, or reason...',
      thBanId: 'BAN ID',
      thTarget: 'TARGET PLAYER',
      thReason: 'REASON',
      thAdmin: 'ADMINISTRATOR',
      thDuration: 'DURATION',
      thActions: 'ACTIONS',
      unban: 'Revoke Ban (Unban)',
      dismiss: 'Dismiss Warning',
      modalTitle: 'Issue Server Sanction',
      targetLabel: 'Target Player (Name, ID, or License)',
      reasonLabel: 'Sanction Reason',
      durationLabel: 'Duration Period',
      permBan: 'Permanent',
      days3: '3 Days',
      days7: '7 Days',
      days14: '14 Days',
      warningType: 'Warning Point (Warn)',
      submitSanction: 'Apply Sanction'
    },

    // Resources Tab
    resourcesTab: {
      statManifested: 'Manifested Resources',
      statRunning: 'Active Runtime',
      statStopped: 'Stopped / Dormant',
      statLuaPool: 'Lua RAM Heap',
      searchPlaceholder: 'Filter resources by name or author...',
      all: 'All',
      running: 'Started',
      stopped: 'Stopped',
      core: 'Core Scripts',
      gameplay: 'Gameplay',
      standalone: 'Standalone',
      ensureBtn: 'Execute ensure',
      refreshAllBtn: 'Reload Manifests',
      thResource: 'RESOURCE',
      thAuthor: 'AUTHOR / VERSION',
      thType: 'TYPE',
      thStatus: 'STATUS',
      thControls: 'CONTROLS',
      btnStart: 'Start',
      btnStop: 'Stop',
      btnRestart: 'Restart'
    },

    // Server Tab
    serverTab: {
      statFps: 'Tick Frame Rate (FPS)',
      statOnesync: 'OneSync Mode',
      statNetIo: 'Network IOPS',
      statHealth: 'Node Health Index',
      cpuTitle: 'CPU Core Distribution',
      ramTitle: 'RAM Allocation Layers',
      totalAllocated: 'Total Allocated',
      routingBuckets: 'OneSync Routing Buckets',
      routingSubtitle: 'Isolated entity synchronization partitions in the game world',
      thBucketId: 'BUCKET ID',
      thDimensionName: 'DIMENSION NAME',
      thPlayers: 'ACTIVE PLAYERS',
      thIsolation: 'ISOLATION TYPE',
      playersUnit: 'players'
    },

    // Logs Tab
    logsTab: {
      filterAll: 'ALL',
      filterServer: 'SERVER',
      filterTxAdmin: 'TXADMIN',
      filterChat: 'CHAT',
      filterWarn: 'WARNINGS',
      searchPlaceholder: 'Search console logs...',
      autoScroll: 'Auto-scroll',
      clear: 'Clear',
      export: 'Export',
      sendCmdPlaceholder: 'Enter RCON command to execute on server...',
      send: 'Execute'
    },

    // Admins Tab
    adminsTab: {
      statRegistered: 'Registered Administrators',
      statSuper: 'Root Super Administrators',
      stat2fa: 'Active 2FA Protection',
      statStorage: 'Password Encryption',
      storageDesc: 'PBKDF2 + Salt (Sha512)',
      searchPlaceholder: 'Search administrator...',
      addAdmin: 'Add New Administrator',
      thAdmin: 'ADMINISTRATOR',
      thRole: 'ROLE',
      thPermissions: 'PERMISSIONS',
      thDiscord: 'DISCORD ID',
      th2fa: '2FA',
      thLastActive: 'LAST ACTIVE',
      thActions: 'ACTIONS',
      btnEdit: 'Edit',
      btnDelete: 'Delete',
      modalAddTitle: 'Add New Administrator',
      modalEditTitle: 'Edit Administrator',
      usernameLabel: 'Username',
      passwordLabel: 'Access Password',
      roleLabel: 'Role & Rank',
      discordLabel: 'Discord Tag (e.g. user#0001)',
      discordIdLabel: 'Discord Snowflake ID (optional)',
      steamHexLabel: 'Steam Hex ID',
      permissionsLabel: 'Access Rights / Permissions',
      enable2fa: 'Enforce Two-Factor Authentication (2FA)',
      saveAdmin: 'Save Administrator'
    },

    // Checklist Tab
    checklistTab: {
      readyBanner: 'READY FOR PRODUCTION DEPLOYMENT',
      blockerBanner: 'REQUIRED ACTIONS BEFORE LAUNCH',
      title: 'Production Deployment Checklist',
      subtitle: 'Before exposing your FiveM server on the public port, ensure default credentials, bridge RPC keys, and webhooks are secured.',
      rescan: 'Rescan System',
      readinessStatus: 'System readiness status:',
      configuredOutOf: 'configured checks',
      allTab: 'All Checks',
      criticalTab: 'Critical Blockers',
      recommendedTab: 'Recommended',
      completedTab: 'Completed',
      detected: 'Detected Value:',
      tagReady: 'READY',
      tagRequired: 'REQUIRED CHANGE',
      tagRecommended: 'RECOMMENDED',
      generateTokenBtn: 'Generate 64-bit Secure Token'
    }
  }
};

const LanguageContext = createContext({
  lang: 'pl',
  setLang: () => {},
  t: translations.pl
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('pl');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('just_admin_lang');
      if (saved === 'en' || saved === 'pl') {
        setLangState(saved);
      }
    } catch {}
  }, []);

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'pl') {
      setLangState(newLang);
      try {
        localStorage.setItem('just_admin_lang', newLang);
      } catch {}
    }
  };

  const t = translations[lang] || translations.pl;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
