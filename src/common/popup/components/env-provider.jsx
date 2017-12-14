import { Component } from 'react';
import PropTypes from 'prop-types';

class EnvProvider extends Component {
  getChildContext() {
    const { openext, grab } = this.props;
    return { openext, grab };
  }

  render() {
    return (this.props.children);
  }
}

EnvProvider.propTypes = {
  openext: PropTypes.func.isRequired,
  grab: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

EnvProvider.childContextTypes = {
  openext: PropTypes.func.isRequired,
  grab: PropTypes.func.isRequired,
};

export default EnvProvider;
