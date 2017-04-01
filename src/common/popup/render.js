/* eslint-env browser */
/* global Elm */

function render(tickets, { grab, openext }) {
  const node = document.getElementById('popup-root');
  const app = Elm.App.embed(node, { tickets });

  app.ports.grab.subscribe(grab);
  app.ports.openext.subscribe(openext);
}

export default render;
