import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="navbar navbar-light fixed-top bg-white border-bottom">
      <ul className="nav navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/about">
            Info
          </Link>
        </li>
      </ul>
    </div>
  );
}

Header.propTypes = {};

export default Header;
