CustomBridge = {}

--- Custom ban hook
-- @param targetId string|number Player server ID
-- @param reason string Ban explanation
-- @param duration string Duration (e.g. 'PERMANENT', '3 DAYS')
-- @param admin string Staff nickname or 'Panel'
-- @param extra table Full payload sent from panel (identifiers, timestamps, etc.)
function CustomBridge.OnBan(targetId, reason, duration, admin, extra)
    -- TriggerEvent('my_framework:ban', targetId, reason, duration, admin, extra)
    -- ExecuteCommand(('sqlban %s %s %s'):format(targetId, duration == 'PERMANENT' and '0' or '3d', reason))

    DropPlayer(tostring(targetId), ('JustRP [BAN]: %s | By: %s | Time: %s'):format(reason, admin or 'Panel', duration or 'Permanent'))
    return true
end

--- Custom kick hook
-- @param targetId string|number Player server ID
-- @param reason string Kick explanation
-- @param admin string Staff nickname or 'Panel'
-- @param extra table Full payload sent from panel
function CustomBridge.OnKick(targetId, reason, admin, extra)
    -- TriggerEvent('my_framework:kick', targetId, reason, admin, extra)
    DropPlayer(tostring(targetId), ('JustRP [KICK]: %s (Staff: %s)'):format(reason, admin or 'Panel'))
    return true
end

--- Custom revive hook
-- @param targetId string|number Player server ID
-- @param extra table Full payload sent from panel
function CustomBridge.OnRevive(targetId, extra)
    local ped = GetPlayerPed(targetId)
    if DoesEntityExist(ped) then
        SetEntityHealth(ped, 200)
        SetPedArmour(ped, 100)
    end
    TriggerClientEvent('esx_ambulancejob:revive', targetId)
    TriggerClientEvent('hospital:client:Revive', targetId)
    TriggerClientEvent('qbx_medical:client:playerRevived', targetId)
    return true
end

--- Custom teleport hook
-- @param targetId string|number Player server ID
-- @param coords vector3|table Target coordinates { x, y, z }
-- @param extra table Full payload sent from panel
function CustomBridge.OnTeleport(targetId, coords, extra)
    local ped = GetPlayerPed(targetId)
    if DoesEntityExist(ped) and coords then
        SetEntityCoords(ped, coords.x, coords.y, coords.z, false, false, false, false)
        return true
    end
    return false
end

--- Custom broadcast announcement hook
-- @param message string Announcement text
-- @param extra table Full payload sent from panel
function CustomBridge.OnAnnouncement(message, extra)
    -- ESX / QBCore announcement trigger
    TriggerClientEvent('chat:addMessage', -1, {
        color = { 255, 90, 31 },
        multiline = true,
        args = { 'OGŁOSZENIE / ANNOUNCEMENT', message }
    })
    return true
end

--- Custom banlist getter
-- @param filter table Optional filter parameters
-- @return table|nil Return table of bans or nil to use panel local storage
function CustomBridge.GetBans(filter)
    return nil
end
