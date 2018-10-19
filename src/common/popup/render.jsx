/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Route } from 'react-router';

import EnvProvider from './components/env-provider';
import App from './components/app';
import About from './components/about';
import Tool from './components/tool';

function propped(Component, defaults) {
  const ProppedComponent = (more) => {
    const props = Object.assign({}, defaults, more);
    return (<Component {...props} />);
  };

  return ProppedComponent;
}

function render(tickets, env) {
  const root = document.getElementById('popup-root');

  const element = (
    <EnvProvider {...env}>
      <Router>
        <App>
          <Route exact path="/" component={propped(Tool, { tickets })} />
          <Route path="/about" component={About} />
        </App>
      </Router>
    </EnvProvider>
  );

  ReactDOM.render(element, root);
}

export { propped };
export default render;
