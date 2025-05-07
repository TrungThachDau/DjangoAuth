import Link from "next/link";
import styles from "./view_bar.module.css";
const ViewBar = ({ view, setView }) => {
    return (
        <nav className={styles["navbar-custom"]}>
              <div className={styles["navbar-brand"]}>
                <Link href="/" className={styles["nav-link"]}>
                  Share
                </Link>
                <Link href="/customer" className={styles["nav-link"]}>
                  Download
                </Link>
              </div>
              <div className={styles["navbar-center"]}>
                        Photos.jpg
              </div>
            <div className={styles["navbar-nav"]}>
                <Link href="/view/1" className={styles["nav-link"]}>
                Information
                </Link>
            </div>

            </nav>
    );
}
export default ViewBar;