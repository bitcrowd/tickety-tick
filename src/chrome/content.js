/* global chrome, window, top */

import { findOpenTickets } from '../common/content';

const runtime = chrome.runtime;

if (window === top) {
  runtime.onMessage.addListener((req, sender, respond) => {
    if (req.tickets) {
      const tickets = findOpenTickets();
      respond(tickets);
    }
  });
}
