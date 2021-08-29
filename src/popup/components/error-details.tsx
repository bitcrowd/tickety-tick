import React, { Component } from "react";
import type { StackFrame } from "stacktrace-js";
import StackTrace from "stacktrace-js";

import CopyButton from "./copy-button";

function framefmt(stackframe: StackFrame) {
  const name = stackframe.getFunctionName() || "<anonymous>";
  const file = stackframe.getFileName() || "-";
  const line = stackframe.getLineNumber() || "-";
  const column = stackframe.getColumnNumber() || "-";
  return `    at ${name} (${file}:${line}:${column})`;
}

async function trace(error: Error) {
  const stackframes = await StackTrace.fromError(error); // parse and enhance with source maps
  return [error.message, ...stackframes.map(framefmt)].join("\n");
}

export type Props = {
  errors: Error[];
};

type State = {
  traces: string[] | null;
};

class ErrorDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      traces: null,
    };
  }

  componentDidMount() {
    const { errors } = this.props;

    Promise.all(errors.map(trace))
      .then((traces) => this.setState({ traces }))
      .catch((err) => console.error(err)); // eslint-disable-line no-console
  }

  render() {
    const { traces } = this.state;

    if (!traces) return null;

    const preamble = `Tickety-Tick revision: ${COMMITHASH}`;
    const logs = traces.map((tr) => ["```", tr, "```"].join("\n"));

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
}

export default ErrorDetails;
