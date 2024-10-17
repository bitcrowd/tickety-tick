import "../polyfills";

import browser from "webextension-polyfill";

import stdsearch from "../core/search";
import type { ContentMessage } from "../types";

if (window === window.top) {
  browser.runtime.onMessage.addListener((message: unknown) => {
    if ((message as ContentMessage).tickets) {
      const url = new URL(window.location.toString());
      return stdsearch(url, document);
    }

    return undefined;
  });
}
