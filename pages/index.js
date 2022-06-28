import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlayerTab from "../components/PlayerTab";
import { useState } from 'react';



export default function Search() {
    const [playerData, setPlayerData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function getPlayerInformation(steamId, steamType) {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/lookup?steam=${steamId}&type=${steamType}`);
            const data = await response.json()
            setPlayerData(data);
            setIsLoading(false);
        } catch(err) {
            setIsLoading(false);
        }


    }

    return (
        <div>
            <Header/>
            <SearchBar searchAction={getPlayerInformation} isLoading={isLoading}/>
            {Object.keys(playerData).length > 1 &&
                <PlayerTab player={playerData}/>
            }
        </div>
    );
}