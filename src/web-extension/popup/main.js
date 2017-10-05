/* eslint-env browser */
/* global chrome */

import render from '../../common/popup/render';

const extension = chrome.extension;
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

function openext(url) {
  window.open(url, '_blank');
}

function load() {
  background.getTickets((tickets) => {
    render(tickets, { grab, openext });
  });
}

window.onload = load;
