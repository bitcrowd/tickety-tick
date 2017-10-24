import React from 'react';
import PropTypes from 'prop-types';

function ExternalLink(props, context) {
  const handler = (props.href && context.openext)
    ? () => context.openext(props.href)
    : () => true;

  const { children, href, ...other } = props;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handler}
      onKeyDown={handler}
      {...other}
    >
      {children}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

ExternalLink.contextTypes = {
  openext: PropTypes.func,
};

export default ExternalLink;
