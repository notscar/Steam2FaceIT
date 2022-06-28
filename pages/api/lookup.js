const axios = require("axios");

async function getPlayerInformation(playerName) {
    const config = {
        params: {
            nickname: playerName,
            game: "csgo"
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
            game: "csgo",
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
    const response = await axios.get(`https://open.faceit.com/data/v4/players/${userId}/stats/csgo`, config);
    return response.data;
}

export default async function handler(req, res) {
    const playerData = {};
    try {
        const steamId = req.query.type === "VanityURL" ? await getPlayerSteamIdFromVanityURL(req.query.steam) : req.query.steam;
        const playerFaceitName = await getPlayerFromSteam(steamId);

        if (!playerFaceitName) {
            res.status(400).json({ error: "Player not found" });
        }


        const playerFaceitData = await getPlayerInformation(playerFaceitName);
        const playerFaceitStats = await getPlayerFaceitStats(playerFaceitData["player_id"]);
        res.status(200).json({
            avatar: playerFaceitData["avatar"],
            country: playerFaceitData["country"],
            elo: playerFaceitData["games"]["csgo"]["faceit_elo"],
            level: playerFaceitData["games"]["csgo"]["skill_level"],
            id: playerFaceitData["player_id"],
            link: playerFaceitData["faceit_url"].replace("{lang}", "en"),
            name: playerFaceitName,
            kd: playerFaceitStats["lifetime"]["Average K/D Ratio"],
            recent: playerFaceitStats["lifetime"]["Recent Results"],
            winRate: playerFaceitStats["lifetime"]["Win Rate %"],
            winStreak: playerFaceitStats["lifetime"]["Current Win Streak"]
        });
    } catch (err) {
        res.status(400).json({ error: "Couldn't find player" });
    }


}
