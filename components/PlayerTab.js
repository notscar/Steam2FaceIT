import styles from "../styles/PlayerTab.module.css";

export default function PlayerTab({ player }) {
    return (
        <div className={styles.playerTab}>
            <img draggable="false" src={player.avatar} alt="" className={styles.playerImage}/>
            <div className={styles.playerInformation}>
                <div className={styles.spacedDiv}>
                    <img draggable="false" src={`levels/lvl${player.level}.svg`} className={styles.eloImage} alt=""/>
                    <a href={player.link} target="_blank" rel="noreferrer">
                        <div className={styles.playerName}>{player.name}</div>
                    </a>
                </div>
                <div>ELO: {player.elo}</div>
                <div>Winstreak: {player.winStreak}</div>
                <div>Win Rate: {player.winRate}%</div>
                <div className={styles.matches}>
                    {
                        player.recent.map((m, i) => {
                            return <span key={i} className={m === "1" ? styles.matchWin : styles.matchLoss}>{m === "1" ? "W" : "L"} </span>;
                        })
                    }
                </div>
            </div>
        </div>
    );
}