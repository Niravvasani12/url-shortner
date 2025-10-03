import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false); // Close menu after logout
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="nav">
      <Link className="logo" to="/" onClick={closeMobileMenu}>
        URL Shortener
      </Link>
      <div className="spacer" />

      {/* Desktop Menu */}
      {!user ? (
        <div className="actions">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </div>
      ) : (
        <div className="actions">
          <span className="user-info">Hi, {user.name || user.email}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Mobile Menu Button (Hamburger) */}
      <button
        className={`mobile-menu-btn ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        {!user ? (
          <>
            <NavLink to="/login" onClick={closeMobileMenu}>
              Login
            </NavLink>
            <NavLink to="/signup" onClick={closeMobileMenu}>
              Signup
            </NavLink>
          </>
        ) : (
          <>
            <div className="mobile-user-info">
              Welcome, {user.name || user.email}
            </div>
            <NavLink to="/dashboard" onClick={closeMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" onClick={closeMobileMenu}>
              Profile
            </NavLink>
            <div className="mobile-menu-divider"></div>
            <button
              className="btn btn-danger mobile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
