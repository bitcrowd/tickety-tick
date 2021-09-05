import type { Icon } from "@primer/octicons-react";
import {
  CommentIcon,
  GitBranchIcon,
  TerminalIcon,
} from "@primer/octicons-react";
import React, { Component } from "react";

import format, { defaults, helpers } from "../../core/format";
import CheckboxInput from "./checkbox-input";
import * as example from "./example";
import type { Props as TemplateInputProps } from "./template-input";
import TemplateInput from "./template-input";

const recommendation =
  "https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html";

function InputIcon({ icon: IconComponent }: { icon: Icon }) {
  return <IconComponent size={16} verticalAlign="text-top" />;
}

export type Props = {
  store: {
    get: (_: null) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    set: (_: Record<string, any>) => Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};

type State = {
  loading: boolean;
  autofmt: boolean;
  branch: string;
  commit: string;
  command: string;
};

class Form extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      autofmt: true,
      branch: "",
      commit: "",
      command: "",
    };

    this.handleLoaded = this.handleLoaded.bind(this);
    this.handleChanged = this.handleChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaved = this.handleSaved.bind(this);
  }

  componentDidMount() {
    const { store } = this.props;
    store.get(null).then(this.handleLoaded);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleLoaded(data: any) {
    const { options, templates } = data ?? {};
    this.setState(() => ({
      loading: false,
      ...options,
      ...templates,
    }));
  }

  handleChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, value, checked } = event.target;

    this.setState((state) => ({
      ...state,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const { store } = this.props;

    const { autofmt, branch, commit, command } = this.state;

    const options = { autofmt };
    const templates = { branch, commit, command };

    this.setState({ loading: true }, () => {
      store.set({ templates, options }).then(this.handleSaved);
    });
  }

  handleSaved() {
    this.setState(() => ({ loading: false }));
  }

  render() {
    const { loading, autofmt, ...templates } = this.state;

    // Use default for preview if template is blank
    const config = {
      branch: templates.branch || defaults.branch,
      commit: templates.commit || defaults.commit,
      command: templates.command || defaults.command,
    };

    // Create a formatter for rendering previews
    const fmt = format(config, autofmt);

    const fields = [
      {
        icon: <InputIcon icon={CommentIcon} />,
        label: "Commit Message Format",
        id: "commit-message-format",
        name: "commit",
        value: templates.commit,
        fallback: defaults.commit,
        preview: fmt.commit(example),
        multiline: true,
      },
      {
        icon: <InputIcon icon={GitBranchIcon} />,
        label: "Branch Name Format",
        id: "branch-name-format",
        name: "branch",
        value: templates.branch,
        fallback: defaults.branch,
        preview: fmt.branch(example),
      },
      {
        icon: <InputIcon icon={TerminalIcon} />,
        label: "Command Format",
        id: "command-format",
        name: "command",
        value: templates.command,
        fallback: defaults.command,
        preview: fmt.command(example),
      },
    ];

    const input = (
      props: Omit<TemplateInputProps, "disabled" | "onChange">
    ) => (
      <React.Fragment key={props.id}>
        <h3 className="h5 mt-4 pt-2 pb-1">{props.label}</h3>
        <TemplateInput
          disabled={loading}
          onChange={this.handleChanged}
          {...props}
        />
      </React.Fragment>
    );

    return (
      <form onSubmit={this.handleSubmit} className="mw-100 px-2 py-3">
        <div className="mt-4">
          <CheckboxInput
            id="auto-format-commits"
            name="autofmt"
            checked={autofmt}
            disabled={loading}
            label={
              <>
                Auto-format commit message – as per{" "}
                <a
                  href={recommendation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  recommendation
                </a>
              </>
            }
            onChange={this.handleChanged}
          />
        </div>

        {fields.map(input)}

        <hr />

        <div className="container-fluid px-0">
          <div className="row no-gutters">
            <div className="col small">
              Template variables:
              <ul className="list-unstyled text-muted">
                {Object.keys(example)
                  .sort()
                  .map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                <li>branch (only in command)</li>
                <li>commit (only in command)</li>
              </ul>
            </div>

            <div className="col small">
              Available Helpers:
              <ul className="list-unstyled text-muted">
                {Object.keys(helpers)
                  .sort()
                  .map((name) => {
                    const helper = helpers[name as keyof typeof helpers];
                    return (
                      <li key={name}>
                        {"description" in helper ? helper.description : name}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <button
            className="btn btn-outline-primary"
            type="submit"
            disabled={loading}
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default Form;
