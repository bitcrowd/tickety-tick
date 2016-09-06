/* eslint-env browser */
/* globals safari */

import stdsearch from '../common/search';

function onMessage(event) {
  if (window.top === window) {
    if (event.name === 'get-tickets') {
      stdsearch(document, (tickets) => {
        safari.self.tab.dispatchMessage('tickets', tickets);
      });
    }
  }
}

safari.self.addEventListener('message', onMessage, false);
