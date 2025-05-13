import Link from "next/link";
import { useEffect, useState } from "react";
import MyDrop from "./drop_down";
import styles from "./nav_bar.module.css";

const NavBar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof window !== "undefined") {
        const username = sessionStorage.getItem("username");
        setIsLogin(!!username);
        setUser(username || "");
      }
    };

    checkLoginStatus();
  }, []);
  const nav_item = [
    { name: "Home", path: "/" },
    { name: "Customer", path: "/admin/customer" },
    { name: "Files Request", path: "/admin/files_request" },
    // { name: "Role Employee", path: "/role_employee" },
    // { name: "Employee", path: "/employee" },
  ];
  return (
    <nav className={styles["navbar-custom"]}>
      <div className={styles["navbar-brand"]}>
        
        {nav_item.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={styles["nav-link"]}
          >
            {item.name}
          </Link>
        ))}
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