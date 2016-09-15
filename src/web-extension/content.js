/* eslint-env browser */
/* global chrome */

import stdsearch from '../common/search';

const runtime = chrome.runtime;

if (window === top) {
  runtime.onMessage.addListener((req, sender, respond) => {
    if (req.tickets) {
      stdsearch(location, document, respond);
    }
  });
}
