/* eslint-env browser */
/* global Elm */

function render(tickets /* , env */) {
  const node = document.getElementById('popup-root');
  Elm.App.embed(node, { tickets }); // , env });
}

export default render;
