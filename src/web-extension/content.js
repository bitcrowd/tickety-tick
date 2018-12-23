/* global chrome */

import stdsearch from '../common/search';

const { runtime } = chrome;

if (window === window.top) {
  runtime.onMessage.addListener((req) => {
    if (req.tickets) {
      return stdsearch(window.location, document);
    }

    return false;
  });
}
