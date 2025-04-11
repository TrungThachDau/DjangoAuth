import { Link } from "react-router-dom";
// import './nav_bar.css'; // Optional: Add styles for the navbar

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Home</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/customer">Customer</Link>
                <Link to="/employee">Employee</Link>
                <Link to="/role">Role</Link>
            </div>
        </nav>
    );
}

export default NavBar;