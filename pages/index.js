import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PlayerTab from "../components/PlayerTab";
import {useState} from "react";
import Head from "next/head";


export default function Search() {
    const [playerData, setPlayerData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function getPlayerInformation(steamId, steamType) {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/lookup?steam=${steamId}&type=${steamType}`);
            const data = await response.json();
            setPlayerData(data);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Head>
                <title>Steam to FACEIT</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <meta name="description" content="Discover FaceIT Accounts Linked to Players' Steam Profiles | Uncover Elo, Win Stats, Ban History, and More!"/>
                <link rel="shortcut icon" href="/favicon.png" type="image/x-icon"/>
                <meta name="keywords" content="FACEIT, STEAM, FACEIT TO STEAM, FACEIT2STEAM, STEAM TO FACEIT, STEAM2FACEIT, FACEIT ACCOUNT"/>
                <link rel="icon" href="/favicon.png" type="image/x-icon"/>

                <meta property="og:title" content="Steam to FACEIT"/>
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Discover FaceIT Accounts Linked to Players' Steam Profiles | Uncover Elo, Win Stats, Ban History, and More!"/>
                <meta property="og:url" content="https://faceit.notscar.com"/>
                <meta property="og:image" content="/favicon.png"/>
                <meta property="og:image:type" content="image/png" />
            </Head>
            <Header/>
            <SearchBar searchAction={getPlayerInformation} isLoading={isLoading}/>
            {Object.keys(playerData).length > 1 &&
                <PlayerTab player={playerData}/>
            }
        </div>
    );
}