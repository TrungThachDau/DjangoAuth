import { Link } from "react-router-dom";
import './nav_bar.css';
import { useEffect, useState } from "react";
import MyDrop from "../drop_down/drop_down.jsx";

const NavBar = () => {
    const [isLogin, setIsLogin] = useState(false);
    const user = sessionStorage.getItem("username");

    useEffect(() => {
        if (sessionStorage.getItem('username')) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, []);

    return (
        <nav className="navbar-custom">
            <div className="navbar-brand">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/customer" className="nav-link">Customer</Link>
                <Link to="/role_employee" className="nav-link">Role</Link>
                <Link to="/employee" className="nav-link">Employee</Link>
            </div>
            <div className="navbar-menu">
                {isLogin ? (
                    <MyDrop status={"Hi, " + user}

                    />
                    // <Link to="/sign-out" className="nav-link">Hi, {user}, Sign out</Link>
                ) : (
                    <Link to="/sign-in" className="nav-link">Sign in</Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;