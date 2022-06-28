import styles from "../styles/SearchBar.module.css";
import {useState} from "react";
import {RingLoader} from "react-spinners";

const steamIdRegex = new RegExp(/id\/([^\/]+)/);
const steamProfileRegex = new RegExp(/profiles\/([0-9]+)/);

export default function SearchBar({ searchAction, isLoading }) {
    const [inputText, setInputText] = useState("");

    function clickWrapper(e) {
        e.preventDefault();

        const steamCustomId = steamIdRegex.exec(inputText);
        const steamProfileId = steamProfileRegex.exec(inputText);

        if (steamIdRegex.test(inputText)) {
            searchAction(steamCustomId[1], "VanityURL");
            return;
        }

        if (steamProfileRegex.test(inputText)) {
            searchAction(steamProfileId[1], "SteamID");
            return;
        }

        if (/^-?\d+$/.test(inputText)) {
            searchAction(inputText, "SteamID");
            return;
        }

        searchAction(inputText, "VanityURL");
    }

    function changeWrapper({ target }) {
        setInputText(target.value);
    }

    return (
        <form action="">
            <div className={styles.searchBar}>

                <input type="text" className={styles.input} placeholder={"SteamID | Steam Link"} onChange={changeWrapper}/>
                <button className={styles.button} onClick={clickWrapper}>
                    <RingLoader
                        loading={isLoading}
                        size={33}
                        speedMultiplier={1}
                    />
                    {isLoading ? "" : "Lookup"}
                </button>
            </div>
        </form>
    );
}