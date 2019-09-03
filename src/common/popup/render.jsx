import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Route } from 'react-router';

import EnvContext from './env-context';

import About from './components/about';
import Tool from './components/tool';

function propped(Component, defaults) {
  const ProppedComponent = (more) => {
    const props = { ...defaults, ...more };
    return (<Component {...props} />);
  };

  return ProppedComponent;
}

function render(tickets, errors, env) {
  const root = document.getElementById('popup-root');

  const element = (
    <EnvContext.Provider value={env}>
      <Router>
        <Route exact path="/" component={propped(Tool, { tickets, errors })} />
        <Route path="/about" component={About} />
      </Router>
    </EnvContext.Provider>
  );

  ReactDOM.render(element, root);
}

export { propped };
export default render;
