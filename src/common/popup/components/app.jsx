import React from 'react';

function App(props) {
  return (props.children);
}

App.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default App;
