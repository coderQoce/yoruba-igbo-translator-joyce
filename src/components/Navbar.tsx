import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="mobile-header">
          <div className="logo">YoToIgb</div>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/add" onClick={() => setMenuOpen(false)}>Add</Link></li>
          <li><Link to="/edit" onClick={() => setMenuOpen(false)}>Edit</Link></li>
        </ul>

      </div>
    </div>
  );
};

export default Navbar;
