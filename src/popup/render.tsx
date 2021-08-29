import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter as Router, Route, Switch } from "react-router";

import type { TicketWithFmt } from "../types";
import About from "./components/about";
import Tool from "./components/tool";

function propped<P>(Component: React.ComponentType<P>, defaults: P) {
  const ProppedComponent = (more: Partial<P>) => {
    const props = { ...defaults, ...more };
    return <Component {...props} />;
  };

  return ProppedComponent;
}

function render(tickets: TicketWithFmt[], errors: Error[]) {
  const root = document.getElementById("popup-root");

  const element = (
    <Router>
      <Switch>
        <Route exact path="/" component={propped(Tool, { tickets, errors })} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );

  ReactDOM.render(element, root);
}

export { propped };
export default render;
