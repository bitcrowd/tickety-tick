import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { defaults, helpers } from '../../../common/format';
import TemplateInput from './template-input';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
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
    store.get(null, this.handleLoaded);
  }

  handleLoaded(data) {
    const { templates } = data || {};
    this.setState(() => ({
      loading: false,
      ...templates,
    }));
  }

  handleChanged({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { store } = this.props;
    const { branch, commit, command } = this.state;
    const templates = { branch, commit, command };

    this.setState(() => ({ loading: true }), () => {
      store.set({ templates }, this.handleSaved);
    });
  }

  handleSaved() {
    this.setState(() => ({ loading: false }));
  }

  render() {
    const {
      branch,
      commit,
      command,
      loading,
    } = this.state;

    const fields = [
      {
        label: 'Commit Message Format',
        id: 'commit-message-format',
        name: 'commit',
        value: commit,
        fallback: defaults.commit,
      },
      {
        label: 'Branch Name Format',
        id: 'branch-name-format',
        name: 'branch',
        value: branch,
        fallback: defaults.branch,
      },
      {
        label: 'Command Format',
        id: 'command-format',
        name: 'command',
        value: command,
        fallback: defaults.command,
      },
    ];

    const input = props => (
      <TemplateInput
        key={props.id}
        disabled={loading}
        onChange={this.handleChanged}
        {...props}
      />
    );

    return (
      <form onSubmit={this.handleSubmit}>
        {fields.map(input)}

        <hr />

        <div className="small">
          Available Helpers:
          <ul className="list-unstyled text-muted">
            {Object.keys(helpers).sort().map(name => <li key={name}>{name}</li>)}
          </ul>
        </div>

        <div className="m-t-2">
          <button className="btn btn-outline-primary" type="submit" disabled={loading}>Save</button>
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
