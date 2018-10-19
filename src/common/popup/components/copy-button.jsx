import React from 'react';
import PropTypes from 'prop-types';

function CopyButton(props, context) {
  const handler = () => context.grab(props.value);
  return (<button type="button" {...props} onClick={handler} />);
}

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
};

CopyButton.contextTypes = {
  grab: PropTypes.func.isRequired,
};

export default CopyButton;
