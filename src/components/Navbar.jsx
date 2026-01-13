import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <div className="nav-left">
            <Link to="/" className="nav-logo" onClick={closeMenu}>
              <img src="/logo.png" alt="IARE MUN Logo" className="logo-img" />
              <span className="logo-text">IARE MUN</span>
            </Link>
          </div>


          <div className="nav-right">
            <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
              <span className={`hamburger ${isOpen ? 'active' : ''}`}></span>
            </button>

            <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
              </li>
              <li className="nav-item">
                <Link to="/committees" className="nav-link" onClick={closeMenu}>Committees</Link>
              </li>
              <li className="nav-item">
                <Link to="/schedule" className="nav-link" onClick={closeMenu}>Schedule</Link>
              </li>
              <li className="nav-item">
                <Link to="/secretariat" className="nav-link" onClick={closeMenu}>Secretariat</Link>
              </li>
              <li className="nav-item">
                <Link to="/country-matrix" className="nav-link" onClick={closeMenu}>Country Matrix</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-btn" onClick={closeMenu}>Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
