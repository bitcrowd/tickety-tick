import React from 'react';

import ExternalLink from './external-link';

const href = 'https://github.com/bitcrowd/tickety-tick/issues';

function NoTickets() {
  return (
    <div className="container no-tickets">
      <h2 className="no-tickets-heading">No tickets found on this page.</h2>
      <p>
        Did you select or open any tickets?
      </p>
      <p>
        Tickety-Tick currently supports GitHub, Jira, Pivotal and Trello.
      </p>
      <p>
        Missing anything or think you found a bug?
      </p>
      <p>
        <ExternalLink className="issues-link" href={href}>Report an issue</ExternalLink>
      </p>
    </div>
  );
}

NoTickets.propTypes = {};

export default NoTickets;
