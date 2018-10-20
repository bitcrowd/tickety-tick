import React from 'react';
import PropTypes from 'prop-types';

import EnvContext from '../env-context';

function ExternalLink(props) {
  const { children, href, ...other } = props;

  return (
    <EnvContext.Consumer>
      {
        ({ openext }) => {
          const handler = () => openext(href);

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
      }
    </EnvContext.Consumer>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default ExternalLink;
