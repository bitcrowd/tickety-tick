import type { Options } from "ky";
import ky from "ky";

const credentials = "include";

const headers = {
  "content-type": "application/json; charset=utf-8",
  accept: "application/json",
};

const timeout = 1000;

function client(base: string, options: Partial<Options> = {}) {
  return ky.extend({
    prefixUrl: base,
    credentials,
    headers,
    timeout,
    ...options,
  });
}

export default client;
