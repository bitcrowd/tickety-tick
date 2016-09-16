/* eslint-env browser, jquery */
/* global safari */

import stdsearch from '../common/search';

window.$$$ = $.noConflict(true);

function onMessage(event) {
  if (window.top === window) {
    if (event.name === 'get-tickets') {
      stdsearch(location, document, (tickets) => {
        safari.self.tab.dispatchMessage('tickets', tickets);
      });
    }
  }
}

safari.self.addEventListener('message', onMessage, false);
