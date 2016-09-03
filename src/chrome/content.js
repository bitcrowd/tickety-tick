/* global chrome, window, top, document */

import defsearch from '../common/search';

const runtime = chrome.runtime;

if (window === top) {
  runtime.onMessage.addListener((req, sender, respond) => {
    if (req.tickets) {
      defsearch(document, (tickets) => {
        respond(tickets);
      });
    }
  });
}
