import './index.scss';

import browser from 'webextension-polyfill';

import enhance from '../core/enhance';
import store from '../store';
import render from './render';

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

function openext() {
  return true;
}

async function load() {
  const { tickets, errors } = await background.getTickets();
  const { options = {}, templates } = await store.get(null);

  const enhancer = enhance(templates, options.autofmt);

  render(tickets.map(enhancer), errors, { close, openext, pbcopy });
}

window.onload = load;
