import React from "react";

import ErrorDetails from "./error-details";
import ExternalLink from "./external-link";

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
      <h6>Did you select or open any tickets?</h6>
      <p>
        Tickety-Tick currently supports
        <br />
        GitHub, GitLab, Jira, Trello, Notion and Tara.
      </p>
      <h6>Missing anything or found a bug?</h6>
      <p className="pb-1">
        <IssueLink />
      </p>
    </>
  );
}

export type ReportProps = { errors: Error[] };

function Report({ errors }: ReportProps) {
  return (
    <>
      <h5 className="mt-3 mb-3">Houston, we have a problem.</h5>
      <p>
        Tickety-Tick encountered{" "}
        <strong>
          {errors.length === 1 ? "an error" : `${errors.length} errors`}
        </strong>
        <br />
        while scanning for tickets.
      </p>
      <p>
        <ErrorDetails errors={errors} />
      </p>
      <p>
        <IssueLink />
      </p>
    </>
  );
}

export type Props = { errors: Error[] };

function NoTickets({ errors }: Props) {
  return (
    <div className="text-center">
      {errors.length > 0 ? <Report errors={errors} /> : <Hint />}
    </div>
  );
}

export { Hint, Report };
export default NoTickets;
