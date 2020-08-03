import React from 'react';
import { ReactSVG } from 'react-svg';

import src from '../../icons/icon.svg';

function Logo({ ...props }) {
  return <ReactSVG {...props} src={src} />;
}

Logo.propTypes = {};

export default Logo;
