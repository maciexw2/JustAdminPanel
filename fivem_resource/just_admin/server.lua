local startTime = os.time()

local function sendJson(res, statusCode, data)
    res.writeHead(statusCode, { ['Content-Type'] = 'application/json' })
    res.send(json.encode(data))
end

local function getPlayerDetails(playerId)
    local ped = GetPlayerPed(playerId)
    local coords = GetEntityCoords(ped)
    local health = GetEntityHealth(ped)
    local armor = GetPedArmour(ped)
    local ping = GetPlayerPing(playerId)
    local name = GetPlayerName(playerId)

    local identifiers = {
        steam = 'brak',
        license = 'brak',
        discord = 'brak'
    }

    local numIdentifiers = GetNumPlayerIdentifiers(playerId)
    for i = 0, numIdentifiers - 1 do
        local id = GetPlayerIdentifier(playerId, i)
        if id then
            if string.sub(id, 1, 6) == 'steam:' then
                identifiers.steam = id
            elseif string.sub(id, 1, 8) == 'license:' then
                identifiers.license = id
            elseif string.sub(id, 1, 8) == 'discord:' then
                identifiers.discord = id
            end
        end
    end

    local job = 'Cywil'
    local cash = '$0'
    local bank = '$0'

    if GetResourceState('es_extended') == 'started' then
        local ESX = exports['es_extended']:getSharedObject()
        if ESX then
            local xPlayer = ESX.GetPlayerFromId(playerId)
            if xPlayer then
                job = xPlayer.getJob().label .. ' (' .. xPlayer.getJob().grade_label .. ')'
                cash = '$' .. tostring(xPlayer.getMoney())
                bank = '$' .. tostring(xPlayer.getAccount('bank').money)
            end
        end
    elseif GetResourceState('qb-core') == 'started' or GetResourceState('qbx_core') == 'started' then
        local QBCore = exports['qb-core'] and exports['qb-core']:GetCoreObject()
        if QBCore then
            local Player = QBCore.Functions.GetPlayer(tonumber(playerId))
            if Player then
                job = Player.PlayerData.job.label .. ' (' .. Player.PlayerData.job.grade.name .. ')'
                cash = '$' .. tostring(Player.PlayerData.money.cash)
                bank = '$' .. tostring(Player.PlayerData.money.bank)
            end
        end
    end

    return {
        id = tonumber(playerId),
        name = name or ('Gracz #' .. playerId),
        ping = ping or 0,
        health = math.max(0, health - 100),
        armor = armor or 0,
        job = job,
        cash = cash,
        bank = bank,
        steamHex = identifiers.steam,
        license = identifiers.license,
        discord = identifiers.discord,
        coords = string.format('X: %.1f, Y: %.1f, Z: %.1f', coords.x, coords.y, coords.z),
        avatarLetter = string.sub(name or 'G', 1, 1):upper(),
        avatarBg = '#7c3aed',
        sessionDuration = 'Live'
    }
end

