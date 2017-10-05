/* eslint-env browser */
/* global Elm */

import format from '../format';

function fmt(ticket) {
  return {
    commit: format.commit(ticket),
    branch: format.branch(ticket),
    cmd: format.command(ticket)
  };
}

function enhance(ticket) {
  return Object.assign({}, ticket, { fmt: fmt(ticket) });
}

function render(tickets, { grab, openext }) {
  const node = document.getElementById('popup-root');
  const app = Elm.App.embed(node);

  app.ports.grab.subscribe(grab);
  app.ports.openext.subscribe(openext);

  // For some reason, `tickets` is not `instanceof Array`,
  // which causes Elm not to recognize it as a valid `List` input.
  // Potentially because it's from a content/background script?
  const list = Array.of.apply(null, tickets);

  app.ports.load.send(list.map(enhance) || []);
}

export default render;
