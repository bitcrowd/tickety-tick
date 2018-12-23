/* global chrome */

import render from '../../common/popup/render';
import enhance from '../../common/enhance';
import '../../common/popup/popup.scss';

import store from '../store';

const { extension } = chrome;
const background = extension.getBackgroundPage();

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

function load() {
  store.get(null, ({ templates }) => {
    background.getTickets((tickets) => {
      const result = tickets
        ? tickets.map(enhance(templates))
        : null;

      render(result, { grab, openext });
    });
  });
}

window.onload = load;
