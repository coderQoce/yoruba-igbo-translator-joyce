import React from 'react';


const Navbar: React.FC = () => {
  return (
   <div className="navbar">
  <div className="navbar-content">
    <div className="logo">YoToIgb</div>
    <ul className="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </div>
</div>

  );
};

export default Navbar;
