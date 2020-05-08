import PropTypes from 'prop-types';
import React from 'react';

function Navbar({ children }) {
  return (
    <div className="navbar navbar-light bg-white border-bottom">{children}</div>
  );
}

Navbar.propTypes = {
  children: PropTypes.node,
};

Navbar.defaultProps = {
  children: null,
};

export default Navbar;
