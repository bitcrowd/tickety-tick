/* global chrome */

import stdsearch from '../common/search';

const { runtime } = chrome;

if (window === window.top) {
  runtime.onMessage.addListener((req, sender, respond) => {
    if (req.tickets) {
      stdsearch(window.location, document).then(respond);
      return true;
    }

    return false;
  });
}
