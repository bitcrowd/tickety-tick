/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, createMemoryHistory } from 'react-router';

import EnvProvider from '../../common/popup/components/env-provider';
import App from '../../common/popup/components/app';
import About from '../../common/popup/components/about';
import Tool from '../../common/popup/components/tool';

function propped(Component, defaults) {
  const ProppedComponent = (more) => {
    const props = Object.assign({}, defaults, more);
    return (<Component {...props} />);
  };

  return ProppedComponent;
}

function render(tickets, env) {
  const root = document.getElementById('popup-root');
  const history = createMemoryHistory();

  const component = (
    <EnvProvider {...env}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={propped(Tool, { tickets })} />
          <Route path="about" component={About} />
        </Route>
      </Router>
    </EnvProvider>
  );

  ReactDOM.render(component, root);
}

export { propped };
export default render;
