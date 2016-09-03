/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';

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

function render(tickets, { grab, openext }) {
  const root = document.getElementById('popup-root');

  const component = (
    <EnvProvider openext={openext} grab={grab}>
      <Router>
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
