# Just AdminPanel

Lekki i nowoczesny panel webowy do zarzadzania serwerem bardzo dobry zamiennik txAdmina jezeli szukasz czegos z nowoczesnym wygladem co nie zamula maszyny i dziala od strzala

Dziala bezposrednio na glownym porcie FiveM (30120) przez wbudowany http handler wiec nie musisz stawiac zewnetrznych baz danych ani otwierac kolejnych portow na maszynie.

<p align="center">
  <img src="docs/dashboard-preview.jpg" alt="Dashboard Preview" width="100%" />
</p>

## Co potrafi

* Podglad na zywo FPS serwera tick time oraz zuzycia RAM i CPU
* Pelna lista graczy online z podgladem pingu pracy gotowki i identyfikatorow Steam oraz Discord
* Szybkie akcje na graczach (kick ban revive heal teleport) dzialajace z ESX i QBCore
* Zdalna konsola RCON bezposrednio w przegladarce
* Zarzadzanie skryptami (start stop restart) bez restartowania calego serwera
* Lista aktywnych banow z opcja szybkiego unbana
* Zakladka z konfiguracja gdzie mozesz przetestowac polaczenie z serwerem i ustawic webhooki

## Screeny

| Dashboard | Ustawienia i most |
|---|---|
| <img src="docs/dashboard-preview.jpg" width="100%" /> | <img src="docs/settings-preview.jpg" width="100%" /> |

## Jak to dziala

Panel gada z Twoim serwerem przez lekki skrypt `just_admin`. Wykorzystuje natywny `SetHttpHandler` wiec komunikacja leci bezposrednio po porcie 30120 z autoryzacja tokenem.

```
Panel Web -> Next.js API -> FXServer (port 30120) -> just_admin
```

## Instalacja

### 1. Skrypt FiveM

1. Skopiuj folder `fivem_resource/just_admin` do katalogu `resources/` na swoim serwerze
2. W pliku `resources/just_admin/config.lua` wpisz swoj token:
```lua
Config = {}
Config.ApiKey = "twojtoken"
Config.PanelUrl = "http://localhost:3000"
Config.WebhookEvents = true
```
3. W pliku `server.cfg` dopisz:
```cfg
ensure just_admin
```
4. Wpisz w konsoli serwera `refresh` i `start just_admin` albo po prostu zrestartuj serwer

### 2. Panel

1. Zainstaluj zaleznosci:
```bash
npm install
```
2. Skonfiguruj plik `.env.local` z tym samym tokenem co w skrypcie:
```env
FIVEM_ENDPOINT=http://127.0.0.1:30120/just_admin
JUST_API_KEY=twoj-tajny-token
```
3. Odpal panel:
```bash
npm run dev
```

Panel dziala domyslnie pod adresem `http://localhost:3000`.

## Konfiguracja w panelu

W zakladce Ustawienia mozesz na biezaco:
* Sprawdzic czy panel widzi serwer przyciskiem testu polaczenia (pokazuje ping w ms)
* Zmienic jak czesto pobierane sa dane z serwera (od 1s do 10s)
* Wkleic webhooki z Discorda pod logi z kickow i banow
* Zmienic ilosc slotow tryb OneSync oraz build gry
* Wyeksportowac cala konfiguracje do pliku json

## Licencja

MIT
