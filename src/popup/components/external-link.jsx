import PropTypes from 'prop-types';
import React from 'react';

function ExternalLink(props) {
  const { children, href, ...other } = props;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...other}>
      {children}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default ExternalLink;
