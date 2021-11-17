import React from "react";

import CopyButton from "./copy-button";

export type Props = {
  errors: Error[];
};

function ErrorDetails({ errors }: Props) {
  const preamble = `Tickety-Tick revision: ${COMMITHASH}`;

  const logs = errors.map((err) =>
    ["```", err, err.stack?.trim(), "```"].join("\n")
  );

  const info = [preamble, ...logs].join("\n\n");

  return (
    <CopyButton
      className="btn btn-primary"
      title="Copy error details to help identify the issue"
      value={info}
    >
      Copy error details
    </CopyButton>
  );
}

export default ErrorDetails;
