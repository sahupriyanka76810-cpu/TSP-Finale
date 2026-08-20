//Navbar.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
    window.location.reload();
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>✦ The Blog</Link>
      </div>
      <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-links${menuOpen ? " open" : ""}`}>
        {/* Always show Home link */}
        <Link to="/" onClick={closeMenu}>Home</Link>

        {token ? (
          <>
            <Link to="/my-blogs" onClick={closeMenu}>My Blogs</Link>
            <Link to="/create" onClick={closeMenu}>Create Post</Link>
            <span className="navbar-user">
              <span className="navbar-avatar">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </span>
              {userName}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
