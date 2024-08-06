/**
 * Clickup adapter
 *
 * The adapter extracts ticket information from the page title.
 * Not that clickup doesn't seem to have proper ticket types,
 * so for not it will always return task.
 */

import { match } from "micro-match";

import type { TicketData } from "../types";
import { $text } from "./dom-helpers";

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (url.hostname !== "app.clickup.com") return [];

  const { id } = match("/t/:id", url.pathname);

  if (!id) return [];

  const pageTitle = $text("title", document);

  if (!pageTitle) return [];

  const title = pageTitle.split("|")[0].trim();

  const ticket = {
    id,
    url: url.toString(),
    title,
    type: "task",
  } as TicketData;

  return [ticket];
}

export default scan;
