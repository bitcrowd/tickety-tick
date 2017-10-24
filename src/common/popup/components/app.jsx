import PropTypes from 'prop-types';

function App(props) {
  return (props.children);
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
