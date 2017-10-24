import React from 'react';
import PropTypes from 'prop-types';

function ExternalLink(props, context) {
  const handler = (props.href && context.openext)
    ? () => context.openext(props.href)
    : () => true;

  /* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/no-static-element-interactions */
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      onClick={handler}
      onKeyDown={handler}
      {...props}
    />
  );
  /* eslint-enable jsx-a11y/anchor-has-content, jsx-a11y/no-static-element-interactions */
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
};

ExternalLink.contextTypes = {
  openext: PropTypes.func,
};

export default ExternalLink;
