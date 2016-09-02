/* globals safari */

import { updateTickets } from '../../common/popup/popup';

const app = safari.application;

function onMessage(event) {
  if (event.name === 'tickets') {
    updateTickets(event.message);
  }
}

function onPopover(/* event */) {
  const page = app.activeBrowserWindow.activeTab.page;
  page.dispatchMessage('get-tickets');
}

app.addEventListener('message', onMessage, false);
app.addEventListener('popover', onPopover, true);

app.activeBrowserWindow.activeTab.page.dispatchMessage('get-tickets');
