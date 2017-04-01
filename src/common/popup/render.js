/* eslint-env browser */
/* global Elm */

function render(tickets, { grab, openext }) {
  const node = document.getElementById('popup-root');
  const app = Elm.App.embed(node);

  app.ports.grab.subscribe(grab);
  app.ports.openext.subscribe(openext);

  // For some reason, `tickets` is not `instanceof Array`,
  // which causes Elm not to recognize it as a valid `List` input.
  const list = Array.of.apply(null, tickets);

  app.ports.load.send(list || []);
}

export default render;
