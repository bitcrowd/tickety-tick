import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Route } from 'react-router';

import About from './components/about';
import Tool from './components/tool';

function propped(Component, defaults) {
  const ProppedComponent = (more) => {
    const props = { ...defaults, ...more };
    return <Component {...props} />;
  };

  return ProppedComponent;
}

function render(tickets, errors) {
  const root = document.getElementById('popup-root');

  const element = (
    <Router>
      <Route exact path="/" component={propped(Tool, { tickets, errors })} />
      <Route path="/about" component={About} />
    </Router>
  );

  ReactDOM.render(element, root);
}

export { propped };
export default render;