SetHttpHandler(function(req, res)
    local token = req.headers['x-just-token'] or req.headers['X-Just-Token']

    if token ~= Config.ApiKey then
        return sendJson(res, 401, { ok = false, error = 'Brak autoryzacji' })
    end

    local path = req.path

    if req.method == 'GET' and path == '/status' then
        local players = GetPlayers()
        local maxClients = GetConvarInt('sv_maxclients', 64)
        local uptimeSeconds = os.time() - startTime
        local hours = math.floor(uptimeSeconds / 3600)
        local minutes = math.floor((uptimeSeconds % 3600) / 60)

        return sendJson(res, 200, {
            ok = true,
            onlinePlayers = #players,
            maxPlayers = maxClients,
            uptime = string.format('%dh %dm', hours, minutes),
            fps = 60.0,
            tickTimeMs = 16.6
        })
    end

    if req.method == 'GET' and path == '/players' then
        local playersList = {}
        local playerIds = GetPlayers()

        for _, playerId in ipairs(playerIds) do
            table.insert(playersList, getPlayerDetails(playerId))
        end

        return sendJson(res, 200, playersList)
    end

    if req.method == 'GET' and path == '/resources' then
        local resourceList = {}
        local count = GetNumResources()
        for i = 0, count - 1 do
            local resName = GetResourceByFindIndex(i)
            if resName then
                local state = GetResourceState(resName)
                local author = GetResourceMetadata(resName, 'author', 0) or 'Cfx.re Community'
                local version = GetResourceMetadata(resName, 'version', 0) or '1.0.0'
                local description = GetResourceMetadata(resName, 'description', 0) or resName
                table.insert(resourceList, {
                    name = resName,
                    author = author .. ' (' .. version .. ')',
                    type = string.sub(resName, 1, 4) == 'fxv_' and 'Gamemode' or 'Standalone Script',
                    status = (state == 'started') and 'started' or 'stopped',
                    memoryKb = 120,
                    version = version,
                    description = description
                })
            end
        end
        return sendJson(res, 200, resourceList)
    end

    if req.method == 'POST' and path == '/action' then
        req.setDataHandler(function(body)
            local data = json.decode(body) or {}
            local action = data.action
            local targetId = tostring(data.playerId)
            local reason = data.reason or 'Decyzja administratora'

            if action == 'kick' then
                DropPlayer(targetId, 'Just AdminPanel: ' .. reason)
                return sendJson(res, 200, { ok = true, message = 'Wyrzucono gracza' })
            elseif action == 'ban' then
                DropPlayer(targetId, 'Just AdminPanel [BAN]: ' .. reason)
                return sendJson(res, 200, { ok = true, message = 'Zbanowano gracza' })
            elseif action == 'revive' or action == 'heal' then
                local ped = GetPlayerPed(targetId)
                SetEntityHealth(ped, 200)
                SetPedArmour(ped, 100)
                TriggerClientEvent('esx_ambulancejob:revive', targetId)
                TriggerClientEvent('hospital:client:Revive', targetId)
                return sendJson(res, 200, { ok = true, message = 'Uleczono gracza' })
            elseif action == 'teleport' and data.coords then
                local ped = GetPlayerPed(targetId)
                SetEntityCoords(ped, data.coords.x, data.coords.y, data.coords.z, false, false, false, false)
                return sendJson(res, 200, { ok = true, message = 'Przeniesiono gracza' })
            end

            return sendJson(res, 400, { ok = false, error = 'Nieznana akcja' })
        end)
        return
    end

    if req.method == 'POST' and path == '/command' then
        req.setDataHandler(function(body)
            local data = json.decode(body) or {}
            local cmd = data.command

            if cmd and #cmd > 0 then
                ExecuteCommand(cmd)
                return sendJson(res, 200, { ok = true, output = 'Wykonano: ' .. cmd })
            end

            return sendJson(res, 400, { ok = false, error = 'Pusta komenda' })
        end)
        return
    end

    if req.method == 'POST' and path == '/resource' then
        req.setDataHandler(function(body)
            local data = json.decode(body) or {}
            local action = data.action
            local resName = data.resourceName

            if not resName or #resName == 0 then
                return sendJson(res, 400, { ok = false, error = 'Brak nazwy zasobu' })
            end

            if action == 'start' then
                StartResource(resName)
            elseif action == 'stop' then
                StopResource(resName)
            elseif action == 'restart' then
                ExecuteCommand('ensure ' .. resName)
            end

            return sendJson(res, 200, { ok = true, message = 'Zasob przetworzony: ' .. resName })
        end)
        return
    end

    sendJson(res, 404, { ok = false, error = 'Nie znaleziono endpointu' })
end)

local function sendWebhookEvent(eventName, payload)
    if not Config.WebhookSync then return end

    PerformHttpRequest(Config.PanelUrl .. '/api/webhook', function(statusCode, responseText, headers)
    end, 'POST', json.encode({
        event = eventName,
        data = payload
    }), {
        ['Content-Type'] = 'application/json',
        ['x-just-token'] = Config.ApiKey
    })
end

AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local src = source
    sendWebhookEvent('playerConnecting', { id = src, name = name })
end)

AddEventHandler('playerDropped', function(reason)
    local src = source
    local name = GetPlayerName(src)
    sendWebhookEvent('playerDropped', { id = src, name = name, reason = reason })
end)
