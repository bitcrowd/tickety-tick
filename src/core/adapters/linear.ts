/**
 * Linear adapter
 *
 * The adapter extracts ticket information from the markup. Note that linear
 * obfuscates classes, so the DOM selectors are probably not reliable (for one,
 * they are locale dependent, but at this time Linear is only available in
 * English).
 *
 */

import { match } from "micro-match";

import type { TicketData } from "../types";
import { $text } from "./dom-helpers";

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (url.hostname !== "linear.app") return [];

  const { id, issueType } = match("/:team/:issueType/:id/:slug", url.pathname);
  const pageTitle = $text("title", document);
  const title = pageTitle && pageTitle.substring(id.length + 1);

  if (!id) return [];

  const ticket = {
    id,
    url: url.toString(),
    title,
    type: issueType,
  } as TicketData;

  return [ticket];
}

export default scan;
