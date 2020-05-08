import browser from 'webextension-polyfill';

import stdsearch from '../core/search';

if (window === window.top) {
  browser.runtime.onMessage.addListener((req) => {
    if (req.tickets) {
      return stdsearch(window.location, document);
    }

    return false;
  });
}
