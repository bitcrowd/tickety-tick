import React from 'react';

function CopyButton(props, context) {
  const handler = () => context.grab(props.value);
  return (<button {...props} onClick={handler} />);
}

CopyButton.propTypes = {
  value: React.PropTypes.string.isRequired
};

CopyButton.contextTypes = {
  grab: React.PropTypes.func
};

export default CopyButton;
