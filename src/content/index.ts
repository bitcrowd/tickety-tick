import browser from "webextension-polyfill";

import stdsearch from "../core/search";

if (window === window.top) {
  browser.runtime.onMessage.addListener((msg) => {
    if (msg.tickets) {
      const url = new URL(window.location.toString());
      return stdsearch(url, document);
    }

    return undefined;
  });
}
