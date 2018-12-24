import browser from 'webextension-polyfill';

import render from '../../common/popup/render';
import enhance from '../../common/enhance';
import '../../common/popup/popup.scss';

import store from '../store';

const background = browser.extension.getBackgroundPage();

function pbcopy(text) {
  const input = document.createElement('textarea');
  input.textContent = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

function close() {
  window.close();
}

function grab(text) {
  pbcopy(text);
  close();
}

function openext() {
  return true;
}

async function load() {
  const { templates } = await store.get(null);
  const tickets = await background.getTickets();

  const result = tickets
    ? tickets.map(enhance(templates))
    : null;

  render(result, { grab, openext });
}

window.onload = load;
