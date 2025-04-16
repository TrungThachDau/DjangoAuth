import { Link } from "react-router-dom";
import './nav_bar.css'; // Optional: Add styles for the navbar

const NavBar = () => {
    return (
        <nav className="navbar-custom">
            <div className="navbar-brand">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/products" className="nav-link">Customer</Link>
                <Link to="/about" className="nav-link">Role</Link>
                <Link to="/about" className="nav-link">Employee</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/customer" className="nav-link">Sign in</Link>
            </div>
        </nav>
    );
}

export default NavBar;