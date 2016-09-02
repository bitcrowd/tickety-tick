/* globals safari, window */

import { findOpenTickets } from '../common/content';

function onMessage(event) {
  if (window.top === window) {
    if (event.name === 'get-tickets') {
      const respond = () => {
        const tickets = findOpenTickets();
        safari.self.tab.dispatchMessage('tickets', tickets);
      };

      const delay = 10;

      setTimeout(respond, delay);
    }
  }
}

safari.self.addEventListener('message', onMessage, false);
