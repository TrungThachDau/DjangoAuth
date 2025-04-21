import Link from "next/link";
import styles from "./nav_bar.module.css"
import { useEffect, useState } from "react";
import MyDrop from "./drop_down";

const NavBar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = sessionStorage.getItem("username");
      setIsLogin(!!username);
      setUser(username || "");
    }
  }, []);

  return (
    <nav className={styles["navbar-custom"]}>
      <div className={styles["navbar-brand"]}>
        <Link href="/" className={styles["nav-link"]}>
          Home
        </Link>
        <Link href="/customer" className={styles["nav-link"]}>
          Customer
        </Link>
        <Link href="/role_employee" className={styles["nav-link"]}>
            Role Employee         
        </Link>
        <Link href="/employee" className={styles["nav-link"]}>
          Employee
        </Link>
      </div>
      <div className={styles["navbar-menu"]}>
        {isLogin ? (
          <MyDrop status={`Hi, ${user}`} />
        ) : (
          <Link href="/auth/sign-in" className={styles["nav-link"]}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;