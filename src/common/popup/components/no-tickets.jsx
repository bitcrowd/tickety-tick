import React from 'react';

import ExternalLink from './external-link';

const href = 'https://github.com/bitcrowd/tickety-tick/issues';

function NoTickets() {
  return (
    <div className="text-center">
      <h5 className="mt-3 mb-3">No tickets found on this page.</h5>
      <h6>
        Did you select or open any tickets?
      </h6>
      <p>
        Tickety-Tick currently supports
        <br />
        GitHub, GitLab, Jira, Pivotal, Trello, and Ora.
      </p>
      <h6>
        Missing anything or found a bug?
      </h6>
      <p className="pb-1">
        <ExternalLink href={href}>Report an issue</ExternalLink>
      </p>
    </div>
  );
}

NoTickets.propTypes = {};

export default NoTickets;
