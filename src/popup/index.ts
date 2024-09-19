import "./index.scss";

import browser from "webextension-polyfill";

import enhance from "../core/enhance";
import { deserialize } from "../errors";
import store from "../store";
import onmedia from "./observe-media";
import render from "./render";

async function load() {
  const { tickets, errors } = await browser.runtime.sendMessage({
    getTickets: true,
  });
  const { options = {}, templates } = await store.get(null);

  const enhancer = await enhance(templates, options.autofmt);

  render(await Promise.all(tickets.map(enhancer)), errors.map(deserialize));
}

window.onload = load;

onmedia("(prefers-color-scheme: dark)", (matches) => {
  const { classList } = document.documentElement;

  if (matches) {
    classList.add("dark");
  } else {
    classList.remove("dark");
  }
});
