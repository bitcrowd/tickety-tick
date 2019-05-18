import React from 'react';
import PropTypes from 'prop-types';

import ExternalLink from './external-link';

import ErrorShape from '../utils/error-shape';

function IssueLink() {
  return (
    <ExternalLink href="https://github.com/bitcrowd/tickety-tick/issues">
      Report an issue
    </ExternalLink>
  );
}

function Hint() {
  return (
    <>
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
        <IssueLink />
      </p>
    </>
  );
}

function Report({ errors }) {
  return (
    <>
      <h5 className="mt-3 mb-3">Houston, we have a problem.</h5>
      <p>
        Tickety-Tick encountered
        {' '}
        <strong>
          {errors.length}
          {' '}
          {errors.length === 1 ? 'error' : 'errors'}
        </strong>
        <br />
        while scanning for tickets.
      </p>
      <p className="pb-1">
        <IssueLink />
      </p>
    </>
  );
}

Report.propTypes = {
  errors: PropTypes.arrayOf(ErrorShape).isRequired,
};

function NoTickets({ errors }) {
  return (
    <div className="text-center">
      {errors.length > 0 ? <Report errors={errors} /> : <Hint />}
    </div>
  );
}

NoTickets.propTypes = {
  errors: PropTypes.arrayOf(ErrorShape).isRequired,
};

export { Hint, Report };
export default NoTickets;
