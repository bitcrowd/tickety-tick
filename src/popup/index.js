import './index.scss';
import './index-dark.scss';

import browser from 'webextension-polyfill';

import enhance from '../core/enhance';
import store from '../store';
import onmedia from './observe-media';
import render from './render';

async function load() {
  const background = browser.extension.getBackgroundPage();
  const { tickets, errors } = await background.getTickets();
  const { options = {}, templates } = await store.get(null);

  const enhancer = enhance(templates, options.autofmt);

  render(tickets.map(enhancer), errors);
}

window.onload = load;

onmedia('(prefers-color-scheme: dark)', (matches) => {
  const { classList } = document.documentElement;

  if (matches) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
});
