import {
  CommentIcon,
  GitBranchIcon,
  TerminalIcon,
} from '@primer/octicons-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import format, {
  helpers,
  templateDefaults as fallbacks,
} from 'tickety-tick-formatter';

import CheckboxInput from './checkbox-input';
import * as example from './example';
import TemplateInput from './template-input';

const recommendation =
  'https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html';

function InputIcon({ icon: IconComponent }) {
  return <IconComponent size={16} verticalAlign="text-top" />;
}

InputIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
};

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      autofmt: true,
      branch: '',
      commit: '',
      command: '',
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

  handleLoaded(data) {
    const { options, templates } = data || {};
    this.setState(() => ({
      loading: false,
      ...options,
      ...templates,
    }));
  }

  handleChanged(event) {
    const { name, type, value, checked } = event.target;

    this.setState({
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  handleSubmit(event) {
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
      branch: templates.branch || fallbacks.branch,
      commit: templates.commit || fallbacks.commit,
      command: templates.command || fallbacks.command,
    };

    // Create a formatter for rendering previews
    const fmt = format(config, autofmt);

    const fields = [
      {
        icon: <InputIcon icon={CommentIcon} />,
        label: 'Commit Message Format',
        id: 'commit-message-format',
        name: 'commit',
        value: templates.commit,
        fallback: fallbacks.commit,
        preview: fmt.commit(example),
        multiline: true,
      },
      {
        icon: <InputIcon icon={GitBranchIcon} />,
        label: 'Branch Name Format',
        id: 'branch-name-format',
        name: 'branch',
        value: templates.branch,
        fallback: fallbacks.branch,
        preview: fmt.branch(example),
      },
      {
        icon: <InputIcon icon={TerminalIcon} />,
        label: 'Command Format',
        id: 'command-format',
        name: 'command',
        value: templates.command,
        fallback: fallbacks.command,
        preview: fmt.command(example),
      },
    ];

    const input = (props) => (
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
          {/* eslint-disable prettier/prettier */}
          <CheckboxInput
            id="auto-format-commits"
            name="autofmt"
            checked={autofmt}
            disabled={loading}
            label={(
              <>
                Auto-format commit message – as per
                {' '}
                <a
                  href={recommendation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  recommendation
                </a>
              </>
            )}
            onChange={this.handleChanged}
          />
          {/* eslint-enable prettier/prettier */}
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
                    const { description } = helpers[name];
                    return <li key={name}>{description || name}</li>;
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

Form.propTypes = {
  store: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
  }).isRequired,
};

export default Form;
