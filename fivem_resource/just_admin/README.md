# Just AdminPanel - Skrypt Serwerowy FiveM

Skrypt mostu (bridge) dla FiveM FXServer umozliwiajacy polaczenie z panelem administracyjnym Just AdminPanel.

## Instalacja na serwerze FiveM

1. Skopiuj folder `just_admin` do katalogu `resources/` na Twoim serwerze (np. `resources/[admin]/just_admin`).
2. Otworz `config.lua` i ustaw swoj unikalny klucz API oraz adres panelu:
   ```lua
   Config.ApiKey = 'twoj-tajny-token-12345'
   Config.PanelUrl = 'http://twoje-ip-panelu:3000'
   ```
3. W pliku `.env.local` w projekcie panelu ustaw ten sam token i endpoint serwera:
   ```env
   JUST_API_KEY=twoj-tajny-token-12345
   FIVEM_ENDPOINT=http://ip-serwera-fivem:30120/just_admin
   ```
4. Dodaj do swojego `server.cfg`:
   ```cfg
   ensure just_admin
   ```
5. Zrestartuj serwer lub wpisz w konsoli `refresh` i `start just_admin`.

## Obslugiwane funkcje
- Pobieranie listy graczy na zywo (ping, kordy, identyfikatory Steam/Discord/License, praca, gotowka)
- Wyrzucanie (Kick) i banowanie (Ban)
- Leczenie i ozywianie (Revive/Heal kompatybilne z ESX i QBCore)
- Teleportacja
- Zdalna konsola RCON
- Zarzadzanie skryptami (start, stop, restart)
- Synchronizacja zdarzen przez webhooki (dolaczenia, wyjscia graczy)
