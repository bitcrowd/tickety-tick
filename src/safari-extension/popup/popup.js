/* global safari */

import render from '../../common/popup/render';
import enhance from '../../common/enhance';
import '../../common/popup/popup.scss';

const app = safari.application;
const { settings } = safari.extension;

function pbcopy(text) {
  prompt('Here you go:', text); // eslint-disable-line no-alert
}

function close() {
  safari.self.hide();
}

function grab(text) {
  pbcopy(text);
  close();
}

function openext(url) {
  app.activeBrowserWindow.openTab().url = url;
  setTimeout(close, 100);
  return false;
}

function load() {
  const page = app.activeBrowserWindow && app.activeBrowserWindow.activeTab.page;
  if (page) page.dispatchMessage('get-tickets');
}

function onPopover(event) {
  if (event.target.identifier !== 'tickety-tick.popup') return;
  // TODO: check why dispatching 'get-tickets' again does not work, remove reload?
  window.location.reload();
}

function onMessage(event) {
  if (event.name === 'tickets') {
    const templates = {
      commit: settings.commitMessageFormat,
      branch: settings.branchNameFormat,
      command: settings.commandFormat,
    };

    const tickets = event.message
      ? event.message.map(enhance(templates))
      : null;

    render(tickets, { grab, openext });
  }
}

app.addEventListener('message', onMessage, false);
app.addEventListener('popover', onPopover, true);

window.onload = load;
