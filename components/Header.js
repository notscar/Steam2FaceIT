import styles from "../styles/Header.module.css";
import logo from "../public/logo.png";

export default function Header() {
    return (
        <div className={styles.header}>
            <img draggable="false" src="/logo.png" className={styles.headerLogo} alt={"logo"}/>
            <div className={styles.headerTitle}>Finder</div>
        </div>
    );
}