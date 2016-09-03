/* globals safari, window, document */

import defsearch from '../common/search';

function onMessage(event) {
  if (window.top === window) {
    if (event.name === 'get-tickets') {
      const respond = () => {
        defsearch(document, (tickets) => {
          safari.self.tab.dispatchMessage('tickets', tickets);
        });
      };

      const delay = 10;

      setTimeout(respond, delay);
    }
  }
}

safari.self.addEventListener('message', onMessage, false);
