/* eslint-env browser, jquery */
/* global chrome */

import stdsearch from '../common/search';

window.$$$ = $.noConflict(true);

const runtime = chrome.runtime;

if (window === top) {
  runtime.onMessage.addListener((req, sender, respond) => {
    if (req.tickets) {
      stdsearch(location, document, respond);
    }
  });
}
