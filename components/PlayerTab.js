import styles from "../styles/PlayerTab.module.css";

function getTimeBetweenDatesString(d1, d2) {
    let duration = d1 - d2; // Duration in milliseconds

    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    duration -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(duration / (1000 * 60 * 60));

    let durationString = "";

    if (days) {
        durationString += `${days}d `;
    }
    if (hours) {
        durationString += `${hours}h`;
    }

    return durationString;
}

export default function PlayerTab({player}) {
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
                <div>
                    <div className={styles.matches}>
                        {
                            player.recent.map((m, i) => {
                                return <span key={i} className={m === "1" ? styles.matchWin : styles.matchLoss}>{m === "1" ? "W" : "L"} </span>;
                            })
                        }
                    </div>
                    {player.ban && <div className={styles.banTag}>BAN</div>}
                </div>

            </div>
            {player.ban &&
                <div className={styles.ban}>
                    <div className={styles.banField}>Reason <span>{player.ban.banReason}</span></div>
                    <div className={styles.banField}>From <span>{new Date(player.ban.banStart).toLocaleDateString()}</span></div>
                    <div className={styles.banField}>To <span>{new Date(player.ban.banEnd).toLocaleDateString()}</span></div>
                    <div className={styles.banField}>Length <span>{getTimeBetweenDatesString(new Date(player.ban.banEnd), new Date(player.ban.banStart))}</span></div>

                </div>
            }
        </div>
    );
}