/* global chrome */

import stdsearch from '../common/search';

const { runtime } = chrome;

if (window === window.top) {
  runtime.onMessage.addListener((req, sender, respond) => {
    if (req.tickets) {
      // TODO: Figure out why the respond callback does not work when invoked asynchronously.
      //
      // In particular, when invoked from a resolved promise callback (`then`)
      // or with a 0 timeout (`setTimeout`), respond does not do anything.
      //
      // Debugging into the callback internals shows that the `port` for communicating with
      // between the background page and the content script is `null`.
      //
      stdsearch(window.location, document).then(respond);
    }
  });
}
