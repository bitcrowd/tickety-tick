/* global safari */

import stdsearch from '../common/search';

function onMessage(event) {
  if (window.top === window) {
    if (event.name === 'get-tickets') {
      stdsearch(window.location, document).then((results) => {
        safari.self.tab.dispatchMessage('tickets', results);
      });
    }
  }
}

safari.self.addEventListener('message', onMessage, false);
