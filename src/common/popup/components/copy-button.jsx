import PropTypes from 'prop-types';
import React, { useCallback, useContext } from 'react';

import EnvContext from '../env-context';

function CopyButton({ value, ...rest }) {
  const { grab } = useContext(EnvContext);
  const handler = useCallback(() => grab(value), [grab, value]);
  return <button type="button" {...rest} onClick={handler} />;
}

CopyButton.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CopyButton;
