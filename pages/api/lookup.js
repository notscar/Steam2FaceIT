const axios = require("axios");

async function getPlayerInformation(playerName) {
    const config = {
        params: {
            nickname: playerName,
            game: "cs2"
        },
        headers: {
            accept: "application/json",
            authorization: "Bearer " + process.env.FACEIT_API_KEY
        }
    };

    const response = await axios.get("https://open.faceit.com/data/v4/players", config);
    return response.data;
}

async function getPlayerFromSteam(steam) {
    const config = {
        params: {
            nickname: steam,
            game: "cs2",
            offset: 0,
            limit: 1
        },
        headers: {
            accept: "application/json",
            authorization: "Bearer " + process.env.FACEIT_API_KEY
        }
    };

    const response = await axios.get("https://open.faceit.com/data/v4/search/players", config);
    return response.data.items[0]["nickname"];
}

async function getPlayerSteamIdFromVanityURL(vanityUrl) {
    const config = {
        params: {
            key: process.env.STEAM_API_KEY,
            vanityurl: vanityUrl
        }
    };
    const response = await axios.get("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/", config);
    return response.data.response["steamid"];
}

async function getPlayerFaceitStats(userId) {
    const config = {
        headers: {
            accept: "application/json",
            authorization: "Bearer " + process.env.FACEIT_API_KEY
        }
    };
    const response = await axios.get(`https://open.faceit.com/data/v4/players/${userId}/stats/cs2`, config);
    return response.data;
}

async function getPlayerActiveBan(userId) {
    let response

    response = await axios.get(`https://api.faceit.com/sheriff/v1/bans/${userId}`);
    if (response.data.code === "OPERATION-OK") {
        for (const ban of response.data.payload) {
            if (ban.game !== "cs2") {
                continue
            }

            const dateDiff = new Date(ban.ends_at) - new Date(ban.starts_at); 
            if (dateDiff > 0) {
                return {
                    banReason: ban.reason,
                    banStart: ban.starts_at,
                    banEnd: ban.ends_at,
                    banner: "Manual Ban (SH-1)"
                }
            }
        }
    }

    response = await axios.get(`https://api.faceit.com/queue/v1/ban?userId=${userId}&organizerId=faceit&offset=0&limit=100`);
    if (response.data.code !== "OPERATION-OK") {
        return null
    }

    for (const ban of response.data.payload) {
        if (!ban.expired) {
            return {
                banReason: ban.reason,
                banStart: ban.banStart,
                banEnd: ban.banEnd,
                banner: ban["createdBy"].nickname
            }
        }
    }
    return null;
}

export default async function handler(req, res) {
    try {
        const steamId = req.query.type === "VanityURL" ? await getPlayerSteamIdFromVanityURL(req.query.steam) : req.query.steam;
        const playerFaceitName = await getPlayerFromSteam(steamId);

        if (!playerFaceitName) {
            res.status(400).json({error: "Player not found"});
        }


        const playerFaceitData = await getPlayerInformation(playerFaceitName);
        const playerFaceitStats = await getPlayerFaceitStats(playerFaceitData["player_id"]);
        const playerBanData = await getPlayerActiveBan(playerFaceitData["player_id"]);

        res.status(200).json({
            avatar: playerFaceitData["avatar"],
            country: playerFaceitData["country"],
            elo: playerFaceitData["games"]["cs2"]["faceit_elo"],
            level: playerFaceitData["games"]["cs2"]["skill_level"],
            id: playerFaceitData["player_id"],
            link: playerFaceitData["faceit_url"].replace("{lang}", "en"),
            name: playerFaceitName,
            kd: playerFaceitStats["lifetime"]["Average K/D Ratio"],
            recent: playerFaceitStats["lifetime"]["Recent Results"],
            winRate: playerFaceitStats["lifetime"]["Win Rate %"],
            winStreak: playerFaceitStats["lifetime"]["Current Win Streak"],
            ban: playerBanData
        });
    } catch (err) {
        res.status(400).json({error: "Couldn't find player"});
    }


}
