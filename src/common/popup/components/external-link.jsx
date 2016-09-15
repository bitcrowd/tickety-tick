import React from 'react';

function ExternalLink(props, context) {
  const handler = (props.href && context.openext)
    ? () => context.openext(props.href)
    : () => true;

  return (<a {...props} target="_blank" rel="noopener noreferrer" onClick={handler} />);
}

ExternalLink.propTypes = {
  href: React.PropTypes.string.isRequired
};

ExternalLink.contextTypes = {
  openext: React.PropTypes.func
};

export default ExternalLink;
