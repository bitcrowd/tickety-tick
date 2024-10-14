import "./index.scss";

import type { ErrorObject } from "serialize-error";
import browser from "webextension-polyfill";

import enhance from "../core/enhance";
import type { Options, Templates } from "../core/format/types";
import { deserialize } from "../errors";
import store from "../store";
import type { Ticket } from "../types";
import onmedia from "./observe-media";
import render from "./render";

async function getTickets(): Promise<{
  tickets: Ticket[];
  errors: ErrorObject[];
}> {
  return browser.runtime.sendMessage({
    getTickets: true,
  }) as Promise<{ tickets: Ticket[]; errors: ErrorObject[] }>;
}

async function getConfig() {
  return store.get(null) as Promise<{ templates: Templates; options: Options }>;
}

async function load() {
  const { tickets, errors } = await getTickets();
  const { options, templates } = await getConfig();

  const enhancer = await enhance(templates, options?.autofmt);

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
