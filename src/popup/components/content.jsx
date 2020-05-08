import PropTypes from 'prop-types';
import React from 'react';

function Content({ children }) {
  return <div className="container-fluid py-3">{children}</div>;
}

Content.propTypes = {
  children: PropTypes.node,
};

Content.defaultProps = {
  children: null,
};

export default Content;
