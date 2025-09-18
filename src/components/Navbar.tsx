import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="nav-logo">
          <Link to="/">
            <span className="logo-text">Homo</span>
            <span className="logo-dot"></span>
          </Link>
        </div>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <div className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="link-text">Home</span>
              <span className="link-underline"></span>
            </Link>
          </div>
          <div className="nav-item">
            <Link 
              to="/add" 
              className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`}
            >
              <span className="link-text">Add</span>
              <span className="link-underline"></span>
            </Link>
          </div>
          <div className="nav-item">
            <Link 
              to="/edit" 
              className={`nav-link ${location.pathname === '/edit' ? 'active' : ''}`}
            >
              <span className="link-text">Edit</span>
              <span className="link-underline"></span>
            </Link>
          </div>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? (
            <X size={28} className="toggle-icon" />
          ) : (
            <Menu size={28} className="toggle-icon" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;