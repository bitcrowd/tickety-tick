import React from 'react';

class EnvProvider extends React.Component {
  getChildContext() {
    const { openext, grab } = this.props;
    return { openext, grab };
  }

  render() {
    return (this.props.children);
  }
}

EnvProvider.propTypes = {
  openext: React.PropTypes.func.isRequired,
  grab: React.PropTypes.func.isRequired,
  children: React.PropTypes.element
};

EnvProvider.childContextTypes = {
  openext: React.PropTypes.func.isRequired,
  grab: React.PropTypes.func.isRequired
};

export default EnvProvider;
