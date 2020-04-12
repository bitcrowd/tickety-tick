import PropTypes from 'prop-types';
import React from 'react';

import EnvContext from '../env-context';

function CopyButton(props) {
  return (
    <EnvContext.Consumer>
      {({ grab }) => {
        const handler = () => grab(props.value);
        return <button type="button" onClick={handler} {...props} />;
      }}
    </EnvContext.Consumer>
  );
}

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CopyButton;
