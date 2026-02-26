/**
 * OpenProject adapter
 *
 * The adapter extracts ticket information from the markup.
 */

import type { TicketData } from "../types";
import { $has, $text } from "./dom-helpers";
import { hasRequiredDetails } from "./utils";

const typeFieldSelector =
  "op-editable-attribute-field [data-field-name='type']";
const titleFieldSelector =
  'op-editable-attribute-field [data-field-name="subject"]';

async function scan(url: URL, document: Document): Promise<TicketData[]> {
  if (!$has("op-wp-split-view", document) && !$has("op-wp-full-view", document))
    return [];

  const id = $text("title", document)?.match(/#(\d+)/)?.[1];
  const type = $text(typeFieldSelector, document)?.toLowerCase() || "feature";
  const title = $text(titleFieldSelector, document)?.trim();
  const ticketURL = new URL(`wp/${id}`, url.origin).toString();

  const tickets = [{ id, title, type, url: ticketURL.toString() }];

  return tickets.filter(hasRequiredDetails) as TicketData[];
}

export default scan;
